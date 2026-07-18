"use client";

import { useState } from "react";
import type { BrsrReport, ResponseMap } from "@/lib/brsr/db";
import { BRSR, moduleQuestions } from "@/lib/brsr/framework";
import { moduleCompletion, isAnswered, type Kpi } from "@/lib/brsr/calc";
import { validateReport } from "@/lib/brsr/validate";
import type { ModuleDef, QuestionDef } from "@/lib/brsr/types";

const STATUSES = ["draft", "in_review", "final"] as const;

export function BrsrOverview({
  report, responses, kpis, onNavigate, onStatusChange,
}: {
  report: BrsrReport;
  responses: ResponseMap;
  kpis: Kpi[];
  onNavigate: (moduleKey: string) => void;
  onStatusChange: (status: string) => Promise<void>;
}) {
  const [status, setStatus] = useState(report.status);
  const [savingStatus, setSavingStatus] = useState(false);
  const [statusError, setStatusError] = useState<string | null>(null);

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
    setStatus(s);
    setSavingStatus(true);
    try { await onStatusChange(s); } finally { setSavingStatus(false); }
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
          <label className="flex flex-col gap-1.5 text-sm">
            <span className="text-xs text-text-muted">Report status</span>
            <select
              value={status}
              onChange={(e) => changeStatus(e.target.value)}
              disabled={savingStatus}
              className="h-10 rounded-lg border border-border bg-surface px-3 text-sm"
            >
              {STATUSES.map((s) => <option key={s} value={s}>{s.replace("_", " ")}</option>)}
            </select>
          </label>
        </div>
        <div className="mt-4 h-2 overflow-hidden rounded-full bg-surface-2">
          <div className="h-full rounded-full bg-accent transition-all" style={{ width: `${pct}%` }} />
        </div>
        {statusError && <p className="mt-3 rounded-lg border border-[#f0a020]/30 bg-[#f0a020]/8 p-2.5 text-xs text-[#b54708]">{statusError}</p>}
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
