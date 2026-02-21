import { v } from "convex/values";
import { query, mutation, internalMutation } from "./_generated/server";
import { internal, api } from "./_generated/api";


export const create = mutation({
  args: {
    userId: v.string(),
    deliveryFee: v.number(), // in Naira
    deliveryAddress: v.object({
      name: v.string(),
      street: v.string(),
      city: v.string(),
      state: v.string(),
      phone: v.string(),
    }),
  },
  handler: async (ctx, args) => {
    // 1. Get cart and items
    const cart = await ctx.db
      .query("carts")
      .withIndex("by_user", (q) => q.eq("userId", args.userId))
      .unique();

    if (!cart) throw new Error("No active cart found");

    const cartItems = await ctx.db
      .query("cartItems")
      .withIndex("by_cart", (q) => q.eq("cartId", cart._id))
      .collect();

    if (cartItems.length === 0) throw new Error("Cart is empty");

    // 2. Validate stock and calculate totals
    const reservedItems = [];
    let subtotal = 0;

    for (const item of cartItems) {
      const product = await ctx.db.get(item.productId);
      if (!product || !product.isActive) {
        throw new Error(`Product ${product?.name || "Unknown"} is no longer available`);
      }
      
      if (product.stock < item.quantity) {
        throw new Error(`Insufficient stock for ${product.name}. Available: ${product.stock}`);
      }
      
      subtotal += product.price * item.quantity;
      reservedItems.push({
        productId: product._id,
        quantity: item.quantity,
        name: product.name,
        price: product.price, // stored in Naira
      });
    }

    // 3. Reserve stock (Atomic per product in this mutation)
    for (const item of reservedItems) {
      const product = await ctx.db.get(item.productId);
      await ctx.db.patch(item.productId, {
        stock: product!.stock - item.quantity,
      });
    }

    const EXPIRE_MINUTES = 30;
    const totalInKobo = Math.round((subtotal + args.deliveryFee) * 100);
    const now = Date.now();
    const expiresAt = now + EXPIRE_MINUTES * 60 * 1000;

    // 4. Create the Order in "Pending" state
    const orderId = await ctx.db.insert("orders", {
      userId: args.userId,
      deliveryAddress: args.deliveryAddress,
      status: "Pending",
      paymentStatus: "Pending",
      totalAmount: totalInKobo,
      createdAt: now,
      expiresAt: expiresAt,
    });

    // 5. Snapshot items into orderItems (prevents price changes affecting existing orders)
    for (const item of reservedItems) {
      await ctx.db.insert("orderItems", {
        orderId,
        productId: item.productId,
        productName: item.name,
        productPrice: item.price * 100, // store snapshot in kobo
        quantity: item.quantity,
      });
    }

    // 6. Schedule expiration job
    await ctx.scheduler.runAfter(EXPIRE_MINUTES * 60 * 1000, internal.orders.expire, {
      orderId,
    });

    return orderId;
  },
});

/**
 * Internal mutation to handle order expiration.
 * Reverts stock if the order wasn't paid.
 */
export const expire = internalMutation({
  args: { orderId: v.id("orders") },
  handler: async (ctx, args) => {
    const order = await ctx.db.get(args.orderId);
    
    // Safety check: Only expire orders still in Pending state
    if (!order || order.status !== "Pending") {
      return;
    }

    // Update status to Expired
    await ctx.db.patch(args.orderId, {
      status: "Expired",
    });

    // Restore reserved stock
    const items = await ctx.db
      .query("orderItems")
      .withIndex("by_order", (q) => q.eq("orderId", args.orderId))
      .collect();

    for (const item of items) {
      const product = await ctx.db.get(item.productId);
      if (product) {
        await ctx.db.patch(item.productId, {
          stock: product.stock + item.quantity,
        });
      }
    }
    
    console.log(`Order ${args.orderId} expired and stock restored.`);
  },
});

/**
 * Confirms payment from Paystack API.
 * Finalizes the order and clears the cart.
 */
export const confirmPayment = mutation({
  args: {
    orderId: v.id("orders"),
    reference: v.string(),
    amount: v.number(), // from Paystack in kobo
  },
  handler: async (ctx, args) => {
    // 1. Idempotency Check: Have we processed this reference?
    const existingPayment = await ctx.db
      .query("payments")
      .withIndex("by_reference", (q) => q.eq("transactionReference", args.reference))
      .unique();

    if (existingPayment) return existingPayment.orderId;

    // 2. Load and validate Order
    const order = await ctx.db.get(args.orderId);
    if (!order) throw new Error("Order not found");

    // CRITICAL: Reject if order is no longer Pending (e.g., Expired or Cancelled)
    if (order.status !== "Pending") {
      throw new Error(`Order cannot be confirmed. Current status: ${order.status}`);
    }

    // 3. Financial Integrity: Verify amount
    if (order.totalAmount !== args.amount) {
      console.error(`Fraud/Error: Order ${order.totalAmount} vs Paid ${args.amount}`);
      throw new Error("Payment amount mismatch");
    }

    // 4. Update Order status
    await ctx.db.patch(args.orderId, {
      status: "Paid",
      paymentStatus: "Success",
      paymentId: args.reference,
    });

    // 5. Clear Cart (Atomic)
    const cart = await ctx.db
      .query("carts")
      .withIndex("by_user", (q) => q.eq("userId", order.userId))
      .unique();

    if (cart) {
      const cartItems = await ctx.db
        .query("cartItems")
        .withIndex("by_cart", (q) => q.eq("cartId", cart._id))
        .collect();
      
      for (const item of cartItems) {
        await ctx.db.delete(item._id);
      }
    }

    // 6. Record Payment record
    await ctx.db.insert("payments", {
      orderId: order._id,
      provider: "Paystack",
      transactionReference: args.reference,
      amount: args.amount,
      status: "Success",
      createdAt: Date.now(),
    });

    return order._id;
  },
});

export const getByUser = query({
  args: { userId: v.string() },
  handler: async (ctx, args) => {
    const orders = await ctx.db
      .query("orders")
      .withIndex("by_user", (q) => q.eq("userId", args.userId))
      .order("desc")
      .collect();

    const now = Date.now();
    const thirtyMinutesAgo = now - 30 * 60 * 1000;

    // Hide stale pending orders to keep user dashboard clean
    return orders.filter((order) => {
      if (order.status !== "Pending") return true;
      return order.createdAt > thirtyMinutesAgo;
    });
  },
});

export const getOrderDetails = query({
  args: { orderId: v.id("orders") },
  handler: async (ctx, args) => {
    const order = await ctx.db.get(args.orderId);
    if (!order) return null;

    const items = await ctx.db
      .query("orderItems")
      .withIndex("by_order", (q) => q.eq("orderId", args.orderId))
      .collect();

    return { ...order, items };
  },
});

export const getWithItems = query({
  args: { userId: v.string() },
  handler: async (ctx, args) => {
    const orders = await ctx.db
      .query("orders")
      .withIndex("by_user", (q) => q.eq("userId", args.userId))
      .order("desc")
      .collect();

    const now = Date.now();
    const thirtyMinutesAgo = now - 30 * 60 * 1000;

    const filteredOrders = orders.filter((order) => {
      if (order.status !== "Pending") return true;
      return order.createdAt > thirtyMinutesAgo;
    });

    const ordersWithItems = await Promise.all(
      filteredOrders.map(async (order) => {
        const items = await ctx.db
          .query("orderItems")
          .withIndex("by_order", (q) => q.eq("orderId", order._id))
          .collect();
        return { ...order, items };
      })
    );

    return ordersWithItems;
  },
});
