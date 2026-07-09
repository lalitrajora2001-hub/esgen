"use client";

import { useRef, useState } from "react";
import { motion, useReducedMotion } from "framer-motion";
import { Count, EsgenMark, useReveal } from "@/components/whiteui/kit";

/* Green-themed carbon-assessment mockups. All figures are illustrative. */
export const GK = {
  ink: "#0f1720", body: "#47505c", muted: "#6b7280", line: "#e6ece7",
  green: "#16a34a", greenDk: "#15803d", green2: "#4ade80", green3: "#bbf7d0",
  s1: "#14532d", s2: "#16a34a", s3: "#86efac", tint: "#f0fdf4",
};

/* ============================ Hero dashboard ============================
   Interactive: select a scope to drill into it. The donut, the centre
   figure, and the trend chart all respond.                                */
const SCOPES: [string, number, string][] = [["Scope 1", 3540, GK.s1], ["Scope 2", 6820, GK.s2], ["Scope 3", 37650, GK.s3]];
const TRENDS: Record<string, number[]> = {
  total: [100, 92, 86, 78, 70, 61],
  "Scope 1": [100, 95, 90, 84, 79, 72],
  "Scope 2": [100, 88, 74, 62, 52, 41],
  "Scope 3": [100, 93, 88, 80, 72, 64],
};
export function CarbonDashboard() {
  const { ref, inView } = useReveal();
  const [sel, setSel] = useState<number | null>(null);
  const total = SCOPES.reduce((s, x) => s + x[1], 0);
  const trend = TRENDS[sel === null ? "total" : SCOPES[sel][0]];
  const pick = (i: number) => setSel((p) => (p === i ? null : i));
  let acc = 0;

  return (
    <div ref={ref} className="overflow-hidden rounded-2xl border border-[#e6ece7] bg-white p-5 shadow-[0_36px_70px_-34px_rgba(16,80,50,0.45)]">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2"><EsgenMark color={GK.green} className="h-5 w-7" /><span className="font-display text-base font-bold" style={{ color: GK.ink }}>Corporate carbon footprint</span></div>
        <span className="flex items-center gap-1.5 text-[0.55rem] font-semibold uppercase tracking-wide" style={{ color: GK.muted }}><span className="live-dot h-1.5 w-1.5 rounded-full" style={{ background: GK.green }} />Live</span>
      </div>

      <div className="mt-4 flex items-center gap-5">
        <div className="relative grid shrink-0 place-items-center">
          <svg viewBox="0 0 80 80" className="h-[104px] w-[104px]">
            <circle cx="40" cy="40" r="30" fill="none" stroke="#eef4ee" strokeWidth="11" />
            {SCOPES.map(([n, v, c], i) => {
              const off = -acc; acc += v;
              const on = sel === i, dim = sel !== null && !on;
              return (
                <motion.circle key={n} cx="40" cy="40" r="30" fill="none" stroke={c} pathLength={100}
                  strokeDasharray={`${(v / total) * 100} 100`} transform="rotate(-90 40 40)"
                  className="cursor-pointer" style={{ pointerEvents: "stroke" }} onClick={() => pick(i)}
                  onPointerEnter={() => setSel(i)}
                  initial={{ strokeDashoffset: 100 - off / total * 100 - (v / total) * 100, strokeWidth: 11 }}
                  animate={inView ? { strokeDashoffset: -off / total * 100, strokeWidth: on ? 14 : 11, opacity: dim ? 0.3 : 1 } : {}}
                  transition={{ strokeDashoffset: { duration: 0.9, delay: 0.2 + i * 0.14, ease: [0.16, 1, 0.3, 1] }, strokeWidth: { type: "spring", stiffness: 380, damping: 24 }, opacity: { duration: 0.2 } }} />
              );
            })}
          </svg>
          <div className="pointer-events-none absolute px-2 text-center">
            {sel === null ? (
              <><div className="font-display text-lg font-bold leading-none tabular-nums" style={{ color: GK.ink }}><Count to={total} play={inView} /></div><div className="text-[0.5rem] font-semibold uppercase tracking-wide" style={{ color: GK.muted }}>tCO₂e</div></>
            ) : (
              <motion.div key={sel} initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.18 }}>
                <div className="font-display text-base font-bold leading-none tabular-nums" style={{ color: GK.ink }}>{SCOPES[sel][1].toLocaleString("en-GB")}</div>
                <div className="text-[0.46rem] font-bold" style={{ color: SCOPES[sel][2] === GK.s3 ? GK.greenDk : SCOPES[sel][2] }}>{SCOPES[sel][0]}</div>
                <div className="text-[0.44rem] tabular-nums" style={{ color: GK.muted }}>{Math.round((SCOPES[sel][1] / total) * 100)}% of total</div>
              </motion.div>
            )}
          </div>
        </div>

        <div className="min-w-0 flex-1 space-y-0.5">
          {SCOPES.map(([n, v, c], i) => (
            <button key={n} onClick={() => pick(i)} onPointerEnter={() => setSel(i)} onFocus={() => setSel(i)} aria-pressed={sel === i}
              className="flex w-full items-center justify-between gap-2 rounded-md px-1.5 py-1 text-left text-[0.66rem] transition-colors hover:bg-[#f7faf8] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-1 focus-visible:outline-[#16a34a]"
              style={{ background: sel === i ? "#f1f7f3" : undefined }}>
              <span className="flex min-w-0 items-center gap-1.5" style={{ color: GK.ink, fontWeight: sel === i ? 700 : 400 }}><motion.i className="h-2 w-2 shrink-0 rounded-sm" style={{ background: c }} animate={{ scale: sel === i ? 1.4 : 1 }} />{n}</span>
              <span className="shrink-0 font-semibold tabular-nums" style={{ color: GK.greenDk }}>{v.toLocaleString("en-GB")}</span>
            </button>
          ))}
        </div>
      </div>

      <div className="mt-4 rounded-lg border border-[#eef4ee] p-3" onPointerLeave={() => setSel(null)}>
        <div className="flex items-center justify-between gap-2">
          <span className="truncate text-[0.62rem] font-semibold" style={{ color: GK.ink }}>{sel === null ? "Emissions over time" : `${SCOPES[sel][0]} over time`}</span>
          <span className="shrink-0 rounded bg-[#ecfdf3] px-1.5 py-0.5 text-[0.56rem] font-bold" style={{ color: GK.greenDk }}>↓ {100 - trend[trend.length - 1]}% since 2020</span>
        </div>
        <div className="mt-2 flex h-16 items-end gap-2">
          {trend.map((h, i) => (
            <motion.div key={`${sel}-${i}`} className="flex-1 rounded-t-[3px]" style={{ background: i === trend.length - 1 ? GK.green : "#bfe6cd" }}
              initial={{ height: 0 }} animate={inView ? { height: `${h * 0.52}px` } : {}} transition={{ duration: 0.5, delay: i * 0.04, ease: [0.16, 1, 0.3, 1] }} />
          ))}
        </div>
        <div className="mt-1 flex gap-2">{trend.map((_, i) => <span key={i} className="flex-1 text-center text-[0.48rem]" style={{ color: GK.muted }}>{2020 + i}</span>)}</div>
      </div>

      <div className="mt-3 grid grid-cols-3 gap-2">{[["Data quality", "94%"], ["Scope 3 cats", "15 / 15"], ["Frameworks", "6+"]].map(([l, v]) => <div key={l} className="rounded-lg border border-[#eef4ee] px-2 py-1.5 text-center"><div className="text-[0.5rem] uppercase tracking-wide" style={{ color: GK.muted }}>{l}</div><div className="text-[0.8rem] font-bold" style={{ color: GK.ink }}>{v}</div></div>)}</div>
    </div>
  );
}

