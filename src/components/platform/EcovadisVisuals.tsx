"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { GK } from "@/components/platform/CarbonVisuals";

const INK = "#0f1720", MUTED = "#6b7280";

/* ============================================================
   SCORECARD RADAR — four assessment themes. Drag a theme's score
   and watch the shape and the weighted total respond.
   Weights and scores here are illustrative: EcoVadis sets the real
   weighting by sector, size, and country.
   ============================================================ */
type Theme = { k: string; short: string; weight: number; blurb: string };
const THEMES: Theme[] = [
  { k: "Environment", short: "ENV", weight: 0.35, blurb: "Energy and emissions, water, biodiversity, materials, waste, and product end-of-life." },
  { k: "Labour & human rights", short: "LAB", weight: 0.3, blurb: "Health and safety, working conditions, social dialogue, and fundamental human rights." },
  { k: "Ethics", short: "ETH", weight: 0.2, blurb: "Corruption, anticompetitive practices, and responsible information management." },
  { k: "Sustainable procurement", short: "PRO", weight: 0.15, blurb: "Environmental and social practices carried into your own supply chain." },
];

export function ScorecardRadar() {
  const [scores, setScores] = useState<number[]>([68, 61, 74, 52]);
  const [sel, setSel] = useState(0);
  const total = Math.round(scores.reduce((s, v, i) => s + v * THEMES[i].weight, 0));

  const C = 140, R = 100;
  const pt = (i: number, v: number) => {
    const a = (-90 + i * 90) * (Math.PI / 180);
    const r = (v / 100) * R;
    return [C + r * Math.cos(a), C + r * Math.sin(a)];
  };
  const poly = scores.map((v, i) => pt(i, v).join(",")).join(" ");

  return (
    <div className="overflow-hidden rounded-2xl border border-[#e6ece7] bg-white shadow-[0_40px_80px_-40px_rgba(16,80,50,0.4)]">
      <div className="flex items-center justify-between border-b border-[#eef1ef] px-5 py-3">
        <span className="text-[0.66rem] font-bold uppercase tracking-[0.12em]" style={{ color: MUTED }}>Assessment themes</span>
        <span className="rounded bg-[#f1f7f3] px-2 py-0.5 text-[0.56rem] font-bold" style={{ color: GK.greenDk }}>illustrative</span>
      </div>

      <div className="grid lg:grid-cols-[0.95fr_1.05fr]">
        <div className="grid place-items-center border-b border-[#eef1ef] p-5 lg:border-b-0 lg:border-r">
          <svg viewBox="0 0 280 280" className="w-full max-w-[280px]">
            {[25, 50, 75, 100].map((g) => (
              <polygon key={g} points={THEMES.map((_, i) => pt(i, g).join(",")).join(" ")} fill="none" stroke="#eef1ef" strokeWidth="1" />
            ))}
            {THEMES.map((_, i) => <line key={i} x1={C} y1={C} x2={pt(i, 100)[0]} y2={pt(i, 100)[1]} stroke="#e6ece7" strokeWidth="1" />)}

            <polygon points={poly} fill={GK.green} fillOpacity="0.18" stroke={GK.greenDk} strokeWidth="2"
              className="motion-safe:transition-all motion-safe:duration-300" />

            {THEMES.map((t, i) => {
              const [x, y] = pt(i, scores[i]);
              const [lx, ly] = pt(i, 122);
              const on = i === sel;
              return (
                <g key={t.k}>
                  <circle cx={x} cy={y} r={on ? 7 : 4.5} fill="#fff" stroke={GK.greenDk} strokeWidth="2.4" className="cursor-pointer motion-safe:transition-all" onPointerEnter={() => setSel(i)} />
                  <text x={lx} y={ly + 4} textAnchor="middle" fontSize="10" fontWeight="800" fill={on ? GK.greenDk : MUTED}>{t.short}</text>
                </g>
              );
            })}

            <circle cx={C} cy={C} r="34" fill="#0d1411" />
            <text x={C} y={C - 2} textAnchor="middle" fontSize="20" fontWeight="800" fill="#fff">{total}</text>
            <text x={C} y={C + 12} textAnchor="middle" fontSize="7.5" fill="rgba(255,255,255,0.5)">weighted</text>
          </svg>
        </div>

        <div className="p-5">
          <div className="space-y-4">
            {THEMES.map((t, i) => (
              <div key={t.k} onPointerEnter={() => setSel(i)}
                className="rounded-xl p-3 transition-colors" style={{ background: sel === i ? "#f8faf9" : "transparent" }}>
                <div className="flex items-baseline justify-between gap-2">
                  <label htmlFor={`sc-${i}`} className="text-[0.78rem] font-semibold" style={{ color: INK }}>{t.k}</label>
                  <span className="shrink-0 font-mono text-[0.78rem] font-bold tabular-nums" style={{ color: GK.greenDk }}>{scores[i]}</span>
                </div>
                <input id={`sc-${i}`} type="range" min={0} max={100} value={scores[i]}
                  onChange={(e) => setScores((s) => s.map((v, k) => (k === i ? +e.target.value : v)))}
                  onFocus={() => setSel(i)} aria-label={t.k}
                  className="mt-2 h-1.5 w-full cursor-ew-resize appearance-none rounded-full bg-[#e6ece7]
                    [&::-webkit-slider-thumb]:h-4 [&::-webkit-slider-thumb]:w-4 [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:border-2 [&::-webkit-slider-thumb]:border-white [&::-webkit-slider-thumb]:bg-[#15803d] [&::-webkit-slider-thumb]:shadow
                    [&::-moz-range-thumb]:h-4 [&::-moz-range-thumb]:w-4 [&::-moz-range-thumb]:rounded-full [&::-moz-range-thumb]:border-2 [&::-moz-range-thumb]:border-white [&::-moz-range-thumb]:bg-[#15803d]" />
                <div className="mt-1.5 flex items-center justify-between">
                  <span className="text-[0.6rem]" style={{ color: MUTED }}>weight {(t.weight * 100).toFixed(0)}%</span>
                  <span className="text-[0.6rem]" style={{ color: MUTED }}>contributes {(scores[i] * t.weight).toFixed(1)}</span>
                </div>
              </div>
            ))}
          </div>
          <motion.p key={sel} initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="mt-3 border-t border-[#eef1ef] pt-3 text-[0.74rem] leading-relaxed" style={{ color: MUTED }}>
            {THEMES[sel].blurb}
          </motion.p>
          <p className="mt-3 text-[0.6rem] leading-relaxed" style={{ color: MUTED }}>Weights shown are illustrative. Real weighting varies by sector, size, and country, and the assessment is carried out by EcoVadis, not by ESGen.</p>
        </div>
      </div>
    </div>
  );
}

/* ============================================================
   EVIDENCE LADDER — what actually moves a score.
   ============================================================ */
const RUNGS: [string, string][] = [
  ["Policies", "A documented commitment, endorsed at the right level, covering the issue in question."],
  ["Actions", "What you concretely do: measures, certifications, training, supplier requirements."],
  ["Results", "Reported KPIs that show whether the actions worked, over more than one period."],
];
export function EvidenceLadder() {
  const [i, setI] = useState(2);
  return (
    <div className="grid gap-4 sm:grid-cols-3">
      {RUNGS.map(([t, d], k) => {
        const on = k <= i;
        return (
          <button key={t} onPointerEnter={() => setI(k)} onFocus={() => setI(k)} onClick={() => setI(k)} aria-pressed={k === i}
            className="flex flex-col justify-end rounded-2xl p-6 text-left transition-all focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#16a34a]"
            style={{ minHeight: `${180 + k * 32}px`, background: on ? (k === i ? "#0d1411" : "#f1f7f3") : "#f8faf9", border: on && k !== i ? "none" : k === i ? "none" : "1px solid #e6ece7" }}>
            <span className="font-mono text-[0.7rem] font-bold" style={{ color: k === i ? "rgba(255,255,255,0.45)" : "#9aa5a0" }}>0{k + 1}</span>
            <h3 className="mt-auto font-display text-lg font-bold" style={{ color: k === i ? "#fff" : INK }}>{t}</h3>
            <p className="mt-2 text-[0.84rem] leading-relaxed" style={{ color: k === i ? "rgba(255,255,255,0.65)" : MUTED }}>{d}</p>
          </button>
        );
      })}
    </div>
  );
}
