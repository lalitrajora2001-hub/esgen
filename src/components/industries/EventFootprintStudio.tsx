"use client";

import { useMemo, useState } from "react";
import { motion, useReducedMotion } from "framer-motion";

/* ============================================================
   EVENT FOOTPRINT STUDIO
   A live, illustrative model of an event's footprint. Move the
   controls and the whole picture recomposes: totals, the category
   bar, and the per-attendee figure. Monochrome, white and black.

   The factors are deliberately rounded and labelled illustrative.
   The point is intuition: travel dominates, menus matter, and the
   footprint is decided by choices made in planning.
   ============================================================ */

const INK = "#101318";
const MUTED = "#565d68";
const FAINT = "#8a919c";
const LINE = "#e6e8ec";
const WASH = "#f4f5f7";

/* Illustrative factors, kg CO2e */
const F = {
  flyer: 400,          // per attendee arriving by air (round trip, averaged)
  ground: 20,          // per attendee arriving by road or rail
  cateringPerDay: { plant: 4, mixed: 8, meat: 12 },
  venuePerDay: 6,      // venue energy per attendee-day
  wastePerDay: 1.5,    // waste per attendee-day
  freightShare: 0.15,  // build, freight and AV as a share of the on-site subtotal
};

type Menu = keyof typeof F.cateringPerDay;
const MENUS: { k: Menu; label: string }[] = [
  { k: "plant", label: "Plant-forward" },
  { k: "mixed", label: "Mixed menu" },
  { k: "meat", label: "Meat-heavy" },
];

/* Mono ramp, darkest = biggest story */
const SEGMENTS = [
  { k: "Attendee travel", c: "#101318" },
  { k: "Catering", c: "#3a414c" },
  { k: "Venue energy", c: "#6b7280" },
  { k: "Freight & build", c: "#9aa1ab" },
  { k: "Waste", c: "#c7ccd3" },
];

function Slider({ label, value, set, min, max, step, fmt }: { label: string; value: number; set: (n: number) => void; min: number; max: number; step: number; fmt: (n: number) => string }) {
  return (
    <div>
      <div className="flex items-baseline justify-between gap-2">
        <label className="text-[0.8rem] font-semibold" style={{ color: INK }}>{label}</label>
        <span className="shrink-0 font-mono text-[0.82rem] font-bold tabular-nums" style={{ color: INK }}>{fmt(value)}</span>
      </div>
      <input type="range" min={min} max={max} step={step} value={value} onChange={(e) => set(+e.target.value)} aria-label={label}
        className="mt-2 h-1.5 w-full cursor-ew-resize appearance-none rounded-full accent-[#101318]"
        style={{ background: `linear-gradient(90deg, ${INK} ${((value - min) / (max - min)) * 100}%, ${LINE} 0)` }} />
    </div>
  );
}

