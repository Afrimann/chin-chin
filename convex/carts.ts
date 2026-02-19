import { v } from "convex/values";
import { query, mutation } from "./_generated/server";

// Helper to get or create cart for user
async function getOrCreateCart(ctx: any, userId: string) {
  const cart = await ctx.db
    .query("carts")
    .withIndex("by_user", (q: any) => q.eq("userId", userId))
    .unique();

  if (cart) return cart;

  const cartId = await ctx.db.insert("carts", { userId });
  return { _id: cartId, userId };
}

export const get = query({
  args: { userId: v.string() },
  handler: async (ctx, args) => {
    const cart = await ctx.db
      .query("carts")
      .withIndex("by_user", (q) => q.eq("userId", args.userId))
      .unique();

    if (!cart) return { items: [] };

    const items = await ctx.db
      .query("cartItems")
      .withIndex("by_cart", (q) => q.eq("cartId", cart._id))
      .collect();

    // Enrich items with product details
    const enrichedItems = await Promise.all(
      items.map(async (item) => {
        const product = await ctx.db.get(item.productId);
        let imageUrl: string | null = null;
        if (product && product.image) {
             imageUrl = await ctx.storage.getUrl(product.image);
        }
        return { 
            ...item, 
            product: product ? { ...product, imageUrl } : null 
        };
      })
    );

    return { items: enrichedItems };
  },
});

export const addItem = mutation({
  args: { 
    userId: v.string(), 
    productId: v.id("products"), 
    quantity: v.number() 
  },
  handler: async (ctx, args) => {
    const cart = await getOrCreateCart(ctx, args.userId);
    
    const existingItem = await ctx.db
      .query("cartItems")
      .withIndex("by_cart", (q) => q.eq("cartId", cart._id))
      .filter((q) => q.eq(q.field("productId"), args.productId))
      .unique();

    if (existingItem) {
      await ctx.db.patch(existingItem._id, {
        quantity: existingItem.quantity + args.quantity,
      });
    } else {
      await ctx.db.insert("cartItems", {
        cartId: cart._id,
        productId: args.productId,
        quantity: args.quantity,
      });
    }
  },
});

export const removeItem = mutation({
  args: { userId: v.string(), itemId: v.id("cartItems") },
  handler: async (ctx, args) => {
    // Verify ownership (simplified)
    const item = await ctx.db.get(args.itemId);
    if (!item) return;
    
    // In a real app, verify the cart belongs to the user
    await ctx.db.delete(args.itemId);
  },
});

export const updateQuantity = mutation({
  args: { itemId: v.id("cartItems"), quantity: v.number() },
  handler: async (ctx, args) => {
    if (args.quantity <= 0) {
      await ctx.db.delete(args.itemId);
    } else {
      await ctx.db.patch(args.itemId, { quantity: args.quantity });
    }
  },
});

export const clear = mutation({
  args: { userId: v.string() },
  handler: async (ctx, args) => {
    const cart = await ctx.db
      .query("carts")
      .withIndex("by_user", (q) => q.eq("userId", args.userId))
      .unique();

    if (!cart) return;

    const items = await ctx.db
      .query("cartItems")
      .withIndex("by_cart", (q) => q.eq("cartId", cart._id))
      .collect();

    await Promise.all(items.map((item) => ctx.db.delete(item._id)));
  },
});
