"use client";

import { useState } from "react";
import { motion, useReducedMotion } from "framer-motion";
import { Count, EsgenMark, useReveal } from "@/components/whiteui/kit";
import { GK } from "@/components/platform/CarbonVisuals";

/* Supplier-engagement mockups. All supplier names and figures are illustrative. */

/* ---------------- Hero: supplier engagement dashboard ----------------
   Interactive: filter by engagement status. The donut, the top-emitter
   list, and the stats are all derived from the same supplier list, so
   every figure on the card stays consistent with the filter.            */
type Status = "Responded" | "In progress" | "Not started";
const STATUS: [Status, string][] = [["Responded", GK.s1], ["In progress", GK.s2], ["Not started", GK.s3]];
const SUPPLIERS: { n: string; share: number; s: Status }[] = [
  { n: "Northgate Components", share: 92, s: "Responded" },
  { n: "Skyline Freight", share: 64, s: "In progress" },
  { n: "Vertex Materials", share: 48, s: "Responded" },
  { n: "Orbit Services", share: 30, s: "Not started" },
  { n: "Calder Packaging", share: 58, s: "Responded" },
  { n: "Halden Logistics", share: 41, s: "In progress" },
  { n: "Pinemoor Chemicals", share: 76, s: "Not started" },
  { n: "Westbrook Textiles", share: 22, s: "Responded" },
];

