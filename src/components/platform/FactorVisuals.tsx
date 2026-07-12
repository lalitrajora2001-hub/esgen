"use client";

import { useMemo, useRef, useState } from "react";
import { motion, useAnimationFrame, useMotionValue, useReducedMotion } from "framer-motion";
import { useReveal } from "@/components/whiteui/kit";
import { GK } from "@/components/platform/CarbonVisuals";

const INK = "#0f1720";
const MUTED = "#6b7280";
const ACCENT = "#0b3d2c";
const TINT = "#eaf6ef";
const ROW_H = 46;

/* ============================================================
   1. FACTOR CONSOLE, a working search surface.
   Type in the box, filter by sector, click a row to inspect
   its provenance. Nothing is faked.
   ============================================================ */
type Row = { n: string; s: string; v: string; u: string; source: string; method: string; scope: string };
const ROWS: Row[] = [
  { n: "Electricity, UK grid", s: "Energy", v: "0.207", u: "kgCO₂e/kWh", source: "Government dataset", method: "Location-based", scope: "Scope 2" },
  { n: "Natural gas, combustion", s: "Energy", v: "0.183", u: "kgCO₂e/kWh", source: "Government dataset", method: "Direct combustion", scope: "Scope 1" },
  { n: "Diesel, mobile", s: "Transport", v: "2.512", u: "kgCO₂e/litre", source: "Government dataset", method: "Direct combustion", scope: "Scope 1" },
  { n: "Rail freight", s: "Transport", v: "0.028", u: "kgCO₂e/t·km", source: "Industry database", method: "Activity-based", scope: "Scope 3" },
  { n: "Air travel, long haul", s: "Travel", v: "0.195", u: "kgCO₂e/km", source: "Government dataset", method: "Activity-based", scope: "Scope 3" },
  { n: "Aluminium, recycled", s: "Materials", v: "1.640", u: "kgCO₂e/kg", source: "Industry database", method: "Cradle-to-gate", scope: "Scope 3" },
  { n: "Steel, primary", s: "Materials", v: "2.290", u: "kgCO₂e/kg", source: "Industry database", method: "Cradle-to-gate", scope: "Scope 3" },
  { n: "Landfill, mixed waste", s: "Waste", v: "0.446", u: "kgCO₂e/kg", source: "Government dataset", method: "Activity-based", scope: "Scope 3" },
];
const SECTORS = ["All sectors", "Energy", "Transport", "Materials", "Travel", "Waste"];

