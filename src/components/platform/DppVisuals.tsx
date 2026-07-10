"use client";

import { useState } from "react";
import { motion, useReducedMotion } from "framer-motion";
import { GK } from "@/components/platform/CarbonVisuals";

const INK = "#0f1720", MUTED = "#6b7280";

/* ============================================================
   PRODUCT PASSPORT — a scannable identity with tabbed sections.
   Everything shown is illustrative sample data.
   ============================================================ */
type Tab = { k: string; icon: string; rows: [string, string][] };
const TABS: Tab[] = [
  { k: "Identity", icon: "M4 6h16v12H4zM8 10h8M8 14h5", rows: [["Product", "Cordless drill, 18V"], ["Unique identifier", "01 05012345678900 21 A7F2K"], ["Manufacturer", "Registered operator"], ["Placed on market", "March 2026"]] },
  { k: "Materials", icon: "M12 3l8 4.5v9L12 21l-8-4.5v-9z", rows: [["Steel", "41% by mass"], ["ABS polymer", "26% by mass"], ["Copper", "12% by mass"], ["Lithium-ion cell", "14% by mass"], ["Substances of concern", "Declared, none above threshold"]] },
  { k: "Repair", icon: "M14 7l3 3M5 19l6-6M14 7a4 4 0 1 1 5 5l-9 9H5v-5z", rows: [["Spare parts", "Available for 7 years"], ["Repair index", "Published"], ["Disassembly", "Standard tools only"], ["Manual", "Digital, no login required"]] },
  { k: "End of life", icon: "M7 6h10l-1 14H8zM10 6V4h4v2M10 10v6M14 10v6", rows: [["Recyclable content", "68% by mass"], ["Battery removal", "User-removable"], ["Take-back", "Producer scheme"], ["Recycled input", "22% by mass"]] },
];

export function PassportCard() {
  const [t, setT] = useState(0);
  const reduce = useReducedMotion();
  const tab = TABS[t];

  return (
    <div className="grid items-center gap-10 lg:grid-cols-[0.8fr_1.2fr]">
      {/* The scannable side */}
      <div className="mx-auto w-full max-w-[300px]">
        <div className="relative overflow-hidden rounded-3xl bg-[#0d1411] p-7">
          <div aria-hidden className="absolute -right-10 -top-10 h-32 w-32 rounded-full" style={{ background: "radial-gradient(circle, rgba(22,163,74,0.3), transparent 70%)" }} />
          <div className="relative">
            <div className="text-[0.58rem] font-bold uppercase tracking-[0.16em] text-white/40">Digital product passport</div>

            {/* data carrier */}
            <div className="relative mx-auto mt-6 grid h-32 w-32 place-items-center rounded-xl bg-white p-2.5">
              <svg viewBox="0 0 42 42" className="h-full w-full" aria-label="Data carrier" role="img">
                {[[0, 0], [30, 0], [0, 30]].map(([x, y]) => (
                  <g key={`${x}-${y}`}>
                    <rect x={x} y={y} width="12" height="12" fill="none" stroke="#0d1411" strokeWidth="2.4" />
                    <rect x={x + 4} y={y + 4} width="4" height="4" fill="#0d1411" />
                  </g>
                ))}
                {[[16, 2], [20, 6], [16, 10], [24, 2], [28, 8], [2, 16], [6, 20], [10, 16], [16, 16], [20, 20], [26, 16], [30, 20], [36, 16], [16, 24], [22, 28], [16, 32], [20, 36], [26, 30], [32, 34], [36, 28], [30, 24], [24, 36], [36, 40], [8, 26], [2, 28]].map(([x, y], i) => (
                  <rect key={i} x={x} y={y} width="4" height="4" fill="#0d1411" />
                ))}
              </svg>
              {!reduce && (
                <motion.div className="pointer-events-none absolute inset-x-2 h-0.5 rounded-full" style={{ background: GK.green, boxShadow: `0 0 10px ${GK.green}` }}
                  animate={{ top: ["10%", "90%", "10%"] }} transition={{ duration: 3.4, repeat: Infinity, ease: "easeInOut" }} />
              )}
            </div>

            <div className="mt-5 text-center">
              <div className="font-display text-sm font-bold text-white">Cordless drill, 18V</div>
              <div className="mt-1 font-mono text-[0.56rem] text-white/45">01 05012345678900 21 A7F2K</div>
            </div>

            <div className="mt-5 flex items-center justify-center gap-1.5 rounded-lg bg-white/[0.06] py-2 ring-1 ring-white/10">
              {!reduce && <motion.span className="h-1.5 w-1.5 rounded-full" style={{ background: GK.green }} animate={{ opacity: [1, 0.25, 1] }} transition={{ duration: 1.8, repeat: Infinity }} />}
              <span className="text-[0.58rem] font-bold" style={{ color: GK.green }}>passport resolves</span>
            </div>
          </div>
        </div>
        <p className="mt-3 text-center text-[0.6rem]" style={{ color: MUTED }}>Illustrative sample data.</p>
      </div>

      {/* The data side */}
      <div>
        <div className="flex flex-wrap gap-1 rounded-xl bg-[#f1f4f2] p-1">
          {TABS.map((x, i) => (
            <button key={x.k} onClick={() => setT(i)} aria-pressed={t === i}
              className="relative flex flex-1 items-center justify-center gap-1.5 rounded-lg px-3 py-2 text-[0.72rem] font-bold transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-[#16a34a]"
              style={{ color: t === i ? "#fff" : MUTED }}>
              {t === i && <motion.span layoutId="dpptab" className="absolute inset-0 rounded-lg" style={{ background: "#0d1411" }} transition={{ type: "spring", stiffness: 400, damping: 32 }} />}
              <svg viewBox="0 0 24 24" className="relative h-3.5 w-3.5 shrink-0" fill="none" stroke={t === i ? GK.green : MUTED} strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round"><path d={x.icon} /></svg>
              <span className="relative">{x.k}</span>
            </button>
          ))}
        </div>

        <motion.dl key={tab.k} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.22 }}
          className="mt-5 divide-y divide-[#eef1ef] overflow-hidden rounded-2xl border border-[#e6ece7] bg-white">
          {tab.rows.map(([k, v], i) => (
            <motion.div key={k} className="flex items-baseline justify-between gap-4 px-5 py-3.5"
              initial={{ opacity: 0, x: -6 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.04 + i * 0.05 }}>
              <dt className="text-[0.82rem]" style={{ color: MUTED }}>{k}</dt>
              <dd className="text-right text-[0.86rem] font-semibold" style={{ color: INK }}>{v}</dd>
            </motion.div>
          ))}
        </motion.dl>
      </div>
    </div>
  );
}
