import type { ReactNode } from "react";
import { Header } from "@/components/site/header";
import { Footer } from "@/components/site/footer";
import { ClickTracking } from "@/components/site/click-tracking";

/**
 * Shared page frame: skip link, header, tracked clicks, main landmark, footer.
 * Every prerendered route renders inside this shell, so keyboard landmarks and
 * the conversion tracker are identical on every page.
 */
export function PageShell({ children }: { children: ReactNode }) {
  return (
    <div className="flex min-h-screen flex-col">
      {/* Keyboard users land here first — one Tab, Enter, and they are past the nav. */}
      <a
        href="#main"
        className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[60] focus:rounded-md focus:bg-primary focus:px-4 focus:py-2 focus:text-sm focus:font-semibold focus:text-primary-foreground"
      >
        Skip to content
      </a>
      <Header />
      <ClickTracking />
      <main id="main" className="flex-1">
        {children}
      </main>
      <Footer />
    </div>
  );
}
