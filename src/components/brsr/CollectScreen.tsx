"use client";

import { Fragment, useMemo, useRef, useState } from "react";
import { allQuestions } from "@/lib/brsr/framework";
import { CORE_GUIDANCE, frameworkTags } from "@/lib/brsr/coreGuidance";
import { isAnswered } from "@/lib/brsr/calc";
import type { QuestionDef } from "@/lib/brsr/types";
import type { EvidenceFile, ResponseMap } from "@/lib/brsr/db";
import type { KpiState, KpiStatus } from "@/lib/brsr/pro";
import { QuestionRenderer } from "@/components/brsr/QuestionRenderer";
import { cn } from "@/lib/cn";

const STATE_META: Record<KpiState, { label: string; cls: string }> = {
  not_started: { label: "Not started", cls: "bg-surface-2 text-text-muted" },
  in_progress: { label: "In progress", cls: "bg-accent/10 text-accent" },
  data_entered: { label: "Data entered", cls: "bg-accent/10 text-accent" },
  evidence_attached: { label: "Evidence attached", cls: "bg-[#7c5cff]/12 text-[#6b4eff]" },
  validated: { label: "Validated", cls: "bg-teal/15 text-teal" },
  assurance_ready: { label: "Assurance-ready", cls: "bg-teal/20 text-teal" },
  needs_changes: { label: "Needs changes", cls: "bg-[#e5484d]/12 text-[#b42318]" },
  not_applicable: { label: "Not applicable", cls: "bg-surface-2 text-text-muted" },
};

const SUBMITTED_STATES: KpiState[] = ["data_entered", "evidence_attached", "validated", "assurance_ready"];
const VALIDATED_STATES: KpiState[] = ["validated", "assurance_ready"];

function effectiveState(manual: KpiState | undefined, hasData: boolean, hasEvidence: boolean): KpiState {
  if (manual === "not_applicable" || manual === "needs_changes" || manual === "validated" || manual === "assurance_ready") return manual;
  if (hasEvidence) return "evidence_attached";
  if (hasData) return "data_entered";
  if (manual === "in_progress") return "in_progress";
  return "not_started";
}