export function FactorConsole() {
  const { ref, inView } = useReveal();
  const reduce = useReducedMotion();
  const [q, setQ] = useState("");
  const [sector, setSector] = useState("All sectors");
  const [selName, setSelName] = useState(ROWS[0].n);
  const [paused, setPaused] = useState(false);

  const filtered = useMemo(
    () => ROWS.filter((r) => (sector === "All sectors" || r.s === sector) && r.n.toLowerCase().includes(q.trim().toLowerCase())),
    [q, sector],
  );
  const sel = filtered.find((r) => r.n === selName) ?? filtered[0] ?? null;
  const scanning = !reduce && !paused && filtered.length > 1;

  return (
    <motion.div ref={ref} initial={{ opacity: 0, y: 26 }} animate={inView ? { opacity: 1, y: 0 } : {}} transition={{ duration: 0.7, ease: "easeOut" }}
      className="overflow-hidden rounded-2xl border border-[#e4e8e6] bg-white shadow-[0_50px_100px_-40px_rgba(15,23,32,0.35)]">

      {/* top bar */}
      <div className="flex flex-wrap items-center gap-3 border-b border-[#eef1ef] px-4 py-3">
        <div className="flex min-w-0 flex-1 items-center gap-2 rounded-lg border border-[#e2e8e4] bg-[#fafbfa] px-3 py-2 focus-within:border-[#16a34a] focus-within:ring-2 focus-within:ring-[#16a34a]/15">
          <svg viewBox="0 0 24 24" className="h-3.5 w-3.5 shrink-0" fill="none" stroke={MUTED} strokeWidth="2"><circle cx="11" cy="11" r="7" /><path d="M21 21l-4.3-4.3" /></svg>
          <input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Search an emission factor…" aria-label="Search an emission factor"
            className="min-w-0 flex-1 bg-transparent text-[0.78rem] outline-none placeholder:text-[#9aa5a0]" style={{ color: INK }} />
          {q && <button onClick={() => setQ("")} aria-label="Clear search" className="shrink-0 rounded p-0.5 text-[0.7rem] hover:bg-[#eef1ef]" style={{ color: MUTED }}>✕</button>}
        </div>
        <div className="flex items-center gap-1.5 rounded-full bg-[#f1f7f3] px-2.5 py-1.5">
          {!reduce && <motion.span className="h-1.5 w-1.5 rounded-full" style={{ background: GK.green }} animate={{ opacity: [1, 0.25, 1] }} transition={{ duration: 1.7, repeat: Infinity }} />}
          <span className="text-[0.62rem] font-bold tabular-nums" style={{ color: GK.greenDk }}>{filtered.length} {filtered.length === 1 ? "factor" : "factors"}</span>
        </div>
      </div>

      <div className="grid lg:grid-cols-[168px_minmax(0,1fr)_248px]">
        {/* sector rail */}
        <aside className="border-b border-[#eef1ef] p-3 lg:border-b-0 lg:border-r">
          <p className="px-2 pb-2 text-[0.58rem] font-bold uppercase tracking-[0.12em]" style={{ color: MUTED }}>Sectors</p>
          <div className="flex flex-wrap gap-1 lg:block">
            {SECTORS.map((s) => {
              const on = s === sector;
              const count = s === "All sectors" ? ROWS.length : ROWS.filter((r) => r.s === s).length;
              return (
                <button key={s} onClick={() => setSector(s)} aria-pressed={on}
                  className="mb-0.5 flex w-auto items-center justify-between gap-2 rounded-lg px-2 py-1.5 text-left text-[0.75rem] transition-colors hover:bg-[#f1f7f3] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-1 focus-visible:outline-[#16a34a] lg:w-full"
                  style={{ background: on ? "#f1f7f3" : "transparent", color: on ? GK.greenDk : INK, fontWeight: on ? 700 : 400 }}>
                  {s}<span className="text-[0.58rem] tabular-nums" style={{ color: on ? GK.greenDk : "#aab3ae" }}>{count}</span>
                </button>
              );
            })}
          </div>
        </aside>

        {/* table */}
        <div className="min-w-0 border-[#eef1ef] lg:border-r" onPointerEnter={() => setPaused(true)} onPointerLeave={() => setPaused(false)}>
          <div className="grid grid-cols-[minmax(0,1.7fr)_0.7fr_0.9fr] items-center gap-3 border-b border-[#eef1ef] bg-[#fafbfa] px-4 py-2 text-[0.56rem] font-bold uppercase tracking-[0.1em] sm:grid-cols-[minmax(0,1.7fr)_0.8fr_0.7fr_0.9fr]" style={{ color: MUTED }}>
            <span>Emission factor</span><span className="hidden sm:block">Sector</span><span>Value</span><span>Unit</span>
          </div>

          <div className="relative" style={{ minHeight: ROW_H * 3 }}>
            {scanning && (
              <motion.div aria-hidden className="pointer-events-none absolute inset-x-0 z-0 h-[46px]" style={{ background: "linear-gradient(90deg, rgba(22,163,74,0.09), transparent)" }}
                animate={{ top: [0, ROW_H * (filtered.length - 1), 0] }} transition={{ duration: 2 + filtered.length * 1.1, repeat: Infinity, ease: "easeInOut" }} />
            )}
            {filtered.map((r) => {
              const on = sel?.n === r.n;
              return (
                <button key={r.n} onClick={() => setSelName(r.n)} aria-pressed={on}
                  className="relative z-10 grid h-[46px] w-full grid-cols-[minmax(0,1.7fr)_0.7fr_0.9fr] items-center gap-3 border-b border-[#f4f6f5] px-4 text-left text-[0.74rem] transition-colors hover:bg-[#f7faf8] focus-visible:outline focus-visible:-outline-offset-2 focus-visible:outline-[#16a34a] sm:grid-cols-[minmax(0,1.7fr)_0.8fr_0.7fr_0.9fr]"
                  style={on ? { background: "#f1f7f3", boxShadow: `inset 3px 0 0 ${GK.greenDk}` } : undefined}>
                  <span className="truncate" style={{ color: INK, fontWeight: on ? 700 : 400 }}>{r.n}</span>
                  <span className="hidden sm:block"><span className="rounded bg-[#f1f5f2] px-1.5 py-0.5 text-[0.6rem]" style={{ color: MUTED }}>{r.s}</span></span>
                  <span className="font-mono font-bold tabular-nums" style={{ color: on ? GK.greenDk : INK }}>{r.v}</span>
                  <span className="truncate text-[0.62rem]" style={{ color: MUTED }}>{r.u}</span>
                </button>
              );
            })}
            {filtered.length === 0 && (
              <div className="grid place-items-center px-4 py-12 text-center">
                <p className="text-[0.8rem] font-semibold" style={{ color: INK }}>No factors match “{q}”</p>
                <p className="mt-1 text-[0.72rem]" style={{ color: MUTED }}>Try another term, or reset the sector filter.</p>
                <button onClick={() => { setQ(""); setSector("All sectors"); }} className="mt-3 rounded-lg px-3 py-1.5 text-[0.7rem] font-bold text-white" style={{ background: GK.greenDk }}>Reset filters</button>
              </div>
            )}
          </div>
        </div>

        {/* provenance */}
        <aside className="border-t border-[#eef1ef] p-4 lg:border-t-0">
          <p className="text-[0.58rem] font-bold uppercase tracking-[0.12em]" style={{ color: MUTED }}>Provenance</p>
          <div>
            {sel ? (
              <motion.div key={sel.n} initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.22 }}>
                <p className="mt-2 text-[0.82rem] font-bold leading-tight" style={{ color: INK }}>{sel.n}</p>
                <div className="mt-1 flex flex-wrap items-end gap-x-1">
                  <span className="font-display text-2xl font-bold tabular-nums" style={{ color: INK }}>{sel.v}</span>
                  <span className="pb-1 text-[0.56rem] font-bold" style={{ color: GK.greenDk }}>{sel.u}</span>
                </div>
                <dl className="mt-3 space-y-1.5">
                  {([["Source", sel.source], ["Method", sel.method], ["Sector", sel.s], ["Vintage", "2024"], ["Scope", sel.scope]] as [string, string][]).map(([k, v]) => (
                    <div key={k} className="flex items-baseline justify-between gap-3 border-t border-[#f4f6f5] pt-1.5 text-[0.68rem]">
                      <dt className="shrink-0" style={{ color: MUTED }}>{k}</dt>
                      <dd className="min-w-0 truncate text-right font-semibold" style={{ color: INK }}>{v}</dd>
                    </div>
                  ))}
                </dl>
                <div className="mt-3 flex items-center gap-1.5 rounded-lg px-2.5 py-2" style={{ background: TINT }}>
                  <svg viewBox="0 0 24 24" className="h-3.5 w-3.5 shrink-0" fill="none" stroke={ACCENT} strokeWidth="2" strokeLinecap="round"><path d="M9 12l2 2 4-4" /><circle cx="12" cy="12" r="9" /></svg>
                  <span className="text-[0.62rem] font-semibold" style={{ color: ACCENT }}>Fully traceable</span>
                </div>
              </motion.div>
            ) : (
              <p className="mt-3 text-[0.72rem]" style={{ color: MUTED }}>Select a factor to inspect its source and method.</p>
            )}
          </div>
        </aside>
      </div>
    </motion.div>
  );
}

