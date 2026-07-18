"use client";

import { useState } from "react";
import { upsertSectionStatus, type SectionState, type SectionStatus } from "@/lib/brsr/pro";

const STATES: { value: SectionState; label: string }[] = [
  { value: "not_started", label: "Not started" },
  { value: "in_progress", label: "In progress" },
  { value: "submitted", label: "Submitted for review" },
  { value: "approved", label: "Approved" },
  { value: "needs_changes", label: "Needs changes" },
];

/** Assignment + review state + reviewer comment for one module (section/principle). */
export function WorkflowBar({
  reportId,
  moduleKey,
  status,
  onChange,
}: {
  reportId: string;
  moduleKey: string;
  status?: SectionStatus;
  onChange: (s: SectionStatus) => void;
}) {
  const [assignee, setAssignee] = useState(status?.assignee_email ?? "");
  const [comment, setComment] = useState(status?.reviewer_comment ?? "");
  const [busy, setBusy] = useState(false);

  const save = async (patch: Partial<Pick<SectionStatus, "assignee_email" | "state" | "reviewer_comment">>) => {
    setBusy(true);
    try {
      const next = await upsertSectionStatus(reportId, moduleKey, {
        assignee_email: assignee.trim() || null,
        reviewer_comment: comment.trim() || null,
        ...patch,
      });
      onChange(next);
    } finally {
      setBusy(false);
    }
  };

  const state = status?.state ?? "not_started";

  return (
    <div className="mb-4 flex flex-wrap items-center gap-3 rounded-xl border border-border bg-surface-2/40 px-4 py-3">
      <label className="flex items-center gap-2 text-xs text-text-muted">
        Assigned to
        <input
          value={assignee}
          onChange={(e) => setAssignee(e.target.value)}
          onBlur={() => save({})}
          placeholder="email"
          className="h-8 w-44 rounded-lg border border-border bg-surface px-2 text-sm text-text"
        />
      </label>
      <label className="flex items-center gap-2 text-xs text-text-muted">
        Review state
        <select
          value={state}
          onChange={(e) => save({ state: e.target.value as SectionState })}
          disabled={busy}
          className="h-8 rounded-lg border border-border bg-surface px-2 text-sm text-text"
        >
          {STATES.map((s) => <option key={s.value} value={s.value}>{s.label}</option>)}
        </select>
      </label>
      <label className="flex flex-1 items-center gap-2 text-xs text-text-muted">
        Reviewer note
        <input
          value={comment}
          onChange={(e) => setComment(e.target.value)}
          onBlur={() => save({})}
          placeholder="e.g. needs evidence for EI-7"
          className="h-8 min-w-[160px] flex-1 rounded-lg border border-border bg-surface px-2 text-sm text-text"
        />
      </label>
    </div>
  );
}

export const STATE_COLORS: Record<SectionState, string> = {
  not_started: "bg-surface-2 text-text-muted",
  in_progress: "bg-accent/12 text-accent-3",
  submitted: "bg-[#f0a020]/15 text-[#b54708]",
  approved: "bg-teal/15 text-teal",
  needs_changes: "bg-[#e5484d]/15 text-[#b42318]",
};

export const STATE_LABELS: Record<SectionState, string> = {
  not_started: "Not started",
  in_progress: "In progress",
  submitted: "Submitted",
  approved: "Approved",
  needs_changes: "Needs changes",
};
