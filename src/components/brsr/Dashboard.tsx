"use client";

import { useMemo, useState } from "react";
import {
  PieChart, Pie, Cell, ResponsiveContainer, Tooltip,
  BarChart, Bar, XAxis, YAxis, CartesianGrid, LabelList,
} from "recharts";
import type { BrsrReport, ResponseMap, EvidenceFile } from "@/lib/brsr/db";
import type { Company } from "@/lib/tool/types";
import type { KpiStatus } from "@/lib/brsr/pro";
import { dashboardData, fmtNum } from "@/lib/brsr/dashboard";
import { BRSR, allQuestions, moduleQuestions } from "@/lib/brsr/framework";
import { isAnswered, moduleCompletion } from "@/lib/brsr/calc";
import { Button } from "@/components/ui/Button";
import { cn } from "@/lib/cn";

/**
 * The ESGEN sustainability dashboard. Every figure is computed from data the
 * client entered in Collect (Principle 6 tables, calculator activity lines,
 * report turnover). Panels without data render an honest empty state, never a
 * fabricated number.
 */

const S1 = "#047857";
const S2 = "#10b981";
const S3 = "#6ee7b7";
const PREV = "#c9d6cd";
const BLUE = "#3b82f6";
const BLUE_LT = "#93c5fd";
const AMBER = "#f59e0b";
const VIOLET = "#8b5cf6";
const SLATE = "#64748b";
const RED = "#b42318";
const GRID = "#e2ebe4";
const AXIS = "#5b6f64";
const tip = { background: "#ffffff", border: "1px solid #e4e7ec", borderRadius: 10, color: "#131820", fontSize: 12, boxShadow: "0 4px 14px -6px rgba(16,24,40,0.12)" } as const;

type ScopeTab = "overview" | "s1" | "s2" | "s3";

