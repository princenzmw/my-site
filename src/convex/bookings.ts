import { v } from "convex/values";
import { query, mutation } from "./_generated/server";
import { getCurrentUser } from "./users";
import { internal } from "./_generated/api";

// Get available time slots (simplified - in real app would integrate with Google Calendar)
export const getAvailableSlots = query({
  args: {
    date: v.string(), // YYYY-MM-DD format
  },
  handler: async (ctx, args) => {
    // Get existing bookings for the date
    const startOfDay = new Date(args.date).getTime();
    const endOfDay = startOfDay + 24 * 60 * 60 * 1000;
    
    const existingBookings = await ctx.db
      .query("bookings")
      .withIndex("by_session_date")
      .filter((q) => 
        q.and(
          q.gte(q.field("sessionDate"), startOfDay),
          q.lt(q.field("sessionDate"), endOfDay),
          q.neq(q.field("status"), "cancelled")
        )
      )
      .collect();

    // Generate available slots (9 AM to 5 PM, 1-hour slots)
    const availableSlots = [];
    const date = new Date(args.date);
    
    for (let hour = 9; hour < 17; hour++) {
      const slotTime = new Date(date);
      slotTime.setHours(hour, 0, 0, 0);
      
      const isBooked = existingBookings.some(booking => 
        booking.sessionDate === slotTime.getTime()
      );
      
      if (!isBooked) {
        availableSlots.push({
          time: slotTime.getTime(),
          display: `${hour}:00 ${hour < 12 ? 'AM' : 'PM'}`,
        });
      }
    }
    
    return availableSlots;
  },
});

// Create booking
export const createBooking = mutation({
  args: {
    clientName: v.string(),
    clientEmail: v.string(),
    clientPhone: v.optional(v.string()),
    consultationType: v.union(
      v.literal("Data Science"),
      v.literal("Software Engineering"),
    ),
    sessionDate: v.number(),
    sessionDuration: v.number(),
    message: v.optional(v.string()),
    price: v.number(),
    // Honeypot field for spam prevention
    honeypot: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    // Honeypot check
    if (args.honeypot && args.honeypot.trim().length > 0) {
      throw new Error("Spam detected");
    }

    // Light rate limit: max 2 bookings per 30 minutes per email
    const THIRTY_MIN = 30 * 60 * 1000;
    const since = Date.now() - THIRTY_MIN;
    const recent = await ctx.db
      .query("bookings")
      .withIndex("by_client_email", (q) => q.eq("clientEmail", args.clientEmail))
      .order("desc")
      .take(5);

    const recentCount = recent.filter((r) => r._creationTime >= since).length;
    if (recentCount >= 2) {
      throw new Error("Too many booking attempts. Please try again later.");
    }

    // Check if slot is still available
    const existingBooking = await ctx.db
      .query("bookings")
      .withIndex("by_session_date")
      .filter((q) =>
        q.and(
          q.eq(q.field("sessionDate"), args.sessionDate),
          q.neq(q.field("status"), "cancelled"),
        ),
      )
      .first();

    if (existingBooking) {
      throw new Error("This time slot is no longer available");
    }

    const bookingId = await ctx.db.insert("bookings", {
      clientName: args.clientName,
      clientEmail: args.clientEmail,
      clientPhone: args.clientPhone,
      consultationType: args.consultationType,
      sessionDate: args.sessionDate,
      sessionDuration: args.sessionDuration,
      message: args.message,
      price: args.price,
      status: "pending",
      paymentStatus: "pending",
    });
    // Send emails via scheduler (0ms delay)
    await ctx.scheduler.runAfter(
      0,
      internal.emails.sendBookingEmails,
      {
        adminEmail: "npfudji@gmail.com",
        clientName: args.clientName,
        clientEmail: args.clientEmail,
        consultationType: args.consultationType,
        sessionDate: args.sessionDate,
        sessionDuration: args.sessionDuration,
        price: args.price,
        message: args.message,
      },
    );
    return bookingId;
  },
});

// Admin: Get all bookings
export const getAllBookings = query({
  args: {},
  handler: async (ctx) => {
    const user = await getCurrentUser(ctx);
    if (!user || user.role !== "admin") {
      throw new Error("Unauthorized");
    }
    
    return await ctx.db.query("bookings").order("desc").collect();
  },
});

// Admin: Update booking status
export const updateBookingStatus = mutation({
  args: {
    id: v.id("bookings"),
    status: v.union(
      v.literal("pending"),
      v.literal("confirmed"),
      v.literal("completed"),
      v.literal("cancelled"),
    ),
    paymentStatus: v.optional(
      v.union(v.literal("pending"), v.literal("paid"), v.literal("refunded")),
    ),
    meetingLink: v.optional(v.string()),
    notes: v.optional(v.string()),
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

// Get booking by ID (for confirmation pages)
export const getBookingById = query({
  args: { id: v.id("bookings") },
  handler: async (ctx, args) => {
    return await ctx.db.get(args.id);
  },
});