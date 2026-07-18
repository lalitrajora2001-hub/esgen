"use client";

import {
  PieChart, Pie, Cell, ResponsiveContainer, Tooltip,
  BarChart, Bar, XAxis, YAxis, CartesianGrid,
} from "recharts";
import type { BrsrReport, ResponseMap } from "@/lib/brsr/db";
import type { Company } from "@/lib/tool/types";
import { dashboardData, fmtNum } from "@/lib/brsr/dashboard";
import { Button } from "@/components/ui/Button";

const SCOPE_COLORS = ["#0f766e", "#10b981", "#6ee7b7"];
const ENERGY_COLORS = ["#10b981", "#cbd5e1"];
const GRID = "#e4e7ec";
const AXIS = "#667085";
const tip = { background: "#ffffff", border: "1px solid #e4e7ec", borderRadius: 10, color: "#131820", fontSize: 12, boxShadow: "0 4px 14px -6px rgba(16,24,40,0.12)" } as const;

export function Dashboard({
  report, company, responses, onNavigate,
}: {
  report: BrsrReport;
  company: Company | null;
  responses: ResponseMap;
  onNavigate: (key: string) => void;
}) {
  const d = dashboardData(responses, report, company);

  return (
    <div>
      <header className="mb-5 flex flex-wrap items-end justify-between gap-3">
        <div>
          <h2 className="text-lg font-semibold">Sustainability dashboard</h2>
          <p className="mt-1 text-sm text-text-muted">Live insights from your BRSR Core data · FY {report.financial_year}. Indicative, not assured figures.</p>
        </div>
      </header>

      {!d.hasData ? (
        <div className="card grid place-items-center p-12 text-center">
          <h3 className="text-base font-semibold">No insights yet</h3>
          <p className="mt-2 max-w-sm text-sm text-text-muted">Enter your Scope 1/2/3 emissions, energy, water and waste in the Collect screen and this dashboard fills in automatically.</p>
          <Button className="mt-5" onClick={() => onNavigate("__core__")}>Go to Collect</Button>
        </div>
      ) : (
        <div className="space-y-5">
          {/* Stat cards */}
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <Stat label="Total emissions" value={fmtNum(d.totalGhg)} unit="tCO2e" trend={d.ghgYoyPct} trendGoodDown icon={<CloudIcon />} tone="#0f766e" />
            <Stat label="Scope 1 + 2 (Core)" value={fmtNum(d.coreGhg)} unit="tCO2e" icon={<LayersIcon />} tone="#2f6fe0" />
            <Stat label="Emissions / employee" value={fmtNum(d.intensityPerEmployee)} unit="tCO2e" icon={<UserIcon />} tone="#7c5cff" />
            <Stat label="Renewable energy" value={d.renewablePct == null ? "—" : fmtNum(d.renewablePct)} unit="%" accentGood icon={<BoltIcon />} tone="#10b981" />
          </div>

          {/* Charts */}
          <div className="grid gap-4 lg:grid-cols-3">
            <section className="card p-5">
              <h3 className="font-display text-base font-semibold">Emissions by scope</h3>
              <Donut
                data={[
                  { name: "Scope 1", value: d.scope1 },
                  { name: "Scope 2", value: d.scope2 },
                  { name: "Scope 3", value: d.scope3 },
                ].filter((x) => x.value > 0)}
                colors={SCOPE_COLORS}
                center={`${fmtNum(d.totalGhg)}`}
                centerSub="tCO2e"
              />
              <ul className="mt-3 space-y-1.5 text-sm">
                <LegendRow color={SCOPE_COLORS[0]} label="Scope 1 (direct)" value={`${fmtNum(d.scope1)} t`} />
                <LegendRow color={SCOPE_COLORS[1]} label="Scope 2 (energy)" value={`${fmtNum(d.scope2)} t`} />
                <LegendRow color={SCOPE_COLORS[2]} label="Scope 3 (value chain)" value={`${fmtNum(d.scope3)} t`} />
              </ul>
            </section>

            <section className="card p-5">
              <h3 className="font-display text-base font-semibold">Energy mix</h3>
              {d.energyTotal ? (
                <>
                  <Donut
                    data={[
                      { name: "Renewable", value: d.energyRenewable ?? 0 },
                      { name: "Non-renewable", value: d.energyNonRenewable ?? 0 },
                    ].filter((x) => x.value > 0)}
                    colors={ENERGY_COLORS}
                    center={d.renewablePct == null ? "—" : `${Math.round(d.renewablePct)}%`}
                    centerSub="renewable"
                  />
                  <ul className="mt-3 space-y-1.5 text-sm">
                    <LegendRow color={ENERGY_COLORS[0]} label="Renewable" value={`${fmtNum(d.energyRenewable)}`} />
                    <LegendRow color={ENERGY_COLORS[1]} label="Non-renewable" value={`${fmtNum(d.energyNonRenewable)}`} />
                  </ul>
                </>
              ) : (
                <EmptyMini label="Add energy data (Principle 6)" />
              )}
            </section>

            <section className="card p-5">
              <h3 className="font-display text-base font-semibold">Year on year</h3>
              {d.prevTotalGhg != null ? (
                <div className="h-56">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={[{ name: "Previous FY", value: d.prevTotalGhg }, { name: "Current FY", value: d.totalGhg }]} margin={{ left: 4, right: 8, top: 12, bottom: 4 }}>
                      <CartesianGrid vertical={false} stroke={GRID} />
                      <XAxis dataKey="name" stroke={AXIS} tick={{ fontSize: 11 }} tickLine={false} axisLine={{ stroke: GRID }} />
                      <YAxis stroke={AXIS} tick={{ fontSize: 11 }} tickLine={false} axisLine={false} width={40} />
                      <Tooltip contentStyle={tip} formatter={(v) => [`${fmtNum(Number(v))} tCO2e`, ""]} cursor={{ fill: "rgba(16,185,129,0.06)" }} />
                      <Bar dataKey="value" radius={[6, 6, 0, 0]} isAnimationActive={false}>
                        <Cell fill="#a7f3d0" />
                        <Cell fill="#0f766e" />
                      </Bar>
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              ) : (
                <EmptyMini label="Add previous-year data to compare" />
              )}
            </section>
          </div>

          {/* Footprint tiles */}
          <div className="grid gap-4 sm:grid-cols-3">
            <Footprint label="Energy consumed" value={fmtNum(d.energyTotal)} unit="GJ" />
            <Footprint label="Water consumed" value={fmtNum(d.waterConsumption)} unit="kL" />
            <Footprint label="Waste generated" value={fmtNum(d.wasteGenerated)} unit="MT" />
          </div>

          <p className="rounded-xl border border-border bg-surface-2/60 p-3 text-xs leading-relaxed text-text-muted">
            Dashboard figures are computed from the data you enter and are indicative. Your formal BRSR report becomes
            available once all data is submitted and reviewed.
          </p>
        </div>
      )}
    </div>
  );
}

