import { mutation } from "./_generated/server";
import { getCurrentUser } from "./users";

export const seedDatabase = mutation({
  args: {},
  handler: async (ctx) => {
    const user = await getCurrentUser(ctx);
    if (!user || user.role !== "admin") {
      throw new Error("Only admin can seed database");
    }

    // Sample Projects
    const projects = [
      {
        title: "Customer Churn Prediction Model",
        description: "ML model predicting customer churn with 94% accuracy using ensemble methods",
        longDescription: "Built a comprehensive machine learning pipeline to predict customer churn for a SaaS company. Used feature engineering, ensemble methods, and deployed the model to production with real-time predictions.",
        category: "Machine Learning" as const,
        tags: ["Python", "Scikit-learn", "XGBoost", "AWS", "Docker"],
        imageUrl: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=400&h=200&fit=crop",
        liveUrl: "https://churn-demo.streamlit.app",
        githubUrl: "https://github.com/example/churn-prediction",
        demoUrl: "https://churn-demo.streamlit.app",
        featured: true,
        isPublished: true,
        order: 1,
      },
      {
        title: "Real-time Analytics Dashboard",
        description: "Interactive dashboard processing 1M+ events daily with sub-second latency",
        longDescription: "Developed a real-time analytics platform using React, Node.js, and Apache Kafka to process and visualize streaming data from multiple sources.",
        category: "Software Development" as const,
        tags: ["React", "Node.js", "Kafka", "Redis", "PostgreSQL"],
        imageUrl: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=400&h=200&fit=crop",
        liveUrl: "https://analytics-demo.vercel.app",
        githubUrl: "https://github.com/example/analytics-dashboard",
        featured: true,
        isPublished: true,
        order: 2,
      },
      {
        title: "Sales Forecasting Analysis",
        description: "Time series analysis improving forecast accuracy by 35% using ARIMA and Prophet",
        longDescription: "Comprehensive sales forecasting solution combining traditional time series methods with modern ML approaches to provide accurate business predictions.",
        category: "Data Analysis" as const,
        tags: ["Python", "Prophet", "ARIMA", "Pandas", "Plotly"],
        imageUrl: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=400&h=200&fit=crop",
        githubUrl: "https://github.com/example/sales-forecasting",
        featured: true,
        isPublished: true,
        order: 3,
      },
    ];

    for (const project of projects) {
      await ctx.db.insert("projects", project);
    }

    // Sample Blog Posts
    const blogs = [
      {
        title: "Getting Started with Machine Learning in Production",
        slug: "ml-in-production",
        excerpt: "A comprehensive guide to deploying ML models in production environments with best practices and real-world examples.",
        content: "# Getting Started with Machine Learning in Production\n\nDeploying machine learning models to production is one of the most challenging aspects of data science...",
        category: "Tutorials" as const,
        tags: ["Machine Learning", "MLOps", "Production", "Docker"],
        imageUrl: "https://images.unsplash.com/photo-1504868584819-f8e8b4b6d7e3?w=400&h=200&fit=crop",
        isPublished: true,
        featured: true,
        readTime: 8,
        views: 1250,
        authorId: user._id,
      },
      {
        title: "The Future of Data Science: Trends to Watch in 2024",
        slug: "data-science-trends-2024",
        excerpt: "Exploring the latest trends and technologies shaping the future of data science and analytics.",
        content: "# The Future of Data Science: Trends to Watch in 2024\n\nThe data science landscape is evolving rapidly...",
        category: "Industry Trends" as const,
        tags: ["Data Science", "AI", "Trends", "Future"],
        imageUrl: "https://images.unsplash.com/photo-1518186285589-2f7649de83e0?w=400&h=200&fit=crop",
        isPublished: true,
        featured: true,
        readTime: 6,
        views: 890,
        authorId: user._id,
      },
      {
        title: "Case Study: Reducing Customer Acquisition Cost by 40%",
        slug: "customer-acquisition-case-study",
        excerpt: "How we used data science to optimize marketing spend and significantly reduce customer acquisition costs.",
        content: "# Case Study: Reducing Customer Acquisition Cost by 40%\n\nIn this case study, we'll explore how data-driven marketing optimization...",
        category: "Case Studies" as const,
        tags: ["Marketing", "Optimization", "ROI", "Analytics"],
        imageUrl: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=400&h=200&fit=crop",
        isPublished: true,
        featured: true,
        readTime: 12,
        views: 2100,
        authorId: user._id,
      },
    ];

    for (const blog of blogs) {
      await ctx.db.insert("blogs", blog);
    }

    // Sample Testimonials
    const testimonials = [
      {
        name: "Sarah Johnson",
        position: "VP of Engineering",
        company: "TechCorp",
        content: "Working with this data scientist was transformative for our business. The ML models delivered exceeded our expectations and provided actionable insights that drove real revenue growth.",
        rating: 5,
        imageUrl: "https://images.unsplash.com/photo-1494790108755-2616b612b786?w=100&h=100&fit=crop&crop=face",
        isPublished: true,
        order: 1,
      },
      {
        name: "Michael Chen",
        position: "CTO",
        company: "DataFlow Solutions",
        content: "Exceptional technical skills combined with clear communication. The analytics platform built for us processes millions of events daily with perfect reliability.",
        rating: 5,
        imageUrl: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop&crop=face",
        isPublished: true,
        order: 2,
      },
      {
        name: "Emily Rodriguez",
        position: "Head of Data",
        company: "Growth Analytics",
        content: "The forecasting models developed for our team improved our prediction accuracy by 35%. The implementation was seamless and the documentation was excellent.",
        rating: 5,
        imageUrl: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&h=100&fit=crop&crop=face",
        isPublished: true,
        order: 3,
      },
    ];

    for (const testimonial of testimonials) {
      await ctx.db.insert("testimonials", testimonial);
    }

    // Sample Skills
    const skills = [
      // Programming Languages
      { name: "Python", category: "Programming Languages", proficiency: 95, yearsOfExperience: 6, order: 1, isVisible: true },
      { name: "R", category: "Programming Languages", proficiency: 85, yearsOfExperience: 4, order: 2, isVisible: true },
      { name: "SQL", category: "Programming Languages", proficiency: 90, yearsOfExperience: 5, order: 3, isVisible: true },
      { name: "JavaScript", category: "Programming Languages", proficiency: 80, yearsOfExperience: 4, order: 4, isVisible: true },
      { name: "Rust", category: "Programming Languages", proficiency: 75, yearsOfExperience: 1, order: 5, isVisible: true },
      
      // Data Science & ML
      { name: "Machine Learning", category: "Data Science & ML", proficiency: 92, yearsOfExperience: 5, order: 1, isVisible: true },
      { name: "Deep Learning", category: "Data Science & ML", proficiency: 85, yearsOfExperience: 3, order: 2, isVisible: true },
      { name: "Statistical Analysis", category: "Data Science & ML", proficiency: 90, yearsOfExperience: 5, order: 3, isVisible: true },
      { name: "Time Series Analysis", category: "Data Science & ML", proficiency: 88, yearsOfExperience: 4, order: 4, isVisible: true },
      
      // Tools & Technologies
      { name: "AWS", category: "Tools & Technologies", proficiency: 85, yearsOfExperience: 4, order: 1, isVisible: true },
      { name: "Docker", category: "Tools & Technologies", proficiency: 80, yearsOfExperience: 3, order: 2, isVisible: true },
      { name: "Git", category: "Tools & Technologies", proficiency: 90, yearsOfExperience: 6, order: 3, isVisible: true },
      { name: "Tableau", category: "Tools & Technologies", proficiency: 85, yearsOfExperience: 4, order: 4, isVisible: true },
    ];

    for (const skill of skills) {
      await ctx.db.insert("skills", skill);
    }

    return { message: "Database seeded successfully!" };
  },
});

