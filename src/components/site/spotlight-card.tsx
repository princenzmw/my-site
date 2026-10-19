"use client";

import * as React from "react";

/**
 * Mouse-tracking spotlight: a soft radial glow follows the cursor across the
 * card surface. Pure CSS variables + pointer events — no animation library.
 * Falls back to a static hover lift without JS.
 */
export function SpotlightCard({
  children,
  className = "",
}: {
  children: React.ReactNode;
  className?: string;
}) {
  const ref = React.useRef<HTMLDivElement>(null);

  const onMove = React.useCallback((e: React.PointerEvent<HTMLDivElement>) => {
    const el = ref.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    el.style.setProperty("--mx", `${e.clientX - rect.left}px`);
    el.style.setProperty("--my", `${e.clientY - rect.top}px`);
  }, []);

  return (
    <div
      ref={ref}
      onPointerMove={onMove}
      className={`spotlight lift relative h-full ${className}`}
    >
      {children}
    </div>
  );
}
