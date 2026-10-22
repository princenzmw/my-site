"use client";

import * as React from "react";

/**
 * Conversion analytics, wired once.
 * Any element carrying a `data-pla` attribute fires a Plausible custom event
 * named after that attribute value (e.g. data-pla="resume-download" ->
 * "Resume Download"? — no: Plausible receives the literal attribute value).
 * Event names are lowercase kebab; goals are then created in the Plausible
 * dashboard for nzamuwe.com. No personal data is attached.
 */
export function ClickTracking() {
  React.useEffect(() => {
    const handler = (e: MouseEvent) => {
      const el = (e.target as HTMLElement | null)?.closest?.("[data-pla]");
      if (!el) return;
      const name = el.getAttribute("data-pla");
      if (!name) return;
      const w = window as unknown as { plausible?: (...args: unknown[]) => void };
      w.plausible?.(name);
    };
    document.addEventListener("click", handler, { passive: true });
    return () => document.removeEventListener("click", handler);
  }, []);

  return null;
}