function Stat({ label, value, unit, trend, trendGoodDown, accentGood, icon, tone }: { label: string; value: string; unit: string; trend?: number | null; trendGoodDown?: boolean; accentGood?: boolean; icon?: React.ReactNode; tone?: string }) {
  const up = trend != null && trend > 0;
  const good = trend == null ? false : trendGoodDown ? trend < 0 : trend > 0;
  return (
    <div className="card p-5">
      <div className="flex items-start justify-between gap-2">
        <p className="text-xs uppercase tracking-wide text-text-muted">{label}</p>
        {icon && (
          <span className="grid h-9 w-9 shrink-0 place-items-center rounded-full" style={{ background: `${tone ?? "#667085"}14`, color: tone ?? "#667085" }}>
            {icon}
          </span>
        )}
      </div>
      <p className="mt-3 flex items-baseline gap-1.5">
        <span className={`font-display text-[2rem] font-semibold leading-none ${accentGood ? "text-teal" : ""}`}>{value}</span>
        <span className="text-xs text-text-muted">{unit}</span>
      </p>
      {trend != null && (
        <p className={`mt-2 inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-xs font-medium ${good ? "bg-teal/10 text-teal" : "bg-[#e5484d]/10 text-[#b42318]"}`}>
          {up ? "▲" : "▼"} {Math.abs(Math.round(trend))}% vs last year
        </p>
      )}
    </div>
  );
}

function CloudIcon() { return <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="h-4 w-4"><path d="M17.5 19a4.5 4.5 0 0 0 .5-8.98A6 6 0 0 0 6.5 10 4 4 0 0 0 7 18h10.5z" strokeLinecap="round" strokeLinejoin="round" /></svg>; }
function LayersIcon() { return <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="h-4 w-4"><path d="M12 3l9 5-9 5-9-5 9-5zM3 13l9 5 9-5M3 17l9 5 9-5" strokeLinecap="round" strokeLinejoin="round" /></svg>; }
function UserIcon() { return <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="h-4 w-4"><circle cx="12" cy="8" r="4" /><path d="M4 21a8 8 0 0 1 16 0" strokeLinecap="round" /></svg>; }
function BoltIcon() { return <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="h-4 w-4"><path d="M13 2L4 14h7l-1 8 9-12h-7l1-8z" strokeLinejoin="round" /></svg>; }

function Donut({ data, colors, center, centerSub }: { data: { name: string; value: number }[]; colors: string[]; center: string; centerSub: string }) {
  if (data.length === 0) return <EmptyMini label="No data" />;
  return (
    <div className="relative h-52">
      <ResponsiveContainer width="100%" height="100%">
        <PieChart>
          <Pie data={data} dataKey="value" nameKey="name" innerRadius="62%" outerRadius="88%" paddingAngle={2} stroke="none" isAnimationActive={false}>
            {data.map((_, i) => <Cell key={i} fill={colors[i % colors.length]} />)}
          </Pie>
          <Tooltip contentStyle={tip} formatter={(v) => [`${fmtNum(Number(v))}`, ""]} />
        </PieChart>
      </ResponsiveContainer>
      <div className="pointer-events-none absolute inset-0 flex flex-col items-center justify-center">
        <span className="font-display text-xl font-semibold">{center}</span>
        <span className="text-[11px] text-text-muted">{centerSub}</span>
      </div>
    </div>
  );
}

function LegendRow({ color, label, value }: { color: string; label: string; value: string }) {
  return (
    <li className="flex items-center justify-between">
      <span className="flex items-center gap-2 text-text-muted"><span className="h-2.5 w-2.5 rounded-full" style={{ background: color }} />{label}</span>
      <span className="font-medium text-text">{value}</span>
    </li>
  );
}

function Footprint({ label, value, unit }: { label: string; value: string; unit: string }) {
  return (
    <div className="card p-5">
      <p className="text-xs uppercase tracking-wide text-text-muted">{label}</p>
      <p className="mt-2 flex items-baseline gap-1.5"><span className="font-display text-2xl font-semibold">{value}</span><span className="text-xs text-text-muted">{unit}</span></p>
    </div>
  );
}

function EmptyMini({ label }: { label: string }) {
  return <div className="grid h-52 place-items-center rounded-xl border border-dashed border-border text-sm text-text-muted">{label}</div>;
}
