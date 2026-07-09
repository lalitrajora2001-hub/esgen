"use client";

import { useState } from "react";
import { motion, useReducedMotion } from "framer-motion";
import { Count, EsgenMark, useReveal } from "@/components/whiteui/kit";
import { GK } from "@/components/platform/CarbonVisuals";

const INK = "#0f1720";
const MUTED = "#6b7280";
const ACCENT = "#0b3d2c";
const TINT = "#eaf6ef";

/* ---------- Hero: radial impact donut ---------- */
const DONUT: [string, number, string][] = [
  ["Raw materials", 9.9, "#15803d"],
  ["Manufacturing", 5.2, "#22a559"],
  ["Use phase", 3.0, "#56c47f"],
  ["Distribution", 2.1, "#8ed7a8"],
  ["End of life", 0.834, "#cbead6"],
];
export function LcaHeroCard() {
  const { ref, inView } = useReveal();
  const reduce = useReducedMotion();
  const [active, setActive] = useState<number | null>(null);
  const total = DONUT.reduce((s, [, v]) => s + v, 0);
  const R = 52, C = 2 * Math.PI * R;
  let acc = 0;

  return (
    <div ref={ref} className="mx-auto w-full max-w-[19rem] rounded-2xl bg-white p-5 shadow-2xl">
      <div className="flex items-center gap-2">
        <EsgenMark color={INK} className="h-4 w-6" />
        <span className="font-display text-sm font-bold" style={{ color: INK }}>Product LCA</span>
        <span className="ml-auto rounded px-1.5 py-0.5 text-[0.5rem] font-bold" style={{ background: TINT, color: ACCENT }}>ISO 14040/44</span>
      </div>

      <div className="relative mx-auto mt-4 h-[150px] w-[150px]">
        <svg viewBox="0 0 130 130" className="absolute inset-0 h-full w-full -rotate-90">
          <circle cx="65" cy="65" r={R} fill="none" stroke="#f1f4f2" strokeWidth="15" />
          {DONUT.map(([n, v, c], i) => {
            const frac = v / total;
            const off = -C * acc;
            const on = active === i;
            const dim = active !== null && !on;
            const seg = (
              <motion.circle key={n} cx="65" cy="65" r={R} fill="none" stroke={c} strokeDashoffset={off} className="cursor-pointer"
                style={{ pointerEvents: "stroke" }}
                onPointerEnter={() => setActive(i)} onPointerLeave={() => setActive(null)}
                initial={{ strokeDasharray: `0 ${C}`, strokeWidth: 15 }}
                animate={inView ? { strokeDasharray: `${C * frac - 1.5} ${C}`, strokeWidth: on ? 19 : 15, opacity: dim ? 0.35 : 1 } : {}}
                transition={{ strokeDasharray: { duration: 1, ease: "easeOut", delay: 0.1 + acc * 0.9 }, strokeWidth: { type: "spring", stiffness: 380, damping: 24 }, opacity: { duration: 0.2 } }} />
            );
            acc += frac;
            return seg;
          })}
        </svg>
        {!reduce && (
          <motion.svg viewBox="0 0 130 130" className="pointer-events-none absolute inset-0 h-full w-full" animate={{ rotate: 360 }} transition={{ duration: 34, repeat: Infinity, ease: "linear" }}>
            <circle cx="65" cy="65" r="62" fill="none" stroke={ACCENT} strokeOpacity="0.28" strokeWidth="1" strokeDasharray="2 6" />
          </motion.svg>
        )}
        <div className="pointer-events-none absolute inset-0 grid place-items-center px-6 text-center">
          {active === null ? (
            <div>
              <div className="font-display text-2xl font-bold leading-none tabular-nums" style={{ color: INK }}><Count to={21.034} play={inView} decimals={3} /></div>
              <div className="mt-1 text-[0.5rem] font-bold" style={{ color: GK.greenDk }}>kgCO₂eq</div>
            </div>
          ) : (
            <motion.div key={active} initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.18 }}>
              <div className="font-display text-xl font-bold leading-none tabular-nums" style={{ color: INK }}>{DONUT[active][1].toFixed(3)}</div>
              <div className="mt-1 text-[0.46rem] font-bold leading-tight" style={{ color: DONUT[active][2] }}>{DONUT[active][0]}</div>
              <div className="mt-0.5 text-[0.44rem] tabular-nums" style={{ color: MUTED }}>{Math.round((DONUT[active][1] / total) * 100)}% of total</div>
            </motion.div>
          )}
        </div>
      </div>

      <div className="mt-4 space-y-0.5">
        {DONUT.map(([n, v, c], i) => (
          <motion.button key={n} onPointerEnter={() => setActive(i)} onPointerLeave={() => setActive(null)} onFocus={() => setActive(i)} onBlur={() => setActive(null)}
            className="flex w-full items-center gap-2 rounded-md px-1 py-1 text-left text-[0.58rem] transition-colors hover:bg-[#f7faf8] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-1 focus-visible:outline-[#16a34a]"
            style={{ background: active === i ? "#f7faf8" : undefined }}
            initial={{ opacity: 0, x: -6 }} animate={inView ? { opacity: 1, x: 0 } : {}} transition={{ delay: 0.5 + i * 0.07 }}>
            <motion.span className="h-2 w-2 shrink-0 rounded-full" style={{ background: c }} animate={{ scale: active === i ? 1.5 : 1 }} />
            <span className="truncate" style={{ color: INK, fontWeight: active === i ? 700 : 400 }}>{n}</span>
            <span className="ml-auto shrink-0 font-mono font-semibold tabular-nums" style={{ color: MUTED }}>{v.toFixed(2)}</span>
          </motion.button>
        ))}
      </div>
    </div>
  );
}

