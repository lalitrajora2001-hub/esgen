"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useCompany } from "@/components/tool/CompanyProvider";
import { useAuth } from "@/components/tool/AuthProvider";
import { Button } from "@/components/ui/Button";
import { BRSR, moduleQuestions } from "@/lib/brsr/framework";
import { moduleCompletion, computeCoreKpis } from "@/lib/brsr/calc";
import {
  listReports, createReport, updateReport, fetchResponses, saveResponse, listEvidence,
  type BrsrReport, type EvidenceFile, type ResponseMap,
} from "@/lib/brsr/db";
import { QuestionRenderer } from "@/components/brsr/QuestionRenderer";
import { CollectScreen } from "@/components/brsr/CollectScreen";
import { Dashboard } from "@/components/brsr/Dashboard";
import { BrsrOverview } from "@/components/brsr/BrsrOverview";
import { BrsrExport } from "@/components/brsr/BrsrExport";
import { BrsrTools } from "@/components/brsr/BrsrTools";
import { BrsrTeam } from "@/components/brsr/BrsrTeam";
import { FrameworksHub } from "@/components/brsr/FrameworksHub";
import { SettingsView } from "@/components/brsr/SettingsView";
import { TasksView } from "@/components/brsr/TasksView";
import { EmissionsCalculator } from "@/components/brsr/EmissionsCalculator";
import { WorkflowBar, STATE_LABELS } from "@/components/brsr/WorkflowBar";
import { fetchSectionStatuses, fetchKpiStatuses, upsertKpiStatus, logAudit, type SectionStatus, type KpiStatus } from "@/lib/brsr/pro";
import { cn } from "@/lib/cn";

const DASH = "__dash__";
const CORE = "__core__";
const OVERVIEW = "__overview__";
const TEAM = "__team__";
const TOOLS = "__tools__";
const CALC = "__calc__";
const FRAMEWORKS = "__frameworks__";
const SETTINGS = "__settings__";
const TASKS = "__tasks__";

const SECTION_MODULES = BRSR.modules.filter((m) => m.section !== "C");
const PRINCIPLE_MODULES = BRSR.modules.filter((m) => m.section === "C");

/** Which rail area a view key belongs to. Module keys fall under "collect". */
type Area = "dashboard" | "collect" | "tasks" | "frameworks" | "team" | "reports" | "settings";
function areaOf(key: string): Area {
  if (key === DASH) return "dashboard";
  if (key === TASKS) return "tasks";
  if (key === FRAMEWORKS) return "frameworks";
  if (key === TEAM) return "team";
  if (key === TOOLS) return "reports";
  if (key === SETTINGS) return "settings";
  return "collect"; // CORE, OVERVIEW, CALC and every module key
}

const AREA_HOME: Record<Area, string> = {
  dashboard: DASH,
  collect: CORE,
  tasks: TASKS,
  frameworks: FRAMEWORKS,
  team: TEAM,
  reports: TOOLS,
  settings: SETTINGS,
};

export function BrsrWorkspace() {
  const { company } = useCompany();
  const [reports, setReports] = useState<BrsrReport[]>([]);
  const [report, setReport] = useState<BrsrReport | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!company) return;
    (async () => {
      try {
        const rs = await listReports(company.id);
        setReports(rs);
        setReport(rs[0] ?? null);
      } catch (e) {
        setError(e instanceof Error ? e.message : "Could not load BRSR reports.");
      } finally {
        setLoading(false);
      }
    })();
  }, [company]);

  if (loading) return <div className="px-8 py-10"><p className="text-sm text-text-muted">Loading BRSR module...</p></div>;
  if (error) return <div className="px-8 py-10"><p className="rounded-xl border border-[#e5484d]/30 bg-[#e5484d]/8 p-3 text-sm text-[#b42318]">{error}</p></div>;

  if (!report) {
    return (
      <div className="mx-auto max-w-7xl px-5 py-10 sm:px-8">
        <CreateReport companyId={company!.id} onCreated={(r) => { setReports([r, ...reports]); setReport(r); }} />
      </div>
    );
  }

  return (
    <ReportEditor
      report={report}
      reports={reports}
      onSwitch={setReport}
      onNew={() => setReport(null)}
    />
  );
}

