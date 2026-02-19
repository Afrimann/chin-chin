import { v } from "convex/values";
import { query, mutation } from "./_generated/server";

export const create = mutation({
  args: {
    userId: v.string(),
    deliveryAddress: v.object({
      name: v.string(),
      street: v.string(),
      city: v.string(),
      state: v.string(),
      phone: v.string(),
    }),
    totalAmount: v.number(),
  },
  handler: async (ctx, args) => {
    // 1. Get user's cart
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

    // 2. Create Order
    const orderId = await ctx.db.insert("orders", {
      userId: args.userId,
      deliveryAddress: args.deliveryAddress,
      status: "Pending",
      totalAmount: args.totalAmount,
      paymentStatus: "Pending",
      createdAt: Date.now(),
    });

    // 3. Create Order Items (Snapshot) & Update Stock
    for (const item of cartItems) {
      const product = await ctx.db.get(item.productId);
      if (!product) throw new Error(`Product not found: ${item.productId}`);

      // Check stock
      if (product.stock < item.quantity) {
        throw new Error(`Insufficient stock for ${product.name}`);
      }

      // Deduct stock
      await ctx.db.patch(product._id, { stock: product.stock - item.quantity });

      // Create Order Item
      await ctx.db.insert("orderItems", {
        orderId,
        productId: item.productId,
        productName: product.name,
        productPrice: product.price,
        quantity: item.quantity,
      });

      // Remove from cart
      await ctx.db.delete(item._id);
    }

    return orderId;
  },
});

export const getByUser = query({
  args: { userId: v.string() },
  handler: async (ctx, args) => {
    return await ctx.db
      .query("orders")
      .withIndex("by_user", (q) => q.eq("userId", args.userId))
      .order("desc") // Most recent first
      .collect();
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
