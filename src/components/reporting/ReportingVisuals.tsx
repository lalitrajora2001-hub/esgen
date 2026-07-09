"use client";

import { motion } from "framer-motion";
import { CK, Count, EsgenMark, useReveal } from "@/components/whiteui/kit";

/* Original ESGen reporting mockups. All figures are illustrative. No AI claims. */

const SIDE_ICONS = [
  "M3 12l9-8 9 8M5 10v10h14V10",
  "M4 5h16v4H4zM4 12h16v7H4z",
  "M5 4h9l5 5v11H5zM14 4v5h5",
  "M4 19V5m0 14h16M8 15l3-4 3 3 4-6",
];

/* ===================== HERO: wide report editor ===================== */
export function ReportEditor() {
  const { ref, inView } = useReveal();
  const scopes: [string, string, string][] = [["Scope 1", "1,138", CK.navy], ["Scope 2", "763", CK.blue], ["Scope 3", "46,309", CK.blue3]];
  return (
    <div ref={ref} className="overflow-hidden rounded-2xl border border-[#e7ebf3] bg-white shadow-[0_44px_90px_-40px_rgba(11,26,74,0.5)]">
      <div className="flex">
        <aside className="hidden w-12 shrink-0 flex-col items-center gap-4 py-4 sm:flex" style={{ background: "#0b1220" }}>
          <EsgenMark color="#ffffff" className="h-5 w-6" />
          <div className="mt-2 flex flex-col gap-3">
            {SIDE_ICONS.map((d, i) => (
              <svg key={i} viewBox="0 0 24 24" fill="none" stroke={i === 3 ? "#ffffff" : "#6b7793"} strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" className="h-[18px] w-[18px]"><path d={d} /></svg>
            ))}
          </div>
        </aside>
        <div className="min-w-0 flex-1">
          <div className="flex items-center justify-between border-b border-[#eef1f6] px-5 py-3">
            <span className="text-[0.78rem]" style={{ color: CK.muted }}>Reports / <span className="font-semibold" style={{ color: CK.navy }}>Annual sustainability report</span></span>
            <div className="flex items-center gap-2 text-[0.72rem] font-medium" style={{ color: CK.muted }}><span className="rounded-md border border-[#e7ebf3] px-2 py-1">Share</span><span className="rounded-md px-2 py-1 text-white" style={{ background: CK.blue }}>Export</span></div>
          </div>
          <div className="relative p-6">
            <h4 className="font-display text-xl font-bold" style={{ color: CK.navy }}>Emissions</h4>
            <div className="mt-3 inline-flex items-center gap-2 rounded-md border-l-2 py-1 pl-2 pr-3 text-[0.82rem]" style={{ borderColor: CK.blue, background: "#f4f7fd", color: CK.navy }}>
              Our total emissions for FY2025 were <span className="font-bold tabular-nums"><Count to={48210} play={inView} /> tCO₂e</span>
            </div>
            <div className="mt-3 max-w-lg space-y-1.5">
              {[92, 84, 74].map((w) => <div key={w} className="h-2 rounded-full" style={{ width: `${w}%`, background: "#eef1f6" }} />)}
            </div>
            <div className="mt-4 max-w-lg overflow-hidden rounded-lg border border-[#eef1f6]">
              <div className="grid grid-cols-[1fr_1fr] bg-[#fafbfe] px-4 py-2 text-[0.6rem] font-semibold uppercase tracking-wide" style={{ color: CK.muted }}><span>Scope</span><span className="text-right">Emissions (market-based)</span></div>
              {scopes.map(([n, v, c], i) => (
                <motion.div key={n} className="grid grid-cols-[1fr_1fr] items-center border-t border-[#f2f4f8] px-4 py-2.5"
                  initial={{ opacity: 0, x: -8 }} animate={inView ? { opacity: 1, x: 0 } : {}} transition={{ duration: 0.4, delay: 0.3 + i * 0.12 }}>
                  <span className="flex items-center gap-2 text-[0.74rem] font-medium" style={{ color: CK.navy }}><i className="h-2.5 w-2.5 rounded-sm" style={{ background: c }} />{n}</span>
                  <span className="text-right text-[0.74rem] font-semibold tabular-nums" style={{ color: CK.blue }}>{v} tCO₂e</span>
                </motion.div>
              ))}
            </div>
            <motion.div className="absolute right-5 top-16 hidden w-56 rounded-xl border border-[#e7ebf3] bg-white p-3 shadow-2xl lg:block"
              initial={{ opacity: 0, y: 12 }} animate={inView ? { opacity: 1, y: 0 } : {}} transition={{ delay: 0.7 }}>
              <div className="flex items-center gap-1.5 text-[0.7rem] font-semibold" style={{ color: CK.navy }}><svg viewBox="0 0 24 24" className="h-3.5 w-3.5" fill="none" stroke={CK.green} strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round"><path d="M5 13l4 4L19 7" /></svg>Requirement mapped</div>
              <div className="mt-2 rounded-md border border-[#eef1f6] px-2 py-1.5 text-[0.62rem]" style={{ color: CK.muted }}>IFRS S2 · Scope 1, 2, 3</div>
              <div className="mt-2 text-[0.6rem] font-semibold uppercase tracking-wide" style={{ color: CK.muted }}>Total emissions</div>
              <div className="font-display text-lg font-bold tabular-nums" style={{ color: CK.navy }}>48,210</div>
              <div className="mt-2 flex items-center gap-1.5 rounded-md bg-[#f4f7fd] px-2 py-1 text-[0.6rem] font-medium" style={{ color: CK.blue }}>
                <svg viewBox="0 0 24 24" className="h-3 w-3" fill="none" stroke="currentColor" strokeWidth="2"><path d="M4 4v6h6M20 20v-6h-6M20 8a8 8 0 0 0-14-3M4 16a8 8 0 0 0 14 3" /></svg>Evidence linked · 3 sources
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ===================== 3-col feature mockups ===================== */
function MiniCard({ children }: { children: React.ReactNode }) {
  return (
    <motion.div className="mt-6 flex h-44 items-center justify-center overflow-hidden rounded-xl border border-[#e2e8f4] p-4" style={{ background: "linear-gradient(180deg,#f3f6fc,#e9eff9)" }}
      initial={{ opacity: 0, y: 14 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, margin: "0px 0px -12% 0px" }} transition={{ duration: 0.5 }}>
      {children}
    </motion.div>
  );
}

export function TemplateCard() {
  return (
    <MiniCard>
      <div className="w-full max-w-[240px] rounded-lg bg-white p-3 shadow-lg">
        <div className="text-[0.62rem] font-bold" style={{ color: CK.navy }}>Report template · CSRD</div>
        <div className="mt-2 space-y-1.5">
          {[["Governance", true], ["Strategy", true], ["Metrics & targets", false]].map(([l, d]) => (
            <div key={l as string} className="flex items-center gap-2 rounded-md border border-[#eef1f6] px-2 py-1.5 text-[0.6rem]" style={{ color: CK.navy }}>
              <span className="grid h-3.5 w-3.5 place-items-center rounded" style={{ background: d ? CK.green : "#e4ebf7" }}>{d ? <svg viewBox="0 0 24 24" className="h-2.5 w-2.5" fill="none" stroke="#fff" strokeWidth="3" strokeLinecap="round"><path d="M5 13l4 4L19 7" /></svg> : null}</span>{l as string}
            </div>
          ))}
        </div>
      </div>
    </MiniCard>
  );
}

export function UploadCard() {
  return (
    <MiniCard>
      <div className="w-full max-w-[240px]">
        <div className="rounded-lg bg-white p-3 shadow-lg">
          <div className="text-[0.58rem] font-semibold" style={{ color: CK.navy }}>Select upload template</div>
          <div className="mt-1.5 flex items-center justify-between rounded-md border border-[#e7ebf3] px-2 py-1.5 text-[0.6rem]" style={{ color: CK.muted }}>Flights by distance <span>▾</span></div>
        </div>
        <div className="relative mt-3 space-y-1.5">
          {["Sales team flights.csv", "2026 flight expenses.xlsx"].map((f) => (
            <div key={f} className="flex items-center gap-2 rounded-md bg-white px-2 py-1.5 text-[0.6rem] shadow" style={{ color: CK.navy }}><svg viewBox="0 0 24 24" className="h-3 w-3" fill="none" stroke={CK.muted} strokeWidth="1.6"><path d="M6 3h9l4 4v14H6z" /></svg>{f}</div>
          ))}
          <div className="absolute -right-1 -top-8 rounded-md px-2.5 py-1 text-[0.6rem] font-semibold text-white shadow" style={{ background: CK.blue }}>Upload →</div>
        </div>
      </div>
    </MiniCard>
  );
}

export function AnomaliesCard() {
  const rows: [string, boolean][] = [["Two-way (round trip)", true], ["One way", false], ["Round trip", false], ["Round-trip flight", true]];
  return (
    <MiniCard>
      <div className="relative w-full max-w-[250px]">
        <div className="overflow-hidden rounded-lg bg-white shadow-lg">
          <div className="border-b border-[#eef1f6] px-3 py-1.5 text-[0.58rem] font-semibold" style={{ color: CK.navy }}>Flight type</div>
          {rows.map(([l, flag]) => (
            <div key={l} className="flex items-center justify-between border-t border-[#f2f4f8] px-3 py-1.5 text-[0.6rem]" style={{ background: flag ? "#fff6e9" : "#fff", color: CK.navy }}>
              {l}{flag && <svg viewBox="0 0 24 24" className="h-3 w-3" fill="none" stroke={CK.amber} strokeWidth="2"><path d="M12 3l9 16H3z M12 10v4M12 17h.01" /></svg>}
            </div>
          ))}
        </div>
        <div className="absolute -right-2 -top-3 flex items-center gap-1 rounded-md bg-white px-2 py-1 text-[0.58rem] font-semibold shadow-lg" style={{ color: CK.navy }}><svg viewBox="0 0 24 24" className="h-3 w-3" fill="none" stroke={CK.amber} strokeWidth="2"><path d="M12 3l9 16H3z M12 10v4M12 17h.01" /></svg>Review anomalies</div>
      </div>
    </MiniCard>
  );
}

/* ===================== Framework + requirements mapping ===================== */
const FW_TILES: [string, string][] = [["ISSB", CK.navy], ["CDP", "#c8102e"], ["TCFD", "#38a7db"], ["SECR", CK.navy], ["FCA", "#5b3f7a"], ["CSRD", "#0b3aa0"], ["GRI", "#12559c"], ["UK SRS", CK.navy]];
const REQS: [string, string, boolean][] = [
  ["GRI 2-1", "Organisational details", true],
  ["IFRS S2", "Scope 1, 2 and 3 emissions", false],
  ["ESRS E1", "Gross Scopes 1–3 and total", false],
  ["Governance", "Board oversight of climate", false],
];
export function FrameworkRequirements() {
  const { ref, inView } = useReveal();
  return (
    <div ref={ref} className="relative overflow-hidden rounded-2xl border border-[#e2e8f4] p-5" style={{ background: "#eef3fc" }}>
      <div className="grid grid-cols-3 gap-2.5">
        {FW_TILES.map(([l, c]) => (
          <div key={l} className="flex h-14 items-center justify-center rounded-xl bg-white shadow-sm">
            <span className="font-display text-sm font-extrabold tracking-tight" style={{ color: c }}>{l}</span>
          </div>
        ))}
      </div>
      <motion.div className="absolute bottom-5 right-5 w-[62%] max-w-[280px] rounded-xl border border-[#e7ebf3] bg-white p-3 shadow-2xl"
        initial={{ opacity: 0, y: 14 }} animate={inView ? { opacity: 1, y: 0 } : {}} transition={{ duration: 0.5, delay: 0.3 }}>
        <div className="text-[0.66rem] font-semibold" style={{ color: CK.navy }}>Select which requirements to map</div>
        <div className="mt-2 space-y-1.5">
          {REQS.map(([code, desc, on], i) => (
            <motion.div key={code} className="flex items-start gap-2 rounded-md px-1.5 py-1" initial={{ opacity: 0 }} animate={inView ? { opacity: 1 } : {}} transition={{ delay: 0.5 + i * 0.12 }}>
              <span className="mt-0.5 grid h-4 w-4 shrink-0 place-items-center rounded" style={{ background: on ? CK.blue : "#fff", border: on ? "none" : "1.5px solid #cbd5ea" }}>{on && <svg viewBox="0 0 24 24" className="h-3 w-3" fill="none" stroke="#fff" strokeWidth="3" strokeLinecap="round"><path d="M5 13l4 4L19 7" /></svg>}</span>
              <span><span className="text-[0.64rem] font-semibold" style={{ color: CK.navy }}>{code}</span><span className="ml-1 text-[0.58rem]" style={{ color: CK.muted }}>· {desc}</span></span>
            </motion.div>
          ))}
        </div>
      </motion.div>
    </div>
  );
}

/* ===================== Emissions disclosure doc ===================== */
export function EmissionsDisclosure() {
  const { ref, inView } = useReveal();
  const scopes: [string, string][] = [["Scope 3", "46,309"], ["Scope 2", "763"], ["Scope 1", "1,138"]];
  return (
    <div ref={ref} className="relative overflow-hidden rounded-2xl border border-[#e2e8f4] p-6" style={{ background: "#eef3fc" }}>
      <div className="rounded-xl bg-white p-5 shadow-xl">
        <h4 className="font-display text-lg font-bold" style={{ color: CK.navy }}>Emissions</h4>
        <div className="mt-2 inline-flex items-center gap-2 rounded-md border-l-2 py-1 pl-2 pr-3 text-[0.72rem]" style={{ borderColor: CK.blue, background: "#f4f7fd", color: CK.navy }}>
          Our total emissions for FY2025 were <span className="font-bold tabular-nums"><Count to={48210} play={inView} /> tCO₂e</span>
        </div>
        <div className="mt-3 space-y-1.5">{[90, 82].map((w) => <div key={w} className="h-2 rounded-full" style={{ width: `${w}%`, background: "#eef1f6" }} />)}</div>
        <div className="mt-3 overflow-hidden rounded-lg border border-[#eef1f6]">
          <div className="grid grid-cols-[1fr_1fr] bg-[#fafbfe] px-3 py-1.5 text-[0.56rem] font-semibold uppercase tracking-wide" style={{ color: CK.muted }}><span>Scope</span><span className="text-right">Sum tCO₂e</span></div>
          {scopes.map(([n, v], i) => (
            <motion.div key={n} className="grid grid-cols-[1fr_1fr] border-t border-[#f2f4f8] px-3 py-2 text-[0.66rem]" initial={{ opacity: 0, x: -6 }} animate={inView ? { opacity: 1, x: 0 } : {}} transition={{ delay: 0.3 + i * 0.1 }}>
              <span style={{ color: CK.navy }}>{n}</span><span className="text-right font-semibold tabular-nums" style={{ color: CK.navy }}>{v}</span>
            </motion.div>
          ))}
        </div>
      </div>
      <motion.div className="absolute right-4 top-4 w-52 rounded-xl border border-[#e7ebf3] bg-white p-3 shadow-2xl"
        initial={{ opacity: 0, scale: 0.95 }} animate={inView ? { opacity: 1, scale: 1 } : {}} transition={{ delay: 0.5 }}>
        <div className="text-[0.66rem] font-semibold" style={{ color: CK.navy }}>1 requirement tagged</div>
        <div className="mt-2 rounded-md border border-[#eef1f6] px-2 py-1.5 text-[0.58rem]" style={{ color: CK.muted }}>Total emissions</div>
        <div className="mt-1 font-display text-base font-bold tabular-nums" style={{ color: CK.navy }}>48,210 <span className="text-[0.6rem] font-semibold" style={{ color: CK.muted }}>tCO₂e</span></div>
        <div className="mt-2 flex items-center gap-1.5 rounded-md bg-[#f4f7fd] px-2 py-1 text-[0.58rem] font-medium" style={{ color: CK.blue }}>
          <svg viewBox="0 0 24 24" className="h-3 w-3" fill="none" stroke="currentColor" strokeWidth="2"><path d="M4 4v6h6M20 20v-6h-6M20 8a8 8 0 0 0-14-3M4 16a8 8 0 0 0 14 3" /></svg>Update data
        </div>
      </motion.div>
    </div>
  );
}
