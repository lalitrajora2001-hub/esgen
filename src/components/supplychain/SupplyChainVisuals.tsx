"use client";

import { motion, useReducedMotion } from "framer-motion";
import { CK, Count, EsgenMark, LiveTag, useReveal } from "@/components/whiteui/kit";

/* Original ESGen supply-chain product mockups. All figures and supplier names
   are illustrative. Charts assemble on scroll-in with some continuous motion. */

/* ---------- shared donut ---------- */
function Donut({ segs, play, size = 70 }: { segs: [number, string][]; play: boolean; size?: number }) {
  let acc = 0;
  return (
    <svg viewBox="0 0 80 80" style={{ width: size, height: size }}>
      <circle cx="40" cy="40" r="28" fill="none" stroke="#eef2fb" strokeWidth="11" />
      {segs.map(([v, c], i) => {
        const off = -acc; acc += v;
        return (
          <motion.circle key={i} cx="40" cy="40" r="28" fill="none" stroke={c} strokeWidth="11" pathLength={100}
            strokeDasharray={`${v} 100`} transform="rotate(-90 40 40)"
            initial={{ strokeDashoffset: 100 - off - v }} animate={play ? { strokeDashoffset: off } : {}}
            transition={{ duration: 0.9, delay: 0.15 + i * 0.12, ease: [0.16, 1, 0.3, 1] }} />
        );
      })}
    </svg>
  );
}

/* ================= HERO VISUAL: living supplier network with flowing emissions ========= */
const ICONS = [
  "M4 20V9l5 3V9l5 3V6h6v14z",                 // factory
  "M3 8h9v8H3zM12 11h4l3 3v2h-7z",              // truck
  "M12 3l8 4v9l-8 4-8-4V7z",                    // box
  "M5 19C5 11 11 6 20 5c0 8-6 14-15 14z",       // leaf
  "M13 3l-8 11h6l-2 7 8-11h-6z",                // bolt
  "M4 14h16l-2 6H6zM12 5v9M8 9h8",              // ship
  "M6 21V4h8v17M14 10h4v11",                    // building
  "M8 7l3-4 3 4M18 12l1 4-4 1M8 20l-4-2 1-4",   // recycle
  "M9 4v5M15 4v5M7 9h10v2a5 5 0 01-10 0zM12 16v4", // plug
];
const HUB = { x: 300, y: 250 };
const spin = { transformBox: "fill-box", transformOrigin: "center" } as const;

const NODES = (() => {
  const cats = [CK.blue, CK.navy, CK.teal, "#3f6fb8", CK.green, "#7b6bd0", CK.amber];
  const N = 7, RX = 205, RY = 152;
  return Array.from({ length: N }, (_, i) => {
    const a = (-90 + i * (360 / N)) * (Math.PI / 180);
    const x = HUB.x + RX * Math.cos(a), y = HUB.y + RY * Math.sin(a);
    const mx = (x + HUB.x) / 2, my = (y + HUB.y) / 2, dx = HUB.x - x, dy = HUB.y - y, L = Math.hypot(dx, dy) || 1;
    const off = (i % 2 ? 1 : -1) * 26;
    const cx = mx + (-dy / L) * off, cy = my + (dx / L) * off;
    const path = `M${x.toFixed(1)} ${y.toFixed(1)} Q${cx.toFixed(1)} ${cy.toFixed(1)} ${HUB.x} ${HUB.y}`;
    return { x: +x.toFixed(1), y: +y.toFixed(1), c: cats[i % cats.length], icon: ICONS[i % ICONS.length], path, dur: 3.2 + (i % 3) * 0.6, begin: (i * 0.5).toFixed(2) };
  });
})();

