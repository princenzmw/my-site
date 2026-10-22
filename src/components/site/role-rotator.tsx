"use client";

import * as React from "react";

/**
 * Rotating headline accent word. The full list is NOT hidden from screen
 * readers — they get a static phrase so the sentence always reads correctly.
 * words[0] also ships in the prerendered HTML (SEO gate H2).
 */
export function RoleRotator({ words }: { words: readonly string[] }) {
  const [index, setIndex] = React.useState(0);

  React.useEffect(() => {
    if (words.length < 2) return;
    const id = window.setInterval(
      () => setIndex((v) => (v + 1) % words.length),
      2600,
    );
    return () => window.clearInterval(id);
  }, [words.length]);

  // Sizes to the current word (no width reservation): reserving the longest
  // word forced oversized lines on narrow screens and mid-word clipping.
  return (
    <span className="inline-grid align-baseline">
      <span
        key={index}
        aria-hidden
        className="text-gradient col-start-1 row-start-1 inline-flex flex-wrap"
      >
        {words[index].split("").map((char, charIdx) => (
          <span
            key={charIdx}
            style={{ animationDelay: `${charIdx * 25}ms` }}
            className="rotate-char inline-block"
          >
            {char === " " ? "\u00A0" : char}
          </span>
        ))}
      </span>
      <span className="sr-only">{words[0]}</span>
    </span>
  );
}
