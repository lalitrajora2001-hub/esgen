"use client";

import { Suspense, useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { Logo } from "@/components/logo/Logo";
import { fetchInviteByToken, submitSupplierData, type SupplierPayload } from "@/lib/brsr/ops";
import { isEmail } from "@/components/forms/fields";
import { Button } from "@/components/ui/Button";

/**
 * Public supplier submission page. Reached only via a private invite link
 * (?token=...). No account needed; the token-scoped RPCs do the work.
 */

export default function SupplierPage() {
  return (
    <Suspense fallback={<Shell><p className="text-sm text-text-muted">Loading...</p></Shell>}>
      <SupplierForm />
    </Suspense>
  );
}

function Shell({ children }: { children: React.ReactNode }) {
  return (
    <section className="app-light relative flex min-h-screen flex-col overflow-hidden bg-canvas px-5 py-8 text-text">
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0"
        style={{ background: "radial-gradient(640px 420px at 50% -8%, rgba(15,118,110,0.10), transparent 62%)" }}
      />
      <div className="relative flex flex-1 flex-col items-center justify-center py-8">
        <div className="w-full max-w-xl">
          <div className="mb-8 flex flex-col items-center text-center">
            <Logo className="h-11 text-[#101828]" />
            <p className="mt-3 text-[0.68rem] font-medium uppercase tracking-[0.2em] text-text-muted">Supplier data request</p>
          </div>
          {children}
        </div>
      </div>
      <p className="relative pb-2 text-center text-xs text-text-muted">
        Powered by <Link href="/" className="underline transition-colors hover:text-text">ESGEN</Link>
      </p>
    </section>
  );
}

const EMPTY = {
  email: "", period: "", scope1: "", scope2: "", scope3: "",
  energy: "", renewable: "", basis: "Revenue share", pct: "", note: "",
};

function SupplierForm() {
  const params = useSearchParams();
  const token = params.get("token");
  const [invite, setInvite] = useState<{ supplier_name: string; client_name: string; financial_year: string; message: string | null; status: string } | null>(null);
  const [state, setState] = useState<"loading" | "notfound" | "form" | "done">("loading");
  const [form, setForm] = useState(EMPTY);
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    if (!token) { setState("notfound"); return; }
    (async () => {
      try {
        const inv = await fetchInviteByToken(token);
        if (!inv || !inv.client_name) { setState("notfound"); return; }
        setInvite(inv);
        setState("form");
      } catch {
        setState("notfound");
      }
    })();
  }, [token]);

  const set = (k: keyof typeof EMPTY) => (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) =>
    setForm((f) => ({ ...f, [k]: e.target.value }));

  const numOrNull = (s: string): number | null => {
    if (!s.trim()) return null;
    const n = Number(s);
    return Number.isFinite(n) && n >= 0 ? n : NaN as never;
  };

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    if (!isEmail(form.email)) { setError("Enter your work email so the request can be traced."); return; }
    const s1 = numOrNull(form.scope1), s2 = numOrNull(form.scope2), s3 = numOrNull(form.scope3);
    const energy = numOrNull(form.energy), renewable = numOrNull(form.renewable), pct = numOrNull(form.pct);
    for (const [label, v] of [["Scope 1", s1], ["Scope 2", s2], ["Scope 3", s3], ["Energy", energy], ["Renewable %", renewable], ["Share %", pct]] as const) {
      if (Number.isNaN(v)) { setError(`${label} must be a non-negative number.`); return; }
    }
    if ((s1 ?? 0) + (s2 ?? 0) + (s3 ?? 0) <= 0) { setError("Enter at least one emissions figure (Scope 1, 2 or 3)."); return; }
    if (pct != null && (pct <= 0 || pct > 100)) { setError("The share attributable must be between 0 and 100 percent."); return; }
    if (renewable != null && renewable > 100) { setError("Renewable share cannot exceed 100 percent."); return; }

    const payload: SupplierPayload = {
      period: form.period.trim() || undefined,
      scope1: s1, scope2: s2, scope3: s3,
      energy_total_gj: energy,
      renewable_pct: renewable,
      allocation_basis: form.basis,
      allocation_pct: pct,
      method_note: form.note.trim() || undefined,
    };
    setBusy(true);
    try {
      const res = await submitSupplierData(token!, payload, form.email.trim());
      if (!res.ok) { setError(res.error ?? "Could not submit."); return; }
      setState("done");
    } catch (e2) {
      setError(e2 instanceof Error ? e2.message : "Could not submit. Try again.");
    } finally {
      setBusy(false);
    }
  };

  if (state === "loading") return <Shell><div className="card p-8 text-center text-sm text-text-muted">Checking your invite...</div></Shell>;

  if (state === "notfound") {
    return (
      <Shell>
        <div className="card p-8 text-center">
          <h1 className="text-xl font-semibold">Invite not found</h1>
          <p className="mt-2 text-sm text-text-muted">
            This link is invalid or has been withdrawn. Ask the company that requested your data to send
            a fresh link.
          </p>
        </div>
      </Shell>
    );
  }

  if (state === "done") {
    return (
      <Shell>
        <div className="card p-8 text-center">
          <span className="mx-auto grid h-12 w-12 place-items-center rounded-full bg-teal/10 text-teal">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="h-6 w-6"><path d="M5 13l4 4L19 7" strokeLinecap="round" strokeLinejoin="round" /></svg>
          </span>
          <h1 className="mt-4 text-xl font-semibold">Data submitted</h1>
          <p className="mt-2 text-sm text-text-muted">
            Thank you. {invite?.client_name} will review your submission. You can reopen this link to
            update the figures until they accept it.
          </p>
        </div>
      </Shell>
    );
  }

  return (
    <Shell>
      <div className="card overflow-hidden">
        <div className="border-b border-border bg-surface-2/50 p-6">
          <h1 className="text-lg font-semibold">{invite!.client_name} requests your emissions data</h1>
          <p className="mt-1 text-sm text-text-muted">
            For {invite!.supplier_name} · financial year {invite!.financial_year}. Your figures feed their
            value-chain (Scope 3) reporting under India&apos;s BRSR framework.
          </p>
          {invite!.message && <p className="mt-3 rounded-lg border border-border bg-surface p-3 text-xs text-text-muted">&ldquo;{invite!.message}&rdquo;</p>}
          {invite!.status === "submitted" && (
            <p className="mt-3 rounded-lg bg-[#f0a020]/10 p-2.5 text-xs text-[#92600a]">
              You have already submitted. Sending again replaces the previous figures.
            </p>
          )}
        </div>

        <form onSubmit={submit} className="space-y-5 p-6">
          <div className="grid gap-3 sm:grid-cols-2">
            <label className="flex flex-col gap-1">
              <span className="text-xs font-medium">Your work email *</span>
              <input value={form.email} onChange={set("email")} type="email" placeholder="name@supplier.com" className="h-10 rounded-lg border border-border bg-surface px-3 text-sm" />
            </label>
            <label className="flex flex-col gap-1">
              <span className="text-xs font-medium">Reporting period</span>
              <input value={form.period} onChange={set("period")} placeholder={`e.g. FY ${invite!.financial_year}`} className="h-10 rounded-lg border border-border bg-surface px-3 text-sm" />
            </label>
          </div>

          <div>
            <p className="text-xs font-semibold uppercase tracking-wide text-text-muted">Your total GHG emissions (tCO2e)</p>
            <div className="mt-2 grid gap-3 sm:grid-cols-3">
              <label className="flex flex-col gap-1">
                <span className="text-xs font-medium">Scope 1 (direct)</span>
                <input value={form.scope1} onChange={set("scope1")} inputMode="decimal" placeholder="e.g. 120" className="h-10 rounded-lg border border-border bg-surface px-3 text-sm" />
              </label>
              <label className="flex flex-col gap-1">
                <span className="text-xs font-medium">Scope 2 (energy)</span>
                <input value={form.scope2} onChange={set("scope2")} inputMode="decimal" placeholder="e.g. 340" className="h-10 rounded-lg border border-border bg-surface px-3 text-sm" />
              </label>
              <label className="flex flex-col gap-1">
                <span className="text-xs font-medium">Scope 3 (optional)</span>
                <input value={form.scope3} onChange={set("scope3")} inputMode="decimal" placeholder="If known" className="h-10 rounded-lg border border-border bg-surface px-3 text-sm" />
              </label>
            </div>
          </div>

          <div className="grid gap-3 sm:grid-cols-2">
            <label className="flex flex-col gap-1">
              <span className="text-xs font-medium">Total energy consumed (GJ)</span>
              <input value={form.energy} onChange={set("energy")} inputMode="decimal" placeholder="Optional" className="h-10 rounded-lg border border-border bg-surface px-3 text-sm" />
            </label>
            <label className="flex flex-col gap-1">
              <span className="text-xs font-medium">Renewable share of energy (%)</span>
              <input value={form.renewable} onChange={set("renewable")} inputMode="decimal" placeholder="Optional" className="h-10 rounded-lg border border-border bg-surface px-3 text-sm" />
            </label>
          </div>

          <div>
            <p className="text-xs font-semibold uppercase tracking-wide text-text-muted">Share attributable to {invite!.client_name}</p>
            <div className="mt-2 grid gap-3 sm:grid-cols-2">
              <label className="flex flex-col gap-1">
                <span className="text-xs font-medium">Basis</span>
                <select value={form.basis} onChange={set("basis")} className="h-10 rounded-lg border border-border bg-surface px-3 text-sm">
                  <option>Revenue share</option>
                  <option>Production volume share</option>
                  <option>Other (explain below)</option>
                </select>
              </label>
              <label className="flex flex-col gap-1">
                <span className="text-xs font-medium">Share (%)</span>
                <input value={form.pct} onChange={set("pct")} inputMode="decimal" placeholder="e.g. 12 if they are 12% of your revenue" className="h-10 rounded-lg border border-border bg-surface px-3 text-sm" />
              </label>
            </div>
          </div>

          <label className="flex flex-col gap-1">
            <span className="text-xs font-medium">How the figures were calculated</span>
            <textarea value={form.note} onChange={set("note")} rows={2} placeholder="e.g. Fuel bills and electricity meters, CEA grid factor, FY totals" className="rounded-lg border border-border bg-surface px-3 py-2 text-sm" />
          </label>

          {error && <p className="rounded-xl border border-[#e5484d]/30 bg-[#e5484d]/8 p-3 text-sm text-[#b42318]" role="alert">{error}</p>}

          <Button type="submit" size="lg" className="w-full" disabled={busy}>
            {busy ? "Submitting..." : "Submit to " + invite!.client_name}
          </Button>
          <p className="text-center text-[11px] leading-relaxed text-text-muted">
            Your data is shared only with {invite!.client_name} for sustainability reporting. Figures are
            indicative until they verify them.
          </p>
        </form>
      </div>
    </Shell>
  );
}
