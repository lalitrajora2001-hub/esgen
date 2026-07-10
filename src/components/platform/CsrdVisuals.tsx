"use client";

import { useState } from "react";
import { motion, useReducedMotion } from "framer-motion";
import { GK } from "@/components/platform/CarbonVisuals";

const INK = "#0f1720", MUTED = "#6b7280";

/* ============================================================
   DOUBLE MATERIALITY MATRIX
   x = financial materiality (how the topic affects the company)
   y = impact materiality  (how the company affects the world)
   Positions are illustrative; the axes and the test are what matter.
   ============================================================ */
type Topic = { c: string; n: string; x: number; y: number; why: string };
const TOPICS: Topic[] = [
  { c: "E1", n: "Climate change", x: 86, y: 90, why: "Transition and physical risk affect the business, while emissions affect the climate. E1 is material for most undertakings." },
  { c: "E2", n: "Pollution", x: 34, y: 52, why: "Releases to air, water and soil, plus substances of concern in your products and processes." },
  { c: "E3", n: "Water & marine resources", x: 41, y: 60, why: "Withdrawal and consumption, especially in water-stressed basins where operations sit." },
  { c: "E4", n: "Biodiversity & ecosystems", x: 30, y: 66, why: "Land-use change and pressures on species, often concentrated upstream in the value chain." },
  { c: "E5", n: "Circular economy", x: 55, y: 71, why: "Resource inflows, waste, and how far products are designed for reuse and recycling." },
  { c: "S1", n: "Own workforce", x: 74, y: 78, why: "Working conditions, equal treatment, health and safety across your own employees." },
  { c: "S2", n: "Value-chain workers", x: 48, y: 82, why: "Conditions for workers who are not employees but sit in your upstream and downstream chain." },
  { c: "S3", n: "Affected communities", x: 27, y: 45, why: "Impacts on the civil, political, and land rights of communities near operations." },
  { c: "S4", n: "Consumers & end-users", x: 66, y: 40, why: "Information, safety, and inclusion for the people who ultimately use your products." },
  { c: "G1", n: "Business conduct", x: 79, y: 56, why: "Corporate culture, supplier relations, corruption and bribery, and political engagement." },
];
const THRESHOLD = 50;

