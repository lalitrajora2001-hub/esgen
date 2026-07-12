"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { GK } from "@/components/platform/CarbonVisuals";

const INK = "#0f1720", MUTED = "#6b7280";

/* ============================================================
   CBAM COST MODEL
   Embedded emissions x certificate price, less any carbon price
   already paid in the country of production. Default intensities
   are illustrative placeholders, not published benchmarks.
   ============================================================ */
type Good = { k: string; unit: string; intensity: number; icon: string };
const GOODS: Good[] = [
  { k: "Cement", unit: "t", intensity: 0.62, icon: "M4 20h16M6 20V9l6-4 6 4v11M10 20v-5h4v5" },
  { k: "Iron & steel", unit: "t", intensity: 1.9, icon: "M3 7h18M5 7v13M19 7v13M9 7v13M15 7v13" },
  { k: "Aluminium", unit: "t", intensity: 6.5, icon: "M12 3l8 4.5v9L12 21l-8-4.5v-9z" },
  { k: "Fertilisers", unit: "t", intensity: 1.4, icon: "M12 21V9M12 9c0-3 2-5 5-5 0 3-2 5-5 5zM12 12c0-3-2-5-5-5 0 3 2 5 5 5z" },
  { k: "Hydrogen", unit: "t", intensity: 9.0, icon: "M6 5v14M18 5v14M6 12h12" },
  { k: "Electricity", unit: "MWh", intensity: 0.35, icon: "M13 2L4 14h6l-1 8 9-12h-6z" },
];

