"use client";

import { useEffect, useState } from "react";
import { addMember, removeMember, fetchMembers, fetchAudit, type Member, type AuditEntry } from "@/lib/brsr/pro";
import { isEmail } from "@/components/forms/fields";
import { moduleForQuestion } from "@/lib/brsr/framework";

/** Team invitations + recent activity log. */
export function BrsrTeam({ companyId, reportId }: { companyId: string; reportId: string }) {
  const [members, setMembers] = useState<Member[]>([]);
  const [audit, setAudit] = useState<AuditEntry[]>([]);
  const [email, setEmail] = useState("");
  const [role, setRole] = useState("editor");
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    fetchMembers(companyId).then(setMembers).catch(() => {});
    fetchAudit(reportId, undefined, 40).then(setAudit).catch(() => {});
  }, [companyId, reportId]);

  const invite = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    if (!isEmail(email)) { setError("Enter a valid email address."); return; }
    setBusy(true);
    try {
      const m = await addMember(companyId, email, role);
      setMembers((prev) => [...prev, m]);
      setEmail("");
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

  return (
    <div className="grid gap-6 lg:grid-cols-2">
      {/* Members */}
      <div className="card p-6">
        <h3 className="font-display text-base font-semibold">Team members</h3>
        <p className="mt-1 text-xs text-text-muted">Invite colleagues by email to collaborate on this company&apos;s reports. They gain access when they sign in with that email.</p>
        <form onSubmit={invite} className="mt-3 flex flex-wrap gap-2">
          <input
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="colleague@company.com"
            className="h-9 min-w-[180px] flex-1 rounded-lg border border-border bg-surface px-3 text-sm"
          />
          <select value={role} onChange={(e) => setRole(e.target.value)} className="h-9 rounded-lg border border-border bg-surface px-2 text-sm">
            <option value="editor">Editor</option>
            <option value="reviewer">Reviewer</option>
          </select>
          <button disabled={busy} className="h-9 rounded-lg bg-accent px-3 text-sm text-white disabled:opacity-50">Invite</button>
        </form>
        {error && <p className="mt-2 text-xs text-[#b42318]">{error}</p>}
        <ul className="mt-3 space-y-1.5">
          {members.length === 0 && <li className="text-xs text-text-muted">No members yet. You are the owner.</li>}
          {members.map((m) => (
            <li key={m.id} className="flex items-center justify-between gap-2 text-sm">
              <span className="truncate">
                {m.email}
                <span className="ml-2 rounded bg-surface-2 px-1.5 text-[10px] text-text-muted">{m.role}</span>
                {!m.user_id && <span className="ml-1 text-[10px] text-text-muted">(pending)</span>}
              </span>
              <button onClick={() => drop(m)} className="shrink-0 text-xs text-text-muted hover:text-[#e5484d]">Remove</button>
            </li>
          ))}
        </ul>
      </div>

      {/* Activity log */}
      <div className="card p-6">
        <h3 className="font-display text-base font-semibold">Recent activity</h3>
        <p className="mt-1 text-xs text-text-muted">Change history for this report (most recent first).</p>
        {audit.length === 0 ? (
          <p className="mt-3 text-xs text-text-muted">No changes recorded yet.</p>
        ) : (
          <ul className="mt-3 max-h-72 space-y-1.5 overflow-y-auto">
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
  );
}