export function MaterialityMatrix() {
  const [sel, setSel] = useState(0);
  const reduce = useReducedMotion();
  const t = TOPICS[sel];
  const px = (v: number) => 46 + (v / 100) * 300;
  const py = (v: number) => 330 - (v / 100) * 300;
  const material = (p: Topic) => p.x >= THRESHOLD || p.y >= THRESHOLD;

  return (
    <div className="overflow-hidden rounded-2xl border border-[#e6ece7] bg-white p-5 shadow-[0_40px_80px_-40px_rgba(16,80,50,0.4)]">
      <div className="flex items-baseline justify-between gap-3">
        <span className="font-display text-base font-bold" style={{ color: INK }}>Double materiality assessment</span>
        <span className="shrink-0 rounded bg-[#f1f7f3] px-2 py-0.5 text-[0.58rem] font-bold" style={{ color: GK.greenDk }}>{TOPICS.filter(material).length} of {TOPICS.length} material</span>
      </div>

      <div className="mt-3 grid gap-5 lg:grid-cols-[1.15fr_0.85fr]">
        <svg viewBox="0 0 380 380" className="w-full" role="img" aria-label="Double materiality matrix">
          {/* material quadrant wash */}
          <rect x={px(THRESHOLD)} y={py(100)} width={px(100) - px(THRESHOLD)} height={py(THRESHOLD) - py(100)} fill="#f1f7f3" />
          <rect x={px(0)} y={py(100)} width={px(THRESHOLD) - px(0)} height={py(THRESHOLD) - py(100)} fill="#f8faf9" />
          <rect x={px(THRESHOLD)} y={py(THRESHOLD)} width={px(100) - px(THRESHOLD)} height={py(0) - py(THRESHOLD)} fill="#f8faf9" />

          {/* grid */}
          {[0, 25, 50, 75, 100].map((v) => (
            <g key={v}>
              <line x1={px(v)} y1={py(0)} x2={px(v)} y2={py(100)} stroke="#eef1ef" strokeWidth="1" />
              <line x1={px(0)} y1={py(v)} x2={px(100)} y2={py(v)} stroke="#eef1ef" strokeWidth="1" />
            </g>
          ))}
          {/* thresholds */}
          <line x1={px(THRESHOLD)} y1={py(0)} x2={px(THRESHOLD)} y2={py(100)} stroke={GK.greenDk} strokeWidth="1.2" strokeDasharray="4 4" />
          <line x1={px(0)} y1={py(THRESHOLD)} x2={px(100)} y2={py(THRESHOLD)} stroke={GK.greenDk} strokeWidth="1.2" strokeDasharray="4 4" />
          {/* axes */}
          <line x1={px(0)} y1={py(0)} x2={px(100)} y2={py(0)} stroke="#5b6560" strokeWidth="1.4" />
          <line x1={px(0)} y1={py(0)} x2={px(0)} y2={py(100)} stroke="#5b6560" strokeWidth="1.4" />
          <text x={px(50)} y="366" textAnchor="middle" fontSize="10" fontWeight="700" fill={MUTED}>Financial materiality →</text>
          <text x="14" y={py(50)} textAnchor="middle" fontSize="10" fontWeight="700" fill={MUTED} transform={`rotate(-90 14 ${py(50)})`}>Impact materiality →</text>

          {TOPICS.map((p, i) => {
            const on = i === sel;
            const mat = material(p);
            return (
              <g key={p.c} className="cursor-pointer" onPointerEnter={() => setSel(i)} onClick={() => setSel(i)}
                tabIndex={0} role="button" aria-label={`${p.c} ${p.n}`} onFocus={() => setSel(i)}>
                <circle cx={px(p.x)} cy={py(p.y)} r="18" fill="transparent" />
                {on && !reduce && <circle cx={px(p.x)} cy={py(p.y)} r="16" fill="none" stroke={GK.green} strokeWidth="1.5" opacity="0.5"><animate attributeName="r" values="12;19;12" dur="2.2s" repeatCount="indefinite" /><animate attributeName="opacity" values="0.6;0;0.6" dur="2.2s" repeatCount="indefinite" /></circle>}
                <circle cx={px(p.x)} cy={py(p.y)} r={on ? 13 : 10}
                  fill={mat ? (on ? GK.greenDk : GK.green) : "#cfd8d3"} stroke="#fff" strokeWidth="2"
                  style={{ transition: "r 160ms ease-out, fill 160ms ease-out" }} />
                <text x={px(p.x)} y={py(p.y) + 3} textAnchor="middle" fontSize="7.5" fontWeight="800" fill="#fff" className="pointer-events-none">{p.c}</text>
              </g>
            );
          })}
        </svg>

        <div>
          <motion.div key={t.c} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.2 }}
            className="rounded-xl border border-[#e6ece7] bg-[#f8faf9] p-4">
            <div className="flex items-center gap-2">
              <span className="grid h-7 w-7 place-items-center rounded-lg font-mono text-[0.66rem] font-bold text-white" style={{ background: material(t) ? GK.greenDk : "#9aa5a0" }}>{t.c}</span>
              <span className="font-display text-[0.95rem] font-bold" style={{ color: INK }}>{t.n}</span>
            </div>
            <p className="mt-2.5 text-[0.8rem] leading-relaxed" style={{ color: MUTED }}>{t.why}</p>
            <dl className="mt-3 space-y-1.5">
              {([["Impact materiality", t.y], ["Financial materiality", t.x]] as [string, number][]).map(([k, v]) => (
                <div key={k}>
                  <div className="flex justify-between text-[0.66rem]"><dt style={{ color: INK }}>{k}</dt><dd className="font-mono font-bold" style={{ color: v >= THRESHOLD ? GK.greenDk : MUTED }}>{v}</dd></div>
                  <div className="mt-1 h-1.5 overflow-hidden rounded-full bg-[#e6ece7]">
                    <div className="h-full rounded-full motion-safe:transition-[width] motion-safe:duration-500" style={{ width: `${v}%`, background: v >= THRESHOLD ? GK.greenDk : "#cfd8d3" }} />
                  </div>
                </div>
              ))}
            </dl>
            <p className="mt-3 border-t border-[#e2e8e4] pt-2.5 text-[0.7rem] font-semibold" style={{ color: material(t) ? GK.greenDk : MUTED }}>
              {material(t) ? "Material — disclose under this standard" : "Below threshold — explain why it is not material"}
            </p>
          </motion.div>
          <p className="mt-3 text-[0.62rem] leading-relaxed" style={{ color: MUTED }}>A topic is material if it passes <em>either</em> test. Positions shown are illustrative; your own assessment sets them.</p>
        </div>
      </div>
    </div>
  );
}

