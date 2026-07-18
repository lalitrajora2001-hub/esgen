"use client";

import { useMemo, useState } from "react";
import { useCompany } from "@/components/tool/CompanyProvider";
import { useEntries } from "@/components/tool/useEntries";
import { IllustrativeNote } from "@/components/tool/AppStates";
import { Button } from "@/components/ui/Button";
import { Field } from "@/components/forms/fields";
import { EMISSION_FACTORS, SCOPE_LABELS, getFactor, type Scope } from "@/lib/emissions/factors";
import { fmtTonnes, toTonnes } from "@/lib/emissions/calc";

const TODAY = "2026-07-17";

export default function DataPage() {
  const { company } = useCompany();
  const { computed, loading, error, add, remove } = useEntries(company?.id);

  const [factorId, setFactorId] = useState(EMISSION_FACTORS[0].id);
  const [date, setDate] = useState(TODAY);
  const [quantity, setQuantity] = useState("");
  const [note, setNote] = useState("");
  const [busy, setBusy] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);

  const factor = getFactor(factorId)!;
  const preview = quantity ? Number(quantity) * factor.kgco2ePerUnit : 0;

  // Options grouped by scope, shown as "Activity (unit)".
  const grouped = useMemo(() => {
    return ([1, 2, 3] as Scope[]).map((scope) => ({
      scope,
      label: SCOPE_LABELS[scope],
      items: EMISSION_FACTORS.filter((f) => f.scope === scope),
    }));
  }, []);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError(null);
    const q = Number(quantity);
    if (!quantity || Number.isNaN(q) || q <= 0) {
      setFormError("Enter a quantity greater than zero.");
      return;
    }
    setBusy(true);
    try {
      await add({ factor_id: factorId, activity_date: date, quantity: q, note: note.trim() || null });
      setQuantity("");
      setNote("");
    } catch (e) {
      setFormError(e instanceof Error ? e.message : "Could not save the entry.");
    } finally {
      setBusy(false);
    }
  };

  return (
    <div>
      <header>
        <h1 className="text-2xl font-semibold sm:text-3xl">Activity data</h1>
        <p className="mt-1 text-sm text-text-muted">
          Record what your organisation consumed. Each line is converted to CO2e using a reference factor.
        </p>
      </header>

      <div className="mt-8 grid gap-6 lg:grid-cols-[380px_1fr]">
        {/* Add form */}
        <form onSubmit={submit} noValidate className="card h-fit space-y-5 p-6">
          <h2 className="font-display text-base font-semibold">Add an entry</h2>

          <div className="flex flex-col gap-2">
            <label htmlFor="factor" className="font-display text-sm font-medium">Activity</label>
            <select
              id="factor"
              value={factorId}
              onChange={(e) => setFactorId(e.target.value)}
              className="h-12 w-full rounded-xl border border-border bg-surface px-4 text-text focus:border-accent focus:outline-none focus:ring-4 focus:ring-accent/15"
            >
              {grouped.map((g) => (
                <optgroup key={g.scope} label={g.label}>
                  {g.items.map((f) => (
                    <option key={f.id} value={f.id}>{f.activity} ({f.unit})</option>
                  ))}
                </optgroup>
              ))}
            </select>
            <p className="text-xs text-text-muted">
              {factor.category} &middot; {factor.kgco2ePerUnit} kg CO2e / {factor.unit}
              {factor.note ? `, ${factor.note}` : ""}
            </p>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="flex flex-col gap-2">
              <label htmlFor="quantity" className="font-display text-sm font-medium">
                Quantity <span className="text-accent-3">*</span>
              </label>
              <div className="flex items-center gap-2">
                <input
                  id="quantity"
                  type="text"
                  inputMode="decimal"
                  value={quantity}
                  onChange={(e) => setQuantity(e.target.value)}
                  placeholder="0"
                  className="h-12 w-full rounded-xl border border-border bg-surface px-4 text-text focus:border-accent focus:outline-none focus:ring-4 focus:ring-accent/15"
                />
                <span className="shrink-0 text-sm text-text-muted">{factor.unit}</span>
              </div>
            </div>
            <Field id="date" label="Date" type="date" value={date} onChange={setDate} />
          </div>

          <Field id="note" label="Note (optional)" value={note} onChange={setNote} placeholder="e.g. Q2 electricity bill" />

          <div className="rounded-xl border border-border bg-surface-2/60 p-3 text-sm">
            <span className="text-text-muted">Estimated: </span>
            <span className="font-mono text-text">{fmtTonnes(toTonnes(preview))} tCO2e</span>
          </div>

          {formError && (
            <p className="rounded-xl border border-[#ff7a7a]/30 bg-[#ff7a7a]/8 p-3 text-sm text-[#ffb4b4]" role="alert">{formError}</p>
          )}
          <Button type="submit" className="w-full" disabled={busy}>{busy ? "Saving..." : "Add entry"}</Button>
        </form>

        {/* Entries table */}
        <section className="card overflow-hidden">
          <div className="flex items-center justify-between border-b border-border px-5 py-4">
            <h2 className="font-display text-base font-semibold">Recorded entries</h2>
            <span className="text-xs text-text-muted">{computed.length} {computed.length === 1 ? "line" : "lines"}</span>
          </div>

          {error && <p className="px-5 py-4 text-sm text-[#ffb4b4]">{error}</p>}

          {loading ? (
            <p className="px-5 py-8 text-center text-sm text-text-muted">Loading...</p>
          ) : computed.length === 0 ? (
            <p className="px-5 py-10 text-center text-sm text-text-muted">No entries yet. Add your first on the left.</p>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-border text-left text-xs uppercase tracking-wide text-text-muted">
                    <th className="px-5 py-3 font-medium">Activity</th>
                    <th className="px-3 py-3 font-medium">Date</th>
                    <th className="px-3 py-3 text-right font-medium">Quantity</th>
                    <th className="px-3 py-3 text-right font-medium">tCO2e</th>
                    <th className="px-5 py-3" />
                  </tr>
                </thead>
                <tbody>
                  {computed.map((e) => (
                    <tr key={e.id} className="border-b border-border/60 last:border-0">
                      <td className="px-5 py-3">
                        <p className="font-medium">{e.activity}</p>
                        <p className="text-xs text-text-muted">{SCOPE_LABELS[e.scope]}{e.note ? ` · ${e.note}` : ""}</p>
                      </td>
                      <td className="px-3 py-3 text-text-muted">{e.activity_date}</td>
                      <td className="px-3 py-3 text-right font-mono">{e.quantity} {e.unit}</td>
                      <td className="px-3 py-3 text-right font-mono">{fmtTonnes(toTonnes(e.kgco2e))}</td>
                      <td className="px-5 py-3 text-right">
                        <button
                          onClick={() => remove(e.id)}
                          aria-label={`Delete ${e.activity} entry`}
                          className="text-text-muted transition hover:text-[#ff7a7a]"
                        >
                          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" className="h-4 w-4">
                            <path d="M3 6h18M8 6V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2M6 6l1 14a2 2 0 0 0 2 2h6a2 2 0 0 0 2-2l1-14" />
                          </svg>
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </section>
      </div>

      <div className="mt-6"><IllustrativeNote /></div>
    </div>
  );
}