/* ============================ Reduction pathway ============================
   Interactive: scrub across the chart (pointer or arrow keys) to read the
   modelled figure for any year.                                            */
const PATH_YEARS = [2024, 2025, 2026, 2027, 2028, 2029, 2030];
const PATH_VALUES = [48010, 45200, 42000, 38400, 34100, 30600, 27800];
const PV_MAX = PATH_VALUES[0], PV_MIN = PATH_VALUES[PATH_VALUES.length - 1];
const px = (i: number) => (i * 400) / (PATH_YEARS.length - 1);
const py = (v: number) => 30 + ((PV_MAX - v) / (PV_MAX - PV_MIN)) * 138;

export function ReductionPathway() {
  const { ref, inView } = useReveal();
  const reduce = useReducedMotion();
  const svgRef = useRef<SVGSVGElement>(null);
  const [idx, setIdx] = useState<number | null>(null);
  const line = PATH_VALUES.map((v, i) => `${i ? "L" : "M"}${px(i)} ${py(v)}`).join(" ");
  const drop = Math.round((1 - PV_MIN / PV_MAX) * 100);

  const scrub = (clientX: number) => {
    const r = svgRef.current?.getBoundingClientRect();
    if (!r) return;
    const t = Math.max(0, Math.min(1, (clientX - r.left) / r.width));
    setIdx(Math.round(t * (PATH_YEARS.length - 1)));
  };
  const onKey = (e: React.KeyboardEvent) => {
    if (e.key !== "ArrowLeft" && e.key !== "ArrowRight") return;
    e.preventDefault();
    setIdx((p) => { const n = (p ?? 0) + (e.key === "ArrowRight" ? 1 : -1); return Math.max(0, Math.min(PATH_YEARS.length - 1, n)); });
  };

  return (
    <div ref={ref} className="overflow-hidden rounded-2xl border border-[#e6ece7] bg-white p-5 shadow-[0_36px_70px_-34px_rgba(16,80,50,0.4)]">
      <div className="flex items-center justify-between gap-2">
        <span className="font-display text-base font-bold" style={{ color: GK.ink }}>Reduction pathway</span>
        <span className="shrink-0 rounded-md bg-[#ecfdf3] px-2 py-0.5 text-[0.6rem] font-bold" style={{ color: GK.greenDk }}>−{drop}% by 2030</span>
      </div>

      <div className="relative mt-3">
        <svg ref={svgRef} viewBox="0 0 400 200" className="h-40 w-full touch-none cursor-ew-resize" role="slider" tabIndex={0}
          aria-label="Reduction pathway by year" aria-valuemin={PATH_YEARS[0]} aria-valuemax={PATH_YEARS[6]} aria-valuenow={PATH_YEARS[idx ?? 0]}
          onPointerMove={(e) => scrub(e.clientX)} onPointerLeave={() => setIdx(null)} onKeyDown={onKey} onBlur={() => setIdx(null)}>
          <defs><linearGradient id="rpFill" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor={GK.green} stopOpacity="0.28" /><stop offset="100%" stopColor={GK.green} stopOpacity="0" /></linearGradient></defs>
          {[40, 90, 140].map((y) => <line key={y} x1="0" y1={y} x2="400" y2={y} stroke="#eef4ee" strokeWidth="1" />)}
          <motion.path d={`${line} L400 190 L0 190 Z`} fill="url(#rpFill)" initial={{ opacity: 0 }} animate={inView ? { opacity: 1 } : {}} transition={{ duration: 0.8, delay: 0.4 }} />
          <motion.path d={line} fill="none" stroke={GK.green} strokeWidth="2.5" strokeLinecap="round" initial={{ pathLength: 0 }} animate={inView ? { pathLength: 1 } : {}} transition={{ duration: 1.1, ease: [0.16, 1, 0.3, 1] }} />
          <motion.circle cx="0" cy={py(PV_MAX)} r="4" fill={GK.greenDk} initial={{ scale: 0 }} animate={inView ? { scale: 1 } : {}} transition={{ delay: 0.3 }} />
          <motion.circle cx="400" cy={py(PV_MIN)} r="4" fill={GK.green} initial={{ scale: 0 }} animate={inView ? { scale: 1 } : {}} transition={{ delay: 1.1 }} />
          {!reduce && idx === null && <circle r="3" fill={GK.green} opacity="0.9"><animateMotion dur="4.2s" repeatCount="indefinite" path={line} /></circle>}
          {idx !== null && (
            <g className="pointer-events-none">
              <line x1={px(idx)} y1="14" x2={px(idx)} y2="190" stroke={GK.greenDk} strokeWidth="1" strokeDasharray="3 3" />
              <circle cx={px(idx)} cy={py(PATH_VALUES[idx])} r="6" fill="#fff" stroke={GK.greenDk} strokeWidth="2.5" />
            </g>
          )}
        </svg>

        {idx !== null && (
          <div className="pointer-events-none absolute -top-1 z-10 -translate-x-1/2 rounded-lg bg-[#0d1411] px-2.5 py-1.5 text-center shadow-xl"
            style={{ left: `${Math.max(11, Math.min(89, (idx / 6) * 100))}%` }}>
            <div className="font-mono text-[0.62rem] font-bold text-white tabular-nums">{PATH_VALUES[idx].toLocaleString("en-GB")}</div>
            <div className="text-[0.48rem] text-white/60">tCO₂e · {PATH_YEARS[idx]}</div>
          </div>
        )}
      </div>

      <div className="flex items-center justify-between text-[0.58rem]" style={{ color: GK.muted }}><span>2024 baseline</span><span>1.5°C-aligned target · 2030</span></div>
      <p className="mt-1.5 text-[0.56rem]" style={{ color: GK.muted }}>Drag across the chart to read any year.</p>
    </div>
  );
}

