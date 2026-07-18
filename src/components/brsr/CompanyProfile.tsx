"use client";

import { useState } from "react";
import { useCompany } from "@/components/tool/CompanyProvider";
import { updateCompany } from "@/lib/tool/db";
import { Button } from "@/components/ui/Button";
import { SECTORS, SIZE_BANDS, VALUE_CHAIN_ROLES } from "@/lib/tool/types";

/** Editable organisation profile (Section 5 of the brief). */
export function CompanyProfile() {
  const { company, setCompany } = useCompany();
  const [v, setV] = useState(() => ({
    name: company?.name ?? "",
    cin: company?.cin ?? "",
    sector: company?.sector ?? SECTORS[0],
    size_band: company?.size_band ?? "",
    employees: company?.employees != null ? String(company.employees) : "",
    is_listed: company?.is_listed == null ? "" : company.is_listed ? "Yes" : "No",
    value_chain_role: company?.value_chain_role ?? "self",
    country: company?.country ?? "India",
    contact_email: company?.contact_email ?? "",
  }));
  const [busy, setBusy] = useState(false);
  const [note, setNote] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const set = (k: keyof typeof v) => (val: string) => setV((s) => ({ ...s, [k]: val }));

  if (!company) return null;

  const save = async (e: React.FormEvent) => {
    e.preventDefault();
    setBusy(true);
    setNote(null);
    setError(null);
    try {
      const updated = await updateCompany(company.id, {
        name: v.name.trim(),
        cin: v.cin.trim() || null,
        sector: v.sector,
        size_band: v.size_band || null,
        employees: v.employees ? Number(v.employees) : null,
        is_listed: v.is_listed === "" ? null : v.is_listed === "Yes",
        value_chain_role: v.value_chain_role || null,
        country: v.country.trim() || null,
        contact_email: v.contact_email.trim() || null,
      });
      setCompany(updated);
      setNote("Profile saved.");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Could not save the profile.");
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="max-w-2xl">
      <div className="mb-5">
        <h2 className="text-lg font-semibold">Company profile</h2>
        <p className="mt-1 text-sm text-text-muted">Details of the reporting entity. Used across the report and the value-chain flow.</p>
      </div>

      <form onSubmit={save} className="card space-y-5 p-6">
        <div className="grid gap-5 sm:grid-cols-2">
          <TextField label="Legal name" value={v.name} onChange={set("name")} required />
          <TextField label="Corporate Identity Number (CIN)" value={v.cin} onChange={set("cin")} placeholder="e.g. L12345MH2010PLC000000" />
          <SelectField label="Sector" value={v.sector} onChange={set("sector")} options={[...SECTORS]} />
          <SelectField label="Size band" value={v.size_band} onChange={set("size_band")} options={["", ...SIZE_BANDS]} blankLabel="Select…" />
          <TextField label="Employees" value={v.employees} onChange={set("employees")} inputMode="numeric" placeholder="e.g. 48" />
          <SelectField label="Listed company?" value={v.is_listed} onChange={set("is_listed")} options={["", "Yes", "No"]} blankLabel="Select…" />
          <div className="sm:col-span-2">
            <SelectField
              label="Value chain role"
              value={v.value_chain_role}
              onChange={set("value_chain_role")}
              options={VALUE_CHAIN_ROLES.map((r) => r.value)}
              renderOption={(o) => VALUE_CHAIN_ROLES.find((r) => r.value === o)?.label ?? o}
            />
          </div>
          <TextField label="Country" value={v.country} onChange={set("country")} />
          <TextField label="Contact email" value={v.contact_email} onChange={set("contact_email")} placeholder="brsr@company.com" />
        </div>
        {error && <p className="text-sm text-[#b42318]">{error}</p>}
        <div className="flex items-center gap-3">
          <Button type="submit" disabled={busy}>{busy ? "Saving…" : "Save profile"}</Button>
          {note && <span className="text-xs text-text-muted">{note}</span>}
        </div>
      </form>
    </div>
  );
}

function TextField({ label, value, onChange, placeholder, required, inputMode }: {
  label: string; value: string; onChange: (v: string) => void; placeholder?: string; required?: boolean; inputMode?: "numeric";
}) {
  return (
    <label className="flex flex-col gap-1.5">
      <span className="text-sm font-medium">{label}{required && <span className="text-accent"> *</span>}</span>
      <input value={value} onChange={(e) => onChange(e.target.value)} placeholder={placeholder} inputMode={inputMode} className="h-11 rounded-xl border border-border bg-surface px-3 text-sm" />
    </label>
  );
}

function SelectField({ label, value, onChange, options, blankLabel, renderOption }: {
  label: string; value: string; onChange: (v: string) => void; options: string[]; blankLabel?: string; renderOption?: (o: string) => string;
}) {
  return (
    <label className="flex flex-col gap-1.5">
      <span className="text-sm font-medium">{label}</span>
      <select value={value} onChange={(e) => onChange(e.target.value)} className="h-11 rounded-xl border border-border bg-surface px-3 text-sm">
        {options.map((o) => <option key={o} value={o}>{o === "" ? (blankLabel ?? "—") : renderOption ? renderOption(o) : o}</option>)}
      </select>
    </label>
  );
}
