import { v } from "convex/values";
import { query, mutation } from "./_generated/server";
import { getCurrentUser } from "./users";
import { paginationOptsValidator } from "convex/server";

// Get all published blog posts
export const getPublishedBlogs = query({
  args: {
    category: v.optional(
      v.union(
        v.literal("Tutorials"),
        v.literal("Industry Trends"), 
        v.literal("Case Studies"),
      ),
    ),
    search: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    let blogsQuery = ctx.db
      .query("blogs")
      .withIndex("by_published", (q) => q.eq("isPublished", true));

    if (args.category) {
      // Narrow the optional category to satisfy types
      const category = args.category;
      blogsQuery = ctx.db
        .query("blogs")
        .withIndex("by_category", (q) => q.eq("category", category))
        .filter((q) => q.eq(q.field("isPublished"), true));
    }

    let blogs = await blogsQuery.order("desc").collect();

    if (args.search) {
      const searchTerm = args.search.toLowerCase();
      blogs = blogs.filter(
        (blog) =>
          blog.title.toLowerCase().includes(searchTerm) ||
          blog.excerpt.toLowerCase().includes(searchTerm) ||
          blog.tags.some((tag) => tag.toLowerCase().includes(searchTerm)),
      );
    }

    return blogs;
  },
});

// Get featured blog posts
export const getFeaturedBlogs = query({
  args: {},
  handler: async (ctx) => {
    return await ctx.db
      .query("blogs")
      .withIndex("by_featured_and_published", (q) =>
        q.eq("featured", true).eq("isPublished", true),
      )
      .order("desc")
      .take(3);
  },
});

// Get blog by slug
export const getBlogBySlug = query({
  args: { slug: v.string() },
  handler: async (ctx, args) => {
    return await ctx.db
      .query("blogs")
      .withIndex("by_slug", (q) => q.eq("slug", args.slug))
      .first();
  },
});

// Admin: Get all blogs
export const getAllBlogs = query({
  args: {},
  handler: async (ctx) => {
    const user = await getCurrentUser(ctx);
    if (!user || user.role !== "admin") {
      throw new Error("Unauthorized");
    }
    
    return await ctx.db.query("blogs").order("desc").collect();
  },
});

// Admin: Create blog
export const createBlog = mutation({
  args: {
    title: v.string(),
    slug: v.string(),
    excerpt: v.string(),
    content: v.string(),
    category: v.union(
      v.literal("Tutorials"),
      v.literal("Industry Trends"),
      v.literal("Case Studies"),
    ),
    tags: v.array(v.string()),
    imageUrl: v.optional(v.string()),
    isPublished: v.boolean(),
    featured: v.boolean(),
    readTime: v.number(),
  },
  handler: async (ctx, args) => {
    const user = await getCurrentUser(ctx);
    if (!user || user.role !== "admin") {
      throw new Error("Unauthorized");
    }

    return await ctx.db.insert("blogs", {
      ...args,
      authorId: user._id,
      views: 0,
    });
  },
});

// Admin: Update blog
export const updateBlog = mutation({
  args: {
    id: v.id("blogs"),
    title: v.optional(v.string()),
    slug: v.optional(v.string()),
    excerpt: v.optional(v.string()),
    content: v.optional(v.string()),
    category: v.optional(
      v.union(
        v.literal("Tutorials"),
        v.literal("Industry Trends"),
        v.literal("Case Studies"),
      ),
    ),
    tags: v.optional(v.array(v.string())),
    imageUrl: v.optional(v.string()),
    isPublished: v.optional(v.boolean()),
    featured: v.optional(v.boolean()),
    readTime: v.optional(v.number()),
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

// Admin: Delete blog
export const deleteBlog = mutation({
  args: { id: v.id("blogs") },
  handler: async (ctx, args) => {
    const user = await getCurrentUser(ctx);
    if (!user || user.role !== "admin") {
      throw new Error("Unauthorized");
    }

    return await ctx.db.delete(args.id);
  },
});

// Add paginated blogs query
export const getPublishedBlogsPaginated = query({
  args: {
    paginationOpts: paginationOptsValidator,
    category: v.optional(
      v.union(
        v.literal("Tutorials"),
        v.literal("Industry Trends"),
        v.literal("Case Studies"),
      ),
    ),
    search: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const { paginationOpts, category, search } = args;

    // If category is specified, use the composite index
    if (category) {
      const page = await ctx.db
        .query("blogs")
        .withIndex("by_published_and_category", (q) =>
          q.eq("isPublished", true).eq("category", category),
        )
        .order("desc")
        .paginate(paginationOpts);

      // Lightweight client-side filter for search within current page
      if (search) {
        const term = search.toLowerCase();
        page.page = page.page.filter(
          (blog) =>
            blog.title.toLowerCase().includes(term) ||
            blog.excerpt.toLowerCase().includes(term) ||
            blog.tags.some((t) => t.toLowerCase().includes(term)),
        );
      }
      return page;
    }

    // Otherwise paginate by published only
    const page = await ctx.db
      .query("blogs")
      .withIndex("by_published", (q) => q.eq("isPublished", true))
      .order("desc")
      .paginate(paginationOpts);

    if (search) {
      const term = search.toLowerCase();
      page.page = page.page.filter(
        (blog) =>
          blog.title.toLowerCase().includes(term) ||
          blog.excerpt.toLowerCase().includes(term) ||
          blog.tags.some((t) => t.toLowerCase().includes(term)),
      );
    }

    return page;
  },
});