/* ============================================================
   2. PRECISION LADDER, pick a factor type; the axis marker
   slides to it and the card takes the dark treatment.
   ============================================================ */
const LADDER: { n: string; t: string; d: string; q: number }[] = [
  { n: "01", t: "Monetary", d: "Convert spend into emissions when activity data is not yet available, so you can start from what you already have.", q: 1 },
  { n: "02", t: "Activity-based", d: "Turn physical activity, such as kWh or litres of fuel, into emissions with far greater precision than spend alone.", q: 2 },
  { n: "03", t: "Supplier-specific", d: "Use primary data from your own suppliers, so value-chain figures reflect your actual supply chain, not an average.", q: 3 },
  { n: "04", t: "Product-level LCA", d: "Draw on life-cycle assessments to model an individual product's footprint across its full life cycle.", q: 4 },
];
export function PrecisionLadder() {
  const { ref, inView } = useReveal();
  const reduce = useReducedMotion();
  const [active, setActive] = useState(3);

  return (
    <div ref={ref}>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4 lg:items-end">
        {LADDER.map((s, i) => {
          const on = i === active;
          return (
            <motion.button key={s.t} onClick={() => setActive(i)} onMouseEnter={() => setActive(i)} onFocus={() => setActive(i)} aria-pressed={on}
              className="group relative flex flex-col justify-end overflow-hidden rounded-2xl border p-5 text-left transition-shadow focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#16a34a]"
              style={{ minHeight: `${190 + i * 34}px`, borderColor: on ? "transparent" : "#e6ece7", background: on ? "#0d1411" : "#ffffff", boxShadow: on ? "0 30px 60px -30px rgba(13,20,17,0.55)" : "none" }}
              initial={{ opacity: 0, y: 22 }} animate={inView ? { opacity: 1, y: 0 } : {}} transition={{ duration: 0.5, delay: i * 0.1 }}
              whileHover={reduce ? undefined : { y: -4 }}>
              <span className="font-mono text-[0.7rem] font-bold" style={{ color: on ? "rgba(255,255,255,0.45)" : MUTED }}>{s.n}</span>
              <h3 className="mt-auto font-display text-lg font-bold leading-tight" style={{ color: on ? "#fff" : INK }}>{s.t}</h3>
              <p className="mt-2 text-[0.8rem] leading-relaxed" style={{ color: on ? "rgba(255,255,255,0.68)" : MUTED }}>{s.d}</p>
              <div className="mt-4 flex gap-1" aria-label={`Precision ${s.q} of 4`}>
                {[1, 2, 3, 4].map((b) => (
                  <motion.span key={b} className="h-1 flex-1 rounded-full"
                    style={{ background: b <= s.q ? (on ? "#4ade80" : GK.greenDk) : on ? "rgba(255,255,255,0.15)" : "#e6ece7" }}
                    initial={{ scaleX: 0, originX: 0 }} animate={inView ? { scaleX: 1 } : {}} transition={{ delay: 0.3 + i * 0.1 + b * 0.05 }} />
                ))}
              </div>
              {!reduce && on && <motion.div aria-hidden className="pointer-events-none absolute inset-y-0 w-1/3" style={{ background: "linear-gradient(90deg,transparent,rgba(74,222,128,0.10),transparent)" }} animate={{ x: ["-120%", "420%"] }} transition={{ duration: 4.5, repeat: Infinity, ease: "easeInOut" }} />}
            </motion.button>
          );
        })}
      </div>
      <div className="mt-5 flex items-center gap-3">
        <span className="shrink-0 text-[0.68rem] font-semibold" style={{ color: MUTED }}>Lower effort</span>
        <div className="relative h-px flex-1 bg-[#e6ece7]">
          <motion.span className="absolute -top-[4px] h-[9px] w-[9px] rounded-full shadow-[0_0_0_4px_rgba(22,163,74,0.15)]" style={{ background: GK.green }}
            animate={{ left: `${(active / (LADDER.length - 1)) * 100}%` }} transition={{ type: "spring", stiffness: 260, damping: 26 }} />
        </div>
        <span className="shrink-0 text-[0.68rem] font-semibold" style={{ color: INK }}>Higher precision</span>
      </div>
    </div>
  );
}

