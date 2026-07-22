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

/* ================= HERO VISUAL: value-chain consolidation funnel =========
   Many suppliers on the right stream emissions data leftward through tiers
   into one ESGen hub. Tells the real story of the page: consolidate a
   scattered value chain into a single measured footprint. */
const spin = { transformBox: "fill-box", transformOrigin: "center" } as const;

/* The hero masks the visual's left edge, so the hub sits on the right (fully
   visible) and the supplier tiers recede leftward into the fade, reading as a
   value chain fading into distance. Data flows left to right into the hub. */
const HUB = { x: 470, y: 250 };
/* Tier A closest to the hub carries a live "engaged %" ring. */
const TIER_A = [{ x: 330, y: 168, pct: 88 }, { x: 330, y: 250, pct: 62 }, { x: 330, y: 332, pct: 77 }];
const TIER_B = [{ x: 200, y: 126 }, { x: 200, y: 208 }, { x: 200, y: 292 }, { x: 200, y: 376 }];
const TIER_C = [{ x: 78, y: 94 }, { x: 78, y: 172 }, { x: 78, y: 250 }, { x: 78, y: 330 }, { x: 78, y: 408 }];

/* Data flows child -> parent (left to right, toward the hub). */
const link = (x1: number, y1: number, x2: number, y2: number) => {
  const mx = (x1 + x2) / 2;
  return `M${x1} ${y1} C ${mx} ${y1}, ${mx} ${y2}, ${x2} ${y2}`;
};
const P = [CK.blue, CK.navy, CK.blue2, CK.teal];
const EDGES: { d: string; dur: number; begin: number; c: string }[] = (() => {
  const raw: [{ x: number; y: number }, { x: number; y: number }][] = [
    [TIER_C[0], TIER_B[0]], [TIER_C[1], TIER_B[1]], [TIER_C[2], TIER_B[1]], [TIER_C[3], TIER_B[2]], [TIER_C[4], TIER_B[3]],
    [TIER_B[0], TIER_A[0]], [TIER_B[1], TIER_A[1]], [TIER_B[2], TIER_A[1]], [TIER_B[3], TIER_A[2]],
    [TIER_A[0], HUB], [TIER_A[1], HUB], [TIER_A[2], HUB],
  ];
  return raw.map(([a, b], i) => ({ d: link(a.x, a.y, b.x, b.y), dur: 3.4 + (i % 4) * 0.5, begin: +(i * 0.34).toFixed(2), c: P[i % P.length] }));
})();

function ChainNode({ x, y, r, ring, delay, inView }: { x: number; y: number; r: number; ring: string; delay: number; inView: boolean }) {
  return (
    <motion.g style={spin} initial={{ opacity: 0, scale: 0 }} animate={inView ? { opacity: 1, scale: 1 } : {}} transition={{ duration: 0.5, delay, ease: "backOut" }}>
      <circle cx={x} cy={y} r={r} fill="#ffffff" filter="url(#scnShadow)" />
      <circle cx={x} cy={y} r={r} fill="none" stroke={ring} strokeOpacity="0.85" strokeWidth="1.5" />
      <circle cx={x} cy={y} r={r * 0.34} fill={ring} fillOpacity="0.9" />
    </motion.g>
  );
}

