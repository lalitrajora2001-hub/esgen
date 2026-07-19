"use client";

import { useEffect, useState } from "react";
import { useCompany } from "@/components/tool/CompanyProvider";
import { listOrgUnits, addOrgUnit, deleteOrgUnit, isMissingTable, type OrgUnit } from "@/lib/brsr/ops";
import { Button } from "@/components/ui/Button";

/**
 * Organisation units: the sites, plants and offices that contribute data
 * bottom-up. Tasks and team members can be attached to a unit.
 */
export function OrgUnitSettings() {
  const { company } = useCompany();
  const [units, setUnits] = useState<OrgUnit[]>([]);
  const [loading, setLoading] = useState(true);
  const [needsMigration, setNeedsMigration] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [name, setName] = useState("");
  const [location, setLocation] = useState("");
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    if (!company) return;
    (async () => {
      try {
        setUnits(await listOrgUnits(company.id));
      } catch (e) {
        if (isMissingTable(e)) setNeedsMigration(true);
        else setError(e instanceof Error ? e.message : "Could not load units.");
      } finally {
        setLoading(false);
      }
    })();
  }, [company]);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!company || !name.trim()) return;
    setBusy(true);
    setError(null);
    try {
      const u = await addOrgUnit(company.id, name.trim(), location.trim() || null);
      setUnits((us) => [...us, u].sort((a, b) => a.name.localeCompare(b.name)));
      setName("");
      setLocation("");
    } catch (e2) {
      if (isMissingTable(e2)) setNeedsMigration(true);
      else setError(e2 instanceof Error ? e2.message : "Could not add the unit.");
    } finally {
      setBusy(false);
    }
  };

  const remove = async (id: string) => {
    setUnits((us) => us.filter((u) => u.id !== id));
    try { await deleteOrgUnit(id); } catch { /* refreshes on next load */ }
  };

  return (
    <div className="space-y-6">
      <div>
        <h3 className="font-display text-base font-semibold">Organisation units</h3>
        <p className="mt-1 max-w-2xl text-sm text-text-muted">
          The sites, plants and offices your data comes from. Assign collection tasks and team members
          to a unit so every figure has a clear owner and origin.
        </p>
      </div>

      {needsMigration && (
        <p className="rounded-xl border border-[#f0a020]/30 bg-[#f0a020]/8 p-3 text-xs leading-relaxed text-[#92600a]">
          Organisation units need a one-time database update: run <code className="rounded bg-white/60 px-1">supabase/brsr_ops.sql</code> in
          the Supabase SQL Editor, then reload.
        </p>
      )}
      {error && <p className="rounded-xl border border-[#e5484d]/30 bg-[#e5484d]/8 p-3 text-sm text-[#b42318]">{error}</p>}

      {!needsMigration && (
        <form onSubmit={submit} className="card flex flex-wrap items-end gap-3 p-5">
          <label className="flex min-w-[200px] flex-1 flex-col gap-1">
            <span className="text-xs font-medium">Unit name *</span>
            <input value={name} onChange={(e) => setName(e.target.value)} placeholder="e.g. Pune plant" className="h-10 rounded-lg border border-border bg-surface px-3 text-sm" />
          </label>
          <label className="flex min-w-[200px] flex-1 flex-col gap-1">
            <span className="text-xs font-medium">Location</span>
            <input value={location} onChange={(e) => setLocation(e.target.value)} placeholder="City / state" className="h-10 rounded-lg border border-border bg-surface px-3 text-sm" />
          </label>
          <Button type="submit" size="md" disabled={busy || !name.trim()}>{busy ? "Adding..." : "+ Add unit"}</Button>
        </form>
      )}

      <section className="card overflow-hidden">
        {loading ? (
          <p className="p-5 text-sm text-text-muted">Loading...</p>
        ) : units.length === 0 ? (
          <p className="p-5 text-sm text-text-muted">No units yet. Most companies start with head office plus each plant or branch.</p>
        ) : (
          <ul className="divide-y divide-border">
            {units.map((u) => (
              <li key={u.id} className="flex items-center justify-between gap-3 px-5 py-3">
                <div className="flex min-w-0 items-center gap-3">
                  <span className="grid h-9 w-9 shrink-0 place-items-center rounded-lg bg-teal/10 text-teal">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" className="h-4 w-4"><path d="M3 21h18M5 21V7l7-4v18M13 21V11l6 3v7M9 9h.01M9 13h.01M9 17h.01" strokeLinecap="round" strokeLinejoin="round" /></svg>
                  </span>
                  <div className="min-w-0">
                    <p className="truncate text-sm font-medium">{u.name}</p>
                    {u.location && <p className="truncate text-xs text-text-muted">{u.location}</p>}
                  </div>
                </div>
                <button onClick={() => remove(u.id)} className="shrink-0 text-xs text-[#b42318] hover:underline">Remove</button>
              </li>
            ))}
          </ul>
        )}
      </section>
    </div>
  );
}
