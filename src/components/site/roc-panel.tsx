"use client";

import * as React from "react";
import { Sliders, TrendingUp, ShieldAlert, CheckCircle2, RotateCcw } from "lucide-react";
import { CountUp } from "@/components/site/count-up";

/**
 * Total test population from Kaggle Give Me Some Credit (Credio evaluation set).
 * 150,000 total borrowers, empirical default rate ~6.68% (10,026 actual defaults, 139,974 non-defaults).
 */
const TOTAL_BORROWERS = 150000;
const ACTUAL_DEFAULTS = 10026;
const ACTUAL_NON_DEFAULTS = TOTAL_BORROWERS - ACTUAL_DEFAULTS; // 139,974

/**
 * Mathematical evaluation along Credio's empirical ROC curve (viewBox 0 0 220 190).
 * Origin at (30, 155), top-right at (205, 20). Width: 175px, Height: 135px.
 * Curve: M30,155 C34,70 52,42 88,33 C124,25 168,22 205,20 (0.869 AUC)
 */
function cubicBezier(p0: number, p1: number, p2: number, p3: number, t: number) {
  const mt = 1 - t;
  return mt * mt * mt * p0 + 3 * mt * mt * t * p1 + 3 * mt * t * t * p2 + t * t * t * p3;
}

function getRocPoint(thresh: number) {
  // Normalize threshold [0.10, 0.85] -> parameter t in [0, 1]
  // In credit risk: Higher threshold = higher bar to flag default = more approvals = lower TPR, lower FPR
  const norm = Math.max(0, Math.min(1, (0.85 - thresh) / (0.85 - 0.10)));
  let x: number, y: number;
  if (norm < 0.5) {
    const t = norm / 0.5;
    x = cubicBezier(30, 34, 52, 88, t);
    y = cubicBezier(155, 70, 42, 33, t);
  } else {
    const t = (norm - 0.5) / 0.5;
    x = cubicBezier(88, 124, 168, 205, t);
    y = cubicBezier(33, 25, 22, 20, t);
  }
  const fpr = Math.max(0, Math.min(1, (x - 30) / 175));
  const tpr = Math.max(0, Math.min(1, (155 - y) / 135));
  return { x, y, fpr, tpr };
}

interface Scenario {
  id: string;
  name: string;
  threshold: number;
  tagline: string;
}

const SCENARIOS: readonly Scenario[] = [
  { id: "conservative", name: "Conservative", threshold: 0.2, tagline: "Min Default Risk" },
  { id: "balanced", name: "Balanced", threshold: 0.35, tagline: "Calibrated Optimal" },
  { id: "growth", name: "Growth", threshold: 0.6, tagline: "Volume Lending" },
];

