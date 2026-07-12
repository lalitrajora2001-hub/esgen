"use client";

import { useState } from "react";
import { motion, useReducedMotion } from "framer-motion";

const ACCENT = "#4d8bf5";

/* ============================================================
   OUTPUT MAPPER (Manufacturing)
   One inventory on the left; pick an output on the right and the
   rows that feed it light up. The point: collect once, answer
   CBAM, product footprints, and corporate disclosure from the
   same data.
   ============================================================ */
type Row = { k: string; src: string };
const INVENTORY: Row[] = [
  { k: "Site energy & fuel", src: "meters, bills" },
  { k: "Process emissions", src: "site records" },
  { k: "Bill of materials", src: "ERP" },
  { k: "Supplier emissions data", src: "questionnaires" },
  { k: "Inbound & outbound freight", src: "logistics" },
  { k: "Production volumes", src: "ERP" },
];
type Output = { k: string; desc: string; uses: number[]; note: string };
const OUTPUTS: Output[] = [
  { k: "CBAM data pack", desc: "Embedded emissions per product, for customers importing into the EU.", uses: [0, 1, 2, 5], note: "Your EU customers need this to file their declarations. From 2026 it prices their certificates." },
  { k: "Product carbon footprint", desc: "A per-product figure for the tender or customer request in your inbox.", uses: [0, 1, 2, 3, 4, 5], note: "Built from the bill of materials, with supplier data replacing averages where it matters." },
  { k: "Corporate disclosure", desc: "Scope 1, 2 and 3 for SECR, UK SRS, CSRD or a customer questionnaire.", uses: [0, 1, 3, 4], note: "The same rows, aggregated to company level, with the method retained against each figure." },
];

/* White and black editorial treatment: white card, hairline borders, black
   as the active accent. Used on the Manufacturing page. */
const M = { ink: "#101318", muted: "#565d68", faint: "#8a919c", line: "#e6e8ec", wash: "#f4f5f7", panel: "#f7f8f9" };

export function OutputMapper() {
  const [sel, setSel] = useState(1);
  const out = OUTPUTS[sel];

  return (
    <div className="overflow-hidden rounded-3xl border bg-white shadow-[0_28px_70px_-38px_rgba(16,19,24,0.35)]" style={{ borderColor: M.line }}>
      <div className="flex items-center justify-between border-b px-6 py-4" style={{ borderColor: "#eceef1" }}>
        <span className="font-mono text-[0.68rem] uppercase tracking-[0.16em]" style={{ color: M.muted }}>One inventory, three answers</span>
        <span className="rounded-full px-2.5 py-1 text-[0.62rem] font-bold text-white" style={{ background: M.ink }}>{out.uses.length} of {INVENTORY.length} rows feed this</span>
      </div>

      <div className="grid md:grid-cols-[1fr_1fr]">
        {/* inventory rows */}
        <div className="border-b p-5 md:border-b-0 md:border-r" style={{ borderColor: "#eceef1" }}>
          <p className="px-1 pb-2 text-[0.62rem] font-bold uppercase tracking-[0.12em]" style={{ color: M.faint }}>What you collect</p>
          <div className="space-y-1.5">
            {INVENTORY.map((r, i) => {
              const on = out.uses.includes(i);
              return (
                <div key={r.k} className="flex items-center gap-3 rounded-xl border px-3.5 py-2.5 motion-safe:transition-all motion-safe:duration-300"
                  style={{ borderColor: on ? M.ink : M.line, background: on ? M.wash : "transparent", opacity: on ? 1 : 0.42, boxShadow: on ? `inset 3px 0 0 ${M.ink}` : "none" }}>
                  <span className="h-2 w-2 shrink-0 rounded-full motion-safe:transition-colors" style={{ background: on ? M.ink : "#cdd2d8" }} />
                  <span className="min-w-0 flex-1 truncate text-[0.86rem] font-medium" style={{ color: on ? M.ink : M.muted }}>{r.k}</span>
                  <span className="shrink-0 font-mono text-[0.62rem]" style={{ color: M.faint }}>{r.src}</span>
                </div>
              );
            })}
          </div>
        </div>

        {/* outputs */}
        <div className="p-5">
          <p className="px-1 pb-2 text-[0.62rem] font-bold uppercase tracking-[0.12em]" style={{ color: M.faint }}>What it produces</p>
          <div className="space-y-2">
            {OUTPUTS.map((o, i) => {
              const on = i === sel;
              return (
                <button key={o.k} onClick={() => setSel(i)} onMouseEnter={() => setSel(i)} onFocus={() => setSel(i)} aria-pressed={on}
                  className="w-full rounded-xl border p-4 text-left transition-all focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-1 focus-visible:outline-[#101318]"
                  style={{ borderColor: on ? M.ink : M.line, background: on ? M.ink : "#ffffff" }}>
                  <div className="flex items-center justify-between gap-2">
                    <span className="font-display text-[0.95rem] font-semibold" style={{ color: on ? "#ffffff" : M.ink }}>{o.k}</span>
                    <svg viewBox="0 0 24 24" className="h-4 w-4 shrink-0 motion-safe:transition-transform" style={{ color: on ? "#ffffff" : "#cdd2d8", transform: on ? "translateX(2px)" : "none" }} fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="M9 6l6 6-6 6" /></svg>
                  </div>
                  <p className="mt-1 text-[0.78rem] leading-relaxed" style={{ color: on ? "rgba(255,255,255,0.72)" : M.muted }}>{o.desc}</p>
                </button>
              );
            })}
          </div>
          <motion.p key={out.k} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.25 }}
            className="mt-4 rounded-xl border p-3.5 text-[0.78rem] leading-relaxed" style={{ borderColor: "#eceef1", background: M.panel, color: M.muted }}>
            {out.note}
          </motion.p>
        </div>
      </div>
    </div>
  );
}

