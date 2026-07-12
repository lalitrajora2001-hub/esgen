"use client";

import { useState } from "react";
import { motion } from "framer-motion";

const ACCENT = "#4d8bf5";

/* ---------------- Tier selector ---------------- */
type Tier = { k: string; sub: string; benefits: string[]; feature: string };
const TIERS: Tier[] = [
  { k: "Registered", sub: "Start referring", feature: "Deal registration & referral fees",
    benefits: ["Referral commission on closed deals", "Partner portal and sales materials", "Product training for your team", "Co-branded proposal templates"] },
  { k: "Certified", sub: "Deliver on the platform", feature: "Deliver engagements in ESGen",
    benefits: ["Everything in Registered", "Deliver client work inside ESGen", "Consultant workspace across clients", "Priority technical support", "Listed in the partner directory"] },
  { k: "Strategic", sub: "Build your practice on it", feature: "White-label & joint go-to-market",
    benefits: ["Everything in Certified", "White-labelled reporting output", "Joint go-to-market and events", "Early access to new modules", "Dedicated partner manager"] },
];

export function TierSelector() {
  const [i, setI] = useState(1);
  const t = TIERS[i];
  return (
    <div className="overflow-hidden rounded-3xl border border-border bg-surface shadow-float">
      <div className="grid gap-px bg-border sm:grid-cols-3">
        {TIERS.map((x, k) => {
          const on = k === i;
          return (
            <button key={x.k} onClick={() => setI(k)} onMouseEnter={() => setI(k)} aria-pressed={on}
              className="relative px-5 py-5 text-left transition-colors focus-visible:outline focus-visible:-outline-offset-2 focus-visible:outline-accent"
              style={{ background: on ? "var(--color-surface-2)" : "var(--color-surface)" }}>
              {on && <motion.span layoutId="tiertop" className="absolute inset-x-0 top-0 h-0.5" style={{ background: ACCENT }} />}
              <div className="flex items-baseline justify-between">
                <span className="font-display text-lg font-bold" style={{ color: on ? "#fff" : "var(--color-text-muted)" }}>{x.k}</span>
                <span className="font-mono text-[0.6rem] uppercase tracking-wide text-text-muted">0{k + 1}</span>
              </div>
              <div className="mt-1 text-[0.74rem]" style={{ color: on ? "#8fbaff" : "var(--color-text-muted)" }}>{x.sub}</div>
            </button>
          );
        })}
      </div>

      <div className="grid gap-0 md:grid-cols-[1fr_1fr]">
        <div className="p-6 sm:p-8">
          <motion.div key={t.k} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.24 }}>
            <p className="font-mono text-[0.66rem] uppercase tracking-[0.16em] text-text-muted">Defining benefit</p>
            <h3 className="mt-3 font-display text-2xl font-bold text-white">{t.feature}</h3>
            <ul className="mt-6 space-y-2.5">
              {t.benefits.map((b, k) => (
                <motion.li key={b} className="flex items-start gap-3 text-[0.9rem] text-white"
                  initial={{ opacity: 0, x: -6 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.05 + k * 0.05 }}>
                  <span className="mt-0.5 grid h-4 w-4 shrink-0 place-items-center rounded-full" style={{ background: "rgba(67,198,183,0.16)", color: "var(--color-teal)" }}>
                    <svg viewBox="0 0 24 24" className="h-2.5 w-2.5" fill="none" stroke="currentColor" strokeWidth="3.4" strokeLinecap="round"><path d="M5 13l4 4L19 7" /></svg>
                  </span>{b}
                </motion.li>
              ))}
            </ul>
          </motion.div>
        </div>
        <div className="border-t border-border bg-gradient-to-br from-surface-2 to-surface p-6 sm:p-8 md:border-l md:border-t-0">
          <p className="font-mono text-[0.66rem] uppercase tracking-[0.16em] text-text-muted">How tiers build</p>
          <div className="mt-5 space-y-2">
            {TIERS.map((x, k) => {
              const reached = k <= i;
              return (
                <div key={x.k} className="flex items-center gap-3 rounded-xl border p-3 transition-colors"
                  style={{ borderColor: k === i ? "rgba(77,139,245,0.4)" : "var(--color-border)", background: reached ? "rgba(77,139,245,0.06)" : "transparent" }}>
                  <span className="grid h-7 w-7 shrink-0 place-items-center rounded-full font-mono text-[0.66rem] font-bold"
                    style={{ background: reached ? ACCENT : "var(--color-border)", color: reached ? "#00122e" : "var(--color-text-muted)" }}>{k + 1}</span>
                  <div className="min-w-0">
                    <div className="text-[0.82rem] font-semibold" style={{ color: reached ? "#fff" : "var(--color-text-muted)" }}>{x.k}</div>
                    <div className="truncate text-[0.68rem] text-text-muted">{x.sub}</div>
                  </div>
                </div>
              );
            })}
          </div>
          <p className="mt-5 text-[0.72rem] leading-relaxed text-text-muted">Each tier includes everything below it. You move up as your practice grows.</p>
        </div>
      </div>
    </div>
  );
}

