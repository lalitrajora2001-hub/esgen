"use client";

import { useMemo, useState } from "react";
import { motion } from "framer-motion";

/* Dark-theme pricing, no invented prices. ESGen, like the reference vendors,
   scopes commercially. This configurator shows what a setup would contain, and
   which plan shape fits, from the user's own inputs. */

const ACCENT = "#4d8bf5";

/* ---------------- Interactive plan configurator ---------------- */
type Framework = { k: string; scope3: boolean; assured: boolean };
const FRAMEWORKS: Framework[] = [
  { k: "SECR", scope3: false, assured: false },
  { k: "UK SRS", scope3: true, assured: true },
  { k: "CSRD / ESRS", scope3: true, assured: true },
  { k: "SBTi target", scope3: true, assured: false },
  { k: "CDP disclosure", scope3: true, assured: false },
  { k: "TCFD / IFRS S2", scope3: true, assured: true },
  { k: "CBAM", scope3: true, assured: false },
  { k: "Customer questionnaire", scope3: false, assured: false },
];
const SIZES = ["1 entity", "2–5 entities", "6–20 entities", "20+ entities"];

type Plan = { k: string; tag: string; blurb: string };
const PLANS: Plan[] = [
  { k: "Measure", tag: "Foundation", blurb: "Build a complete, auditable inventory and report to a single framework." },
  { k: "Comply", tag: "Most common", blurb: "Multi-framework reporting with supplier data collection and assurance-ready evidence." },
  { k: "Advise", tag: "Guided", blurb: "Everything in Comply, plus hands-on advisory and compliance support from our team." },
];

export function PlanConfigurator() {
  const [picked, setPicked] = useState<Set<string>>(() => new Set(["CSRD / ESRS"]));
  const [size, setSize] = useState(1);
  const [advisory, setAdvisory] = useState(false);

  const toggle = (k: string) => setPicked((p) => { const n = new Set(p); n.has(k) ? n.delete(k) : n.add(k); return n; });

  const sel = FRAMEWORKS.filter((f) => picked.has(f.k));
  const needsScope3 = sel.some((f) => f.scope3);
  const needsAssurance = sel.some((f) => f.assured);
  const multi = sel.length >= 2;

  const recommended = useMemo(() => {
    if (advisory) return 2;
    if (multi || needsAssurance || needsScope3) return 1;
    return 0;
  }, [advisory, multi, needsAssurance, needsScope3]);

  const modules = useMemo(() => {
    const m = new Set<string>(["GHG inventory (Scope 1 & 2)", "Reporting workspace"]);
    if (needsScope3) { m.add("Scope 3 modelling"); m.add("Supplier data collection"); }
    if (needsAssurance) m.add("Assurance-ready audit trail");
    if (multi) m.add("Multi-framework mapping");
    if (size >= 2) m.add("Multi-entity consolidation");
    if (advisory) { m.add("Advisory support"); m.add("Compliance support"); }
    return [...m];
  }, [needsScope3, needsAssurance, multi, size, advisory]);

  return (
    <div className="overflow-hidden rounded-3xl border border-border bg-surface shadow-float">
      <div className="grid lg:grid-cols-[1.1fr_0.9fr]">
        {/* inputs */}
        <div className="border-b border-border p-6 sm:p-8 lg:border-b-0 lg:border-r">
          <p className="font-mono text-[0.68rem] uppercase tracking-[0.16em] text-text-muted">Configure your setup</p>

          <h3 className="mt-5 text-sm font-semibold text-white">What do you need to report to?</h3>
          <div className="mt-3 flex flex-wrap gap-2">
            {FRAMEWORKS.map((f) => {
              const on = picked.has(f.k);
              return (
                <button key={f.k} onClick={() => toggle(f.k)} aria-pressed={on}
                  className="rounded-full border px-3.5 py-1.5 text-[0.8rem] font-medium transition-all focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
                  style={{ borderColor: on ? "transparent" : "var(--color-border)", background: on ? ACCENT : "transparent", color: on ? "#00122e" : "var(--color-text-muted)" }}>
                  {f.k}
                </button>
              );
            })}
          </div>

          <h3 className="mt-7 text-sm font-semibold text-white">How many legal entities?</h3>
          <div className="mt-3 flex gap-1 rounded-xl border border-border bg-canvas p-1">
            {SIZES.map((s, i) => (
              <button key={s} onClick={() => setSize(i)} aria-pressed={size === i}
                className="relative flex-1 rounded-lg px-2 py-2 text-[0.74rem] font-semibold transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-accent"
                style={{ color: size === i ? "#00122e" : "var(--color-text-muted)" }}>
                {size === i && <motion.span layoutId="sizepill" className="absolute inset-0 rounded-lg" style={{ background: ACCENT }} transition={{ type: "spring", stiffness: 400, damping: 32 }} />}
                <span className="relative">{s}</span>
              </button>
            ))}
          </div>

          <label className="mt-7 flex cursor-pointer items-center justify-between rounded-xl border border-border bg-canvas px-4 py-3.5">
            <span className="text-sm font-semibold text-white">I want hands-on advisory support</span>
            <button role="switch" aria-checked={advisory} onClick={() => setAdvisory(!advisory)} aria-label="Advisory support"
              className="relative h-6 w-11 rounded-full transition-colors" style={{ background: advisory ? ACCENT : "var(--color-border)" }}>
              <motion.span className="absolute top-0.5 h-5 w-5 rounded-full bg-white shadow" animate={{ left: advisory ? 22 : 2 }} transition={{ type: "spring", stiffness: 500, damping: 34 }} />
            </button>
          </label>
        </div>

        {/* output */}
        <div className="bg-gradient-to-b from-surface-2 to-surface p-6 sm:p-8">
          <p className="font-mono text-[0.68rem] uppercase tracking-[0.16em] text-text-muted">Recommended plan</p>
          <motion.div key={recommended} initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.24 }} className="mt-3">
            <div className="flex items-center gap-3">
              <span className="font-display text-3xl font-bold text-white">{PLANS[recommended].k}</span>
              <span className="rounded-full px-2.5 py-0.5 text-[0.62rem] font-bold" style={{ background: "rgba(77,139,245,0.16)", color: "#8fbaff" }}>{PLANS[recommended].tag}</span>
            </div>
            <p className="mt-2 text-sm leading-relaxed text-text-muted">{PLANS[recommended].blurb}</p>
          </motion.div>

          <div className="mt-6">
            <p className="text-[0.72rem] font-semibold uppercase tracking-wide text-text-muted">Modules included</p>
            <ul className="mt-3 space-y-1.5">
              {modules.map((m, i) => (
                <motion.li key={m} className="flex items-center gap-2.5 text-[0.86rem] text-white"
                  initial={{ opacity: 0, x: -6 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.04 }}>
                  <span className="grid h-4 w-4 shrink-0 place-items-center rounded-full" style={{ background: "rgba(67,198,183,0.16)", color: "var(--color-teal)" }}>
                    <svg viewBox="0 0 24 24" className="h-2.5 w-2.5" fill="none" stroke="currentColor" strokeWidth="3.4" strokeLinecap="round"><path d="M5 13l4 4L19 7" /></svg>
                  </span>{m}
                </motion.li>
              ))}
            </ul>
          </div>

          <a href="/contact" className="mt-7 inline-flex w-full items-center justify-center gap-2 rounded-xl px-5 py-3 text-sm font-bold transition-transform hover:-translate-y-0.5"
            style={{ background: ACCENT, color: "#00122e", boxShadow: "0 16px 40px -16px rgba(77,139,245,0.8)" }}>
            Get a quote for this setup
            <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="M5 12h14M13 6l6 6-6 6" /></svg>
          </a>
          <p className="mt-3 text-center text-[0.68rem] text-text-muted">Pricing is scoped to your setup. This configurator suggests a shape, not a price.</p>
        </div>
      </div>
    </div>
  );
}

