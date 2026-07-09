"use client";

import { motion, useReducedMotion } from "framer-motion";
import { Count, EsgenMark, useReveal } from "@/components/whiteui/kit";
import { GK } from "@/components/platform/CarbonVisuals";

/* ESGen product-app mockups (dark sidebar + dashboard). All data is illustrative. */

const NAV = ["Dashboard", "Data", "My emissions", "Actions", "CSRD", "Suppliers", "LCA", "My resources", "Settings"];

export function AppFrame({ crumb, active = "Actions", children }: { crumb: string; active?: string; children: React.ReactNode }) {
  return (
    <motion.div className="overflow-hidden rounded-xl border border-[#e3e9e5] bg-white shadow-[0_34px_70px_-32px_rgba(16,80,50,0.45)]"
      initial={{ opacity: 0, y: 18 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, margin: "0px 0px -12% 0px" }} transition={{ duration: 0.55, ease: [0.16, 1, 0.3, 1] }}>
      <div className="flex">
        <aside className="hidden w-32 shrink-0 flex-col p-3 sm:flex" style={{ background: "#0f2a1c" }}>
          <EsgenMark color="#ffffff" className="mb-4 h-4 w-6" />
          {NAV.map((n) => (
            <span key={n} className="mb-0.5 flex items-center gap-1.5 rounded px-1.5 py-1 text-[0.52rem]" style={{ background: n === active ? "rgba(255,255,255,0.12)" : "transparent", color: n === active ? "#fff" : "rgba(255,255,255,0.55)" }}>
              <i className="h-1 w-1 rounded-full" style={{ background: n === active ? GK.green2 : "rgba(255,255,255,0.35)" }} />{n}
            </span>
          ))}
        </aside>
        <div className="min-w-0 flex-1">
          <div className="border-b border-[#eef1ef] px-4 py-2 text-[0.56rem]" style={{ color: GK.muted }}>{crumb}</div>
          <div className="p-4">{children}</div>
        </div>
      </div>
    </motion.div>
  );
}

function Ring({ pct, size = 54, color = GK.greenDk }: { pct: number; size?: number; color?: string }) {
  const { ref, inView } = useReveal();
  return (
    <div ref={ref} className="shrink-0" style={{ width: size, height: size }}>
      <svg viewBox="0 0 60 60" className="h-full w-full">
        <circle cx="30" cy="30" r="22" fill="none" stroke="#e6efe9" strokeWidth="8" />
        <motion.circle cx="30" cy="30" r="22" fill="none" stroke={color} strokeWidth="8" pathLength={100} strokeDasharray="100" strokeLinecap="round" transform="rotate(-90 30 30)"
          initial={{ strokeDashoffset: 100 }} animate={inView ? { strokeDashoffset: 100 - pct } : {}} transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }} />
      </svg>
    </div>
  );
}

function Stat({ label, value, sub }: { label: string; value: React.ReactNode; sub?: string }) {
  return (
    <div className="rounded-lg border border-[#eef1ef] p-2.5">
      <div className="text-[0.52rem]" style={{ color: GK.muted }}>{label}</div>
      <div className="font-display text-base font-bold tabular-nums" style={{ color: GK.ink }}>{value}</div>
      {sub && <div className="text-[0.46rem]" style={{ color: GK.muted }}>{sub}</div>}
    </div>
  );
}

