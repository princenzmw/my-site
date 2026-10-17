import { v } from "convex/values";
import { query, mutation } from "./_generated/server";
import { getCurrentUser } from "./users";

// Get all published testimonials
export const getPublishedTestimonials = query({
  args: {},
  handler: async (ctx) => {
    return await ctx.db
      .query("testimonials")
      .withIndex("by_published", (q) => q.eq("isPublished", true))
      .order("asc")
      .collect();
  },
});

// Admin: Get all testimonials
export const getAllTestimonials = query({
  args: {},
  handler: async (ctx) => {
    const user = await getCurrentUser(ctx);
    if (!user || user.role !== "admin") {
      throw new Error("Unauthorized");
    }
    
    return await ctx.db.query("testimonials").order("asc").collect();
  },
});

// Admin: Create testimonial
export const createTestimonial = mutation({
  args: {
    name: v.string(),
    position: v.string(),
    company: v.string(),
    companyLogo: v.optional(v.string()),
    content: v.string(),
    rating: v.number(),
    imageUrl: v.optional(v.string()),
    isPublished: v.boolean(),
    order: v.number(),
  },
  handler: async (ctx, args) => {
    const user = await getCurrentUser(ctx);
    if (!user || user.role !== "admin") {
      throw new Error("Unauthorized");
    }

    return await ctx.db.insert("testimonials", args);
  },
});

// Admin: Update testimonial
export const updateTestimonial = mutation({
  args: {
    id: v.id("testimonials"),
    name: v.optional(v.string()),
    position: v.optional(v.string()),
    company: v.optional(v.string()),
    companyLogo: v.optional(v.string()),
    content: v.optional(v.string()),
    rating: v.optional(v.number()),
    imageUrl: v.optional(v.string()),
    isPublished: v.optional(v.boolean()),
    order: v.optional(v.number()),
  },
  handler: async (ctx, args) => {
    const user = await getCurrentUser(ctx);
    if (!user || user.role !== "admin") {
      throw new Error("Unauthorized");
    }

    const { id, ...updates } = args;
    return await ctx.db.patch(id, updates);
  },
});

// Admin: Delete testimonial
export const deleteTestimonial = mutation({
  args: { id: v.id("testimonials") },
  handler: async (ctx, args) => {
    const user = await getCurrentUser(ctx);
    if (!user || user.role !== "admin") {
      throw new Error("Unauthorized");
    }

    return await ctx.db.delete(args.id);
  },
});