export function EventFootprintStudio() {
  const reduce = useReducedMotion();
  const [attendees, setAttendees] = useState(2500);
  const [days, setDays] = useState(2);
  const [airPct, setAirPct] = useState(15);
  const [menu, setMenu] = useState<Menu>("mixed");

  const model = useMemo(() => {
    const flyers = attendees * (airPct / 100);
    const grounded = attendees - flyers;
    const travel = flyers * F.flyer + grounded * F.ground;
    const catering = attendees * days * F.cateringPerDay[menu];
    const venue = attendees * days * F.venuePerDay;
    const waste = attendees * days * F.wastePerDay;
    const freight = (catering + venue) * F.freightShare + travel * 0.02;
    const total = travel + catering + venue + waste + freight;
    const parts = [travel, catering, venue, freight, waste];
    return {
      totalT: total / 1000,
      perHead: total / attendees,
      parts,
      pct: parts.map((p) => (p / total) * 100),
    };
  }, [attendees, days, airPct, menu]);

  return (
    <div className="overflow-hidden rounded-3xl border bg-white shadow-[0_28px_70px_-38px_rgba(16,19,24,0.35)]" style={{ borderColor: LINE }}>
      {/* ambient: attendees converging on the venue */}
      <div className="relative border-b" style={{ borderColor: "#eceef1" }}>
        <svg viewBox="0 0 800 96" className="h-20 w-full sm:h-24" preserveAspectRatio="xMidYMid slice" aria-hidden>
          {[
            "M-20 20 C 200 30, 330 44, 398 50",
            "M-20 88 C 220 80, 330 60, 398 52",
            "M820 16 C 600 28, 470 44, 402 50",
            "M820 92 C 590 84, 470 60, 402 52",
          ].map((d, i) => (
            <g key={i}>
              <path d={d} fill="none" stroke={LINE} strokeWidth="1.4" strokeDasharray="3 6" />
              {!reduce && <circle r="3" fill={INK}><animateMotion dur={`${5 + i * 1.7}s`} begin={`${i * 0.9}s`} repeatCount="indefinite" path={d} /></circle>}
              {!reduce && <circle r="2" fill={FAINT}><animateMotion dur={`${6.5 + i * 1.3}s`} begin={`${1.8 + i * 1.1}s`} repeatCount="indefinite" path={d} /></circle>}
            </g>
          ))}
          <circle cx="400" cy="51" r="10" fill="none" stroke={INK} strokeWidth="1.5" />
          <circle cx="400" cy="51" r="3.5" fill={INK} />
          {!reduce && <circle cx="400" cy="51" r="10" fill="none" stroke={INK} strokeWidth="1">
            <animate attributeName="r" values="10;22" dur="2.6s" repeatCount="indefinite" />
            <animate attributeName="stroke-opacity" values="0.5;0" dur="2.6s" repeatCount="indefinite" />
          </circle>}
        </svg>
        <span className="absolute left-6 top-3 font-mono text-[0.62rem] uppercase tracking-[0.16em]" style={{ color: FAINT }}>Model your event</span>
        <span className="absolute right-6 top-3 rounded-full px-2.5 py-1 text-[0.6rem] font-bold text-white" style={{ background: INK }}>illustrative</span>
      </div>

      <div className="grid lg:grid-cols-[0.95fr_1.05fr]">
        {/* controls */}
        <div className="space-y-6 border-b p-6 sm:p-7 lg:border-b-0 lg:border-r" style={{ borderColor: "#eceef1" }}>
          <Slider label="Attendees" value={attendees} set={setAttendees} min={100} max={20000} step={100} fmt={(n) => n.toLocaleString("en-GB")} />
          <div>
            <span className="text-[0.8rem] font-semibold" style={{ color: INK }}>Event length</span>
            <div className="mt-2 flex gap-1 rounded-xl border p-1" style={{ borderColor: LINE, background: "#fbfbfc" }}>
              {[1, 2, 3, 4, 5].map((d) => (
                <button key={d} onClick={() => setDays(d)} aria-pressed={days === d}
                  className="relative flex-1 rounded-lg py-2 text-[0.78rem] font-bold transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-[#101318]"
                  style={{ color: days === d ? "#fff" : MUTED }}>
                  {days === d && <motion.span layoutId="daypill" className="absolute inset-0 rounded-lg" style={{ background: INK }} transition={{ type: "spring", stiffness: 420, damping: 34 }} />}
                  <span className="relative">{d}{d === 1 ? " day" : ""}</span>
                </button>
              ))}
            </div>
          </div>
          <Slider label="Arriving by air" value={airPct} set={setAirPct} min={0} max={60} step={1} fmt={(n) => `${n}%`} />
          <div>
            <span className="text-[0.8rem] font-semibold" style={{ color: INK }}>Catering</span>
            <div className="mt-2 flex gap-1 rounded-xl border p-1" style={{ borderColor: LINE, background: "#fbfbfc" }}>
              {MENUS.map((m) => (
                <button key={m.k} onClick={() => setMenu(m.k)} aria-pressed={menu === m.k}
                  className="relative flex-1 rounded-lg py-2 text-[0.74rem] font-bold transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-[#101318]"
                  style={{ color: menu === m.k ? "#fff" : MUTED }}>
                  {menu === m.k && <motion.span layoutId="menupill" className="absolute inset-0 rounded-lg" style={{ background: INK }} transition={{ type: "spring", stiffness: 420, damping: 34 }} />}
                  <span className="relative">{m.label}</span>
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* results */}
        <div className="p-6 sm:p-7">
          <div className="flex flex-wrap items-end justify-between gap-4">
            <div>
              <div className="font-mono text-[0.6rem] uppercase tracking-[0.14em]" style={{ color: FAINT }}>Modelled footprint</div>
              <div className="flex items-end gap-2">
                <motion.span key={model.totalT.toFixed(1)} initial={{ opacity: 0.4, y: -4 }} animate={{ opacity: 1, y: 0 }}
                  className="font-display text-5xl font-bold tabular-nums leading-none" style={{ color: INK }}>
                  {model.totalT >= 100 ? Math.round(model.totalT).toLocaleString("en-GB") : model.totalT.toFixed(1)}
                </motion.span>
                <span className="pb-1 text-sm font-bold" style={{ color: MUTED }}>tCO₂e</span>
              </div>
            </div>
            <div className="text-right">
              <div className="font-mono text-[0.6rem] uppercase tracking-[0.14em]" style={{ color: FAINT }}>Per attendee</div>
              <motion.div key={Math.round(model.perHead)} initial={{ opacity: 0.4 }} animate={{ opacity: 1 }}
                className="font-display text-2xl font-bold tabular-nums" style={{ color: INK }}>
                {Math.round(model.perHead)} <span className="text-sm">kg</span>
              </motion.div>
            </div>
          </div>

          {/* live stacked bar */}
          <div className="mt-6 flex h-11 w-full overflow-hidden rounded-lg" style={{ background: "#eef0f3" }}>
            {SEGMENTS.map((s, i) => (
              <div key={s.k} className="h-full motion-safe:transition-[width] motion-safe:duration-500 motion-safe:ease-out"
                style={{ width: `${model.pct[i]}%`, background: s.c }} title={s.k} />
            ))}
          </div>

          <div className="mt-4 space-y-1.5">
            {SEGMENTS.map((s, i) => (
              <div key={s.k} className="flex items-center gap-3 text-[0.82rem]">
                <span className="h-2.5 w-2.5 shrink-0 rounded-sm" style={{ background: s.c }} />
                <span className="min-w-0 flex-1" style={{ color: INK }}>{s.k}</span>
                <span className="font-mono text-[0.74rem] tabular-nums" style={{ color: MUTED }}>{(model.parts[i] / 1000).toFixed(1)} t</span>
                <span className="w-12 text-right font-mono text-[0.74rem] tabular-nums" style={{ color: FAINT }}>{model.pct[i].toFixed(0)}%</span>
              </div>
            ))}
          </div>

          <p className="mt-5 border-t pt-3 text-[0.66rem] leading-relaxed" style={{ borderColor: "#eceef1", color: FAINT }}>
            An intuition tool with rounded, illustrative factors, not a measurement. Real events are measured from registrations, meters, and invoices, which is what ESGen does.
          </p>
        </div>
      </div>
    </div>
  );
}