export const seedPublicDemoIfEmpty = mutation({
  args: {},
  handler: async (ctx) => {
    // Check emptiness of each table (only insert when empty)
    const hasProjects = await ctx.db.query("projects").first();
    const hasBlogs = await ctx.db.query("blogs").first();
    const hasTestimonials = await ctx.db.query("testimonials").first();
    const hasSkills = await ctx.db.query("skills").first();

    let insertedProjects = 0;
    let insertedBlogs = 0;
    let insertedTestimonials = 0;
    let insertedSkills = 0;

    if (!hasProjects) {
      const projects = [
        {
          title: "Customer Churn Prediction Model",
          description:
            "ML model predicting customer churn with 94% accuracy using ensemble methods",
          longDescription:
            "Built a comprehensive machine learning pipeline to predict customer churn for a SaaS company. Used feature engineering, ensemble methods, and deployed the model to production with real-time predictions.",
          category: "Machine Learning" as const,
          tags: ["Python", "Scikit-learn", "XGBoost", "AWS", "Docker"],
          imageUrl:
            "https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=400&h=200&fit=crop",
          liveUrl: "https://churn-demo.streamlit.app",
          githubUrl: "https://github.com/example/churn-prediction",
          demoUrl: "https://churn-demo.streamlit.app",
          featured: true,
          isPublished: true,
          order: 1,
        },
        {
          title: "Real-time Analytics Dashboard",
          description:
            "Interactive dashboard processing 1M+ events daily with sub-second latency",
          longDescription:
            "Developed a real-time analytics platform using React, Node.js, and Apache Kafka to process and visualize streaming data from multiple sources.",
          category: "Software Development" as const,
          tags: ["React", "Node.js", "Kafka", "Redis", "PostgreSQL"],
          imageUrl:
            "https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=400&h=200&fit=crop",
          liveUrl: "https://analytics-demo.vercel.app",
          githubUrl: "https://github.com/example/analytics-dashboard",
          featured: true,
          isPublished: true,
          order: 2,
        },
        {
          title: "Sales Forecasting Analysis",
          description:
            "Time series analysis improving forecast accuracy by 35% using ARIMA and Prophet",
          longDescription:
            "Comprehensive sales forecasting solution combining traditional time series methods with modern ML approaches to provide accurate business predictions.",
          category: "Data Analysis" as const,
          tags: ["Python", "Prophet", "ARIMA", "Pandas", "Plotly"],
          imageUrl:
            "https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=400&h=200&fit=crop",
          githubUrl: "https://github.com/example/sales-forecasting",
          featured: true,
          isPublished: true,
          order: 3,
        },
      ];
      for (const p of projects) {
        await ctx.db.insert("projects", p);
        insertedProjects++;
      }
    }

    if (!hasBlogs) {
      // Ensure there's a valid author for demo blogs
      const existingUser = await ctx.db.query("users").first();
      const authorId =
        existingUser?._id ??
        (await ctx.db.insert("users", {
          name: "Demo Author",
          isAnonymous: true,
          role: "visitor",
        }));

      const blogs = [
        {
          title: "Getting Started with Machine Learning in Production",
          slug: "ml-in-production",
          excerpt:
            "A comprehensive guide to deploying ML models in production environments with best practices and real-world examples.",
          content:
            "# Getting Started with Machine Learning in Production\n\nDeploying machine learning models to production is one of the most challenging aspects of data science...",
          category: "Tutorials" as const,
          tags: ["Machine Learning", "MLOps", "Production", "Docker"],
          imageUrl:
            "https://images.unsplash.com/photo-1504868584819-f8e8b4b6d7e3?w=400&h=200&fit=crop",
          isPublished: true,
          featured: true,
          readTime: 8,
          views: 1250,
          // Add authorId to satisfy schema
          authorId,
        },
        {
          title: "The Future of Data Science: Trends to Watch in 2024",
          slug: "data-science-trends-2024",
          excerpt:
            "Exploring the latest trends and technologies shaping the future of data science and analytics.",
          content:
            "# The Future of Data Science: Trends to Watch in 2024\n\nThe data science landscape is evolving rapidly...",
          category: "Industry Trends" as const,
          tags: ["Data Science", "AI", "Trends", "Future"],
          imageUrl:
            "https://images.unsplash.com/photo-1518186285589-2f7649de83e0?w=400&h=200&fit=crop",
          isPublished: true,
          featured: true,
          readTime: 6,
          views: 890,
          authorId,
        },
        {
          title: "Case Study: Reducing Customer Acquisition Cost by 40%",
          slug: "customer-acquisition-case-study",
          excerpt:
            "How we used data science to optimize marketing spend and significantly reduce customer acquisition costs.",
          content:
            "# Case Study: Reducing Customer Acquisition Cost by 40%\n\nIn this case study, we'll explore how data-driven marketing optimization...",
          category: "Case Studies" as const,
          tags: ["Marketing", "Optimization", "ROI", "Analytics"],
          imageUrl:
            "https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=400&h=200&fit=crop",
          isPublished: true,
          featured: true,
          readTime: 12,
          views: 2100,
          authorId,
        },
      ];
      for (const b of blogs) {
        await ctx.db.insert("blogs", b);
        insertedBlogs++;
      }
    }

    if (!hasTestimonials) {
      const testimonials = [
        {
          name: "Sarah Johnson",
          position: "VP of Engineering",
          company: "TechCorp",
          content:
            "Working with this data scientist was transformative for our business. The ML models delivered exceeded our expectations and provided actionable insights that drove real revenue growth.",
          rating: 5,
          imageUrl:
            "https://images.unsplash.com/photo-1494790108755-2616b612b786?w=100&h=100&fit=crop&crop=face",
          isPublished: true,
          order: 1,
        },
        {
          name: "Michael Chen",
          position: "CTO",
          company: "DataFlow Solutions",
          content:
            "Exceptional technical skills combined with clear communication. The analytics platform built for us processes millions of events daily with perfect reliability.",
          rating: 5,
          imageUrl:
            "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop&crop=face",
          isPublished: true,
          order: 2,
        },
        {
          name: "Emily Rodriguez",
          position: "Head of Data",
          company: "Growth Analytics",
          content:
            "The forecasting models developed for our team improved our prediction accuracy by 35%. The implementation was seamless and the documentation was excellent.",
          rating: 5,
          imageUrl:
            "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&h=100&fit=crop&crop=face",
          isPublished: true,
          order: 3,
        },
      ];
      for (const t of testimonials) {
        await ctx.db.insert("testimonials", t);
        insertedTestimonials++;
      }
    }

    if (!hasSkills) {
      const skills = [
        { name: "Python", category: "Programming Languages", proficiency: 95, yearsOfExperience: 6, order: 1, isVisible: true },
        { name: "R", category: "Programming Languages", proficiency: 85, yearsOfExperience: 4, order: 2, isVisible: true },
        { name: "SQL", category: "Programming Languages", proficiency: 90, yearsOfExperience: 5, order: 3, isVisible: true },
        { name: "JavaScript", category: "Programming Languages", proficiency: 80, yearsOfExperience: 4, order: 4, isVisible: true },
        { name: "Rust", category: "Programming Languages", proficiency: 75, yearsOfExperience: 1, order: 5, isVisible: true },
        { name: "Machine Learning", category: "Data Science & ML", proficiency: 92, yearsOfExperience: 5, order: 1, isVisible: true },
        { name: "Deep Learning", category: "Data Science & ML", proficiency: 85, yearsOfExperience: 3, order: 2, isVisible: true },
        { name: "Statistical Analysis", category: "Data Science & ML", proficiency: 90, yearsOfExperience: 5, order: 3, isVisible: true },
        { name: "Time Series Analysis", category: "Data Science & ML", proficiency: 88, yearsOfExperience: 4, order: 4, isVisible: true },
        { name: "AWS", category: "Tools & Technologies", proficiency: 85, yearsOfExperience: 4, order: 1, isVisible: true },
        { name: "Docker", category: "Tools & Technologies", proficiency: 80, yearsOfExperience: 3, order: 2, isVisible: true },
        { name: "Git", category: "Tools & Technologies", proficiency: 90, yearsOfExperience: 6, order: 3, isVisible: true },
        { name: "Tableau", category: "Tools & Technologies", proficiency: 85, yearsOfExperience: 4, order: 4, isVisible: true },
      ];
      for (const s of skills) {
        await ctx.db.insert("skills", s);
        insertedSkills++;
      }
    }

    // Ensure Rust exists even if skills were already present
    const allSkills = await ctx.db.query("skills").collect();
    if (!allSkills.some((s) => s.name === "Rust")) {
      await ctx.db.insert("skills", {
        name: "Rust",
        category: "Programming Languages",
        proficiency: 75,
        yearsOfExperience: 1,
        order: 5,
        isVisible: true,
      });
      insertedSkills++;
    }

    return {
      inserted: {
        projects: insertedProjects,
        blogs: insertedBlogs,
        testimonials: insertedTestimonials,
        skills: insertedSkills,
      },
      alreadyHadData: {
        projects: !!hasProjects,
        blogs: !!hasBlogs,
        testimonials: !!hasTestimonials,
        skills: !!hasSkills,
      },
    };
  },
});