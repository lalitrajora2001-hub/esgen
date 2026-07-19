"use client";

import { useEffect, useState } from "react";
import { addMember, removeMember, fetchMembers, fetchAudit, type Member, type AuditEntry } from "@/lib/brsr/pro";
import { listOrgUnits, type OrgUnit } from "@/lib/brsr/ops";
import { isEmail } from "@/components/forms/fields";
import { moduleForQuestion } from "@/lib/brsr/framework";
import { Button } from "@/components/ui/Button";

/** Team management (Add-user form with profile fields) + recent activity log. */

const EMPTY = { firstName: "", lastName: "", email: "", phone: "", role: "editor", orgUnit: "" };

export function BrsrTeam({ companyId, reportId }: { companyId: string; reportId: string }) {
  const [members, setMembers] = useState<Member[]>([]);
  const [units, setUnits] = useState<OrgUnit[]>([]);
  const [audit, setAudit] = useState<AuditEntry[]>([]);
  const [form, setForm] = useState(EMPTY);
  const [showForm, setShowForm] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    fetchMembers(companyId).then(setMembers).catch(() => {});
    listOrgUnits(companyId).then(setUnits).catch(() => {});
    fetchAudit(reportId, undefined, 40).then(setAudit).catch(() => {});
  }, [companyId, reportId]);

  const set = (k: keyof typeof EMPTY) => (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) =>
    setForm((f) => ({ ...f, [k]: e.target.value }));

  const invite = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    if (!isEmail(form.email)) { setError("Enter a valid email address."); return; }
    setBusy(true);
    try {
      const m = await addMember(companyId, form.email, form.role, {
        first_name: form.firstName.trim() || null,
        last_name: form.lastName.trim() || null,
        phone: form.phone.trim() || null,
        org_unit: form.orgUnit || null,
      });
      setMembers((prev) => [...prev, m]);
      setForm(EMPTY);
      setShowForm(false);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Could not add member.");
    } finally {
      setBusy(false);
    }
  };

  const drop = async (m: Member) => {
    await removeMember(m.id).catch(() => {});
    setMembers((prev) => prev.filter((x) => x.id !== m.id));
  };

  const displayName = (m: Member) =>
    [m.first_name, m.last_name].filter(Boolean).join(" ") || m.email;

  return (
    <div className="space-y-5">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <h2 className="text-lg font-semibold">Team</h2>
          <p className="mt-1 max-w-2xl text-sm text-text-muted">
            Invite colleagues to collaborate on this company&apos;s reports. They gain access when they
            sign in with the invited email.
          </p>
        </div>
        <Button size="md" onClick={() => setShowForm((s) => !s)}>{showForm ? "Close" : "+ Add user"}</Button>
      </div>

      {/* Add user form (reference-style fields) */}
      {showForm && (
        <form onSubmit={invite} className="card space-y-4 p-5">
          <p className="text-sm font-semibold">Add new user</p>
          <div className="grid gap-3 sm:grid-cols-2">
            <label className="flex flex-col gap-1">
              <span className="text-xs font-medium">First name</span>
              <input value={form.firstName} onChange={set("firstName")} placeholder="Asha" className="h-10 rounded-lg border border-border bg-surface px-3 text-sm" />
            </label>
            <label className="flex flex-col gap-1">
              <span className="text-xs font-medium">Last name</span>
              <input value={form.lastName} onChange={set("lastName")} placeholder="Patel" className="h-10 rounded-lg border border-border bg-surface px-3 text-sm" />
            </label>
            <label className="flex flex-col gap-1">
              <span className="text-xs font-medium">Role *</span>
              <select value={form.role} onChange={set("role")} className="h-10 rounded-lg border border-border bg-surface px-3 text-sm">
                <option value="editor">Editor - enters and edits data</option>
                <option value="reviewer">Reviewer - validates and approves</option>
              </select>
            </label>
            <label className="flex flex-col gap-1">
              <span className="text-xs font-medium">Email *</span>
              <input value={form.email} onChange={set("email")} type="email" placeholder="asha.patel@company.com" className="h-10 rounded-lg border border-border bg-surface px-3 text-sm" />
            </label>
            <label className="flex flex-col gap-1">
              <span className="text-xs font-medium">Phone</span>
              <input value={form.phone} onChange={set("phone")} inputMode="tel" placeholder="+91 98765 43210" className="h-10 rounded-lg border border-border bg-surface px-3 text-sm" />
            </label>
            <label className="flex flex-col gap-1">
              <span className="text-xs font-medium">Organisation unit</span>
              {units.length > 0 ? (
                <select value={form.orgUnit} onChange={set("orgUnit")} className="h-10 rounded-lg border border-border bg-surface px-3 text-sm">
                  <option value="">Whole company</option>
                  {units.map((u) => <option key={u.id} value={u.name}>{u.name}</option>)}
                </select>
              ) : (
                <input value={form.orgUnit} onChange={set("orgUnit")} placeholder="e.g. Head office" className="h-10 rounded-lg border border-border bg-surface px-3 text-sm" />
              )}
            </label>
          </div>
          {error && <p className="text-sm text-[#b42318]">{error}</p>}
          <div className="flex gap-2">
            <Button type="submit" size="md" disabled={busy}>{busy ? "Adding..." : "Add"}</Button>
            <Button size="md" variant="ghost" onClick={() => setShowForm(false)}>Cancel</Button>
          </div>
        </form>
      )}

      <div className="grid gap-5 lg:grid-cols-2">
        {/* Members */}
        <div className="card overflow-hidden">
          <div className="flex items-center justify-between border-b border-border px-5 py-3.5">
            <p className="text-sm font-semibold">Team members</p>
            <span className="rounded-full bg-surface-2 px-2.5 py-0.5 text-[11px] text-text-muted">{members.length}</span>
          </div>
          {members.length === 0 ? (
            <p className="p-5 text-sm text-text-muted">No members yet. You are the owner.</p>
          ) : (
            <ul className="divide-y divide-border">
              {members.map((m) => (
                <li key={m.id} className="flex items-center justify-between gap-3 px-5 py-3">
                  <div className="flex min-w-0 items-center gap-3">
                    <span className="grid h-9 w-9 shrink-0 place-items-center rounded-full bg-teal/10 font-display text-xs font-bold text-teal">
                      {displayName(m).slice(0, 1).toUpperCase()}
                    </span>
                    <div className="min-w-0">
                      <p className="truncate text-sm font-medium">
                        {displayName(m)}
                        {!m.user_id && <span className="ml-2 text-[10px] font-normal text-text-muted">(invite pending)</span>}
                      </p>
                      <p className="truncate text-xs text-text-muted">
                        {m.email}
                        {m.org_unit ? ` · ${m.org_unit}` : ""}
                        {m.phone ? ` · ${m.phone}` : ""}
                      </p>
                    </div>
                  </div>
                  <div className="flex shrink-0 items-center gap-3">
                    <span className="rounded-full bg-surface-2 px-2 py-0.5 text-[10px] text-text-muted">{m.role}</span>
                    <button onClick={() => drop(m)} className="text-xs text-text-muted hover:text-[#e5484d]">Remove</button>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>

        {/* Activity log */}
        <div className="card p-5">
          <h3 className="font-display text-base font-semibold">Recent activity</h3>
          <p className="mt-1 text-xs text-text-muted">Change history for this report (most recent first).</p>
          {audit.length === 0 ? (
            <p className="mt-3 text-xs text-text-muted">No changes recorded yet.</p>
          ) : (
            <ul className="mt-3 max-h-80 space-y-1.5 overflow-y-auto">
              {audit.map((a) => {
                const mod = moduleForQuestion(a.question_key);
                return (
                  <li key={a.id} className="text-xs text-text-muted">
                    <span className="text-text">{a.actor_email ?? "someone"}</span> updated{" "}
                    <span className="font-medium text-text">{a.question_key}</span>
                    {mod ? ` (${mod.navLabel})` : ""} · {new Date(a.created_at).toLocaleString("en-GB")}
                  </li>
                );
              })}
            </ul>
          )}
        </div>
      </div>
    </div>
  );
}
