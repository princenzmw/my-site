"use client";

import * as React from "react";

/**
 * Rotating headline accent word. All phrases are stacked in a single CSS grid
 * cell (grid-area: 1/1) so the container width matches the longest phrase,
 * preventing layout shift when the active phrase rotates.
 *
 * Screen readers get a static phrase (words[0]) so the sentence always reads correctly.
 * words[0] also ships in the prerendered HTML (SEO gate H2).
 */
export function RoleRotator({ words }: { words: readonly string[] }) {
  const [index, setIndex] = React.useState(0);

  React.useEffect(() => {
    if (words.length < 2) return;
    if (typeof window !== "undefined" && window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      return;
    }
    const id = window.setInterval(
      () => setIndex((v) => (v + 1) % words.length),
      2600,
    );
    return () => window.clearInterval(id);
  }, [words.length]);

  return (
    <>
      <span className="inline-grid align-baseline" aria-hidden="true">
        {words.map((phrase, phraseIdx) => {
          const isActive = phraseIdx === index;
          return (
            <span
              key={phrase}
              className={`col-start-1 row-start-1 [grid-area:1/1] inline-flex flex-wrap text-gradient transition-[opacity,visibility] duration-300 ease-in-out motion-reduce:transition-none ${
                isActive
                  ? "opacity-100 visible z-10"
                  : "opacity-0 invisible pointer-events-none z-0"
              }`}
            >
              {phrase.split("").map((char, charIdx) => (
                <span
                  key={charIdx}
                  style={{ animationDelay: `${charIdx * 25}ms` }}
                  className="rotate-char inline-block"
                >
                  {char === " " ? "\u00A0" : char}
                </span>
              ))}
            </span>
          );
        })}
      </span>
      <span className="sr-only">{words[0]}</span>
    </>
  );
}