/* ============================================================
   EVENT TIMELINE (Events)
   The event lifecycle in three phases. Select one to see what
   gets captured, and watch the footprint accumulate along the rail.
   ============================================================ */
type Phase = { k: string; window: string; blurb: string; captures: [string, string][]; cumPct: number };
const PHASES: Phase[] = [
  { k: "Plan", window: "months before", cumPct: 20,
    blurb: "Most of the footprint is decided here, before anything is measured: the venue, the menu, and how far people will travel.",
    captures: [["Venue booking", "Location and energy profile set the baseline"], ["Registration data", "Attendee locations, the input for travel estimates"], ["Supplier contracts", "Caterers, AV, and build crews identified for data requests"]] },
  { k: "Live", window: "event days", cumPct: 75,
    blurb: "The heavy rows land while the event runs: energy is drawn, meals are served, and everyone who travelled has now arrived.",
    captures: [["Venue energy", "Metered use over the event days, attributed to this event"], ["Catering counts", "Meals actually served, by menu type"], ["Freight movements", "Stands and equipment in, tracked as they arrive"]] },
  { k: "Wrap", window: "weeks after", cumPct: 100,
    blurb: "The last figures arrive with the invoices, and the report goes to the client while the event still matters to them.",
    captures: [["Waste transfer notes", "What left the site, and where it went"], ["Final supplier invoices", "Actuals replacing the estimates made in planning"], ["Footprint report", "The full picture, assumptions stated, ready for the client"]] },
];

