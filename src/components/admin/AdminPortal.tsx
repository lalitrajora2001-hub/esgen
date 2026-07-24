"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { useCompany } from "@/components/tool/CompanyProvider";
import { fetchAllReports, fetchAllEvidenceMeta, type BrsrReport, type EvidenceFile } from "@/lib/brsr/db";
import { fetchApprovals, fetchAllAudit, type UserApproval, type AuditEntry } from "@/lib/brsr/pro";
import { fetchAllOpenTasks, type CollectionTask } from "@/lib/brsr/ops";
import { downloadText } from "@/lib/brsr/exporters";
import type { Company } from "@/lib/tool/types";

const STATUS_LABEL: Record<string, string> = {
  draft: "Draft",
  in_review: "In review",
  final: "Released",
};

function csvCell(s: string): string {
  return /[",\n]/.test(s) ? `"${s.replace(/"/g, '""')}"` : s;
}

function fmtBytes(n: number): string {
  if (n < 1024) return `${n} B`;
  if (n < 1024 * 1024) return `${(n / 1024).toFixed(1)} KB`;
  return `${(n / (1024 * 1024)).toFixed(1)} MB`;
}

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
  const [tasks, setTasks] = useState<CollectionTask[]>([]);
  const [audit, setAudit] = useState<AuditEntry[]>([]);
  const [evidenceMeta, setEvidenceMeta] = useState<Pick<EvidenceFile, "report_id" | "size">[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [query, setQuery] = useState("");

  useEffect(() => {
    let cancelled = false;
    (async () => {
      setLoading(true);
      setError(null);
      try {
        const [r, a, t, ad, ev] = await Promise.all([
          fetchAllReports(),
          fetchApprovals(),
          fetchAllOpenTasks().catch(() => [] as CollectionTask[]), // tolerate the admin policy not being applied yet
          fetchAllAudit(50),
          fetchAllEvidenceMeta(),
        ]);
        if (cancelled) return;
        setReports(r);
        setApprovals(a);
        setTasks(t);
        setAudit(ad);
        setEvidenceMeta(ev);
      } catch (e) {
        if (!cancelled) setError(e instanceof Error ? e.message : "Could not load admin data.");
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => { cancelled = true; };
  }, []);

  const companyById = useMemo(() => new Map(companies.map((c) => [c.id, c])), [companies]);

  const reportById = useMemo(() => new Map(reports.map((r) => [r.id, r])), [reports]);

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

  const evidenceByCompany = useMemo(() => {
    const map = new Map<string, { count: number; bytes: number }>();
    for (const ev of evidenceMeta) {
      const report = reportById.get(ev.report_id);
      if (!report) continue;
      const cur = map.get(report.company_id) ?? { count: 0, bytes: 0 };
      cur.count += 1;
      cur.bytes += ev.size ?? 0;
      map.set(report.company_id, cur);
    }
    return map;
  }, [evidenceMeta, reportById]);

  const totalStorage = useMemo(
    () => evidenceMeta.reduce((sum, e) => sum + (e.size ?? 0), 0),
    [evidenceMeta],
  );

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

  const exportDirectory = () => {
    const header = ["Company", "Sector", "Size", "Employees", "Country", "Framework", "Report status", "Last updated", "Files", "Storage"];
    const rows: string[][] = [header];
    for (const c of companies) {
      const report = latestReportByCompany.get(c.id);
      const isEvents = report?.framework_version.startsWith("EVENTS") ?? false;
      const ev = evidenceByCompany.get(c.id);
      rows.push([
        c.name,
        c.sector || "",
        c.size_band || "",
        c.employees != null ? String(c.employees) : "",
        c.country || "",
        report ? (isEvents ? "Events" : "BRSR") : "",
        report ? (STATUS_LABEL[report.status] ?? report.status) : "No report yet",
        report ? new Date(report.updated_at).toLocaleDateString("en-GB") : "",
        ev ? String(ev.count) : "0",
        ev ? fmtBytes(ev.bytes) : "0 B",
      ]);
    }
    const csv = rows.map((r) => r.map(csvCell).join(",")).join("\n");
    downloadText(`esgen-company-directory-${new Date().toISOString().slice(0, 10)}.csv`, csv, "text/csv");
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
          <div className="flex items-center gap-2">
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search by name or sector..."
              className="h-9 w-full max-w-xs rounded-lg border border-border bg-surface-2 px-3 text-xs"
            />
            <button
              onClick={exportDirectory}
              className="h-9 whitespace-nowrap rounded-lg border border-[#f0a020]/40 px-3 text-xs font-semibold text-[#f0a020] transition hover:bg-[#f0a020]/10"
            >
              Export directory (CSV)
            </button>
          </div>
        </div>

        {loading ? (
          <p className="mt-4 text-sm text-text-muted">Loading companies...</p>
        ) : filtered.length === 0 ? (
          <p className="mt-4 text-sm text-text-muted">{companies.length === 0 ? "No companies yet." : "No companies match your search."}</p>
        ) : (
          <div className="mt-4 overflow-x-auto">
            <table className="w-full min-w-[820px] text-left text-sm">
              <thead>
                <tr className="border-b border-border text-xs uppercase tracking-wide text-text-muted">
                  <th className="py-2 pr-3">Company</th>
                  <th className="py-2 pr-3">Sector</th>
                  <th className="py-2 pr-3">Size</th>
                  <th className="py-2 pr-3">Framework</th>
                  <th className="py-2 pr-3">Status</th>
                  <th className="py-2 pr-3">Last updated</th>
                  <th className="py-2 pr-3">Files</th>
                  <th className="py-2" />
                </tr>
              </thead>
              <tbody>
                {filtered.map((c) => {
                  const report = latestReportByCompany.get(c.id);
                  const isEvents = report?.framework_version.startsWith("EVENTS") ?? false;
                  const ev = evidenceByCompany.get(c.id);
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
                      <td className="py-2.5 pr-3 text-text-muted">
                        {ev ? `${ev.count} · ${fmtBytes(ev.bytes)}` : "—"}
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

      <div className="mt-6 grid gap-6 lg:grid-cols-2">
        <div className="card p-6">
          <h2 className="font-display text-base font-semibold">Deadlines across companies</h2>
          <p className="mt-1 text-xs text-text-muted">Open collection tasks, soonest due date first.</p>
          {tasks.length === 0 ? (
            <p className="mt-4 text-sm text-text-muted">Nothing outstanding.</p>
          ) : (
            <ul className="mt-4 space-y-2">
              {tasks.slice(0, 12).map((t) => {
                const company = companyById.get(t.company_id);
                const overdue = t.due_date ? new Date(t.due_date) < new Date() : false;
                return (
                  <li key={t.id} className="flex items-center justify-between gap-3 rounded-lg border border-border/60 bg-surface-2/40 px-3 py-2 text-sm">
                    <div className="min-w-0">
                      <p className="truncate font-medium">{t.title}</p>
                      <p className="truncate text-xs text-text-muted">{company?.name ?? "Unknown company"}{t.assignee_email ? ` · ${t.assignee_email}` : ""}</p>
                    </div>
                    <span className={`shrink-0 whitespace-nowrap text-xs ${overdue ? "font-semibold text-red-400" : "text-text-muted"}`}>
                      {t.due_date ? new Date(t.due_date).toLocaleDateString("en-GB") : "No due date"}
                    </span>
                  </li>
                );
              })}
            </ul>
          )}
        </div>

        <div className="card p-6">
          <h2 className="font-display text-base font-semibold">Recent activity</h2>
          <p className="mt-1 text-xs text-text-muted">Latest answer changes across every company.</p>
          {audit.length === 0 ? (
            <p className="mt-4 text-sm text-text-muted">No activity yet.</p>
          ) : (
            <ul className="mt-4 space-y-2">
              {audit.slice(0, 12).map((a) => {
                const report = reportById.get(a.report_id);
                const company = report ? companyById.get(report.company_id) : undefined;
                return (
                  <li key={a.id} className="rounded-lg border border-border/60 bg-surface-2/40 px-3 py-2 text-sm">
                    <p className="truncate">
                      <span className="font-medium">{a.actor_email ?? "Unknown"}</span>{" "}
                      <span className="text-text-muted">edited {a.question_key}</span>
                    </p>
                    <p className="mt-0.5 flex items-center justify-between text-xs text-text-muted">
                      <span className="truncate">{company?.name ?? "Unknown company"}</span>
                      <span className="shrink-0">{new Date(a.created_at).toLocaleString("en-GB")}</span>
                    </p>
                  </li>
                );
              })}
            </ul>
          )}
        </div>
      </div>

      <div className="mt-6 card p-6">
        <h2 className="font-display text-base font-semibold">Storage</h2>
        <p className="mt-1 text-sm text-text-muted">
          {evidenceMeta.length} file{evidenceMeta.length === 1 ? "" : "s"} uploaded across every company, {fmtBytes(totalStorage)} total.
        </p>
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