/* ---------- 1. Carbon reduction trajectory ---------- */
export function AppReductionTrajectory() {
  const { ref, inView } = useReveal();
  const donuts: [number, string[]][] = [[72, ["Measured", "Estimated"]], [58, ["Primary", "Spend-based"]], [46, ["Purchased goods", "Capital goods", "Transport"]]];
  return (
    <AppFrame crumb="Actions / Reduction strategy">
      <div ref={ref} className="font-display text-sm font-bold" style={{ color: GK.ink }}>Carbon reduction trajectory</div>
      <div className="mt-3 grid grid-cols-3 gap-2">
        {donuts.map(([pct, legend], i) => (
          <div key={i} className="flex items-center gap-2 rounded-lg border border-[#eef1ef] p-2">
            <Ring pct={pct} size={46} color={i === 2 ? GK.green : GK.greenDk} />
            <ul className="space-y-0.5">{legend.map((l, j) => <li key={l} className="flex items-center gap-1 text-[0.46rem]" style={{ color: GK.muted }}><i className="h-1 w-1 rounded-full" style={{ background: j === 0 ? GK.greenDk : "#bfd8c9" }} />{l}</li>)}</ul>
          </div>
        ))}
      </div>
      <div className="mt-3 text-[0.6rem] font-semibold" style={{ color: GK.ink }}>Overall KPIs</div>
      <div className="mt-1.5 grid grid-cols-3 gap-2">
        <Stat label="Emissions (tCO₂e)" value={<Count to={60064} play={inView} />} />
        <Stat label="Distinct emission factors" value={<Count to={138} play={inView} />} />
        <Stat label="Distinct suppliers identified" value={<Count to={248} play={inView} />} />
      </div>
    </AppFrame>
  );
}

/* ---------- 2. Scenario / objectives ---------- */
export function AppScenario() {
  const { ref, inView } = useReveal();
  const reduce = useReducedMotion();
  const bars = [92, 78, 66, 58, 44, 34, 22, 14];
  return (
    <AppFrame crumb="Actions / Reduction strategy" active="Actions">
      <div ref={ref} className="grid grid-cols-3 gap-2">
        <Stat label="Current net emissions" value="1,000" sub="tCO₂e · 2024" />
        <Stat label="Predicted net emissions" value="700" sub="tCO₂e · 2028" />
        <Stat label="Objective reduction" value="−300" sub="tCO₂e" />
      </div>
      <div className="mt-3 grid grid-cols-[0.8fr_1.6fr] gap-2">
        <div className="rounded-lg border border-[#eef1ef] p-2.5">
          <div className="text-[0.58rem] font-semibold" style={{ color: GK.ink }}>Objectives</div>
          <div className="mt-1.5 space-y-1">
            {["Paris 1.5°C", "Paris 2.0°C", "Custom"].map((o, i) => (
              <label key={o} className="flex items-center gap-1.5 text-[0.54rem]" style={{ color: GK.ink }}>
                <span className="grid h-2.5 w-2.5 place-items-center rounded-full border" style={{ borderColor: i === 2 ? GK.green : "#cbd5cf" }}>{i === 2 && <span className="h-1.5 w-1.5 rounded-full" style={{ background: GK.green }} />}</span>{o}
              </label>
            ))}
          </div>
          <div className="mt-2 text-[0.5rem]" style={{ color: GK.muted }}>Reduction objective</div>
          <div className="rounded border border-[#eef1ef] px-1.5 py-1 text-[0.58rem] font-bold" style={{ color: GK.ink }}>30%</div>
        </div>
        <div className="relative rounded-lg border border-[#eef1ef] p-2.5">
          <div className="flex items-center justify-between">
            <span className="text-[0.54rem]" style={{ color: GK.muted }}>Emissions per year</span>
            <span className="rounded bg-[#ecfdf3] px-1.5 py-0.5 text-[0.46rem] font-bold" style={{ color: GK.greenDk }}>✓ Objective reached (100%)</span>
          </div>
          <div className="relative mt-2 flex h-20 items-end gap-1 overflow-hidden">
            {bars.map((h, i) => <motion.div key={i} className="flex-1 rounded-t-[2px]" style={{ background: i < 2 ? GK.green : i < 5 ? "#5fcf8b" : "#123f28" }} initial={{ height: 0 }} animate={inView ? { height: `${h}%` } : {}} transition={{ duration: 0.6, delay: 0.15 + i * 0.05 }} />)}
            {!reduce && <motion.div className="pointer-events-none absolute inset-y-0 w-1/4" style={{ background: "linear-gradient(90deg,transparent,rgba(22,163,74,0.18),transparent)" }} animate={{ x: ["-130%", "480%"] }} transition={{ duration: 3, repeat: Infinity, ease: "easeInOut", delay: 1 }} />}
          </div>
          <div className="mt-1 border-t border-dashed border-[#c7ddd0]" />
        </div>
      </div>
    </AppFrame>
  );
}