export function EventTimeline() {
  const [sel, setSel] = useState(1);
  const reduce = useReducedMotion();
  const p = PHASES[sel];

  return (
    <div className="overflow-hidden rounded-3xl border border-border bg-surface shadow-float">
      <div className="flex items-center justify-between border-b border-border px-6 py-4">
        <span className="font-mono text-[0.68rem] uppercase tracking-[0.16em] text-text-muted">The life of an event footprint</span>
        <span className="font-mono text-[0.68rem] tabular-nums text-accent-3">~{p.cumPct}% captured</span>
      </div>

      {/* rail */}
      <div className="px-6 pt-6">
        <div className="relative h-2 rounded-full bg-canvas">
          <div className="absolute inset-y-0 left-0 rounded-full motion-safe:transition-[width] motion-safe:duration-500" style={{ width: `${p.cumPct}%`, background: `linear-gradient(90deg, #2f6fe0, ${ACCENT})` }} />
          {PHASES.map((x, i) => (
            <button key={x.k} onClick={() => setSel(i)} onMouseEnter={() => setSel(i)} onFocus={() => setSel(i)} aria-pressed={i === sel} aria-label={`${x.k} phase`}
              className="absolute top-1/2 -translate-x-1/2 -translate-y-1/2 rounded-full focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
              style={{ left: `${x.cumPct - (i === 0 ? 10 : i === 1 ? 0 : 0)}%` }}>
              <motion.span className="block h-5 w-5 rounded-full border-[3px]"
                animate={{ borderColor: i <= sel ? ACCENT : "var(--color-border)", background: i === sel ? ACCENT : "var(--color-surface)", scale: i === sel ? 1.15 : 1 }}
                transition={reduce ? { duration: 0 } : { type: "spring", stiffness: 400, damping: 26 }} />
            </button>
          ))}
        </div>
        <div className="mt-3 flex">
          {PHASES.map((x, i) => (
            <button key={x.k} onClick={() => setSel(i)} onMouseEnter={() => setSel(i)} onFocus={() => setSel(i)} aria-pressed={i === sel}
              className="flex-1 text-left first:text-left last:text-right focus-visible:outline focus-visible:outline-2 focus-visible:outline-accent"
              style={{ textAlign: i === 0 ? "left" : i === 1 ? "center" : "right" }}>
              <span className="font-display text-[0.95rem] font-semibold" style={{ color: i === sel ? "#fff" : "var(--color-text-muted)" }}>{x.k}</span>
              <span className="block text-[0.66rem] text-text-muted">{x.window}</span>
            </button>
          ))}
        </div>
      </div>

      {/* phase detail */}
      <motion.div key={p.k} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.24 }} className="p-6">
        <p className="max-w-2xl text-[0.92rem] leading-relaxed text-white">{p.blurb}</p>
        <div className="mt-5 grid gap-3 sm:grid-cols-3">
          {p.captures.map(([t, d], i) => (
            <motion.div key={t} className="rounded-2xl border border-border bg-canvas p-4"
              initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.05 + i * 0.07 }}>
              <div className="flex items-center gap-2">
                <span className="grid h-5 w-5 shrink-0 place-items-center rounded-full font-mono text-[0.54rem] font-bold" style={{ background: "rgba(77,139,245,0.16)", color: "#8fbaff" }}>{i + 1}</span>
                <h4 className="font-display text-[0.86rem] font-semibold text-white">{t}</h4>
              </div>
              <p className="mt-2 text-[0.76rem] leading-relaxed text-text-muted">{d}</p>
            </motion.div>
          ))}
        </div>
      </motion.div>
      <p className="border-t border-border px-6 py-2.5 text-[0.64rem] text-text-muted">Capture shares are indicative. Select a phase to explore it.</p>
    </div>
  );
}

/* ============================================================
   PRESSURE CARDS, shared shape for the "why now" trio.
   ============================================================ */
export function PressureCards({ items }: { items: { tag: string; title: string; desc: string }[] }) {
  const [sel, setSel] = useState<number | null>(null);
  return (
    <div className="grid gap-5 lg:grid-cols-3">
      {items.map((x, i) => (
        <button key={x.title} onMouseEnter={() => setSel(i)} onMouseLeave={() => setSel(null)} onFocus={() => setSel(i)} onBlur={() => setSel(null)}
          className="group flex h-full flex-col rounded-3xl border p-7 text-left transition-all focus-visible:outline focus-visible:outline-2 focus-visible:outline-accent motion-safe:hover:-translate-y-1"
          style={{ borderColor: sel === i ? "rgba(77,139,245,0.5)" : "var(--color-border)", background: "var(--color-surface)" }}>
          <span className="w-fit rounded-full px-2.5 py-1 font-mono text-[0.62rem] font-bold uppercase tracking-wide" style={{ background: "rgba(77,139,245,0.12)", color: "#8fbaff" }}>{x.tag}</span>
          <h3 className="mt-4 font-display text-lg font-semibold text-white">{x.title}</h3>
          <p className="mt-2 flex-1 text-sm leading-relaxed text-text-muted">{x.desc}</p>
        </button>
      ))}
    </div>
  );
}
