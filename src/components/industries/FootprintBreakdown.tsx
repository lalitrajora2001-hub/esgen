"use client";

import { useEffect, useState } from "react";
import { motion, useReducedMotion } from "framer-motion";
import type { Category } from "@/lib/industries";

const ACCENT = "#4d8bf5";
/* Blue ramp from brand accent to deep, the first (largest) category is
   brightest, drawing the eye to where the footprint actually sits. */
const RAMP = ["#8fbaff", "#4d8bf5", "#2f6fe0", "#2457b0", "#1b4288", "#132f61"];

export function FootprintBreakdown({ title, categories }: { title: string; categories: Category[] }) {
  const [sel, setSel] = useState(0);
  const [grown, setGrown] = useState(false);
  const reduce = useReducedMotion();
  const c = categories[sel];

  /* Segments grow from zero on mount. useEffect runs even when the tab is
     backgrounded, so the final widths are always correct; the transition just
     animates for a real viewer. */
  useEffect(() => { const t = requestAnimationFrame(() => setGrown(true)); return () => cancelAnimationFrame(t); }, []);

  return (
    <div className="overflow-hidden rounded-3xl border border-border bg-surface shadow-float">
      <div className="flex items-center justify-between border-b border-border px-6 py-4">
        <span className="font-mono text-[0.68rem] uppercase tracking-[0.16em] text-text-muted">{title}</span>
        <span className="flex items-center gap-1.5 text-[0.62rem] font-bold text-teal">
          {!reduce && <motion.span className="h-1.5 w-1.5 rounded-full bg-teal" animate={{ opacity: [1, 0.3, 1] }} transition={{ duration: 1.8, repeat: Infinity }} />}
          modelled
        </span>
      </div>

      {/* stacked bar */}
      <div className="px-6 pt-6">
        <div className="flex h-14 w-full overflow-hidden rounded-xl bg-canvas">
          {categories.map((cat, i) => (
            <button key={cat.k} onMouseEnter={() => setSel(i)} onFocus={() => setSel(i)} onClick={() => setSel(i)} aria-pressed={i === sel} aria-label={`${cat.k}, ${cat.pct}%`}
              className="relative h-full focus-visible:outline focus-visible:outline-2 focus-visible:-outline-offset-2 focus-visible:outline-white motion-safe:transition-all motion-safe:duration-700 motion-safe:ease-out"
              style={{ width: grown ? `${cat.pct}%` : "0%", transitionDelay: `${i * 70}ms`, background: RAMP[i % RAMP.length], opacity: sel === i ? 1 : 0.55 }}>
              {cat.pct >= 10 && <span className="absolute inset-0 grid place-items-center text-[0.7rem] font-bold" style={{ color: i < 2 ? "#00122e" : "#dbe6ff" }}>{cat.pct}%</span>}
              {!reduce && sel === i && <motion.span layoutId="fpmark" className="absolute inset-x-0 -bottom-0 h-1 bg-white" />}
            </button>
          ))}
        </div>
      </div>

      <div className="grid gap-0 md:grid-cols-[1fr_1fr]">
        {/* legend */}
        <div className="p-6">
          {categories.map((cat, i) => {
            const on = i === sel;
            return (
              <button key={cat.k} onMouseEnter={() => setSel(i)} onFocus={() => setSel(i)} onClick={() => setSel(i)} aria-pressed={on}
                className="flex w-full items-center gap-3 rounded-lg px-2 py-2 text-left transition-colors hover:bg-white/[0.03] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-1 focus-visible:outline-accent"
                style={{ background: on ? "rgba(77,139,245,0.08)" : undefined }}>
                <motion.span className="h-3 w-3 shrink-0 rounded-sm" style={{ background: RAMP[i % RAMP.length] }} animate={{ scale: on ? 1.25 : 1 }} />
                <span className="min-w-0 flex-1 truncate text-[0.86rem]" style={{ color: on ? "#fff" : "var(--color-text-muted)", fontWeight: on ? 600 : 400 }}>{cat.k}</span>
                <span className="shrink-0 font-mono text-[0.78rem] tabular-nums" style={{ color: on ? "#8fbaff" : "var(--color-text-muted)" }}>{cat.pct}%</span>
              </button>
            );
          })}
        </div>

        {/* detail */}
        <div className="border-t border-border bg-gradient-to-b from-surface-2 to-surface p-6 md:border-l md:border-t-0">
          <motion.div key={c.k} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.24 }}>
            <div className="flex items-center gap-2">
              <span className="rounded px-2 py-0.5 text-[0.6rem] font-bold" style={{ background: "rgba(77,139,245,0.16)", color: "#8fbaff" }}>{c.scope}</span>
            </div>
            <div className="mt-3 flex items-end gap-2">
              <span className="font-display text-4xl font-bold tabular-nums text-white">{c.pct}<span className="text-2xl">%</span></span>
              <span className="pb-1.5 text-[0.8rem] text-text-muted">of the footprint</span>
            </div>
            <h4 className="mt-3 font-display text-lg font-semibold text-white">{c.k}</h4>
            <p className="mt-2 text-[0.88rem] leading-relaxed text-text-muted">{c.driver}</p>
          </motion.div>
        </div>
      </div>
      <p className="border-t border-border px-6 py-2.5 text-[0.64rem] text-text-muted">Illustrative of a typical profile. Your own measurement sets the real shares.</p>
    </div>
  );
}