export function SupplierDashboard() {
  const { ref, inView } = useReveal();
  const reduce = useReducedMotion();
  const [filter, setFilter] = useState<Status | null>(null);

  const counts = STATUS.map(([s]) => SUPPLIERS.filter((x) => x.s === s).length);
  const totalN = SUPPLIERS.length;
  const pct = counts.map((c) => Math.round((c / totalN) * 100));
  const engaged = Math.round(((counts[0] + counts[1]) / totalN) * 100);
  const shown = (filter ? SUPPLIERS.filter((x) => x.s === filter) : SUPPLIERS).slice().sort((a, b) => b.share - a.share).slice(0, 4);
  const maxShare = Math.max(...shown.map((x) => x.share), 1);
  let acc = 0;

  return (
    <div ref={ref} className="overflow-hidden rounded-2xl border border-[#e6ece7] bg-white p-5 shadow-[0_36px_70px_-34px_rgba(16,80,50,0.45)]">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2"><EsgenMark color={GK.green} className="h-5 w-7" /><span className="font-display text-base font-bold" style={{ color: GK.ink }}>Supplier engagement</span></div>
        <span className="flex items-center gap-1.5 text-[0.55rem] font-semibold uppercase tracking-wide" style={{ color: GK.muted }}><span className="live-dot h-1.5 w-1.5 rounded-full" style={{ background: GK.green }} />Live</span>
      </div>

      <div className="mt-4 flex items-center gap-5">
        <div className="relative grid shrink-0 place-items-center">
          <svg viewBox="0 0 80 80" className="h-[100px] w-[100px]">
            <circle cx="40" cy="40" r="30" fill="none" stroke="#eef4ee" strokeWidth="11" />
            {STATUS.map(([s, c], i) => {
              const v = pct[i], off = -acc; acc += v;
              const on = filter === s, dim = filter !== null && !on;
              return (
                <motion.circle key={s} cx="40" cy="40" r="30" fill="none" stroke={c} pathLength={100}
                  strokeDasharray={`${v} 100`} transform="rotate(-90 40 40)" className="cursor-pointer" style={{ pointerEvents: "stroke" }}
                  onClick={() => setFilter((p) => (p === s ? null : s))} onPointerEnter={() => setFilter(s)}
                  initial={{ strokeDashoffset: 100 - off - v, strokeWidth: 11 }}
                  animate={inView ? { strokeDashoffset: off, strokeWidth: on ? 14 : 11, opacity: dim ? 0.3 : 1 } : {}}
                  transition={{ strokeDashoffset: { duration: 0.9, delay: 0.2 + i * 0.14 }, strokeWidth: { type: "spring", stiffness: 380, damping: 24 }, opacity: { duration: 0.2 } }} />
              );
            })}
          </svg>
          <div className="pointer-events-none absolute px-1 text-center">
            {filter === null ? (
              <><div className="font-display text-lg font-bold leading-none tabular-nums" style={{ color: GK.ink }}><Count to={engaged} play={inView} suffix="%" /></div><div className="text-[0.46rem] font-semibold uppercase tracking-wide" style={{ color: GK.muted }}>engaged</div></>
            ) : (
              <motion.div key={filter} initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.18 }}>
                <div className="font-display text-lg font-bold leading-none tabular-nums" style={{ color: GK.ink }}>{counts[STATUS.findIndex(([s]) => s === filter)]}</div>
                <div className="text-[0.44rem] font-bold leading-tight" style={{ color: GK.greenDk }}>{filter}</div>
              </motion.div>
            )}
          </div>
        </div>

        <div className="min-w-0 flex-1 space-y-0.5">
          {STATUS.map(([s, c], i) => (
            <button key={s} onClick={() => setFilter((p) => (p === s ? null : s))} onPointerEnter={() => setFilter(s)} onFocus={() => setFilter(s)} aria-pressed={filter === s}
              className="flex w-full items-center justify-between gap-2 rounded-md px-1.5 py-1 text-left text-[0.66rem] transition-colors hover:bg-[#f7faf8] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-1 focus-visible:outline-[#16a34a]"
              style={{ background: filter === s ? "#f1f7f3" : undefined }}>
              <span className="flex min-w-0 items-center gap-1.5" style={{ color: GK.ink, fontWeight: filter === s ? 700 : 400 }}><motion.i className="h-2 w-2 shrink-0 rounded-sm" style={{ background: c }} animate={{ scale: filter === s ? 1.4 : 1 }} />{s}</span>
              <span className="shrink-0 font-semibold tabular-nums" style={{ color: GK.greenDk }}>{pct[i]}%</span>
            </button>
          ))}
        </div>
      </div>

      <div className="mt-4 rounded-lg border border-[#eef4ee] p-3" onPointerLeave={() => setFilter(null)}>
        <div className="flex items-center justify-between gap-2">
          <span className="truncate text-[0.62rem] font-semibold" style={{ color: GK.ink }}>Top emitting suppliers</span>
          <span className="shrink-0 rounded bg-[#ecfdf3] px-1.5 py-0.5 text-[0.56rem] font-bold" style={{ color: GK.greenDk }}>{filter ?? "Scope 3"}</span>
        </div>
        <div className="relative mt-2 space-y-2 overflow-hidden" style={{ minHeight: 4 * 16 }}>
          {shown.map((sup, i) => (
            <motion.div key={sup.n} className="flex items-center gap-2" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.2, delay: i * 0.04 }}>
              <span className="w-28 shrink-0 truncate text-[0.58rem]" style={{ color: GK.ink }}>{sup.n}</span>
              <div className="h-2 flex-1 overflow-hidden rounded-full" style={{ background: "#eef4ee" }}>
                <motion.div className="h-full rounded-full" style={{ background: i === 0 ? GK.green : "#9ad9b2" }} initial={{ width: 0 }} animate={inView ? { width: `${(sup.share / maxShare) * 100}%` } : {}} transition={{ duration: 0.6, delay: 0.1 + i * 0.06 }} />
              </div>
            </motion.div>
          ))}
          {shown.length === 0 && <p className="py-4 text-center text-[0.6rem]" style={{ color: GK.muted }}>No suppliers with this status.</p>}
          {!reduce && <motion.div className="pointer-events-none absolute inset-y-0 w-1/4" style={{ background: "linear-gradient(90deg,transparent,rgba(22,163,74,0.14),transparent)" }} animate={{ x: ["-130%", "520%"] }} transition={{ duration: 3.2, repeat: Infinity, ease: "easeInOut", delay: 1 }} />}
        </div>
      </div>

      <div className="mt-3 grid grid-cols-3 gap-2">
        {([["Suppliers", filter ? String(shown.length ? SUPPLIERS.filter((x) => x.s === filter).length : 0) : String(totalN)], ["Primary data", "62%"], ["Categories", "15 / 15"]] as [string, string][]).map(([l, v]) => (
          <div key={l} className="rounded-lg border border-[#eef4ee] px-2 py-1.5 text-center"><div className="text-[0.5rem] uppercase tracking-wide" style={{ color: GK.muted }}>{l}</div><div className="text-[0.8rem] font-bold tabular-nums" style={{ color: GK.ink }}>{v}</div></div>
        ))}
      </div>
    </div>
  );
}