export function CbamCostModel() {
  const [g, setG] = useState(1);
  const [volume, setVolume] = useState(2500);
  const [price, setPrice] = useState(72);
  const [paid, setPaid] = useState(0);

  const good = GOODS[g];
  const embedded = volume * good.intensity;              // tCO2e
  const chargeable = Math.max(0, embedded * (1 - paid / 100));
  const cost = chargeable * price;
  const saved = embedded * price - cost;

  const money = (n: number) => "€" + Math.round(n).toLocaleString("en-GB");

  return (
    <div className="overflow-hidden rounded-2xl border border-[#e6ece7] bg-white shadow-[0_40px_80px_-40px_rgba(16,80,50,0.4)]">
      <div className="flex items-center justify-between border-b border-[#eef1ef] px-5 py-3">
        <span className="text-[0.66rem] font-bold uppercase tracking-[0.12em]" style={{ color: MUTED }}>Indicative CBAM exposure</span>
        <span className="rounded bg-[#f1f7f3] px-2 py-0.5 text-[0.56rem] font-bold" style={{ color: GK.greenDk }}>illustrative</span>
      </div>

      {/* goods */}
      <div className="grid grid-cols-3 gap-px bg-[#eef1ef] sm:grid-cols-6">
        {GOODS.map((x, i) => {
          const on = i === g;
          return (
            <button key={x.k} onClick={() => setG(i)} aria-pressed={on}
              className="flex flex-col items-center gap-1.5 px-2 py-3 transition-colors focus-visible:outline focus-visible:-outline-offset-2 focus-visible:outline-[#16a34a]"
              style={{ background: on ? "#0d1411" : "#fff" }}>
              <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke={on ? "#4ade80" : INK} strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"><path d={x.icon} /></svg>
              <span className="text-center text-[0.6rem] font-semibold leading-tight" style={{ color: on ? "#fff" : INK }}>{x.k}</span>
            </button>
          );
        })}
      </div>

      <div className="grid lg:grid-cols-[1fr_1fr]">
        {/* controls */}
        <div className="space-y-5 p-5">
          {[
            { label: `Volume imported (${good.unit})`, v: volume, set: setVolume, min: 0, max: 10000, step: 100, fmt: (n: number) => `${n.toLocaleString("en-GB")} ${good.unit}` },
            { label: "Certificate price (€ / tCO₂e)", v: price, set: setPrice, min: 0, max: 150, step: 1, fmt: (n: number) => `€${n}` },
            { label: "Carbon price already paid at origin", v: paid, set: setPaid, min: 0, max: 100, step: 1, fmt: (n: number) => `${n}%` },
          ].map((f) => (
            <div key={f.label}>
              <div className="flex items-baseline justify-between gap-2">
                <label className="text-[0.76rem] font-semibold" style={{ color: INK }}>{f.label}</label>
                <span className="shrink-0 font-mono text-[0.8rem] font-bold tabular-nums" style={{ color: GK.greenDk }}>{f.fmt(f.v)}</span>
              </div>
              <input type="range" min={f.min} max={f.max} step={f.step} value={f.v} onChange={(e) => f.set(+e.target.value)} aria-label={f.label}
                className="mt-2 h-1.5 w-full cursor-ew-resize appearance-none rounded-full bg-[#e6ece7]
                  [&::-webkit-slider-thumb]:h-4 [&::-webkit-slider-thumb]:w-4 [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:border-2 [&::-webkit-slider-thumb]:border-white [&::-webkit-slider-thumb]:bg-[#15803d] [&::-webkit-slider-thumb]:shadow
                  [&::-moz-range-thumb]:h-4 [&::-moz-range-thumb]:w-4 [&::-moz-range-thumb]:rounded-full [&::-moz-range-thumb]:border-2 [&::-moz-range-thumb]:border-white [&::-moz-range-thumb]:bg-[#15803d]" />
            </div>
          ))}

          <div className="rounded-xl border border-[#e6ece7] bg-[#f8faf9] p-3">
            <div className="flex items-baseline justify-between text-[0.72rem]">
              <span style={{ color: MUTED }}>Default intensity</span>
              <span className="font-mono font-bold" style={{ color: INK }}>{good.intensity} tCO₂e / {good.unit}</span>
            </div>
            <p className="mt-1.5 text-[0.62rem] leading-relaxed" style={{ color: MUTED }}>A placeholder until your supplier provides actual embedded emissions. Real declarations use installation-level data.</p>
          </div>
        </div>

        {/* output */}
        <div className="border-t border-[#eef1ef] bg-[#0d1411] p-5 lg:border-l lg:border-t-0">
          <div className="text-[0.6rem] font-bold uppercase tracking-[0.12em] text-white/40">Certificates to surrender</div>
          <motion.div key={Math.round(chargeable)} initial={{ opacity: 0.5, y: -3 }} animate={{ opacity: 1, y: 0 }}
            className="mt-1 flex items-end gap-2">
            <span className="font-display text-3xl font-bold tabular-nums text-white">{Math.round(chargeable).toLocaleString("en-GB")}</span>
            <span className="pb-1.5 text-[0.66rem] font-bold" style={{ color: GK.green }}>tCO₂e</span>
          </motion.div>

          <div className="mt-5 space-y-3">
            {[
              ["Embedded emissions", `${Math.round(embedded).toLocaleString("en-GB")} tCO₂e`, 100],
              ["Adjustment for carbon paid", `− ${Math.round(embedded - chargeable).toLocaleString("en-GB")} tCO₂e`, paid],
            ].map(([l, v, w]) => (
              <div key={l as string}>
                <div className="flex justify-between text-[0.68rem]"><span className="text-white/60">{l as string}</span><span className="font-mono text-white/90">{v as string}</span></div>
                <div className="mt-1 h-1.5 overflow-hidden rounded-full bg-white/10">
                  <div className="h-full rounded-full motion-safe:transition-[width] motion-safe:duration-500" style={{ width: `${w as number}%`, background: (w as number) === 100 ? GK.green : "#4ade80" }} />
                </div>
              </div>
            ))}
          </div>

          <div className="mt-5 border-t border-white/10 pt-4">
            <div className="flex items-baseline justify-between">
              <span className="text-[0.74rem] font-semibold text-white/70">Indicative cost</span>
              <motion.span key={Math.round(cost)} initial={{ opacity: 0.5 }} animate={{ opacity: 1 }} className="font-display text-2xl font-bold tabular-nums text-white">{money(cost)}</motion.span>
            </div>
            {paid > 0 && <p className="mt-1.5 text-right text-[0.62rem]" style={{ color: GK.green }}>{money(saved)} offset by carbon already priced at origin</p>}
          </div>
          <p className="mt-4 text-[0.58rem] leading-relaxed text-white/35">A simplified model for orientation. Actual liabilities depend on verified embedded emissions, the applicable free-allocation adjustment, and the rules in force at the time.</p>
        </div>
      </div>
    </div>
  );
}

/* ============================================================
   IMPORT FLOW, a small, continuously animated pipeline.
   ============================================================ */
const STEPS: [string, string][] = [
  ["Supplier data", "Installation-level embedded emissions collected from the producer."],
  ["Declaration", "Goods, quantities, and embedded emissions compiled per import."],
  ["Verification", "Emissions data checked by an accredited verifier."],
  ["Certificates", "Certificates surrendered against the declared emissions."],
];
export function ImportFlow() {
  const [i, setI] = useState(0);
  return (
    <div>
      <ol className="grid gap-4 lg:grid-cols-4">
        {STEPS.map(([t, d], k) => {
          const on = k === i;
          return (
            <li key={t}>
              <button onPointerEnter={() => setI(k)} onFocus={() => setI(k)} onClick={() => setI(k)} aria-pressed={on}
                className="h-full w-full rounded-2xl border p-5 text-left transition-all focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#16a34a]"
                style={{ background: on ? "#0d1411" : "#fff", borderColor: on ? "transparent" : "#e6ece7", transform: on ? "translateY(-4px)" : "none" }}>
                <div className="flex items-center gap-2">
                  <span className="grid h-7 w-7 place-items-center rounded-full font-mono text-[0.62rem] font-bold" style={{ background: on ? GK.green : "#f1f4f2", color: on ? "#0d1411" : MUTED }}>{k + 1}</span>
                  {k < STEPS.length - 1 && <span className="h-px flex-1" style={{ background: on ? "rgba(255,255,255,0.2)" : "#e6ece7" }} />}
                </div>
                <h3 className="mt-3.5 font-display text-[0.95rem] font-bold" style={{ color: on ? "#fff" : INK }}>{t}</h3>
                <p className="mt-1.5 text-[0.8rem] leading-relaxed" style={{ color: on ? "rgba(255,255,255,0.62)" : MUTED }}>{d}</p>
              </button>
            </li>
          );
        })}
      </ol>
    </div>
  );
}
