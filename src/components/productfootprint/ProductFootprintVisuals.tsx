"use client";

import { motion } from "framer-motion";
import { CK, Count, EsgenMark, useReveal } from "@/components/whiteui/kit";

/* Original ESGen product-footprint mockups, styled after a feature-grid layout.
   Every product, figure, and supply-chain stage is illustrative. */

/* ===================== HERO: convergent production graph ===================== */
const HNODES = [
  { label: "Aluminium production", v: "0.90", pct: 69, x: 24, cx: 88 },
  { label: "Can forming", v: "0.28", pct: 22, x: 176, cx: 240 },
  { label: "Fill & carbonate", v: "0.12", pct: 9, x: 328, cx: 392 },
];
const PROD = { x: 150, y: 226, w: 180, cx: 240, top: 226 };
const spin = { transformBox: "fill-box", transformOrigin: "center" } as const;

export function ProductGraphHero() {
  const { ref, inView } = useReveal();
  return (
    <div ref={ref} className="relative overflow-hidden rounded-2xl shadow-[0_40px_80px_-34px_rgba(11,26,74,0.55)]" style={{ aspectRatio: "16 / 11", background: "linear-gradient(135deg,#7d9bf1 0%,#5175cb 52%,#39599f 100%)" }}>
      <div aria-hidden className="absolute right-0 top-0 h-2/3 w-1/2" style={{ background: "radial-gradient(circle at 82% 15%, rgba(251,140,100,0.35), transparent 55%)" }} />
      <div aria-hidden className="absolute bottom-0 right-0 h-1/2 w-2/5" style={{ background: "radial-gradient(circle at 85% 90%, rgba(67,198,150,0.25), transparent 55%)" }} />
      <svg viewBox="0 0 480 330" className="absolute inset-0 h-full w-full">
        {/* connectors converging into the product */}
        {HNODES.map((n, i) => {
          const path = `M${n.cx} 94 C ${n.cx} 150, ${PROD.cx + (n.cx - PROD.cx) * 0.35} 180, ${PROD.cx + (n.cx - PROD.cx) * 0.28} ${PROD.top}`;
          const mx = (n.cx + PROD.cx) / 2;
          return (
            <g key={i}>
              <motion.path d={path} fill="none" stroke="#ffffff" strokeOpacity="0.7" strokeWidth="2" initial={{ pathLength: 0 }} animate={inView ? { pathLength: 1 } : {}} transition={{ duration: 0.8, delay: 0.5 + i * 0.12 }} />
              <circle r="2.6" fill="#ffffff"><animateMotion dur="2.4s" begin={`${i * 0.3}s`} repeatCount="indefinite" path={path} /></circle>
              <motion.g initial={{ opacity: 0, scale: 0 }} animate={inView ? { opacity: 1, scale: 1 } : {}} transition={{ delay: 0.7 + i * 0.12 }} style={spin}>
                <circle cx={mx} cy="162" r="13" fill={CK.blue} />
                <text x={mx} y="163" textAnchor="middle" dominantBaseline="central" fontSize="9.5" fontWeight={800} fill="#fff">{n.pct}%</text>
              </motion.g>
            </g>
          );
        })}
        {/* process nodes */}
        {HNODES.map((n, i) => (
          <motion.g key={"n" + i} initial={{ opacity: 0, y: -10 }} animate={inView ? { opacity: 1, y: 0 } : {}} transition={{ duration: 0.4, delay: 0.15 + i * 0.12 }}>
            <rect x={n.x} y="24" width="128" height="70" rx="12" fill="#ffffff" />
            <text x={n.x + 16} y="42" fontSize="11" fontWeight={700} fill={CK.navy}>{n.label.split(" ")[0]}</text>
            <text x={n.x + 16} y="55" fontSize="11" fontWeight={700} fill={CK.navy}>{n.label.split(" ").slice(1).join(" ")}</text>
            <text x={n.x + 16} y="80" fontSize="13" fontWeight={800} fill={CK.navy}>{n.v}</text>
            <text x={n.x + 52} y="80" fontSize="8" fill={CK.muted}>kgCO₂e</text>
            <rect x={n.x + 16} y="86" width="96" height="4" rx="2" fill="#e7ecf6" />
            <rect x={n.x + 16} y="86" width={96 * (n.pct / 69)} height="4" rx="2" fill={CK.blue2} />
          </motion.g>
        ))}
        {/* product result */}
        <motion.g initial={{ opacity: 0, scale: 0.9 }} animate={inView ? { opacity: 1, scale: 1 } : {}} transition={{ duration: 0.5, delay: 0.9, ease: "backOut" }} style={spin}>
          <rect x={PROD.x} y={PROD.y} width={PROD.w} height="86" rx="14" fill="#ffffff" stroke={CK.blue} strokeWidth="2" />
          <text x={PROD.x + 20} y={PROD.y + 26} fontSize="11" fontWeight={700} fill={CK.muted}>Canned drink · 330ml</text>
          <text x={PROD.x + 20} y={PROD.y + 54} fontSize="22" fontWeight={800} fill={CK.navy}><Count to={1.30} play={inView} decimals={2} /></text>
          <text x={PROD.x + 96} y={PROD.y + 54} fontSize="10" fontWeight={700} fill={CK.muted}>kgCO₂e</text>
          <rect x={PROD.x + 20} y={PROD.y + 64} width="140" height="5" rx="2.5" fill="#e7ecf6" />
          <rect x={PROD.x + 20} y={PROD.y + 64} width="140" height="5" rx="2.5" fill={CK.blue} />
        </motion.g>
      </svg>
      <div className="absolute left-4 top-4 flex items-center gap-1.5 rounded-full bg-white/15 px-2.5 py-1 text-[0.6rem] font-semibold text-white backdrop-blur">
        <EsgenMark color="#ffffff" className="h-3.5 w-4" /> Product footprint
      </div>
    </div>
  );
}

