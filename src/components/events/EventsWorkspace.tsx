"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useCompany } from "@/components/tool/CompanyProvider";
import { useAuth } from "@/components/tool/AuthProvider";
import { Button } from "@/components/ui/Button";
import { EVENTS, EVENTS_VERSION, eventsData, type AreaStatus } from "@/lib/events/framework";
import { buildDisclosure } from "@/lib/events/disclosure";
import { moduleCompletion } from "@/lib/brsr/calc";
import { moduleQuestions } from "@/lib/brsr/framework";
import {
  listReports, createReport, fetchResponses, saveResponse, listEvidence,
  type BrsrReport, type EvidenceFile, type ResponseMap,
} from "@/lib/brsr/db";
import { logAudit } from "@/lib/brsr/pro";
import { QuestionRenderer } from "@/components/brsr/QuestionRenderer";
import { cn } from "@/lib/cn";

/**
 * Events-industry workspace: the UK Event SME ESG toolkit running on the same
 * engine and tables as the BRSR tool (reports tagged EVENTS-UK-1).
 */

const DASH = "__dash__";
const DISCLOSURE = "__disclosure__";

const STATUS_META = {
  not_ready: { label: "Not ready", dot: "#e5484d", cls: "bg-[#e5484d]/10 text-[#b42318]", desc: "Complete the red items before using any outputs." },
  internal_draft: { label: "Internal draft only", dot: "#f0a020", cls: "bg-[#f0a020]/12 text-[#92600a]", desc: "Usable internally. Do not share externally yet." },
  ready_for_review: { label: "Ready for review", dot: "#2f6fe0", cls: "bg-[#2f6fe0]/10 text-[#2f6fe0]", desc: "Ready for management or adviser review before external use." },
  copy_safe: { label: "Copy-safe draft", dot: "#059669", cls: "bg-teal/10 text-teal", desc: "Final Readiness Gate is clear." },
} as const;

const AREA_STATUS_META: Record<AreaStatus, { label: string; cls: string; dot: string }> = {
  complete: { label: "Complete", cls: "text-teal", dot: "#059669" },
  partial: { label: "In progress", cls: "text-[#92600a]", dot: "#f0a020" },
  missing: { label: "Not started", cls: "text-[#b42318]", dot: "#e5484d" },
};

export function EventsWorkspace() {
  const { company } = useCompany();
  const [reports, setReports] = useState<BrsrReport[]>([]);
  const [report, setReport] = useState<BrsrReport | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!company) return;
    setLoading(true);
    setReport(null);
    (async () => {
      try {
        const rs = await listReports(company.id, "EVENTS");
        setReports(rs);
        setReport(rs[0] ?? null);
      } catch (e) {
        setError(e instanceof Error ? e.message : "Could not load the events workspace.");
      } finally {
        setLoading(false);
      }
    })();
  }, [company]);

  if (loading) return <p className="text-sm text-text-muted">Loading events workspace...</p>;
  if (error) return <p className="rounded-xl border border-[#e5484d]/30 bg-[#e5484d]/8 p-3 text-sm text-[#b42318]">{error}</p>;
  if (!report) return <CreateEventsReport companyId={company!.id} onCreated={(r) => { setReports([r, ...reports]); setReport(r); }} />;
  return <Editor report={report} reports={reports} onSwitch={setReport} onNew={() => setReport(null)} />;
}

function CreateEventsReport({ companyId, onCreated }: { companyId: string; onCreated: (r: BrsrReport) => void }) {
  const [year, setYear] = useState("2026");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setBusy(true);
    setError(null);
    try {
      onCreated(await createReport({
        company_id: companyId, financial_year: year.trim() || "2026",
        reporting_boundary: "Organisation", turnover: null, ppp_factor: null,
        framework_version: EVENTS_VERSION,
      }));
    } catch (e2) {
      setError(e2 instanceof Error ? e2.message : "Could not create the report.");
      setBusy(false);
    }
  };
  return (
    <div className="mx-auto max-w-lg">
      <h1 className="text-2xl font-semibold">Events ESG reporting</h1>
      <p className="mt-1 text-sm text-text-muted">
        Sustainability readiness and reporting for UK event businesses, aligned with ISO 20121.
        Complete your profile first; the event type you choose adapts the questions to your business.
      </p>
      <form onSubmit={submit} className="card mt-6 space-y-4 p-6">
        <label className="flex flex-col gap-1.5">
          <span className="text-sm font-medium">Reporting year</span>
          <input value={year} onChange={(e) => setYear(e.target.value)} placeholder="2026" className="h-11 rounded-xl border border-border bg-surface px-4 text-sm" />
        </label>
        {error && <p className="text-sm text-[#b42318]">{error}</p>}
        <Button type="submit" className="w-full" disabled={busy}>{busy ? "Creating..." : "Start reporting"}</Button>
      </form>
    </div>
  );
}