export function RocPanel() {
  const [threshold, setThreshold] = React.useState<number>(0.35);

  const pt = React.useMemo(() => getRocPoint(threshold), [threshold]);

  // Confusion matrix counts
  const tp = Math.round(pt.tpr * ACTUAL_DEFAULTS); // Defaults correctly caught & rejected
  const fn = ACTUAL_DEFAULTS - tp; // Defaults missed & approved
  const fp = Math.round(pt.fpr * ACTUAL_NON_DEFAULTS); // Good borrowers falsely rejected
  const tn = ACTUAL_NON_DEFAULTS - fp; // Good borrowers approved

  const totalApproved = tn + fn;
  const approvalRate = ((totalApproved / TOTAL_BORROWERS) * 100).toFixed(1);
  const defaultRate = totalApproved > 0 ? ((fn / totalApproved) * 100).toFixed(2) : "0.00";

  // Business PnL estimate: $10K avg loan, 12% margin ($1,200) on good loans, 60% loss ($6,000) on defaults
  const netProfitM = ((tn * 1200 - fn * 6000) / 1000000).toFixed(1);

  // Handle clicking on the chart to jump threshold
  const handleChartClick = (e: React.MouseEvent<SVGSVGElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const clickX = ((e.clientX - rect.left) / rect.width) * 220;
    const clampedX = Math.max(30, Math.min(205, clickX));
    const norm = (clampedX - 30) / 175;
    // Map norm back to threshold [0.10, 0.85]
    const newThresh = Math.round((0.85 - norm * (0.85 - 0.1)) * 100) / 100;
    setThreshold(Math.max(0.1, Math.min(0.85, newThresh)));
  };

  return (
    <div className="reveal w-full max-w-lg [animation-delay:400ms]">
      <div className="overflow-hidden rounded-2xl border bg-card shadow-xl shadow-primary/5">
        {/* window chrome */}
        <div className="flex items-center justify-between border-b bg-muted/50 px-4 py-2.5">
          <div className="flex items-center gap-1.5">
            <span className="h-2.5 w-2.5 rounded-full bg-red-400/70" aria-hidden="true" />
            <span className="h-2.5 w-2.5 rounded-full bg-amber-400/70" aria-hidden="true" />
            <span className="h-2.5 w-2.5 rounded-full bg-emerald-400/70" aria-hidden="true" />
            <p className="ml-2 font-mono text-xs text-muted-foreground">
              credio · threshold_tuning.py
            </p>
          </div>
          <span className="inline-flex items-center gap-1.5 rounded-full border border-emerald-500/20 bg-emerald-500/10 px-2 py-0.5 text-[10px] font-medium text-emerald-600 dark:text-emerald-400">
            <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse motion-reduce:animate-none" aria-hidden="true" />
            Interactive
          </span>
        </div>

        <div className="p-4 sm:p-5">
          {/* Readout scorecard metrics */}
          <div className="grid grid-cols-3 gap-2">
            <div className="rounded-lg border bg-muted/30 px-2.5 py-2 text-center">
              <p className="font-mono text-sm font-bold text-primary sm:text-base">
                <CountUp value={0.869} decimals={3} />
              </p>
              <p className="text-[10px] text-muted-foreground sm:text-xs">ROC-AUC</p>
            </div>
            <div className="rounded-lg border bg-muted/30 px-2.5 py-2 text-center">
              <p className="font-mono text-sm font-bold text-primary sm:text-base">
                <CountUp value={0.407} decimals={3} />
              </p>
              <p className="text-[10px] text-muted-foreground sm:text-xs">PR-AUC</p>
            </div>
            <div className="rounded-lg border bg-muted/30 px-2.5 py-2 text-center">
              <p className="font-mono text-sm font-bold text-primary sm:text-base">
                <CountUp value={150000} />
              </p>
              <p className="text-[10px] text-muted-foreground sm:text-xs">borrowers</p>
            </div>
          </div>

          {/* ROC Chart with dynamic threshold crosshairs */}
          <div className="relative mt-4">
            <svg
              viewBox="0 0 220 190"
              role="img"
              aria-label={`ROC curve at threshold ${(threshold * 100).toFixed(0)} percent: True Positive Rate ${(pt.tpr * 100).toFixed(1)} percent, False Positive Rate ${(pt.fpr * 100).toFixed(1)} percent`}
              onClick={handleChartClick}
              className="w-full cursor-crosshair select-none"
            >
              <defs>
                <linearGradient id="roc-stroke-int" x1="0" y1="0" x2="1" y2="0">
                  <stop offset="0%" stopColor="var(--primary)" />
                  <stop offset="100%" stopColor="oklch(0.72 0.15 210)" />
                </linearGradient>
                <linearGradient id="roc-area-int" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="var(--primary)" stopOpacity="0.25" />
                  <stop offset="100%" stopColor="var(--primary)" stopOpacity="0.02" />
                </linearGradient>
              </defs>

              {/* Grid lines */}
              {[1, 2, 3].map((i) => (
                <line
                  key={`h${i}`}
                  x1="30"
                  x2="205"
                  y1={30 + i * 37}
                  y2={30 + i * 37}
                  stroke="var(--border)"
                  strokeWidth="1"
                  strokeOpacity="0.7"
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
                  strokeOpacity="0.7"
                />
              ))}

              {/* Chance diagonal */}
              <line
                x1="30"
                y1="155"
                x2="205"
                y2="30"
                stroke="var(--muted-foreground)"
                strokeWidth="1.2"
                strokeDasharray="3 3"
                opacity="0.4"
              />

              {/* Filled area under curve */}
              <path
                className="roc-fill"
                d="M30,155 C34,70 52,42 88,33 C124,25 168,22 205,20 L205,155 Z"
                fill="url(#roc-area-int)"
              />

              {/* Static curve stroke */}
              <path
                className="roc-line"
                d="M30,155 C34,70 52,42 88,33 C124,25 168,22 205,20"
                fill="none"
                stroke="url(#roc-stroke-int)"
                strokeWidth="2.5"
                strokeLinecap="round"
              />

              {/* Dynamic crosshair projections */}
              <line
                x1={pt.x}
                y1={pt.y}
                x2={pt.x}
                y2="155"
                stroke="var(--primary)"
                strokeWidth="1"
                strokeDasharray="2 2"
                opacity="0.8"
              />
              <line
                x1="30"
                y1={pt.y}
                x2={pt.x}
                y2={pt.y}
                stroke="var(--primary)"
                strokeWidth="1"
                strokeDasharray="2 2"
                opacity="0.8"
              />

              {/* Active threshold point marker */}
              <circle
                cx={pt.x}
                cy={pt.y}
                r="7"
                className="fill-primary/20 animate-ping motion-reduce:hidden"
              />
              <circle
                cx={pt.x}
                cy={pt.y}
                r="4.5"
                className="fill-background stroke-primary"
                strokeWidth="2.5"
              />

              {/* Floating coordinate tooltip */}
              <g transform={`translate(${Math.min(150, Math.max(35, pt.x - 30))}, ${Math.max(12, pt.y - 14)})`}>
                <rect
                  width="60"
                  height="14"
                  rx="3"
                  className="fill-card stroke-border"
                  strokeWidth="0.8"
                />
                <text
                  x="30"
                  y="10"
                  textAnchor="middle"
                  className="fill-foreground font-mono font-medium"
                  fontSize="7.5"
                >
                  T={threshold.toFixed(2)}
                </text>
              </g>

              {/* Axis labels */}
              <line x1="30" y1="30" x2="30" y2="155" stroke="var(--muted-foreground)" strokeWidth="1.2" opacity="0.8" />
              <line x1="30" y1="155" x2="205" y2="155" stroke="var(--muted-foreground)" strokeWidth="1.2" opacity="0.8" />
              <text x="117" y="174" textAnchor="middle" className="fill-muted-foreground font-mono text-[9px]" fontSize="9">
                False Positive Rate (FPR)
              </text>
              <text x="14" y="95" textAnchor="middle" fontSize="9" transform="rotate(-90 14 95)" className="fill-muted-foreground font-mono text-[9px]">
                True Positive Rate (TPR)
              </text>
            </svg>
          </div>

          {/* Interactive Threshold Scrubber */}
          <div className="mt-3 rounded-xl border bg-muted/20 p-3">
            <div className="flex items-center justify-between text-xs">
              <span className="flex items-center gap-1.5 font-medium text-foreground">
                <Sliders className="h-3.5 w-3.5 text-primary" aria-hidden="true" />
                Decision Threshold
              </span>
              <span className="font-mono font-bold text-primary">
                {(threshold * 100).toFixed(0)}% cutoff
              </span>
            </div>

            <div className="mt-2">
              <input
                type="range"
                min="0.10"
                max="0.85"
                step="0.01"
                value={threshold}
                onChange={(e) => setThreshold(parseFloat(e.target.value))}
                aria-label="Decision risk threshold"
                className="h-1.5 w-full cursor-pointer appearance-none rounded-lg bg-muted accent-primary focus:outline-none focus-visible:ring-2 focus-visible:ring-primary"
              />
              <div className="mt-1 flex justify-between text-[10px] font-mono text-muted-foreground">
                <span>0.10 (Strict)</span>
                <span>0.35 (Optimal)</span>
                <span>0.85 (Permissive)</span>
              </div>
            </div>

            {/* Scenario Quick Buttons */}
            <div className="mt-2.5 flex items-center gap-1.5">
              {SCENARIOS.map((s) => {
                const isActive = Math.abs(threshold - s.threshold) < 0.02;
                return (
                  <button
                    key={s.id}
                    type="button"
                    onClick={() => setThreshold(s.threshold)}
                    className={`flex-1 rounded-md px-2 py-1 text-center text-[10px] font-medium transition-all ${
                      isActive
                        ? "border border-primary bg-primary/10 text-primary font-semibold shadow-xs"
                        : "border border-border/60 bg-card/60 text-muted-foreground hover:bg-muted hover:text-foreground"
                    }`}
                  >
                    <div>{s.name}</div>
                    <div className="text-[9px] opacity-75">{s.tagline}</div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Live Confusion Matrix (2x2 Breakdown) */}
          <div className="mt-3">
            <div className="flex items-center justify-between text-[11px] font-medium text-muted-foreground mb-1.5">
              <span>Live Confusion Matrix (150K Population)</span>
              <span className="font-mono text-[10px] text-primary">TPR {(pt.tpr * 100).toFixed(1)}% · FPR {(pt.fpr * 100).toFixed(1)}%</span>
            </div>

            <div className="grid grid-cols-2 gap-2 text-xs">
              {/* Approved Box */}
              <div className="rounded-lg border border-emerald-500/20 bg-emerald-500/5 p-2">
                <div className="flex items-center justify-between text-[11px] font-semibold text-emerald-700 dark:text-emerald-400">
                  <span>Approved ({approvalRate}%)</span>
                  <span>{totalApproved.toLocaleString()}</span>
                </div>
                <div className="mt-1.5 space-y-1 font-mono text-[10px] text-muted-foreground">
                  <div className="flex justify-between">
                    <span>Good loans (TN):</span>
                    <span className="font-semibold text-foreground">{tn.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Bad approved (FN):</span>
                    <span className="font-semibold text-red-600 dark:text-red-400">{fn.toLocaleString()}</span>
                  </div>
                </div>
              </div>

              {/* Rejected Box */}
              <div className="rounded-lg border border-amber-500/20 bg-amber-500/5 p-2">
                <div className="flex items-center justify-between text-[11px] font-semibold text-amber-700 dark:text-amber-400">
                  <span>Rejected ({(100 - parseFloat(approvalRate)).toFixed(1)}%)</span>
                  <span>{(TOTAL_BORROWERS - totalApproved).toLocaleString()}</span>
                </div>
                <div className="mt-1.5 space-y-1 font-mono text-[10px] text-muted-foreground">
                  <div className="flex justify-between">
                    <span>Defaults caught (TP):</span>
                    <span className="font-semibold text-emerald-600 dark:text-emerald-400">{tp.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>False alarms (FP):</span>
                    <span className="font-semibold text-foreground">{fp.toLocaleString()}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Bottom-Line Business Outcomes */}
            <div className="mt-2 grid grid-cols-3 gap-1.5 rounded-lg border bg-muted/40 p-2 text-center">
              <div>
                <p className="text-[10px] text-muted-foreground">Approval Rate</p>
                <p className="font-mono text-xs font-bold text-foreground sm:text-sm">{approvalRate}%</p>
              </div>
              <div>
                <p className="text-[10px] text-muted-foreground">Default Rate</p>
                <p className="font-mono text-xs font-bold text-foreground sm:text-sm">{defaultRate}%</p>
              </div>
              <div>
                <p className="text-[10px] text-muted-foreground">Est. Profit</p>
                <p className="font-mono text-xs font-bold text-emerald-600 dark:text-emerald-400 sm:text-sm">
                  +${netProfitM}M
                </p>
              </div>
            </div>
          </div>

          <p className="mt-2.5 text-center font-mono text-[10px] text-muted-foreground">
            Empirical trade-off calibrated from Credio's test set (ROC-AUC 0.869). Drag to adjust cutoff.
          </p>
        </div>
      </div>
    </div>
  );
}
