"use client";

import { useEffect, useMemo, useState } from "react";
import { useCompany } from "@/components/tool/CompanyProvider";
import {
  listSupplierInvites, createSupplierInvite, setSupplierInviteStatus, deleteSupplierInvite,
  isMissingTable, type SupplierInvite, type SupplierPayload,
} from "@/lib/brsr/ops";
import { isEmail } from "@/components/forms/fields";
import { fmtNum } from "@/lib/brsr/dashboard";
import { Button } from "@/components/ui/Button";
import { cn } from "@/lib/cn";
import type { BrsrReport, ResponseMap } from "@/lib/brsr/db";

/**
 * Value-chain suppliers: invite by link, review submissions, and aggregate the
 * allocated emissions into Scope 3 (Principle 6, LI-2). Allocation is a
 * revenue-share approximation and is labelled indicative throughout.
 */

const STATUS_META: Record<string, { label: string; cls: string }> = {
  invited: { label: "Invited", cls: "bg-surface-2 text-text-muted" },
  submitted: { label: "Submitted", cls: "bg-[#f0a020]/12 text-[#92600a]" },
  accepted: { label: "Accepted", cls: "bg-teal/10 text-teal" },
  declined: { label: "Declined", cls: "bg-[#e5484d]/10 text-[#b42318]" },
};

/**
 * Allocated tCO2e for one submission. New submissions carry a server-computed
 * figure (Scope 1+2 x share, supplier's own Scope 3 excluded to avoid double
 * counting). Legacy rows fall back to the same S1+S2 formula client-side.
 */
export function allocatedEmissions(p: SupplierPayload): number | null {
  if (p.allocated_tco2e != null) return p.allocated_tco2e;
  const total = (p.scope1 ?? 0) + (p.scope2 ?? 0);
  if (total <= 0) return null;
  const pct = p.allocation_pct;
  if (pct == null || pct <= 0 || pct > 100) return null;
  return total * (pct / 100);
}