/* Hoisted so it isn't a fresh component type each render (which would remount
   the slider mid-drag). */
function Slider({ label, value, set, min, max, step, fmt }: { label: string; value: number; set: (n: number) => void; min: number; max: number; step: number; fmt: (n: number) => string }) {
  return (
    <div>
      <div className="flex items-baseline justify-between">
        <label className="text-[0.8rem] font-semibold text-white">{label}</label>
        <span className="font-mono text-[0.82rem] font-bold text-accent-3">{fmt(value)}</span>
      </div>
      <input type="range" min={min} max={max} step={step} value={value} onChange={(e) => set(+e.target.value)} aria-label={label}
        className="mt-2 h-1.5 w-full cursor-ew-resize appearance-none rounded-full accent-[#4d8bf5]"
        style={{ background: "var(--color-border)" }} />
    </div>
  );
}

/* ---------------- Illustrative practice model ---------------- */
export function PracticeModel() {
  const [clients, setClients] = useState(12);
  const [depth, setDepth] = useState(1); // 0 measure, 1 comply, 2 advise

  const DEPTH = ["Measurement only", "Multi-framework reporting", "Full advisory engagements"];
  const reachFactor = [1, 1.6, 2.4][depth];
  const retention = [72, 84, 93][depth];
  const activeClients = clients;
  const engagementBreadth = Math.round(clients * reachFactor);

  return (
    <div className="grid gap-0 overflow-hidden rounded-3xl border border-border bg-surface md:grid-cols-2">
      <div className="space-y-6 p-6 sm:p-8">
        <p className="font-mono text-[0.66rem] uppercase tracking-[0.16em] text-text-muted">Model your practice</p>
        <Slider label="Clients on ESGen" value={clients} set={setClients} min={1} max={60} step={1} fmt={(n) => `${n}`} />
        <div>
          <label className="text-[0.8rem] font-semibold text-white">Typical engagement depth</label>
          <div className="mt-2 flex gap-1 rounded-xl border border-border bg-canvas p-1">
            {DEPTH.map((d, k) => (
              <button key={d} onClick={() => setDepth(k)} aria-pressed={depth === k}
                className="relative flex-1 rounded-lg px-2 py-2 text-[0.68rem] font-semibold leading-tight transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-accent"
                style={{ color: depth === k ? "#00122e" : "var(--color-text-muted)" }}>
                {depth === k && <motion.span layoutId="depthpill" className="absolute inset-0 rounded-lg" style={{ background: ACCENT }} transition={{ type: "spring", stiffness: 400, damping: 32 }} />}
                <span className="relative">{d}</span>
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-px bg-border">
        {[
          ["Active clients", String(activeClients), "delivering in ESGen"],
          ["Engagement breadth", String(engagementBreadth), "modules across clients"],
          ["Modelled retention", `${retention}%`, "at this depth"],
          ["Delivery mode", DEPTH[depth].split(" ")[0], DEPTH[depth]],
        ].map(([k, v, note], idx) => (
          <div key={idx} className="bg-surface-2 p-6">
            <div className="font-mono text-[0.6rem] uppercase tracking-wide text-text-muted">{k}</div>
            <motion.div key={v} initial={{ opacity: 0.4, y: -3 }} animate={{ opacity: 1, y: 0 }} className="mt-2 font-display text-2xl font-bold tabular-nums text-white">{v}</motion.div>
            <div className="mt-1 text-[0.68rem] text-text-muted">{note}</div>
          </div>
        ))}
        <div className="col-span-2 bg-surface p-4 text-center text-[0.66rem] text-text-muted">Illustrative relationships between depth, breadth, and retention, not a revenue projection or guarantee.</div>
      </div>
    </div>
  );
}
