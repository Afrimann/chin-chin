import { v } from "convex/values";
import { query, mutation } from "./_generated/server";
import { Id } from "./_generated/dataModel";

export const generateUploadUrl = mutation(async (ctx) => {
  return await ctx.storage.generateUploadUrl();
});

export const get = query({
  args: {},
  handler: async (ctx) => {
    const products = await ctx.db.query("products").collect();

    return await Promise.all(
      products.map(async (product) => {
        const imageUrl = await ctx.storage.getUrl(product.image);
        return { ...product, imageUrl };
      })
    );
  },
});


export const getByCategory = query({
  args: { category: v.string() },
  handler: async (ctx, args) => {
    const products = await ctx.db
      .query("products")
      .withIndex("by_category", (q) => q.eq("category", args.category))
      .collect();

    return await Promise.all(
      products.map(async (product) => {
        let imageUrl: string | null = product.image;
        if (product.image && !product.image.startsWith("http") && !product.image.startsWith("/")) {
             imageUrl = await ctx.storage.getUrl(product.image as Id<"_storage">);
        }
        return { ...product, image: imageUrl };
      })
    );
  },
});

export const getById = query({
  args: { id: v.id("products") },
  handler: async (ctx, args) => {
    const product = await ctx.db.get(args.id);
    if (!product) return null;
    
    let imageUrl: string | null = product.image;
    if (product.image && !product.image.startsWith("http") && !product.image.startsWith("/")) {
            imageUrl = await ctx.storage.getUrl(product.image as Id<"_storage">);
    }
    return { ...product, image: imageUrl };
  },
});

// Admin Mutation to seed/add products
export const create = mutation({
  args: {
    name: v.string(),
    description: v.string(),
    price: v.number(),
    category: v.string(),
    image: v.id("_storage"),
    isActive: v.boolean(),
    stock: v.number(),
  },
  handler: async (ctx, args) => {
    // In a real app, check for admin privileges here
    return await ctx.db.insert("products", args);
  },
});

export const updateStock = mutation({
  args: { id: v.id("products"), stock: v.number() },
  handler: async (ctx, args) => {
    await ctx.db.patch(args.id, { stock: args.stock });
  },
});