/* ============================================================
   3. PROVENANCE TRAIL, click a step to walk the audit trail.
   ============================================================ */
const TRAIL: [string, string, string][] = [
  ["Activity data", "482,610 kWh recorded", "Meter readings imported for the reporting year."],
  ["Factor matched", "UK grid · 2024 · 0.207", "The location-based grid factor for the correct year."],
  ["Calculation", "482,610 × 0.207", "Activity multiplied by the matched factor."],
  ["Reported figure", "99.9 tCO₂e · Scope 2", "The disclosed figure, with its full lineage attached."],
];
export function ProvenanceTrail() {
  const { ref, inView } = useReveal();
  const [active, setActive] = useState(3);

  return (
    <div ref={ref}>
      <div className="relative">
        <div aria-hidden className="absolute left-4 right-4 top-[15px] hidden h-0.5 bg-[#dce4df] lg:block">
          <motion.div className="h-full origin-left rounded-full" style={{ background: GK.green }}
            animate={{ scaleX: active / (TRAIL.length - 1) }} transition={{ type: "spring", stiffness: 200, damping: 28 }} />
        </div>
        <ol className="grid gap-8 lg:grid-cols-4 lg:gap-6">
          {TRAIL.map(([t, d, note], i) => {
            const done = i <= active;
            return (
              <motion.li key={t} initial={{ opacity: 0, y: 16 }} animate={inView ? { opacity: 1, y: 0 } : {}} transition={{ delay: i * 0.11, duration: 0.5 }}>
                <button onClick={() => setActive(i)} onMouseEnter={() => setActive(i)} onFocus={() => setActive(i)} aria-pressed={i === active}
                  className="group w-full text-left focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#16a34a]">
                  <motion.span className="relative z-10 grid h-8 w-8 place-items-center rounded-full border-2 border-white font-mono text-[0.68rem] font-bold shadow-md transition-colors"
                    style={{ background: done ? "#0d1411" : "#e6ece7", color: done ? "#fff" : MUTED }}
                    animate={{ scale: i === active ? 1.12 : 1 }} transition={{ type: "spring", stiffness: 380, damping: 22 }}>{i + 1}</motion.span>
                  <h3 className="mt-4 font-display text-base font-bold" style={{ color: done ? INK : MUTED }}>{t}</h3>
                  <p className="mt-1.5 break-words font-mono text-[0.74rem]" style={{ color: done ? GK.greenDk : "#aab3ae" }}>{d}</p>
                  <motion.p className="pt-2 text-[0.76rem] leading-relaxed" style={{ color: MUTED }}
                    animate={{ opacity: i === active ? 1 : 0 }} transition={{ duration: 0.22 }} aria-hidden={i !== active}>{note}</motion.p>
                </button>
              </motion.li>
            );
          })}
        </ol>
      </div>
    </div>
  );
}

