import Navigation from "@/components/Navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { useQuery, useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import { motion } from "framer-motion";
import {
  ArrowRight,
  ExternalLink,
  Github,
  Mail,
  Phone,
  MapPin,
  Star,
  Calendar as CalendarIcon,
  Clock,
  Download,
  Filter,
  Search,
  ChevronLeft,
  ChevronRight,
  Code,
  Database,
  Brain,
  Linkedin,
  Twitter,
} from "lucide-react";
import { useState, useEffect } from "react";
import { toast } from "sonner";
import { format } from "date-fns";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

type ProjectCategory =
  | "Data Analysis"
  | "Software Development"
  | "Machine Learning";
type BlogCategory = "Tutorials" | "Industry Trends" | "Case Studies";
type ConsultationType = "Data Science" | "Software Engineering";
type BookingForm = {
  clientName: string;
  clientEmail: string;
  clientPhone: string;
  consultationType: "" | ConsultationType;
  message: string;
};

export default function Portfolio() {
  const [selectedProjectCategory, setSelectedProjectCategory] = useState<
    ProjectCategory | "all"
  >("all");
  const [selectedBlogCategory, setSelectedBlogCategory] = useState<
    BlogCategory | "all"
  >("all");
  const [blogSearch, setBlogSearch] = useState("");
  const [currentTestimonial, setCurrentTestimonial] = useState(0);
  const [selectedDate, setSelectedDate] = useState<Date>();
  const [selectedTime, setSelectedTime] = useState<string>();
  const [bookingForm, setBookingForm] = useState<BookingForm>({
    clientName: "",
    clientEmail: "",
    clientPhone: "",
    consultationType: "",
    message: "",
  });
  const [contactForm, setContactForm] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
  });
  const [selectedProject, setSelectedProject] = useState<any | null>(null);
  const [isProjectModalOpen, setIsProjectModalOpen] = useState(false);
  const [bookingHoneypot, setBookingHoneypot] = useState("");
  const [contactHoneypot, setContactHoneypot] = useState("");

  // Blog pagination state
  const [blogCursor, setBlogCursor] = useState<string | null>(null);
  const [cursorStack, setCursorStack] = useState<Array<string | null>>([]);

  // Queries
  const featuredProjects = useQuery(api.projects.getFeaturedProjects);
  const allProjects = useQuery(api.projects.getPublishedProjects, {
    category:
      selectedProjectCategory === "all" ? undefined : selectedProjectCategory,
  });
  const featuredBlogs = useQuery(api.blogs.getFeaturedBlogs);
  const blogsPage = useQuery(api.blogs.getPublishedBlogsPaginated, {
    paginationOpts: { numItems: 6, cursor: blogCursor },
    category: selectedBlogCategory === "all" ? undefined : selectedBlogCategory,
    search: blogSearch || undefined,
  });
  const testimonials = useQuery(api.testimonials.getPublishedTestimonials);
  const skills = useQuery(api.skills.getVisibleSkills);
  const availableSlots = useQuery(
    api.bookings.getAvailableSlots,
    selectedDate ? { date: format(selectedDate, "yyyy-MM-dd") } : "skip",
  );

  // Mutations
  const createBooking = useMutation(api.bookings.createBooking);
  const createContact = useMutation(api.contacts.createContact);
  const seedPublicDemoIfEmpty = useMutation(
    api.sampleData.seedPublicDemoIfEmpty,
  );

  // Auto-rotate testimonials
  useEffect(() => {
    if (testimonials && testimonials.length > 1) {
      const interval = setInterval(() => {
        setCurrentTestimonial((prev) => (prev + 1) % testimonials.length);
      }, 5000);
      return () => clearInterval(interval);
    }
  }, [testimonials]);

  useEffect(() => {
    let mounted = true;
    (async () => {
      try {
        const res = await seedPublicDemoIfEmpty();
        if (!mounted) return;
        const totalInserted =
          (res?.inserted?.projects ?? 0) +
          (res?.inserted?.blogs ?? 0) +
          (res?.inserted?.testimonials ?? 0) +
          (res?.inserted?.skills ?? 0);
        if (totalInserted > 0) {
          toast.success("Loaded demo content for the portfolio.");
        }
      } catch {
        // Silently ignore; page will still work if data already exists
      }
    })();
    return () => {
      mounted = false;
    };
  }, [seedPublicDemoIfEmpty]);

  useEffect(() => {
    setBlogCursor(null);
    setCursorStack([]);
  }, [selectedBlogCategory, blogSearch]);

  const handleBookingSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedDate || !selectedTime || !bookingForm.consultationType) {
      toast.error("Please fill in all required fields");
      return;
    }
    // Spam honeypot check
    if (bookingHoneypot.trim().length > 0) {
      toast.error("Submission blocked.");
      return;
    }

    try {
      const sessionDate = new Date(selectedDate);
      const [hour] = selectedTime.split(":");
      sessionDate.setHours(parseInt(hour), 0, 0, 0);

      const consultationType = bookingForm.consultationType as ConsultationType;

      await createBooking({
        clientName: bookingForm.clientName,
        clientEmail: bookingForm.clientEmail,
        clientPhone: bookingForm.clientPhone,
        consultationType,
        sessionDate: sessionDate.getTime(),
        sessionDuration: 60,
        message: bookingForm.message,
        price: consultationType === "Data Science" ? 150 : 120,
        honeypot: bookingHoneypot || undefined,
      });

      toast.success(
        "Booking request submitted! You'll receive a confirmation email shortly.",
      );
      setBookingForm({
        clientName: "",
        clientEmail: "",
        clientPhone: "",
        consultationType: "",
        message: "",
      });
      setSelectedDate(undefined);
      setSelectedTime(undefined);
      setBookingHoneypot("");
    } catch (error: any) {
      toast.error(
        error?.message ?? "Failed to submit booking. Please try again.",
      );
    }
  };

  const handleContactSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    // Spam honeypot check
    if (contactHoneypot.trim().length > 0) {
      toast.error("Submission blocked.");
      return;
    }
    try {
      await createContact({
        ...contactForm,
        honeypot: contactHoneypot || undefined,
      });
      toast.success("Message sent successfully! I'll get back to you soon.");
      setContactForm({
        name: "",
        email: "",
        subject: "",
        message: "",
      });
      setContactHoneypot("");
    } catch (error: any) {
      toast.error(
        error?.message ?? "Failed to send message. Please try again.",
      );
    }
  };

  const openProjectModal = (project: any) => {
    setSelectedProject(project);
    setIsProjectModalOpen(true);
  };

  return (
    <div className="min-h-screen bg-background overflow-x-hidden">
      <Navigation />

      <main id="main-content">
        {/* Hero Section */}
        <section className="pt-24 pb-16 px-4">
          <div className="max-w-7xl mx-auto">
            <div className="grid lg:grid-cols-2 gap-12 items-center">
              <motion.div
                initial={{ opacity: 0, x: -50 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.8 }}
              >
                {/* Added name */}
                <p className="text-sm uppercase tracking-wider text-muted-foreground mb-2">
                  Prince NZAMUWE
                </p>
                <h1 className="text-5xl lg:text-6xl font-bold tracking-tight mb-6">
                  Turning Data into{" "}
                  <span className="text-primary">Actionable Insights</span>
                </h1>
                <p className="text-xl text-muted-foreground mb-8 leading-relaxed">
                  Data Scientist & Software Engineer passionate about building
                  intelligent solutions that drive business impact through
                  advanced analytics and machine learning.
                </p>
                <div className="flex flex-col sm:flex-row gap-4">
                  <Button
                    size="lg"
                    onClick={() =>
                      document
                        .getElementById("projects")
                        ?.scrollIntoView({ behavior: "smooth" })
                    }
                    className="cursor-pointer"
                  >
                    View Portfolio <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                  <Button
                    variant="outline"
                    size="lg"
                    onClick={() =>
                      document
                        .getElementById("booking")
                        ?.scrollIntoView({ behavior: "smooth" })
                    }
                    className="cursor-pointer"
                  >
                    Book Consultation
                  </Button>
                </div>
              </motion.div>
              <motion.div
                initial={{ opacity: 0, x: 50 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.8, delay: 0.2 }}
                className="relative overflow-hidden"
              >
                <div className="relative w-full max-w-md mx-auto">
                  <div className="absolute inset-0 bg-gradient-to-r from-primary/20 to-secondary/20 rounded-full blur-3xl"></div>
                  <img
                    src="https://harmless-tapir-303.convex.cloud/api/storage/04e51f83-3dc9-4fbb-bd9b-319f29d91888"
                    alt="Professional headshot"
                    className="relative rounded-full w-full h-auto border-4 border-background shadow-2xl"
                    width="600"
                    height="600"
                    loading="eager"
                    decoding="async"
                    fetchPriority="high"
                    referrerPolicy="no-referrer"
                    onError={(e) => {
                      e.currentTarget.onerror = null;
                      e.currentTarget.src =
                        "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=600&h=600&fit=crop&crop=faces&auto=format&q=70";
                    }}
                  />
                </div>
              </motion.div>
            </div>
          </div>
        </section>

        {/* About Section */}
        <section id="about" className="py-16 px-4 bg-muted/30">
          <div className="max-w-7xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
              className="text-center mb-16"
            >
              <h2 className="text-4xl font-bold tracking-tight mb-4">
                About Me
              </h2>
              <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
                With over 5 years of experience in data science and software
                engineering, I specialize in building end-to-end solutions that
                transform complex data into strategic business value.
              </p>
            </motion.div>

            <div className="grid lg:grid-cols-2 gap-12 items-start">
              <motion.div
                initial={{ opacity: 0, x: -50 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.8 }}
                viewport={{ once: true }}
              >
                <h3 className="text-2xl font-semibold mb-6">My Journey</h3>
                <div className="space-y-4 text-muted-foreground">
                  <p>
                    I started my career as a software engineer, building
                    scalable web applications and APIs. My curiosity about the
                    data flowing through these systems led me to pursue data
                    science, where I discovered my passion for extracting
                    insights from complex datasets.
                  </p>
                  <p>
                    Today, I bridge the gap between data science and
                    engineering, creating production-ready ML systems that solve
                    real business problems. I've worked with startups and
                    Fortune 500 companies, delivering solutions in finance,
                    healthcare, and e-commerce.
                  </p>
                  <p>
                    When I'm not coding or analyzing data, you'll find me
                    contributing to open-source projects, writing technical
                    blogs, or mentoring aspiring data scientists.
                  </p>
                </div>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, x: 50 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.8, delay: 0.2 }}
                viewport={{ once: true }}
              >
                <h3 className="text-2xl font-semibold mb-6">
                  Skills & Expertise
                </h3>
                {skills &&
                  Object.entries(skills).map(([category, categorySkills]) => (
                    <div key={category} className="mb-6">
                      <h4 className="font-medium mb-3 text-primary">
                        {category}
                      </h4>
                      <div className="space-y-3">
                        {categorySkills.map((skill) => (
                          <div key={skill._id}>
                            <div className="flex justify-between text-sm mb-1">
                              <span>{skill.name}</span>
                              <span>{skill.proficiency}%</span>
                            </div>
                            <div className="w-full bg-muted rounded-full h-2">
                              <motion.div
                                initial={{ width: 0 }}
                                whileInView={{ width: `${skill.proficiency}%` }}
                                transition={{ duration: 1, delay: 0.5 }}
                                viewport={{ once: true }}
                                className="bg-primary h-2 rounded-full"
                              />
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
              </motion.div>
            </div>
          </div>
        </section>

        {/* Projects Section */}
        <section id="projects" className="py-16 px-4">
          <div className="max-w-7xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
              className="text-center mb-16"
            >
              <h2 className="text-4xl font-bold tracking-tight mb-4">
                Featured Projects
              </h2>
              <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
                A showcase of my work in data science, machine learning, and
                software engineering
              </p>
            </motion.div>

            {/* Project Filters */}
            <div className="flex flex-wrap gap-4 justify-center mb-12">
              {(
                [
                  "all",
                  "Data Analysis",
                  "Software Development",
                  "Machine Learning",
                ] as const
              ).map((category) => (
                <Button
                  key={category}
                  variant={
                    selectedProjectCategory === category ? "default" : "outline"
                  }
                  onClick={() => setSelectedProjectCategory(category)}
                  className="cursor-pointer"
                >
                  {category === "all" ? "All Projects" : category}
                </Button>
              ))}
            </div>

            {/* Projects Grid with skeletons and modal trigger */}
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {(
                (selectedProjectCategory === "all"
                  ? featuredProjects
                  : allProjects) ?? Array.from({ length: 6 }, () => null)
              ).map((project, index) => (
                <motion.div
                  key={project ? project._id : `skeleton-${index}`}
                  initial={{ opacity: 0, y: 50 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.8, delay: index * 0.1 }}
                  viewport={{ once: true }}
                >
                  {project ? (
                    <Card
                      className="h-full hover:shadow-lg transition-shadow cursor-pointer group"
                      onClick={() => openProjectModal(project)}
                    >
                      <div className="relative overflow-hidden rounded-t-lg">
                        <img
                          src={
                            project.imageUrl ||
                            "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=400&fit=crop&crop=face&auto=format&q=70"
                          }
                          alt={project.title}
                          loading="lazy"
                          decoding="async"
                          width={800}
                          height={384}
                          className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
                        />
                        <div className="absolute top-4 left-4">
                          <Badge variant="secondary">{project.category}</Badge>
                        </div>
                      </div>
                      <CardContent className="p-6">
                        <h3 className="text-xl font-semibold mb-2">
                          {project.title}
                        </h3>
                        <p className="text-muted-foreground mb-4">
                          {project.description}
                        </p>
                        <div className="flex flex-wrap gap-2 mb-4">
                          {project.tags.map((tag: string) => (
                            <Badge
                              key={tag}
                              variant="outline"
                              className="text-xs"
                            >
                              {tag}
                            </Badge>
                          ))}
                        </div>
                        <div className="flex gap-2">
                          {project.liveUrl && (
                            <Button size="sm" variant="outline" asChild>
                              <a
                                href={project.liveUrl}
                                target="_blank"
                                rel="noopener noreferrer"
                              >
                                <ExternalLink className="h-4 w-4 mr-2" />
                                Live Demo
                              </a>
                            </Button>
                          )}
                          {project.githubUrl && (
                            <Button size="sm" variant="outline" asChild>
                              <a
                                href={project.githubUrl}
                                target="_blank"
                                rel="noopener noreferrer"
                              >
                                <Github className="h-4 w-4 mr-2" />
                                Code
                              </a>
                            </Button>
                          )}
                        </div>
                      </CardContent>
                    </Card>
                  ) : (
                    <Card className="h-full">
                      <div className="relative overflow-hidden rounded-t-lg">
                        <div className="w-full h-48">
                          <div className="bg-muted/50 w-full h-full animate-pulse" />
                        </div>
                      </div>
                      <CardContent className="p-6 space-y-3">
                        <div className="h-6 w-2/3 bg-muted/50 animate-pulse rounded" />
                        <div className="h-4 w-full bg-muted/50 animate-pulse rounded" />
                        <div className="flex gap-2">
                          <div className="h-6 w-20 bg-muted/50 animate-pulse rounded" />
                          <div className="h-6 w-16 bg-muted/50 animate-pulse rounded" />
                        </div>
                      </CardContent>
                    </Card>
                  )}
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* Project Detail Modal */}
        <Dialog open={isProjectModalOpen} onOpenChange={setIsProjectModalOpen}>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>{selectedProject?.title}</DialogTitle>
            </DialogHeader>
            {selectedProject && (
              <div className="space-y-4">
                <img
                  src={
                    selectedProject.imageUrl ||
                    "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=800&h=400&fit=crop&auto=format&q=70"
                  }
                  alt={selectedProject.title}
                  loading="lazy"
                  decoding="async"
                  width={1200}
                  height={600}
                  className="w-full h-56 object-cover rounded-md"
                />
                <p className="text-muted-foreground">
                  {selectedProject.longDescription ||
                    selectedProject.description}
                </p>
                <div className="flex flex-wrap gap-2">
                  {selectedProject.tags?.map((t: string) => (
                    <Badge key={t} variant="outline">
                      {t}
                    </Badge>
                  ))}
                </div>
                <div className="flex gap-2 pt-2">
                  {selectedProject.liveUrl && (
                    <Button asChild>
                      <a
                        href={selectedProject.liveUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        <ExternalLink className="mr-2 h-4 w-4" /> Live
                      </a>
                    </Button>
                  )}
                  {selectedProject.githubUrl && (
                    <Button variant="outline" asChild>
                      <a
                        href={selectedProject.githubUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        <Github className="mr-2 h-4 w-4" /> Code
                      </a>
                    </Button>
                  )}
                </div>
              </div>
            )}
          </DialogContent>
        </Dialog>

        {/* Resume Section */}
        <section id="resume" className="py-16 px-4 bg-muted/30">
          <div className="max-w-4xl mx-auto text-center">
            <motion.div
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
            >
              <h2 className="text-4xl font-bold tracking-tight mb-4">Resume</h2>
              <p className="text-xl text-muted-foreground mb-8">
                Download my complete resume or view my experience below
              </p>
              <Button size="lg" className="cursor-pointer" asChild>
                <a href="/resume.pdf" download>
                  <Download className="mr-2 h-4 w-4" />
                  Download PDF Resume
                </a>
              </Button>
            </motion.div>

            {/* Interactive Resume Preview */}
            <motion.div
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              viewport={{ once: true }}
              className="mt-12"
            >
              <Card className="p-8 text-left">
                <div className="space-y-8">
                  <div>
                    <h3 className="text-2xl font-semibold mb-4">Experience</h3>
                    <div className="space-y-6">
                      <div className="border-l-2 border-primary pl-6">
                        <h4 className="text-lg font-medium">
                          Senior Data Scientist
                        </h4>
                        <p className="text-primary">
                          TechCorp Inc. • 2022 - Present
                        </p>
                        <p className="text-muted-foreground mt-2">
                          Lead data science initiatives, built ML models that
                          increased revenue by 25%, managed team of 4 data
                          scientists.
                        </p>
                      </div>
                      <div className="border-l-2 border-muted pl-6">
                        <h4 className="text-lg font-medium">Data Scientist</h4>
                        <p className="text-muted-foreground">
                          DataFlow Solutions • 2020 - 2022
                        </p>
                        <p className="text-muted-foreground mt-2">
                          Developed predictive models, automated data pipelines,
                          reduced processing time by 60%.
                        </p>
                      </div>
                    </div>
                  </div>

                  <div>
                    <h3 className="text-2xl font-semibold mb-4">Education</h3>
                    <div className="border-l-2 border-primary pl-6">
                      <h4 className="text-lg font-medium">
                        Bachelors of Science in Data Science and Analytics
                      </h4>
                      <p className="text-primary">
                        United States International University-Africa
                        (USIU-Africa) • 2024 - Present
                      </p>
                      <p className="text-muted-foreground mt-2">
                        Focus on applied data science, analytics, and machine
                        learning.
                      </p>
                    </div>
                  </div>
                </div>
              </Card>
            </motion.div>
          </div>
        </section>

        {/* Blog Section */}
        <section id="blog" className="py-16 px-4">
          <div className="max-w-7xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
              className="text-center mb-16"
            >
              <h2 className="text-4xl font-bold tracking-tight mb-4">
                Latest Blog Posts
              </h2>
              <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
                Insights, tutorials, and thoughts on data science and technology
              </p>
            </motion.div>

            {/* Blog Filters and Search */}
            <div className="flex flex-col md:flex-row gap-4 mb-12">
              <div className="flex flex-wrap gap-2">
                {(
                  [
                    "all",
                    "Tutorials",
                    "Industry Trends",
                    "Case Studies",
                  ] as const
                ).map((category) => (
                  <Button
                    key={category}
                    variant={
                      selectedBlogCategory === category ? "default" : "outline"
                    }
                    onClick={() => setSelectedBlogCategory(category)}
                    className="cursor-pointer"
                  >
                    {category === "all" ? "All Posts" : category}
                  </Button>
                ))}
              </div>
              <div className="relative flex-1 max-w-md">
                <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search posts..."
                  value={blogSearch}
                  onChange={(e) => setBlogSearch(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>

            {/* Blog Posts Grid with skeletons and pagination */}
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {(blogsPage?.page ?? Array.from({ length: 6 }, () => null)).map(
                (post: any, index: number) => (
                  <motion.div
                    key={post ? post._id : `blog-skeleton-${index}`}
                    initial={{ opacity: 0, y: 50 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, delay: index * 0.1 }}
                    viewport={{ once: true }}
                  >
                    {post ? (
                      <Card className="h-full hover:shadow-lg transition-shadow cursor-pointer group">
                        <div className="relative overflow-hidden rounded-t-lg">
                          <img
                            src={
                              post.imageUrl ||
                              "https://images.unsplash.com/photo-1504868584819-f8e8b4b6d7e3?w=800&h=400&fit=crop&auto=format&q=70"
                            }
                            alt={post.title}
                            loading="lazy"
                            decoding="async"
                            width={800}
                            height={384}
                            className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
                          />
                          <div className="absolute top-4 left-4">
                            <Badge variant="secondary">{post.category}</Badge>
                          </div>
                        </div>
                        <CardContent className="p-6">
                          <h3 className="text-xl font-semibold mb-2">
                            {post.title}
                          </h3>
                          <p className="text-muted-foreground mb-4">
                            {post.excerpt}
                          </p>
                          <div className="flex items-center justify-between text-sm text-muted-foreground mb-4">
                            <span>{post.readTime} min read</span>
                            <span>{post.views} views</span>
                          </div>
                          <div className="flex gap-2">
                            {/* Share buttons */}
                            <Button variant="outline" size="sm" asChild>
                              <a
                                href={`https://twitter.com/intent/tweet?text=${encodeURIComponent(post.title)}&url=${encodeURIComponent(window.location.origin + "/#blog")}`}
                                target="_blank"
                                rel="noopener noreferrer"
                                aria-label="Share on Twitter"
                              >
                                Share on X
                              </a>
                            </Button>
                            <Button variant="outline" size="sm" asChild>
                              <a
                                href={`https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(window.location.origin + "/#blog")}`}
                                target="_blank"
                                rel="noopener noreferrer"
                                aria-label="Share on LinkedIn"
                              >
                                Share on LinkedIn
                              </a>
                            </Button>
                          </div>
                        </CardContent>
                      </Card>
                    ) : (
                      <Card className="h-full">
                        <div className="w-full h-48 bg-muted/50 animate-pulse rounded-t-lg" />
                        <CardContent className="p-6 space-y-3">
                          <div className="h-6 w-2/3 bg-muted/50 animate-pulse rounded" />
                          <div className="h-4 w-full bg-muted/50 animate-pulse rounded" />
                          <div className="h-4 w-1/2 bg-muted/50 animate-pulse rounded" />
                        </CardContent>
                      </Card>
                    )}
                  </motion.div>
                ),
              )}
            </div>

            {/* Pagination Controls */}
            <div className="flex items-center justify-center gap-3 mt-8">
              <Button
                variant="outline"
                disabled={cursorStack.length === 0}
                onClick={() => {
                  const stack = [...cursorStack];
                  stack.pop(); // remove current
                  const prev = stack[stack.length - 1] ?? null;
                  setCursorStack(stack);
                  setBlogCursor(prev);
                }}
                className="cursor-pointer"
              >
                Previous
              </Button>
              <Button
                variant="outline"
                disabled={!blogsPage?.continueCursor || blogsPage?.isDone}
                onClick={() => {
                  setCursorStack((s) => [
                    ...s,
                    blogsPage?.continueCursor ?? null,
                  ]);
                  setBlogCursor(blogsPage?.continueCursor ?? null);
                }}
                className="cursor-pointer"
              >
                Next
              </Button>
            </div>
          </div>
        </section>

        {/* Testimonials Section */}
        <section id="testimonials" className="py-16 px-4 bg-muted/30">
          <div className="max-w-4xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
              className="text-center mb-16"
            >
              <h2 className="text-4xl font-bold tracking-tight mb-4">
                What Clients Say
              </h2>
              <p className="text-xl text-muted-foreground">
                Testimonials from colleagues and clients I've worked with
              </p>
            </motion.div>

            {testimonials && testimonials.length > 0 && (
              <motion.div
                key={currentTestimonial}
                initial={{ opacity: 0, x: 50 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -50 }}
                transition={{ duration: 0.5 }}
                className="relative"
              >
                <Card className="p-8 text-center">
                  <div className="flex justify-center mb-4">
                    {[...Array(testimonials[currentTestimonial].rating)].map(
                      (_, i) => (
                        <Star
                          key={i}
                          className="h-5 w-5 fill-primary text-primary"
                        />
                      ),
                    )}
                  </div>
                  <blockquote className="text-xl italic mb-6">
                    "{testimonials[currentTestimonial].content}"
                  </blockquote>
                  <div className="flex items-center justify-center space-x-4">
                    {testimonials[currentTestimonial].imageUrl && (
                      <img
                        src={testimonials[currentTestimonial].imageUrl}
                        alt={testimonials[currentTestimonial].name}
                        className="w-12 h-12 rounded-full"
                      />
                    )}
                    <div>
                      <p className="font-semibold">
                        {testimonials[currentTestimonial].name}
                      </p>
                      <p className="text-muted-foreground">
                        {testimonials[currentTestimonial].position} at{" "}
                        {testimonials[currentTestimonial].company}
                      </p>
                    </div>
                    {testimonials[currentTestimonial].companyLogo && (
                      <img
                        src={testimonials[currentTestimonial].companyLogo}
                        alt={testimonials[currentTestimonial].company}
                        className="w-8 h-8"
                      />
                    )}
                  </div>
                </Card>

                {/* Navigation */}
                {testimonials.length > 1 && (
                  <div className="flex justify-center mt-6 space-x-4">
                    <Button
                      variant="outline"
                      size="icon"
                      onClick={() =>
                        setCurrentTestimonial((prev) =>
                          prev === 0 ? testimonials.length - 1 : prev - 1,
                        )
                      }
                      className="cursor-pointer"
                    >
                      <ChevronLeft className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="outline"
                      size="icon"
                      onClick={() =>
                        setCurrentTestimonial(
                          (prev) => (prev + 1) % testimonials.length,
                        )
                      }
                      className="cursor-pointer"
                    >
                      <ChevronRight className="h-4 w-4" />
                    </Button>
                  </div>
                )}
              </motion.div>
            )}
          </div>
        </section>

        {/* Booking Section */}
        <section id="booking" className="py-16 px-4">
          <div className="max-w-4xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
              className="text-center mb-16"
            >
              <h2 className="text-4xl font-bold tracking-tight mb-4">
                Book a Consultation
              </h2>
              <p className="text-xl text-muted-foreground">
                Schedule a session to discuss your data science or software
                engineering needs
              </p>
            </motion.div>

            <div className="grid lg:grid-cols-2 gap-12">
              {/* Consultation Types */}
              <motion.div
                initial={{ opacity: 0, x: -50 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.8 }}
                viewport={{ once: true }}
              >
                <h3 className="text-2xl font-semibold mb-6">
                  Consultation Types
                </h3>
                <div className="space-y-4">
                  <Card className="p-6">
                    <div className="flex items-start space-x-4">
                      <Database className="h-8 w-8 text-primary mt-1" />
                      <div>
                        <h4 className="text-lg font-semibold">
                          Data Science Consultation
                        </h4>
                        <p className="text-muted-foreground mb-2">
                          ML strategy, model development, data analysis guidance
                        </p>
                        <p className="text-2xl font-bold text-primary">
                          $150/hour
                        </p>
                      </div>
                    </div>
                  </Card>
                  <Card className="p-6">
                    <div className="flex items-start space-x-4">
                      <Code className="h-8 w-8 text-primary mt-1" />
                      <div>
                        <h4 className="text-lg font-semibold">
                          Software Engineering
                        </h4>
                        <p className="text-muted-foreground mb-2">
                          Architecture review, code optimization, technical
                          mentoring
                        </p>
                        <p className="text-2xl font-bold text-primary">
                          $120/hour
                        </p>
                      </div>
                    </div>
                  </Card>
                </div>
              </motion.div>

              {/* Booking Form */}
              <motion.div
                initial={{ opacity: 0, x: 50 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.8, delay: 0.2 }}
                viewport={{ once: true }}
              >
                <Card className="p-6">
                  <form onSubmit={handleBookingSubmit} className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="text-sm font-medium">Name *</label>
                        <Input
                          required
                          value={bookingForm.clientName}
                          onChange={(e) =>
                            setBookingForm((prev) => ({
                              ...prev,
                              clientName: e.target.value,
                            }))
                          }
                        />
                      </div>
                      <div>
                        <label className="text-sm font-medium">Email *</label>
                        <Input
                          type="email"
                          required
                          value={bookingForm.clientEmail}
                          onChange={(e) =>
                            setBookingForm((prev) => ({
                              ...prev,
                              clientEmail: e.target.value,
                            }))
                          }
                        />
                      </div>
                    </div>

                    <div>
                      <label className="text-sm font-medium">Phone</label>
                      <Input
                        value={bookingForm.clientPhone}
                        onChange={(e) =>
                          setBookingForm((prev) => ({
                            ...prev,
                            clientPhone: e.target.value,
                          }))
                        }
                      />
                    </div>

                    <div>
                      <label className="text-sm font-medium">
                        Consultation Type *
                      </label>
                      <Select
                        value={bookingForm.consultationType}
                        onValueChange={(value) =>
                          setBookingForm((prev) => ({
                            ...prev,
                            consultationType: value as ConsultationType,
                          }))
                        }
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select consultation type" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="Data Science">
                            Data Science ($150/hr)
                          </SelectItem>
                          <SelectItem value="Software Engineering">
                            Software Engineering ($120/hr)
                          </SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div>
                      <label className="text-sm font-medium">
                        Preferred Date *
                      </label>
                      <Popover>
                        <PopoverTrigger asChild>
                          <Button
                            variant="outline"
                            className="w-full justify-start cursor-pointer"
                          >
                            <CalendarIcon className="mr-2 h-4 w-4" />
                            {selectedDate
                              ? format(selectedDate, "PPP")
                              : "Pick a date"}
                          </Button>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0">
                          <Calendar
                            mode="single"
                            selected={selectedDate}
                            onSelect={setSelectedDate}
                            disabled={(date) =>
                              date < new Date() ||
                              date.getDay() === 0 ||
                              date.getDay() === 6
                            }
                          />
                        </PopoverContent>
                      </Popover>
                    </div>

                    {selectedDate && availableSlots && (
                      <div>
                        <label className="text-sm font-medium">
                          Available Times *
                        </label>
                        <Select
                          value={selectedTime}
                          onValueChange={setSelectedTime}
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Select time" />
                          </SelectTrigger>
                          <SelectContent>
                            {availableSlots.map((slot) => (
                              <SelectItem key={slot.time} value={slot.display}>
                                {slot.display}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                    )}

                    <div>
                      <label className="text-sm font-medium">Message</label>
                      <Textarea
                        placeholder="Tell me about your project or questions..."
                        value={bookingForm.message}
                        onChange={(e) =>
                          setBookingForm((prev) => ({
                            ...prev,
                            message: e.target.value,
                          }))
                        }
                      />
                    </div>

                    <input
                      type="text"
                      tabIndex={-1}
                      autoComplete="off"
                      className="hidden"
                      aria-hidden="true"
                      name="company"
                      value={bookingHoneypot}
                      onChange={(e) => setBookingHoneypot(e.target.value)}
                    />

                    <Button type="submit" className="w-full cursor-pointer">
                      <Clock className="mr-2 h-4 w-4" />
                      Book Consultation
                    </Button>
                  </form>
                </Card>
              </motion.div>
            </div>
          </div>
        </section>

        {/* Contact Section */}
        <section id="contact" className="py-16 px-4 bg-muted/30">
          <div className="max-w-4xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
              className="text-center mb-16"
            >
              <h2 className="text-4xl font-bold tracking-tight mb-4">
                Get In Touch
              </h2>
              <p className="text-xl text-muted-foreground">
                Have a question or want to work together? I'd love to hear from
                you.
              </p>
            </motion.div>

            <div className="grid lg:grid-cols-2 gap-12">
              {/* Contact Info */}
              <motion.div
                initial={{ opacity: 0, x: -50 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.8 }}
                viewport={{ once: true }}
              >
                <h3 className="text-2xl font-semibold mb-6">Let's Connect</h3>
                <div className="space-y-4">
                  <div className="flex items-center space-x-4">
                    <Mail className="h-5 w-5 text-primary" />
                    <span>prince@nzamuwe.com</span>
                  </div>
                  <div className="flex items-center space-x-4">
                    <Phone className="h-5 w-5 text-primary" />
                    <span>+254757723708</span>
                  </div>
                  <div className="flex items-center space-x-4">
                    <MapPin className="h-5 w-5 text-primary" />
                    <span>Nairobi, Kenya</span>
                  </div>
                </div>

                <div className="mt-8">
                  <h4 className="font-semibold mb-4">Follow Me</h4>
                  <div className="flex space-x-4">
                    <Button variant="outline" size="icon" asChild>
                      <a
                        href="https://www.linkedin.com/in/princenzmw/"
                        target="_blank"
                        rel="noopener noreferrer"
                        aria-label="Open LinkedIn profile"
                      >
                        <Linkedin className="h-4 w-4" />
                      </a>
                    </Button>
                    <Button variant="outline" size="icon" asChild>
                      <a
                        href="https://github.com/princenzmw"
                        target="_blank"
                        rel="noopener noreferrer"
                        aria-label="Open GitHub profile"
                      >
                        <Github className="h-4 w-4" />
                      </a>
                    </Button>
                    <Button variant="outline" size="icon" asChild>
                      <a
                        href="https://twitter.com/princenzmw"
                        target="_blank"
                        rel="noopener noreferrer"
                        aria-label="Open Twitter profile"
                      >
                        <Twitter className="h-4 w-4" />
                      </a>
                    </Button>
                  </div>
                </div>
              </motion.div>

              {/* Contact Form */}
              <motion.div
                initial={{ opacity: 0, x: 50 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.8, delay: 0.2 }}
                viewport={{ once: true }}
              >
                <Card className="p-6">
                  <form onSubmit={handleContactSubmit} className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="text-sm font-medium">Name *</label>
                        <Input
                          required
                          value={contactForm.name}
                          onChange={(e) =>
                            setContactForm((prev) => ({
                              ...prev,
                              name: e.target.value,
                            }))
                          }
                        />
                      </div>
                      <div>
                        <label className="text-sm font-medium">Email *</label>
                        <Input
                          type="email"
                          required
                          value={contactForm.email}
                          onChange={(e) =>
                            setContactForm((prev) => ({
                              ...prev,
                              email: e.target.value,
                            }))
                          }
                        />
                      </div>
                    </div>

                    <div>
                      <label className="text-sm font-medium">Subject</label>
                      <Input
                        value={contactForm.subject}
                        onChange={(e) =>
                          setContactForm((prev) => ({
                            ...prev,
                            subject: e.target.value,
                          }))
                        }
                      />
                    </div>

                    <div>
                      <label className="text-sm font-medium">Message *</label>
                      <Textarea
                        required
                        rows={5}
                        value={contactForm.message}
                        onChange={(e) =>
                          setContactForm((prev) => ({
                            ...prev,
                            message: e.target.value,
                          }))
                        }
                      />
                    </div>

                    <input
                      type="text"
                      tabIndex={-1}
                      autoComplete="off"
                      className="hidden"
                      aria-hidden="true"
                      name="company"
                      value={contactHoneypot}
                      onChange={(e) => setContactHoneypot(e.target.value)}
                    />

                    <Button type="submit" className="w-full cursor-pointer">
                      Send Message
                    </Button>
                  </form>
                </Card>
              </motion.div>
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="bg-background border-t py-12 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="grid md:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center space-x-2 mb-4">
                <img
                  src="https://harmless-tapir-303.convex.cloud/api/storage/04e51f83-3dc9-4fbb-bd9b-319f29d91888"
                  alt="Prince Logo"
                  className="h-8 w-8 rounded-full"
                />
                <span className="font-bold text-xl">Prince Data</span>
              </div>
              <p className="text-muted-foreground">
                Turning data into actionable insights through advanced analytics
                and machine learning.
              </p>
            </div>

            <div>
              <h4 className="font-semibold mb-4">Quick Links</h4>
              <div className="space-y-2">
                {["About", "Projects", "Blog", "Contact"].map((item) => (
                  <button
                    key={item}
                    onClick={() =>
                      document
                        .getElementById(item.toLowerCase())
                        ?.scrollIntoView({ behavior: "smooth" })
                    }
                    className="block text-muted-foreground hover:text-foreground transition-colors cursor-pointer"
                  >
                    {item}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <h4 className="font-semibold mb-4">Services</h4>
              <div className="space-y-2 text-muted-foreground">
                <p>Data Science Consulting</p>
                <p>Machine Learning</p>
                <p>Software Engineering</p>
                <p>Technical Mentoring</p>
              </div>
            </div>

            <div>
              <h4 className="font-semibold mb-4">Legal</h4>
              <div className="space-y-2">
                <a
                  href="#"
                  className="block text-muted-foreground hover:text-foreground transition-colors"
                >
                  Privacy Policy
                </a>
                <a
                  href="#"
                  className="block text-muted-foreground hover:text-foreground transition-colors"
                >
                  Terms of Service
                </a>
              </div>
            </div>
          </div>

          <div className="border-t mt-8 pt-8 text-center text-muted-foreground">
            <p>
              &copy; {new Date().getFullYear()} Prince Data. All rights
              reserved.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