/* ---------- 3. Downloadable reports ---------- */
export function AppExports() {
  const cards: [string, string][] = [["Carbon footprint report", "Share your Scope 1, 2, and 3 results."], ["Company summary", "A one-page overview for stakeholders."], ["Supplier scorecard", "Progress across your engaged suppliers."]];
  return (
    <AppFrame crumb="My resources / Reports" active="My resources">
      <div className="font-display text-sm font-bold" style={{ color: GK.ink }}>Downloadable reports</div>
      <div className="text-[0.52rem]" style={{ color: GK.muted }}>Export evidence-backed outputs in one click</div>
      <div className="mt-3 grid grid-cols-3 gap-2">
        {cards.map(([t, d]) => (
          <div key={t} className="rounded-lg border border-[#eef1ef] p-2.5">
            <div className="mb-2 h-14 rounded-md" style={{ background: "linear-gradient(160deg,#e9fbef,#cdf1da)" }} />
            <div className="text-[0.56rem] font-bold" style={{ color: GK.ink }}>{t}</div>
            <div className="mt-0.5 text-[0.46rem] leading-snug" style={{ color: GK.muted }}>{d}</div>
            <div className="mt-2 rounded border border-[#dbe7e0] py-1 text-center text-[0.5rem] font-semibold" style={{ color: GK.greenDk }}>Download</div>
          </div>
        ))}
      </div>
    </AppFrame>
  );
}

/* ---------- 4. Suppliers engagement dashboard (big) ---------- */
export function AppSuppliersDashboard() {
  const { ref, inView } = useReveal();
  const bars: [string, number, string][] = [["Invited", 282, "#123f28"], ["Accounts created", 154, "#2f9e5f"], ["Started", 121, "#7fd9a3"], ["Rated", 73, "#bfe9cf"]];
  return (
    <AppFrame crumb="Suppliers / Engagement" active="Suppliers">
      <div ref={ref} className="font-display text-sm font-bold" style={{ color: GK.ink }}>Suppliers engagement</div>
      <div className="mt-1 flex gap-3 border-b border-[#eef1ef] pb-1.5 text-[0.5rem]" style={{ color: GK.muted }}>
        {["Overview", "Emissions", "Recommendations", "Commitment follow-up"].map((t, i) => <span key={t} className={i === 0 ? "font-semibold" : ""} style={{ color: i === 0 ? GK.greenDk : GK.muted, borderBottom: i === 0 ? `1.5px solid ${GK.green}` : "none", paddingBottom: 4 }}>{t}</span>)}
      </div>
      <div className="mt-2.5 grid grid-cols-3 gap-2">
        <Stat label="Suppliers total" value={<Count to={306} play={inView} />} />
        <Stat label="Suppliers with verified data" value={<Count to={33} play={inView} />} />
        <Stat label="SBTi-validated suppliers" value={<Count to={34} play={inView} />} />
      </div>
      <div className="mt-2 grid grid-cols-3 gap-2">
        <div className="rounded-lg border border-[#eef1ef] p-2">
          <div className="text-[0.5rem] font-semibold" style={{ color: GK.ink }}>Supplier commitment</div>
          <div className="mt-2 flex h-16 items-end gap-1.5">
            {bars.map(([l, v, c], i) => (
              <motion.div key={l} className="flex-1 rounded-t-[2px]" style={{ background: c }} initial={{ height: 0 }} animate={inView ? { height: `${(v / 300) * 100}%` } : {}} transition={{ duration: 0.7, delay: 0.2 + i * 0.08 }} />
            ))}
          </div>
          <div className="mt-0.5 flex gap-1.5">
            {bars.map(([l, v]) => <span key={l} className="flex-1 text-center text-[0.38rem]" style={{ color: GK.muted }}>{v}</span>)}
          </div>
        </div>
        <div className="flex items-center gap-2 rounded-lg border border-[#eef1ef] p-2">
          <Ring pct={70} size={48} />
          <div className="text-[0.44rem]" style={{ color: GK.muted }}><div className="mb-0.5 font-semibold" style={{ color: GK.ink }}>By category</div>Digital · Industrial<br />Services · Audit</div>
        </div>
        <div className="flex items-center gap-2 rounded-lg border border-[#eef1ef] p-2">
          <Ring pct={62} size={48} color={GK.green} />
          <div className="text-[0.44rem]" style={{ color: GK.muted }}><div className="mb-0.5 font-semibold" style={{ color: GK.ink }}>Score breakdown</div>A+ · A · B<br />C · D</div>
        </div>
      </div>
    </AppFrame>
  );
}

