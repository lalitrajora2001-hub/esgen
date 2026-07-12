"use client";

import { useState } from "react";
import { motion, useReducedMotion } from "framer-motion";
import { GK } from "@/components/platform/CarbonVisuals";

const INK = "#0f1720", MUTED = "#6b7280";

/* ============================================================
   PRINCIPLE BOARD — the nine NGRBC principles that structure
   Section C of the BRSR, as a 3×3 board. Select one to see what
   it covers and the kind of disclosures it asks for.
   ============================================================ */
type Principle = { n: number; short: string; gist: string; asks: string[]; dataHeavy?: boolean };
const PRINCIPLES: Principle[] = [
  { n: 1, short: "Ethics & transparency", gist: "Conduct and govern the business with integrity, ethics, transparency and accountability.", asks: ["Training on the code of conduct", "Disciplinary actions and appeals", "Conflict-of-interest processes"] },
  { n: 2, short: "Sustainable products", gist: "Provide goods and services in a manner that is sustainable and safe.", asks: ["R&D and capex on sustainability", "Sustainable sourcing practices", "Product take-back and end of life"] },
  { n: 3, short: "Employee well-being", gist: "Respect and promote the well-being of all employees, including those in the value chain.", asks: ["Well-being and benefit coverage", "Health and safety incidents", "Training and development"] },
  { n: 4, short: "Stakeholder interests", gist: "Respect the interests of, and be responsive to, all stakeholders.", asks: ["Stakeholder identification", "Channels of engagement", "Vulnerable-group consultation"] },
  { n: 5, short: "Human rights", gist: "Respect and promote human rights across operations and the value chain.", asks: ["Human-rights training coverage", "Wages relative to minimum wage", "Complaints and remediation"] },
  { n: 6, short: "Environment", gist: "Respect and make efforts to protect and restore the environment.", asks: ["Energy and emissions (Scope 1 & 2, and Scope 3 where reported)", "Water withdrawal and discharge", "Waste generated and recovered"], dataHeavy: true },
  { n: 7, short: "Policy advocacy", gist: "Engage in influencing public and regulatory policy responsibly and transparently.", asks: ["Trade-association memberships", "Public policy positions advocated"] },
  { n: 8, short: "Inclusive growth", gist: "Promote inclusive growth and equitable development.", asks: ["Social impact assessments", "CSR programmes and beneficiaries", "Sourcing from smaller producers"] },
  { n: 9, short: "Consumer value", gist: "Engage with and provide value to consumers in a responsible manner.", asks: ["Consumer complaints and recalls", "Data privacy and cyber security", "Product information and labelling"] },
];

export function PrincipleBoard() {
  const [sel, setSel] = useState(5); // P6 — where ESGen does the heavy lifting
  const p = PRINCIPLES[sel];

  return (
    <div className="overflow-hidden rounded-2xl border border-[#e6ece7] bg-white shadow-[0_40px_80px_-40px_rgba(16,80,50,0.4)]">
      <div className="flex items-center justify-between border-b border-[#eef1ef] px-5 py-3">
        <span className="text-[0.66rem] font-bold uppercase tracking-[0.12em]" style={{ color: MUTED }}>The nine NGRBC principles</span>
        <span className="rounded bg-[#f1f7f3] px-2 py-0.5 text-[0.56rem] font-bold" style={{ color: GK.greenDk }}>Section C</span>
      </div>

      <div className="grid lg:grid-cols-[0.95fr_1.05fr]">
        {/* board */}
        <div className="grid grid-cols-3 gap-px border-b border-[#eef1ef] bg-[#eef1ef] lg:border-b-0 lg:border-r">
          {PRINCIPLES.map((x, i) => {
            const on = i === sel;
            return (
              <button key={x.n} onClick={() => setSel(i)} onPointerEnter={() => setSel(i)} onFocus={() => setSel(i)} aria-pressed={on}
                className="relative flex aspect-square flex-col items-start justify-between p-3 text-left transition-colors focus-visible:outline focus-visible:-outline-offset-2 focus-visible:outline-[#16a34a] sm:p-3.5"
                style={{ background: on ? "#0d1411" : "#ffffff" }}>
                <span className="font-mono text-[0.6rem] font-bold" style={{ color: on ? "#4ade80" : MUTED }}>P{x.n}</span>
                <span className="text-[0.64rem] font-semibold leading-tight sm:text-[0.7rem]" style={{ color: on ? "#fff" : INK }}>{x.short}</span>
                {x.dataHeavy && <span className="absolute right-2 top-2 h-1.5 w-1.5 rounded-full" style={{ background: on ? "#4ade80" : GK.green }} />}
              </button>
            );
          })}
        </div>

        {/* detail */}
        <div className="p-5 sm:p-6">
          <motion.div key={p.n} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.22 }}>
            <div className="flex items-center gap-2">
              <span className="grid h-8 w-8 place-items-center rounded-lg font-mono text-[0.7rem] font-bold text-white" style={{ background: "#0d1411" }}>P{p.n}</span>
              <h3 className="font-display text-lg font-bold leading-tight" style={{ color: INK }}>{p.short}</h3>
            </div>
            <p className="mt-3 text-[0.88rem] leading-relaxed" style={{ color: MUTED }}>{p.gist}</p>
            <p className="mt-4 text-[0.62rem] font-bold uppercase tracking-[0.12em]" style={{ color: MUTED }}>The report asks about</p>
            <ul className="mt-2 space-y-1.5">
              {p.asks.map((a, i) => (
                <motion.li key={a} className="flex items-start gap-2.5 text-[0.82rem]" style={{ color: INK }}
                  initial={{ opacity: 0, x: -6 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.06 + i * 0.06 }}>
                  <svg viewBox="0 0 24 24" className="mt-0.5 h-4 w-4 shrink-0" fill="none"><circle cx="12" cy="12" r="10" fill={GK.greenDk} /><path d="M7.5 12.5l3 3 6-6.5" stroke="#fff" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" /></svg>
                  {a}
                </motion.li>
              ))}
            </ul>
            {p.dataHeavy && (
              <div className="mt-4 flex items-start gap-2 rounded-xl bg-[#eaf6ef] p-3">
                <span className="mt-1 h-1.5 w-1.5 shrink-0 rounded-full" style={{ background: GK.green }} />
                <p className="text-[0.72rem] leading-relaxed" style={{ color: "#14392a" }}>This is the data-heavy principle — the energy, emissions, water and waste figures here come straight out of the inventory ESGen builds.</p>
              </div>
            )}
          </motion.div>
        </div>
      </div>
      <p className="border-t border-[#eef1ef] px-5 py-2.5 text-[0.6rem]" style={{ color: MUTED }}>Principles paraphrased from the National Guidelines on Responsible Business Conduct. Select a tile to explore it.</p>
    </div>
  );
}