// ---- create report --------------------------------------------------------

function CreateReport({ companyId, onCreated }: { companyId: string; onCreated: (r: BrsrReport) => void }) {
  const [fy, setFy] = useState("2024-25");
  const [boundary, setBoundary] = useState("Standalone");
  const [turnover, setTurnover] = useState("");
  const [ppp, setPpp] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setBusy(true);
    setError(null);
    try {
      const r = await createReport({
        company_id: companyId,
        financial_year: fy.trim(),
        reporting_boundary: boundary,
        turnover: turnover ? Number(turnover) : null,
        ppp_factor: ppp ? Number(ppp) : null,
      });
      onCreated(r);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Could not create the report.");
      setBusy(false);
    }
  };

  return (
    <div className="max-w-lg">
      <h1 className="text-2xl font-semibold sm:text-3xl">Start a BRSR report</h1>
      <p className="mt-1 text-sm text-text-muted">
        The Business Responsibility and Sustainability Report (SEBI). Set up the reporting entity details, then feed in
        data section by section.
      </p>
      <form onSubmit={submit} className="card mt-6 space-y-4 p-6">
        <label className="flex flex-col gap-1.5">
          <span className="text-sm font-medium">Financial year</span>
          <input value={fy} onChange={(e) => setFy(e.target.value)} placeholder="2024-25" className="h-11 rounded-xl border border-border bg-surface px-4 text-sm" />
        </label>
        <label className="flex flex-col gap-1.5">
          <span className="text-sm font-medium">Reporting boundary</span>
          <select value={boundary} onChange={(e) => setBoundary(e.target.value)} className="h-11 rounded-xl border border-border bg-surface px-4 text-sm">
            <option>Standalone</option>
            <option>Consolidated</option>
          </select>
        </label>
        <div className="grid grid-cols-2 gap-4">
          <label className="flex flex-col gap-1.5">
            <span className="text-sm font-medium">Turnover (INR)</span>
            <input value={turnover} onChange={(e) => setTurnover(e.target.value)} inputMode="decimal" placeholder="e.g. 5000000000" className="h-11 rounded-xl border border-border bg-surface px-4 text-sm" />
            <span className="text-[11px] text-text-muted">Denominator for intensity ratios.</span>
          </label>
          <label className="flex flex-col gap-1.5">
            <span className="text-sm font-medium">PPP factor (USD/INR)</span>
            <input value={ppp} onChange={(e) => setPpp(e.target.value)} inputMode="decimal" placeholder="e.g. 21.6" className="h-11 rounded-xl border border-border bg-surface px-4 text-sm" />
            <span className="text-[11px] text-text-muted">World Bank PPP (GDP, LCU per int&apos;l $) for India ≈ 21-22; updates yearly.</span>
          </label>
        </div>
        {error && <p className="text-sm text-[#b42318]">{error}</p>}
        <Button type="submit" className="w-full" disabled={busy}>{busy ? "Creating..." : "Create report"}</Button>
      </form>
    </div>
  );
}

// ---- report editor --------------------------------------------------------

