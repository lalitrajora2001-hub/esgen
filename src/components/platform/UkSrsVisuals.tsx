"use client";

import { useState } from "react";
import { motion, useReducedMotion } from "framer-motion";
import { useReveal } from "@/components/whiteui/kit";
import { GK } from "@/components/platform/CarbonVisuals";

const INK = "#0f1720", MUTED = "#6b7280";

/* ============================================================
   1. DISCLOSURE MAPPER — click an IFRS requirement on the left;
   a connector draws across to the evidence ESGen holds for it.
   ============================================================ */
type Req = { id: string; std: "S1" | "S2"; title: string; source: string; detail: string };
const REQS: Req[] = [
  { id: "S1-27", std: "S1", title: "Governance of sustainability risks", source: "Governance register", detail: "Board and committee oversight, meeting cadence, and delegated responsibilities recorded against each risk." },
  { id: "S1-33", std: "S1", title: "Strategy and business model", source: "Strategy narrative", detail: "How sustainability-related risks and opportunities affect the business model and value chain." },
  { id: "S2-29", std: "S2", title: "Gross Scope 1, 2 and 3 emissions", source: "GHG inventory", detail: "Activity data and emission factors per scope, with the calculation and factor vintage retained for each figure." },
  { id: "S2-15", std: "S2", title: "Climate resilience and scenarios", source: "Scenario model", detail: "Modelled outcomes across warming pathways, with the assumptions behind each scenario stated." },
  { id: "S2-33", std: "S2", title: "Cross-industry metrics and targets", source: "Targets tracker", detail: "Base year, target year, coverage, and progress against each target you have set." },
];