export function SuppliersView({
  report, responses, onApplyUpdates, onNavigate,
}: {
  report: BrsrReport;
  responses: ResponseMap;
  onApplyUpdates: (updates: Record<string, unknown>) => Promise<void>;
  onNavigate: (key: string) => void;
}) {
  const { company } = useCompany();
  const [invites, setInvites] = useState<SupplierInvite[]>([]);
  const [loading, setLoading] = useState(true);
  const [needsMigration, setNeedsMigration] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ name: "", email: "", message: "" });
  const [busy, setBusy] = useState(false);
  const [copied, setCopied] = useState<string | null>(null);
  const [expanded, setExpanded] = useState<string | null>(null);
  const [applyNote, setApplyNote] = useState<string | null>(null);

  useEffect(() => {
    if (!company) return;
    (async () => {
      try {
        setInvites(await listSupplierInvites(company.id));
      } catch (e) {
        if (isMissingTable(e)) setNeedsMigration(true);
        else setError(e instanceof Error ? e.message : "Could not load suppliers.");
      } finally {
        setLoading(false);
      }
    })();
  }, [company]);

  const invite = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!company || !form.name.trim()) return;
    if (form.email && !isEmail(form.email)) { setError("Enter a valid contact email or leave it empty."); return; }
    setBusy(true);
    setError(null);
    try {
      const inv = await createSupplierInvite({
        company_id: company.id,
        supplier_name: form.name.trim(),
        contact_email: form.email.trim() || null,
        financial_year: report.financial_year,
        message: form.message.trim() || null,
      });
      setInvites((xs) => [inv, ...xs]);
      setForm({ name: "", email: "", message: "" });
      setShowForm(false);
    } catch (e2) {
      if (isMissingTable(e2)) setNeedsMigration(true);
      else setError(e2 instanceof Error ? e2.message : "Could not create the invite.");
    } finally {
      setBusy(false);
    }
  };

  const linkFor = (inv: SupplierInvite) =>
    `${typeof window !== "undefined" ? window.location.origin : "https://esgen.co.uk"}/app/supplier/?token=${inv.token}`;

  const copyLink = async (inv: SupplierInvite) => {
    try {
      await navigator.clipboard.writeText(linkFor(inv));
      setCopied(inv.id);
      setTimeout(() => setCopied(null), 1600);
    } catch {
      setCopied(null);
    }
  };

  const setStatus = async (inv: SupplierInvite, status: SupplierInvite["status"]) => {
    setInvites((xs) => xs.map((x) => (x.id === inv.id ? { ...x, status } : x)));
    try { await setSupplierInviteStatus(inv.id, status); } catch { /* reconciles on reload */ }
  };

  const remove = async (id: string) => {
    setInvites((xs) => xs.filter((x) => x.id !== id));
    try { await deleteSupplierInvite(id); } catch { /* reconciles on reload */ }
  };

  // Aggregate allocated emissions across ACCEPTED submissions.
  const accepted = useMemo(
    () => invites
      .filter((i) => i.status === "accepted" && i.supplier_submissions?.[0])
      .map((i) => ({ invite: i, payload: i.supplier_submissions![0].payload, allocated: allocatedEmissions(i.supplier_submissions![0].payload) })),
    [invites],
  );
  const aggregate = accepted.reduce((sum, a) => sum + (a.allocated ?? 0), 0);
  const missingAllocation = accepted.filter((a) => a.allocated == null).length;

  const applyToScope3 = async () => {
    setApplyNote(null);
    const li2 = (responses["C.P6.LI.2"] as { current?: Record<string, Record<string, unknown>> }) ?? {};
    const cur = { ...(li2.current ?? {}) };
    cur.scope3 = { ...(cur.scope3 ?? {}), value: Math.round(aggregate * 100) / 100, unit: (cur.scope3 as { unit?: string } | undefined)?.unit ?? "MT CO2e" };
    await onApplyUpdates({ "C.P6.LI.2": { ...li2, current: cur } });
    setApplyNote(`Scope 3 set to ${fmtNum(aggregate)} tCO2e from ${accepted.length} accepted supplier submission${accepted.length === 1 ? "" : "s"}.`);
  };

  const counts = {
    invited: invites.filter((i) => i.status === "invited").length,
    submitted: invites.filter((i) => i.status === "submitted").length,
    accepted: invites.filter((i) => i.status === "accepted").length,
  };

  return (
    <div className="space-y-5">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <h2 className="text-lg font-semibold">Suppliers</h2>
          <p className="mt-1 max-w-2xl text-sm text-text-muted">
            Invite value-chain partners to report their emissions for FY {report.financial_year}. Each
            supplier gets a private link, no account needed. Accepted submissions can feed your Scope 3.
          </p>
        </div>
        <Button size="md" onClick={() => setShowForm((s) => !s)}>{showForm ? "Close" : "+ Invite supplier"}</Button>
      </div>

      {needsMigration && (
        <p className="rounded-xl border border-[#f0a020]/30 bg-[#f0a020]/8 p-3 text-xs leading-relaxed text-[#92600a]">
          The supplier flow needs a one-time database update: run <code className="rounded bg-white/60 px-1">supabase/brsr_suppliers.sql</code> in
          the Supabase SQL Editor, then reload.
        </p>
      )}
      {error && <p className="rounded-xl border border-[#e5484d]/30 bg-[#e5484d]/8 p-3 text-sm text-[#b42318]">{error}</p>}

      {/* Summary + aggregate */}
      <div className="grid gap-4 lg:grid-cols-4">
        <SupTile label="Invited" value={counts.invited} />
        <SupTile label="Submitted" value={counts.submitted} warn={counts.submitted > 0} />
        <SupTile label="Accepted" value={counts.accepted} good />
        <div className="card p-4">
          <p className="text-[11px] uppercase tracking-wide text-text-muted">Allocated to your Scope 3</p>
          <p className="mt-1 flex items-baseline gap-1.5">
            <span className="font-display text-2xl font-semibold">{aggregate > 0 ? fmtNum(aggregate) : "—"}</span>
            <span className="text-[11px] text-text-muted">tCO2e</span>
          </p>
          {aggregate > 0 && (
            <button onClick={applyToScope3} className="mt-1.5 text-xs font-semibold text-teal hover:underline">
              Apply to Scope 3 (LI-2) →
            </button>
          )}
        </div>
      </div>
      {applyNote && (
        <p className="rounded-xl border border-teal/25 bg-teal/8 p-3 text-xs text-teal">
          {applyNote} <button onClick={() => onNavigate("__dash__")} className="font-semibold underline">See dashboard</button>
        </p>
      )}
      {missingAllocation > 0 && (
        <p className="rounded-xl border border-[#f0a020]/30 bg-[#f0a020]/8 p-3 text-xs text-[#92600a]">
          {missingAllocation} accepted submission{missingAllocation === 1 ? " has" : "s have"} no usable allocation share, so
          {missingAllocation === 1 ? " it is" : " they are"} excluded from the aggregate.
        </p>
      )}

      {/* Invite form */}
      {showForm && !needsMigration && (
        <form onSubmit={invite} className="card space-y-4 p-5">
          <p className="text-sm font-semibold">Invite a supplier</p>
          <div className="grid gap-3 sm:grid-cols-2">
            <label className="flex flex-col gap-1">
              <span className="text-xs font-medium">Supplier name *</span>
              <input value={form.name} onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))} placeholder="e.g. Sharma Components Pvt Ltd" className="h-10 rounded-lg border border-border bg-surface px-3 text-sm" />
            </label>
            <label className="flex flex-col gap-1">
              <span className="text-xs font-medium">Contact email</span>
              <input value={form.email} onChange={(e) => setForm((f) => ({ ...f, email: e.target.value }))} type="email" placeholder="For your records; the link is shared by you" className="h-10 rounded-lg border border-border bg-surface px-3 text-sm" />
            </label>
            <label className="flex flex-col gap-1 sm:col-span-2">
              <span className="text-xs font-medium">Message to the supplier</span>
              <input value={form.message} onChange={(e) => setForm((f) => ({ ...f, message: e.target.value }))} placeholder="Optional note shown on their submission page" className="h-10 rounded-lg border border-border bg-surface px-3 text-sm" />
            </label>
          </div>
          <div className="flex flex-wrap items-center gap-3">
            <Button type="submit" size="md" disabled={busy || !form.name.trim()}>{busy ? "Creating..." : "Create invite link"}</Button>
            <p className="text-[11px] text-text-muted">You share the link yourself (email or WhatsApp); ESGEN does not send mail.</p>
          </div>
        </form>
      )}

      {/* Invite list */}
      <section className="card overflow-hidden">
        {loading ? (
          <p className="p-5 text-sm text-text-muted">Loading...</p>
        ) : invites.length === 0 ? (
          <p className="p-5 text-sm text-text-muted">
            No suppliers invited yet. Start with your top vendors by spend; their Scope 1 and 2 becomes
            your Scope 3 category 1.
          </p>
        ) : (
          <ul className="divide-y divide-border">
            {invites.map((inv) => {
              const sub = inv.supplier_submissions?.[0];
              const alloc = sub ? allocatedEmissions(sub.payload) : null;
              const open = expanded === inv.id;
              return (
                <li key={inv.id} className="px-5 py-3.5">
                  <div className="flex flex-wrap items-center gap-3">
                    <div className="min-w-0 flex-1">
                      <p className="flex flex-wrap items-center gap-2 text-sm font-medium">
                        <span className="truncate">{inv.supplier_name}</span>
                        <span className={cn("shrink-0 rounded-full px-2 py-0.5 text-[10px] font-medium", STATUS_META[inv.status]?.cls)}>{STATUS_META[inv.status]?.label ?? inv.status}</span>
                      </p>
                      <p className="mt-0.5 flex flex-wrap gap-x-3 text-[11px] text-text-muted">
                        <span>FY {inv.financial_year}</span>
                        {inv.contact_email && <span>{inv.contact_email}</span>}
                        {sub && alloc != null && <span className="font-medium text-text">{fmtNum(alloc)} tCO2e allocated</span>}
                      </p>
                    </div>
                    <div className="flex shrink-0 items-center gap-2">
                      <button onClick={() => copyLink(inv)} className="rounded-lg border border-border px-2.5 py-1.5 text-xs text-text-muted transition hover:border-teal hover:text-text">
                        {copied === inv.id ? "Copied!" : "Copy link"}
                      </button>
                      <a
                        href={`https://wa.me/?text=${encodeURIComponent(`${company?.name ?? "We"} request your emissions data for FY ${inv.financial_year} for sustainability reporting. Please submit here (10 minutes, no account needed): ${linkFor(inv)}`)}`}
                        target="_blank"
                        rel="noreferrer"
                        className="rounded-lg border border-border px-2.5 py-1.5 text-xs text-text-muted transition hover:border-teal hover:text-text"
                      >
                        WhatsApp
                      </a>
                      {sub && (
                        <button onClick={() => setExpanded(open ? null : inv.id)} className="rounded-lg border border-border px-2.5 py-1.5 text-xs text-text-muted transition hover:border-teal hover:text-text">
                          {open ? "Hide data" : "View data"}
                        </button>
                      )}
                      {inv.status === "submitted" && (
                        <button onClick={() => setStatus(inv, "accepted")} className="rounded-lg bg-teal px-2.5 py-1.5 text-xs font-medium text-white transition hover:opacity-90">Accept</button>
                      )}
                      {inv.status === "accepted" && (
                        <button onClick={() => setStatus(inv, "submitted")} className="rounded-lg border border-border px-2.5 py-1.5 text-xs text-text-muted transition">Un-accept</button>
                      )}
                      <button onClick={() => remove(inv.id)} className="text-xs text-[#b42318] hover:underline">Delete</button>
                    </div>
                  </div>

                  {open && sub && (
                    <div className="mt-3 grid gap-2 rounded-xl border border-border bg-surface-2/40 p-4 sm:grid-cols-3">
                      <SubStat label="Allocated to you (S1+S2 basis)" value={alloc} unit="tCO2e" />
                      <SubStat label="Allocation basis" value={null} unit="" text={sub.payload.allocation_basis ?? "Not stated"} />
                      <SubStat label="Renewable energy share" value={sub.payload.renewable_pct} unit="%" />
                      {sub.payload.shared_details || sub.payload.scope1 != null ? (
                        <>
                          <SubStat label="Scope 1" value={sub.payload.scope1} unit="tCO2e" />
                          <SubStat label="Scope 2" value={sub.payload.scope2} unit="tCO2e" />
                          <SubStat label="Share attributed" value={sub.payload.allocation_pct} unit="%" />
                        </>
                      ) : (
                        <p className="text-[11px] text-text-muted sm:col-span-3">
                          The supplier chose to share only the allocated figure, not their underlying
                          totals or business share. The allocation was computed on submission from
                          Scope 1+2 and their stated share.
                        </p>
                      )}
                      {sub.payload.method_note && <p className="text-[11px] text-text-muted sm:col-span-3">Method: {sub.payload.method_note}</p>}
                      <p className="text-[11px] text-text-muted sm:col-span-3">
                        Submitted {new Date(sub.created_at).toLocaleString("en-GB")}{sub.submitted_by ? ` by ${sub.submitted_by}` : ""}.
                        Period: {sub.payload.period ?? "not stated"}. Supplier&apos;s own Scope 3 is
                        excluded from the allocation to avoid double counting.
                      </p>
                    </div>
                  )}
                </li>
              );
            })}
          </ul>
        )}
      </section>

      <p className="rounded-xl border border-border bg-surface-2/60 p-3 text-xs leading-relaxed text-text-muted">
        Allocation = the supplier&apos;s Scope 1+2 multiplied by the share they attribute to your business
        (their own Scope 3 is excluded to avoid double counting). Suppliers share only the allocated
        figure by default, not their raw totals. The aggregate is an indicative estimate of
        supplier-driven Scope 3, not an assured figure; review before accepting.
      </p>
    </div>
  );
}

function SupTile({ label, value, warn, good }: { label: string; value: number; warn?: boolean; good?: boolean }) {
  return (
    <div className="card p-4">
      <p className="text-[11px] uppercase tracking-wide text-text-muted">{label}</p>
      <p className={cn("mt-1 font-display text-2xl font-semibold", warn && "text-[#92600a]", good && "text-teal")}>{value}</p>
    </div>
  );
}

function SubStat({ label, value, unit, text }: { label: string; value: number | null | undefined; unit: string; text?: string }) {
  return (
    <div>
      <p className="text-[10px] uppercase tracking-wide text-text-muted">{label}</p>
      <p className="text-sm font-semibold">
        {text ?? (value != null ? fmtNum(value) : "—")}
        {unit && <span className="ml-1 text-[10px] font-normal text-text-muted">{unit}</span>}
      </p>
    </div>
  );
}
