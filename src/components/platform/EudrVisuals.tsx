"use client";

import { useState } from "react";
import { motion, useReducedMotion } from "framer-motion";
import { GK } from "@/components/platform/CarbonVisuals";

const INK = "#0f1720", MUTED = "#6b7280";

/* ============================================================
   PLOT TRACEABILITY, pick a commodity, trace each consignment
   back to the geolocated plots it came from.
   Coordinates and plots are illustrative.
   ============================================================ */
type Plot = { id: string; x: number; y: number; ha: number; status: "clear" | "review" };
type Commodity = { k: string; icon: string; region: string; plots: Plot[] };

const COMMODITIES: Commodity[] = [
  { k: "Cocoa", region: "West Africa", icon: "M12 3c4 2 6 5 6 9a6 6 0 1 1-12 0c0-4 2-7 6-9zM12 8v8",
    plots: [
      { id: "PLT-0431", x: 28, y: 44, ha: 3.2, status: "clear" }, { id: "PLT-0442", x: 39, y: 58, ha: 1.8, status: "clear" },
      { id: "PLT-0455", x: 52, y: 39, ha: 4.6, status: "review" }, { id: "PLT-0467", x: 63, y: 62, ha: 2.4, status: "clear" },
      { id: "PLT-0470", x: 44, y: 72, ha: 5.1, status: "clear" },
    ] },
  { k: "Coffee", region: "South America", icon: "M4 8h13v6a5 5 0 0 1-5 5H9a5 5 0 0 1-5-5zM17 9h2a2 2 0 0 1 0 5h-2M6 3v2M10 3v2M14 3v2",
    plots: [
      { id: "PLT-1180", x: 34, y: 36, ha: 6.0, status: "clear" }, { id: "PLT-1192", x: 47, y: 52, ha: 2.9, status: "clear" },
      { id: "PLT-1206", x: 60, y: 45, ha: 3.7, status: "clear" }, { id: "PLT-1217", x: 55, y: 68, ha: 1.4, status: "review" },
    ] },
  { k: "Soya", region: "South America", icon: "M6 12a6 6 0 0 1 12 0M6 12a6 6 0 0 0 12 0M12 6v12",
    plots: [
      { id: "PLT-2033", x: 30, y: 55, ha: 120.5, status: "clear" }, { id: "PLT-2049", x: 58, y: 40, ha: 86.2, status: "clear" },
      { id: "PLT-2051", x: 68, y: 66, ha: 44.9, status: "clear" },
    ] },
  { k: "Wood", region: "Northern Europe", icon: "M12 2l5 9h-3l4 8H6l4-8H7z M12 19v3",
    plots: [
      { id: "PLT-3310", x: 36, y: 40, ha: 210.0, status: "clear" }, { id: "PLT-3324", x: 55, y: 57, ha: 154.3, status: "review" },
      { id: "PLT-3339", x: 68, y: 35, ha: 98.7, status: "clear" }, { id: "PLT-3350", x: 45, y: 70, ha: 176.1, status: "clear" },
    ] },
];

