"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { useCompany } from "@/components/tool/CompanyProvider";
import { fetchAllReports, type BrsrReport } from "@/lib/brsr/db";
import { fetchApprovals, type UserApproval } from "@/lib/brsr/pro";
import type { Company } from "@/lib/tool/types";

const STATUS_LABEL: Record<string, string> = {
  draft: "Draft",
  in_review: "In review",
  final: "Released",
};

/**
 * ESGEN-staff-only screen: every company on the platform in one place, with
 * full unrestricted access (no report-status or feature locks apply here).
 * Only rendered by AdminPage after it has confirmed the signed-in user is an
 * admin; RLS backs this up server-side regardless.
 */
export function AdminPortal() {
  const router = useRouter();
  const { companies, switchCompany } = useCompany();
  const [reports, setReports] = useState<BrsrReport[]>([]);
  const [approvals, setApprovals] = useState<UserApproval[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [query, setQuery] = useState("");

  useEffect(() => {
    let cancelled = false;
    (async () => {
      setLoading(true);
      setError(null);
      try {
        const [r, a] = await Promise.all([fetchAllReports(), fetchApprovals()]);
        if (cancelled) return;
        setReports(r);
        setApprovals(a);
      } catch (e) {
        if (!cancelled) setError(e instanceof Error ? e.message : "Could not load admin data.");
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => { cancelled = true; };
  }, []);

  const latestReportByCompany = useMemo(() => {
    const map = new Map<string, BrsrReport>();
    for (const r of reports) {
      const existing = map.get(r.company_id);
      if (!existing || new Date(r.updated_at) > new Date(existing.updated_at)) map.set(r.company_id, r);
    }
    return map;
  }, [reports]);

  const statusCounts = useMemo(() => {
    const counts: Record<string, number> = { draft: 0, in_review: 0, final: 0 };
    for (const r of reports) counts[r.status] = (counts[r.status] ?? 0) + 1;
    return counts;
  }, [reports]);

  const pendingApprovals = approvals.filter((a) => a.status === "pending").length;

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return companies;
    return companies.filter((c) => c.name.toLowerCase().includes(q) || c.sector?.toLowerCase().includes(q));
  }, [companies, query]);

  const openWorkspace = (company: Company) => {
    const report = latestReportByCompany.get(company.id);
    const isEvents = report?.framework_version.startsWith("EVENTS") ?? false;
    switchCompany(company.id);
    router.push(isEvents ? "/app/events" : "/app/brsr");
  };

  return (
    <div>
      <header className="rounded-2xl border border-[#3a2f22] bg-[#1c1712] p-6">
        <div className="flex flex-wrap items-center gap-3">
          <span className="rounded-full bg-[#f0a020] px-3 py-1 text-xs font-bold uppercase tracking-wide text-[#1c1712]">
            ESGEN Admin
          </span>
          <h1 className="font-display text-2xl font-semibold">Admin Portal</h1>
        </div>
        <p className="mt-2 text-sm text-text-muted">
          Full access: every company, every report, at any status. Nothing here is locked to you.
        </p>
      </header>

      {error && <p className="mt-4 rounded-lg border border-red-800/60 bg-red-950/40 p-3 text-sm text-red-300">{error}</p>}

      <div className="mt-6 grid grid-cols-2 gap-3 sm:grid-cols-4">
        <Stat label="Companies" value={companies.length} />
        <Stat label="Draft" value={statusCounts.draft} />
        <Stat label="In review" value={statusCounts.in_review} />
        <Stat label="Released" value={statusCounts.final} />
      </div>

      {pendingApprovals > 0 && (
        <a
          href="#"
          onClick={(e) => { e.preventDefault(); router.push("/app/brsr"); }}
          className="mt-4 flex items-center justify-between rounded-xl border border-[#f0a020]/40 bg-[#f0a020]/10 px-4 py-3 text-sm text-[#f0a020] transition hover:bg-[#f0a020]/16"
        >
          <span>{pendingApprovals} sign-up{pendingApprovals === 1 ? "" : "s"} awaiting approval</span>
          <span>Settings &rarr; Sign-up approvals</span>
        </a>
      )}

      <div className="mt-8 card p-6">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <h2 className="font-display text-base font-semibold">Companies</h2>
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search by name or sector..."
            className="h-9 w-full max-w-xs rounded-lg border border-border bg-surface-2 px-3 text-xs"
          />
        </div>

        {loading ? (
          <p className="mt-4 text-sm text-text-muted">Loading companies...</p>
        ) : filtered.length === 0 ? (
          <p className="mt-4 text-sm text-text-muted">{companies.length === 0 ? "No companies yet." : "No companies match your search."}</p>
        ) : (
          <div className="mt-4 overflow-x-auto">
            <table className="w-full min-w-[720px] text-left text-sm">
              <thead>
                <tr className="border-b border-border text-xs uppercase tracking-wide text-text-muted">
                  <th className="py-2 pr-3">Company</th>
                  <th className="py-2 pr-3">Sector</th>
                  <th className="py-2 pr-3">Size</th>
                  <th className="py-2 pr-3">Framework</th>
                  <th className="py-2 pr-3">Status</th>
                  <th className="py-2 pr-3">Last updated</th>
                  <th className="py-2" />
                </tr>
              </thead>
              <tbody>
                {filtered.map((c) => {
                  const report = latestReportByCompany.get(c.id);
                  const isEvents = report?.framework_version.startsWith("EVENTS") ?? false;
                  return (
                    <tr key={c.id} className="border-b border-border/60">
                      <td className="py-2.5 pr-3 font-medium">{c.name}</td>
                      <td className="py-2.5 pr-3 text-text-muted">{c.sector || "—"}</td>
                      <td className="py-2.5 pr-3 text-text-muted">{c.size_band || "—"}</td>
                      <td className="py-2.5 pr-3 text-text-muted">{report ? (isEvents ? "Events" : "BRSR") : "—"}</td>
                      <td className="py-2.5 pr-3">
                        {report ? (
                          <span className="rounded-full border border-[#f0a020]/40 px-2 py-0.5 text-xs text-[#f0a020]">
                            {STATUS_LABEL[report.status] ?? report.status}
                          </span>
                        ) : (
                          <span className="text-xs text-text-muted">No report yet</span>
                        )}
                      </td>
                      <td className="py-2.5 pr-3 text-text-muted">
                        {report ? new Date(report.updated_at).toLocaleDateString("en-GB") : "—"}
                      </td>
                      <td className="py-2.5 text-right">
                        <button
                          onClick={() => openWorkspace(c)}
                          className="rounded-lg bg-[#f0a020] px-3 py-1.5 text-xs font-bold text-[#1c1712] transition hover:bg-[#d4870a]"
                        >
                          Open workspace &rarr;
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}

function Stat({ label, value }: { label: string; value: number }) {
  return (
    <div className="card p-4">
      <p className="text-2xl font-semibold">{value}</p>
      <p className="mt-1 text-xs text-text-muted">{label}</p>
    </div>
  );
}