/* ============================================================
   4. CUSTOM FACTORS, without / with
   ============================================================ */
export function CustomFactorCompare() {
  const { ref, inView } = useReveal();
  const rows: [string, string][] = [["Recycled granite", "India"], ["Granite via sea transport", "Spain"], ["Quarried granite", "Portugal"]];
  return (
    <div ref={ref} className="grid gap-10 sm:grid-cols-2">
      <div className="flex flex-col items-center text-center">
        <div className="flex items-center gap-1.5 text-[0.82rem] font-semibold" style={{ color: MUTED }}>
          <svg viewBox="0 0 24 24" className="h-3.5 w-3.5" fill="none" stroke={MUTED} strokeWidth="2.4" strokeLinecap="round"><circle cx="12" cy="12" r="9" /><path d="M9 9l6 6M15 9l-6 6" /></svg>
          Without ESGen
        </div>
        <motion.div className="mt-8 rounded-lg bg-[#16211b] px-5 py-2.5 text-sm font-semibold text-white shadow-lg"
          initial={{ opacity: 0, scale: 0.9 }} animate={inView ? { opacity: 1, scale: 1 } : {}} transition={{ delay: 0.15 }}>Granite</motion.div>
        <p className="mt-8 max-w-[16rem] border-t border-[#e6ece7] pt-5 text-sm" style={{ color: MUTED }}>Only one generic emission factor available</p>
        <p className="mt-auto pt-6 text-sm font-semibold" style={{ color: "#c0492f" }}>Average, unactionable GHG report</p>
      </div>

      <div className="flex flex-col items-center text-center">
        <div className="flex items-center gap-1.5 text-[0.82rem] font-semibold" style={{ color: INK }}>
          <svg viewBox="0 0 24 24" className="h-3.5 w-3.5" fill="none"><circle cx="12" cy="12" r="10" fill={GK.greenDk} /><path d="M7.5 12.5l3 3 6-6.5" stroke="#fff" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" /></svg>
          With ESGen
        </div>
        <motion.div className="mt-6 w-full max-w-[19rem] overflow-hidden rounded-xl bg-[#16211b] text-left shadow-2xl"
          initial={{ opacity: 0, y: 14 }} animate={inView ? { opacity: 1, y: 0 } : {}} transition={{ duration: 0.5, delay: 0.2 }}>
          <div className="grid grid-cols-2 gap-2 px-3 py-2 text-[0.5rem] font-semibold uppercase text-white/45"><span>Type</span><span>Country</span></div>
          {rows.map(([t, c], i) => (
            <motion.div key={t} className="grid grid-cols-2 gap-2 border-t border-white/10 px-3 py-2 text-[0.62rem] text-white/90"
              initial={{ opacity: 0 }} animate={inView ? { opacity: 1 } : {}} transition={{ delay: 0.4 + i * 0.12 }}><span>{t}</span><span className="text-white/60">{c}</span></motion.div>
          ))}
        </motion.div>
        <p className="mt-6 max-w-[18rem] border-t border-[#e6ece7] pt-5 text-sm" style={{ color: MUTED }}>Product-level factors by source and production route</p>
        <p className="mt-auto pt-6 text-sm font-semibold" style={{ color: GK.greenDk }}>Robust GHG report for climate action</p>
      </div>
    </div>
  );
}

