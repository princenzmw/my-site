import { CountUp } from "@/components/site/count-up";

/**
 * Hero signature visual — Credio's scorecard, drawn.
 * A stylized ROC curve sketches itself (pure CSS, runs without JS), the AUC
 * label counts up, and the diagonal chance line sits behind for honesty.
 */
export function RocPanel() {
  return (
    <div className="reveal w-full max-w-md [animation-delay:400ms]">
      <div className="overflow-hidden rounded-2xl border bg-card shadow-xl shadow-primary/5">
        {/* window chrome */}
        <div className="flex items-center gap-1.5 border-b bg-muted/50 px-4 py-2.5">
          <span className="h-2.5 w-2.5 rounded-full bg-red-400/70" aria-hidden />
          <span className="h-2.5 w-2.5 rounded-full bg-amber-400/70" aria-hidden />
          <span className="h-2.5 w-2.5 rounded-full bg-emerald-400/70" aria-hidden />
          <p className="ml-2 font-mono text-xs text-muted-foreground">
            credio · roc_curve.py
          </p>
        </div>

        <div className="p-5">
          {/* the chart */}
          <svg
            viewBox="0 0 220 190"
            role="img"
            aria-label="Stylized ROC curve reaching 0.869 area under the curve, above the diagonal chance line"
            className="w-full"
          >
            <defs>
              <linearGradient id="roc-stroke" x1="0" y1="0" x2="1" y2="0">
                <stop offset="0%" stopColor="var(--primary)" />
                <stop offset="100%" stopColor="oklch(0.72 0.15 210)" />
              </linearGradient>
              <linearGradient id="roc-area" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="var(--primary)" stopOpacity="0.28" />
                <stop offset="100%" stopColor="var(--primary)" stopOpacity="0.02" />
              </linearGradient>
            </defs>

            {/* grid */}
            {[1, 2, 3].map((i) => (
              <line
                key={`h${i}`}
                x1="30"
                x2="205"
                y1={30 + i * 37}
                y2={30 + i * 37}
                stroke="var(--border)"
                strokeWidth="1"
              />
            ))}
            {[1, 2, 3].map((i) => (
              <line
                key={`v${i}`}
                y1="30"
                y2="155"
                x1={30 + i * 43.75}
                x2={30 + i * 43.75}
                stroke="var(--border)"
                strokeWidth="1"
              />
            ))}

            {/* chance diagonal */}
            <line
              x1="30"
              y1="155"
              x2="205"
              y2="30"
              stroke="var(--muted-foreground)"
              strokeWidth="1.5"
              strokeDasharray="4 4"
              opacity="0.5"
            />

            {/* filled area under the model curve */}
            <path
              className="roc-fill"
              d="M30,155 C34,70 52,42 88,33 C124,25 168,22 205,20 L205,155 Z"
              fill="url(#roc-area)"
            />
            {/* the curve */}
            <path
              className="roc-line"
              d="M30,155 C34,70 52,42 88,33 C124,25 168,22 205,20"
              fill="none"
              stroke="url(#roc-stroke)"
              strokeWidth="3"
              strokeLinecap="round"
            />

            {/* axes */}
            <line x1="30" y1="30" x2="30" y2="155" stroke="var(--muted-foreground)" strokeWidth="1.5" />
            <line x1="30" y1="155" x2="205" y2="155" stroke="var(--muted-foreground)" strokeWidth="1.5" />
            <text x="117" y="176" textAnchor="middle" className="fill-current text-[10px] text-muted-foreground" fontSize="10">
              false positive rate
            </text>
            <text x="12" y="95" textAnchor="middle" fontSize="10" transform="rotate(-90 12 95)" className="fill-current text-muted-foreground">
              TPR
            </text>
          </svg>

          {/* readout chips */}
          <div className="mt-4 grid grid-cols-3 gap-2">
            <div className="rounded-lg border bg-muted/40 px-2.5 py-2 text-center">
              <p className="font-mono text-sm font-bold text-primary sm:text-base">
                <CountUp value={0.869} decimals={3} />
              </p>
              <p className="text-[10px] text-muted-foreground sm:text-xs">ROC-AUC</p>
            </div>
            <div className="rounded-lg border bg-muted/40 px-2.5 py-2 text-center">
              <p className="font-mono text-sm font-bold text-primary sm:text-base">
                <CountUp value={0.407} decimals={3} />
              </p>
              <p className="text-[10px] text-muted-foreground sm:text-xs">PR-AUC</p>
            </div>
            <div className="rounded-lg border bg-muted/40 px-2.5 py-2 text-center">
              <p className="font-mono text-sm font-bold text-primary sm:text-base">
                <CountUp value={150000} />
              </p>
              <p className="text-[10px] text-muted-foreground sm:text-xs">borrowers</p>
            </div>
          </div>
          <p className="mt-3 text-center font-mono text-[11px] text-muted-foreground">
            gradient boosting 0.869 (test) vs logistic 0.823 (validation)
          </p>
        </div>
      </div>
    </div>
  );
}
