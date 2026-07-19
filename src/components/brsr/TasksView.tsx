"use client";

import { useEffect, useMemo, useState } from "react";
import { useCompany } from "@/components/tool/CompanyProvider";
import {
  listTasks, addTask, updateTask, deleteTask, listOrgUnits, isMissingTable,
  type CollectionTask, type OrgUnit, type TaskSchedule, type TaskStatus,
} from "@/lib/brsr/ops";
import { fetchMembers, type Member } from "@/lib/brsr/pro";
import { allQuestions } from "@/lib/brsr/framework";
import { Button } from "@/components/ui/Button";
import { cn } from "@/lib/cn";
import type { BrsrReport } from "@/lib/brsr/db";

/**
 * Scheduled data-collection tasks: who submits which metric for which period.
 * The operational engine behind an on-time, assurance-ready BRSR filing.
 */

const SCHEDULES: { value: TaskSchedule; label: string }[] = [
  { value: "one_off", label: "One-off" },
  { value: "monthly", label: "Monthly" },
  { value: "quarterly", label: "Quarterly" },
  { value: "annual", label: "Annual" },
];

const STATUS_META: Record<TaskStatus, { label: string; cls: string }> = {
  open: { label: "Open", cls: "bg-surface-2 text-text-muted" },
  submitted: { label: "Submitted", cls: "bg-[#f0a020]/12 text-[#92600a]" },
  done: { label: "Done", cls: "bg-teal/10 text-teal" },
};

const EMPTY = { title: "", questionKey: "", orgUnitId: "", assignee: "", schedule: "monthly" as TaskSchedule, period: "", dueDate: "", unit: "" };