/* ============================================================
   REPORT ANATOMY — Sections A, B and C as a document outline.
   ============================================================ */
type SectionDef = { k: string; title: string; blurb: string; items: string[]; weight: number };
const SECTIONS: SectionDef[] = [
  { k: "A", title: "General disclosures", weight: 20, blurb: "Facts about the entity itself — mostly stable year to year.", items: ["Company details, listings and locations", "Products, services and markets", "Employees, workers and turnover", "Holding and subsidiary structure", "CSR details and transparency channels"] },
  { k: "B", title: "Management & process", weight: 20, blurb: "Whether policies exist for each principle, and who owns them.", items: ["Policy coverage across the nine principles", "Board and committee oversight", "Review, certification and escalation"] },
  { k: "C", title: "Principle-wise performance", weight: 60, blurb: "The bulk of the report: indicators for each of the nine principles.", items: ["Essential indicators — mandatory for all filers", "Leadership indicators — voluntary, for those who can evidence more", "P6 environment data usually takes the most collection effort"] },
];

export function ReportAnatomy() {
  const [sel, setSel] = useState(2);
  const reduce = useReducedMotion();
  const s = SECTIONS[sel];

  return (
    <div className="grid gap-6 lg:grid-cols-[0.9fr_1.1fr] lg:items-start">
      {/* document spine */}
      <div className="space-y-2">
        {SECTIONS.map((x, i) => {
          const on = i === sel;
          return (
            <button key={x.k} onClick={() => setSel(i)} onPointerEnter={() => setSel(i)} onFocus={() => setSel(i)} aria-pressed={on}
              className="flex w-full items-center gap-4 rounded-2xl border p-4 text-left transition-all focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-1 focus-visible:outline-[#16a34a]"
              style={{ borderColor: on ? "transparent" : "#e6ece7", background: on ? "#0d1411" : "#fff", transform: on && !reduce ? "translateX(6px)" : "none" }}>
              <span className="grid h-10 w-10 shrink-0 place-items-center rounded-xl font-display text-lg font-bold"
                style={{ background: on ? GK.green : "#f1f4f2", color: on ? "#0d1411" : MUTED }}>{x.k}</span>
              <span className="min-w-0 flex-1">
                <span className="block font-display text-[0.95rem] font-bold" style={{ color: on ? "#fff" : INK }}>{x.title}</span>
                <span className="mt-0.5 block h-1.5 overflow-hidden rounded-full" style={{ background: on ? "rgba(255,255,255,0.12)" : "#eef1ef" }}>
                  <span className="block h-full rounded-full motion-safe:transition-[width] motion-safe:duration-500" style={{ width: `${x.weight}%`, background: on ? "#4ade80" : "#a8dcbc" }} />
                </span>
              </span>
              <span className="shrink-0 font-mono text-[0.62rem] tabular-nums" style={{ color: on ? "rgba(255,255,255,0.5)" : MUTED }}>~{x.weight}%</span>
            </button>
          );
        })}
        <p className="px-1 text-[0.62rem]" style={{ color: MUTED }}>Share of effort is indicative, based on where the indicators concentrate.</p>
      </div>

      {/* contents */}
      <motion.div key={s.k} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.22 }}
        className="rounded-2xl border border-[#e6ece7] bg-[#f8faf9] p-6">
        <p className="text-[0.9rem] leading-relaxed" style={{ color: INK }}>{s.blurb}</p>
        <ul className="mt-4 space-y-2">
          {s.items.map((it, i) => (
            <motion.li key={it} className="flex items-start gap-3 rounded-xl border border-[#e6ece7] bg-white p-3.5 text-[0.84rem]" style={{ color: INK }}
              initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.05 + i * 0.06 }}>
              <span className="mt-1 grid h-4 w-4 shrink-0 place-items-center rounded-full font-mono text-[0.5rem] font-bold text-white" style={{ background: "#0d1411" }}>{i + 1}</span>
              {it}
            </motion.li>
          ))}
        </ul>
      </motion.div>
    </div>
  );
}
