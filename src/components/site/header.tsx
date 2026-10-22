"use client";

import * as React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu, X } from "lucide-react";
import { NAV, SITE } from "@/lib/portfolio";
import { ThemeToggle } from "@/components/site/theme-toggle";
import { ScrollProgress } from "@/components/site/scroll-progress";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

function BrandMark() {
  return (
    <span
      aria-hidden
      className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-primary to-cyan-500 text-sm font-bold text-primary-foreground shadow-md shadow-primary/25"
    >
      PN
    </span>
  );
}

export function Header() {
  const [open, setOpen] = React.useState(false);
  const pathname = usePathname();
  const close = React.useCallback(() => setOpen(false), []);

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/60 bg-background/80 backdrop-blur-lg supports-[backdrop-filter]:bg-background/65">
      <ScrollProgress />
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between gap-4 px-4 sm:px-6">
        <Link
          href="/"
          className="flex min-h-11 items-center gap-2.5 rounded-md font-semibold tracking-tight"
          aria-label={`${SITE.name}: home`}
        >
          <BrandMark />
          <span className="text-lg">{SITE.brand}</span>
        </Link>

        {/* Desktop nav — real routes with the current page marked */}
        <nav aria-label="Primary" className="hidden items-center gap-1 md:flex">
          {NAV.map((item) => {
            const active = pathname === item.href || pathname.startsWith(`${item.href}/`);
            return (
              <Link
                key={item.href}
                href={item.href}
                aria-current={active ? "page" : undefined}
                className={cn(
                  "rounded-md px-3 py-2 text-sm font-medium text-muted-foreground transition-colors hover:bg-accent hover:text-foreground",
                  active && "bg-accent text-foreground",
                )}
              >
                {item.label}
              </Link>
            );
          })}
        </nav>

        <div className="flex items-center gap-1.5">
          <Button
            asChild
            size="sm"
            className="shine hidden min-h-9 lg:inline-flex"
          >
            <a href={`mailto:${SITE.email}?subject=Interview%20with%20Prince`} data-pla="hire-me">Hire me</a>
          </Button>
          <ThemeToggle />
          {/* Mobile menu button — 44px touch target */}
          <Button
            variant="ghost"
            size="icon"
            className="h-10 w-10 md:hidden"
            aria-expanded={open}
            aria-controls="mobile-nav"
            aria-label={open ? "Close menu" : "Open menu"}
            onClick={() => setOpen((v) => !v)}
          >
            {open ? <X className="h-5 w-5" aria-hidden /> : <Menu className="h-5 w-5" aria-hidden />}
          </Button>
        </div>
      </div>

      {/* Mobile nav */}
      {open && (
        <nav
          id="mobile-nav"
          aria-label="Primary mobile"
          className="border-t border-border/60 bg-background md:hidden"
        >
          <ul className="mx-auto max-w-6xl px-4 py-2">
            {NAV.map((item) => {
              const active = pathname === item.href || pathname.startsWith(`${item.href}/`);
              return (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    onClick={close}
                    aria-current={active ? "page" : undefined}
                    className={cn(
                      "flex min-h-11 items-center rounded-md px-3 py-2 text-base font-medium text-foreground transition-colors hover:bg-accent",
                      active && "bg-accent font-semibold",
                    )}
                  >
                    {item.label}
                  </Link>
                </li>
              );
            })}
          </ul>
        </nav>
      )}
    </header>
  );
}