/* ============================ Three-feature cards ============================ */
const TONES = {
  green: { bg: "#d6f5e1", ink: GK.ink, sub: "#3f5a49" },
  cream: { bg: "#f3f1e9", ink: GK.ink, sub: "#5f6558" },
  dark: { bg: "#0d1411", ink: "#ffffff", sub: "rgba(255,255,255,0.66)" },
} as const;
export function FeatureCard({ tone, title, desc, children }: { tone: keyof typeof TONES; title: string; desc: string; children: React.ReactNode }) {
  const t = TONES[tone];
  return (
    <motion.div className="flex h-full flex-col overflow-hidden rounded-2xl p-6" style={{ background: t.bg }}
      initial={{ opacity: 0, y: 18 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, margin: "0px 0px -12% 0px" }} transition={{ duration: 0.55, ease: [0.16, 1, 0.3, 1] }}>
      <h3 className="font-display text-xl font-bold tracking-tight" style={{ color: t.ink }}>{title}</h3>
      <p className="mt-2 text-sm leading-relaxed" style={{ color: t.sub }}>{desc}</p>
      <div className="mt-5 flex-1">{children}</div>
    </motion.div>
  );
}

export function DataArcs() {
  const { ref, inView } = useReveal();
  const reduce = useReducedMotion();
  const pills = [["Quantitative data", "18%", "6%"], ["Value-chain data", "72%", "6%"], ["Narrative data", "45%", "34%"]];
  return (
    <div ref={ref} className="relative h-40 w-full">
      <svg viewBox="0 0 300 150" className="absolute inset-0 h-full w-full" preserveAspectRatio="none">
        {[[55, 30], [230, 30], [150, 66]].map(([x, y], i) => (
          <motion.path key={i} d={`M${x} ${y} Q${(x + 150) / 2} ${y - 26} 150 118`} fill="none" stroke={GK.green} strokeWidth="1.4" strokeDasharray="3 4" opacity="0.7" animate={reduce ? undefined : { strokeDashoffset: [0, -14] }} transition={{ duration: 1.1, repeat: Infinity, ease: "linear" }} />
        ))}
      </svg>
      {pills.map(([label, left, top], i) => (
        <motion.div key={label} className="absolute flex -translate-x-1/2 items-center gap-1.5 rounded-full bg-white px-2.5 py-1 text-[0.62rem] font-medium shadow" style={{ left, top, color: GK.ink }}
          initial={{ opacity: 0, scale: 0.7 }} animate={inView ? { opacity: 1, scale: 1 } : {}} transition={{ delay: 0.15 + i * 0.12, ease: "backOut" }}>
          <span className="grid h-3.5 w-3.5 place-items-center rounded-full" style={{ background: GK.green }}><svg viewBox="0 0 24 24" className="h-2.5 w-2.5" fill="none" stroke="#fff" strokeWidth="3.4" strokeLinecap="round"><path d="M5 13l4 4L19 7" /></svg></span>{label}
        </motion.div>
      ))}
      <motion.div className="absolute bottom-0 left-1/2 grid h-12 w-12 -translate-x-1/2 place-items-center rounded-full shadow-lg" style={{ background: GK.green }}
        initial={{ opacity: 0, scale: 0 }} animate={inView ? { opacity: 1, scale: 1 } : {}} transition={{ delay: 0.7, ease: "backOut" }}>
        <EsgenMark color="#ffffff" className="h-5 w-6" />
      </motion.div>
    </div>
  );
}