export function SupplyChainNetwork() {
  const { ref, inView } = useReveal();
  const reduce = useReducedMotion();
  return (
    <div ref={ref} className="relative w-full" style={{ aspectRatio: "6 / 5" }}>
      <svg viewBox="0 0 600 500" className="absolute inset-0 h-full w-full">
        <defs>
          <radialGradient id="scnGlow"><stop offset="0%" stopColor={CK.blue} stopOpacity="0.26" /><stop offset="100%" stopColor={CK.blue} stopOpacity="0" /></radialGradient>
          <filter id="scnShadow" x="-60%" y="-60%" width="220%" height="220%"><feDropShadow dx="0" dy="3" stdDeviation="5" floodColor="#12224f" floodOpacity="0.16" /></filter>
          <filter id="scnBlur" x="-150%" y="-150%" width="400%" height="400%"><feGaussianBlur stdDeviation="3" /></filter>
        </defs>

        <circle cx={HUB.x} cy={HUB.y} r="215" fill="url(#scnGlow)" />

        {/* subtle rotating dashed halo */}
        <motion.circle cx={HUB.x} cy={HUB.y} r="198" fill="none" stroke={CK.blue} strokeOpacity="0.1" strokeWidth="1" strokeDasharray="2 13" style={spin}
          animate={reduce ? undefined : { rotate: 360 }} transition={{ duration: 130, repeat: Infinity, ease: "linear" }} />

        {/* curved links */}
        {NODES.map((n, i) => (
          <motion.path key={"e" + i} d={n.path} fill="none" stroke="#b7c6e6" strokeWidth="1.4" strokeLinecap="round"
            initial={{ pathLength: 0, opacity: 0 }} animate={inView ? { pathLength: 1, opacity: 1 } : {}} transition={{ duration: 0.95, delay: 0.15 + i * 0.08, ease: "easeInOut" }} />
        ))}

        {/* slow particles streaming into the hub */}
        {!reduce && NODES.map((n, i) => (
          <g key={"p" + i}>
            <circle r="6" fill={n.c} opacity="0.26" filter="url(#scnBlur)">
              <animateMotion dur={`${n.dur}s`} begin={`${n.begin}s`} repeatCount="indefinite" path={n.path} />
              <animate attributeName="opacity" values="0;0.3;0.3;0" keyTimes="0;0.15;0.8;1" dur={`${n.dur}s`} begin={`${n.begin}s`} repeatCount="indefinite" />
            </circle>
            <circle r="2.8" fill={n.c}>
              <animateMotion dur={`${n.dur}s`} begin={`${n.begin}s`} repeatCount="indefinite" path={n.path} />
              <animate attributeName="opacity" values="0;1;1;0" keyTimes="0;0.15;0.8;1" dur={`${n.dur}s`} begin={`${n.begin}s`} repeatCount="indefinite" />
            </circle>
          </g>
        ))}

        {/* nodes: clean white discs, thin ring, subtle icon */}
        {NODES.map((n, i) => (
          <motion.g key={"n" + i} style={spin} initial={{ opacity: 0, scale: 0 }} animate={inView ? { opacity: 1, scale: 1 } : {}} transition={{ duration: 0.5, delay: 0.3 + i * 0.08, ease: "backOut" }}>
            <circle cx={n.x} cy={n.y} r="26" fill="#ffffff" filter="url(#scnShadow)" />
            <circle cx={n.x} cy={n.y} r="26" fill="none" stroke={n.c} strokeOpacity="0.85" strokeWidth="1.6" />
            <svg x={n.x - 12} y={n.y - 12} width="24" height="24" viewBox="0 0 24 24" fill="none" stroke={n.c} strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round"><path d={n.icon} /></svg>
          </motion.g>
        ))}

        {/* hub */}
        <motion.circle cx={HUB.x} cy={HUB.y} r="72" fill="url(#scnGlow)" style={spin} animate={reduce ? undefined : { scale: [1, 1.12, 1], opacity: [0.6, 0.95, 0.6] }} transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }} />
        <motion.g style={spin} initial={{ scale: 0 }} animate={inView ? { scale: 1 } : {}} transition={{ duration: 0.55, delay: 0.1, ease: "backOut" }}>
          <circle cx={HUB.x} cy={HUB.y} r="52" fill="#ffffff" filter="url(#scnShadow)" />
          <circle cx={HUB.x} cy={HUB.y} r="52" fill="none" stroke={CK.blue} strokeOpacity="0.2" strokeWidth="1.6" />
        </motion.g>
      </svg>

      {/* hub ESGen mark (black), scales with the disc */}
      <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2" style={{ width: "9.5%", aspectRatio: "529 / 375" }}>
        <EsgenMark color="#111827" className="h-full w-full" />
      </div>
    </div>
  );
}

