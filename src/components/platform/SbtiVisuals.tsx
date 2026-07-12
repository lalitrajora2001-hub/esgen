"use client";

import { useState } from "react";
import { motion, useReducedMotion } from "framer-motion";
import { GK } from "@/components/platform/CarbonVisuals";

const INK = "#0f1720", MUTED = "#6b7280";

/* ============================================================
   TARGET CALCULATOR
   Near-term targets cover 5–10 years from the base year. Under the
   linear annual reduction method, a 1.5°C-aligned near-term target
   requires at least 4.2% absolute reduction per year.
   ============================================================ */
const RATES: Record<string, number> = { "1.5°C": 4.2, "Well-below 2°C": 2.5 };

export function TargetCalculator() {
  const reduce = useReducedMotion();
  const [base, setBase] = useState(2023);
  const [target, setTarget] = useState(2032);
  const [ambition, setAmbition] = useState<keyof typeof RATES>("1.5°C");
  const [baseline, setBaseline] = useState(48000);

  const years = target - base;
  const rate = RATES[ambition];
  const totalCut = Math.min(100, years * rate);
  const endEmissions = Math.round(baseline * (1 - totalCut / 100));
  const valid = years >= 5 && years <= 10;

  const W = 460, H = 200, PAD = 34;
  const pts = Array.from({ length: years + 1 }, (_, i) => {
    const v = baseline * (1 - (i * rate) / 100);
    return { x: PAD + (i / Math.max(1, years)) * (W - PAD - 12), y: 16 + (1 - v / baseline) * (H - 46), v: Math.max(0, v), yr: base + i };
  });
  const line = pts.map((p, i) => `${i ? "L" : "M"}${p.x.toFixed(1)} ${p.y.toFixed(1)}`).join(" ");
  const [hov, setHov] = useState<number | null>(null);

  return (
    <div className="overflow-hidden rounded-2xl border border-[#e6ece7] bg-white shadow-[0_40px_80px_-40px_rgba(16,80,50,0.4)]">
      <div className="flex items-center justify-between border-b border-[#eef1ef] px-5 py-3">
        <span className="text-[0.66rem] font-bold uppercase tracking-[0.12em]" style={{ color: MUTED }}>Near-term target pathway</span>
        <span className="rounded px-2 py-0.5 text-[0.56rem] font-bold" style={{ background: valid ? "#f1f7f3" : "#f5f0e2", color: valid ? GK.greenDk : "#8a6a2f" }}>
          {valid ? `${years}-year target` : "must span 5–10 years"}
        </span>
      </div>

      <div className="grid lg:grid-cols-[1fr_1.15fr]">
        <div className="space-y-5 p-5">
          <div>
            <span className="text-[0.76rem] font-semibold" style={{ color: INK }}>Ambition</span>
            <div className="mt-2 flex gap-1 rounded-lg bg-[#f1f4f2] p-1">
              {(Object.keys(RATES) as (keyof typeof RATES)[]).map((a) => (
                <button key={a} onClick={() => setAmbition(a)} aria-pressed={ambition === a}
                  className="relative flex-1 rounded-md px-2 py-1.5 text-[0.7rem] font-bold transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-[#16a34a]"
                  style={{ color: ambition === a ? "#fff" : MUTED }}>
                  {ambition === a && <motion.span layoutId="ambpill" className="absolute inset-0 rounded-md" style={{ background: GK.greenDk }} transition={{ type: "spring", stiffness: 400, damping: 32 }} />}
                  <span className="relative">{a}</span>
                </button>
              ))}
            </div>
            <p className="mt-2 text-[0.62rem]" style={{ color: MUTED }}>Minimum {rate}% absolute reduction per year, linear method.</p>
          </div>

          {[
            { l: "Base year", v: base, set: setBase, min: 2018, max: 2025, step: 1, fmt: (n: number) => `${n}` },
            { l: "Target year", v: target, set: setTarget, min: 2028, max: 2035, step: 1, fmt: (n: number) => `${n}` },
            { l: "Base-year emissions", v: baseline, set: setBaseline, min: 1000, max: 120000, step: 1000, fmt: (n: number) => `${n.toLocaleString("en-GB")} tCO₂e` },
          ].map((f) => (
            <div key={f.l}>
              <div className="flex items-baseline justify-between gap-2">
                <label className="text-[0.76rem] font-semibold" style={{ color: INK }}>{f.l}</label>
                <span className="shrink-0 font-mono text-[0.8rem] font-bold tabular-nums" style={{ color: GK.greenDk }}>{f.fmt(f.v)}</span>
              </div>
              <input type="range" min={f.min} max={f.max} step={f.step} value={f.v} onChange={(e) => f.set(+e.target.value)} aria-label={f.l}
                className="mt-2 h-1.5 w-full cursor-ew-resize appearance-none rounded-full bg-[#e6ece7]
                  [&::-webkit-slider-thumb]:h-4 [&::-webkit-slider-thumb]:w-4 [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:border-2 [&::-webkit-slider-thumb]:border-white [&::-webkit-slider-thumb]:bg-[#15803d] [&::-webkit-slider-thumb]:shadow
                  [&::-moz-range-thumb]:h-4 [&::-moz-range-thumb]:w-4 [&::-moz-range-thumb]:rounded-full [&::-moz-range-thumb]:border-2 [&::-moz-range-thumb]:border-white [&::-moz-range-thumb]:bg-[#15803d]" />
            </div>
          ))}
        </div>

        <div className="border-t border-[#eef1ef] p-5 lg:border-l lg:border-t-0">
          <div className="flex flex-wrap gap-5">
            <div>
              <div className="text-[0.5rem] uppercase tracking-wide" style={{ color: MUTED }}>Required reduction</div>
              <motion.div key={totalCut} initial={{ opacity: 0.5 }} animate={{ opacity: 1 }} className="font-display text-2xl font-bold tabular-nums" style={{ color: INK }}>−{totalCut.toFixed(1)}%</motion.div>
            </div>
            <div>
              <div className="text-[0.5rem] uppercase tracking-wide" style={{ color: MUTED }}>Emissions in {target}</div>
              <motion.div key={endEmissions} initial={{ opacity: 0.5 }} animate={{ opacity: 1 }} className="font-display text-2xl font-bold tabular-nums" style={{ color: GK.greenDk }}>{endEmissions.toLocaleString("en-GB")}</motion.div>
            </div>
          </div>

          <svg viewBox={`0 0 ${W} ${H}`} className="mt-4 w-full" onPointerLeave={() => setHov(null)}>
            <defs><linearGradient id="sbtiFill" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor={GK.green} stopOpacity="0.24" /><stop offset="100%" stopColor={GK.green} stopOpacity="0" /></linearGradient></defs>
            {[0, 0.5, 1].map((f) => <line key={f} x1={PAD} y1={16 + f * (H - 46)} x2={W - 12} y2={16 + f * (H - 46)} stroke="#eef4ee" strokeWidth="1" />)}
            <path d={`${line} L${pts[pts.length - 1].x} ${H - 30} L${PAD} ${H - 30} Z`} fill="url(#sbtiFill)" />
            <path d={line} fill="none" stroke={GK.green} strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" />
            {!reduce && hov === null && <circle r="3.5" fill={GK.greenDk}><animateMotion dur="4s" repeatCount="indefinite" path={line} /></circle>}
            {pts.map((p, i) => (
              <g key={p.yr}>
                <circle cx={p.x} cy={p.y} r="9" fill="transparent" className="cursor-pointer" onPointerEnter={() => setHov(i)} />
                <circle cx={p.x} cy={p.y} r={hov === i ? 5 : 2.6} fill={hov === i ? "#fff" : GK.greenDk} stroke={GK.greenDk} strokeWidth={hov === i ? 2.4 : 0} style={{ transition: "r 140ms" }} />
              </g>
            ))}
            <text x={PAD} y={H - 12} fontSize="10" fill={MUTED}>{base}</text>
            <text x={W - 12} y={H - 12} fontSize="10" textAnchor="end" fill={MUTED}>{target}</text>
            {hov !== null && (
              <g className="pointer-events-none">
                <rect x={Math.min(W - 96, Math.max(0, pts[hov].x - 42))} y={pts[hov].y - 34} width="84" height="26" rx="5" fill="#0d1411" />
                <text x={Math.min(W - 54, Math.max(42, pts[hov].x))} y={pts[hov].y - 16} textAnchor="middle" fontSize="10" fontWeight="700" fill="#fff">
                  {pts[hov].yr} · {Math.round(pts[hov].v).toLocaleString("en-GB")}
                </text>
              </g>
            )}
          </svg>
          <p className="mt-2 text-[0.6rem] leading-relaxed" style={{ color: MUTED }}>Linear annual reduction against the base year. Scope 3 targets, coverage thresholds, and validation criteria are set by the SBTi and are not modelled here.</p>
        </div>
      </div>
    </div>
  );
}

/* ============================================================
   CRITERIA CHECKS, a compact, honest checklist.
   ============================================================ */
const CRITERIA: [string, string][] = [
  ["Base year", "A recent year with a complete, verifiable inventory."],
  ["Target horizon", "Near-term targets cover 5 to 10 years from the base year."],
  ["Scope 1 and 2", "Covered by an absolute reduction target across the boundary."],
  ["Scope 3", "A target is expected where value-chain emissions are a significant share of the total."],
  ["Recalculation", "A policy for restating the base year after structural change."],
];
export function CriteriaChecks() {
  const [open, setOpen] = useState(0);
  return (
    <div className="divide-y divide-[#e6ece7] overflow-hidden rounded-2xl border border-[#e6ece7] bg-white">
      {CRITERIA.map(([t, d], i) => {
        const on = i === open;
        return (
          <button key={t} onClick={() => setOpen(on ? -1 : i)} aria-expanded={on}
            className="flex w-full items-start gap-4 px-5 py-4 text-left transition-colors hover:bg-[#f8faf9] focus-visible:outline focus-visible:-outline-offset-2 focus-visible:outline-[#16a34a]">
            <span className="mt-0.5 grid h-6 w-6 shrink-0 place-items-center rounded-full font-mono text-[0.58rem] font-bold"
              style={{ background: on ? GK.greenDk : "#f1f4f2", color: on ? "#fff" : MUTED }}>{i + 1}</span>
            <span className="min-w-0 flex-1">
              <span className="block font-display text-[0.95rem] font-bold" style={{ color: INK }}>{t}</span>
              <span className="mt-1 block overflow-hidden text-[0.84rem] leading-relaxed transition-all"
                style={{ color: MUTED, maxHeight: on ? 60 : 0, opacity: on ? 1 : 0 }}>{d}</span>
            </span>
            <svg viewBox="0 0 24 24" className="mt-1 h-4 w-4 shrink-0 transition-transform" style={{ transform: on ? "rotate(45deg)" : "none" }} fill="none" stroke={GK.green} strokeWidth="2.4" strokeLinecap="round"><path d="M12 5v14M5 12h14" /></svg>
          </button>
        );
      })}
    </div>
  );
}