export function FactorTableViz() {
  const rows = [["Electricity (UK grid)", "0.207", "2024"], ["Diesel (mobile)", "2.512", "2024"], ["Air travel (long-haul)", "0.195", "2024"], ["Natural gas", "0.183", "2024"]];
  return (
    <div className="overflow-hidden rounded-lg bg-white/95 shadow-lg">
      <div className="grid grid-cols-[1.6fr_0.7fr_0.6fr] bg-[#eceadf] px-3 py-2 text-[0.54rem] font-semibold uppercase tracking-wide" style={{ color: "#6b6242" }}><span>Emission factor</span><span>Value</span><span>Year</span></div>
      {rows.map(([n, v, y]) => (
        <div key={n} className="grid grid-cols-[1.6fr_0.7fr_0.6fr] items-center border-t border-[#eae7dc] px-3 py-2 text-[0.62rem]"><span style={{ color: GK.ink }}>{n}</span><span className="font-semibold tabular-nums" style={{ color: GK.greenDk }}>{v}</span><span style={{ color: GK.muted }}>{y}</span></div>
      ))}
    </div>
  );
}

export function CoverageMeter() {
  const { ref, inView } = useReveal();
  const reduce = useReducedMotion();
  return (
    <div ref={ref} className="relative overflow-hidden rounded-xl bg-[#141b17] p-3">
      <div aria-hidden className="absolute -bottom-8 right-0 h-28 w-28 rounded-full" style={{ background: "radial-gradient(circle, rgba(22,163,74,0.35), transparent 70%)" }} />
      <div className="relative flex items-center gap-2 rounded-lg bg-black/40 p-2 ring-1 ring-white/10">
        <div className="rounded-md px-2 py-1 text-center"><div className="font-display text-lg font-bold text-white tabular-nums"><Count to={48.0} play={inView} decimals={1} /></div><div className="text-[0.46rem] uppercase tracking-wide text-white/50">k tCO₂e</div></div>
        <div className="relative h-9 flex-1 overflow-hidden rounded-md bg-black/40">
          <div className="absolute inset-0 flex items-center justify-between px-1.5">{Array.from({ length: 22 }).map((_, i) => <span key={i} className="h-4 w-px" style={{ background: i % 3 === 0 ? "rgba(255,255,255,0.35)" : "rgba(255,255,255,0.14)" }} />)}</div>
          <motion.span className="absolute top-1 bottom-1 w-[2px] rounded" style={{ background: GK.green2, boxShadow: `0 0 8px ${GK.green2}` }} animate={reduce ? { left: "52%" } : { left: ["8%", "82%", "30%", "62%", "8%"] }} transition={reduce ? undefined : { duration: 4.2, repeat: Infinity, ease: "easeInOut" }} />
        </div>
      </div>
      <div className="relative mt-2 text-[0.56rem] text-white/60">Live value-chain estimate · illustrative</div>
    </div>
  );
}