/* ---------- Productivity: BOM upload → parsed (interactive) ---------- */
const BOM_ROWS: { n: string; q: string; v: number }[] = [
  { n: "Polypropylene", q: "1 kg", v: 2.37 },
  { n: "Steel, primary", q: "5 kg", v: 19.64 },
  { n: "Aluminium, recycled", q: "5 kg", v: 74.91 },
  { n: "PCB assembly", q: "1 unit", v: 20.08 },
];
export function BomUpload() {
  const { ref, inView } = useReveal();
  const reduce = useReducedMotion();
  const [on, setOn] = useState<boolean[]>(() => BOM_ROWS.map(() => true));
  const total = BOM_ROWS.reduce((s, r, i) => s + (on[i] ? r.v : 0), 0);
  const count = on.filter(Boolean).length;
  const toggle = (i: number) => setOn((p) => p.map((x, k) => (k === i ? !x : x)));

  return (
    <div ref={ref} className="grid gap-4 overflow-hidden rounded-2xl border border-[#e6ece7] p-4 sm:grid-cols-2 sm:p-6" style={{ background: "linear-gradient(180deg,#fbfcfb,#f2f5f3)" }}>
      {/* dropzone */}
      <div className="relative flex h-56 items-center justify-center overflow-hidden rounded-xl border-2 border-dashed border-[#cfd8d3] bg-white/70">
        <div className="text-center">
          <svg viewBox="0 0 24 24" className="mx-auto h-6 w-6" fill="none" stroke={GK.green} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M12 16V4M8 8l4-4 4 4M4 20h16" /></svg>
          <p className="mt-2 text-sm font-semibold" style={{ color: INK }}><span style={{ color: GK.greenDk, textDecoration: "underline" }}>Choose file</span> or drag and drop</p>
          <p className="mt-1 text-[0.62rem]" style={{ color: MUTED }}>Bill of materials · xls, xlsx, csv</p>
        </div>
        <motion.div className="absolute left-1/2 top-5 flex -translate-x-1/2 items-center gap-2 rounded-lg bg-white px-2.5 py-1.5 shadow-lg"
          animate={reduce ? undefined : { y: [0, 7, 0], rotate: [-2, 2, -2] }} transition={{ duration: 3.6, repeat: Infinity, ease: "easeInOut" }}>
          <span className="rounded px-1.5 py-0.5 text-[0.5rem] font-bold text-white" style={{ background: GK.greenDk }}>XLS</span>
          <span className="text-[0.62rem] font-medium" style={{ color: INK }}>products.xls</span>
        </motion.div>
        {!reduce && <motion.div className="pointer-events-none absolute inset-y-0 w-1/3" style={{ background: "linear-gradient(90deg,transparent,rgba(22,163,74,0.12),transparent)" }} animate={{ x: ["-140%", "440%"] }} transition={{ duration: 3.6, repeat: Infinity, ease: "easeInOut" }} />}
      </div>

      {/* parsed — toggle rows to recompute */}
      <div className="rounded-xl bg-white p-3.5 shadow-lg">
        <div className="flex items-center justify-between gap-2">
          <span className="text-[0.68rem] font-bold" style={{ color: INK }}>Matched line items</span>
          <span className="shrink-0 rounded-full bg-[#f1f7f3] px-2 py-0.5 text-[0.56rem] font-bold tabular-nums" style={{ color: GK.greenDk }}>{count}/{BOM_ROWS.length}</span>
        </div>
        <div className="mt-2 h-1 overflow-hidden rounded-full bg-[#eef1ef]">
          <motion.div className="h-full rounded-full" style={{ background: GK.green }} animate={{ width: `${(count / BOM_ROWS.length) * 100}%` }} transition={{ type: "spring", stiffness: 220, damping: 28 }} />
        </div>
        <p className="mt-2 text-[0.56rem]" style={{ color: MUTED }}>Toggle a material to see its contribution.</p>

        <div className="mt-2 grid grid-cols-[1.4fr_0.6fr_0.9fr] text-[0.5rem] font-semibold uppercase tracking-wide" style={{ color: MUTED }}><span>Material</span><span>Qty</span><span className="text-right">kgCO₂e</span></div>
        {BOM_ROWS.map((r, i) => (
          <motion.button key={r.n} onClick={() => toggle(i)} aria-pressed={on[i]}
            className="grid w-full grid-cols-[1.4fr_0.6fr_0.9fr] items-center gap-1 border-t border-[#f2f5f3] py-1.5 text-left text-[0.6rem] transition-colors hover:bg-[#f7faf8] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-1 focus-visible:outline-[#16a34a]"
            initial={{ opacity: 0, y: 6 }} animate={inView ? { opacity: 1, y: 0 } : {}} transition={{ delay: 0.3 + i * 0.13 }}>
            <span className="flex min-w-0 items-center gap-1.5">
              <motion.span className="grid h-3 w-3 shrink-0 place-items-center rounded-[3px] border" animate={{ background: on[i] ? GK.greenDk : "#fff", borderColor: on[i] ? GK.greenDk : "#cfd8d3" }}>
                {on[i] && <svg viewBox="0 0 24 24" className="h-2 w-2" fill="none" stroke="#fff" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round"><path d="M5 13l4 4L19 7" /></svg>}
              </motion.span>
              <span className="truncate" style={{ color: on[i] ? INK : "#aab3ae" }}>{r.n}</span>
            </span>
            <span style={{ color: MUTED }}>{r.q}</span>
            <span className="text-right font-mono font-semibold tabular-nums" style={{ color: on[i] ? GK.greenDk : "#c3cbc7" }}>{r.v.toFixed(2)}</span>
          </motion.button>
        ))}
        <div className="mt-2 flex items-center justify-between gap-2 border-t-2 border-[#eef1ef] pt-2 text-[0.66rem] font-bold" style={{ color: INK }}>
          <span>Product footprint</span>
          <motion.span key={total} initial={{ opacity: 0.4, y: -3 }} animate={{ opacity: 1, y: 0 }} className="shrink-0 font-mono tabular-nums" style={{ color: GK.greenDk }}>{total.toFixed(2)}</motion.span>
        </div>
      </div>
    </div>
  );
}

/* ---------- Expertise: LCA app screenshot ---------- */
const LNAV = ["Progress", "Data", "My emissions", "Actions", "ESG data", "Suppliers", "LCA"];
export function LcaAppShot() {
  const { ref, inView } = useReveal();
  const cols = ["Climate ch.", "Acidification", "Fresh water", "Human tox.", "Land use"];
  const stages = [19.5, 8.7, 3.6, 1.39, 0.9];
  return (
    <motion.div ref={ref} className="overflow-hidden rounded-xl border border-[#e3e9e5] bg-white shadow-[0_34px_70px_-32px_rgba(16,80,50,0.4)]"
      initial={{ opacity: 0, y: 16 }} animate={inView ? { opacity: 1, y: 0 } : {}} transition={{ duration: 0.55 }}>
      <div className="flex">
        <aside className="hidden w-28 shrink-0 flex-col p-3 sm:flex" style={{ background: "#0f2a1c" }}>
          <EsgenMark color="#ffffff" className="mb-3 h-4 w-6" />
          {LNAV.map((n) => <span key={n} className="mb-0.5 rounded px-1.5 py-1 text-[0.5rem]" style={{ background: n === "LCA" ? "rgba(255,255,255,0.12)" : "transparent", color: n === "LCA" ? "#fff" : "rgba(255,255,255,0.55)" }}>{n}</span>)}
        </aside>
        <div className="min-w-0 flex-1 p-3">
          <div className="overflow-x-auto">
            <div className="grid min-w-[380px] grid-cols-[1.2fr_repeat(5,0.8fr)] border-b border-[#eef1ef] pb-1 text-[0.48rem] font-semibold" style={{ color: MUTED }}>
              <span>Product</span>{cols.map((c) => <span key={c}>{c}</span>)}
            </div>
            <div className="grid min-w-[380px] grid-cols-[1.2fr_repeat(5,0.8fr)] py-1.5 text-[0.52rem]" style={{ color: INK }}>
              <span>Smartphone</span><span>21.03</span><span>0.16</span><span>496.9</span><span>10.29</span><span>0.03</span>
            </div>
          </div>
          <div className="mt-2 grid grid-cols-[0.8fr_1.4fr] gap-2">
            <div className="rounded-lg border border-[#eef1ef] p-2.5">
              <div className="text-[0.54rem]" style={{ color: MUTED }}>Climate change</div>
              <div className="font-display text-lg font-bold tabular-nums" style={{ color: INK }}><Count to={21.034} play={inView} decimals={3} /></div>
            </div>
            <div className="rounded-lg border border-[#eef1ef] p-2.5">
              <div className="text-[0.5rem]" style={{ color: MUTED }}>Impact per life-cycle stage (kgCO₂eq)</div>
              <div className="mt-1.5 flex h-14 items-end gap-1.5">
                {stages.map((v, i) => (
                  <motion.div key={i} className="flex-1 rounded-t-[2px]" style={{ background: i === 0 ? GK.greenDk : "#a8e0bd" }} initial={{ height: 0 }} animate={inView ? { height: `${(v / 19.5) * 100}%` } : {}} transition={{ duration: 0.6, delay: 0.2 + i * 0.07 }} />
                ))}
              </div>
              <div className="mt-0.5 flex gap-1.5">
                {stages.map((v, i) => <span key={i} className="flex-1 text-center text-[0.36rem]" style={{ color: MUTED }}>{v}</span>)}
              </div>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
}

/* ---------- Precision: data source tiles ---------- */
const TILE_ICON: Record<string, string> = {
  "Government datasets": "M3 21h18M5 21V9l7-5 7 5v12M9 21v-6h6v6",
  "Industry LCA databases": "M4 6c0-1.7 3.6-3 8-3s8 1.3 8 3-3.6 3-8 3-8-1.3-8-3zM4 6v12c0 1.7 3.6 3 8 3s8-1.3 8-3V6M4 12c0 1.7 3.6 3 8 3s8-1.3 8-3",
  "Peer-reviewed studies": "M4 5a2 2 0 0 1 2-2h9l5 5v11a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2zM14 3v6h6M8 14h8M8 17h5",
  "Supplier primary data": "M1 16V7h13v9M14 10h4l3 3v3h-7M5.5 19a2 2 0 1 0 0-4 2 2 0 0 0 0 4zM17.5 19a2 2 0 1 0 0-4 2 2 0 0 0 0 4z",
  "Sector associations": "M9 8a3 3 0 1 0 0-6 3 3 0 0 0 0 6zM3 20a6 6 0 0 1 12 0M17 11a2.5 2.5 0 1 0 0-5 2.5 2.5 0 0 0 0 5zM16 20h5a5 5 0 0 0-5-5",
  "Product declarations": "M9 12l2 2 4-4M12 2l2.4 1.8 3-.2.6 2.9 2.4 1.8-1.3 2.7 1.3 2.7-2.4 1.8-.6 2.9-3-.2L12 22l-2.4-1.8-3 .2-.6-2.9-2.4-1.8L4.9 13 3.6 10.3 6 8.5l.6-2.9 3 .2z",
};
export function SourceTiles() {
  const { ref, inView } = useReveal();
  const reduce = useReducedMotion();
  return (
    <div ref={ref} className="relative overflow-hidden rounded-2xl">
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
        {Object.keys(TILE_ICON).map((t, i) => (
          <motion.div key={t} className="group relative flex h-28 flex-col justify-between overflow-hidden rounded-xl border border-[#dcebe2] p-3.5 transition-transform duration-300 hover:-translate-y-1"
            style={{ background: "linear-gradient(155deg,#f7fbf8,#e9f5ee)" }}
            initial={{ opacity: 0, y: 14, scale: 0.96 }} animate={inView ? { opacity: 1, y: 0, scale: 1 } : {}} transition={{ delay: 0.07 * i, ease: "backOut", duration: 0.5 }}>
            <span className="grid h-8 w-8 place-items-center rounded-lg bg-white shadow-sm">
              <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke={ACCENT} strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round"><path d={TILE_ICON[t]} /></svg>
            </span>
            <span className="text-[0.72rem] font-semibold leading-tight" style={{ color: "#14392a" }}>{t}</span>
            <span aria-hidden className="absolute -right-4 -top-4 h-14 w-14 rounded-full opacity-40" style={{ background: "radial-gradient(circle,rgba(22,163,74,0.20),transparent 70%)" }} />
          </motion.div>
        ))}
      </div>
      {!reduce && <motion.div className="pointer-events-none absolute inset-y-0 w-1/4" style={{ background: "linear-gradient(90deg,transparent,rgba(255,255,255,0.6),transparent)" }} animate={{ x: ["-120%", "500%"] }} transition={{ duration: 5.5, repeat: Infinity, ease: "easeInOut" }} />}
    </div>
  );
}

/* ---------- Circularity: the life-cycle ring (interactive) ---------- */
const STAGES: { t: string; d: string; note: string }[] = [
  { t: "Raw materials", d: "M12 2l9 5v10l-9 5-9-5V7z", note: "Extraction and sourcing of inputs." },
  { t: "Manufacture", d: "M3 20h18M5 20V9l5 3V9l5 3V9l4 3v8", note: "Energy and process emissions in production." },
  { t: "Distribution", d: "M1 16V7h13v9M14 10h4l3 3v3h-7M5.5 19a2 2 0 1 0 0-4 2 2 0 0 0 0 4z", note: "Transport, warehousing, and packaging." },
  { t: "Use", d: "M12 3a6 6 0 0 1 4 10.5V17H8v-3.5A6 6 0 0 1 12 3zM9 20h6", note: "Energy consumed over the product's life." },
  { t: "End of life", d: "M7 6h10l-1 14H8zM10 6V4h4v2M10 10v6M14 10v6", note: "Reuse, recycling, recovery, or disposal." },
];
const CX = 190, CY = 150, RR = 88;
const RING = `M${CX} ${CY - RR} A${RR} ${RR} 0 1 1 ${CX - 0.01} ${CY - RR}`;
export function CircularLoop() {
  const { ref, inView } = useReveal();
  const reduce = useReducedMotion();
  const [active, setActive] = useState<number | null>(null);
  const ang = (i: number) => ((-90 + i * 72) * Math.PI) / 180;
  const node = (i: number) => ({ x: CX + Math.cos(ang(i)) * RR, y: CY + Math.sin(ang(i)) * RR });
  /* Labels sit fully outside the ring: anchored away from the circle so a wide
     word can never run back across the stroke. */
  const label = (i: number) => {
    const c = Math.cos(ang(i)), s = Math.sin(ang(i));
    const anchor = Math.abs(c) < 0.3 ? "middle" : c > 0 ? "start" : "end";
    const padX = anchor === "middle" ? 0 : c > 0 ? 10 : -10;
    const dy = s < -0.8 ? -6 : s > 0.8 ? 14 : 3;
    return { x: CX + c * 116 + padX, y: CY + s * 116 + dy, anchor } as const;
  };

  return (
    <div ref={ref} className="relative mx-auto w-full max-w-[440px]" style={{ aspectRatio: "380 / 300" }}>
      <svg viewBox="0 0 380 300" className="absolute inset-0 h-full w-full">
        <defs>
          <linearGradient id="ringGrad" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor={ACCENT} /><stop offset="55%" stopColor={GK.greenDk} /><stop offset="100%" stopColor="#4ade80" />
          </linearGradient>
        </defs>

        <motion.circle cx={CX} cy={CY} r="104" fill="none" stroke={ACCENT} strokeOpacity="0.20" strokeWidth="1" strokeDasharray="2 7"
          style={{ transformBox: "fill-box", transformOrigin: "center" }}
          animate={reduce ? undefined : { rotate: 360 }} transition={{ duration: 40, repeat: Infinity, ease: "linear" }} />

        <circle cx={CX} cy={CY} r={RR} fill="none" stroke="#e6efe9" strokeWidth="10" />
        <motion.circle cx={CX} cy={CY} r={RR} fill="none" stroke="url(#ringGrad)" strokeWidth="10" strokeLinecap="round"
          initial={{ pathLength: 0 }} animate={inView ? { pathLength: 1 } : {}} transition={{ duration: 1.6, ease: "easeInOut" }}
          style={{ rotate: -90, transformBox: "fill-box", transformOrigin: "center" }} />

        {!reduce && <>
          <circle r="4.5" fill={ACCENT}><animateMotion dur="9s" repeatCount="indefinite" path={RING} /></circle>
          <circle r="3" fill={GK.green} opacity="0.8"><animateMotion dur="9s" begin="4.5s" repeatCount="indefinite" path={RING} /></circle>
        </>}

        {STAGES.map((s, i) => {
          const n = node(i), l = label(i);
          const on = active === i;
          return (
            <motion.g key={s.t} tabIndex={0} role="button" aria-label={`${s.t}: ${s.note}`} className="cursor-pointer focus:outline-none"
              onPointerEnter={() => setActive(i)} onPointerLeave={() => setActive(null)} onFocus={() => setActive(i)} onBlur={() => setActive(null)}
              initial={{ opacity: 0, scale: 0.5 }} animate={inView ? { opacity: 1, scale: 1 } : {}}
              transition={{ delay: 0.5 + i * 0.13, ease: "backOut" }} style={{ transformBox: "fill-box", transformOrigin: "center" }}>
              <circle cx={n.x} cy={n.y} r="24" fill="transparent" />
              <motion.circle cx={n.x} cy={n.y} fill="#fff" stroke={on ? GK.greenDk : ACCENT}
                animate={{ r: on ? 20 : 17, strokeWidth: on ? 2.4 : 1.6 }} transition={{ type: "spring", stiffness: 400, damping: 24 }} />
              <svg x={n.x - 8} y={n.y - 8} width="16" height="16" viewBox="0 0 24 24" fill="none" stroke={on ? GK.greenDk : ACCENT} strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" className="pointer-events-none"><path d={s.d} /></svg>
              <text x={l.x} y={l.y} textAnchor={l.anchor} fontSize="9.5" fontWeight="700" fill={on ? GK.greenDk : INK} className="pointer-events-none">{s.t}</text>
            </motion.g>
          );
        })}
      </svg>

      {/* centre label — HTML so it wraps instead of overlapping */}
      <div className="pointer-events-none absolute left-1/2 top-1/2 w-[7.5rem] -translate-x-1/2 -translate-y-1/2 text-center">
        {active === null ? (
          <div>
            <p className="font-display text-sm font-bold" style={{ color: INK }}>Eco-design</p>
            <p className="mt-0.5 text-[0.58rem] leading-tight" style={{ color: MUTED }}>impact at every decision</p>
          </div>
        ) : (
          <motion.div key={active} initial={{ opacity: 0, scale: 0.92 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.18 }}>
            <p className="font-display text-[0.78rem] font-bold leading-tight" style={{ color: GK.greenDk }}>{STAGES[active].t}</p>
            <p className="mt-1 text-[0.56rem] leading-tight" style={{ color: MUTED }}>{STAGES[active].note}</p>
          </motion.div>
        )}
      </div>
    </div>
  );
}

/* ---------- Product LCA tabs ---------- */
const PRODUCTS: { k: string; total: string; stages: [string, number][] }[] = [
  { k: "Robotic arm", total: "412.6", stages: [["Steel & motors", 100], ["Assembly", 46], ["Transport", 22], ["Use phase", 64], ["End of life", 14]] },
  { k: "Smartphone", total: "21.03", stages: [["Components", 100], ["Assembly", 32], ["Transport", 18], ["Use phase", 40], ["End of life", 10]] },
  { k: "Food farming", total: "3.42", stages: [["Cultivation", 100], ["Processing", 38], ["Packaging", 26], ["Transport", 30], ["End of life", 12]] },
  { k: "Cheese", total: "8.71", stages: [["Milk production", 100], ["Processing", 34], ["Packaging", 20], ["Cold chain", 42], ["End of life", 9]] },
];
export function ProductLcaTabs() {
  const [i, setI] = useState(0);
  const p = PRODUCTS[i];
  return (
    <div>
      <div role="tablist" aria-label="Products" className="flex flex-wrap justify-center gap-x-8 gap-y-2">
        {PRODUCTS.map((x, k) => (
          <button key={x.k} role="tab" aria-selected={i === k} onClick={() => setI(k)} className="relative pb-2 text-base font-semibold transition-colors" style={{ color: i === k ? INK : "#9aa5a0" }}>
            {x.k}
            {i === k && <motion.span layoutId="prodtab" className="absolute inset-x-0 -bottom-px h-0.5 rounded" style={{ background: GK.greenDk }} />}
          </button>
        ))}
      </div>
      <motion.div key={p.k} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.35 }} className="mx-auto mt-10 max-w-2xl rounded-2xl border border-[#e6ece7] bg-white p-6 shadow-[0_28px_60px_-34px_rgba(16,80,50,0.4)]">
        <div className="flex items-end justify-between">
          <div><div className="text-[0.62rem] uppercase tracking-wide" style={{ color: MUTED }}>Total climate impact</div><div className="font-display text-3xl font-bold tabular-nums" style={{ color: INK }}>{p.total} <span className="text-sm font-bold" style={{ color: GK.greenDk }}>kgCO₂eq</span></div></div>
          <span className="rounded px-2 py-1 text-[0.58rem] font-bold" style={{ background: TINT, color: ACCENT }}>Cradle-to-grave</span>
        </div>
        <div className="mt-5 space-y-2.5">
          {p.stages.map(([n, w], k) => (
            <div key={n} className="flex items-center gap-3">
              <span className="w-32 shrink-0 text-[0.78rem]" style={{ color: INK }}>{n}</span>
              <div className="h-2.5 flex-1 overflow-hidden rounded-full" style={{ background: "#eef1ef" }}>
                <motion.div className="h-full rounded-full" style={{ background: k === 0 ? GK.greenDk : "#8ed7a8" }} initial={{ width: 0 }} animate={{ width: `${w}%` }} transition={{ duration: 0.7, delay: 0.05 * k }} />
              </div>
            </div>
          ))}
        </div>
      </motion.div>
    </div>
  );
}

