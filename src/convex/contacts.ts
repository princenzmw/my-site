import { v } from "convex/values";
import { query, mutation } from "./_generated/server";
import { getCurrentUser } from "./users";
import { internal } from "./_generated/api";

// Create contact message
export const createContact = mutation({
  args: {
    name: v.string(),
    email: v.string(),
    subject: v.optional(v.string()),
    message: v.string(),
    // Honeypot field for spam prevention (bots often fill unexpected fields)
    honeypot: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    // Honeypot check
    if (args.honeypot && args.honeypot.trim().length > 0) {
      throw new Error("Spam detected");
    }

    // Simple rate limit: max 3 messages per 10 minutes per email
    const TEN_MIN = 10 * 60 * 1000;
    const since = Date.now() - TEN_MIN;
    const recent = await ctx.db
      .query("contacts")
      .withIndex("by_email", (q) => q.eq("email", args.email))
      .order("desc")
      .take(5);

    const recentCount = recent.filter((r) => r._creationTime >= since).length;
    if (recentCount >= 3) {
      throw new Error("Too many messages. Please try again later.");
    }

    const id = await ctx.db.insert("contacts", {
      name: args.name,
      email: args.email,
      subject: args.subject,
      message: args.message,
      isRead: false,
      replied: false,
    });
    // Send emails via scheduler (0ms delay)
    await ctx.scheduler.runAfter(
      0,
      internal.emails.sendContactEmails,
      {
        adminEmail: "npfudji@gmail.com",
        name: args.name,
        email: args.email,
        subject: args.subject,
        message: args.message,
      },
    );
    return id;
  },
});

// Admin: Get all contacts
export const getAllContacts = query({
  args: {},
  handler: async (ctx) => {
    const user = await getCurrentUser(ctx);
    if (!user || user.role !== "admin") {
      throw new Error("Unauthorized");
    }
    
    return await ctx.db.query("contacts").order("desc").collect();
  },
});

// Admin: Mark contact as read
export const markContactAsRead = mutation({
  args: { id: v.id("contacts") },
  handler: async (ctx, args) => {
    const user = await getCurrentUser(ctx);
    if (!user || user.role !== "admin") {
      throw new Error("Unauthorized");
    }

    return await ctx.db.patch(args.id, { isRead: true });
  },
});

// Admin: Mark contact as replied
export const markContactAsReplied = mutation({
  args: { id: v.id("contacts") },
  handler: async (ctx, args) => {
    const user = await getCurrentUser(ctx);
    if (!user || user.role !== "admin") {
      throw new Error("Unauthorized");
    }

    return await ctx.db.patch(args.id, { replied: true });
  },
});