export function TasksView({ report }: { report: BrsrReport }) {
  const { company } = useCompany();
  const [tasks, setTasks] = useState<CollectionTask[]>([]);
  const [units, setUnits] = useState<OrgUnit[]>([]);
  const [members, setMembers] = useState<Member[]>([]);
  const [loading, setLoading] = useState(true);
  const [needsMigration, setNeedsMigration] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState(EMPTY);
  const [busy, setBusy] = useState(false);
  const [filter, setFilter] = useState<"all" | TaskStatus>("all");

  const coreQuestions = useMemo(() => allQuestions().filter((q) => q.isCore || q.key.startsWith("C.P6")), []);

  useEffect(() => {
    if (!company) return;
    (async () => {
      try {
        const [t, u, m] = await Promise.all([
          listTasks(company.id),
          listOrgUnits(company.id).catch(() => [] as OrgUnit[]),
          fetchMembers(company.id).catch(() => [] as Member[]),
        ]);
        setTasks(t);
        setUnits(u);
        setMembers(m);
      } catch (e) {
        if (isMissingTable(e)) setNeedsMigration(true);
        else setError(e instanceof Error ? e.message : "Could not load tasks.");
      } finally {
        setLoading(false);
      }
    })();
  }, [company]);

  const set = (k: keyof typeof EMPTY) => (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) =>
    setForm((f) => ({ ...f, [k]: e.target.value }));

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!company || !form.title.trim()) return;
    setBusy(true);
    setError(null);
    try {
      const t = await addTask({
        company_id: company.id,
        report_id: report.id,
        title: form.title.trim(),
        question_key: form.questionKey || null,
        org_unit_id: form.orgUnitId || null,
        assignee_email: form.assignee.trim() || null,
        schedule: form.schedule,
        period: form.period.trim() || null,
        due_date: form.dueDate || null,
        unit: form.unit.trim() || null,
        note: null,
      });
      setTasks((ts) => [t, ...ts]);
      setForm(EMPTY);
      setShowForm(false);
    } catch (e2) {
      if (isMissingTable(e2)) setNeedsMigration(true);
      else setError(e2 instanceof Error ? e2.message : "Could not create the task.");
    } finally {
      setBusy(false);
    }
  };

  const setStatus = async (t: CollectionTask, status: TaskStatus) => {
    setTasks((ts) => ts.map((x) => (x.id === t.id ? { ...x, status } : x)));
    try { await updateTask(t.id, { status }); } catch { /* next load reconciles */ }
  };

  const remove = async (id: string) => {
    setTasks((ts) => ts.filter((x) => x.id !== id));
    try { await deleteTask(id); } catch { /* next load reconciles */ }
  };

  const today = new Date().toISOString().slice(0, 10);
  const visible = tasks.filter((t) => filter === "all" || t.status === filter);
  const counts = {
    open: tasks.filter((t) => t.status === "open").length,
    overdue: tasks.filter((t) => t.status === "open" && t.due_date && t.due_date < today).length,
    submitted: tasks.filter((t) => t.status === "submitted").length,
    done: tasks.filter((t) => t.status === "done").length,
  };
  const unitName = (id: string | null) => units.find((u) => u.id === id)?.name ?? null;

  return (
    <div className="space-y-5">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <h2 className="text-lg font-semibold">Collection tasks</h2>
          <p className="mt-1 max-w-2xl text-sm text-text-muted">
            Schedule who submits which data, for which site and period. Tasks keep the BRSR filing on
            time and make gaps visible early.
          </p>
        </div>
        <Button size="md" onClick={() => setShowForm((s) => !s)}>{showForm ? "Close" : "+ Add task"}</Button>
      </div>

      {needsMigration && (
        <p className="rounded-xl border border-[#f0a020]/30 bg-[#f0a020]/8 p-3 text-xs leading-relaxed text-[#92600a]">
          Tasks need a one-time database update: run <code className="rounded bg-white/60 px-1">supabase/brsr_ops.sql</code> in
          the Supabase SQL Editor, then reload.
        </p>
      )}
      {error && <p className="rounded-xl border border-[#e5484d]/30 bg-[#e5484d]/8 p-3 text-sm text-[#b42318]">{error}</p>}

      {/* Summary tiles */}
      <div className="grid gap-4 sm:grid-cols-4">
        <TaskTile label="Open" value={counts.open} />
        <TaskTile label="Overdue" value={counts.overdue} warn={counts.overdue > 0} />
        <TaskTile label="Submitted" value={counts.submitted} />
        <TaskTile label="Done" value={counts.done} good />
      </div>

      {/* Add form */}
      {showForm && !needsMigration && (
        <form onSubmit={submit} className="card space-y-4 p-5">
          <p className="text-sm font-semibold">New collection task</p>
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            <label className="flex flex-col gap-1 lg:col-span-2">
              <span className="text-xs font-medium">Task *</span>
              <input value={form.title} onChange={set("title")} placeholder="e.g. Submit March electricity bill" className="h-10 rounded-lg border border-border bg-surface px-3 text-sm" />
            </label>
            <label className="flex flex-col gap-1">
              <span className="text-xs font-medium">Feeds BRSR field</span>
              <select value={form.questionKey} onChange={set("questionKey")} className="h-10 rounded-lg border border-border bg-surface px-3 text-sm">
                <option value="">Not linked</option>
                {coreQuestions.map((q) => <option key={q.key} value={q.key}>{q.code ?? q.key}</option>)}
              </select>
            </label>
            <label className="flex flex-col gap-1">
              <span className="text-xs font-medium">Organisation unit</span>
              <select value={form.orgUnitId} onChange={set("orgUnitId")} className="h-10 rounded-lg border border-border bg-surface px-3 text-sm">
                <option value="">Whole company</option>
                {units.map((u) => <option key={u.id} value={u.id}>{u.name}</option>)}
              </select>
            </label>
            <label className="flex flex-col gap-1">
              <span className="text-xs font-medium">Assignee</span>
              {members.length > 0 ? (
                <select value={form.assignee} onChange={set("assignee")} className="h-10 rounded-lg border border-border bg-surface px-3 text-sm">
                  <option value="">Unassigned</option>
                  {members.map((m) => <option key={m.id} value={m.email}>{m.email}</option>)}
                </select>
              ) : (
                <input value={form.assignee} onChange={set("assignee")} placeholder="email@company.com" className="h-10 rounded-lg border border-border bg-surface px-3 text-sm" />
              )}
            </label>
            <label className="flex flex-col gap-1">
              <span className="text-xs font-medium">Schedule</span>
              <select value={form.schedule} onChange={set("schedule")} className="h-10 rounded-lg border border-border bg-surface px-3 text-sm">
                {SCHEDULES.map((s) => <option key={s.value} value={s.value}>{s.label}</option>)}
              </select>
            </label>
            <label className="flex flex-col gap-1">
              <span className="text-xs font-medium">Period</span>
              <input value={form.period} onChange={set("period")} placeholder="e.g. 2025-04 or Q1 FY26" className="h-10 rounded-lg border border-border bg-surface px-3 text-sm" />
            </label>
            <label className="flex flex-col gap-1">
              <span className="text-xs font-medium">Due date</span>
              <input type="date" value={form.dueDate} onChange={set("dueDate")} className="h-10 rounded-lg border border-border bg-surface px-3 text-sm" />
            </label>
            <label className="flex flex-col gap-1">
              <span className="text-xs font-medium">Unit of measure</span>
              <input value={form.unit} onChange={set("unit")} placeholder="kWh / kL / MT" className="h-10 rounded-lg border border-border bg-surface px-3 text-sm" />
            </label>
          </div>
          <div className="flex gap-2">
            <Button type="submit" size="md" disabled={busy || !form.title.trim()}>{busy ? "Adding..." : "Add task"}</Button>
            <Button size="md" variant="ghost" onClick={() => setShowForm(false)}>Cancel</Button>
          </div>
        </form>
      )}

      {/* Filter chips */}
      <div className="flex gap-1.5">
        {(["all", "open", "submitted", "done"] as const).map((f) => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className={cn(
              "rounded-full px-3 py-1 text-xs font-medium transition",
              filter === f ? "bg-teal/10 text-teal" : "text-text-muted hover:bg-surface-2",
            )}
          >
            {f === "all" ? "All" : STATUS_META[f].label}
          </button>
        ))}
      </div>

      {/* Task list */}
      <section className="card overflow-hidden">
        {loading ? (
          <p className="p-5 text-sm text-text-muted">Loading...</p>
        ) : visible.length === 0 ? (
          <p className="p-5 text-sm text-text-muted">
            {tasks.length === 0
              ? "No tasks yet. A good start: one task per utility bill, per site, per month."
              : "Nothing in this filter."}
          </p>
        ) : (
          <ul className="divide-y divide-border">
            {visible.map((t) => {
              const overdue = t.status === "open" && t.due_date && t.due_date < today;
              return (
                <li key={t.id} className="flex flex-wrap items-center gap-3 px-5 py-3.5">
                  <div className="min-w-0 flex-1">
                    <p className="flex flex-wrap items-center gap-2 text-sm font-medium">
                      <span className="truncate">{t.title}</span>
                      <span className={cn("shrink-0 rounded-full px-2 py-0.5 text-[10px] font-medium", STATUS_META[t.status].cls)}>{STATUS_META[t.status].label}</span>
                      {overdue && <span className="shrink-0 rounded-full bg-[#e5484d]/10 px-2 py-0.5 text-[10px] font-medium text-[#b42318]">Overdue</span>}
                    </p>
                    <p className="mt-0.5 flex flex-wrap gap-x-3 gap-y-0.5 text-[11px] text-text-muted">
                      {t.question_key && <span>{t.question_key}</span>}
                      {unitName(t.org_unit_id) && <span>{unitName(t.org_unit_id)}</span>}
                      {t.assignee_email && <span>{t.assignee_email}</span>}
                      <span>{SCHEDULES.find((s) => s.value === t.schedule)?.label}{t.period ? ` · ${t.period}` : ""}</span>
                      {t.due_date && <span>Due {t.due_date}</span>}
                    </p>
                  </div>
                  <div className="flex shrink-0 items-center gap-2">
                    {t.status === "open" && (
                      <button onClick={() => setStatus(t, "submitted")} className="rounded-lg border border-border px-2.5 py-1.5 text-xs text-text-muted transition hover:border-teal hover:text-text">Mark submitted</button>
                    )}
                    {t.status === "submitted" && (
                      <>
                        <button onClick={() => setStatus(t, "done")} className="rounded-lg border border-border px-2.5 py-1.5 text-xs text-text-muted transition hover:border-teal hover:text-text">Mark done</button>
                        <button onClick={() => setStatus(t, "open")} className="rounded-lg border border-border px-2.5 py-1.5 text-xs text-text-muted transition hover:border-border">Reopen</button>
                      </>
                    )}
                    {t.status === "done" && (
                      <button onClick={() => setStatus(t, "open")} className="rounded-lg border border-border px-2.5 py-1.5 text-xs text-text-muted transition hover:border-border">Reopen</button>
                    )}
                    <button onClick={() => remove(t.id)} className="text-xs text-[#b42318] hover:underline">Delete</button>
                  </div>
                </li>
              );
            })}
          </ul>
        )}
      </section>

      <p className="rounded-xl border border-border bg-surface-2/60 p-3 text-xs leading-relaxed text-text-muted">
        Tip: link each task to the BRSR field it feeds, so completing the task cycle fills the report.
        Recurring tasks (monthly bills, quarterly registers) keep evidence flowing all year instead of a
        scramble at filing time.
      </p>
    </div>
  );
}

function TaskTile({ label, value, warn, good }: { label: string; value: number; warn?: boolean; good?: boolean }) {
  return (
    <div className="card p-4">
      <p className="text-[11px] uppercase tracking-wide text-text-muted">{label}</p>
      <p className={cn("mt-1 font-display text-2xl font-semibold", warn && "text-[#b42318]", good && "text-teal")}>{value}</p>
    </div>
  );
}