export function PlotTrace() {
  const [c, setC] = useState(0);
  const [sel, setSel] = useState<string | null>(null);
  const reduce = useReducedMotion();
  const com = COMMODITIES[c];
  const plot = com.plots.find((p) => p.id === sel) ?? null;
  const area = com.plots.reduce((s, p) => s + p.ha, 0);
  const review = com.plots.filter((p) => p.status === "review").length;

  return (
    <div className="overflow-hidden rounded-2xl border border-[#e6ece7] bg-white shadow-[0_40px_80px_-40px_rgba(16,80,50,0.4)]">
      <div className="flex flex-wrap items-center gap-2 border-b border-[#eef1ef] p-3">
        {COMMODITIES.map((x, i) => {
          const on = i === c;
          return (
            <button key={x.k} onClick={() => { setC(i); setSel(null); }} aria-pressed={on}
              className="flex items-center gap-1.5 rounded-lg px-2.5 py-1.5 text-[0.74rem] font-semibold transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-[#16a34a]"
              style={{ background: on ? "#0d1411" : "#f4f6f5", color: on ? "#fff" : MUTED }}>
              <svg viewBox="0 0 24 24" className="h-3.5 w-3.5" fill="none" stroke={on ? "#4ade80" : MUTED} strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round"><path d={x.icon} /></svg>
              {x.k}
            </button>
          );
        })}
        <span className="ml-auto hidden text-[0.62rem] sm:block" style={{ color: MUTED }}>{com.region}</span>
      </div>

      <div className="grid lg:grid-cols-[1.25fr_0.75fr]">
        {/* map */}
        <div className="relative aspect-[4/3] border-b border-[#eef1ef] lg:border-b-0 lg:border-r" style={{ background: "linear-gradient(160deg,#f4f8f5,#e8f0ea)" }}>
          <svg viewBox="0 0 100 100" className="absolute inset-0 h-full w-full" preserveAspectRatio="none" aria-hidden>
            {Array.from({ length: 9 }).map((_, i) => <line key={`h${i}`} x1="0" y1={i * 12.5} x2="100" y2={i * 12.5} stroke="#d5e2da" strokeWidth="0.25" />)}
            {Array.from({ length: 9 }).map((_, i) => <line key={`v${i}`} x1={i * 12.5} y1="0" x2={i * 12.5} y2="100" stroke="#d5e2da" strokeWidth="0.25" />)}
            <path d="M8 66 Q26 50 42 62 T74 54 T96 68" fill="none" stroke="#c3d6c9" strokeWidth="0.8" />
            <path d="M4 30 Q22 18 40 28 T70 22" fill="none" stroke="#c3d6c9" strokeWidth="0.8" />
          </svg>

          {com.plots.map((p, i) => {
            const on = p.id === sel;
            const c2 = p.status === "review" ? "#b3892f" : GK.greenDk;
            return (
              <button key={p.id} onClick={() => setSel(on ? null : p.id)} onPointerEnter={() => setSel(p.id)} aria-pressed={on} aria-label={`Plot ${p.id}`}
                className="absolute -translate-x-1/2 -translate-y-1/2 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#16a34a]"
                style={{ left: `${p.x}%`, top: `${p.y}%` }}>
                {!reduce && <motion.span className="absolute left-1/2 top-1/2 h-3 w-3 -translate-x-1/2 -translate-y-1/2 rounded-full" style={{ background: c2 }}
                  animate={{ scale: [1, 2.6, 1], opacity: [0.45, 0, 0.45] }} transition={{ duration: 2.4, repeat: Infinity, delay: i * 0.35 }} />}
                <span className="relative block rounded-full border-2 border-white shadow transition-all"
                  style={{ background: c2, width: on ? 16 : 11, height: on ? 16 : 11 }} />
              </button>
            );
          })}

          <div className="absolute bottom-3 left-3 rounded-lg bg-white/90 px-2.5 py-1.5 shadow-sm backdrop-blur">
            <div className="text-[0.52rem] font-bold uppercase tracking-wide" style={{ color: MUTED }}>Geolocated plots</div>
            <div className="font-display text-sm font-bold tabular-nums" style={{ color: INK }}>{com.plots.length}</div>
          </div>
        </div>

        {/* detail */}
        <div className="p-4">
          <div className="grid grid-cols-2 gap-2">
            <div className="rounded-lg border border-[#eef1ef] p-2.5">
              <div className="text-[0.5rem] uppercase tracking-wide" style={{ color: MUTED }}>Total area</div>
              <div className="font-display text-[0.95rem] font-bold tabular-nums" style={{ color: INK }}>{area.toFixed(1)} ha</div>
            </div>
            <div className="rounded-lg border border-[#eef1ef] p-2.5">
              <div className="text-[0.5rem] uppercase tracking-wide" style={{ color: MUTED }}>Needs review</div>
              <div className="font-display text-[0.95rem] font-bold tabular-nums" style={{ color: review ? "#b3892f" : GK.greenDk }}>{review}</div>
            </div>
          </div>

          <div className="mt-3 space-y-1">
            {com.plots.map((p) => {
              const on = p.id === sel;
              return (
                <button key={p.id} onClick={() => setSel(on ? null : p.id)} onPointerEnter={() => setSel(p.id)} aria-pressed={on}
                  className="flex w-full items-center gap-2 rounded-lg px-2 py-1.5 text-left transition-colors hover:bg-[#f7faf8] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-1 focus-visible:outline-[#16a34a]"
                  style={{ background: on ? "#f1f7f3" : undefined }}>
                  <span className="h-2 w-2 shrink-0 rounded-full" style={{ background: p.status === "review" ? "#b3892f" : GK.greenDk }} />
                  <span className="min-w-0 flex-1 truncate font-mono text-[0.66rem]" style={{ color: INK, fontWeight: on ? 700 : 400 }}>{p.id}</span>
                  <span className="shrink-0 font-mono text-[0.6rem] tabular-nums" style={{ color: MUTED }}>{p.ha} ha</span>
                </button>
              );
            })}
          </div>

          <motion.div key={plot?.id ?? "none"} initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.2 }}
            className="mt-3 rounded-xl border border-[#e6ece7] bg-[#f8faf9] p-3">
            {plot ? (
              <>
                <div className="flex items-center justify-between gap-2">
                  <span className="font-mono text-[0.72rem] font-bold" style={{ color: INK }}>{plot.id}</span>
                  <span className="shrink-0 rounded px-1.5 py-0.5 text-[0.52rem] font-bold" style={{ background: plot.status === "review" ? "#f5f0e2" : "#f1f7f3", color: plot.status === "review" ? "#8a6a2f" : GK.greenDk }}>
                    {plot.status === "review" ? "needs review" : "no deforestation signal"}
                  </span>
                </div>
                <dl className="mt-2 space-y-1 text-[0.66rem]">
                  {([["Area", `${plot.ha} ha`], ["Commodity", com.k], ["Region", com.region], ["Cut-off checked", "31 Dec 2020"]] as [string, string][]).map(([k, v]) => (
                    <div key={k} className="flex justify-between gap-2"><dt style={{ color: MUTED }}>{k}</dt><dd className="font-semibold" style={{ color: INK }}>{v}</dd></div>
                  ))}
                </dl>
              </>
            ) : <p className="py-3 text-center text-[0.68rem]" style={{ color: MUTED }}>Select a plot on the map to inspect it.</p>}
          </motion.div>
          <p className="mt-2.5 text-[0.58rem]" style={{ color: MUTED }}>Plots and coordinates are illustrative.</p>
        </div>
      </div>
    </div>
  );
}
