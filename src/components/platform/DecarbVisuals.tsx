"use client";

import { useState } from "react";
import { motion, useReducedMotion } from "framer-motion";
import { useReveal } from "@/components/whiteui/kit";
import { GK } from "@/components/platform/CarbonVisuals";

/* Decarbonisation action-plan visuals. All figures are illustrative. */

/* ================= Hero: floating cards on an organic green panel ================= */
export function HeroFloatingCards() {
  const { ref, inView } = useReveal();
  const reduce = useReducedMotion();
  const [progress, setProgress] = useState(58);
  /* One control drives the card set: roadmap progress → SBTi coverage →
     modelled abatement and the scenario bars. Coverage is a percentage, so
     it saturates at 100 rather than running past it. */
  const sbti = Math.min(100, Math.round(12 + progress));
  const abated = Math.round(progress * 1.1);
  const bars = [96, 96 - progress * 0.55, 96 - progress * 0.78, 96 - progress * 1.05].map((b) => Math.max(8, Math.round(b)));

  return (
    <div ref={ref} className="relative overflow-hidden rounded-2xl" style={{ aspectRatio: "5 / 4", background: "linear-gradient(140deg,#1d3d22 0%,#2f6b32 40%,#4f9440 70%,#7cae55 100%)" }}>
      <div aria-hidden className="absolute inset-0" style={{ background: "radial-gradient(70% 60% at 25% 30%, rgba(255,255,255,0.16), transparent 60%)" }} />

      {/* SBTi progress, derived from the roadmap slider */}
      <motion.div className="absolute left-[6%] top-[10%] w-[46%] rounded-xl bg-white p-3 shadow-xl"
        initial={{ opacity: 0, y: 14 }} animate={inView ? { opacity: 1, y: 0 } : {}} transition={{ duration: 0.5, delay: 0.1 }}>
        <div className="text-[0.6rem] font-semibold" style={{ color: GK.ink }}>SBTi scope 1</div>
        <div className="mt-1 flex items-center gap-2">
          <span className="font-display text-sm font-bold tabular-nums" style={{ color: GK.ink }}>{sbti}%</span>
          <div className="h-1.5 flex-1 overflow-hidden rounded-full" style={{ background: "#eef4ee" }}>
            <motion.div className="h-full rounded-full" style={{ background: GK.green }} animate={{ width: `${sbti}%` }} transition={{ type: "spring", stiffness: 220, damping: 28 }} />
          </div>
        </div>
      </motion.div>

      {/* Roadmap, drag or use arrow keys */}
      <motion.div className="absolute right-[5%] top-[16%] w-[42%] rounded-xl bg-white p-3 shadow-xl"
        initial={{ opacity: 0, y: 14 }} animate={inView ? { opacity: 1, y: 0 } : {}} transition={{ duration: 0.5, delay: 0.25 }}>
        <div className="flex items-baseline justify-between gap-1">
          <span className="font-display text-[0.72rem] font-bold" style={{ color: GK.ink }}>Roadmap</span>
          <span className="font-mono text-[0.56rem] font-bold tabular-nums" style={{ color: GK.greenDk }}>{progress}%</span>
        </div>
        <div className="text-[0.5rem]" style={{ color: GK.muted }}>Drag to model your plan</div>
        <div className="relative mt-3">
          <div className="pointer-events-none absolute inset-x-0 top-1/2 h-1 -translate-y-1/2 rounded-full" style={{ background: "#e2ece5" }}>
            <motion.div className="absolute inset-y-0 left-0 rounded-full" style={{ background: GK.green }} animate={{ width: `${progress}%` }} transition={{ type: "spring", stiffness: 220, damping: 28 }} />
          </div>
          <input type="range" min={0} max={100} value={progress} onChange={(e) => setProgress(+e.target.value)}
            aria-label="Roadmap progress" className="relative z-10 h-4 w-full cursor-ew-resize appearance-none bg-transparent
              [&::-webkit-slider-thumb]:h-3 [&::-webkit-slider-thumb]:w-3 [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:border-2 [&::-webkit-slider-thumb]:border-white [&::-webkit-slider-thumb]:bg-[#16a34a] [&::-webkit-slider-thumb]:shadow
              [&::-moz-range-thumb]:h-3 [&::-moz-range-thumb]:w-3 [&::-moz-range-thumb]:rounded-full [&::-moz-range-thumb]:border-2 [&::-moz-range-thumb]:border-white [&::-moz-range-thumb]:bg-[#16a34a]" />
        </div>
      </motion.div>

      {/* Actions table */}
      <motion.div className="absolute left-[10%] top-[40%] w-[62%] overflow-hidden rounded-xl bg-white shadow-2xl"
        initial={{ opacity: 0, y: 16 }} animate={inView ? { opacity: 1, y: 0 } : {}} transition={{ duration: 0.5, delay: 0.4 }}>
        <div className="grid grid-cols-[0.7fr_1.5fr_0.7fr] bg-[#f7faf8] px-2.5 py-1.5 text-[0.46rem] font-semibold uppercase" style={{ color: GK.muted }}><span>Category</span><span>Action</span><span>Scope</span></div>
        {[["Energy", "Reuse the thermal energy", "Scope 1", "#e9fbef", "#15803d"], ["Digital", "Select energy-efficient hosting", "Scope 3", "#e8edea", "#2f4a3c"], ["Invest", "Encourage supplier targets", "Scope 3", "#f1efe6", "#6b6242"]].map(([c, a, s, bg, fg]) => (
          <div key={c} className="grid grid-cols-[0.7fr_1.5fr_0.7fr] items-center border-t border-[#f2f5f3] px-2.5 py-1.5 text-[0.5rem]">
            <span className="justify-self-start rounded px-1.5 py-0.5 text-[0.44rem] font-semibold" style={{ background: bg, color: fg }}>{c}</span>
            <span className="truncate" style={{ color: GK.ink }}>{a}</span>
            <span style={{ color: GK.muted }}>{s}</span>
          </div>
        ))}
      </motion.div>

      {/* Emissions scenario */}
      <motion.div className="absolute bottom-[6%] right-[5%] w-[46%] rounded-xl bg-white p-3 shadow-2xl"
        initial={{ opacity: 0, y: 16 }} animate={inView ? { opacity: 1, y: 0 } : {}} transition={{ duration: 0.5, delay: 0.55 }}>
        <div className="flex items-start justify-between gap-1">
          <div><div className="text-[0.46rem]" style={{ color: GK.muted }}>Emissions</div><div className="text-[0.46rem]" style={{ color: GK.muted }}>scenario</div></div>
          <motion.span key={abated} initial={{ opacity: 0.5, y: -2 }} animate={{ opacity: 1, y: 0 }} className="shrink-0 font-display text-[0.8rem] font-bold tabular-nums" style={{ color: GK.ink }}>−{abated}t CO₂e</motion.span>
        </div>
        <div className="relative mt-2 flex h-14 items-end gap-1.5 overflow-hidden">
          {bars.map((h, i) => <motion.div key={i} className="flex-1 rounded-t-[2px]" style={{ background: i === 0 ? GK.green : "#16211b" }} initial={{ height: 0 }} animate={inView ? { height: `${h}%` } : {}} transition={{ type: "spring", stiffness: 200, damping: 26 }} />)}
          {!reduce && <motion.div className="pointer-events-none absolute inset-y-0 w-1/4" style={{ background: "linear-gradient(90deg,transparent,rgba(22,163,74,0.22),transparent)" }} animate={{ x: ["-130%", "460%"] }} transition={{ duration: 3, repeat: Infinity, ease: "easeInOut", delay: 1.4 }} />}
        </div>
      </motion.div>
    </div>
  );
}

/* ================= Process tabs ================= */
const TABS: { k: string; d: string; body: React.ReactNode }[] = [
  { k: "Identify", d: "Find the hotspots in your footprint, so effort goes where the emissions actually are.", body: <HotspotBars /> },
  { k: "Quantify", d: "Assess the reduction potential, cost, and payback of each lever available to you.", body: <LeverGrid /> },
  { k: "Build", d: "Turn the chosen levers into a concrete, sequenced action plan with clear owners.", body: <PlanList /> },
  { k: "Apply", d: "Deliver the plan, track progress, and report results through the frameworks you use.", body: <FrameworkChips /> },
];
function HotspotBars() {
  const { ref, inView } = useReveal();
  const bars: [string, number][] = [["Purchased goods", 100], ["Energy", 48], ["Logistics", 32], ["Travel", 20]];
  return (
    <div ref={ref} className="space-y-2">
      {bars.map(([n, w], i) => (
        <div key={n} className="flex items-center gap-3">
          <span className="w-32 shrink-0 text-[0.72rem]" style={{ color: GK.ink }}>{n}</span>
          <div className="h-2.5 flex-1 overflow-hidden rounded-full" style={{ background: "#eef4ee" }}><motion.div className="h-full rounded-full" style={{ background: i === 0 ? GK.green : "#9ad9b2" }} initial={{ width: 0 }} animate={inView ? { width: `${w}%` } : {}} transition={{ duration: 0.8, delay: 0.1 + i * 0.08 }} /></div>
        </div>
      ))}
    </div>
  );
}
function LeverGrid() {
  const rows: [string, string, string][] = [["Renewable tariff", "Low cost", "1 yr"], ["LED retrofit", "Low cost", "2 yr"], ["Fleet EVs", "Med cost", "4 yr"]];
  return (
    <div className="overflow-hidden rounded-lg border border-[#e2ece5]">
      <div className="grid grid-cols-3 bg-[#f7faf8] px-3 py-1.5 text-[0.56rem] font-semibold uppercase" style={{ color: GK.muted }}><span>Lever</span><span>Cost</span><span>Payback</span></div>
      {rows.map(([a, b, c]) => <div key={a} className="grid grid-cols-3 border-t border-[#f2f5f3] px-3 py-2 text-[0.72rem]"><span style={{ color: GK.ink }}>{a}</span><span style={{ color: GK.muted }}>{b}</span><span className="font-semibold" style={{ color: GK.greenDk }}>{c}</span></div>)}
    </div>
  );
}
function PlanList() {
  const items: [string, boolean][] = [["Switch to a renewable tariff", true], ["Electrify the van fleet", false], ["Engage the top 20 suppliers", false]];
  return (
    <div className="space-y-2">
      {items.map(([l, done]) => (
        <div key={l} className="flex items-center gap-2.5 text-[0.78rem]">
          <span className="grid h-4.5 w-4.5 place-items-center rounded-full" style={{ width: 18, height: 18, background: done ? GK.green : "transparent", border: done ? "none" : "1.5px solid #cbd5cf" }}>{done && <svg viewBox="0 0 24 24" className="h-2.5 w-2.5" fill="none" stroke="#fff" strokeWidth="3.4" strokeLinecap="round"><path d="M5 13l4 4L19 7" /></svg>}</span>
          <span style={{ color: done ? GK.muted : GK.ink, textDecoration: done ? "line-through" : "none" }}>{l}</span>
        </div>
      ))}
    </div>
  );
}
function FrameworkChips() {
  return <div className="flex flex-wrap gap-2">{["CSRD", "SECR", "CDP", "SBTi", "ISSB"].map((f) => <span key={f} className="rounded-md bg-[#ecfdf3] px-3 py-1.5 text-[0.74rem] font-semibold" style={{ color: GK.greenDk }}>{f}</span>)}</div>;
}

export function ProcessTabs() {
  const [i, setI] = useState(0);
  const t = TABS[i];
  return (
    <div>
      <div role="tablist" aria-label="Process steps" className="flex flex-wrap gap-6 border-b border-[#dbe7e0]">
        {TABS.map((tab, k) => (
          <button key={tab.k} role="tab" aria-selected={i === k} onClick={() => setI(k)}
            className="relative pb-3 font-display text-lg font-bold tracking-tight transition-colors"
            style={{ color: i === k ? GK.ink : "#9aa5a0" }}>
            {tab.k}
            {i === k && <motion.span layoutId="tabline" className="absolute inset-x-0 -bottom-px h-0.5 rounded" style={{ background: GK.green }} />}
          </button>
        ))}
      </div>
      <motion.div key={t.k} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.35 }} className="mt-8 grid gap-8 lg:grid-cols-2 lg:items-center">
        <p className="max-w-md text-lg leading-relaxed" style={{ color: GK.body }}>{t.d}</p>
        <div className="rounded-2xl border border-[#e6ece7] bg-white p-6 shadow-[0_24px_50px_-30px_rgba(16,80,50,0.4)]">{t.body}</div>
      </motion.div>
    </div>
  );
}

/* ================= Big SSP scenario chart ================= */
const SSP: [string, string, string][] = [
  ["M90 256 L280 200 L470 140 L665 95 L860 62", "#16241b", "SSP5-8.5 ~ +5°C"],
  ["M90 256 L280 225 L470 196 L665 180 L860 168", "#2f7a52", "SSP3-7.0 ~ +4°C"],
  ["M90 256 L280 246 L470 248 L665 258 L860 272", "#4fae74", "SSP2-4.5 ~ +2.8°C"],
  ["M90 256 L280 286 L470 318 L665 336 L860 344", "#7fd0a0", "SSP1-2.6 ~ +1.9°C"],
  ["M90 256 L280 300 L470 338 L665 352 L860 356", "#a8e5c1", "SSP1-1.9 ~ +1.5°C"],
];
/* Interactive: click a scenario pill to show or hide its trajectory;
   hover to isolate it from the rest. */
export function SSPChart() {
  const { ref, inView } = useReveal();
  const reduce = useReducedMotion();
  const [hidden, setHidden] = useState<Set<number>>(() => new Set());
  const [hover, setHover] = useState<number | null>(null);
  const grid: [number, string][] = [[360, "0"], [268, "40"], [175, "80"], [83, "120"]];
  const toggle = (i: number) => setHidden((p) => { const n = new Set(p); n.has(i) ? n.delete(i) : n.add(i); return n; });
  const visible = SSP.map((_, i) => i).filter((i) => !hidden.has(i));
  const tracer = visible.length ? SSP[visible[visible.length - 1]][0] : null;

  return (
    <div ref={ref}>
      <p className="text-sm font-semibold" style={{ color: GK.muted }}>Reduction trajectories</p>
      <p className="text-sm" style={{ color: GK.muted }}>Past emissions and future scenarios (GtCO₂/yr)</p>
      <h3 className="mt-4 font-display text-3xl font-bold leading-tight sm:text-4xl" style={{ color: "#9aa5a0" }}>Carbon dioxide<br /><span style={{ color: "#b4beb9" }}>(GtCO₂/yr)</span></h3>

      <svg viewBox="0 0 900 400" className="mt-6 w-full">
        {grid.map(([y, l]) => (
          <g key={l}>
            <line x1="90" y1={y} x2="860" y2={y} stroke={y === 360 ? "#5b6560" : "#8f9a94"} strokeWidth={y === 360 ? 1.6 : 1} strokeDasharray={y === 360 ? undefined : "7 6"} />
            <text x="62" y={y + 5} textAnchor="end" fontSize="16" fill="#8f9a94">{l}</text>
          </g>
        ))}
        <line x1="90" y1="45" x2="90" y2="385" stroke="#5b6560" strokeWidth="1.6" />
        <line x1="860" y1="45" x2="860" y2="385" stroke="#5b6560" strokeWidth="1.6" />
        <line x1="90" y1="385" x2="860" y2="385" stroke="#5b6560" strokeWidth="1.6" strokeDasharray="7 6" />

        {SSP.map(([d, c, l], i) => {
          const off = hidden.has(i);
          const dim = hover !== null && hover !== i;
          return (
            <motion.path key={l} d={d} fill="none" stroke={c} strokeLinecap="round"
              initial={{ pathLength: 0 }}
              animate={inView ? { pathLength: off ? 0 : 1, opacity: off ? 0 : dim ? 0.22 : 1, strokeWidth: hover === i ? 4.4 : 2.6 } : {}}
              transition={{ pathLength: { duration: 1.5, delay: off ? 0 : 0.1 * i, ease: [0.16, 1, 0.3, 1] }, opacity: { duration: 0.25 }, strokeWidth: { duration: 0.2 } }} />
          );
        })}
        {!reduce && tracer && <circle key={tracer} r="5" fill="#a8e5c1"><animateMotion dur="5.4s" repeatCount="indefinite" path={tracer} /></circle>}
      </svg>

      <div className="mt-6 flex max-w-2xl flex-wrap gap-3">
        {SSP.map(([, c, l], i) => {
          const off = hidden.has(i);
          return (
            <motion.button key={l} onClick={() => toggle(i)} onPointerEnter={() => setHover(i)} onPointerLeave={() => setHover(null)}
              onFocus={() => setHover(i)} onBlur={() => setHover(null)} aria-pressed={!off}
              className="rounded-full px-4 py-2 font-display text-base font-bold transition-opacity focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#16a34a] sm:text-lg"
              style={{
                background: off ? "transparent" : i === 0 ? "transparent" : c,
                color: off ? "#9aa5a0" : i === 0 ? GK.ink : i >= 3 ? GK.ink : "#ffffff",
                border: i === 0 || off ? `2px solid ${off ? "#cfd8d3" : c}` : "2px solid transparent",
                textDecoration: off ? "line-through" : "none",
              }}
              initial={{ opacity: 0, scale: 0.9 }} animate={inView ? { opacity: 1, scale: 1 } : {}} transition={{ delay: 0.4 + i * 0.08 }}
              whileHover={reduce ? undefined : { y: -2 }}>{l}</motion.button>
          );
        })}
      </div>
      <p className="mt-4 text-[0.8rem]" style={{ color: GK.muted }}>Select a scenario to show or hide its trajectory.</p>
      <p className="mt-3 text-lg" style={{ color: "#b4beb9" }}>Illustrative, based on IPCC AR6 SSP scenarios</p>
    </div>
  );
}
