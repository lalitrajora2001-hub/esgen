"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { GK } from "@/components/platform/CarbonVisuals";

const INK = "#0f1720", MUTED = "#6b7280";

/* ============================================================
   MODULE SELECTOR — VSME has a Basic module, and a Comprehensive
   module that sits on top of it for undertakings that need more.
   ============================================================ */
type Row = { k: string; label: string; basic: boolean; comp: boolean };
const ROWS: Row[] = [
  { k: "B1", label: "Basis for preparation", basic: true, comp: true },
  { k: "B2", label: "Practices for transitioning to a sustainable economy", basic: true, comp: true },
  { k: "B3", label: "Energy and greenhouse gas emissions", basic: true, comp: true },
  { k: "B4", label: "Pollution of air, water and soil", basic: true, comp: true },
  { k: "B5", label: "Biodiversity", basic: true, comp: true },
  { k: "B6", label: "Water", basic: true, comp: true },
  { k: "B7", label: "Resource use, circular economy and waste", basic: true, comp: true },
  { k: "B8", label: "Workforce — general characteristics", basic: true, comp: true },
  { k: "B9", label: "Workforce — health and safety", basic: true, comp: true },
  { k: "B10", label: "Workforce — remuneration, bargaining and training", basic: true, comp: true },
  { k: "B11", label: "Convictions and fines for corruption and bribery", basic: true, comp: true },
  { k: "C1", label: "Strategy: business model and sustainability initiatives", basic: false, comp: true },
  { k: "C2", label: "Description of practices, policies and future initiatives", basic: false, comp: true },
  { k: "C3", label: "GHG reduction targets and climate transition", basic: false, comp: true },
  { k: "C4", label: "Climate risks", basic: false, comp: true },
  { k: "C5", label: "Additional workforce characteristics", basic: false, comp: true },
  { k: "C6", label: "Human rights policies and processes", basic: false, comp: true },
  { k: "C7", label: "Severe human rights incidents", basic: false, comp: true },
  { k: "C8", label: "Revenues from certain sectors and exclusion from benchmarks", basic: false, comp: true },
  { k: "C9", label: "Gender diversity ratio in the governance body", basic: false, comp: true },
];

export function ModuleSelector() {
  const [comp, setComp] = useState(false);
  const active = ROWS.filter((r) => (comp ? r.comp : r.basic));
  const pct = Math.round((active.length / ROWS.length) * 100);

  return (
    <div className="overflow-hidden rounded-2xl border border-[#e6ece7] bg-white shadow-[0_40px_80px_-40px_rgba(16,80,50,0.4)]">
      <div className="flex flex-wrap items-center justify-between gap-4 border-b border-[#eef1ef] p-4">
        <div className="flex gap-1 rounded-lg bg-[#f1f4f2] p-1">
          {[["Basic module", false], ["Comprehensive module", true]].map(([l, v]) => (
            <button key={l as string} onClick={() => setComp(v as boolean)} aria-pressed={comp === v}
              className="relative rounded-md px-3.5 py-2 text-[0.74rem] font-bold transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-[#16a34a]"
              style={{ color: comp === v ? "#fff" : MUTED }}>
              {comp === v && <motion.span layoutId="vsmepill" className="absolute inset-0 rounded-md" style={{ background: GK.greenDk }} transition={{ type: "spring", stiffness: 400, damping: 32 }} />}
              <span className="relative">{l as string}</span>
            </button>
          ))}
        </div>
        <div className="flex items-center gap-3">
          <div className="text-right">
            <motion.div key={active.length} initial={{ opacity: 0.5, y: -2 }} animate={{ opacity: 1, y: 0 }} className="font-display text-xl font-bold tabular-nums" style={{ color: INK }}>{active.length}</motion.div>
            <div className="text-[0.55rem] uppercase tracking-wide" style={{ color: MUTED }}>disclosures</div>
          </div>
          <div className="h-9 w-24 self-center">
            <div className="mt-3.5 h-1.5 overflow-hidden rounded-full bg-[#eef1ef]">
              <div className="h-full rounded-full motion-safe:transition-[width] motion-safe:duration-500" style={{ width: `${pct}%`, background: GK.green }} />
            </div>
          </div>
        </div>
      </div>

      <div className="grid gap-px bg-[#eef1ef] sm:grid-cols-2">
        {ROWS.map((r) => {
          const on = comp ? r.comp : r.basic;
          const extra = !r.basic;
          return (
            <div key={r.k} className="flex items-center gap-3 bg-white px-4 py-2.5 transition-opacity" style={{ opacity: on ? 1 : 0.35 }}>
              <span className="shrink-0 rounded px-1.5 py-0.5 font-mono text-[0.56rem] font-bold"
                style={{ background: on ? (extra ? "#0d1411" : "#f1f7f3") : "#f1f4f2", color: on ? (extra ? "#4ade80" : GK.greenDk) : MUTED }}>{r.k}</span>
              <span className="min-w-0 flex-1 text-[0.78rem]" style={{ color: INK }}>{r.label}</span>
              {on
                ? <svg viewBox="0 0 24 24" className="h-4 w-4 shrink-0" fill="none" stroke={GK.green} strokeWidth="2.8" strokeLinecap="round" strokeLinejoin="round"><path d="M5 13l4 4L19 7" /></svg>
                : <span className="shrink-0 text-[0.56rem]" style={{ color: MUTED }}>comprehensive</span>}
            </div>
          );
        })}
      </div>
      <p className="border-t border-[#eef1ef] px-4 py-2.5 text-[0.6rem]" style={{ color: MUTED }}>The Comprehensive module builds on the Basic module rather than replacing it.</p>
    </div>
  );
}