export function CollectScreen({
  reportId,
  responses,
  evidence,
  statuses,
  savingKeys,
  deadline,
  onChangeAnswer,
  onEvidenceChange,
  onKpiStatusChange,
}: {
  reportId: string;
  responses: ResponseMap;
  evidence: EvidenceFile[];
  statuses: Record<string, KpiStatus>;
  savingKeys: Set<string>;
  deadline?: string | null;
  onChangeAnswer: (key: string, value: unknown) => void;
  onEvidenceChange: (key: string, files: EvidenceFile[]) => void;
  onKpiStatusChange: (key: string, patch: Partial<Pick<KpiStatus, "status" | "assignee_email" | "validated_by" | "validated_at">>) => void;
}) {
  const [openKpi, setOpenKpi] = useState<string | null>(null);
  const [collapsed, setCollapsed] = useState<Set<string>>(new Set());

  const groups = useMemo(() => {
    const coreQs = allQuestions().filter((q) => q.isCore);
    const map = new Map<string, { order: number; questions: QuestionDef[] }>();
    for (const q of coreQs) {
      const g = CORE_GUIDANCE[q.key];
      if (!g) continue;
      const e = map.get(g.attribute) ?? { order: g.order, questions: [] };
      e.questions.push(q);
      map.set(g.attribute, e);
    }
    return [...map.entries()].sort((a, b) => a[1].order - b[1].order);
  }, []);

  const allCore = groups.flatMap(([, g]) => g.questions);
  const stateOf = (q: QuestionDef): KpiState =>
    effectiveState(statuses[q.key]?.status as KpiState | undefined, isAnswered(responses[q.key]), evidence.some((e) => e.question_key === q.key));

  const total = allCore.length;
  const submitted = allCore.filter((q) => SUBMITTED_STATES.includes(stateOf(q))).length;
  const validated = allCore.filter((q) => VALIDATED_STATES.includes(stateOf(q))).length;

  return (
    <div>
      {/* Summary tiles + two-state progress */}
      <div className="mb-5 grid gap-4 sm:grid-cols-3">
        <Tile label="Collection tasks" value={`${submitted} / ${total}`} sub="values entered" />
        <Tile label="Validated" value={`${validated} / ${total}`} sub="assurance-ready" />
        <Tile label="Upload deadline" value={deadline || "Not set"} sub="report period" />
      </div>
      <div className="mb-8">
        <div className="flex h-2.5 overflow-hidden rounded-full bg-surface-2">
          <div className="h-full bg-teal" style={{ width: `${total ? (validated / total) * 100 : 0}%` }} title="Validated" />
          <div className="h-full bg-accent/50" style={{ width: `${total ? ((submitted - validated) / total) * 100 : 0}%` }} title="Submitted, not yet validated" />
        </div>
        <div className="mt-2 flex gap-4 text-xs text-text-muted">
          <span className="flex items-center gap-1.5"><span className="h-2 w-2 rounded-full bg-teal" /> Validated</span>
          <span className="flex items-center gap-1.5"><span className="h-2 w-2 rounded-full bg-accent/50" /> Submitted</span>
          <span className="flex items-center gap-1.5"><span className="h-2 w-2 rounded-full bg-surface-2 ring-1 ring-border" /> Not started</span>
        </div>
      </div>

      {/* Attribute sections */}
      <div className="space-y-4">
        {groups.map(([attribute, g], i) => {
          const done = g.questions.filter((q) => VALIDATED_STATES.includes(stateOf(q))).length;
          const isCollapsed = collapsed.has(attribute);
          return (
            <section key={attribute} className="card overflow-hidden">
              <button
                onClick={() => setCollapsed((s) => { const n = new Set(s); n.has(attribute) ? n.delete(attribute) : n.add(attribute); return n; })}
                className="flex w-full items-center justify-between gap-3 px-5 py-4 text-left"
              >
                <span className="flex items-center gap-3">
                  <span className="grid h-6 w-6 place-items-center rounded-full bg-accent/10 text-xs font-semibold text-accent">{i + 1}</span>
                  <span className="font-display text-base font-semibold">{attribute}</span>
                </span>
                <span className="flex items-center gap-3 text-xs text-text-muted">
                  {done}/{g.questions.length} validated
                  <ChevronIcon open={!isCollapsed} />
                </span>
              </button>

              {!isCollapsed && (
                <div className="border-t border-border">
                  <table className="w-full text-sm">
                    <tbody>
                      {g.questions.map((q) => {
                        const st = stateOf(q);
                        const meta = STATE_META[st];
                        const assignee = statuses[q.key]?.assignee_email;
                        const open = openKpi === q.key;
                        const hasData = isAnswered(responses[q.key]);
                        return (
                          <Fragment key={q.key}>
                            <tr className="cursor-pointer border-b border-border/60 hover:bg-surface-2/40" onClick={() => setOpenKpi(open ? null : q.key)}>
                              <td className="px-5 py-3">
                                <p className="font-medium text-text">{q.title}</p>
                                <p className="text-xs text-text-muted">{q.code}</p>
                              </td>
                              <td className="px-3 py-3 text-xs text-text-muted">{assignee ? `👤 ${assignee}` : <span className="text-text-muted/60">Unassigned</span>}</td>
                              <td className="px-3 py-3 text-xs text-text-muted">{hasData ? "Data entered" : "No data"}</td>
                              <td className="px-3 py-3"><span className={cn("rounded-full px-2 py-0.5 text-[11px] font-medium", meta.cls)}>{meta.label}</span></td>
                              <td className="px-5 py-3 text-right text-text-muted"><ChevronIcon open={open} /></td>
                            </tr>
                            {open && (
                              <tr>
                                <td colSpan={5} className="bg-surface-2/30 px-5 py-4">
                                  <KpiDetail
                                    key={q.key}
                                    q={q}
                                    reportId={reportId}
                                    responses={responses}
                                    evidence={evidence}
                                    savingKeys={savingKeys}
                                    status={statuses[q.key]}
                                    onChangeAnswer={onChangeAnswer}
                                    onEvidenceChange={onEvidenceChange}
                                    onKpiStatusChange={onKpiStatusChange}
                                  />
                                </td>
                              </tr>
                            )}
                          </Fragment>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              )}
            </section>
          );
        })}
      </div>
    </div>
  );
}

function KpiDetail({
  q, reportId, responses, evidence, savingKeys, status, onChangeAnswer, onEvidenceChange, onKpiStatusChange,
}: {
  q: QuestionDef;
  reportId: string;
  responses: ResponseMap;
  evidence: EvidenceFile[];
  savingKeys: Set<string>;
  status?: KpiStatus;
  onChangeAnswer: (key: string, value: unknown) => void;
  onEvidenceChange: (key: string, files: EvidenceFile[]) => void;
  onKpiStatusChange: (key: string, patch: Partial<Pick<KpiStatus, "status" | "assignee_email" | "validated_by" | "validated_at">>) => void;
}) {
  const tags = frameworkTags(q.key);
  const [assignee, setAssignee] = useState(status?.assignee_email ?? "");
  const saveTimer = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);

  const onOwner = (val: string) => {
    setAssignee(val);
    clearTimeout(saveTimer.current);
    saveTimer.current = setTimeout(() => onKpiStatusChange(q.key, { assignee_email: val.trim() || null }), 500);
  };

  return (
    <div className="space-y-4">
      {/* Framework tags + ownership + status */}
      <div className="flex flex-wrap items-center gap-2">
        {tags && (
          <>
            <Tag>BRSR Principle {tags.brsrPrinciple}</Tag>
            {tags.gri && <Tag>{tags.gri}</Tag>}
            {tags.issb && <Tag>{tags.issb}</Tag>}
            {tags.sdg && <Tag>{tags.sdg}</Tag>}
          </>
        )}
      </div>

      <div className="flex flex-wrap items-center gap-3 rounded-lg border border-border bg-surface p-3">
        <label className="flex items-center gap-2 text-xs text-text-muted">
          Owner
          <input
            value={assignee}
            onChange={(e) => onOwner(e.target.value)}
            placeholder="email"
            className="h-8 w-44 rounded-lg border border-border bg-surface px-2 text-sm text-text"
          />
        </label>
        <label className="flex items-center gap-2 text-xs text-text-muted">
          Status
          <select
            value={status?.status ?? "not_started"}
            onChange={(e) => onKpiStatusChange(q.key, { status: e.target.value as KpiState })}
            className="h-8 rounded-lg border border-border bg-surface px-2 text-sm text-text"
          >
            {(["not_started", "in_progress", "needs_changes", "not_applicable", "validated", "assurance_ready"] as KpiState[]).map((s) => (
              <option key={s} value={s}>{STATE_META[s].label}</option>
            ))}
          </select>
        </label>
        <button
          onClick={() => onKpiStatusChange(q.key, { status: "validated", validated_at: new Date().toISOString() })}
          className="h-8 rounded-lg bg-teal/15 px-3 text-xs font-medium text-teal transition hover:bg-teal/25"
        >
          Mark validated
        </button>
      </div>

      <QuestionRenderer
        q={q}
        value={responses[q.key]}
        onChange={(v) => onChangeAnswer(q.key, v)}
        reportId={reportId}
        evidence={evidence.filter((e) => e.question_key === q.key)}
        onEvidenceChange={(files) => onEvidenceChange(q.key, files)}
      />
      {savingKeys.has(q.key) && <p className="text-[11px] text-text-muted">Saving…</p>}
    </div>
  );
}

function Tile({ label, value, sub }: { label: string; value: string; sub: string }) {
  return (
    <div className="card p-4">
      <p className="text-xs uppercase tracking-wide text-text-muted">{label}</p>
      <p className="mt-1 font-display text-2xl font-semibold">{value}</p>
      <p className="text-xs text-text-muted">{sub}</p>
    </div>
  );
}

function Tag({ children }: { children: React.ReactNode }) {
  return <span className="rounded bg-surface-2 px-2 py-0.5 text-[11px] font-medium text-text-muted">{children}</span>;
}

function ChevronIcon({ open }: { open?: boolean }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className={cn("h-4 w-4 transition-transform", open && "rotate-180")}>
      <path d="M6 9l6 6 6-6" />
    </svg>
  );
}