/* ============================ Step cards ============================ */
const STONES = {
  dark: { bg: "#0d1411", ink: "#fff", sub: "rgba(255,255,255,0.72)", badge: "#0d1411" },
  greenLt: { bg: "#e9fbef", ink: GK.ink, sub: GK.body, badge: GK.greenDk },
  grey: { bg: "#f2f4f3", ink: GK.ink, sub: GK.body, badge: GK.greenDk },
  green: { bg: "#c9f4d8", ink: GK.ink, sub: "#3f5a49", badge: GK.greenDk },
} as const;
export function StepCard({ tone, n, title, desc, children }: { tone: keyof typeof STONES; n: number; title: string; desc: string; children?: React.ReactNode }) {
  const t = STONES[tone];
  return (
    <motion.div className="flex min-h-[360px] flex-col overflow-hidden rounded-2xl p-6" style={{ background: t.bg }}
      initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, margin: "0px 0px -10% 0px" }} transition={{ duration: 0.5 }}>
      <span className="grid h-11 w-11 place-items-center rounded-full bg-white font-display text-base font-bold shadow" style={{ color: t.badge }}>{n}</span>
      <h3 className="mt-5 font-display text-xl font-bold tracking-tight" style={{ color: t.ink }}>{title}</h3>
      <p className="mt-3 text-sm leading-relaxed" style={{ color: t.sub }}>{desc}</p>
      <div className="mt-auto pt-6">{children}</div>
    </motion.div>
  );
}

