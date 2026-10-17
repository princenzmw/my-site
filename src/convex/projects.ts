import { v } from "convex/values";
import { query, mutation } from "./_generated/server";
import { getCurrentUser } from "./users";

// Get all published projects
export const getPublishedProjects = query({
  args: {
    category: v.optional(
      v.union(
        v.literal("Data Analysis"),
        v.literal("Software Development"), 
        v.literal("Machine Learning"),
      ),
    ),
  },
  handler: async (ctx, args) => {
    let projectsQuery = ctx.db
      .query("projects")
      .withIndex("by_published", (q) => q.eq("isPublished", true));

    if (args.category) {
      // Narrow the optional category to satisfy types
      const category = args.category;
      projectsQuery = ctx.db
        .query("projects")
        .withIndex("by_category", (q) => q.eq("category", category))
        .filter((q) => q.eq(q.field("isPublished"), true));
    }

    return await projectsQuery.order("desc").collect();
  },
});

// Get featured projects
export const getFeaturedProjects = query({
  args: {},
  handler: async (ctx) => {
    return await ctx.db
      .query("projects")
      .withIndex("by_featured_and_published", (q) =>
        q.eq("featured", true).eq("isPublished", true),
      )
      .order("desc")
      .take(6);
  },
});

// Get project by ID
export const getProjectById = query({
  args: { id: v.id("projects") },
  handler: async (ctx, args) => {
    return await ctx.db.get(args.id);
  },
});

// Admin: Get all projects
export const getAllProjects = query({
  args: {},
  handler: async (ctx) => {
    const user = await getCurrentUser(ctx);
    if (!user || user.role !== "admin") {
      throw new Error("Unauthorized");
    }
    
    return await ctx.db.query("projects").order("desc").collect();
  },
});

// Admin: Create project
export const createProject = mutation({
  args: {
    title: v.string(),
    description: v.string(),
    longDescription: v.optional(v.string()),
    category: v.union(
      v.literal("Data Analysis"),
      v.literal("Software Development"),
      v.literal("Machine Learning"),
    ),
    tags: v.array(v.string()),
    imageUrl: v.optional(v.string()),
    liveUrl: v.optional(v.string()),
    githubUrl: v.optional(v.string()),
    demoUrl: v.optional(v.string()),
    gistUrl: v.optional(v.string()),
    featured: v.boolean(),
    isPublished: v.boolean(),
    order: v.number(),
  },
  handler: async (ctx, args) => {
    const user = await getCurrentUser(ctx);
    if (!user || user.role !== "admin") {
      throw new Error("Unauthorized");
    }

    return await ctx.db.insert("projects", args);
  },
});

// Admin: Update project
export const updateProject = mutation({
  args: {
    id: v.id("projects"),
    title: v.optional(v.string()),
    description: v.optional(v.string()),
    longDescription: v.optional(v.string()),
    category: v.optional(
      v.union(
        v.literal("Data Analysis"),
        v.literal("Software Development"),
        v.literal("Machine Learning"),
      ),
    ),
    tags: v.optional(v.array(v.string())),
    imageUrl: v.optional(v.string()),
    liveUrl: v.optional(v.string()),
    githubUrl: v.optional(v.string()),
    demoUrl: v.optional(v.string()),
    gistUrl: v.optional(v.string()),
    featured: v.optional(v.boolean()),
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

// Admin: Delete project
export const deleteProject = mutation({
  args: { id: v.id("projects") },
  handler: async (ctx, args) => {
    const user = await getCurrentUser(ctx);
    if (!user || user.role !== "admin") {
      throw new Error("Unauthorized");
    }

    return await ctx.db.delete(args.id);
  },
});