/* ================= SUPPLIERS BOARD ============= */
function Chip({ level }: { level: "Medium" | "High" }) {
  const c = level === "High" ? { bg: "#fdece7", fg: CK.orange } : { bg: "#fbf3dd", fg: "#a97a12" };
  return <span className="rounded px-1.5 py-0.5 text-[0.55rem] font-semibold" style={{ background: c.bg, color: c.fg }}>{level}</span>;
}

export function SuppliersBoard() {
  const { ref, inView } = useReveal();
  const rows: [string, "Medium" | "High", number, string, string, string][] = [
    ["Northgate Components", "Medium", 62, "19%", "2030", "Manufacturing"],
    ["Skyline Freight", "Medium", 44, "7.9%", "None", "Logistics"],
    ["Vertex Materials", "High", 30, "5.5%", "None", "Materials"],
    ["Orbit Services", "High", 22, "3.8%", "None", "Services"],
  ];
  return (
    <div ref={ref} className="overflow-hidden rounded-2xl border border-[#e7ebf3] bg-white p-4 shadow-[0_30px_60px_-30px_rgba(11,26,74,0.3)]">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2"><EsgenMark color={CK.navy} className="h-5 w-6" /><span className="font-display text-base font-bold" style={{ color: CK.navy }}>Suppliers</span></div>
        <LiveTag />
      </div>
      <div className="mt-3 grid grid-cols-2 gap-3">
        {[["Emissions by climate progress", [[38, CK.blue], [30, CK.blue2], [20, CK.blue3], [12, "#dce4f5"]] as [number, string][], ["Disclosed & set", "Disclosed", "Not started", "Unknown"]],
          ["Emissions by SBTi status", [[34, CK.green], [28, "#57b877"], [24, "#9fd6b0"], [14, "#e0efe4"]] as [number, string][], ["Approved", "Committed", "None", "Unknown"]]].map(([title, segs, labels]) => (
          <div key={title as string} className="rounded-lg border border-[#eef1f6] p-2.5">
            <div className="text-[0.6rem] font-semibold" style={{ color: CK.navy }}>{title as string}</div>
            <div className="mt-1 flex items-center gap-2">
              <Donut play={inView} size={54} segs={segs as [number, string][]} />
              <ul className="space-y-0.5 text-[0.5rem]" style={{ color: CK.muted }}>
                {(labels as string[]).map((l, i) => <li key={l} className="flex items-center gap-1"><span className="h-1.5 w-1.5 rounded-full" style={{ background: (segs as [number, string][])[i][1] }} />{l}</li>)}
              </ul>
            </div>
          </div>
        ))}
      </div>
      <div className="mt-3 overflow-hidden rounded-lg border border-[#eef1f6]">
        <div className="grid grid-cols-[1.5fr_0.8fr_1fr_0.7fr_0.7fr] border-b border-[#eef1f6] bg-[#fafbfe] px-3 py-1.5 text-[0.52rem] font-semibold uppercase tracking-wide" style={{ color: CK.muted }}>
          <span>Supplier</span><span>Priority</span><span>Spend</span><span>Emissions</span><span>Net zero</span>
        </div>
        {rows.map((r, i) => (
          <motion.div key={r[0]} className="grid grid-cols-[1.5fr_0.8fr_1fr_0.7fr_0.7fr] items-center border-b border-[#f2f4f8] px-3 py-2 last:border-0"
            initial={{ opacity: 0, x: -8 }} animate={inView ? { opacity: 1, x: 0 } : {}} transition={{ duration: 0.4, delay: 0.3 + i * 0.1 }}>
            <span className="text-[0.62rem] font-medium" style={{ color: CK.navy }}>{r[0]}</span>
            <span><Chip level={r[1]} /></span>
            <span className="pr-3"><span className="block h-1.5 overflow-hidden rounded-full" style={{ background: "#eef1f6" }}><motion.span className="block h-full" style={{ background: CK.blue2 }} initial={{ width: 0 }} animate={inView ? { width: `${r[2]}%` } : {}} transition={{ duration: 0.8, delay: 0.4 + i * 0.1 }} /></span></span>
            <span className="text-[0.6rem] font-semibold" style={{ color: CK.blue }}>{r[3]}</span>
            <span className="text-[0.58rem]" style={{ color: CK.muted }}>{r[4]}</span>
          </motion.div>
        ))}
      </div>
    </div>
  );
}