/* ---------------- Comparison matrix with column highlight ---------------- */
const ROWS: { section: string; items: [string, (boolean | string)[]][] }[] = [
  { section: "Measurement", items: [
    ["Scope 1 & 2 inventory", [true, true, true]],
    ["Scope 3 modelling", [false, true, true]],
    ["Supplier data collection", [false, true, true]],
    ["Emission factor database", [true, true, true]],
  ] },
  { section: "Reporting", items: [
    ["Single framework", [true, true, true]],
    ["Multi-framework mapping", [false, true, true]],
    ["Assurance-ready audit trail", [false, true, true]],
    ["Export & disclosure packs", [true, true, true]],
  ] },
  { section: "Support", items: [
    ["Onboarding & setup", [true, true, true]],
    ["Named contact", [false, true, true]],
    ["Advisory support", [false, false, true]],
    ["Compliance support", [false, false, true]],
  ] },
];

export function CompareMatrix() {
  const [col, setCol] = useState<number | null>(1);
  return (
    <div className="overflow-x-auto">
      <div className="min-w-[640px]" onMouseLeave={() => setCol(null)}>
        <div className="grid grid-cols-[1.4fr_repeat(3,1fr)] items-end gap-4 pb-5">
          <span />
          {PLANS.map((p, i) => (
            <button key={p.k} onMouseEnter={() => setCol(i)} onFocus={() => setCol(i)} aria-pressed={col === i}
              className="rounded-xl px-3 py-3 text-center transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-accent"
              style={{ background: col === i ? "rgba(77,139,245,0.1)" : "transparent" }}>
              <div className="font-display text-lg font-bold" style={{ color: col === i ? "#8fbaff" : "var(--color-text)" }}>{p.k}</div>
              <div className="mt-0.5 text-[0.62rem] uppercase tracking-wide text-text-muted">{p.tag}</div>
            </button>
          ))}
        </div>
        {ROWS.map((sec) => (
          <div key={sec.section}>
            <div className="border-t border-border py-2.5 font-mono text-[0.64rem] uppercase tracking-[0.14em] text-text-muted">{sec.section}</div>
            {sec.items.map(([label, vals]) => (
              <div key={label} className="grid grid-cols-[1.4fr_repeat(3,1fr)] items-center gap-4 border-t border-border/50 py-3">
                <span className="text-[0.86rem] text-white">{label}</span>
                {vals.map((v, i) => (
                  <span key={i} onMouseEnter={() => setCol(i)} className="flex items-center justify-center rounded py-1 transition-colors" style={{ background: col === i ? "rgba(77,139,245,0.08)" : "transparent" }}>
                    {v === true && <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke={ACCENT} strokeWidth="2.6" strokeLinecap="round" strokeLinejoin="round"><path d="M5 13l4 4L19 7" /></svg>}
                    {v === false && <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="#3a4152" strokeWidth="2.2" strokeLinecap="round"><path d="M6 6l12 12M18 6L6 18" /></svg>}
                    {typeof v === "string" && <span className="text-[0.76rem] font-semibold text-white">{v}</span>}
                  </span>
                ))}
              </div>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}