/* ===================== Feature-grid visuals ===================== */
function Card({ tone = "light", children }: { tone?: "light" | "dark"; children: React.ReactNode }) {
  return (
    <motion.div
      className="relative flex h-[290px] items-center justify-center overflow-hidden rounded-2xl p-5"
      style={{ background: tone === "dark" ? "linear-gradient(160deg,#12235a,#20429c)" : "#eef3fc", border: tone === "light" ? "1px solid #e2e8f4" : "none" }}
      initial={{ opacity: 0, y: 18 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, margin: "0px 0px -12% 0px" }} transition={{ duration: 0.55, ease: [0.16, 1, 0.3, 1] }}
    >
      {children}
    </motion.div>
  );
}

/* 1. Products table */
export function ProductsTable() {
  const rows = [["27\" LCD monitor", "200.5"], ["Cordless drill", "9.4"], ["Cotton t-shirt", "2.1"], ["Running shoe", "14.0"], ["Ceramic mug", "0.9"], ["Office chair", "32.6"]];
  return (
    <Card tone="dark">
      <div className="w-full max-w-[380px] overflow-hidden rounded-xl bg-white shadow-2xl">
        <div className="flex items-center justify-between border-b border-[#eef1f6] px-4 py-2.5">
          <span className="font-display text-sm font-bold" style={{ color: CK.navy }}>Products</span>
          <span className="rounded-full border border-[#e7ebf3] px-2 py-0.5 text-[0.56rem]" style={{ color: CK.muted }}>128 products with PCFs</span>
        </div>
        <div className="grid grid-cols-[1.6fr_0.7fr_0.6fr] px-4 py-1.5 text-[0.54rem] font-semibold uppercase tracking-wide" style={{ color: CK.muted }}><span>Product</span><span>PCF</span><span></span></div>
        {rows.map(([p, v]) => (
          <div key={p} className="grid grid-cols-[1.6fr_0.7fr_0.6fr] items-center border-t border-[#f2f4f8] px-4 py-2 text-[0.66rem]">
            <span style={{ color: CK.navy }}>{p}</span>
            <span className="font-semibold tabular-nums" style={{ color: CK.navy }}>{v}</span>
            <span className="text-[0.6rem] font-medium" style={{ color: CK.blue }}>View →</span>
          </div>
        ))}
      </div>
    </Card>
  );
}