/* ============================================================
   5. NETWORK LOOP, drag the globe to spin it. Hover a step to
   light it up. No radial text, so nothing can collide.
   ============================================================ */
const LOOP = ["More organisations measuring", "More activity and supplier data", "Tighter, better-evidenced factors", "Sharper decarbonisation decisions", "A stronger case for customers"];
const R = 90, CX = 160, CY = 160;
const ORBIT = "M20 160 A140 52 0 1 0 300 160 A140 52 0 1 0 20 160";

export function NetworkLoop() {
  const { ref, inView } = useReveal();
  const reduce = useReducedMotion();
  const [active, setActive] = useState<number | null>(null);
  const [dragging, setDragging] = useState(false);
  const spin = useMotionValue(0);
  const last = useRef<number | null>(null);

  useAnimationFrame((_, delta) => {
    if (reduce || dragging) return;
    spin.set(spin.get() + delta * 0.0036); // ~100s per revolution
  });

  const onDown = (e: React.PointerEvent) => { setDragging(true); last.current = e.clientX; (e.target as Element).setPointerCapture?.(e.pointerId); };
  const onMove = (e: React.PointerEvent) => {
    if (!dragging || last.current === null) return;
    spin.set(spin.get() + (e.clientX - last.current) * 0.35);
    last.current = e.clientX;
  };
  const onUp = () => { setDragging(false); last.current = null; };

  const lats = [-60, -32, 0, 32, 60];
  const longs = [90, 66, 38, 10];

  return (
    <div ref={ref} className="grid items-center gap-10 overflow-hidden rounded-3xl bg-[#0d1411] p-8 sm:p-12 lg:grid-cols-[1fr_1fr]">
      <div className="mx-auto w-full max-w-[380px]">
        <svg viewBox="0 0 320 320" className="h-full w-full touch-none select-none" style={{ cursor: dragging ? "grabbing" : "grab" }}
          onPointerDown={onDown} onPointerMove={onMove} onPointerUp={onUp} onPointerLeave={onUp} role="img" aria-label="Interactive globe: drag to rotate">
          <defs>
            <radialGradient id="sphere" cx="0.36" cy="0.32" r="0.85">
              <stop offset="0%" stopColor="#1d3a2a" /><stop offset="70%" stopColor="#132218" /><stop offset="100%" stopColor="#0d1411" />
            </radialGradient>
          </defs>

          <motion.g style={{ transformBox: "fill-box", transformOrigin: "center" }} animate={reduce ? undefined : { rotate: 360 }} transition={{ duration: 44, repeat: Infinity, ease: "linear" }}>
            <ellipse cx={CX} cy={CY} rx="140" ry="52" fill="none" stroke={GK.green} strokeOpacity="0.35" strokeWidth="1" />
          </motion.g>
          <motion.g style={{ transformBox: "fill-box", transformOrigin: "center" }} animate={reduce ? undefined : { rotate: -360 }} transition={{ duration: 62, repeat: Infinity, ease: "linear" }}>
            <ellipse cx={CX} cy={CY} rx="52" ry="140" fill="none" stroke="#ffffff" strokeOpacity="0.22" strokeWidth="1" />
          </motion.g>

          <circle cx={CX} cy={CY} r={R} fill="url(#sphere)" />
          <motion.g style={{ rotate: spin, transformBox: "fill-box", transformOrigin: "center" }}>
            {lats.map((o) => <ellipse key={o} cx={CX} cy={CY + o} rx={Math.sqrt(Math.max(1, R * R - o * o))} ry="7" fill="none" stroke="#ffffff" strokeOpacity="0.16" strokeWidth="0.8" />)}
            {longs.map((rx) => <ellipse key={rx} cx={CX} cy={CY} rx={rx} ry={R} fill="none" stroke="#ffffff" strokeOpacity="0.16" strokeWidth="0.8" />)}
          </motion.g>
          <motion.circle cx={CX} cy={CY} r={R} fill="none" stroke={GK.green} strokeWidth="1.2"
            animate={{ strokeOpacity: active !== null || dragging ? 0.95 : 0.5 }} transition={{ duration: 0.3 }} />

          {!reduce && <>
            <circle r="4" fill={GK.green}><animateMotion dur="7s" repeatCount="indefinite" path={ORBIT} /></circle>
            <circle r="2.6" fill="#8fe3b0"><animateMotion dur="7s" begin="3.5s" repeatCount="indefinite" path={ORBIT} /></circle>
          </>}
        </svg>
        <p className="mt-3 text-center text-[0.66rem] font-medium text-white/35">Drag the globe to spin it</p>
      </div>

      <ol className="relative" onMouseLeave={() => setActive(null)}>
        <div aria-hidden className="absolute bottom-16 left-[15px] top-4 w-px bg-white/12" />
        {LOOP.map((t, i) => {
          const on = i === active;
          return (
            <motion.li key={t} initial={{ opacity: 0, x: 14 }} animate={inView ? { opacity: 1, x: 0 } : {}} transition={{ delay: 0.2 + i * 0.11, duration: 0.5 }}>
              <button onMouseEnter={() => setActive(i)} onFocus={() => setActive(i)} onBlur={() => setActive(null)}
                className="flex w-full items-center gap-4 rounded-xl px-2 py-3 text-left transition-colors hover:bg-white/[0.04] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#16a34a]">
                <motion.span className="relative z-10 grid h-8 w-8 shrink-0 place-items-center rounded-full border font-mono text-[0.66rem] font-bold"
                  animate={{ background: on ? GK.green : "#16211b", color: on ? "#0d1411" : "#fff", borderColor: on ? GK.green : "rgba(255,255,255,0.15)", scale: on ? 1.1 : 1 }}
                  transition={{ type: "spring", stiffness: 380, damping: 22 }}>{i + 1}</motion.span>
                <motion.span className="text-[0.92rem] font-medium" animate={{ color: on ? "#ffffff" : "rgba(255,255,255,0.72)" }}>{t}</motion.span>
              </button>
            </motion.li>
          );
        })}
        <motion.li className="mt-2 flex items-center gap-4 px-2" initial={{ opacity: 0 }} animate={inView ? { opacity: 1 } : {}} transition={{ delay: 0.85 }}>
          <span className="relative z-10 grid h-8 w-8 shrink-0 place-items-center rounded-full" style={{ background: GK.green }}>
            <motion.svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="#0d1411" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round"
              style={{ originX: "50%", originY: "50%" }} animate={reduce ? undefined : { rotate: 360 }} transition={{ duration: 9, repeat: Infinity, ease: "linear" }}>
              <path d="M21 12a9 9 0 1 1-3-6.7" /><path d="M21 3v5h-5" />
            </motion.svg>
          </span>
          <span className="text-[0.78rem] font-semibold uppercase tracking-[0.12em]" style={{ color: GK.green }}>and the cycle repeats</span>
        </motion.li>
      </ol>
    </div>
  );
}