export function Dashboard({
  report, company, responses, evidence, kpiStatuses, onNavigate,
}: {
  report: BrsrReport;
  company: Company | null;
  responses: ResponseMap;
  evidence: EvidenceFile[];
  kpiStatuses: Record<string, KpiStatus>;
  onNavigate: (key: string) => void;
}) {
  const d = useMemo(() => dashboardData(responses, report, company), [responses, report, company]);
  const [tab, setTab] = useState<ScopeTab>("overview");

  // ---- data-trust metrics (BRSR Core collection & evidence) ----
  const trust = useMemo(() => {
    const core = allQuestions().filter((q) => q.isCore);
    const evidenceKeys = new Set(evidence.map((e) => e.question_key));
    let validated = 0, withEvidence = 0, answered = 0, inProgress = 0, na = 0;
    const missingEvidence: string[] = [];
    for (const q of core) {
      const manual = kpiStatuses[q.key]?.status;
      if (manual === "not_applicable") { na++; continue; }
      const ans = isAnswered(responses[q.key]);
      const ev = evidenceKeys.has(q.key);
      if (manual === "validated" || manual === "assurance_ready") validated++;
      else if (ans && ev) withEvidence++;
      else if (ans) { answered++; if (!ev) missingEvidence.push(q.code ?? q.key); }
      else if (manual === "in_progress") inProgress++;
    }
    const total = core.length - na;
    const notStarted = Math.max(0, total - validated - withEvidence - answered - inProgress);
    return { total, validated, withEvidence, answered, inProgress, notStarted, missingEvidence };
  }, [responses, evidence, kpiStatuses]);

  const modules = useMemo(
    () => BRSR.modules.map((m) => ({ key: m.key, label: m.navLabel, ...moduleCompletion(moduleQuestions(m), responses) })),
    [responses],
  );

  if (!d.hasData) {
    return (
      <div>
        <DashHeader report={report} />
        <div className="card grid place-items-center p-12 text-center">
          <span className="grid h-12 w-12 place-items-center rounded-full bg-teal/10 text-teal">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" className="h-6 w-6"><path d="M4 20V10M10 20V4M16 20v-7M21 20H3" strokeLinecap="round" /></svg>
          </span>
          <h3 className="mt-4 text-base font-semibold">No insights yet</h3>
          <p className="mt-2 max-w-sm text-sm text-text-muted">
            Enter your Scope 1/2/3 emissions, energy, water and waste in the Collect screen and this
            dashboard fills in automatically.
          </p>
          <Button className="mt-5" onClick={() => onNavigate("__core__")}>Go to Collect</Button>
        </div>
      </div>
    );
  }

  const scopeShare = (v: number) => (d.totalGhg > 0 ? (v / d.totalGhg) * 100 : 0);

  return (
    <div className="space-y-5">
      <DashHeader report={report} />

      {/* ---- KPI strip ---- */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-6">
        <Stat label="Total emissions" value={fmtNum(d.totalGhg)} unit="tCO2e" trend={d.ghgYoyPct} trendGoodDown icon={<CloudIcon />} tone={S1} />
        <Stat label="Scope 1 + 2 (Core)" value={fmtNum(d.coreGhg)} unit="tCO2e" trend={d.coreYoyPct} trendGoodDown icon={<LayersIcon />} tone="#0d9488" />
        <Stat
          label="GHG intensity"
          value={d.intensityPerCrore == null ? "—" : fmtNum(d.intensityPerCrore, 2)}
          unit="tCO2e / ₹ Cr"
          sub={d.intensityPerCrorePpp != null ? `PPP-adjusted: ${fmtNum(d.intensityPerCrorePpp, 2)}` : "Add turnover for intensity"}
          icon={<GaugeIcon />} tone={VIOLET}
        />
        <Stat
          label="Energy consumed" value={fmtNum(d.energyTotal)} unit="GJ" trend={d.energyYoyPct} trendGoodDown
          sub={d.renewablePct != null ? `${Math.round(d.renewablePct)}% renewable` : undefined}
          icon={<BoltIcon />} tone="#22c55e"
        />
        <Stat label="Water consumed" value={fmtNum(d.waterConsumption)} unit="kL" trend={d.waterYoyPct} trendGoodDown icon={<DropIcon />} tone={BLUE} />
        <Stat
          label="Waste generated" value={fmtNum(d.wasteGenerated)} unit="MT" trend={d.wasteYoyPct} trendGoodDown
          sub={d.wasteDiversionPct != null ? `${Math.round(d.wasteDiversionPct)}% recovered` : undefined}
          icon={<TrashIcon />} tone={AMBER}
        />
      </div>

      {/* ---- Emissions: scope tabs ---- */}
      <section className="card overflow-hidden">
        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-border px-5 py-3">
          <div className="inline-flex gap-1 rounded-full bg-surface-2 p-1">
            {([
              { k: "overview", label: "Emission overview" },
              { k: "s1", label: "Scope 1" },
              { k: "s2", label: "Scope 2" },
              { k: "s3", label: "Scope 3" },
            ] as { k: ScopeTab; label: string }[]).map((t) => (
              <button
                key={t.k}
                onClick={() => setTab(t.k)}
                aria-pressed={tab === t.k}
                className={cn(
                  "rounded-full px-4 py-1.5 text-sm transition",
                  tab === t.k ? "bg-white font-semibold text-text shadow-sm" : "font-medium text-text-muted hover:text-text",
                )}
              >
                {t.label}
              </button>
            ))}
          </div>
          <p className="text-[11px] text-text-muted">Scope 1 &amp; 2: EI.7 · Scope 3: LI.2</p>
        </div>

        <div className="p-5">
          {tab === "overview" && (
            <div className="grid gap-6 lg:grid-cols-3">
              {/* Donut */}
              <div>
                <PanelTitle title="Emissions by scope" sub={`FY ${report.financial_year}`} />
                <Donut
                  data={[
                    { name: "Scope 1", value: d.scope1 },
                    { name: "Scope 2", value: d.scope2 },
                    { name: "Scope 3", value: d.scope3 },
                  ].filter((x) => x.value > 0)}
                  colors={[S1, S2, S3]}
                  center={fmtNum(d.totalGhg)}
                  centerSub="tCO2e"
                />
                <ul className="mt-3 space-y-1.5 text-sm">
                  <LegendRow color={S1} label="Scope 1 (direct)" value={`${fmtNum(d.scope1)} t · ${Math.round(scopeShare(d.scope1))}%`} />
                  <LegendRow color={S2} label="Scope 2 (energy)" value={`${fmtNum(d.scope2)} t · ${Math.round(scopeShare(d.scope2))}%`} />
                  <LegendRow color={S3} label="Scope 3 (value chain)" value={`${fmtNum(d.scope3)} t · ${Math.round(scopeShare(d.scope3))}%`} />
                </ul>
              </div>

              {/* YoY per scope */}
              <div>
                <PanelTitle title="Year on year, by scope" sub="Previous vs current FY" />
                {d.prevTotalGhg != null ? (
                  <>
                    <div className="h-56">
                      <ResponsiveContainer width="100%" height="100%">
                        <BarChart
                          data={[
                            { name: "Scope 1", Previous: d.scope1Prev ?? 0, Current: d.scope1 },
                            { name: "Scope 2", Previous: d.scope2Prev ?? 0, Current: d.scope2 },
                            { name: "Scope 3", Previous: d.scope3Prev ?? 0, Current: d.scope3 },
                          ]}
                          margin={{ left: 4, right: 8, top: 12, bottom: 4 }}
                          barGap={3}
                        >
                          <CartesianGrid vertical={false} stroke={GRID} />
                          <XAxis dataKey="name" stroke={AXIS} tick={{ fontSize: 11 }} tickLine={false} axisLine={{ stroke: GRID }} />
                          <YAxis stroke={AXIS} tick={{ fontSize: 11 }} tickLine={false} axisLine={false} width={44} />
                          <Tooltip contentStyle={tip} formatter={(v) => [`${fmtNum(Number(v))} tCO2e`, ""]} cursor={{ fill: "rgba(16,185,129,0.06)" }} />
                          <Bar dataKey="Previous" fill={PREV} radius={[5, 5, 0, 0]} isAnimationActive={false} />
                          <Bar dataKey="Current" fill={S1} radius={[5, 5, 0, 0]} isAnimationActive={false} />
                        </BarChart>
                      </ResponsiveContainer>
                    </div>
                    <div className="mt-2 flex items-center gap-4 text-xs text-text-muted">
                      <span className="flex items-center gap-1.5"><Swatch color={PREV} /> Previous FY</span>
                      <span className="flex items-center gap-1.5"><Swatch color={S1} /> Current FY</span>
                    </div>
                  </>
                ) : (
                  <EmptyMini label="Add previous-year values in Collect to compare years" />
                )}
              </div>

              {/* Emission sources or intensity detail */}
              <div>
                {d.activityLines.length > 0 ? (
                  <>
                    <PanelTitle title="Top emission sources" sub="From your calculator activity data" />
                    <HBars
                      data={d.activityLines.slice(0, 6).map((l) => ({ label: l.label, value: l.tco2e }))}
                      color={S1}
                      unit="tCO2e"
                    />
                    <p className="mt-2 text-[11px] text-text-muted">Source: Emissions calculator activity lines.</p>
                  </>
                ) : (
                  <>
                    <PanelTitle title="Intensity" sub="BRSR Core denominators" />
                    <div className="space-y-3">
                      <MiniMetric label="Per ₹ crore turnover (S1+2)" value={d.intensityPerCrore == null ? "—" : `${fmtNum(d.intensityPerCrore, 2)} tCO2e`} />
                      <MiniMetric label="PPP-adjusted (S1+2)" value={d.intensityPerCrorePpp == null ? "—" : `${fmtNum(d.intensityPerCrorePpp, 2)} tCO2e`} />
                      <MiniMetric label="Per employee (all scopes)" value={d.intensityPerEmployee == null ? "—" : `${fmtNum(d.intensityPerEmployee, 2)} tCO2e`} />
                      <MiniMetric label="Energy per ₹ crore" value={d.energyIntensityPerCrore == null ? "—" : `${fmtNum(d.energyIntensityPerCrore, 1)} GJ`} />
                    </div>
                    <p className="mt-3 text-[11px] leading-relaxed text-text-muted">
                      Intensity ratios use the turnover and PPP factor on this report. Log activity data in the
                      Emissions calculator to see a source breakdown here.
                    </p>
                  </>
                )}
              </div>
            </div>
          )}

          {tab === "s1" && (
            <ScopeDetail
              color={S1}
              name="Scope 1 · Direct emissions"
              value={d.scope1}
              yoy={d.scope1YoyPct}
              share={scopeShare(d.scope1)}
              covers="Fuel burned in your own operations: stationary combustion (DG sets, boilers, furnaces), company vehicles, process emissions and refrigerant leaks."
              collectedIn="Principle 6 · Essential Indicator 7"
              lines={d.activityLines.filter((l) => l.scope === 1)}
              onNavigate={onNavigate}
            />
          )}
          {tab === "s2" && (
            <ScopeDetail
              color={S2}
              name="Scope 2 · Purchased energy"
              value={d.scope2}
              yoy={d.scope2YoyPct}
              share={scopeShare(d.scope2)}
              covers="Grid electricity, purchased heat, steam and cooling. Computed with the CEA all-India grid factor (0.7117 tCO2e/MWh, v21.0) unless you use a supplier-specific factor."
              collectedIn="Principle 6 · Essential Indicator 7"
              lines={d.activityLines.filter((l) => l.scope === 2)}
              onNavigate={onNavigate}
              extra={
                d.renewablePct != null ? (
                  <div className="mt-4 rounded-xl border border-border bg-surface-2/50 p-3 text-xs text-text-muted">
                    Renewable share of your total energy: <span className="font-semibold text-text">{Math.round(d.renewablePct)}%</span>.
                    Raising it directly reduces Scope 2.
                  </div>
                ) : null
              }
            />
          )}
          {tab === "s3" && (
            <ScopeDetail
              color={S3}
              name="Scope 3 · Value chain"
              value={d.scope3}
              yoy={d.scope3YoyPct}
              share={scopeShare(d.scope3)}
              covers="Emissions you cause but do not own: purchased goods and services, transport and distribution, business travel, employee commuting, use of sold products and 10 more GHG Protocol categories. Usually the largest share of a company's footprint."
              collectedIn="Principle 6 · Leadership Indicator 2"
              lines={d.activityLines.filter((l) => l.scope === 3)}
              onNavigate={onNavigate}
            />
          )}
        </div>
      </section>

      {/* ---- Environment: energy / water / waste ---- */}
      <div className="grid gap-4 lg:grid-cols-3">
        {/* Energy */}
        <section className="card p-5">
          <PanelTitle title="Energy mix" sub="Principle 6 · EI.1" />
          {d.energyTotal ? (
            <>
              <Donut
                data={[
                  { name: "Renewable", value: d.energyRenewable ?? 0 },
                  { name: "Non-renewable", value: d.energyNonRenewable ?? 0 },
                ].filter((x) => x.value > 0)}
                colors={[S2, PREV]}
                center={d.renewablePct == null ? "—" : `${Math.round(d.renewablePct)}%`}
                centerSub="renewable"
                small
              />
              {d.energyBreakdown.length > 0 ? (
                <div className="mt-3">
                  <HBars data={d.energyBreakdown.map((b) => ({ label: b.label, value: b.value }))} color={S2} unit="" compact />
                </div>
              ) : (
                <ul className="mt-3 space-y-1.5 text-sm">
                  <LegendRow color={S2} label="Renewable" value={fmtNum(d.energyRenewable)} />
                  <LegendRow color={PREV} label="Non-renewable" value={fmtNum(d.energyNonRenewable)} />
                </ul>
              )}
            </>
          ) : (
            <EmptyMini label="Add energy data in Collect (EI.1)" onGo={() => onNavigate("__core__")} />
          )}
        </section>

        {/* Water */}
        <section className="card p-5">
          <PanelTitle title="Water" sub="Principle 6 · EI.3 / EI.4" />
          {d.waterWithdrawalTotal || d.waterConsumption ? (
            <>
              <div className="grid grid-cols-3 gap-2">
                <MiniStat label="Withdrawn" value={fmtNum(d.waterWithdrawalTotal)} unit="kL" />
                <MiniStat label="Consumed" value={fmtNum(d.waterConsumption)} unit="kL" />
                <MiniStat label="Discharged" value={fmtNum(d.waterDischargeTotal)} unit="kL" />
              </div>
              {d.waterWithdrawal.length > 0 && (
                <div className="mt-4">
                  <p className="mb-2 text-xs font-medium text-text-muted">Withdrawal by source</p>
                  <HBars data={d.waterWithdrawal.map((w) => ({ label: w.label, value: w.value }))} color={BLUE} unit="kL" compact />
                </div>
              )}
              {(d.waterDischargeTreated != null || d.waterDischargeUntreated != null) && (
                <SplitBar
                  className="mt-4"
                  label="Discharge treatment"
                  a={{ label: "Treated", value: d.waterDischargeTreated ?? 0, color: BLUE }}
                  b={{ label: "Untreated", value: d.waterDischargeUntreated ?? 0, color: BLUE_LT }}
                  warnB
                />
              )}
            </>
          ) : (
            <EmptyMini label="Add water data in Collect (EI.3)" onGo={() => onNavigate("__core__")} />
          )}
        </section>

        {/* Waste */}
        <section className="card p-5">
          <PanelTitle title="Waste" sub="Principle 6 · EI.9" />
          {d.wasteGenerated ? (
            <>
              <div className="grid grid-cols-3 gap-2">
                <MiniStat label="Generated" value={fmtNum(d.wasteGenerated)} unit="MT" />
                <MiniStat label="Recovered" value={fmtNum(d.wasteRecovered)} unit="MT" good />
                <MiniStat label="Disposed" value={fmtNum(d.wasteDisposed)} unit="MT" />
              </div>
              {d.wasteByCategory.length > 0 && (
                <div className="mt-4">
                  <p className="mb-2 text-xs font-medium text-text-muted">Generated by category</p>
                  <HBars data={d.wasteByCategory.slice(0, 5).map((w) => ({ label: w.label, value: w.value }))} color={AMBER} unit="MT" compact />
                </div>
              )}
              {(d.wasteRecovered != null && d.wasteDisposed != null && (d.wasteRecovered > 0 || d.wasteDisposed > 0)) && (
                <SplitBar
                  className="mt-4"
                  label="Recovered vs disposed"
                  a={{ label: "Recovered", value: d.wasteRecovered, color: S2 }}
                  b={{ label: "Disposed", value: d.wasteDisposed, color: PREV }}
                />
              )}
            </>
          ) : (
            <EmptyMini label="Add waste data in Collect (EI.9)" onGo={() => onNavigate("__core__")} />
          )}
        </section>
      </div>

      {/* ---- Air emissions (only when present) ---- */}
      {d.airEmissions.length > 0 && (
        <section className="card p-5">
          <PanelTitle title="Air emissions (non-GHG)" sub="Principle 6 · EI.6 · NOx, SOx, PM and other pollutants" />
          <div className="h-48">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={d.airEmissions.map((a) => ({ name: a.label, value: a.value }))} margin={{ left: 4, right: 8, top: 20, bottom: 4 }}>
                <CartesianGrid vertical={false} stroke={GRID} />
                <XAxis dataKey="name" stroke={AXIS} tick={{ fontSize: 11 }} tickLine={false} axisLine={{ stroke: GRID }} />
                <YAxis stroke={AXIS} tick={{ fontSize: 11 }} tickLine={false} axisLine={false} width={44} />
                <Tooltip contentStyle={tip} formatter={(v) => [`${fmtNum(Number(v))} MT`, ""]} cursor={{ fill: "rgba(100,116,139,0.06)" }} />
                <Bar dataKey="value" fill={SLATE} radius={[5, 5, 0, 0]} isAnimationActive={false} maxBarSize={44}>
                  <LabelList dataKey="value" position="top" formatter={(v: unknown) => fmtNum(Number(v))} style={{ fontSize: 11, fill: AXIS }} />
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </section>
      )}

      {/* ---- Data trust: collection, evidence, completeness ---- */}
      <div className="grid gap-4 lg:grid-cols-3">
        {/* Collection progress */}
        <section className="card p-5">
          <PanelTitle title="BRSR Core collection" sub="The nine attributes under assurance" />
          <p className="flex items-baseline gap-2">
            <span className="font-display text-3xl font-semibold">
              {trust.total > 0 ? Math.round(((trust.validated + trust.withEvidence + trust.answered) / trust.total) * 100) : 0}%
            </span>
            <span className="text-xs text-text-muted">of Core KPIs have data</span>
          </p>
          <div className="mt-3 flex h-2.5 w-full overflow-hidden rounded-full bg-surface-2">
            {trust.total > 0 && (
              <>
                <div className="h-full" style={{ background: "#047857", width: `${(trust.validated / trust.total) * 100}%` }} />
                <div className="h-full" style={{ background: "#10b981", width: `${(trust.withEvidence / trust.total) * 100}%` }} />
                <div className="h-full" style={{ background: BLUE, width: `${(trust.answered / trust.total) * 100}%` }} />
                <div className="h-full" style={{ background: AMBER, width: `${(trust.inProgress / trust.total) * 100}%` }} />
              </>
            )}
          </div>
          <ul className="mt-3 space-y-1.5 text-xs">
            <LegendRow color="#047857" label="Validated" value={String(trust.validated)} />
            <LegendRow color="#10b981" label="Data + evidence" value={String(trust.withEvidence)} />
            <LegendRow color={BLUE} label="Data entered" value={String(trust.answered)} />
            <LegendRow color={AMBER} label="In progress" value={String(trust.inProgress)} />
            <LegendRow color="#dbe5de" label="Not started" value={String(trust.notStarted)} />
          </ul>
          <button onClick={() => onNavigate("__core__")} className="mt-4 text-xs font-semibold text-teal hover:underline">
            Continue collecting →
          </button>
        </section>

        {/* Evidence coverage */}
        <section className="card p-5">
          <PanelTitle title="Assurance readiness" sub="Evidence behind your Core data" />
          {(() => {
            const withData = trust.validated + trust.withEvidence + trust.answered;
            const covered = trust.validated + trust.withEvidence;
            const pct = withData > 0 ? Math.round((covered / withData) * 100) : 0;
            return (
              <>
                <p className="flex items-baseline gap-2">
                  <span className={cn("font-display text-3xl font-semibold", pct >= 80 ? "text-teal" : pct >= 40 ? "" : "text-[#b45309]")}>{pct}%</span>
                  <span className="text-xs text-text-muted">of entered Core KPIs carry evidence or validation</span>
                </p>
                <div className="mt-3 h-2.5 w-full overflow-hidden rounded-full bg-surface-2">
                  <div className={cn("h-full rounded-full", pct >= 80 ? "bg-teal" : "bg-[#f0a020]")} style={{ width: `${pct}%` }} />
                </div>
              </>
            );
          })()}
          {trust.missingEvidence.length > 0 ? (
            <div className="mt-4 rounded-xl border border-[#f0a020]/30 bg-[#f0a020]/8 p-3">
              <p className="text-xs font-semibold text-[#92600a]">Needs evidence ({trust.missingEvidence.length})</p>
              <ul className="mt-1.5 space-y-1 text-[11px] leading-snug text-[#92600a]/90">
                {trust.missingEvidence.slice(0, 3).map((m) => <li key={m}>{m}</li>)}
                {trust.missingEvidence.length > 3 && <li>and {trust.missingEvidence.length - 3} more…</li>}
              </ul>
            </div>
          ) : (
            <p className="mt-4 rounded-xl border border-border bg-surface-2/50 p-3 text-[11px] leading-relaxed text-text-muted">
              BRSR Core attributes require reasonable assurance. Attach bills, registers and meter records
              against each KPI so your assurer can trace every figure.
            </p>
          )}
          <button onClick={() => onNavigate("__core__")} className="mt-4 text-xs font-semibold text-teal hover:underline">
            Attach evidence →
          </button>
        </section>

        {/* Completeness by module */}
        <section className="card p-5">
          <PanelTitle title="Report completeness" sub="All sections and principles" />
          <ul className="space-y-2">
            {modules.map((m) => {
              const pct = m.total > 0 ? Math.round((m.answered / m.total) * 100) : 0;
              return (
                <li key={m.key}>
                  <button onClick={() => onNavigate(m.key)} className="group block w-full text-left">
                    <span className="flex items-center justify-between text-[11px]">
                      <span className="truncate text-text-muted transition-colors group-hover:text-text">{m.label}</span>
                      <span className="ml-2 shrink-0 tabular-nums text-text-muted">{m.answered}/{m.total}</span>
                    </span>
                    <span className="mt-1 block h-1.5 w-full overflow-hidden rounded-full bg-surface-2">
                      <span className={cn("block h-full rounded-full transition-all", pct === 100 ? "bg-teal" : pct > 0 ? "bg-[#2f6fe0]/60" : "bg-transparent")} style={{ width: `${Math.max(pct, 2)}%` }} />
                    </span>
                  </button>
                </li>
              );
            })}
          </ul>
        </section>
      </div>

      <p className="rounded-xl border border-border bg-surface-2/60 p-3 text-xs leading-relaxed text-text-muted">
        Dashboard figures are computed from the data you enter and are indicative. Your formal BRSR report becomes
        available once all data is submitted and reviewed.
      </p>
    </div>
  );
}

// ---- shared pieces --------------------------------------------------------

function DashHeader({ report }: { report: BrsrReport }) {
  return (
    <header className="flex flex-wrap items-end justify-between gap-3">
      <div>
        <h2 className="text-lg font-semibold">Sustainability dashboard</h2>
        <p className="mt-1 text-sm text-text-muted">Live insights from your BRSR data · FY {report.financial_year}. Indicative, not assured figures.</p>
      </div>
      <span className={cn(
        "rounded-full px-3 py-1 text-xs font-medium",
        report.status === "final" ? "bg-teal/10 text-teal" : "bg-surface-2 text-text-muted",
      )}>
        {report.status === "final" ? "Report released" : report.status === "in_review" ? "Under review" : "Draft"}
      </span>
    </header>
  );
}

function PanelTitle({ title, sub }: { title: string; sub?: string }) {
  return (
    <div className="mb-3 flex items-start gap-2.5">
      <span aria-hidden className="mt-1 h-4 w-1 shrink-0 rounded-full" style={{ background: "#059669" }} />
      <div>
        <h3 className="font-display text-base font-semibold">{title}</h3>
        {sub && <p className="mt-0.5 text-[11px] text-text-muted">{sub}</p>}
      </div>
    </div>
  );
}

function Stat({ label, value, unit, trend, trendGoodDown, sub, icon, tone }: {
  label: string; value: string; unit: string; trend?: number | null; trendGoodDown?: boolean; sub?: string; icon?: React.ReactNode; tone?: string;
}) {
  const up = trend != null && trend > 0;
  const good = trend == null ? false : trendGoodDown ? trend < 0 : trend > 0;
  const t = tone ?? "#667085";
  return (
    <div className="card p-4">
      <div className="flex items-start justify-between gap-2">
        <p className="text-[11px] uppercase tracking-wide text-text-muted">{label}</p>
        {icon && (
          <span className="grid h-8 w-8 shrink-0 place-items-center rounded-lg text-white shadow-sm" style={{ background: t }}>
            {icon}
          </span>
        )}
      </div>
      <p className="mt-2 flex items-baseline gap-1.5">
        <span className="font-display text-[1.65rem] font-semibold leading-none">{value}</span>
        <span className="text-[11px] text-text-muted">{unit}</span>
      </p>
      <div className="mt-2 flex min-h-[20px] items-center gap-2">
        {trend != null && (
          <span className={cn("inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[11px] font-medium", good ? "bg-teal/10 text-teal" : "bg-[#e5484d]/10 text-[#b42318]")}>
            {up ? "▲" : "▼"} {Math.abs(Math.round(trend))}%
          </span>
        )}
        {sub && <span className="truncate text-[11px] text-text-muted">{sub}</span>}
      </div>
    </div>
  );
}

function MiniStat({ label, value, unit, good }: { label: string; value: string; unit: string; good?: boolean }) {
  return (
    <div className="rounded-xl border border-border bg-surface-2/40 p-2.5 text-center">
      <p className="text-[10px] uppercase tracking-wide text-text-muted">{label}</p>
      <p className="mt-1 leading-none">
        <span className={cn("font-display text-lg font-semibold", good && "text-teal")}>{value}</span>
        <span className="ml-1 text-[10px] text-text-muted">{unit}</span>
      </p>
    </div>
  );
}

function MiniMetric({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center justify-between rounded-xl border border-border bg-surface-2/40 px-3 py-2.5">
      <span className="text-xs text-text-muted">{label}</span>
      <span className="font-display text-sm font-semibold">{value}</span>
    </div>
  );
}

function ScopeDetail({
  color, name, value, yoy, share, covers, collectedIn, lines, onNavigate, extra,
}: {
  color: string; name: string; value: number; yoy: number | null; share: number;
  covers: string; collectedIn: string;
  lines: { label: string; tco2e: number; quantity: number; unit: string }[];
  onNavigate: (key: string) => void;
  extra?: React.ReactNode;
}) {
  const good = yoy != null && yoy < 0;
  return (
    <div className="grid gap-6 lg:grid-cols-[1fr_1.3fr]">
      <div>
        <div className="flex items-center gap-2">
          <span className="h-2.5 w-2.5 rounded-full" style={{ background: color }} />
          <h3 className="font-display text-base font-semibold">{name}</h3>
        </div>
        <p className="mt-3 flex items-baseline gap-2">
          <span className="font-display text-4xl font-semibold leading-none">{value > 0 ? fmtNum(value) : "—"}</span>
          <span className="text-xs text-text-muted">tCO2e</span>
          {yoy != null && (
            <span className={cn("inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[11px] font-medium", good ? "bg-teal/10 text-teal" : "bg-[#e5484d]/10 text-[#b42318]")}>
              {yoy > 0 ? "▲" : "▼"} {Math.abs(Math.round(yoy))}% vs last year
            </span>
          )}
        </p>

        {/* Share of total */}
        <p className="mt-4 text-xs font-medium text-text-muted">Share of total footprint</p>
        <div className="mt-1.5 h-2.5 w-full overflow-hidden rounded-full bg-surface-2">
          <div className="h-full rounded-full" style={{ width: `${Math.min(share, 100)}%`, background: color }} />
        </div>
        <p className="mt-1 text-[11px] text-text-muted">{Math.round(share)}% of reported emissions</p>

        <p className="mt-4 text-xs leading-relaxed text-text-muted">{covers}</p>
        <p className="mt-3 rounded-lg bg-surface-2/60 px-3 py-2 text-[11px] text-text-muted">Collected in {collectedIn}</p>
        {extra}
        <div className="mt-4 flex flex-wrap gap-2">
          <Button size="md" onClick={() => onNavigate("__core__")}>Edit in Collect</Button>
          <Button size="md" variant="ghost" onClick={() => onNavigate("__calc__")}>Open calculator</Button>
        </div>
      </div>

      <div>
        <PanelTitle title="By activity" sub="From the emissions calculator" />
        {lines.length > 0 ? (
          <HBars data={lines.slice(0, 8).map((l) => ({ label: `${l.label} (${fmtNum(l.quantity, 0)} ${l.unit})`, value: l.tco2e }))} color={color} unit="tCO2e" />
        ) : (
          <EmptyMini
            label="No activity lines yet for this scope. Log fuel, electricity or travel quantities in the Emissions calculator and the breakdown appears here."
            onGo={() => onNavigate("__calc__")}
            goLabel="Open calculator"
          />
        )}
      </div>
    </div>
  );
}

/** Horizontal labelled bars, CSS-based for crisp alignment at any width. */
function HBars({ data, color, unit, compact }: { data: { label: string; value: number }[]; color: string; unit: string; compact?: boolean }) {
  const max = Math.max(...data.map((x) => x.value), 0);
  if (data.length === 0 || max <= 0) return <EmptyMini label="No data" />;
  return (
    <ul className={cn("space-y-2.5", compact && "space-y-2")}>
      {data.map((x) => (
        <li key={x.label}>
          <span className="flex items-baseline justify-between gap-2 text-[11px]">
            <span className="truncate text-text-muted">{x.label}</span>
            <span className="shrink-0 font-medium tabular-nums text-text">{fmtNum(x.value)}{unit ? ` ${unit}` : ""}</span>
          </span>
          <span className="mt-1 block h-2 w-full overflow-hidden rounded-full bg-surface-2">
            <span className="block h-full rounded-full" style={{ width: `${Math.max((x.value / max) * 100, 2)}%`, background: color }} />
          </span>
        </li>
      ))}
    </ul>
  );
}

/** Two-part proportional bar with legend (e.g. treated vs untreated). */
function SplitBar({ label, a, b, warnB, className }: {
  label: string;
  a: { label: string; value: number; color: string };
  b: { label: string; value: number; color: string };
  warnB?: boolean;
  className?: string;
}) {
  const total = a.value + b.value;
  if (total <= 0) return null;
  return (
    <div className={className}>
      <p className="mb-2 text-xs font-medium text-text-muted">{label}</p>
      <div className="flex h-2.5 w-full overflow-hidden rounded-full bg-surface-2">
        <div className="h-full" style={{ width: `${(a.value / total) * 100}%`, background: a.color }} />
        <div className="h-full" style={{ width: `${(b.value / total) * 100}%`, background: warnB && b.value > 0 ? "#f0a020" : b.color }} />
      </div>
      <div className="mt-2 flex items-center justify-between text-[11px] text-text-muted">
        <span className="flex items-center gap-1.5"><Swatch color={a.color} /> {a.label} · {fmtNum(a.value)}</span>
        <span className="flex items-center gap-1.5"><Swatch color={warnB && b.value > 0 ? "#f0a020" : b.color} /> {b.label} · {fmtNum(b.value)}</span>
      </div>
    </div>
  );
}

function Donut({ data, colors, center, centerSub, small }: { data: { name: string; value: number }[]; colors: string[]; center: string; centerSub: string; small?: boolean }) {
  if (data.length === 0) return <EmptyMini label="No data" />;
  return (
    <div className={cn("relative", small ? "h-44" : "h-52")}>
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
    <li className="flex items-center justify-between gap-2">
      <span className="flex min-w-0 items-center gap-2 text-text-muted"><Swatch color={color} /><span className="truncate">{label}</span></span>
      <span className="shrink-0 font-medium tabular-nums text-text">{value}</span>
    </li>
  );
}

function Swatch({ color }: { color: string }) {
  return <span className="h-2.5 w-2.5 shrink-0 rounded-full" style={{ background: color }} />;
}

function EmptyMini({ label, onGo, goLabel = "Go to Collect" }: { label: string; onGo?: () => void; goLabel?: string }) {
  return (
    <div className="grid min-h-[10rem] place-items-center rounded-xl border border-dashed border-border p-4 text-center">
      <div>
        <p className="mx-auto max-w-[16rem] text-xs leading-relaxed text-text-muted">{label}</p>
        {onGo && (
          <button onClick={onGo} className="mt-3 text-xs font-semibold text-teal hover:underline">{goLabel} →</button>
        )}
      </div>
    </div>
  );
}

// ---- icons ---------------------------------------------------------------

function CloudIcon() { return <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="h-4 w-4"><path d="M17.5 19a4.5 4.5 0 0 0 .5-8.98A6 6 0 0 0 6.5 10 4 4 0 0 0 7 18h10.5z" strokeLinecap="round" strokeLinejoin="round" /></svg>; }
function LayersIcon() { return <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="h-4 w-4"><path d="M12 3l9 5-9 5-9-5 9-5zM3 13l9 5 9-5M3 17l9 5 9-5" strokeLinecap="round" strokeLinejoin="round" /></svg>; }
function GaugeIcon() { return <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="h-4 w-4"><path d="M12 15l4-6M3.5 17a10 10 0 1 1 17 0" strokeLinecap="round" strokeLinejoin="round" /></svg>; }
function BoltIcon() { return <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="h-4 w-4"><path d="M13 2L4 14h7l-1 8 9-12h-7l1-8z" strokeLinejoin="round" /></svg>; }
function DropIcon() { return <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="h-4 w-4"><path d="M12 3s6 6.5 6 11a6 6 0 0 1-12 0c0-4.5 6-11 6-11z" strokeLinejoin="round" /></svg>; }
function TrashIcon() { return <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="h-4 w-4"><path d="M4 7h16M9 7V5a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2M6 7l1 13a2 2 0 0 0 2 2h6a2 2 0 0 0 2-2l1-13" strokeLinecap="round" strokeLinejoin="round" /></svg>; }