export function DisclosureMapper() {
  const { ref, inView } = useReveal();
  const reduce = useReducedMotion();
  const [sel, setSel] = useState(2);
  const req = REQS[sel];

  return (
    <div ref={ref} className="overflow-hidden rounded-2xl border border-[#e6ece7] bg-white shadow-[0_40px_80px_-40px_rgba(16,80,50,0.4)]">
      <div className="flex items-center justify-between border-b border-[#eef1ef] px-4 py-3">
        <span className="text-[0.68rem] font-bold uppercase tracking-[0.12em]" style={{ color: MUTED }}>IFRS requirement → your evidence</span>
        {!reduce && <span className="flex items-center gap-1.5 text-[0.6rem] font-bold" style={{ color: GK.greenDk }}><motion.span className="h-1.5 w-1.5 rounded-full" style={{ background: GK.green }} animate={{ opacity: [1, 0.25, 1] }} transition={{ duration: 1.7, repeat: Infinity }} />mapped</span>}
      </div>

      <div className="grid gap-0 lg:grid-cols-[1fr_92px_1fr]">
        {/* requirements */}
        <div className="p-3">
          {REQS.map((r, i) => {
            const on = i === sel;
            return (
              <button key={r.id} onClick={() => setSel(i)} onPointerEnter={() => setSel(i)} aria-pressed={on}
                className="mb-1 flex w-full items-center gap-2.5 rounded-lg px-2.5 py-2 text-left transition-colors hover:bg-[#f7faf8] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-1 focus-visible:outline-[#16a34a]"
                style={{ background: on ? "#f1f7f3" : undefined, boxShadow: on ? `inset 3px 0 0 ${GK.greenDk}` : undefined }}>
                <span className="shrink-0 rounded px-1.5 py-0.5 font-mono text-[0.54rem] font-bold" style={{ background: on ? GK.greenDk : "#eef1ef", color: on ? "#fff" : MUTED }}>{r.std}</span>
                <span className="min-w-0 flex-1 truncate text-[0.76rem]" style={{ color: INK, fontWeight: on ? 700 : 400 }}>{r.title}</span>
                <span className="shrink-0 font-mono text-[0.52rem]" style={{ color: MUTED }}>{r.id}</span>
              </button>
            );
          })}
        </div>

        {/* connector */}
        <div className="relative hidden lg:block">
          <svg viewBox="0 0 92 240" preserveAspectRatio="none" className="absolute inset-0 h-full w-full">
            {REQS.map((_, i) => {
              const y = 24 + i * 48;
              const on = i === sel;
              return (
                <motion.path key={i} d={`M0 ${y} C 46 ${y}, 46 120, 92 120`} fill="none"
                  stroke={on ? GK.greenDk : "#dbe4de"} strokeWidth={on ? 2 : 1} strokeDasharray={on ? undefined : "3 4"}
                  initial={{ pathLength: 0 }} animate={inView ? { pathLength: 1 } : {}} transition={{ duration: 0.6, delay: 0.1 + i * 0.06 }} />
              );
            })}
            {!reduce && <circle r="3" fill={GK.green}><animateMotion dur="2.2s" repeatCount="indefinite" path={`M0 ${24 + sel * 48} C 46 ${24 + sel * 48}, 46 120, 92 120`} /></circle>}
          </svg>
        </div>

        {/* evidence */}
        <div className="border-t border-[#eef1ef] p-4 lg:border-l lg:border-t-0">
          <motion.div key={req.id} initial={{ opacity: 0, x: 8 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.22 }}>
            <span className="rounded-full bg-[#f1f7f3] px-2 py-0.5 text-[0.58rem] font-bold" style={{ color: GK.greenDk }}>{req.source}</span>
            <h4 className="mt-2.5 font-display text-[0.92rem] font-bold leading-tight" style={{ color: INK }}>{req.title}</h4>
            <p className="mt-2 text-[0.76rem] leading-relaxed" style={{ color: MUTED }}>{req.detail}</p>
            <div className="mt-3 space-y-1.5">
              {["Source data retained", "Method and factor recorded", "Change history preserved"].map((l, i) => (
                <motion.div key={l} className="flex items-center gap-2 text-[0.7rem]" style={{ color: INK }}
                  initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.15 + i * 0.08 }}>
                  <svg viewBox="0 0 24 24" className="h-3.5 w-3.5 shrink-0" fill="none"><circle cx="12" cy="12" r="10" fill={GK.greenDk} /><path d="M7.5 12.5l3 3 6-6.5" stroke="#fff" strokeWidth="2.6" strokeLinecap="round" strokeLinejoin="round" /></svg>
                  {l}
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      </div>
      <p className="border-t border-[#eef1ef] px-4 py-2 text-[0.6rem]" style={{ color: MUTED }}>Select a requirement to see the evidence it draws on. Illustrative mapping.</p>
    </div>
  );
}

/* ============================================================
   2. SCENARIO EXPOSURE — pick a warming pathway; the modelled
   physical/transition split re-plots.
   ============================================================ */
const SCEN: { k: string; label: string; phys: number[]; trans: number[] }[] = [
  { k: "1.5°C", label: "Rapid transition, lower physical risk", phys: [8, 11, 14, 17, 20], trans: [42, 48, 52, 55, 58] },
  { k: "2.7°C", label: "Partial action, rising on both fronts", phys: [14, 22, 31, 40, 48], trans: [30, 33, 35, 36, 37] },
  { k: "4.0°C", label: "Limited action, severe physical risk", phys: [22, 38, 55, 72, 88], trans: [14, 15, 16, 16, 17] },
];
const DECADES = ["2030", "2040", "2050", "2060", "2070"];

/* Pixels per index unit. Tallest stack (4.0°C in 2070) is 88+17=105 units,
   which lands at 158px inside the 176px plot — no clipping. */
const UNIT = 1.5;

export function ScenarioExposure() {
  const [i, setI] = useState(1);
  const s = SCEN[i];

  return (
    <div className="overflow-hidden rounded-2xl border border-[#e6ece7] bg-white p-5 shadow-[0_36px_70px_-34px_rgba(16,80,50,0.4)]">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <span className="font-display text-base font-bold" style={{ color: INK }}>Climate scenario analysis</span>
        <div role="tablist" aria-label="Warming pathway" className="flex gap-1 rounded-lg bg-[#f1f4f2] p-1">
          {SCEN.map((x, k) => (
            <button key={x.k} role="tab" aria-selected={i === k} onClick={() => setI(k)}
              className="relative rounded-md px-3 py-1.5 text-[0.72rem] font-bold transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-[#16a34a]"
              style={{ color: i === k ? "#fff" : MUTED }}>
              {i === k && <motion.span layoutId="scenpill" className="absolute inset-0 rounded-md" style={{ background: GK.greenDk }} transition={{ type: "spring", stiffness: 400, damping: 32 }} />}
              <span className="relative">{x.k}</span>
            </button>
          ))}
        </div>
      </div>
      <p className="mt-1.5 text-[0.76rem]" style={{ color: MUTED }}>{s.label}</p>

      <div className="mt-5 flex h-44 items-end gap-3">
        {DECADES.map((d, k) => (
          <div key={d} className="flex h-full flex-1 flex-col justify-end gap-0.5">
            {/* Heights are plain CSS with a transition, not a JS animation, so
                the chart is correct on first paint even before scripts run. */}
            <div className="w-full shrink-0 rounded-t-[3px] motion-safe:transition-[height] motion-safe:duration-500 motion-safe:ease-out"
              style={{ background: "#0d1411", height: `${s.phys[k] * UNIT}px`, transitionDelay: `${k * 30}ms` }} />
            <div className="w-full shrink-0 rounded-b-[3px] motion-safe:transition-[height] motion-safe:duration-500 motion-safe:ease-out"
              style={{ background: GK.green, height: `${s.trans[k] * UNIT}px`, transitionDelay: `${k * 30}ms` }} />
          </div>
        ))}
      </div>
      <div className="mt-1 flex gap-3">{DECADES.map((d) => <span key={d} className="flex-1 text-center text-[0.58rem]" style={{ color: MUTED }}>{d}</span>)}</div>

      <div className="mt-4 flex flex-wrap items-center gap-4 border-t border-[#eef1ef] pt-3">
        <span className="flex items-center gap-1.5 text-[0.68rem]" style={{ color: INK }}><i className="h-2 w-2 rounded-sm" style={{ background: "#0d1411" }} />Physical risk</span>
        <span className="flex items-center gap-1.5 text-[0.68rem]" style={{ color: INK }}><i className="h-2 w-2 rounded-sm" style={{ background: GK.green }} />Transition risk</span>
        <span className="ml-auto text-[0.58rem]" style={{ color: MUTED }}>Relative exposure index · illustrative</span>
      </div>
    </div>
  );
}