export function LaunchViz() {
  const { ref, inView } = useReveal();
  return (
    <div ref={ref} className="relative flex items-center gap-3">
      <div aria-hidden className="absolute -left-6 -top-6 h-28 w-28 rounded-full" style={{ background: "radial-gradient(circle, rgba(22,163,74,0.4), transparent 70%)" }} />
      <motion.div className="relative grid h-16 w-16 place-items-center rounded-full shadow-xl" style={{ background: GK.green }} initial={{ scale: 0 }} animate={inView ? { scale: 1 } : {}} transition={{ ease: "backOut" }}><EsgenMark color="#ffffff" className="h-7 w-9" /></motion.div>
      <motion.span className="relative rounded-full bg-white px-3 py-1.5 text-[0.68rem] font-semibold shadow" style={{ color: GK.greenDk }} initial={{ opacity: 0, x: -8 }} animate={inView ? { opacity: 1, x: 0 } : {}} transition={{ delay: 0.3 }}>Start here ↗</motion.span>
    </div>
  );
}

export function SparklineViz() {
  const { ref, inView } = useReveal();
  const reduce = useReducedMotion();
  const pts = "M0 40 L20 30 L34 44 L50 18 L66 40 L82 12 L98 34 L118 22 L140 40 L160 26 L180 38";
  return (
    <div ref={ref}>
      <svg viewBox="0 0 180 52" className="h-14 w-full"><motion.path d={pts} fill="none" stroke={GK.green} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" initial={{ pathLength: 0 }} animate={inView ? { pathLength: 1 } : {}} transition={{ duration: 1.4, ease: "easeInOut" }} />{!reduce && <circle r="2.8" fill={GK.green}><animateMotion dur="2.8s" repeatCount="indefinite" path={pts} /></circle>}<motion.circle cx="180" cy="38" r="3.5" fill={GK.ink} initial={{ scale: 0 }} animate={inView ? { scale: 1 } : {}} transition={{ delay: 1.3 }} /></svg>
      <div className="mt-1 flex items-end gap-1"><span className="font-display text-2xl font-bold tabular-nums" style={{ color: GK.ink }}><Count to={2.59} play={inView} decimals={2} /></span><span className="pb-1 text-xs font-bold" style={{ color: GK.green }}>tCO₂e</span></div>
    </div>
  );
}