/* ---------- Small: questionnaire scores ---------- */
export function QuestionnaireScores() {
  const { ref, inView } = useReveal();
  const rows: [string, number, string][] = [["Climate actions", 60, "6/10"], ["Precision of GHG assessment", 40, "4/10"]];
  return (
    <div ref={ref} className="space-y-3">
      {rows.map(([n, w, s], i) => (
        <div key={n}>
          <div className="flex items-center justify-between"><span className="text-[0.68rem] font-medium" style={{ color: GK.ink }}>{n}</span><span className="rounded border border-[#dbe7e0] px-1.5 py-0.5 text-[0.54rem]" style={{ color: GK.muted }}>Questionnaire</span></div>
          <div className="mt-1.5 flex items-center gap-2">
            <div className="h-2 flex-1 overflow-hidden rounded-full" style={{ background: "#eef4ee" }}><motion.div className="h-full rounded-full" style={{ background: GK.green }} initial={{ width: 0 }} animate={inView ? { width: `${w}%` } : {}} transition={{ duration: 0.8, delay: 0.2 + i * 0.1 }} /></div>
            <span className="text-[0.58rem] font-semibold tabular-nums" style={{ color: GK.muted }}>{s}</span>
          </div>
        </div>
      ))}
    </div>
  );
}

/* ---------- Small: emission-factor source grid ---------- */
const FI = ["M4 6c0-1.7 3.6-3 8-3s8 1.3 8 3-3.6 3-8 3-8-1.3-8-3zM4 6v12c0 1.7 3.6 3 8 3s8-1.3 8-3V6", "M3 13h18l-2-5H5zM6 17a2 2 0 1 0 0-.01M18 17a2 2 0 1 0 0-.01", "M3 21h18M5 21V9l7-5 7 5v12M9 21v-6h6v6", "M9 15a4 4 0 0 0 6 0l3-3a4 4 0 0 0-6-6l-1 1", "M2 12l20-8-8 20-2-8z"];
export function FactorIconGrid() {
  const { ref, inView } = useReveal();
  return (
    <div ref={ref} className="grid max-w-[220px] grid-cols-5 gap-2">
      {FI.map((d, i) => (
        <motion.span key={i} className="grid h-10 w-10 place-items-center rounded-lg" style={{ background: i === 2 ? GK.green : "#f2f6f3" }}
          initial={{ opacity: 0, scale: 0.7 }} animate={inView ? { opacity: 1, scale: 1 } : {}} transition={{ delay: 0.1 + i * 0.08, ease: "backOut" }}>
          <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke={i === 2 ? "#fff" : GK.ink} strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"><path d={d} /></svg>
        </motion.span>
      ))}
    </div>
  );
}