/* 2. PCF report document */
export function PcfReport() {
  const rows = [["Stainless-steel body", 1.80, 56], ["Manufacturing", 0.70, 22], ["Packaging", 0.35, 11], ["Transport", 0.35, 11]];
  return (
    <Card>
      <div className="w-full max-w-[380px] overflow-hidden rounded-xl bg-white p-4 shadow-xl">
        <div className="text-[0.56rem] font-semibold uppercase tracking-wide" style={{ color: CK.muted }}>Product carbon footprint</div>
        <div className="font-display text-sm font-bold" style={{ color: CK.navy }}>Insulated water bottle</div>
        <div className="mt-2 flex gap-2">
          {[["3.20", "per unit"], ["4.10", "per kg"]].map(([n, l]) => (
            <div key={l} className="flex-1 rounded-lg border border-[#eef1f6] p-2 text-center">
              <div className="font-display text-base font-bold tabular-nums" style={{ color: CK.navy }}>{n}</div>
              <div className="text-[0.5rem] uppercase" style={{ color: CK.muted }}>kgCO₂e · {l}</div>
            </div>
          ))}
        </div>
        <div className="mt-3 space-y-1.5">
          {rows.map(([n, v, w]) => (
            <div key={n as string} className="flex items-center gap-2">
              <span className="w-28 shrink-0 text-[0.58rem]" style={{ color: CK.navy }}>{n}</span>
              <div className="h-1.5 flex-1 overflow-hidden rounded-full" style={{ background: "#eef1f6" }}><div className="h-full rounded-full" style={{ width: `${w}%`, background: CK.blue }} /></div>
              <span className="w-6 text-right text-[0.54rem] tabular-nums" style={{ color: CK.muted }}>{v}</span>
            </div>
          ))}
        </div>
        <p className="mt-3 text-[0.52rem] leading-snug" style={{ color: CK.muted }}>Cradle-to-gate footprint, calculated with recognised emission factors. Illustrative.</p>
      </div>
    </Card>
  );
}

/* 3. Supply-chain production graph */
export function ProductionGraphMini() {
  return (
    <Card>
      <svg viewBox="0 0 360 240" className="h-full w-full">
        {[["Palm oil transport", "0.2", 26, 20], ["Electricity", "0.1", 196, 20]].map(([l, v, x, y], i) => (
          <g key={i}>
            <rect x={x as number} y={y as number} width="140" height="52" rx="10" fill="#fff" stroke="#e2e8f4" />
            <text x={(x as number) + 14} y={(y as number) + 22} fontSize="10" fontWeight={700} fill={CK.navy}>{l as string}</text>
            <text x={(x as number) + 14} y={(y as number) + 40} fontSize="12" fontWeight={800} fill={CK.navy}>{v as string}</text>
            <text x={(x as number) + 42} y={(y as number) + 40} fontSize="7" fill={CK.muted}>kgCO₂e</text>
          </g>
        ))}
        <path d="M96 72 C96 100, 130 100, 150 118" fill="none" stroke={CK.blue} strokeWidth="2" />
        <path d="M266 72 C266 100, 232 100, 210 118" fill="none" stroke="#c7d5ef" strokeWidth="2" />
        <circle cx="126" cy="104" r="13" fill={CK.blue} /><text x="126" y="105" textAnchor="middle" dominantBaseline="central" fontSize="9" fontWeight={800} fill="#fff">67%</text>
        <rect x="110" y="118" width="140" height="52" rx="10" fill="#fff" stroke={CK.blue} strokeWidth="1.6" />
        <text x="124" y="140" fontSize="10" fontWeight={700} fill={CK.navy}>Palm oil</text>
        <text x="124" y="158" fontSize="12" fontWeight={800} fill={CK.navy}>0.3</text><text x="150" y="158" fontSize="7" fill={CK.muted}>kgCO₂e</text>
        <path d="M180 170 C180 195, 130 195, 110 210" fill="none" stroke="#c7d5ef" strokeWidth="2" />
        <path d="M180 170 C180 195, 240 195, 260 210" fill="none" stroke="#c7d5ef" strokeWidth="2" />
        {[["Plastic film", 24], ["Cardboard box", 244]].map(([l, x]) => (
          <g key={l as string}><rect x={x as number} y="204" width="96" height="30" rx="8" fill="#fff" stroke="#e2e8f4" /><text x={(x as number) + 14} y="223" fontSize="9" fontWeight={700} fill={CK.navy}>{l as string}</text></g>
        ))}
        <circle r="2.4" fill={CK.blue}><animateMotion dur="2.4s" repeatCount="indefinite" path="M96 72 C96 100, 130 100, 150 118" /></circle>
      </svg>
    </Card>
  );
}

