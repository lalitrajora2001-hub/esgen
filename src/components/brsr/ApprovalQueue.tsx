"use client";

import { useEffect, useState } from "react";
import { useAuth } from "@/components/tool/AuthProvider";
import { fetchApprovals, decideApproval, type UserApproval } from "@/lib/brsr/pro";
import { cn } from "@/lib/cn";

const STATUS_META: Record<string, { label: string; cls: string }> = {
  pending: { label: "Pending", cls: "bg-[#f0a020]/12 text-[#92600a]" },
  approved: { label: "Approved", cls: "bg-teal/10 text-teal" },
  rejected: { label: "Rejected", cls: "bg-[#e5484d]/10 text-[#b42318]" },
};

/** ESGEN-staff-only screen: approve or reject external sign-ups before they
 *  can access the platform. Only rendered when the caller has confirmed the
 *  signed-in user is an admin; RLS backs this up server-side regardless. */
export function ApprovalQueue() {
  const { user } = useAuth();
  const [rows, setRows] = useState<UserApproval[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState<string | null>(null);
  const [filter, setFilter] = useState<"pending" | "all">("pending");

  const load = async () => {
    setLoading(true);
    try {
      setRows(await fetchApprovals());
    } catch (e) {
      setError(e instanceof Error ? e.message : "Could not load sign-ups.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { void load(); }, []);

  const decide = async (row: UserApproval, status: "approved" | "rejected") => {
    setBusy(row.user_id);
    setRows((rs) => rs.map((r) => (r.user_id === row.user_id ? { ...r, status } : r)));
    try {
      await decideApproval(row.user_id, status, user?.email ?? null);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Could not save the decision.");
      void load();
    } finally {
      setBusy(null);
    }
  };

  const visible = filter === "pending" ? rows.filter((r) => r.status === "pending") : rows;
  const pendingCount = rows.filter((r) => r.status === "pending").length;

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <p className="text-sm text-text-muted">
          Every new sign-up starts pending and cannot use the workspace until approved here.
        </p>
        <div className="inline-flex gap-1 rounded-full bg-surface-2 p-1">
          <button onClick={() => setFilter("pending")} className={cn("rounded-full px-3 py-1 text-xs font-medium transition", filter === "pending" ? "bg-white text-text shadow-sm" : "text-text-muted")}>
            Pending {pendingCount > 0 && <span className="ml-1 rounded-full bg-[#e5484d]/15 px-1.5 text-[#b42318]">{pendingCount}</span>}
          </button>
          <button onClick={() => setFilter("all")} className={cn("rounded-full px-3 py-1 text-xs font-medium transition", filter === "all" ? "bg-white text-text shadow-sm" : "text-text-muted")}>
            All
          </button>
        </div>
      </div>

      {error && <p className="rounded-xl border border-[#e5484d]/30 bg-[#e5484d]/8 p-3 text-sm text-[#b42318]">{error}</p>}

      <section className="card overflow-hidden">
        {loading ? (
          <p className="p-5 text-sm text-text-muted">Loading...</p>
        ) : visible.length === 0 ? (
          <p className="p-5 text-sm text-text-muted">{filter === "pending" ? "No sign-ups waiting on a decision." : "No sign-ups yet."}</p>
        ) : (
          <ul className="divide-y divide-border">
            {visible.map((r) => (
              <li key={r.user_id} className="flex flex-wrap items-center justify-between gap-3 px-5 py-3.5">
                <div className="min-w-0">
                  <p className="flex items-center gap-2 text-sm font-medium">
                    <span className="truncate">{r.email}</span>
                    <span className={cn("shrink-0 rounded-full px-2 py-0.5 text-[10px] font-medium", STATUS_META[r.status]?.cls)}>{STATUS_META[r.status]?.label}</span>
                  </p>
                  <p className="mt-0.5 text-[11px] text-text-muted">
                    Requested {new Date(r.requested_at).toLocaleString("en-GB")}
                    {r.decided_by ? ` · decided by ${r.decided_by}` : ""}
                  </p>
                </div>
                {r.status === "pending" ? (
                  <div className="flex shrink-0 gap-2">
                    <button onClick={() => decide(r, "approved")} disabled={busy === r.user_id} className="rounded-lg bg-teal px-3 py-1.5 text-xs font-medium text-white disabled:opacity-50">Approve</button>
                    <button onClick={() => decide(r, "rejected")} disabled={busy === r.user_id} className="rounded-lg border border-border px-3 py-1.5 text-xs text-text-muted transition hover:border-[#e5484d] hover:text-[#b42318] disabled:opacity-50">Reject</button>
                  </div>
                ) : (
                  <button onClick={() => decide(r, r.status === "approved" ? "rejected" : "approved")} disabled={busy === r.user_id} className="shrink-0 text-xs text-text-muted underline decoration-dotted hover:text-text">
                    {r.status === "approved" ? "Revoke" : "Approve instead"}
                  </button>
                )}
              </li>
            ))}
          </ul>
        )}
      </section>
    </div>
  );
}
