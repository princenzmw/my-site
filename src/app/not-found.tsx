import type { Metadata } from "next";
import Link from "next/link";
import { ArrowLeft, Mail } from "lucide-react";
import { Button } from "@/components/ui/button";
import { SITE } from "@/lib/portfolio";

export const metadata: Metadata = {
  title: "Page not found",
  robots: { index: false, follow: false },
};

/**
 * Custom 404 — ships as out/404.html (Cloudflare Pages serves it automatically
 * for unknown routes). Offers the three paths a lost recruiter actually needs.
 */
export default function NotFound() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center px-4 py-16 text-center">
      <p className="font-mono text-sm font-semibold uppercase tracking-widest text-primary">Error 404</p>
      <h1 className="mt-3 text-4xl font-extrabold tracking-tight sm:text-5xl">
        This page doesn&apos;t exist
      </h1>
      <p className="mx-auto mt-4 max-w-md text-base leading-relaxed text-muted-foreground">
        The URL may be mistyped or the page moved. The projects, the résumé, and I are all still here, one click away.
      </p>
      <h2 className="mt-8 text-lg font-semibold tracking-tight">Where to next</h2>
      <div className="mt-4 flex flex-col gap-3 sm:flex-row">
        <Button asChild size="lg" className="min-h-11">
          <Link href="/">
            <ArrowLeft className="h-4 w-4" aria-hidden />
            Back to the portfolio
          </Link>
        </Button>
        <Button asChild size="lg" variant="outline" className="min-h-11">
          <Link href="/projects">View projects</Link>
        </Button>
        <Button asChild size="lg" variant="outline" className="min-h-11">
          <a href={`mailto:${SITE.email}?subject=Following%20up%20from%20nzamuwe.com`}>
            <Mail className="h-4 w-4" aria-hidden />
            Email me
          </a>
        </Button>
      </div>
    </div>
  );
}