function Editor({ report, reports, onSwitch, onNew }: {
  report: BrsrReport; reports: BrsrReport[]; onSwitch: (r: BrsrReport) => void; onNew: () => void;
}) {
  const { user } = useAuth();
  const [responses, setResponses] = useState<ResponseMap>({});
  const [evidence, setEvidence] = useState<EvidenceFile[]>([]);
  const [activeKey, setActiveKey] = useState<string>(DASH);
  const [loading, setLoading] = useState(true);
  const [savingKeys, setSavingKeys] = useState<Set<string>>(new Set());
  const timers = useRef<Record<string, ReturnType<typeof setTimeout>>>({});

  useEffect(() => {
    setLoading(true);
    (async () => {
      const [r, e] = await Promise.all([fetchResponses(report.id), listEvidence(report.id)]);
      setResponses(r);
      setEvidence(e);
      setLoading(false);
    })();
  }, [report.id]);

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

  const onEvidenceChange = useCallback((key: string, files: EvidenceFile[]) => {
    setEvidence((prev) => [...prev.filter((e) => e.question_key !== key), ...files]);
  }, []);

  const d = useMemo(() => eventsData(responses, report), [responses, report]);
  const activeModule = EVENTS.modules.find((m) => m.key === activeKey);

  return (
    <div className="grid gap-6 lg:grid-cols-[250px_1fr]">
      {/* Sidebar */}
      <nav className="h-fit rounded-2xl border border-border bg-surface p-3 lg:sticky lg:top-24">
        <div className="mb-3 flex items-center gap-2">
          <select value={report.id} onChange={(e) => onSwitch(reports.find((r) => r.id === e.target.value)!)} aria-label="Reporting year" className="h-9 flex-1 rounded-lg border border-border bg-surface px-2 text-xs">
            {reports.map((r) => <option key={r.id} value={r.id}>Year {r.financial_year}</option>)}
          </select>
          <button onClick={onNew} title="New year" className="grid h-9 w-9 shrink-0 place-items-center rounded-lg border border-border text-text-muted hover:border-teal hover:text-text">+</button>
        </div>
        <ul className="space-y-1">
          <li><NavBtn active={activeKey === DASH} onClick={() => setActiveKey(DASH)} label="Dashboard" /></li>
          <li><NavBtn active={activeKey === DISCLOSURE} onClick={() => setActiveKey(DISCLOSURE)} label="Disclosure builder" /></li>
          {EVENTS.modules.map((m) => {
            const { answered, total } = moduleCompletion(moduleQuestions(m), responses);
            return (
              <li key={m.key}>
                <NavBtn
                  active={activeKey === m.key}
                  onClick={() => setActiveKey(m.key)}
                  label={m.navLabel}
                  right={<span className={cn("shrink-0 rounded-full px-1.5 text-[10px]", answered === total && total > 0 ? "bg-teal/15 text-teal" : "bg-surface-2 text-text-muted")}>{answered}/{total}</span>}
                />
              </li>
            );
          })}
        </ul>
      </nav>

      {/* Content */}
      <div className="min-w-0">
        {loading ? <p className="text-sm text-text-muted">Loading...</p>
        : activeKey === DASH ? (
          <div className="space-y-5">
            <header className="flex flex-wrap items-end justify-between gap-3">
              <div>
                <h2 className="text-lg font-semibold">Events readiness dashboard</h2>
                <p className="mt-1 text-sm text-text-muted">
                  {d.eventType ? `${d.eventType} · ` : ""}Year {report.financial_year}. Indicative figures, aligned with ISO 20121.
                </p>
              </div>
            </header>

            {/* Final readiness gate */}
            <div className="card overflow-hidden">
              <div className="flex flex-wrap items-center justify-between gap-3 p-5">
                <div className="flex items-center gap-3">
                  <span className="h-2.5 w-2.5 shrink-0 rounded-full" style={{ background: STATUS_META[d.status].dot }} />
                  <div>
                    <p className="text-[11px] uppercase tracking-wide text-text-muted">Final readiness gate</p>
                    <p className="font-display text-lg font-semibold">{STATUS_META[d.status].label}</p>
                  </div>
                </div>
                <span className={cn("rounded-full px-3 py-1 text-xs font-medium", STATUS_META[d.status].cls)}>{STATUS_META[d.status].desc}</span>
              </div>
              {d.status !== "copy_safe" && (
                <p className="border-t border-border bg-[#f0a020]/8 px-5 py-2.5 text-xs text-[#92600a]">
                  ⚠ Do not use Disclosure Builder text externally until this status is Copy-safe draft.
                </p>
              )}
            </div>

            {!d.eventType && (
              <div className="card flex flex-wrap items-center justify-between gap-3 p-5">
                <p className="text-sm text-text-muted">Start with your profile: the event type you pick adapts every readiness question to your business.</p>
                <Button size="md" onClick={() => setActiveKey("EV.PROFILE")}>Complete profile</Button>
              </div>
            )}

            {/* Area status + blocking issues */}
            <div className="grid gap-4 lg:grid-cols-[1.4fr_1fr]">
              <div className="card overflow-hidden">
                <p className="border-b border-border px-5 py-3 text-sm font-semibold">Report status by area</p>
                <ul className="divide-y divide-border">
                  {d.areas.map((a) => (
                    <li key={a.key}>
                      <button onClick={() => setActiveKey(a.jump)} className="flex w-full items-center justify-between gap-3 px-5 py-2.5 text-left hover:bg-surface-2">
                        <span className="flex items-center gap-2.5">
                          <span className="h-2 w-2 shrink-0 rounded-full" style={{ background: AREA_STATUS_META[a.status].dot }} />
                          <span className="text-sm">{a.label}</span>
                        </span>
                        <span className="flex items-center gap-2 text-right">
                          <span className={cn("text-xs font-medium", AREA_STATUS_META[a.status].cls)}>{AREA_STATUS_META[a.status].label}</span>
                        </span>
                      </button>
                      <p className="px-5 pb-2 text-[11px] text-text-muted">{a.message}</p>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="space-y-4">
                <div className="card p-5">
                  <p className="text-sm font-semibold">⚠ Key blocking issues</p>
                  {d.blockers.length === 0 ? (
                    <p className="mt-2 text-xs text-text-muted">No blocking issues. Everything has at least been started.</p>
                  ) : (
                    <ul className="mt-2 space-y-1.5 text-xs">
                      {d.blockers.map((b) => (
                        <li key={b.key}>
                          <button onClick={() => setActiveKey(b.jump)} className="text-left text-[#b42318] hover:underline">{b.label} - {b.message}</button>
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
                {(d.weakestTopic || d.strongestTopic) && (
                  <div className="card p-5">
                    <p className="text-sm font-semibold">Topic strength</p>
                    {d.weakestTopic && <p className="mt-2 text-xs text-text-muted">Weakest: <b className="text-text">{d.weakestTopic.label}</b> ({Math.round(d.weakestTopic.pct)}%)</p>}
                    {d.strongestTopic && <p className="mt-1 text-xs text-text-muted">Strongest: <b className="text-text">{d.strongestTopic.label}</b> ({Math.round(d.strongestTopic.pct)}%)</p>}
                  </div>
                )}
              </div>
            </div>

            {/* Readiness pillars */}
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
              <div className="card p-4">
                <p className="text-[11px] uppercase tracking-wide text-text-muted">Overall readiness</p>
                <p className="mt-1 font-display text-2xl font-semibold">{d.overallPct == null ? "—" : `${Math.round(d.overallPct)}%`}</p>
              </div>
              {d.pillars.map((p) => (
                <div key={p.key} className="card p-4">
                  <p className="text-[11px] uppercase tracking-wide text-text-muted">{p.label}</p>
                  <p className="mt-1 font-display text-2xl font-semibold">{p.pct == null ? "—" : `${Math.round(p.pct)}%`}</p>
                  <div className="mt-2 h-1.5 overflow-hidden rounded-full bg-surface-2">
                    <div className="h-full rounded-full bg-teal" style={{ width: `${p.pct ?? 0}%` }} />
                  </div>
                  <p className="mt-1 text-[10px] text-text-muted">{p.answered}/{p.relevant} answered</p>
                </div>
              ))}
            </div>

            {/* Carbon + suppliers + KPIs */}
            <div className="grid gap-4 lg:grid-cols-3">
              <div className="card p-5">
                <h3 className="font-display text-base font-semibold">Estimated carbon footprint</h3>
                <p className="mt-2 flex items-baseline gap-1.5">
                  <span className="font-display text-3xl font-semibold">{d.carbon.totalKg > 0 ? d.carbon.totalT.toFixed(2) : "—"}</span>
                  <span className="text-xs text-text-muted">tCO2e</span>
                </p>
                <ul className="mt-3 space-y-1 text-xs text-text-muted">
                  {d.carbon.perEvent != null && <li>Per event: <b className="text-text">{d.carbon.perEvent.toFixed(2)} t</b></li>}
                  {d.carbon.perDay != null && <li>Per event day: <b className="text-text">{d.carbon.perDay.toFixed(2)} t</b></li>}
                  {d.carbon.perAttendee != null && <li>Per attendee: <b className="text-text">{(d.carbon.perAttendee * 1000).toFixed(2)} kg</b></li>}
                </ul>
                {d.carbon.missingMinimum > 0 && (
                  <p className="mt-3 rounded-lg bg-[#f0a020]/10 p-2 text-[11px] text-[#92600a]">
                    {d.carbon.missingMinimum} minimum input{d.carbon.missingMinimum === 1 ? "" : "s"} still empty. Enter data or mark Not available.
                  </p>
                )}
                <button onClick={() => setActiveKey("EV.CARBON")} className="mt-3 text-xs font-semibold text-teal hover:underline">Open calculator →</button>
              </div>

              <div className="card p-5">
                <h3 className="font-display text-base font-semibold">Supplier risk</h3>
                {d.suppliers.total === 0 ? (
                  <p className="mt-2 text-sm text-text-muted">No suppliers assessed yet. Start with your 3-5 most critical.</p>
                ) : (
                  <ul className="mt-3 space-y-1.5 text-sm">
                    <Row dot="#e5484d" label="High risk" v={d.suppliers.high} />
                    <Row dot="#f0a020" label="Medium risk" v={d.suppliers.medium} />
                    <Row dot="#059669" label="Low risk" v={d.suppliers.low} />
                    <Row dot="#94a3b8" label="Follow-ups required" v={d.suppliers.followups} />
                  </ul>
                )}
                <button onClick={() => setActiveKey("EV.SUP")} className="mt-3 text-xs font-semibold text-teal hover:underline">Assess suppliers →</button>
              </div>

              <div className="card p-5">
                <h3 className="font-display text-base font-semibold">KPI status</h3>
                <ul className="mt-3 space-y-1.5 text-sm">
                  <Row dot="#059669" label="On track vs target" v={d.kpis.onTrack} />
                  <Row dot="#e5484d" label="Off track" v={d.kpis.offTrack} />
                  <Row dot="#94a3b8" label="No target set" v={d.kpis.noTarget} />
                </ul>
                <button onClick={() => setActiveKey("EV.KPIE")} className="mt-3 text-xs font-semibold text-teal hover:underline">Open KPIs →</button>
              </div>
            </div>

            {/* Evidence */}
            <div className="card p-5">
              <div className="flex flex-wrap items-center justify-between gap-3">
                <h3 className="font-display text-base font-semibold">Data & evidence availability</h3>
                <button onClick={() => setActiveKey("EV.DATAE")} className="text-xs font-semibold text-teal hover:underline">Open evidence tracker →</button>
              </div>
              <div className="mt-3 grid grid-cols-2 gap-3 sm:grid-cols-4">
                <EvTile label="Available" v={d.evidence.available} color="#059669" />
                <EvTile label="Partial" v={d.evidence.partial} color="#f0a020" />
                <EvTile label="Not available" v={d.evidence.notAvailable} color="#e5484d" />
                <EvTile label="Not yet assessed" v={d.evidence.notAssessed} color="#94a3b8" />
              </div>
              {d.evidence.mostAffectedTopic && (
                <p className="mt-3 text-xs text-text-muted">Most affected topic: <b className="text-text">{d.evidence.mostAffectedTopic}</b></p>
              )}
            </div>

            <p className="rounded-xl border border-border bg-surface-2/60 p-3 text-xs leading-relaxed text-text-muted">
              Figures are indicative and computed from the data you enter, using the toolkit&apos;s
              indicative UK conversion factors. Do not use externally without management review and
              evidence confirmation.
            </p>
          </div>
        ) : activeKey === DISCLOSURE ? (
          <DisclosureView data={d} responses={responses} onNavigate={setActiveKey} />
        ) : activeModule ? (
          <>
            <div className="mb-4">
              <h2 className="text-lg font-semibold">{activeModule.title}</h2>
              {activeModule.intro && <p className="mt-1 text-sm text-text-muted">{activeModule.intro}</p>}
            </div>
            <div className="space-y-6">
              {activeModule.subsections.map((sub) => (
                <section key={sub.key} className="space-y-4">
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
                </section>
              ))}
            </div>
          </>
        ) : null}
      </div>
    </div>
  );
}

function NavBtn({ active, onClick, label, right }: { active: boolean; onClick: () => void; label: string; right?: React.ReactNode }) {
  return (
    <button onClick={onClick} className={cn(
      "flex w-full items-center justify-between gap-2 rounded-lg px-3 py-2 text-left text-sm transition",
      active ? "bg-teal/10 font-medium text-teal" : "text-text-muted hover:bg-surface-2 hover:text-text",
    )}>
      <span className="truncate">{label}</span>
      {right}
    </button>
  );
}

function Row({ dot, label, v }: { dot: string; label: string; v: number }) {
  return (
    <li className="flex items-center justify-between">
      <span className="flex items-center gap-2 text-text-muted"><span className="h-2 w-2 rounded-full" style={{ background: dot }} />{label}</span>
      <span className="font-medium">{v}</span>
    </li>
  );
}

function EvTile({ label, v, color }: { label: string; v: number; color: string }) {
  return (
    <div className="rounded-lg border border-border p-3 text-center">
      <p className="font-display text-xl font-semibold" style={{ color }}>{v}</p>
      <p className="mt-0.5 text-[10px] uppercase tracking-wide text-text-muted">{label}</p>
    </div>
  );
}

const LEVEL_META = {
  missing: { label: "Not available", cls: "bg-[#e5484d]/10 text-[#b42318]" },
  draft: { label: "Draft only", cls: "bg-[#f0a020]/12 text-[#92600a]" },
  internal: { label: "Internal review only", cls: "bg-[#f0a020]/12 text-[#92600a]" },
  ready: { label: "Ready for review", cls: "bg-teal/10 text-teal" },
} as const;

function DisclosureView({ data, responses, onNavigate }: {
  data: ReturnType<typeof eventsData>; responses: ResponseMap; onNavigate: (key: string) => void;
}) {
  const disc = useMemo(() => buildDisclosure(data, responses), [data, responses]);
  return (
    <div className="space-y-5">
      <div>
        <h2 className="text-lg font-semibold">Disclosure builder</h2>
        <p className="mt-1 text-sm text-text-muted">Draft reporting text, computed live from your data. Internal use only until the gate is clear.</p>
      </div>

      <div className={cn("card p-4 text-sm", disc.externalUseOk ? "border-teal/30 bg-teal/5" : "border-[#e5484d]/25 bg-[#e5484d]/5")}>
        <p className={disc.externalUseOk ? "text-teal" : "text-[#b42318]"}>
          {disc.externalUseOk ? "✓" : "⛔"} {disc.gateMessage}
        </p>
        {!disc.externalUseOk && (
          <button onClick={() => onNavigate("__dash__")} className="mt-2 text-xs font-semibold text-teal hover:underline">See blocking issues on the dashboard →</button>
        )}
      </div>

      <div className="space-y-3">
        {disc.paragraphs.map((p) => (
          <div key={p.id} className="card p-5">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <h3 className="font-display text-sm font-semibold">{p.title}</h3>
              <span className={cn("rounded-full px-2.5 py-0.5 text-[10px] font-medium", LEVEL_META[p.level].cls)}>{LEVEL_META[p.level].label}</span>
            </div>
            <p className="mt-2 text-sm leading-relaxed text-text-muted">{p.text}</p>
          </div>
        ))}
      </div>

      <p className="rounded-xl border border-border bg-surface-2/60 p-3 text-xs leading-relaxed text-text-muted">
        Plain-English safety rules: no data means &ldquo;Data not yet available&rdquo;; optional-only carbon
        data is not a minimum estimate; partial minimum data is draft only; complete data without
        confirmed evidence is internal review only; complete data with confirmed evidence is ready for
        supervised management review. Final external use still requires management/legal review.
      </p>
    </div>
  );
}
