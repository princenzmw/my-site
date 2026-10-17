import { authTables } from "@convex-dev/auth/server";
import { defineSchema, defineTable } from "convex/server";
import { Infer, v } from "convex/values";

// default user roles. can add / remove based on the project as needed
export const ROLES = {
  ADMIN: "admin",
  USER: "user",
  VISITOR: "visitor",
} as const;

export const roleValidator = v.union(
  v.literal(ROLES.ADMIN),
  v.literal(ROLES.USER),
  v.literal(ROLES.VISITOR),
);
export type Role = Infer<typeof roleValidator>;

// Project categories
export const PROJECT_CATEGORIES = {
  DATA_ANALYSIS: "Data Analysis",
  SOFTWARE_DEVELOPMENT: "Software Development", 
  MACHINE_LEARNING: "Machine Learning",
} as const;

export const projectCategoryValidator = v.union(
  v.literal(PROJECT_CATEGORIES.DATA_ANALYSIS),
  v.literal(PROJECT_CATEGORIES.SOFTWARE_DEVELOPMENT),
  v.literal(PROJECT_CATEGORIES.MACHINE_LEARNING),
);

// Blog categories
export const BLOG_CATEGORIES = {
  TUTORIALS: "Tutorials",
  INDUSTRY_TRENDS: "Industry Trends",
  CASE_STUDIES: "Case Studies",
} as const;

export const blogCategoryValidator = v.union(
  v.literal(BLOG_CATEGORIES.TUTORIALS),
  v.literal(BLOG_CATEGORIES.INDUSTRY_TRENDS),
  v.literal(BLOG_CATEGORIES.CASE_STUDIES),
);

// Consultation types
export const CONSULTATION_TYPES = {
  DATA_SCIENCE: "Data Science",
  SOFTWARE_ENGINEERING: "Software Engineering",
} as const;

export const consultationTypeValidator = v.union(
  v.literal(CONSULTATION_TYPES.DATA_SCIENCE),
  v.literal(CONSULTATION_TYPES.SOFTWARE_ENGINEERING),
);

const schema = defineSchema(
  {
    // default auth tables using convex auth.
    ...authTables, // do not remove or modify

    // the users table is the default users table that is brought in by the authTables
    users: defineTable({
      name: v.optional(v.string()), // name of the user. do not remove
      image: v.optional(v.string()), // image of the user. do not remove
      email: v.optional(v.string()), // email of the user. do not remove
      emailVerificationTime: v.optional(v.number()), // email verification time. do not remove
      isAnonymous: v.optional(v.boolean()), // is the user anonymous. do not remove

      role: v.optional(roleValidator), // role of the user. do not remove
    }).index("email", ["email"]), // index for the email. do not remove or modify

    // Projects table
    projects: defineTable({
      title: v.string(),
      description: v.string(),
      longDescription: v.optional(v.string()),
      category: projectCategoryValidator,
      tags: v.array(v.string()),
      imageUrl: v.optional(v.string()),
      liveUrl: v.optional(v.string()),
      githubUrl: v.optional(v.string()),
      demoUrl: v.optional(v.string()), // Streamlit/Dash apps
      gistUrl: v.optional(v.string()), // GitHub Gist code snippets
      featured: v.boolean(),
      isPublished: v.boolean(),
      order: v.number(),
    }).index("by_category", ["category"])
      .index("by_featured", ["featured"])
      .index("by_published", ["isPublished"])
      .index("by_featured_and_published", ["featured", "isPublished"])
      .index("by_order", ["order"]),

    // Blog posts table
    blogs: defineTable({
      title: v.string(),
      slug: v.string(),
      excerpt: v.string(),
      content: v.string(),
      category: blogCategoryValidator,
      tags: v.array(v.string()),
      imageUrl: v.optional(v.string()),
      isPublished: v.boolean(),
      featured: v.boolean(),
      readTime: v.number(), // in minutes
      views: v.number(),
      authorId: v.id("users"),
    }).index("by_slug", ["slug"])
      .index("by_category", ["category"])
      .index("by_published", ["isPublished"])
      .index("by_featured", ["featured"])
      .index("by_featured_and_published", ["featured", "isPublished"])
      .index("by_author", ["authorId"])
      .index("by_published_and_category", ["isPublished", "category"]),

    // Testimonials table
    testimonials: defineTable({
      name: v.string(),
      position: v.string(),
      company: v.string(),
      companyLogo: v.optional(v.string()),
      content: v.string(),
      rating: v.number(), // 1-5 stars
      imageUrl: v.optional(v.string()),
      isPublished: v.boolean(),
      order: v.number(),
    }).index("by_published", ["isPublished"])
      .index("by_order", ["order"]),

    // Bookings table
    bookings: defineTable({
      clientName: v.string(),
      clientEmail: v.string(),
      clientPhone: v.optional(v.string()),
      consultationType: consultationTypeValidator,
      sessionDate: v.number(), // timestamp
      sessionDuration: v.number(), // in minutes
      message: v.optional(v.string()),
      status: v.union(
        v.literal("pending"),
        v.literal("confirmed"),
        v.literal("completed"),
        v.literal("cancelled")
      ),
      price: v.number(),
      paymentStatus: v.union(
        v.literal("pending"),
        v.literal("paid"),
        v.literal("refunded")
      ),
      stripeSessionId: v.optional(v.string()),
      meetingLink: v.optional(v.string()),
      notes: v.optional(v.string()),
    }).index("by_client_email", ["clientEmail"])
      .index("by_status", ["status"])
      .index("by_session_date", ["sessionDate"])
      .index("by_session_date_and_status", ["sessionDate", "status"]),

    // Contact messages table
    contacts: defineTable({
      name: v.string(),
      email: v.string(),
      subject: v.optional(v.string()),
      message: v.string(),
      isRead: v.boolean(),
      replied: v.boolean(),
    }).index("by_read", ["isRead"])
      .index("by_email", ["email"]),

    // Skills table for the interactive skill chart
    skills: defineTable({
      name: v.string(),
      category: v.string(), // e.g., "Programming Languages", "Data Science", "Tools"
      proficiency: v.number(), // 1-100
      yearsOfExperience: v.number(),
      order: v.number(),
      isVisible: v.boolean(),
    }).index("by_category", ["category"])
      .index("by_order", ["order"])
      .index("by_visible", ["isVisible"]),
  },
  {
    schemaValidation: false,
  },
);

export default schema;