/* ================= SUPPLIER DETAIL ============= */
export function SupplierDetail() {
  const { ref, inView } = useReveal();
  const cats = [["Goods & Services", CK.green], ["Offices", CK.navy], ["Marketing", CK.orange], ["Employees", "#8aa0c8"], ["Travel", CK.sky], ["Other", CK.amber]] as const;
  const bars = [
    [30, 10, 14, 8, 12, 6], [26, 12, 10, 10, 8, 6], [22, 8, 12, 6, 10, 8], [18, 10, 8, 8, 6, 6], [14, 6, 8, 6, 6, 4], [12, 6, 6, 4, 6, 4],
  ];
  return (
    <div ref={ref} className="overflow-hidden rounded-2xl border border-[#e7ebf3] bg-white p-4 shadow-[0_30px_60px_-30px_rgba(11,26,74,0.3)]">
      <div className="flex items-center justify-between">
        <span className="font-display text-base font-bold" style={{ color: CK.navy }}>Supplier profile</span>
        <span className="text-[0.55rem] font-semibold uppercase tracking-wide" style={{ color: CK.muted }}>Illustrative</span>
      </div>
      <div className="mt-3 grid grid-cols-3 gap-2">
        {[["Total contribution", <Count key="a" to={908} play={inView} suffix=" tCO₂e" />], ["% of your emissions", <Count key="b" to={30} play={inView} suffix="%" />], ["Your spend (partial)", <Count key="c" to={50} play={inView} prefix="£" suffix="M" />]].map(([l, v]) => (
          <div key={l as string} className="rounded-lg border border-[#eef1f6] p-2.5">
            <div className="font-display text-base font-bold tabular-nums" style={{ color: CK.navy }}>{v}</div>
            <div className="mt-0.5 text-[0.52rem] uppercase tracking-wide" style={{ color: CK.blue }}>{l as string}</div>
          </div>
        ))}
      </div>
      <div className="mt-3 text-[0.6rem] font-semibold" style={{ color: CK.navy }}>Contribution to your footprint</div>
      <div className="mt-2 flex h-24 items-end justify-between gap-2">
        {bars.map((col, i) => {
          const tot = col.reduce((a, b) => a + b, 0);
          return (
            <div key={i} className="flex flex-1 flex-col items-center">
              <motion.div className="flex w-full max-w-6 flex-col-reverse overflow-hidden rounded-t-[2px]" initial={{ height: 0 }} animate={inView ? { height: `${tot}px` } : {}} transition={{ duration: 0.7, delay: 0.2 + i * 0.07, ease: [0.16, 1, 0.3, 1] }}>
                {col.map((seg, j) => <div key={j} style={{ height: `${seg}px`, background: cats[j][1] }} />)}
              </motion.div>
            </div>
          );
        })}
      </div>
      <ul className="mt-2 grid grid-cols-3 gap-x-2 gap-y-1 text-[0.5rem]" style={{ color: CK.muted }}>
        {cats.map(([l, c]) => <li key={l} className="flex items-center gap-1"><span className="h-1.5 w-1.5 rounded-full" style={{ background: c }} />{l}</li>)}
      </ul>
    </div>
  );
}
