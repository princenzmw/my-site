import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/components/theme-provider";
import { SITE } from "@/lib/portfolio";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  metadataBase: new URL(SITE.url),
  title: {
    default: "Prince Nzamuwe | Data Scientist & ML Engineer in Nairobi, Kenya",
    template: "%s | Prince Nzamuwe",
  },
  description:
    "Data scientist and ML engineer in Nairobi, Kenya. BSc Data Science student at USIU-Africa. Built Credio (ROC-AUC 0.869) and the FinAccess Kenya dashboard.",
  robots: { index: true, follow: true },
  alternates: { canonical: "/" },
  authors: [{ name: SITE.name, url: SITE.github }],
  icons: { icon: "/favicon.png", apple: "/favicon.png" },
  openGraph: {
    type: "website",
    url: "/",
    siteName: SITE.name,
    locale: "en_KE",
    title: "Prince Nzamuwe: Data Science · Machine Learning · Backend",
    description:
      "Projects with measurable results and live demos: Credio (ROC-AUC 0.869), FinAccess Kenya (19,750 adults, weighted), DukaPulse (in development). Code first, claims second.",
    images: [
      {
        url: SITE.ogImage,
        width: 1200,
        height: 630,
        alt: "Prince Nzamuwe: Data Science · Machine Learning · Backend",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Prince Nzamuwe: Data Science · Machine Learning · Backend",
    description:
      "Credit-risk models, analytics dashboards, and full-stack data apps, with receipts.",
    images: [SITE.ogImage],
  },
};

/**
 * JSON-LD structured data (closes audit issue H1).
 * alumniOf is now CONFIRMED (USIU-Africa, BSc Data Science & Analytics,
 * 2024–2028) — added per the README-DEPLOY.md bracket list.
 */
const jsonLd = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "Person",
      "@id": `${SITE.url}/#person`,
      name: SITE.name,
      givenName: "Prince",
      familyName: "Nzamuwe",
      jobTitle: SITE.jobTitle,
      email: `mailto:${SITE.email}`,
      telephone: "+254757723708",
      url: `${SITE.url}/`,
      image: `${SITE.url}${SITE.ogImage}`,
      address: {
        "@type": "PostalAddress",
        addressLocality: "Nairobi",
        addressCountry: "KE",
      },
      alumniOf: {
        "@type": "CollegeOrUniversity",
        name: "United States International University-Africa",
      },
      knowsAbout: [
        "Machine Learning",
        "Credit Risk Modeling",
        "Python",
        "scikit-learn",
        "PostgreSQL",
        "FastAPI",
        "React",
        "Power BI",
        "Data Visualization",
        "Survey Data Analysis",
        "Software Engineering",
      ],
      sameAs: [SITE.linkedin, SITE.github],
    },
    {
      "@type": "WebSite",
      name: "Prince Nzamuwe: Portfolio",
      url: `${SITE.url}/`,
      inLanguage: "en",
      publisher: { "@id": `${SITE.url}/#person` },
    },
    {
      "@type": "ProfilePage",
      "@id": `${SITE.url}/`,
      url: `${SITE.url}/`,
      mainEntity: { "@id": `${SITE.url}/#person` },
      dateModified: "2026-10-19",
    },
  ],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased bg-background text-foreground`}
      >
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          {children}
        </ThemeProvider>
        {/* Plausible on the REAL domain — closes audit issue C2.
            The queue shim makes custom events fire reliably even before
            script.js finishes loading. Raw defer tag (not next/script) so it
            ships in the static HTML. */}
        <script
          dangerouslySetInnerHTML={{
            __html: "window.plausible=window.plausible||function(){(window.plausible.q=window.plausible.q||[]).push(arguments)}",
          }}
        />
        <script
          defer
          data-domain="nzamuwe.com"
          src="https://plausible.io/js/script.js"
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </body>
    </html>
  );
}