/* 4. Material comparison table */
export function MaterialsCompare() {
  const rows: [string, string, string, string, string, string][] = [
    ["Current", "Conventional", "£6", "8.1", "-", CK.muted],
    ["Option A", "Recycled", "£5", "4.5", "Lower cost & emissions", CK.green],
    ["Option B", "Bio-based", "£7", "3.3", "Higher cost, lower emissions", CK.amber],
  ];
  return (
    <Card>
      <div className="w-full max-w-[400px] overflow-hidden rounded-xl bg-white shadow-xl">
        <div className="border-b border-[#eef1f6] px-4 py-2.5 text-[0.68rem] font-bold" style={{ color: CK.navy }}>Material options · running shoe sole</div>
        <div className="grid grid-cols-[0.8fr_1fr_0.6fr_0.6fr] px-4 py-1.5 text-[0.5rem] font-semibold uppercase tracking-wide" style={{ color: CK.muted }}><span>Option</span><span>Variant</span><span>Cost</span><span>PCF/kg</span></div>
        {rows.map((r) => (
          <div key={r[0]} className="border-t border-[#f2f4f8] px-4 py-2">
            <div className="grid grid-cols-[0.8fr_1fr_0.6fr_0.6fr] items-center text-[0.62rem]">
              <span className="font-semibold" style={{ color: CK.navy }}>{r[0]}</span>
              <span style={{ color: CK.navy }}>{r[1]}</span>
              <span className="tabular-nums" style={{ color: CK.navy }}>{r[2]}</span>
              <span className="font-semibold tabular-nums" style={{ color: CK.blue }}>{r[3]}</span>
            </div>
            {r[4] !== "-" && <span className="mt-1 inline-block rounded px-1.5 py-0.5 text-[0.5rem] font-semibold" style={{ background: r[5] === CK.green ? "#e9f7ef" : "#fbf3dd", color: r[5] }}>{r[4]}</span>}
          </div>
        ))}
      </div>
    </Card>
  );
}

/* 5. Corporate footprint rollup */
export function CorporateFootprint() {
  return (
    <Card>
      <div className="relative w-full max-w-[380px]">
        <div className="rounded-xl bg-white p-3 shadow-md">
          <div className="text-[0.62rem] font-bold" style={{ color: CK.navy }}>Materials</div>
          <div className="mt-2 space-y-1.5">{[70, 52, 60, 44].map((w, i) => <div key={i} className="h-2 rounded-full" style={{ width: `${w}%`, background: "#e4ebf7" }} />)}</div>
        </div>
        <div className="absolute -bottom-4 right-0 w-[62%] rounded-xl bg-white p-3 shadow-xl ring-1 ring-[#e2e8f4]">
          <div className="text-[0.62rem] font-bold" style={{ color: CK.navy }}>Corporate footprint</div>
          {[["Scope 1", CK.navy], ["Scope 2", CK.blue], ["Scope 3", CK.blue3]].map(([s, c]) => (
            <div key={s as string} className="mt-1.5 flex items-center justify-between rounded-md border border-[#eef1f6] px-2 py-1.5">
              <span className="flex items-center gap-1.5 text-[0.58rem] font-medium" style={{ color: CK.navy }}><i className="h-1.5 w-1.5 rounded-sm" style={{ background: c as string }} />{s}</span>
              <span className="text-[0.5rem]" style={{ color: CK.muted }}>FY2025</span>
            </div>
          ))}
        </div>
      </div>
    </Card>
  );
}

/* 6. Variant bar comparison */
export function VariantBars() {
  const { ref, inView } = useReveal();
  const data: [string, number, string][] = [["Classic cotton tee", 2.2, CK.navy], ["Recycled cotton tee", 1.4, CK.blue]];
  return (
    <Card>
      <div ref={ref} className="w-full max-w-[360px]">
        {data.map(([l, v, c], i) => (
          <div key={l} className="mb-5 last:mb-0">
            <div className="flex items-center justify-between text-[0.66rem]"><span style={{ color: CK.navy }}>{l}</span><span className="font-bold tabular-nums" style={{ color: c }}><Count to={v} play={inView} decimals={3} /> kgCO₂e/kg</span></div>
            <div className="mt-1.5 h-6 overflow-hidden rounded-md" style={{ background: "#dfe7f5" }}>
              <motion.div className="h-full rounded-md" style={{ background: c }} initial={{ width: 0 }} animate={inView ? { width: `${(v / 2.2) * 100}%` } : {}} transition={{ duration: 0.9, delay: 0.2 + i * 0.15, ease: [0.16, 1, 0.3, 1] }} />
            </div>
          </div>
        ))}
      </div>
    </Card>
  );
}