function ReportEditor({
  report, reports, onSwitch, onNew,
}: {
  report: BrsrReport;
  reports: BrsrReport[];
  onSwitch: (r: BrsrReport) => void;
  onNew: () => void;
}) {
  const { company } = useCompany();
  const { user } = useAuth();
  const [responses, setResponses] = useState<ResponseMap>({});
  const [evidence, setEvidence] = useState<EvidenceFile[]>([]);
  const [statuses, setStatuses] = useState<Record<string, SectionStatus>>({});
  const [kpiStatuses, setKpiStatuses] = useState<Record<string, KpiStatus>>({});
  const [activeKey, setActiveKey] = useState<string>(DASH);
  const [showExport, setShowExport] = useState(false);
  const [loading, setLoading] = useState(true);
  const [savingKeys, setSavingKeys] = useState<Set<string>>(new Set());
  const timers = useRef<Record<string, ReturnType<typeof setTimeout>>>({});

  useEffect(() => {
    setLoading(true);
    (async () => {
      const [r, e, s, k] = await Promise.all([
        fetchResponses(report.id),
        listEvidence(report.id),
        fetchSectionStatuses(report.id).catch(() => ({} as Record<string, SectionStatus>)),
        fetchKpiStatuses(report.id).catch(() => ({} as Record<string, KpiStatus>)),
      ]);
      setResponses(r);
      setEvidence(e);
      setStatuses(s);
      setKpiStatuses(k);
      setLoading(false);
    })();
  }, [report.id]);

  const activeModule = useMemo(() => BRSR.modules.find((m) => m.key === activeKey), [activeKey]);
  const area = areaOf(activeKey);

  const onChangeAnswer = useCallback((key: string, value: unknown) => {
    setResponses((prev) => ({ ...prev, [key]: value }));
    setSavingKeys((s) => new Set(s).add(key));
    clearTimeout(timers.current[key]);
    timers.current[key] = setTimeout(async () => {
      try {
        await saveResponse(report.id, key, value);
        void logAudit(report.id, key, user?.email ?? null, value);
      } finally {
        setSavingKeys((s) => { const n = new Set(s); n.delete(key); return n; });
      }
    }, 600);
  }, [report.id, user?.email]);

  const kpis = useMemo(() => computeCoreKpis(responses, report), [responses, report]);

  const onStatusChange = useCallback(async (status: string) => {
    await updateReport(report.id, { status });
  }, [report.id]);

  const onEvidenceChange = useCallback((key: string, files: EvidenceFile[]) => {
    setEvidence((prev) => [...prev.filter((e) => e.question_key !== key), ...files]);
  }, []);

  const onKpiStatusChange = useCallback((key: string, patch: Partial<Pick<KpiStatus, "status" | "assignee_email" | "validated_by" | "validated_at">>) => {
    setKpiStatuses((prev) => {
      const base = prev[key] ?? { question_key: key, report_id: report.id, status: "not_started", assignee_email: null, validated_by: null, validated_at: null };
      const merged = { ...base, ...patch } as KpiStatus;
      // Send the full record so an upsert never nulls unspecified columns
      // (e.g. marking validated must not wipe the owner).
      void upsertKpiStatus(report.id, key, {
        status: merged.status,
        assignee_email: merged.assignee_email,
        validated_by: merged.validated_by,
        validated_at: merged.validated_at,
      });
      return { ...prev, [key]: merged };
    });
  }, [report.id]);

  // Bulk-apply answer changes (JSON import, carry-forward) and persist each.
  const onApplyUpdates = useCallback(async (updates: Record<string, unknown>) => {
    setResponses((prev) => ({ ...prev, ...updates }));
    for (const [k, v] of Object.entries(updates)) {
      await saveResponse(report.id, k, v);
      void logAudit(report.id, k, user?.email ?? null, v);
    }
  }, [report.id, user?.email]);

  if (showExport && company) {
    return (
      <div className="mx-auto max-w-7xl px-5 py-8 sm:px-8">
        <BrsrExport
          report={report}
          company={company}
          responses={responses}
          evidence={evidence}
          onBack={() => setShowExport(false)}
        />
      </div>
    );
  }

  const viewTitle =
    activeKey === DASH ? "Dashboard"
    : activeKey === CORE ? "Collect · BRSR Core"
    : activeKey === OVERVIEW ? "Progress & checks"
    : activeKey === CALC ? "Emissions calculator"
    : activeKey === TASKS ? "Collection tasks"
    : activeKey === FRAMEWORKS ? "Frameworks"
    : activeKey === TEAM ? "Team & activity"
    : activeKey === TOOLS ? "Reports & data"
    : activeKey === SETTINGS ? "Settings"
    : activeModule?.navLabel ?? "";

  return (
    <div className="flex min-h-[calc(100vh-72px)]">
      {/* Icon rail */}
      <Rail area={area} onGo={(a) => setActiveKey(AREA_HOME[a])} />

      {/* Secondary panel: BRSR structure, only in the collect area */}
      {area === "collect" && (
        <aside className="sticky top-[72px] hidden h-[calc(100vh-72px)] w-[248px] shrink-0 overflow-y-auto border-r border-border bg-surface p-3 lg:block">
          <p className="mb-2 mt-1 px-3 text-[11px] font-semibold uppercase tracking-wider text-text-muted/70">Data collection</p>
          <ul className="space-y-1">
            <li><NavBtn active={activeKey === CORE} onClick={() => setActiveKey(CORE)} label="Collect (BRSR Core)" /></li>
            <li><NavBtn active={activeKey === OVERVIEW} onClick={() => setActiveKey(OVERVIEW)} label="Progress & checks" /></li>
            <li><NavBtn active={activeKey === CALC} onClick={() => setActiveKey(CALC)} label="Emissions calculator" /></li>
          </ul>
          <NavGroup label="Sections" />
          <ul className="space-y-1">{SECTION_MODULES.map((m) => <ModuleBtn key={m.key} m={m} activeKey={activeKey} responses={responses} statuses={statuses} onClick={() => setActiveKey(m.key)} />)}</ul>
          <NavGroup label="Principles" />
          <ul className="space-y-1">{PRINCIPLE_MODULES.map((m) => <ModuleBtn key={m.key} m={m} activeKey={activeKey} responses={responses} statuses={statuses} onClick={() => setActiveKey(m.key)} />)}</ul>
        </aside>
      )}

      {/* Main column */}
      <div className="min-w-0 flex-1">
        {/* Mobile rail (horizontal) */}
        <MobileRail area={area} onGo={(a) => setActiveKey(AREA_HOME[a])} />

        <div className="mx-auto max-w-[1440px] px-5 py-6 sm:px-8">
          {/* Toolbar: breadcrumb + FY switcher */}
          <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
            <div className="flex min-w-0 items-center gap-2 text-sm">
              <span className="truncate font-medium text-text-muted">{company?.name}</span>
              <span className="text-text-muted/50">/</span>
              <span className="truncate font-semibold">{viewTitle}</span>
            </div>
            <div className="flex items-center gap-2">
              {/* Mobile jump control for the collect area */}
              {area === "collect" && (
                <select
                  value={activeKey}
                  onChange={(e) => setActiveKey(e.target.value)}
                  className="h-9 rounded-lg border border-border bg-surface px-2 text-xs lg:hidden"
                  aria-label="Jump to section"
                >
                  <option value={CORE}>Collect (BRSR Core)</option>
                  <option value={OVERVIEW}>Progress &amp; checks</option>
                  <option value={CALC}>Emissions calculator</option>
                  {SECTION_MODULES.map((m) => <option key={m.key} value={m.key}>{m.navLabel}</option>)}
                  {PRINCIPLE_MODULES.map((m) => <option key={m.key} value={m.key}>{m.navLabel}</option>)}
                </select>
              )}
              <select
                value={report.id}
                onChange={(e) => onSwitch(reports.find((r) => r.id === e.target.value)!)}
                className="h-9 rounded-lg border border-border bg-surface px-2 text-xs"
                aria-label="Financial year"
              >
                {reports.map((r) => <option key={r.id} value={r.id}>FY {r.financial_year}</option>)}
              </select>
              <button onClick={onNew} title="New reporting year" className="grid h-9 w-9 shrink-0 place-items-center rounded-lg border border-border text-text-muted hover:border-accent hover:text-text">+</button>
            </div>
          </div>

          {/* Active view */}
          {loading ? (
            <p className="text-sm text-text-muted">Loading...</p>
          ) : activeKey === DASH ? (
            <Dashboard report={report} company={company} responses={responses} evidence={evidence} kpiStatuses={kpiStatuses} onNavigate={setActiveKey} />
          ) : activeKey === CORE ? (
            <CollectScreen
              reportId={report.id}
              responses={responses}
              evidence={evidence}
              statuses={kpiStatuses}
              savingKeys={savingKeys}
              deadline={null}
              onChangeAnswer={onChangeAnswer}
              onEvidenceChange={onEvidenceChange}
              onKpiStatusChange={onKpiStatusChange}
            />
          ) : activeKey === TASKS ? (
            <TasksView report={report} />
          ) : activeKey === FRAMEWORKS ? (
            <FrameworksHub report={report} company={company} responses={responses} onNavigate={setActiveKey} />
          ) : activeKey === SETTINGS ? (
            <SettingsView />
          ) : activeKey === OVERVIEW ? (
            <BrsrOverview report={report} responses={responses} kpis={kpis} onNavigate={setActiveKey} onStatusChange={onStatusChange} />
          ) : activeKey === CALC ? (
            <EmissionsCalculator responses={responses} onChangeAnswer={onChangeAnswer} onApplyUpdates={onApplyUpdates} />
          ) : activeKey === TEAM ? (
            company && <BrsrTeam companyId={company.id} reportId={report.id} />
          ) : activeKey === TOOLS ? (
            company && (
              <div className="space-y-6">
                <div className="card flex flex-wrap items-center justify-between gap-4 p-6">
                  <div className="flex items-start gap-3">
                    <span className="mt-0.5 grid h-9 w-9 shrink-0 place-items-center rounded-lg bg-surface-2 text-text-muted">
                      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="h-4 w-4"><rect x="5" y="11" width="14" height="10" rx="2" /><path d="M8 11V7a4 4 0 0 1 8 0v4" strokeLinecap="round" /></svg>
                    </span>
                    <div>
                      <h3 className="font-display text-base font-semibold">BRSR report</h3>
                      {report.status === "final" ? (
                        <p className="mt-1 text-xs text-text-muted">Reviewed and released. Preview and print the full report in the SEBI format.</p>
                      ) : (
                        <p className="mt-1 max-w-md text-xs text-text-muted">Your BRSR report will be available once all data is submitted and ESGen has reviewed it. Keep entering and validating your Core KPIs; insights are already live on the Dashboard.</p>
                      )}
                    </div>
                  </div>
                  {report.status === "final" ? (
                    <Button onClick={() => setShowExport(true)}>Open report document</Button>
                  ) : (
                    <span className="rounded-lg bg-surface-2 px-3 py-2 text-xs font-medium text-text-muted">Locked · pending review</span>
                  )}
                </div>
                <BrsrTools report={report} company={company} responses={responses} onApplyUpdates={onApplyUpdates} />
              </div>
            )
          ) : activeModule ? (
            <>
              <div className="mb-4">
                <h2 className="text-lg font-semibold">{activeModule.title}</h2>
                {activeModule.intro && <p className="mt-1 text-sm text-text-muted">{activeModule.intro}</p>}
              </div>

              <WorkflowBar
                reportId={report.id}
                moduleKey={activeModule.key}
                status={statuses[activeModule.key]}
                onChange={(s) => setStatuses((prev) => ({ ...prev, [activeModule.key]: s }))}
              />

              <div className="space-y-8">
                {activeModule.subsections.map((sub) => (
                  <section key={sub.key}>
                    <h3 className="mb-3 border-b border-border pb-2 font-display text-base font-semibold">{sub.title}</h3>
                    {sub.description && <p className="mb-3 text-sm text-text-muted">{sub.description}</p>}
                    <div className="space-y-4">
                      {sub.questions.map((q) => (
                        <div key={q.key}>
                          <QuestionRenderer
                            q={q}
                            value={responses[q.key]}
                            onChange={(v) => onChangeAnswer(q.key, v)}
                            reportId={report.id}
                            evidence={evidence.filter((e) => e.question_key === q.key)}
                            onEvidenceChange={(files) => onEvidenceChange(q.key, files)}
                          />
                          {savingKeys.has(q.key) && <p className="mt-1 text-[11px] text-text-muted">Saving…</p>}
                        </div>
                      ))}
                    </div>
                  </section>
                ))}
              </div>

              <p className="mt-8 rounded-xl border border-border bg-surface-2/60 p-3 text-xs leading-relaxed text-text-muted">
                This tool helps prepare and organise BRSR data and evidence. It does not itself constitute assurance,
                filing, or professional advice. Computed KPIs are indicative; confirm figures, boundaries and the current
                SEBI format with your advisers before any disclosure.
              </p>
            </>
          ) : null}
        </div>
      </div>
    </div>
  );
}