/* ============================================================
   ESRS COVERAGE — mark topics material and watch the reporting
   set assemble. ESRS 2 is always required.
   ============================================================ */
const ESRS: [string, string][] = [
  ["ESRS 2", "General disclosures"], ["E1", "Climate change"], ["E2", "Pollution"], ["E3", "Water & marine"],
  ["E4", "Biodiversity"], ["E5", "Circular economy"], ["S1", "Own workforce"], ["S2", "Value-chain workers"],
  ["S3", "Affected communities"], ["S4", "Consumers & end-users"], ["G1", "Business conduct"],
];
export function EsrsCoverage() {
  const [on, setOn] = useState<Record<string, boolean>>(() => ({ E1: true, S1: true, G1: true }));
  const toggle = (k: string) => { if (k === "ESRS 2") return; setOn((p) => ({ ...p, [k]: !p[k] })); };
  const count = 1 + Object.values(on).filter(Boolean).length;
  const pct = Math.round((count / ESRS.length) * 100);

  return (
    <div className="rounded-2xl border border-[#e6ece7] bg-white p-6">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <h3 className="font-display text-lg font-bold" style={{ color: INK }}>Your reporting set</h3>
          <p className="mt-1 text-[0.82rem]" style={{ color: MUTED }}>Select the topics your assessment found material.</p>
        </div>
        <div className="text-right">
          <div className="font-display text-3xl font-bold tabular-nums" style={{ color: GK.greenDk }}>{count}</div>
          <div className="text-[0.6rem] uppercase tracking-wide" style={{ color: MUTED }}>standards in scope</div>
        </div>
      </div>

      <div className="mt-4 h-1.5 overflow-hidden rounded-full bg-[#eef1ef]">
        <div className="h-full rounded-full motion-safe:transition-[width] motion-safe:duration-500" style={{ width: `${pct}%`, background: GK.green }} />
      </div>

      <div className="mt-5 flex flex-wrap gap-2">
        {ESRS.map(([k, n]) => {
          const fixed = k === "ESRS 2";
          const active = fixed || !!on[k];
          return (
            <button key={k} onClick={() => toggle(k)} aria-pressed={active} disabled={fixed}
              className="group flex items-center gap-2 rounded-xl border px-3 py-2 text-left transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-1 focus-visible:outline-[#16a34a] disabled:cursor-default"
              style={{ borderColor: active ? "transparent" : "#e6ece7", background: active ? (fixed ? "#0d1411" : "#f1f7f3") : "#fff" }}>
              <span className="font-mono text-[0.64rem] font-bold" style={{ color: fixed ? "#fff" : active ? GK.greenDk : MUTED }}>{k}</span>
              <span className="text-[0.74rem]" style={{ color: fixed ? "rgba(255,255,255,0.75)" : INK }}>{n}</span>
              {fixed && <span className="rounded bg-white/15 px-1.5 py-0.5 text-[0.5rem] font-bold text-white">always</span>}
            </button>
          );
        })}
      </div>
      <p className="mt-4 text-[0.7rem]" style={{ color: MUTED }}>ESRS 2 applies to every undertaking in scope. Topical standards apply where your double materiality assessment says they do.</p>
    </div>
  );
}
