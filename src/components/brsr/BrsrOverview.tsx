"use client";

import { useState } from "react";
import type { BrsrReport, ResponseMap } from "@/lib/brsr/db";
import { BRSR, moduleQuestions } from "@/lib/brsr/framework";
import { moduleCompletion, isAnswered, type Kpi } from "@/lib/brsr/calc";
import { validateReport } from "@/lib/brsr/validate";
import type { ModuleDef, QuestionDef } from "@/lib/brsr/types";

export function BrsrOverview({
  report, responses, kpis, onNavigate, onStatusChange, onUpdateFinancials, isAdmin = false,
}: {
  report: BrsrReport;
  responses: ResponseMap;
  kpis: Kpi[];
  onNavigate: (moduleKey: string) => void;
  onStatusChange: (status: string) => Promise<void>;
  onUpdateFinancials?: (patch: { turnover: number | null; ppp_factor: number | null }) => Promise<void>;
  isAdmin?: boolean;
}) {
  const [status, setStatus] = useState(report.status);
  const [savingStatus, setSavingStatus] = useState(false);
  const [statusError, setStatusError] = useState<string | null>(null);
  // Financials editor (turnover entered in ₹ crore, stored in INR).
  const [crore, setCrore] = useState(report.turnover != null ? String(Number(report.turnover) / 1e7) : "");
  const [pppVal, setPppVal] = useState(report.ppp_factor != null ? String(report.ppp_factor) : "");
  const [finBusy, setFinBusy] = useState(false);
  const [finNote, setFinNote] = useState<string | null>(null);

  const saveFinancials = async () => {
    if (!onUpdateFinancials) return;
    setFinBusy(true);
    setFinNote(null);
    try {
      await onUpdateFinancials({
        turnover: crore ? Number(crore) * 1e7 : null,
        ppp_factor: pppVal ? Number(pppVal) : null,
      });
      setFinNote("Saved. Intensity figures now use these values.");
    } catch (e) {
      setFinNote(e instanceof Error ? e.message : "Could not save.");
    } finally {
      setFinBusy(false);
    }
  };

  const allIssues = validateReport(responses);
  const errors = allIssues.filter((i) => i.kind === "error");
  const anomalies = allIssues.filter((i) => i.kind === "anomaly");
  const issuesByModule = new Map<string, typeof errors>();
  for (const i of errors) {
    const arr = issuesByModule.get(i.moduleKey) ?? [];
    arr.push(i);
    issuesByModule.set(i.moduleKey, arr);
  }

  const perModule = BRSR.modules.map((m) => ({ m, ...moduleCompletion(moduleQuestions(m), responses) }));
  const answered = perModule.reduce((a, x) => a + x.answered, 0);
  const total = perModule.reduce((a, x) => a + x.total, 0);
  const pct = total === 0 ? 0 : Math.round((answered / total) * 100);

  // Unanswered BRSR Core items, with their module for navigation.
  const missingCore: { q: QuestionDef; mod: ModuleDef }[] = [];
  for (const m of BRSR.modules) {
    for (const q of moduleQuestions(m)) {
      if (q.isCore && !isAnswered(responses[q.key])) missingCore.push({ q, mod: m });
    }
  }

  const changeStatus = async (s: string) => {
    setStatusError(null);
    if (s === "final" && (errors.length > 0 || missingCoreCount() > 0)) {
      setStatusError("Resolve the data checks and complete all BRSR Core items before marking the report final.");
      return;
    }
    const prev = status;
    setStatus(s);
    setSavingStatus(true);
    try {
      await onStatusChange(s);
    } catch (e) {
      setStatus(prev);
      setStatusError(e instanceof Error ? e.message : "Could not change the status.");
    } finally {
      setSavingStatus(false);
    }
  };

  function missingCoreCount(): number {
    let n = 0;
    for (const m of BRSR.modules) for (const q of moduleQuestions(m)) if (q.isCore && !isAnswered(responses[q.key])) n++;
    return n;
  }

  return (
    <div className="space-y-6">
      <div className="card p-6">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <p className="text-xs uppercase tracking-wide text-text-muted">Overall completion</p>
            <p className="mt-1 font-display text-3xl font-semibold">{pct}%</p>
            <p className="text-xs text-text-muted">{answered} of {total} questions started</p>
          </div>
          <div className="flex flex-col items-end gap-1.5 text-sm">
            <span className="text-xs text-text-muted">Report status</span>
            <div className="flex items-center gap-2">
              <span className={
                "rounded-full px-3 py-1 text-xs font-medium " +
                (status === "final" ? "bg-teal/10 text-teal" : status === "in_review" ? "bg-[#f0a020]/12 text-[#92600a]" : "bg-surface-2 text-text-muted")
              }>
                {status === "final" ? "Released" : status === "in_review" ? "Under ESGEN review" : "Draft"}
              </span>
              {/* Clients move draft <-> in_review; only ESGEN releases or reopens. */}
              {status === "draft" && (
                <button onClick={() => changeStatus("in_review")} disabled={savingStatus} className="rounded-lg bg-accent px-3 py-1.5 text-xs font-medium text-white disabled:opacity-50">
                  Submit for review
                </button>
              )}
              {status === "in_review" && (
                <button onClick={() => changeStatus("draft")} disabled={savingStatus} className="rounded-lg border border-border px-3 py-1.5 text-xs text-text-muted transition hover:border-teal hover:text-text disabled:opacity-50">
                  Back to draft
                </button>
              )}
              {isAdmin && status === "in_review" && (
                <button onClick={() => changeStatus("final")} disabled={savingStatus} className="rounded-lg bg-teal px-3 py-1.5 text-xs font-medium text-white disabled:opacity-50">
                  Release report (ESGEN)
                </button>
              )}
              {isAdmin && status === "final" && (
                <button onClick={() => changeStatus("in_review")} disabled={savingStatus} className="rounded-lg border border-border px-3 py-1.5 text-xs text-text-muted disabled:opacity-50">
                  Reopen (ESGEN)
                </button>
              )}
            </div>
            {status === "in_review" && !isAdmin && (
              <span className="text-[11px] text-text-muted">ESGEN reviews the data and releases the report.</span>
            )}
          </div>
        </div>
        <div className="mt-4 h-2 overflow-hidden rounded-full bg-surface-2">
          <div className="h-full rounded-full bg-accent transition-all" style={{ width: `${pct}%` }} />
        </div>
        {statusError && <p className="mt-3 rounded-lg border border-[#f0a020]/30 bg-[#f0a020]/8 p-2.5 text-xs text-[#b54708]">{statusError}</p>}
      </div>

      {/* Financials: the denominators every SEBI intensity ratio depends on. */}
      <div className="card p-6">
        <h3 className="font-display text-base font-semibold">Reporting entity financials</h3>
        <p className="mt-1 text-xs text-text-muted">Used for the intensity ratios (per rupee of turnover, PPP-adjusted). FY {report.financial_year}.</p>
        <div className="mt-4 flex flex-wrap items-end gap-3">
          <label className="flex min-w-[180px] flex-col gap-1">
            <span className="text-xs font-medium">Turnover (₹ crore)</span>
            <input value={crore} onChange={(e) => setCrore(e.target.value)} inputMode="decimal" placeholder="e.g. 300" className="h-10 rounded-lg border border-border bg-surface px-3 text-sm" />
          </label>
          <label className="flex min-w-[160px] flex-col gap-1">
            <span className="text-xs font-medium">PPP factor (INR per int&apos;l $)</span>
            <input value={pppVal} onChange={(e) => setPppVal(e.target.value)} inputMode="decimal" placeholder="e.g. 21.6" className="h-10 rounded-lg border border-border bg-surface px-3 text-sm" />
          </label>
          <button onClick={saveFinancials} disabled={finBusy || !onUpdateFinancials} className="h-10 rounded-lg bg-accent px-4 text-sm font-medium text-white disabled:opacity-50">
            {finBusy ? "Saving..." : "Save"}
          </button>
        </div>
        <p className="mt-2 text-[11px] text-text-muted">
          {crore && Number(crore) > 0
            ? `₹${Number(crore).toLocaleString("en-IN")} crore = ₹${(Number(crore) * 1e7).toLocaleString("en-IN")}`
            : "Enter the value in crores; the tool stores the full INR figure."}
        </p>
        {crore !== "" && Number(crore) > 0 && Number(crore) < 0.1 && (
          <p className="mt-2 rounded-lg border border-[#f0a020]/30 bg-[#f0a020]/8 p-2.5 text-xs text-[#b54708]">
            That is under ₹10 lakh of annual turnover, which is unusually low for a reporting entity.
            If you meant ₹{Number(crore).toLocaleString("en-IN")} crore, the field is already in crores.
          </p>
        )}
        {crore !== "" && Number(crore) > 500000 && (
          <p className="mt-2 rounded-lg border border-[#f0a020]/30 bg-[#f0a020]/8 p-2.5 text-xs text-[#b54708]">
            That is over ₹5 lakh crore, larger than India&apos;s biggest companies. If you pasted the raw
            INR figure, divide by 1,00,00,000: enter {Number(crore) / 1e7 >= 0.01 ? (Number(crore) / 1e7).toLocaleString("en-IN") : "the value"} instead.
          </p>
        )}
        {finNote && <p className="mt-2 text-[11px] text-text-muted">{finNote}</p>}
      </div>

      {anomalies.length > 0 && (
        <div className="card p-6">
          <h3 className="font-display text-base font-semibold">
            Year-on-year outliers
            <span className="ml-2 rounded bg-accent/10 px-1.5 text-xs text-accent">{anomalies.length}</span>
          </h3>
          <p className="mt-1 text-xs text-text-muted">Advisory: figures that changed more than 50% from the previous year. Review that these are correct.</p>
          <ul className="mt-3 space-y-1">
            {anomalies.slice(0, 10).map((a, idx) => (
              <li key={idx} className="text-xs text-text-muted">
                <button onClick={() => onNavigate(a.moduleKey)} className="font-medium text-accent hover:underline">{a.code}</button> · {a.message}
              </li>
            ))}
            {anomalies.length > 10 && <li className="text-xs text-text-muted">+ {anomalies.length - 10} more</li>}
          </ul>
        </div>
      )}

      {errors.length > 0 && (
        <div className="card p-6">
          <h3 className="font-display text-base font-semibold">
            Data checks
            <span className="ml-2 rounded bg-[#f0a020]/15 px-1.5 text-xs text-[#b54708]">{errors.length}</span>
          </h3>
          <p className="mt-1 text-xs text-text-muted">Advisory consistency checks (percentages ≤ 100, non-negative values, sub-totals reconcile). Resolve before marking final.</p>
          <ul className="mt-3 space-y-2">
            {[...issuesByModule.entries()].map(([modKey, list]) => {
              const mod = BRSR.modules.find((m) => m.key === modKey);
              return (
                <li key={modKey}>
                  <button onClick={() => onNavigate(modKey)} className="text-left text-sm font-medium text-accent hover:underline">{mod?.navLabel}</button>
                  <ul className="mt-1 space-y-0.5 pl-3">
                    {list.slice(0, 6).map((i, idx) => (
                      <li key={idx} className="text-xs text-text-muted"><span className="font-medium text-text">{i.code}</span> {i.message}</li>
                    ))}
                    {list.length > 6 && <li className="text-xs text-text-muted">+ {list.length - 6} more</li>}
                  </ul>
                </li>
              );
            })}
          </ul>
        </div>
      )}

      <div className="grid gap-6 lg:grid-cols-2">
        {/* Per-section progress */}
        <div className="card p-6">
          <h3 className="font-display text-base font-semibold">Progress by section</h3>
          <ul className="mt-3 space-y-2.5">
            {perModule.map(({ m, answered, total }) => {
              const p = total === 0 ? 0 : Math.round((answered / total) * 100);
              return (
                <li key={m.key}>
                  <button onClick={() => onNavigate(m.key)} className="flex w-full items-center gap-3 text-left text-sm">
                    <span className="w-44 truncate text-text-muted">{m.navLabel}</span>
                    <span className="h-1.5 flex-1 overflow-hidden rounded-full bg-surface-2">
                      <span className="block h-full rounded-full bg-accent" style={{ width: `${p}%` }} />
                    </span>
                    <span className="w-12 shrink-0 text-right font-mono text-xs text-text-muted">{answered}/{total}</span>
                  </button>
                </li>
              );
            })}
          </ul>
        </div>

        {/* Missing Core items */}
        <div className="card p-6">
          <h3 className="font-display text-base font-semibold">
            BRSR Core items outstanding
            <span className="ml-2 rounded bg-teal/15 px-1.5 text-xs text-teal">{missingCore.length}</span>
          </h3>
          <p className="mt-1 text-xs text-text-muted">Assured KPIs that still need data.</p>
          {missingCore.length === 0 ? (
            <p className="mt-3 text-sm text-teal">All Core items have data.</p>
          ) : (
            <ul className="mt-3 space-y-1.5">
              {missingCore.map(({ q, mod }) => (
                <li key={q.key}>
                  <button onClick={() => onNavigate(mod.key)} className="text-left text-sm text-text-muted hover:text-text">
                    <span className="font-medium text-text">{q.code}</span> · {q.title}
                  </button>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>

      {kpis.length > 0 && (
        <div className="card p-6">
          <h3 className="font-display text-base font-semibold">Computed BRSR Core KPIs</h3>
          <ul className="mt-3 grid gap-3 sm:grid-cols-2">
            {kpis.map((k) => (
              <li key={k.label} className="rounded-xl border border-border bg-surface-2/50 p-3">
                <p className="text-xs text-text-muted">{k.label}</p>
                <p className="font-mono text-sm">{k.value == null ? "—" : k.value.toExponential(3)} {k.unit}</p>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
