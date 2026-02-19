import { v } from "convex/values";
import { query, mutation } from "./_generated/server";

export const get = query({
  args: { userId: v.string() },
  handler: async (ctx, args) => {
    return await ctx.db
      .query("addresses")
      .withIndex("by_user", (q) => q.eq("userId", args.userId))
      .collect();
  },
});

export const add = mutation({
  args: {
    userId: v.string(),
    label: v.string(),
    name: v.string(),
    street: v.string(),
    city: v.string(),
    state: v.string(),
    phone: v.string(),
  },
  handler: async (ctx, args) => {
    await ctx.db.insert("addresses", args);
  },
});

export const remove = mutation({
  args: { userId: v.string(), addressId: v.id("addresses") },
  handler: async (ctx, args) => {
    const address = await ctx.db.get(args.addressId);
    
    // Simple ownership check
    if (!address || address.userId !== args.userId) {
      throw new Error("Address not found or unauthorized");
    }

    await ctx.db.delete(args.addressId);
  },
});
