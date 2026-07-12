"use client";

import { useEffect, useState } from "react";
import { motion, useReducedMotion } from "framer-motion";
import type { Category } from "@/lib/industries";

/* Two palettes: the dark card used on the Events page, and a white and
   black editorial treatment for the Manufacturing page. */
const THEMES = {
  dark: {
    card: "rounded-3xl border border-border bg-surface shadow-float",
    topBorder: "border-border",
    label: "text-text-muted",
    live: "#43c6b7",
    track: "var(--color-canvas)",
    ramp: ["#8fbaff", "#4d8bf5", "#2f6fe0", "#2457b0", "#1b4288", "#132f61"],
    pctOnSeg: (i: number) => (i < 2 ? "#00122e" : "#dbe6ff"),
    marker: "#ffffff",
    legendHover: "hover:bg-white/[0.03]",
    legendActiveBg: "rgba(77,139,245,0.08)",
    legendText: (on: boolean) => (on ? "#fff" : "var(--color-text-muted)"),
    legendPct: (on: boolean) => (on ? "#8fbaff" : "var(--color-text-muted)"),
    detail: "border-border bg-gradient-to-b from-surface-2 to-surface",
    chipBg: "rgba(77,139,245,0.16)", chipFg: "#8fbaff",
    big: "text-white", h4: "text-white", body: "text-text-muted",
    foot: "border-border text-text-muted",
    focus: "focus-visible:outline-accent",
  },
  light: {
    card: "rounded-3xl border border-[#e6e8ec] bg-white shadow-[0_28px_70px_-38px_rgba(16,19,24,0.35)]",
    topBorder: "border-[#eceef1]",
    label: "text-[#565d68]",
    live: "#101318",
    track: "#eef0f3",
    ramp: ["#101318", "#31363e", "#565d68", "#7d848f", "#a6acb5", "#cdd2d8"],
    pctOnSeg: (i: number) => (i < 3 ? "#ffffff" : "#101318"),
    marker: "#101318",
    legendHover: "hover:bg-[#f4f5f7]",
    legendActiveBg: "#f0f1f3",
    legendText: (on: boolean) => (on ? "#101318" : "#565d68"),
    legendPct: (on: boolean) => (on ? "#101318" : "#8a919c"),
    detail: "border-[#eceef1] bg-[#f7f8f9]",
    chipBg: "#101318", chipFg: "#ffffff",
    big: "text-[#101318]", h4: "text-[#101318]", body: "text-[#565d68]",
    foot: "border-[#eceef1] text-[#8a919c]",
    focus: "focus-visible:outline-[#101318]",
  },
} as const;

export function FootprintBreakdown({ title, categories, variant = "dark" }: { title: string; categories: Category[]; variant?: "dark" | "light" }) {
  const [sel, setSel] = useState(0);
  const [grown, setGrown] = useState(false);
  const reduce = useReducedMotion();
  const c = categories[sel];
  const T = THEMES[variant];

  /* Segments grow from zero on mount. useEffect runs even when the tab is
     backgrounded, so the final widths are always correct; the transition just
     animates for a real viewer. */
  useEffect(() => { const t = requestAnimationFrame(() => setGrown(true)); return () => cancelAnimationFrame(t); }, []);

  return (
    <div className={`overflow-hidden ${T.card}`}>
      <div className={`flex items-center justify-between border-b px-6 py-4 ${T.topBorder}`}>
        <span className={`font-mono text-[0.68rem] uppercase tracking-[0.16em] ${T.label}`}>{title}</span>
        <span className="flex items-center gap-1.5 text-[0.62rem] font-bold" style={{ color: T.live }}>
          {!reduce && <motion.span className="h-1.5 w-1.5 rounded-full" style={{ background: T.live }} animate={{ opacity: [1, 0.3, 1] }} transition={{ duration: 1.8, repeat: Infinity }} />}
          modelled
        </span>
      </div>

      {/* stacked bar */}
      <div className="px-6 pt-6">
        <div className="flex h-14 w-full overflow-hidden rounded-xl" style={{ background: T.track }}>
          {categories.map((cat, i) => (
            <button key={cat.k} onMouseEnter={() => setSel(i)} onFocus={() => setSel(i)} onClick={() => setSel(i)} aria-pressed={i === sel} aria-label={`${cat.k}, ${cat.pct}%`}
              className={`relative h-full focus-visible:outline focus-visible:outline-2 focus-visible:-outline-offset-2 motion-safe:transition-all motion-safe:duration-700 motion-safe:ease-out ${variant === "dark" ? "focus-visible:outline-white" : "focus-visible:outline-[#101318]"}`}
              style={{ width: grown ? `${cat.pct}%` : "0%", transitionDelay: `${i * 70}ms`, background: T.ramp[i % T.ramp.length], opacity: sel === i ? 1 : 0.55 }}>
              {cat.pct >= 10 && <span className="absolute inset-0 grid place-items-center text-[0.7rem] font-bold" style={{ color: T.pctOnSeg(i) }}>{cat.pct}%</span>}
              {!reduce && sel === i && <motion.span layoutId={`fpmark-${variant}`} className="absolute inset-x-0 -bottom-0 h-1" style={{ background: T.marker }} />}
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
                className={`flex w-full items-center gap-3 rounded-lg px-2 py-2 text-left transition-colors ${T.legendHover} focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-1 ${T.focus}`}
                style={{ background: on ? T.legendActiveBg : undefined }}>
                <motion.span className="h-3 w-3 shrink-0 rounded-sm" style={{ background: T.ramp[i % T.ramp.length] }} animate={{ scale: on ? 1.25 : 1 }} />
                <span className="min-w-0 flex-1 truncate text-[0.86rem]" style={{ color: T.legendText(on), fontWeight: on ? 600 : 400 }}>{cat.k}</span>
                <span className="shrink-0 font-mono text-[0.78rem] tabular-nums" style={{ color: T.legendPct(on) }}>{cat.pct}%</span>
              </button>
            );
          })}
        </div>

        {/* detail */}
        <div className={`border-t p-6 md:border-l md:border-t-0 ${T.detail}`}>
          <motion.div key={c.k} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.24 }}>
            <div className="flex items-center gap-2">
              <span className="rounded px-2 py-0.5 text-[0.6rem] font-bold" style={{ background: T.chipBg, color: T.chipFg }}>{c.scope}</span>
            </div>
            <div className="mt-3 flex items-end gap-2">
              <span className={`font-display text-4xl font-bold tabular-nums ${T.big}`}>{c.pct}<span className="text-2xl">%</span></span>
              <span className={`pb-1.5 text-[0.8rem] ${T.body}`}>of the footprint</span>
            </div>
            <h4 className={`mt-3 font-display text-lg font-semibold ${T.h4}`}>{c.k}</h4>
            <p className={`mt-2 text-[0.88rem] leading-relaxed ${T.body}`}>{c.driver}</p>
          </motion.div>
        </div>
      </div>
      <p className={`border-t px-6 py-2.5 text-[0.64rem] ${T.foot}`}>Illustrative of a typical profile. Your own measurement sets the real shares.</p>
    </div>
  );
}
