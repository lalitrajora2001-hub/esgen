"use client";

import { useEffect, useMemo, useState } from "react";
import { useCompany } from "@/components/tool/CompanyProvider";
import { EMISSION_FACTORS, FACTORS_SOURCE_LABEL, SCOPE_LABELS, type Scope } from "@/lib/emissions/factors";
import {
  listCompanyFactors, addCompanyFactor, updateCompanyFactor, deleteCompanyFactor,
  isMissingTable, type CompanyFactor,
} from "@/lib/brsr/ops";
import { Button } from "@/components/ui/Button";
import { cn } from "@/lib/cn";

/**
 * The emission-factor library: system defaults (India-specific, read-only,
 * cited) plus the client's own factors (supplier-specific, site-specific or
 * regional). Custom factors require a source citation before save.
 */

const EMPTY_FORM = {
  activity: "", scope: "2" as string, unit: "kWh", kgco2e: "", co2: "", ch4: "", n2o: "",
  validFrom: "", validTo: "", sourceLabel: "", sourceUrl: "",
};

export function FactorSettings() {
  const { company } = useCompany();
  const [custom, setCustom] = useState<CompanyFactor[]>([]);
  const [loading, setLoading] = useState(true);
  const [needsMigration, setNeedsMigration] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState<string | null>(null);
  const [form, setForm] = useState(EMPTY_FORM);
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    if (!company) return;
    (async () => {
      try {
        setCustom(await listCompanyFactors(company.id));
      } catch (e) {
        if (isMissingTable(e)) setNeedsMigration(true);
        else setError(e instanceof Error ? e.message : "Could not load your factors.");
      } finally {
        setLoading(false);
      }
    })();
  }, [company]);

  const set = (k: keyof typeof EMPTY_FORM) => (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) =>
    setForm((f) => ({ ...f, [k]: e.target.value }));

  const startEdit = (f: CompanyFactor) => {
    setEditing(f.id);
    setShowForm(true);
    setForm({
      activity: f.activity, scope: String(f.scope), unit: f.unit,
      kgco2e: String(f.kgco2e_per_unit),
      co2: f.co2_factor != null ? String(f.co2_factor) : "",
      ch4: f.ch4_factor != null ? String(f.ch4_factor) : "",
      n2o: f.n2o_factor != null ? String(f.n2o_factor) : "",
      validFrom: f.valid_from ?? "", validTo: f.valid_to ?? "",
      sourceLabel: f.source_label, sourceUrl: f.source_url ?? "",
    });
  };

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!company) return;
    setError(null);
    if (!form.activity.trim()) { setError("Name the activity this factor applies to."); return; }
    const kg = Number(form.kgco2e);
    if (!Number.isFinite(kg) || kg < 0) { setError("Enter the factor in kgCO2e per unit."); return; }
    if (!form.sourceLabel.trim()) { setError("A source citation is required for custom factors."); return; }
    setBusy(true);
    try {
      const payload = {
        company_id: company.id,
        activity: form.activity.trim(),
        scope: Number(form.scope) as Scope,
        unit: form.unit.trim() || "unit",
        kgco2e_per_unit: kg,
        co2_factor: form.co2 ? Number(form.co2) : null,
        ch4_factor: form.ch4 ? Number(form.ch4) : null,
        n2o_factor: form.n2o ? Number(form.n2o) : null,
        valid_from: form.validFrom || null,
        valid_to: form.validTo || null,
        source_label: form.sourceLabel.trim(),
        source_url: form.sourceUrl.trim() || null,
        note: null,
        created_by: null,
      };
      if (editing) {
        const updated = await updateCompanyFactor(editing, payload);
        setCustom((cs) => cs.map((c) => (c.id === editing ? updated : c)));
      } else {
        const created = await addCompanyFactor(payload);
        setCustom((cs) => [...cs, created]);
      }
      setShowForm(false);
      setEditing(null);
      setForm(EMPTY_FORM);
    } catch (e2) {
      if (isMissingTable(e2)) setNeedsMigration(true);
      else setError(e2 instanceof Error ? e2.message : "Could not save the factor.");
    } finally {
      setBusy(false);
    }
  };

  const remove = async (id: string) => {
    setCustom((cs) => cs.filter((c) => c.id !== id));
    try { await deleteCompanyFactor(id); } catch { /* row already gone or offline; list refreshes next load */ }
  };

  const systemGrouped = useMemo(
    () => ([1, 2, 3] as Scope[]).map((s) => ({ scope: s, items: EMISSION_FACTORS.filter((f) => f.scope === s) })),
    [],
  );

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <h3 className="font-display text-base font-semibold">Emission factors</h3>
          <p className="mt-1 max-w-2xl text-sm text-text-muted">
            Factors convert activity data (litres, kWh, km) into emissions. ESGEN ships India-specific
            defaults; add your own for supplier-specific or regional values. Custom factors need a source.
          </p>
        </div>
        <Button size="md" onClick={() => { setShowForm((s) => !s); setEditing(null); setForm(EMPTY_FORM); }}>
          {showForm && !editing ? "Close" : "+ Add factor"}
        </Button>
      </div>

      {needsMigration && (
        <p className="rounded-xl border border-[#f0a020]/30 bg-[#f0a020]/8 p-3 text-xs leading-relaxed text-[#92600a]">
          Custom factors need a one-time database update: run <code className="rounded bg-white/60 px-1">supabase/brsr_ops.sql</code> in
          the Supabase SQL Editor, then reload. The system defaults below work already.
        </p>
      )}
      {error && <p className="rounded-xl border border-[#e5484d]/30 bg-[#e5484d]/8 p-3 text-sm text-[#b42318]">{error}</p>}

      {/* Add / edit form */}
      {showForm && !needsMigration && (
        <form onSubmit={submit} className="card space-y-4 p-5">
          <p className="text-sm font-semibold">{editing ? "Edit factor" : "New factor"}</p>
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
            <label className="flex flex-col gap-1 sm:col-span-2">
              <span className="text-xs font-medium">Activity *</span>
              <input value={form.activity} onChange={set("activity")} placeholder="e.g. Grid electricity - Maharashtra" className="h-10 rounded-lg border border-border bg-surface px-3 text-sm" />
            </label>
            <label className="flex flex-col gap-1">
              <span className="text-xs font-medium">Scope *</span>
              <select value={form.scope} onChange={set("scope")} className="h-10 rounded-lg border border-border bg-surface px-3 text-sm">
                <option value="1">Scope 1</option>
                <option value="2">Scope 2</option>
                <option value="3">Scope 3</option>
              </select>
            </label>
            <label className="flex flex-col gap-1">
              <span className="text-xs font-medium">Activity unit *</span>
              <input value={form.unit} onChange={set("unit")} placeholder="kWh / litre / kg / km" className="h-10 rounded-lg border border-border bg-surface px-3 text-sm" />
            </label>
            <label className="flex flex-col gap-1">
              <span className="text-xs font-medium">kgCO2e per unit *</span>
              <input value={form.kgco2e} onChange={set("kgco2e")} inputMode="decimal" placeholder="0.7117" className="h-10 rounded-lg border border-border bg-surface px-3 text-sm" />
            </label>
            <label className="flex flex-col gap-1">
              <span className="text-xs font-medium">CO2 factor</span>
              <input value={form.co2} onChange={set("co2")} inputMode="decimal" placeholder="optional" className="h-10 rounded-lg border border-border bg-surface px-3 text-sm" />
            </label>
            <label className="flex flex-col gap-1">
              <span className="text-xs font-medium">CH4 factor</span>
              <input value={form.ch4} onChange={set("ch4")} inputMode="decimal" placeholder="optional" className="h-10 rounded-lg border border-border bg-surface px-3 text-sm" />
            </label>
            <label className="flex flex-col gap-1">
              <span className="text-xs font-medium">N2O factor</span>
              <input value={form.n2o} onChange={set("n2o")} inputMode="decimal" placeholder="optional" className="h-10 rounded-lg border border-border bg-surface px-3 text-sm" />
            </label>
            <label className="flex flex-col gap-1">
              <span className="text-xs font-medium">Valid from</span>
              <input type="date" value={form.validFrom} onChange={set("validFrom")} className="h-10 rounded-lg border border-border bg-surface px-3 text-sm" />
            </label>
            <label className="flex flex-col gap-1">
              <span className="text-xs font-medium">Valid to</span>
              <input type="date" value={form.validTo} onChange={set("validTo")} className="h-10 rounded-lg border border-border bg-surface px-3 text-sm" />
            </label>
            <label className="flex flex-col gap-1 sm:col-span-2">
              <span className="text-xs font-medium">Source *</span>
              <input value={form.sourceLabel} onChange={set("sourceLabel")} placeholder="e.g. Supplier disclosure FY25 / CEA v21.0" className="h-10 rounded-lg border border-border bg-surface px-3 text-sm" />
            </label>
            <label className="flex flex-col gap-1 sm:col-span-2">
              <span className="text-xs font-medium">Source URL</span>
              <input value={form.sourceUrl} onChange={set("sourceUrl")} placeholder="https://" className="h-10 rounded-lg border border-border bg-surface px-3 text-sm" />
            </label>
          </div>
          <div className="flex gap-2">
            <Button type="submit" size="md" disabled={busy}>{busy ? "Saving..." : editing ? "Save changes" : "Add factor"}</Button>
            <Button size="md" variant="ghost" onClick={() => { setShowForm(false); setEditing(null); }}>Cancel</Button>
          </div>
        </form>
      )}

      {/* Custom factors */}
      <section className="card overflow-hidden">
        <div className="flex items-center justify-between border-b border-border px-5 py-3.5">
          <p className="text-sm font-semibold">Your factors</p>
          <span className="rounded-full bg-surface-2 px-2.5 py-0.5 text-[11px] text-text-muted">{custom.length}</span>
        </div>
        {loading ? (
          <p className="p-5 text-sm text-text-muted">Loading...</p>
        ) : custom.length === 0 ? (
          <p className="p-5 text-sm text-text-muted">
            No custom factors yet. Add one when you have a supplier-specific, regional or site-specific value;
            otherwise the system defaults below apply.
          </p>
        ) : (
          <FactorTable>
            {custom.map((f) => (
              <tr key={f.id} className="border-t border-border">
                <td className="px-4 py-2.5">
                  <span className="font-medium">{f.activity}</span>
                  <span className="ml-2 rounded-full bg-accent/10 px-1.5 py-0.5 text-[10px] font-medium text-accent">Custom</span>
                </td>
                <td className="px-3 py-2.5 text-text-muted">{SCOPE_LABELS[f.scope]}</td>
                <td className="px-3 py-2.5 text-text-muted">{f.valid_from ?? "—"}{f.valid_to ? ` → ${f.valid_to}` : ""}</td>
                <td className="px-3 py-2.5 text-text-muted">{f.unit}</td>
                <td className="px-3 py-2.5 text-right font-medium tabular-nums">{f.kgco2e_per_unit}</td>
                <td className="max-w-[180px] truncate px-3 py-2.5 text-text-muted" title={f.source_label}>
                  {f.source_url ? <a href={f.source_url} target="_blank" rel="noreferrer" className="hover:underline">{f.source_label}</a> : f.source_label}
                </td>
                <td className="px-3 py-2.5 text-right">
                  <button onClick={() => startEdit(f)} className="text-xs text-text-muted hover:text-text">Edit</button>
                  <button onClick={() => remove(f.id)} className="ml-3 text-xs text-[#b42318] hover:underline">Remove</button>
                </td>
              </tr>
            ))}
          </FactorTable>
        )}
      </section>

      {/* System factors */}
      <section className="card overflow-hidden">
        <div className="flex flex-wrap items-center justify-between gap-2 border-b border-border px-5 py-3.5">
          <p className="text-sm font-semibold">System defaults · India</p>
          <span className="text-[11px] text-text-muted">{FACTORS_SOURCE_LABEL}</span>
        </div>
        {systemGrouped.map((g) => (
          <div key={g.scope}>
            <p className="border-t border-border bg-surface-2/50 px-5 py-2 text-[11px] font-semibold uppercase tracking-wide text-text-muted">
              {SCOPE_LABELS[g.scope]}
            </p>
            <FactorTable>
              {g.items.map((f) => (
                <tr key={f.id} className="border-t border-border">
                  <td className="px-4 py-2.5">
                    <span className="font-medium">{f.activity}</span>
                    {f.note && <span className="ml-2 hidden text-[11px] text-text-muted xl:inline">{f.note}</span>}
                  </td>
                  <td className="px-3 py-2.5 text-text-muted">{f.category}</td>
                  <td className="px-3 py-2.5 text-text-muted">{f.year}</td>
                  <td className="px-3 py-2.5 text-text-muted">per {f.unit}</td>
                  <td className="px-3 py-2.5 text-right font-medium tabular-nums">{f.kgco2ePerUnit}</td>
                  <td className="max-w-[220px] truncate px-3 py-2.5 text-text-muted" title={f.source}>{f.source}</td>
                  <td className="px-3 py-2.5 text-right">
                    <span className="rounded-full bg-surface-2 px-2 py-0.5 text-[10px] text-text-muted">System</span>
                  </td>
                </tr>
              ))}
            </FactorTable>
          </div>
        ))}
        <p className="border-t border-border px-5 py-3 text-[11px] leading-relaxed text-text-muted">
          System factors are indicative and updated with official releases (CEA grid database, IPCC
          guidelines). Confirm the factor vintage that applies to your reporting year before disclosure.
        </p>
      </section>
    </div>
  );
}

function FactorTable({ children }: { children: React.ReactNode }) {
  return (
    <div className="overflow-x-auto">
      <table className="w-full min-w-[760px] text-left text-sm">
        <thead>
          <tr className="text-[11px] uppercase tracking-wide text-text-muted">
            <th className="px-4 py-2 font-medium">Emission factor</th>
            <th className="px-3 py-2 font-medium">Scope / category</th>
            <th className="px-3 py-2 font-medium">Validity</th>
            <th className="px-3 py-2 font-medium">Unit</th>
            <th className="px-3 py-2 text-right font-medium">kgCO2e / unit</th>
            <th className="px-3 py-2 font-medium">Source</th>
            <th className={cn("px-3 py-2 text-right font-medium")}></th>
          </tr>
        </thead>
        <tbody>{children}</tbody>
      </table>
    </div>
  );
}