/* ---------- Compliance outputs + matrix ---------- */
const OUT: [string, string][] = [
  ["PCF", "Product carbon footprint (CO₂e only)"],
  ["Multi-impact LCA", "Environmental impacts: climate, water, and more"],
  ["EPD, FDES, PEP", "Public environmental product declaration"],
  ["DPP", "Product ID, sustainability data, digital supports"],
];
const MATRIX: [string, (string | boolean)[]][] = [
  ["Carbon", [true, true, true, true]],
  ["Multi-impact", [false, true, true, true]],
  ["BOM & factor matching", [true, true, true, true]],
  ["Automatic report generation", [true, true, true, true]],
  ["Audit trail", [true, true, true, true]],
  ["Third-party verification", ["Optional", "Optional", "Mandatory", "Mandatory"]],
];
export function ComplianceOutputs() {
  const [col, setCol] = useState<number | null>(null);
  const tint = (i: number) => (col === i ? { background: "#f7faf8" } : undefined);
  return (
    <div className="overflow-x-auto">
      <div className="min-w-[720px]" onMouseLeave={() => setCol(null)}>
        <div className="grid grid-cols-[1.3fr_repeat(4,1fr)] gap-4 border-b border-[#e6ece7] pb-6">
          <span />
          {OUT.map(([t, d], i) => (
            <button key={t} onMouseEnter={() => setCol(i)} onFocus={() => setCol(i)} onBlur={() => setCol(null)} aria-pressed={col === i}
              className="rounded-lg px-2 py-1 text-center transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#16a34a]" style={tint(i)}>
              {i === 3 && <div className="mb-1 text-[0.58rem] font-semibold" style={{ color: MUTED }}>Regulation</div>}
              <div className="font-display text-base font-bold" style={{ color: col === i ? GK.greenDk : INK }}>{t}</div>
              <p className="mt-1 text-[0.72rem] leading-snug" style={{ color: MUTED }}>{d}</p>
            </button>
          ))}
        </div>
        {MATRIX.map(([label, vals]) => (
          <div key={label} className="grid grid-cols-[1.3fr_repeat(4,1fr)] gap-4 border-b border-[#f0f3f1] py-3">
            <span className="text-[0.85rem]" style={{ color: INK }}>{label}</span>
            {vals.map((v, i) => (
              <span key={i} onMouseEnter={() => setCol(i)} className="flex items-center justify-center rounded text-[0.78rem] transition-colors" style={tint(i)}>
                {v === true && <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke={GK.green} strokeWidth="2.6" strokeLinecap="round" strokeLinejoin="round"><path d="M5 13l4 4L19 7" /></svg>}
                {v === false && <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="#c3cbc7" strokeWidth="2.2" strokeLinecap="round"><path d="M6 6l12 12M18 6L6 18" /></svg>}
                {typeof v === "string" && <span style={{ color: v === "Mandatory" ? GK.greenDk : MUTED }}>{v}</span>}
              </span>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}

/* ---------- How an LCA works: 3 steps ---------- */
const STEP_TONE = [
  { bg: "#0d1411", ink: "#fff", sub: "rgba(255,255,255,0.7)", badge: "#0d1411" },
  { bg: "#e9fbef", ink: INK, sub: MUTED, badge: GK.greenDk },
  { bg: "#f4f6f5", ink: INK, sub: MUTED, badge: GK.greenDk },
];
export function LcaSteps() {
  return (
    <div className="grid gap-5 lg:grid-cols-3">
      {[
        { t: "Scope", d: "Define your LCA boundaries and select or build your template.", body: <ScopeBody /> },
        { t: "Collect", d: "Gather product data from your suppliers, internal databases, or factories.", body: <CollectBody /> },
        { t: "Evaluate", d: "Apply recognised emission factors to precisely measure your footprint.", body: <EvaluateBody /> },
      ].map((s, i) => {
        const t = STEP_TONE[i];
        return (
          <motion.div key={s.t} className="flex min-h-[340px] flex-col rounded-2xl p-6" style={{ background: t.bg }}
            initial={{ opacity: 0, y: 18 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, margin: "0px 0px -10% 0px" }} transition={{ duration: 0.5, delay: i * 0.08 }}>
            <span className="grid h-10 w-10 place-items-center rounded-full bg-white font-display text-sm font-bold" style={{ color: t.badge }}>{i + 1}</span>
            <h3 className="mt-4 font-display text-xl font-bold" style={{ color: t.ink }}>{s.t}</h3>
            <p className="mt-2 text-sm leading-relaxed" style={{ color: t.sub }}>{s.d}</p>
            <div className="mt-auto pt-6">{s.body}</div>
          </motion.div>
        );
      })}
    </div>
  );
}
function ScopeBody() {
  return (
    <div className="rounded-lg bg-white p-2.5 shadow-lg">
      <div className="mb-2 flex items-center justify-between text-[0.6rem] font-semibold" style={{ color: INK }}><span className="flex items-center gap-1.5"><span className="grid h-4 w-4 place-items-center rounded-full text-[0.5rem] text-white" style={{ background: GK.greenDk }}>A</span>Acme Ltd</span><span style={{ color: MUTED }}>▾</span></div>
      <div className="rounded border border-[#eef1ef] p-1.5">
        <div className="flex items-center justify-between text-[0.52rem]"><span style={{ color: INK }}>Raw material</span><span className="rounded px-1 text-[0.44rem] font-bold text-white" style={{ background: GK.greenDk }}>117 kgCO₂e</span></div>
        {[["Polypropylene", "x1", "2.37"], ["Steel", "x5", "19.64"], ["Aluminium", "x5", "74.91"]].map(([n, q, v]) => (
          <div key={n} className="mt-1 flex items-center justify-between border-t border-[#f2f5f3] pt-1 text-[0.48rem]"><span style={{ color: INK }}>{n}</span><span style={{ color: MUTED }}>{q}</span><span className="font-semibold" style={{ color: INK }}>{v} kgCO₂e</span></div>
        ))}
      </div>
    </div>
  );
}
function CollectBody() {
  return (
    <div className="space-y-2">
      <div className="rounded-lg bg-white p-2.5 shadow"><div className="flex items-center gap-2"><span className="grid h-5 w-5 place-items-center rounded border border-[#dbe2dd] text-[0.7rem]" style={{ color: MUTED }}>+</span><span className="text-[0.66rem] font-semibold" style={{ color: INK }}>Create new product</span></div></div>
      <div className="rounded-lg bg-white p-2.5 shadow">
        <div className="text-[0.66rem] font-semibold" style={{ color: INK }}>Electric table saw</div>
        <div className="mt-1 flex gap-1.5">{["Tooling", "Electric"].map((t, i) => <span key={t} className="rounded px-1.5 py-0.5 text-[0.5rem] font-medium" style={{ background: i ? TINT : "#e9fbef", color: i ? ACCENT : GK.greenDk }}>{t}</span>)}</div>
        <div className="mt-2 text-[0.56rem] font-semibold" style={{ color: GK.greenDk }}>See template ↗</div>
      </div>
    </div>
  );
}
function EvaluateBody() {
  return (
    <div className="rounded-lg bg-white p-2.5 shadow-lg">
      <div className="text-center text-[0.56rem] font-semibold" style={{ color: INK }}>Select an emission factor</div>
      <div className="mt-1.5 flex items-center gap-1 rounded border border-[#eef1ef] px-1.5 py-1 text-[0.48rem]" style={{ color: MUTED }}>
        <svg viewBox="0 0 24 24" className="h-2.5 w-2.5" fill="none" stroke={MUTED} strokeWidth="2"><circle cx="11" cy="11" r="7" /><path d="M21 21l-4.3-4.3" /></svg>Search an emission factor
      </div>
      {["Unit", "Sector", "Country", "Category"].map((f) => (
        <div key={f} className="mt-1 flex items-center justify-between text-[0.48rem]"><span style={{ color: MUTED }}>{f}</span><span className="rounded border border-[#eef1ef] px-2 py-0.5" style={{ color: MUTED }}>Select ▾</span></div>
      ))}
    </div>
  );
}

/* ---------- PCF demand chart ---------- */
export function PcfDemandChart() {
  const { ref, inView } = useReveal();
  const bars = [12, 22, 40, 46, 58, 66, 88];
  const labels = ["Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct"];
  return (
    <div ref={ref} className="max-w-sm">
      {/* Bars are direct children of the fixed-height row so their percentage
          heights resolve against a definite height. */}
      <div className="flex h-32 items-end gap-2">
        {bars.map((h, i) => (
          <motion.div key={i} className="flex-1 rounded-t-[3px]"
            style={{ background: i === bars.length - 1 ? "#123f28" : `rgba(22,163,74,${0.35 + i * 0.09})` }}
            initial={{ height: 0 }} animate={inView ? { height: `${h}%` } : {}} transition={{ duration: 0.7, delay: 0.1 + i * 0.07 }} />
        ))}
      </div>
      <div className="mt-1 flex gap-2">
        {labels.map((l) => <span key={l} className="flex-1 text-center text-[0.5rem]" style={{ color: MUTED }}>{l}</span>)}
      </div>
    </div>
  );
}
