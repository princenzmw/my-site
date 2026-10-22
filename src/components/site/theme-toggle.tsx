"use client";

import * as React from "react";
import { useTheme } from "next-themes";
import { Monitor, Moon, Sun } from "lucide-react";
import { Button } from "@/components/ui/button";

const ORDER = ["light", "dark", "system"] as const;

/** Three-way theme switcher: light → dark → system. */
export function ThemeToggle() {
  const { theme, setTheme } = useTheme();
  // Hydration-safe mounted check (no setState-in-effect; passes react-hooks lint).
  const mounted = React.useSyncExternalStore(
    () => () => {},
    () => true,
    () => false,
  );

  const cycle = () => {
    const current = theme ?? "system";
    const next = ORDER[(ORDER.indexOf(current as (typeof ORDER)[number]) + 1) % ORDER.length];
    setTheme(next);
  };

  const label = !mounted ? "Switch theme" : theme === "dark" ? "Theme: dark. Switch to system" : theme === "light" ? "Theme: light. Switch to dark" : "Theme: system. Switch to light";

  return (
    <Button
      variant="ghost"
      size="icon"
      className="h-10 w-10"
      aria-label={label}
      title={label}
      onClick={cycle}
    >
      {/* Placeholder icon pre-mount avoids a hydration mismatch flash. */}
      {!mounted ? (
        <Sun className="h-5 w-5" aria-hidden />
      ) : theme === "dark" ? (
        <Moon className="h-5 w-5" aria-hidden />
      ) : theme === "light" ? (
        <Sun className="h-5 w-5" aria-hidden />
      ) : (
        <Monitor className="h-5 w-5" aria-hidden />
      )}
    </Button>
  );
}
