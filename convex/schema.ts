import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

export default defineSchema({
  // Product catalog
  products: defineTable({
    name: v.string(),
    description: v.string(),
    price: v.number(), // stored in kobo
    category: v.string(),
    image: v.id("_storage"),
    isActive: v.boolean(),
    stock: v.number(),
  }).index("by_category", ["category"]),

  // Users synced from Clerk
  users: defineTable({
    clerkId: v.string(),
    name: v.string(),
    email: v.string(),
    // We might want to store role here if needed, but Clerk handles auth
  }).index("by_clerkId", ["clerkId"]),

  // Shopping cart (one active per user)
  carts: defineTable({
    userId: v.string(), // Clerk userId
  }).index("by_user", ["userId"]),

  // Items within a cart
  cartItems: defineTable({
    cartId: v.id("carts"),
    productId: v.id("products"),
    quantity: v.number(),
  }).index("by_cart", ["cartId"]),

  // User delivery addresses
  addresses: defineTable({
    userId: v.string(), // Clerk userId
    label: v.string(), // e.g., "Home", "Office"
    name: v.string(), // Recipient name
    street: v.string(),
    city: v.string(),
    state: v.string(),
    phone: v.string(),
  }).index("by_user", ["userId"]),

  // Customer orders
  orders: defineTable({
    userId: v.string(), // Clerk userId
    
    // Address snapshot at time of order to preserve history
    deliveryAddress: v.object({
      name: v.string(),
      street: v.string(),
      city: v.string(),
      state: v.string(),
      phone: v.string(),
    }),

    // Order status
    status: v.union(
      v.literal("Pending"),
      v.literal("Paid"),
      v.literal("Preparing"),
      v.literal("OutForDelivery"),
      v.literal("Delivered"),
      v.literal("Cancelled"),
      v.literal("Expired")
    ),

    totalAmount: v.number(), // in kobo

    // Payment status tracking
    paymentStatus: v.union(
      v.literal("Pending"),
      v.literal("Success"),
      v.literal("Failed")
    ),

    // Payment reference
    paymentId: v.optional(v.string()),

    createdAt: v.number(),
    expiresAt: v.optional(v.number()),
  }).index("by_user", ["userId"]),

  // Line items for orders (snapshot of product details)
  orderItems: defineTable({
    orderId: v.id("orders"),
    productId: v.id("products"), 
    productName: v.string(), // Snapshot
    productPrice: v.number(), // Snapshot (in kobo)
    quantity: v.number(),
  }).index("by_order", ["orderId"]),

  // Payment records
  payments: defineTable({
    orderId: v.id("orders"),
    provider: v.string(), // e.g., "Paystack", "Flutterwave"
    transactionReference: v.string(),
    amount: v.number(), // in kobo
    status: v.union(
      v.literal("Pending"), 
      v.literal("Success"), 
      v.literal("Failed")
    ),
    createdAt: v.number(),
  })
  .index("by_order", ["orderId"])
  .index("by_reference", ["transactionReference"]),
});