/* ---------------- Feature: questionnaire task tracker ---------------- */
export function TaskTrackerViz() {
  const { ref, inView } = useReveal();
  const reduce = useReducedMotion();
  const rows: [string, number, string][] = [["Emissions questionnaire", 82, GK.green], ["Energy & fuel data", 58, "#4ade80"], ["Targets & commitments", 34, "#86efac"]];
  return (
    <div ref={ref} className="rounded-xl bg-white p-3 shadow-lg">
      <div className="flex items-center justify-between"><span className="text-[0.66rem] font-bold" style={{ color: GK.ink }}>Data requests</span><span className="text-[0.54rem]" style={{ color: GK.muted }}>248 suppliers</span></div>
      <div className="mt-2.5 space-y-2.5">
        {rows.map(([n, w, c], i) => (
          <div key={n}>
            <div className="flex items-center justify-between text-[0.58rem]"><span style={{ color: GK.ink }}>{n}</span><span className="font-semibold" style={{ color: GK.greenDk }}>{w}%</span></div>
            <div className="relative mt-1 h-2 overflow-hidden rounded-full" style={{ background: "#eef4ee" }}>
              <motion.div className="h-full rounded-full" style={{ background: c }} initial={{ width: 0 }} animate={inView ? { width: `${w}%` } : {}} transition={{ duration: 0.8, delay: 0.2 + i * 0.1 }} />
              {!reduce && <motion.div className="pointer-events-none absolute inset-y-0 w-1/3" style={{ background: "linear-gradient(90deg,transparent,rgba(255,255,255,0.7),transparent)" }} animate={{ x: ["-140%", "420%"] }} transition={{ duration: 2.4, repeat: Infinity, ease: "easeInOut", delay: 0.6 + i * 0.3 }} />}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

/* ---------------- Feature: supplier scorecard ---------------- */
export function ScorecardViz() {
  const rows: [string, string, string, string][] = [
    ["Northgate Components", "High", "B", "2030"],
    ["Skyline Freight", "Medium", "C", "None"],
    ["Vertex Materials", "High", "A", "2035"],
    ["Orbit Services", "Low", "C", "None"],
  ];
  return (
    <div className="overflow-hidden rounded-lg bg-white/95 shadow-lg">
      <div className="grid grid-cols-[1.5fr_0.7fr_0.5fr_0.6fr] bg-[#f4ead6] px-3 py-2 text-[0.5rem] font-semibold uppercase tracking-wide" style={{ color: "#8a6a48" }}><span>Supplier</span><span>Priority</span><span>Score</span><span>Net zero</span></div>
      {rows.map(([n, p, s, z]) => (
        <div key={n} className="grid grid-cols-[1.5fr_0.7fr_0.5fr_0.6fr] items-center border-t border-[#f2ece0] px-3 py-2 text-[0.6rem]">
          <span className="truncate" style={{ color: GK.ink }}>{n}</span>
          <span className="font-medium" style={{ color: p === "High" ? "#c0492f" : p === "Medium" ? "#b7791f" : GK.muted }}>{p}</span>
          <span className="font-bold" style={{ color: s === "A" ? GK.greenDk : s === "B" ? "#a15a1e" : GK.muted }}>{s}</span>
          <span style={{ color: GK.muted }}>{z}</span>
        </div>
      ))}
    </div>
  );
}

/* ---------------- Feature: response meter (dark) ---------------- */
export function ResponseMeter() {
  const { ref, inView } = useReveal();
  const reduce = useReducedMotion();
  return (
    <div ref={ref} className="relative overflow-hidden rounded-xl bg-[#141b17] p-3">
      <div aria-hidden className="absolute -bottom-8 right-0 h-28 w-28 rounded-full" style={{ background: "radial-gradient(circle, rgba(22,163,74,0.35), transparent 70%)" }} />
      <div className="relative flex items-center gap-2 rounded-lg bg-black/40 p-2 ring-1 ring-white/10">
        <div className="rounded-md px-2 py-1 text-center"><div className="font-display text-lg font-bold text-white tabular-nums"><Count to={76} play={inView} suffix="%" /></div><div className="text-[0.44rem] uppercase tracking-wide text-white/50">engaged</div></div>
        <div className="relative h-9 flex-1 overflow-hidden rounded-md bg-black/40">
          <div className="absolute inset-0 flex items-center justify-between px-1.5">{Array.from({ length: 22 }).map((_, i) => <span key={i} className="h-4 w-px" style={{ background: i % 3 === 0 ? "rgba(255,255,255,0.35)" : "rgba(255,255,255,0.14)" }} />)}</div>
          <motion.span className="absolute top-1 bottom-1 w-[2px] rounded" style={{ background: GK.green2, boxShadow: `0 0 8px ${GK.green2}` }} animate={reduce ? { left: "60%" } : { left: ["10%", "78%", "38%", "66%", "10%"] }} transition={reduce ? undefined : { duration: 4.4, repeat: Infinity, ease: "easeInOut" }} />
        </div>
      </div>
      <div className="relative mt-2 text-[0.56rem] text-white/60">Supplier response coverage · illustrative</div>
    </div>
  );
}

/* ---------------- Supplier commitment / report card ---------------- */
export function CommitmentReportViz() {
  const { ref, inView } = useReveal();
  const reduce = useReducedMotion();
  const rows: [string, string][] = [["Scope 1 & 2", "verified"], ["Scope 3 coverage", "62%"], ["Net-zero target", "2035"], ["Evidence", "linked"]];
  return (
    <div ref={ref} className="overflow-hidden rounded-2xl border border-[#e6ece7] bg-white p-5 shadow-[0_36px_70px_-34px_rgba(16,80,50,0.4)]">
      <div className="flex items-center justify-between">
        <span className="font-display text-base font-bold" style={{ color: GK.ink }}>Supplier ESG report</span>
        <span className="rounded-md px-2 py-0.5 text-[0.58rem] font-bold text-white" style={{ background: GK.green }}>Export</span>
      </div>
      <div className="mt-4 flex items-center gap-5">
        <div className="relative grid place-items-center">
          <svg viewBox="0 0 80 80" className="h-[92px] w-[92px]">
            <circle cx="40" cy="40" r="30" fill="none" stroke="#eef4ee" strokeWidth="9" />
            <motion.circle cx="40" cy="40" r="30" fill="none" stroke={GK.green} strokeWidth="9" pathLength={100} strokeDasharray="100" strokeLinecap="round" transform="rotate(-90 40 40)"
              initial={{ strokeDashoffset: 100 }} animate={inView ? { strokeDashoffset: 26 } : {}} transition={{ duration: 1.1, ease: [0.16, 1, 0.3, 1] }} />
          </svg>
          <div className="absolute text-center"><div className="font-display text-lg font-bold tabular-nums leading-none" style={{ color: GK.ink }}><Count to={74} play={inView} /></div><div className="text-[0.46rem] font-semibold uppercase tracking-wide" style={{ color: GK.muted }}>score</div></div>
        </div>
        <div className="min-w-0 flex-1 space-y-1.5">
          {rows.map(([k, v], i) => (
            <motion.div key={k} className="flex items-center justify-between rounded-md border border-[#eef4ee] px-2 py-1.5 text-[0.62rem]" initial={{ opacity: 0, x: -6 }} animate={inView ? { opacity: 1, x: 0 } : {}} transition={{ delay: 0.2 + i * 0.09 }}>
              <span style={{ color: GK.ink }}>{k}</span><span className="font-semibold" style={{ color: GK.greenDk }}>{v}</span>
            </motion.div>
          ))}
        </div>
      </div>
      <div className="relative mt-3 h-1.5 overflow-hidden rounded-full" style={{ background: "#eef4ee" }}>
        <motion.div className="h-full rounded-full" style={{ background: GK.green }} initial={{ width: 0 }} animate={inView ? { width: "74%" } : {}} transition={{ duration: 0.9, delay: 0.4 }} />
        {!reduce && <motion.div className="pointer-events-none absolute inset-y-0 w-1/3" style={{ background: "linear-gradient(90deg,transparent,rgba(255,255,255,0.75),transparent)" }} animate={{ x: ["-140%", "420%"] }} transition={{ duration: 2.6, repeat: Infinity, ease: "easeInOut", delay: 1 }} />}
      </div>
    </div>
  );
}

/* ---------------- Step visuals ---------------- */
export function MapViz() {
  const { ref, inView } = useReveal();
  return (
    <div ref={ref} className="flex flex-wrap gap-1.5">
      {["Manufacturing", "Logistics", "Materials", "Services", "Packaging", "IT"].map((c, i) => (
        <motion.span key={c} className="rounded-md bg-white/12 px-2 py-1 text-[0.6rem] font-semibold text-white ring-1 ring-white/15" initial={{ opacity: 0, scale: 0.8 }} animate={inView ? { opacity: 1, scale: 1 } : {}} transition={{ delay: 0.1 + i * 0.07 }}>{c}</motion.span>
      ))}
    </div>
  );
}

export function InviteViz() {
  const { ref, inView } = useReveal();
  const reduce = useReducedMotion();
  return (
    <div ref={ref} className="relative h-24">
      <svg viewBox="0 0 240 90" className="absolute inset-0 h-full w-full">
        {[[30, 18], [30, 46], [30, 74]].map(([x, y], i) => (
          <motion.path key={i} d={`M${x + 20} ${y} Q120 ${y} 200 46`} fill="none" stroke={GK.green} strokeWidth="1.4" strokeDasharray="3 4" opacity="0.65" animate={reduce ? undefined : { strokeDashoffset: [0, -14] }} transition={{ duration: 1.1, repeat: Infinity, ease: "linear" }} />
        ))}
      </svg>
      {[18, 46, 74].map((top, i) => (
        <motion.span key={top} className="absolute left-0 -translate-y-1/2 rounded-full bg-white px-2 py-0.5 text-[0.56rem] font-semibold shadow" style={{ top, color: GK.ink }} initial={{ opacity: 0, x: -6 }} animate={inView ? { opacity: 1, x: 0 } : {}} transition={{ delay: 0.1 + i * 0.1 }}>Supplier {i + 1}</motion.span>
      ))}
      <motion.div className="absolute right-0 top-1/2 grid h-11 w-11 -translate-y-1/2 place-items-center rounded-full shadow-lg" style={{ background: GK.green }} initial={{ scale: 0 }} animate={inView ? { scale: 1 } : {}} transition={{ delay: 0.5, ease: "backOut" }}><EsgenMark color="#ffffff" className="h-4 w-6" /></motion.div>
    </div>
  );
}

export function MaturityViz() {
  const { ref, inView } = useReveal();
  const reduce = useReducedMotion();
  const bars = [72, 54, 38, 26];
  return (
    <div ref={ref} className="rounded-xl bg-white p-3 shadow-lg">
      <div className="flex items-center justify-between"><span className="text-[0.7rem] font-bold" style={{ color: GK.ink }}>Carbon maturity</span><span className="rounded bg-[#ecfdf3] px-1.5 py-0.5 text-[0.54rem] font-bold" style={{ color: GK.greenDk }}>scored</span></div>
      <div className="relative mt-3 flex h-20 items-end justify-between gap-2 overflow-hidden">
        {bars.map((h, i) => <motion.div key={i} className="w-full rounded-t-[3px]" style={{ background: i === 0 ? GK.green : "#9ad9b2" }} initial={{ height: 0 }} animate={inView ? { height: `${h}%` } : {}} transition={{ duration: 0.7, delay: 0.2 + i * 0.08 }} />)}
        {!reduce && <motion.div className="pointer-events-none absolute inset-y-0 w-1/4" style={{ background: "linear-gradient(90deg,transparent,rgba(255,255,255,0.6),transparent)" }} animate={{ x: ["-130%", "480%"] }} transition={{ duration: 2.9, repeat: Infinity, ease: "easeInOut", delay: 0.9 }} />}
      </div>
    </div>
  );
}

export function SharedTargetViz() {
  const { ref, inView } = useReveal();
  const reduce = useReducedMotion();
  const line = "M0 20 L40 30 L80 42 L120 58 L160 70 L200 82";
  return (
    <div ref={ref} className="rounded-xl bg-white p-3 shadow-lg">
      <div className="flex items-center justify-between"><span className="text-[0.7rem] font-bold" style={{ color: GK.ink }}>Shared trajectory</span><span className="rounded bg-[#ecfdf3] px-1.5 py-0.5 text-[0.54rem] font-bold" style={{ color: GK.greenDk }}>−38%</span></div>
      <svg viewBox="0 0 200 92" className="mt-2 h-16 w-full">
        <motion.path d={line} fill="none" stroke={GK.green} strokeWidth="2.4" strokeLinecap="round" initial={{ pathLength: 0 }} animate={inView ? { pathLength: 1 } : {}} transition={{ duration: 1.1 }} />
        {!reduce && <circle r="3" fill={GK.green}><animateMotion dur="3.4s" repeatCount="indefinite" path={line} /></circle>}
      </svg>
      <div className="flex justify-between text-[0.5rem]" style={{ color: GK.muted }}><span>Baseline</span><span>2030</span></div>
    </div>
  );
}