export function TrajectoryViz() {
  const { ref, inView } = useReveal();
  const reduce = useReducedMotion();
  const bars = [58, 62, 70, 40, 30];
  return (
    <div ref={ref} className="rounded-xl bg-white p-3 shadow-lg">
      <div className="flex items-center justify-between"><span className="font-display text-[0.72rem] font-bold" style={{ color: GK.ink }}>Reduction trajectory</span><span className="rounded bg-[#ecfdf3] px-1.5 py-0.5 text-[0.56rem] font-bold" style={{ color: GK.greenDk }}>−50%</span></div>
      <div className="mt-1 flex items-center justify-between text-[0.5rem]" style={{ color: GK.muted }}><span>Actual · 56 tCO₂e</span><span>2030 target · 28 tCO₂e</span></div>
      <div className="relative mt-2 flex h-20 items-end justify-between gap-1.5 overflow-hidden">
        {bars.map((h, i) => <motion.div key={i} className="w-full rounded-t-[3px]" style={{ background: i > 2 ? "repeating-linear-gradient(45deg,#16a34a,#16a34a 3px,#3fbd6a 3px,#3fbd6a 6px)" : GK.green }} initial={{ height: 0 }} animate={inView ? { height: `${h}%` } : {}} transition={{ duration: 0.7, delay: 0.2 + i * 0.08, ease: [0.16, 1, 0.3, 1] }} />)}
        {!reduce && <motion.div className="pointer-events-none absolute inset-y-0 w-1/4" style={{ background: "linear-gradient(90deg,transparent,rgba(255,255,255,0.55),transparent)" }} animate={{ x: ["-130%", "520%"] }} transition={{ duration: 2.8, repeat: Infinity, ease: "easeInOut", delay: 1 }} />}
      </div>
    </div>
  );
}

export function ActionsViz() {
  const { ref, inView } = useReveal();
  const reduce = useReducedMotion();
  const items = [["Switch to a renewable tariff", true], ["Refresh IT hardware policy", false], ["Reduce long-haul travel", false], ["Install efficient lighting", false]];
  return (
    <div ref={ref} className="rounded-xl bg-white p-3 shadow-lg">
      <div className="flex items-baseline gap-2"><span className="font-display text-xl font-bold" style={{ color: GK.ink }}>16</span><span className="text-[0.56rem] font-semibold leading-tight" style={{ color: GK.muted }}>reduction<br />actions</span></div>
      <div className="mt-2 space-y-1.5">{items.map(([l, done], i) => (
        <motion.div key={l as string} className="flex items-center gap-2 text-[0.62rem]" initial={{ opacity: 0, x: -6 }} animate={inView ? { opacity: 1, x: 0 } : {}} transition={{ delay: 0.2 + i * 0.1 }}>
          <motion.span className="grid h-4 w-4 place-items-center rounded-full" style={{ background: done ? GK.green : "transparent", border: done ? "none" : "1.5px solid #cbd5cf" }} animate={done && !reduce ? { boxShadow: [`0 0 0 0 rgba(22,163,74,0.5)`, `0 0 0 5px rgba(22,163,74,0)`] } : undefined} transition={{ duration: 1.8, repeat: Infinity, ease: "easeOut" }}>{done && <svg viewBox="0 0 24 24" className="h-2.5 w-2.5" fill="none" stroke="#fff" strokeWidth="3.4" strokeLinecap="round"><path d="M5 13l4 4L19 7" /></svg>}</motion.span>
          <span style={{ color: done ? GK.muted : GK.ink, textDecoration: done ? "line-through" : "none" }}>{l as string}</span>
        </motion.div>
      ))}</div>
    </div>
  );
}

export function AccountViz() {
  return <div className="flex flex-wrap gap-2">{["CSRD", "SECR", "CDP", "TCFD"].map((f) => <span key={f} className="rounded-md bg-white/12 px-2.5 py-1 text-[0.66rem] font-semibold text-white ring-1 ring-white/15">{f}</span>)}</div>;
}

/* ============================ Green count-up stat ============================ */
export function GreenStat({ value, suffix = "", label }: { value: number; suffix?: string; label: string }) {
  const { ref, inView } = useReveal();
  return (
    <div ref={ref}>
      <div className="font-display text-5xl font-bold leading-none tabular-nums sm:text-6xl" style={{ color: GK.green }}><Count to={value} play={inView} />{suffix}</div>
      <p className="mt-4 text-sm leading-relaxed" style={{ color: GK.body }}>{label}</p>
    </div>
  );
}