export function SupplyChainNetwork() {
  const { ref, inView } = useReveal();
  const reduce = useReducedMotion();
  const R = 15; // response-ring radius on tier-A nodes
  const CIRC = 2 * Math.PI * R;

  return (
    <div ref={ref} className="relative w-full" style={{ aspectRatio: "31 / 25" }}>
      <svg viewBox="0 0 620 500" className="absolute inset-0 h-full w-full">
        <defs>
          <radialGradient id="scnGlow"><stop offset="0%" stopColor={CK.blue} stopOpacity="0.28" /><stop offset="100%" stopColor={CK.blue} stopOpacity="0" /></radialGradient>
          <linearGradient id="scnLink" x1="0" y1="0" x2="1" y2="0">
            <stop offset="0%" stopColor="#cdd8ef" /><stop offset="100%" stopColor={CK.blue} stopOpacity="0.7" />
          </linearGradient>
          <filter id="scnShadow" x="-60%" y="-60%" width="220%" height="220%"><feDropShadow dx="0" dy="3" stdDeviation="5" floodColor="#12224f" floodOpacity="0.16" /></filter>
          <filter id="scnBlur" x="-150%" y="-150%" width="400%" height="400%"><feGaussianBlur stdDeviation="2.5" /></filter>
        </defs>

        <circle cx={HUB.x} cy={HUB.y} r="150" fill="url(#scnGlow)" />
        <motion.circle cx={HUB.x} cy={HUB.y} r="112" fill="none" stroke={CK.blue} strokeOpacity="0.12" strokeWidth="1" strokeDasharray="2 12" style={spin}
          animate={reduce ? undefined : { rotate: 360 }} transition={{ duration: 120, repeat: Infinity, ease: "linear" }} />

        {/* links draw in on reveal */}
        {EDGES.map((e, i) => (
          <motion.path key={"e" + i} d={e.d} fill="none" stroke="url(#scnLink)" strokeWidth="1.5" strokeLinecap="round"
            initial={{ pathLength: 0, opacity: 0 }} animate={inView ? { pathLength: 1, opacity: 1 } : {}} transition={{ duration: 0.9, delay: 0.1 + i * 0.05, ease: "easeInOut" }} />
        ))}

        {/* data packets streaming toward the hub */}
        {!reduce && EDGES.map((e, i) => (
          <g key={"p" + i}>
            <rect x="-3" y="-3" width="6" height="6" rx="1.6" fill={e.c} opacity="0.22" filter="url(#scnBlur)">
              <animateMotion dur={`${e.dur}s`} begin={`${e.begin}s`} repeatCount="indefinite" path={e.d} rotate="auto" />
            </rect>
            <rect x="-2.4" y="-2.4" width="4.8" height="4.8" rx="1.3" fill={e.c}>
              <animateMotion dur={`${e.dur}s`} begin={`${e.begin}s`} repeatCount="indefinite" path={e.d} rotate="auto" />
              <animate attributeName="opacity" values="0;1;1;0" keyTimes="0;0.12;0.82;1" dur={`${e.dur}s`} begin={`${e.begin}s`} repeatCount="indefinite" />
            </rect>
          </g>
        ))}

        {/* supplier tiers */}
        {TIER_C.map((n, i) => <ChainNode key={"c" + i} x={n.x} y={n.y} r={7} ring={CK.blue3} delay={0.28 + i * 0.05} inView={inView} />)}
        {TIER_B.map((n, i) => <ChainNode key={"b" + i} x={n.x} y={n.y} r={9} ring={CK.blue2} delay={0.4 + i * 0.05} inView={inView} />)}

        {/* tier A: node + live engaged-% ring */}
        {TIER_A.map((n, i) => (
          <motion.g key={"a" + i} style={spin} initial={{ opacity: 0, scale: 0 }} animate={inView ? { opacity: 1, scale: 1 } : {}} transition={{ duration: 0.5, delay: 0.55 + i * 0.08, ease: "backOut" }}>
            <circle cx={n.x} cy={n.y} r={R} fill="none" stroke="#e7ebf3" strokeWidth="3" />
            <motion.circle cx={n.x} cy={n.y} r={R} fill="none" stroke={CK.blue} strokeWidth="3" strokeLinecap="round"
              transform={`rotate(-90 ${n.x} ${n.y})`} strokeDasharray={CIRC}
              initial={{ strokeDashoffset: CIRC }} animate={inView ? { strokeDashoffset: CIRC * (1 - n.pct / 100) } : {}}
              transition={{ duration: 1.1, delay: 0.7 + i * 0.12, ease: [0.16, 1, 0.3, 1] }} />
            <circle cx={n.x} cy={n.y} r="8" fill="#ffffff" filter="url(#scnShadow)" />
            <circle cx={n.x} cy={n.y} r="3.4" fill={CK.blue} />
          </motion.g>
        ))}

        {/* hub */}
        <motion.circle cx={HUB.x} cy={HUB.y} r="66" fill="url(#scnGlow)" style={spin} animate={reduce ? undefined : { scale: [1, 1.14, 1], opacity: [0.55, 0.95, 0.55] }} transition={{ duration: 3.2, repeat: Infinity, ease: "easeInOut" }} />
        {!reduce && <motion.circle cx={HUB.x} cy={HUB.y} r="50" fill="none" stroke={CK.blue} strokeWidth="1.4"
          animate={{ r: [50, 78], opacity: [0.5, 0] }} transition={{ duration: 3.2, repeat: Infinity, ease: "easeOut" }} />}
        <motion.g style={spin} initial={{ scale: 0 }} animate={inView ? { scale: 1 } : {}} transition={{ duration: 0.55, delay: 0.15, ease: "backOut" }}>
          <circle cx={HUB.x} cy={HUB.y} r="50" fill="#ffffff" filter="url(#scnShadow)" />
          <circle cx={HUB.x} cy={HUB.y} r="50" fill="none" stroke={CK.blue} strokeOpacity="0.22" strokeWidth="1.6" />
          {/* ESGen mark, embedded in-SVG so it stays perfectly centred on the hub */}
          <foreignObject x={HUB.x - 29} y={HUB.y - 20.6} width={58} height={41.2}>
            <EsgenMark color="#111827" className="h-full w-full" />
          </foreignObject>
        </motion.g>
      </svg>
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

/* ---------- supplier hierarchy ---------- */

const TREE: { region: string; flag: string; total: string; suppliers: { name: string; t: number; pct: number }[] }[] = [
  {
    region: "United Kingdom",
    flag: "GB",
    total: "18,240",
    suppliers: [
      { name: "Steel components", t: 9840, pct: 82 },
      { name: "Packaging", t: 5120, pct: 46 },
      { name: "Inbound logistics", t: 3280, pct: 29 },
    ],
  },
  {
    region: "France",
    flag: "FR",
    total: "11,460",
    suppliers: [
      { name: "Aluminium castings", t: 6310, pct: 58 },
      { name: "Electronics", t: 3290, pct: 31 },
      { name: "Contract assembly", t: 1860, pct: 18 },
    ],
  },
];

function SupplierCard({ s, play, delay }: { s: { name: string; t: number; pct: number }; play: boolean; delay: number }) {
  return (
    <motion.div
      className="rounded-xl border border-[#e5eaf3] bg-white p-3 shadow-[0_8px_20px_-16px_rgba(15,23,42,0.5)]"
      initial={{ opacity: 0, y: 10 }}
      animate={play ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.42, delay, ease: [0.16, 1, 0.3, 1] }}
    >
      <div className="flex items-baseline justify-between gap-2">
        <span className="truncate text-[0.72rem] font-semibold" style={{ color: "#12224f" }}>{s.name}</span>
        <span className="shrink-0 font-mono text-[0.66rem]" style={{ color: "#5b6472" }}>
          <Count to={s.t} play={play} /> t
        </span>
      </div>
      <div className="mt-2 h-1.5 overflow-hidden rounded-full bg-[#eef2fb]">
        <motion.div
          className="h-full rounded-full"
          style={{ background: "#2f6fe0" }}
          initial={{ width: 0 }}
          animate={play ? { width: `${s.pct}%` } : {}}
          transition={{ duration: 0.8, delay: delay + 0.12, ease: "easeOut" }}
        />
      </div>
    </motion.div>
  );
}

/**
 * Supplier hierarchy: parent company, its sourcing regions, and the supplier
 * groups underneath each. Connectors are plain borders so the tree stays put at
 * any width. Figures are illustrative.
 */
export function SupplierHierarchy() {
  const { ref, inView } = useReveal();

  return (
    <div ref={ref} className="w-full rounded-2xl border border-[#e5eaf3] bg-[#f8fafc] p-5 sm:p-6">
      {/* Root */}
      <motion.div
        className="mx-auto w-fit rounded-xl border border-[#e5eaf3] bg-white px-5 py-3 text-center shadow-[0_12px_28px_-20px_rgba(15,23,42,0.55)]"
        initial={{ opacity: 0, y: -8 }}
        animate={inView ? { opacity: 1, y: 0 } : {}}
        transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
      >
        <div className="flex items-center justify-center gap-2">
          <EsgenMark className="h-4 w-4" />
          <span className="font-display text-sm font-bold" style={{ color: "#12224f" }}>Your company</span>
        </div>
        <p className="mt-1 font-mono text-[0.68rem]" style={{ color: "#5b6472" }}>
          <Count to={29700} play={inView} /> tCO<sub>2</sub>e purchased goods
        </p>
      </motion.div>

      {/* Trunk */}
      <div className="mx-auto h-5 w-px" style={{ background: "#d6deeb" }} />

      {/* Branch bar across the two regions */}
      <div className="grid grid-cols-2">
        <div className="h-px justify-self-end" style={{ width: "50%", background: "#d6deeb" }} />
        <div className="h-px justify-self-start" style={{ width: "50%", background: "#d6deeb" }} />
      </div>

      <div className="grid grid-cols-2 gap-4 sm:gap-5">
        {TREE.map((r, ri) => (
          <div key={r.region} className="flex flex-col items-center">
            <div className="h-5 w-px" style={{ background: "#d6deeb" }} />
            <motion.div
              className="w-full rounded-xl border border-[#e5eaf3] bg-white px-3 py-2.5 text-center"
              initial={{ opacity: 0, y: 8 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.4, delay: 0.16 + ri * 0.08, ease: [0.16, 1, 0.3, 1] }}
            >
              <div className="flex items-center justify-center gap-1.5">
                <span className="rounded border border-[#e5eaf3] px-1 font-mono text-[0.58rem] font-bold" style={{ color: "#2f6fe0" }}>{r.flag}</span>
                <span className="text-[0.74rem] font-semibold" style={{ color: "#12224f" }}>{r.region}</span>
              </div>
              <p className="mt-0.5 font-mono text-[0.64rem]" style={{ color: "#5b6472" }}>{r.total} t</p>
            </motion.div>

            <div className="h-4 w-px" style={{ background: "#d6deeb" }} />

            <div className="w-full space-y-2 border-l-0 pl-0">
              {r.suppliers.map((s, si) => (
                <SupplierCard key={s.name} s={s} play={inView} delay={0.3 + ri * 0.06 + si * 0.09} />
              ))}
            </div>
          </div>
        ))}
      </div>

      <p className="mt-4 text-center font-mono text-[0.6rem]" style={{ color: "#8b93a1" }}>
        Illustrative supplier structure
      </p>
    </div>
  );
}
