"use client";

import { useState } from "react";
import { motion, useReducedMotion } from "framer-motion";
import { GK } from "@/components/platform/CarbonVisuals";

const INK = "#0f1720", MUTED = "#6b7280";

/* ============================================================
   PILLAR WHEEL — four pillars, eleven recommended disclosures.
   Click a quadrant to read what it asks for.
   ============================================================ */
type Pillar = { k: string; blurb: string; items: string[]; icon: string };
const PILLARS: Pillar[] = [
  { k: "Governance", icon: "M4 20h16M6 20V10l6-5 6 5v10M10 20v-5h4v5",
    blurb: "The board's oversight, and management's role in assessing and managing climate risks and opportunities.",
    items: ["Board oversight of climate-related risks and opportunities", "Management's role in assessing and managing them"] },
  { k: "Strategy", icon: "M3 17l6-6 4 4 8-8M15 7h6v6",
    blurb: "The actual and potential impacts of climate on the business, strategy, and financial planning.",
    items: ["Risks and opportunities identified over the short, medium, and long term", "Their impact on business, strategy, and financial planning", "Resilience of the strategy under different climate scenarios"] },
  { k: "Risk management", icon: "M12 3l8 4v5c0 5-3.5 8.5-8 9-4.5-.5-8-4-8-9V7z",
    blurb: "How climate-related risks are identified, assessed, and managed, and how that fits into overall risk management.",
    items: ["Processes for identifying and assessing climate risks", "Processes for managing them", "How those processes integrate into overall risk management"] },
  { k: "Metrics & targets", icon: "M4 19V5M4 19h16M8 15l3-4 3 3 4-6",
    blurb: "The metrics and targets used to assess and manage relevant climate risks and opportunities.",
    items: ["Metrics used to assess climate risks and opportunities", "Scope 1, Scope 2, and if appropriate Scope 3 emissions", "Targets used to manage risks, and performance against them"] },
];

export function PillarWheel() {
  const [sel, setSel] = useState(0);
  const reduce = useReducedMotion();
  const p = PILLARS[sel];
  const R = 108, C = 150;

  /* quadrant arc path, 90° each, starting at -135° so the first sits top-left */
  const arc = (i: number, r: number, thick: number) => {
    const a0 = ((-135 + i * 90) * Math.PI) / 180;
    const a1 = ((-135 + (i + 1) * 90 - 3) * Math.PI) / 180;
    const ro = r + thick / 2, ri = r - thick / 2;
    const p0 = [C + ro * Math.cos(a0), C + ro * Math.sin(a0)];
    const p1 = [C + ro * Math.cos(a1), C + ro * Math.sin(a1)];
    const p2 = [C + ri * Math.cos(a1), C + ri * Math.sin(a1)];
    const p3 = [C + ri * Math.cos(a0), C + ri * Math.sin(a0)];
    return `M${p0[0]} ${p0[1]} A${ro} ${ro} 0 0 1 ${p1[0]} ${p1[1]} L${p2[0]} ${p2[1]} A${ri} ${ri} 0 0 0 ${p3[0]} ${p3[1]} Z`;
  };
  const mid = (i: number) => {
    const a = ((-135 + i * 90 + 45) * Math.PI) / 180;
    return { x: C + R * Math.cos(a), y: C + R * Math.sin(a) };
  };

  return (
    <div className="grid items-center gap-10 lg:grid-cols-[0.95fr_1.05fr]">
      <div className="relative mx-auto w-full max-w-[340px]">
        <svg viewBox="0 0 300 300" className="h-full w-full">
          {!reduce && <motion.circle cx={C} cy={C} r="136" fill="none" stroke={GK.greenDk} strokeOpacity="0.18" strokeWidth="1" strokeDasharray="2 7"
            style={{ transformBox: "fill-box", transformOrigin: "center" }} animate={{ rotate: 360 }} transition={{ duration: 44, repeat: Infinity, ease: "linear" }} />}

          {PILLARS.map((x, i) => {
            const on = i === sel;
            return (
              <g key={x.k} className="cursor-pointer" onPointerEnter={() => setSel(i)} onClick={() => setSel(i)}
                tabIndex={0} role="button" aria-label={x.k} onFocus={() => setSel(i)}>
                <path d={arc(i, R, on ? 50 : 40)} fill={on ? GK.greenDk : "#e8efea"} style={{ transition: "d 180ms, fill 180ms" }} />
                <g transform={`translate(${mid(i).x - 11} ${mid(i).y - 11})`} className="pointer-events-none">
                  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke={on ? "#fff" : "#7d8a83"} strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round"><path d={x.icon} /></svg>
                </g>
              </g>
            );
          })}

          <circle cx={C} cy={C} r="62" fill="#0d1411" />
          <text x={C} y={C - 6} textAnchor="middle" fontSize="26" fontWeight="800" fill="#fff">11</text>
          <text x={C} y={C + 10} textAnchor="middle" fontSize="8.5" fill="rgba(255,255,255,0.55)">recommended</text>
          <text x={C} y={C + 21} textAnchor="middle" fontSize="8.5" fill="rgba(255,255,255,0.55)">disclosures</text>
        </svg>
      </div>

      <motion.div key={p.k} initial={{ opacity: 0, x: 10 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.24 }}>
        <span className="text-[0.66rem] font-bold uppercase tracking-[0.14em]" style={{ color: GK.greenDk }}>Pillar {sel + 1} of 4</span>
        <h3 className="mt-3 font-display text-2xl font-bold tracking-tight sm:text-3xl" style={{ color: INK }}>{p.k}</h3>
        <p className="mt-4 max-w-lg text-[0.98rem] leading-relaxed" style={{ color: MUTED }}>{p.blurb}</p>
        <ul className="mt-6 space-y-2.5">
          {p.items.map((it, i) => (
            <motion.li key={it} className="flex items-start gap-3 rounded-xl border border-[#e6ece7] bg-white p-3.5 text-[0.88rem]" style={{ color: INK }}
              initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.05 + i * 0.07 }}>
              <span className="grid h-5 w-5 shrink-0 place-items-center rounded-full font-mono text-[0.54rem] font-bold text-white" style={{ background: "#0d1411" }}>{String.fromCharCode(97 + i)}</span>
              {it}
            </motion.li>
          ))}
        </ul>
      </motion.div>
    </div>
  );
}