// ---- navigation chrome ----------------------------------------------------

const RAIL_ITEMS: { area: Area; label: string; icon: React.ReactNode }[] = [
  { area: "dashboard", label: "Dashboard", icon: <><rect x="3" y="3" width="7" height="9" rx="1.5" /><rect x="14" y="3" width="7" height="5" rx="1.5" /><rect x="14" y="12" width="7" height="9" rx="1.5" /><rect x="3" y="16" width="7" height="5" rx="1.5" /></> },
  { area: "collect", label: "Collect", icon: <><path d="M9 5H7a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V7a2 2 0 0 0-2-2h-2" /><rect x="9" y="3" width="6" height="4" rx="1" /><path d="M9 12l2 2 4-4" strokeLinecap="round" strokeLinejoin="round" /></> },
  { area: "tasks", label: "Tasks", icon: <><path d="M8 6h13M8 12h13M8 18h13" strokeLinecap="round" /><path d="M3 6l1 1 2-2M3 12l1 1 2-2M3 18l1 1 2-2" strokeLinecap="round" strokeLinejoin="round" /></> },
  { area: "frameworks", label: "Frameworks", icon: <path d="M12 3l9 5-9 5-9-5 9-5zM3 13l9 5 9-5" strokeLinecap="round" strokeLinejoin="round" /> },
  { area: "team", label: "Team", icon: <><circle cx="9" cy="8" r="3.5" /><path d="M2.5 20a6.5 6.5 0 0 1 13 0M16 5a3.5 3.5 0 0 1 0 7M21.5 20a6.5 6.5 0 0 0-4.5-6.2" strokeLinecap="round" /></> },
  { area: "reports", label: "Reports", icon: <><path d="M14 3v5h5M14 3H7a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V8l-5-5z" strokeLinejoin="round" /><path d="M9 13h6M9 17h6" strokeLinecap="round" /></> },
  { area: "settings", label: "Settings", icon: <><circle cx="12" cy="12" r="3" /><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 1 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 1 1-4 0v-.09a1.65 1.65 0 0 0-1-1.51 1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 1 1-2.83-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 1 1 0-4h.09a1.65 1.65 0 0 0 1.51-1 1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 1 1 2.83-2.83l.06.06a1.65 1.65 0 0 0 1.82.33h0a1.65 1.65 0 0 0 1-1.51V3a2 2 0 1 1 4 0v.09a1.65 1.65 0 0 0 1 1.51h0a1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 1 1 2.83 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82v0a1.65 1.65 0 0 0 1.51 1H21a2 2 0 1 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z" strokeLinecap="round" strokeLinejoin="round" /></> },
];

function Rail({ area, onGo }: { area: Area; onGo: (a: Area) => void }) {
  return (
    <aside className="sticky top-[72px] hidden h-[calc(100vh-72px)] w-[84px] shrink-0 flex-col items-center gap-1.5 border-r border-border bg-surface py-4 md:flex">
      {RAIL_ITEMS.map((it) => {
        const active = it.area === area;
        return (
          <button
            key={it.area}
            onClick={() => onGo(it.area)}
            aria-current={active ? "page" : undefined}
            className={cn(
              "flex w-[68px] flex-col items-center gap-1 rounded-xl py-2.5 transition",
              active ? "bg-teal/10 text-teal" : "text-text-muted hover:bg-surface-2 hover:text-text",
            )}
          >
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" className="h-5 w-5">{it.icon}</svg>
            <span className="text-[10px] font-medium leading-none">{it.label}</span>
          </button>
        );
      })}
    </aside>
  );
}

function MobileRail({ area, onGo }: { area: Area; onGo: (a: Area) => void }) {
  return (
    <div className="sticky top-[72px] z-20 border-b border-border bg-surface/95 backdrop-blur md:hidden">
      <div className="flex gap-1 overflow-x-auto px-3 py-2">
        {RAIL_ITEMS.map((it) => {
          const active = it.area === area;
          return (
            <button
              key={it.area}
              onClick={() => onGo(it.area)}
              className={cn(
                "flex shrink-0 items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-medium transition",
                active ? "bg-teal/10 text-teal" : "text-text-muted hover:bg-surface-2 hover:text-text",
              )}
            >
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" className="h-4 w-4">{it.icon}</svg>
              {it.label}
            </button>
          );
        })}
      </div>
    </div>
  );
}

function NavBtn({ active, onClick, label, right, left }: { active: boolean; onClick: () => void; label: string; right?: React.ReactNode; left?: React.ReactNode }) {
  return (
    <button
      onClick={onClick}
      className={cn(
        "flex w-full items-center justify-between gap-2 rounded-lg px-3 py-2 text-left text-sm transition",
        active ? "bg-teal/10 font-medium text-teal" : "text-text-muted hover:bg-surface-2 hover:text-text",
      )}
    >
      <span className="flex min-w-0 items-center gap-2">
        {left}
        <span className="truncate">{label}</span>
      </span>
      {right}
    </button>
  );
}

function ModuleBtn({
  m, activeKey, responses, statuses, onClick,
}: {
  m: (typeof BRSR.modules)[number];
  activeKey: string;
  responses: ResponseMap;
  statuses: Record<string, SectionStatus>;
  onClick: () => void;
}) {
  const { answered, total } = moduleCompletion(moduleQuestions(m), responses);
  const st = statuses[m.key]?.state;
  const done = answered === total && total > 0;
  return (
    <li>
      <NavBtn
        active={m.key === activeKey}
        onClick={onClick}
        label={m.navLabel}
        right={<span className={cn("shrink-0 rounded-full px-1.5 text-[10px]", done ? "bg-teal/15 text-teal" : "bg-surface-2 text-text-muted")}>{answered}/{total}</span>}
        left={
          <span
            className={cn("h-1.5 w-1.5 shrink-0 rounded-full", st && st !== "not_started" ? DOT_COLORS[st] : "bg-transparent ring-1 ring-border")}
            title={st ? STATE_LABELS[st] : "Not started"}
          />
        }
      />
    </li>
  );
}

function NavGroup({ label }: { label: string }) {
  return <p className="mb-1 mt-4 px-3 text-[11px] font-semibold uppercase tracking-wider text-text-muted/70">{label}</p>;
}

const DOT_COLORS: Record<string, string> = {
  in_progress: "bg-accent",
  submitted: "bg-[#f0a020]",
  approved: "bg-teal",
  needs_changes: "bg-[#e5484d]",
};
