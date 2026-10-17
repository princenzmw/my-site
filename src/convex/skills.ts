import { v } from "convex/values";
import { query, mutation } from "./_generated/server";
import { getCurrentUser } from "./users";

// Get all visible skills grouped by category
export const getVisibleSkills = query({
  args: {},
  handler: async (ctx) => {
    const skills = await ctx.db
      .query("skills")
      .withIndex("by_visible", (q) => q.eq("isVisible", true))
      .order("asc")
      .collect();

    // Group by category
    const groupedSkills: Record<string, typeof skills> = {};
    skills.forEach(skill => {
      if (!groupedSkills[skill.category]) {
        groupedSkills[skill.category] = [];
      }
      groupedSkills[skill.category].push(skill);
    });

    return groupedSkills;
  },
});

// Admin: Get all skills
export const getAllSkills = query({
  args: {},
  handler: async (ctx) => {
    const user = await getCurrentUser(ctx);
    if (!user || user.role !== "admin") {
      throw new Error("Unauthorized");
    }
    
    return await ctx.db.query("skills").order("asc").collect();
  },
});

// Admin: Create skill
export const createSkill = mutation({
  args: {
    name: v.string(),
    category: v.string(),
    proficiency: v.number(),
    yearsOfExperience: v.number(),
    order: v.number(),
    isVisible: v.boolean(),
  },
  handler: async (ctx, args) => {
    const user = await getCurrentUser(ctx);
    if (!user || user.role !== "admin") {
      throw new Error("Unauthorized");
    }

    return await ctx.db.insert("skills", args);
  },
});

// Admin: Update skill
export const updateSkill = mutation({
  args: {
    id: v.id("skills"),
    name: v.optional(v.string()),
    category: v.optional(v.string()),
    proficiency: v.optional(v.number()),
    yearsOfExperience: v.optional(v.number()),
    order: v.optional(v.number()),
    isVisible: v.optional(v.boolean()),
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

// Admin: Delete skill
export const deleteSkill = mutation({
  args: { id: v.id("skills") },
  handler: async (ctx, args) => {
    const user = await getCurrentUser(ctx);
    if (!user || user.role !== "admin") {
      throw new Error("Unauthorized");
    }

    return await ctx.db.delete(args.id);
  },
});