/* ============================================================
   TCFD → ISSB timeline. Factual, dated, no spin.
   ============================================================ */
const TIMELINE: [string, string][] = [
  ["2017", "The TCFD publishes its recommendations: four pillars and eleven recommended disclosures."],
  ["2021", "The IFRS Foundation announces the International Sustainability Standards Board."],
  ["2023", "The ISSB issues IFRS S1 and IFRS S2. S2 fully incorporates the TCFD recommendations."],
  ["2024", "The TCFD is disbanded; the ISSB takes on monitoring companies' climate-related disclosures."],
];
export function TcfdTimeline() {
  const [i, setI] = useState(TIMELINE.length - 1);
  return (
    <div>
      <div className="relative">
        <div aria-hidden className="absolute left-0 right-0 top-[13px] hidden h-0.5 bg-[#e2e8e4] lg:block">
          <div className="h-full origin-left rounded-full motion-safe:transition-transform motion-safe:duration-500"
            style={{ background: GK.green, transform: `scaleX(${i / (TIMELINE.length - 1)})` }} />
        </div>
        <ol className="grid gap-8 lg:grid-cols-4 lg:gap-6">
          {TIMELINE.map(([y, d], k) => {
            const done = k <= i;
            return (
              <li key={y}>
                <button onPointerEnter={() => setI(k)} onFocus={() => setI(k)} onClick={() => setI(k)} aria-pressed={k === i}
                  className="w-full text-left focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#16a34a]">
                  <span className="relative z-10 block h-7 w-7 rounded-full border-[3px] border-white shadow-md transition-colors"
                    style={{ background: done ? "#0d1411" : "#e2e8e4" }} />
                  <span className="mt-4 block font-display text-xl font-bold" style={{ color: done ? INK : "#9aa5a0" }}>{y}</span>
                  <span className="mt-1.5 block text-[0.84rem] leading-relaxed" style={{ color: MUTED }}>{d}</span>
                </button>
              </li>
            );
          })}
        </ol>
      </div>
    </div>
  );
}