/* ---------- Small: compliance app frames ---------- */
export function AppSbtiTable() {
  const rows = [["Northgate Components", "36.4", "A"], ["Skyline Freight", "52.4", "B"], ["Vertex Materials", "36.4", "A"], ["Orbit Services", "40.4", "C"]];
  return (
    <AppFrame crumb="Suppliers / SBTi commitment" active="Suppliers">
      <div className="text-[0.62rem] font-bold" style={{ color: GK.ink }}>Commit your company to SBTi</div>
      <div className="mt-2 overflow-hidden rounded-md border border-[#eef1ef]">
        <div className="grid grid-cols-[1.6fr_0.6fr_0.5fr] bg-[#f7faf8] px-2 py-1 text-[0.44rem] font-semibold uppercase" style={{ color: GK.muted }}><span>Supplier</span><span>tCO₂e</span><span>SBTi</span></div>
        {rows.map(([n, e, s]) => (
          <div key={n} className="grid grid-cols-[1.6fr_0.6fr_0.5fr] items-center border-t border-[#f2f5f3] px-2 py-1.5 text-[0.52rem]"><span className="truncate" style={{ color: GK.ink }}>{n}</span><span style={{ color: GK.muted }}>{e}</span><span className="grid h-3 w-3 place-items-center rounded-full text-[0.4rem] font-bold text-white" style={{ background: s === "A" ? GK.green : s === "B" ? "#7fd9a3" : "#cbd5cf" }}>✓</span></div>
        ))}
      </div>
    </AppFrame>
  );
}

export function AppCsrdUpload() {
  return (
    <AppFrame crumb="CSRD / Supplier data" active="CSRD">
      <div className="text-[0.62rem] font-bold" style={{ color: GK.ink }}>Import your supplier data</div>
      <div className="mt-2 space-y-1.5">
        {["Download template", "Upload your supplier data file"].map((s, i) => (
          <div key={s} className="flex items-center justify-between rounded-md border border-[#eef1ef] px-2 py-1.5 text-[0.54rem]" style={{ color: GK.ink }}>
            <span>{i + 1}. {s}</span><span className="rounded px-1.5 py-0.5 text-[0.46rem] font-semibold text-white" style={{ background: i ? GK.green : "#cbd5cf" }}>{i ? "Extract" : "Download"}</span>
          </div>
        ))}
      </div>
      <div className="mt-2 rounded-md bg-[#ecfdf3] px-2 py-1.5 text-[0.5rem] font-semibold" style={{ color: GK.greenDk }}>ESRS datapoints mapped automatically</div>
    </AppFrame>
  );
}

export function AppCbamQuestionnaire() {
  return (
    <AppFrame crumb="Questionnaires / CBAM" active="Data">
      <div className="flex items-center justify-between">
        <div className="text-[0.62rem] font-bold" style={{ color: GK.ink }}>Supplier questionnaire</div>
        <span className="rounded bg-[#ecfdf3] px-1.5 py-0.5 text-[0.46rem] font-bold" style={{ color: GK.greenDk }}>✓ CBAM</span>
      </div>
      <div className="mt-2 space-y-1.5">
        {["Have you conducted a GHG assessment?", "What share of your goods is covered?"].map((q) => (
          <div key={q} className="rounded-md border border-[#eef1ef] p-2">
            <div className="text-[0.5rem]" style={{ color: GK.ink }}>{q}</div>
            <div className="mt-1 flex gap-2">{["Yes", "No"].map((o, i) => <span key={o} className="flex items-center gap-1 text-[0.46rem]" style={{ color: GK.muted }}><span className="grid h-2 w-2 place-items-center rounded-full border" style={{ borderColor: i ? "#cbd5cf" : GK.green }}>{!i && <span className="h-1 w-1 rounded-full" style={{ background: GK.green }} />}</span>{o}</span>)}</div>
          </div>
        ))}
      </div>
    </AppFrame>
  );
}
