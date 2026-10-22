export function HeroRocBg() {
  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 220 190"
      preserveAspectRatio="xMidYMid slice"
      className="pointer-events-none absolute inset-0 h-full w-full opacity-[0.12]"
    >
      <defs>
        <linearGradient id="roc-bg-stroke" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0%" stopColor="var(--primary)" />
          <stop offset="100%" stopColor="oklch(0.72 0.15 210)" />
        </linearGradient>
        <linearGradient id="roc-bg-area" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="var(--primary)" stopOpacity="0.4" />
          <stop offset="100%" stopColor="var(--primary)" stopOpacity="0" />
        </linearGradient>
      </defs>
      {/* AUC fill */}
      <path
        className="roc-fill"
        d="M30,155 C34,70 52,42 88,33 C124,25 168,22 205,20 L205,155 Z"
        fill="url(#roc-bg-area)"
      />
      {/* The curve */}
      <path
        className="roc-line"
        d="M30,155 C34,70 52,42 88,33 C124,25 168,22 205,20"
        fill="none"
        stroke="url(#roc-bg-stroke)"
        strokeWidth="2.5"
        strokeLinecap="round"
      />
      {/* Chance diagonal */}
      <line
        x1="30"
        y1="155"
        x2="205"
        y2="30"
        stroke="var(--muted-foreground)"
        strokeWidth="1"
        strokeDasharray="4 4"
        opacity="0.3"
      />
    </svg>
  );
}
