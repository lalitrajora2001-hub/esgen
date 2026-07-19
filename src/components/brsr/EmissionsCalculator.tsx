"use client";

import { useState } from "react";
import { EMISSION_FACTORS, getFactor, SCOPE_LABELS, FACTORS_SOURCE_LABEL, type Scope } from "@/lib/emissions/factors";
import type { ResponseMap } from "@/lib/brsr/db";
import type { Scalar } from "@/lib/brsr/calc";
import { Button } from "@/components/ui/Button";

/**
 * Emission-factor calculator: SMEs enter raw activity data (litres, kWh, km) and
 * the GHG figure is computed from the factor library, then pushed into
 * Principle 6 (Scope 1 & 2 in EI-7, Scope 3 in LI-2). Activity lines are stored
 * on the report under the reserved "_emissions" key.
 */

interface Line { factor_id: string; quantity: string; note?: string }

/** Factor snapshot frozen at apply time, so results stay reproducible for
 *  assurance even after the factor library is updated. */
interface AppliedSnapshot {
  at: string;
  source: string;
  scope1: number;
  scope2: number;
  scope3: number;
  factors: Record<string, { activity: string; unit: string; kgco2ePerUnit: number; source: string; year: number }>;
}

const CALC_KEY = "_emissions";

function tonnes(kg: number): number {
  return Math.round((kg / 1000) * 1000) / 1000;
}

export function EmissionsCalculator({
  responses,
  onChangeAnswer,
  onApplyUpdates,
}: {
  responses: ResponseMap;
  onChangeAnswer: (key: string, value: unknown) => void;
  onApplyUpdates: (updates: Record<string, unknown>) => Promise<void>;
}) {
  const calcValue = responses[CALC_KEY] as { entries?: Line[]; applied?: AppliedSnapshot } | undefined;
  const stored = calcValue?.entries ?? [];
  const applied = calcValue?.applied;
  const [lines, setLines] = useState<Line[]>(stored.length ? stored : [{ factor_id: EMISSION_FACTORS[0].id, quantity: "" }]);
  const [note, setNote] = useState<string | null>(null);
  const [applying, setApplying] = useState(false);

  // Factor drift: the library changed since the figures were applied to P6.
  const driftedFactors = applied
    ? Object.entries(applied.factors).filter(([id, snap]) => {
        const cur = getFactor(id);
        return !cur || cur.kgco2ePerUnit !== snap.kgco2ePerUnit;
      })
    : [];

  const grouped = ([1, 2, 3] as Scope[]).map((scope) => ({ scope, items: EMISSION_FACTORS.filter((f) => f.scope === scope) }));

  const save = (next: Line[]) => {
    setLines(next);
    // Preserve the applied snapshot; only a fresh apply replaces it.
    onChangeAnswer(CALC_KEY, applied ? { entries: next, applied } : { entries: next });
  };

  const setLine = (i: number, patch: Partial<Line>) => save(lines.map((l, idx) => (idx === i ? { ...l, ...patch } : l)));
  const addLine = () => save([...lines, { factor_id: EMISSION_FACTORS[0].id, quantity: "" }]);
  const removeLine = (i: number) => save(lines.filter((_, idx) => idx !== i));

  // Scope totals (kg -> t).
  const scopeKg: Record<Scope, number> = { 1: 0, 2: 0, 3: 0 };
  for (const l of lines) {
    const f = getFactor(l.factor_id);
    const q = Number(l.quantity);
    if (f && Number.isFinite(q)) scopeKg[f.scope] += q * f.kgco2ePerUnit;
  }
  const s1 = tonnes(scopeKg[1]);
  const s2 = tonnes(scopeKg[2]);
  const s3 = tonnes(scopeKg[3]);

  const applyToP6 = async () => {
    setApplying(true);
    setNote(null);
    try {
      const updates: Record<string, unknown> = {};
      const ghg = (responses["C.P6.EI.7"] as { current?: Record<string, Record<string, Scalar>> }) ?? {};
      const ghgCur = { ...(ghg.current ?? {}) };
      // The calculator works in tonnes, so stamp the unit alongside the value.
      ghgCur.scope1 = { ...(ghgCur.scope1 ?? {}), value: s1, unit: "MT CO2e" };
      ghgCur.scope2 = { ...(ghgCur.scope2 ?? {}), value: s2, unit: "MT CO2e" };
      updates["C.P6.EI.7"] = { ...ghg, current: ghgCur };
      if (s3 > 0) {
        const li2 = (responses["C.P6.LI.2"] as { current?: Record<string, Record<string, Scalar>> }) ?? {};
        const li2Cur = { ...(li2.current ?? {}) };
        li2Cur.scope3 = { ...(li2Cur.scope3 ?? {}), value: s3, unit: "MT CO2e" };
        updates["C.P6.LI.2"] = { ...li2, current: li2Cur };
      }
      // Freeze the factor set used, so the applied figures stay reproducible
      // for assurance even after the factor library updates.
      const usedFactors: AppliedSnapshot["factors"] = {};
      for (const l of lines) {
        const f = getFactor(l.factor_id);
        if (f && Number(l.quantity) > 0) {
          usedFactors[f.id] = { activity: f.activity, unit: f.unit, kgco2ePerUnit: f.kgco2ePerUnit, source: f.source, year: f.year };
        }
      }
      updates[CALC_KEY] = {
        entries: lines,
        applied: {
          at: new Date().toISOString(),
          source: FACTORS_SOURCE_LABEL,
          scope1: s1, scope2: s2, scope3: s3,
          factors: usedFactors,
        } satisfies AppliedSnapshot,
      };
      await onApplyUpdates(updates);
      setNote(`Applied Scope 1 = ${s1}, Scope 2 = ${s2}, Scope 3 = ${s3} tCO2e into Principle 6 (current year).`);
    } catch (e) {
      setNote(e instanceof Error ? e.message : "Could not apply to Principle 6.");
    } finally {
      setApplying(false);
    }
  };

  return (
    <div>
      <div className="mb-5">
        <h2 className="text-lg font-semibold">Emissions calculator</h2>
        <p className="mt-1 text-sm text-text-muted">
          Enter activity data (fuel, electricity, travel) and the GHG figure is computed for you, then applied to
          Principle 6. Factors: {FACTORS_SOURCE_LABEL}.
        </p>
      </div>

      {applied && (
        <p className="mb-4 rounded-xl border border-border bg-surface-2/60 p-3 text-xs leading-relaxed text-text-muted">
          Applied to Principle 6 on {new Date(applied.at).toLocaleDateString("en-GB")} (Scope 1 = {applied.scope1},
          Scope 2 = {applied.scope2}{applied.scope3 > 0 ? `, Scope 3 = ${applied.scope3}` : ""} tCO2e) with the factor
          set frozen at that date for traceability.
        </p>
      )}
      {driftedFactors.length > 0 && (
        <p className="mb-4 rounded-xl border border-[#f0a020]/30 bg-[#f0a020]/8 p-3 text-xs leading-relaxed text-[#92600a]">
          The factor library has changed since you applied ({driftedFactors.length} factor{driftedFactors.length === 1 ? "" : "s"} updated:
          {" "}{driftedFactors.slice(0, 3).map(([, s]) => s.activity).join(", ")}{driftedFactors.length > 3 ? "…" : ""}).
          The figures stored in Principle 6 still reflect the frozen factors above; press &ldquo;Apply to Principle 6&rdquo; again
          only if you want to restate with current factors.
        </p>
      )}

      <div className="card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border text-left text-xs text-text-muted">
                <th className="px-4 py-3 font-medium">Activity</th>
                <th className="px-3 py-3 font-medium">Quantity</th>
                <th className="px-3 py-3 text-right font-medium">Scope</th>
                <th className="px-3 py-3 text-right font-medium">tCO2e</th>
                <th className="w-8" />
              </tr>
            </thead>
            <tbody>
              {lines.map((l, i) => {
                const f = getFactor(l.factor_id);
                const q = Number(l.quantity);
                const t = f && Number.isFinite(q) ? tonnes(q * f.kgco2ePerUnit) : 0;
                return (
                  <tr key={i} className="border-b border-border/60 last:border-0 align-top">
                    <td className="px-4 py-2">
                      <select
                        value={l.factor_id}
                        onChange={(e) => setLine(i, { factor_id: e.target.value })}
                        className="h-9 w-full min-w-[220px] rounded-lg border border-border bg-surface px-2 text-sm"
                      >
                        {grouped.map((g) => (
                          <optgroup key={g.scope} label={SCOPE_LABELS[g.scope]}>
                            {g.items.map((f) => <option key={f.id} value={f.id}>{f.activity} ({f.unit})</option>)}
                          </optgroup>
                        ))}
                      </select>
                    </td>
                    <td className="px-3 py-2">
                      <div className="flex items-center gap-1.5">
                        <input
                          value={l.quantity}
                          onChange={(e) => setLine(i, { quantity: e.target.value })}
                          inputMode="decimal"
                          placeholder="0"
                          className="h-9 w-24 rounded-lg border border-border bg-surface px-2 text-sm"
                        />
                        <span className="text-xs text-text-muted">{f?.unit}</span>
                      </div>
                    </td>
                    <td className="px-3 py-2 text-right text-text-muted">{f?.scope}</td>
                    <td className="px-3 py-2 text-right font-medium">{t}</td>
                    <td className="px-2 py-2">
                      <button onClick={() => removeLine(i)} aria-label="Remove line" className="text-text-muted hover:text-[#e5484d]">×</button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
        <div className="flex items-center justify-between gap-3 border-t border-border px-4 py-3">
          <button onClick={addLine} className="rounded-lg border border-border px-3 py-1.5 text-xs text-text transition hover:border-accent hover:bg-accent/8">Add activity</button>
          <div className="flex flex-wrap items-center gap-4 text-sm">
            <span className="text-text-muted">Scope 1 <span className="font-semibold text-text">{s1}</span></span>
            <span className="text-text-muted">Scope 2 <span className="font-semibold text-text">{s2}</span></span>
            <span className="text-text-muted">Scope 3 <span className="font-semibold text-text">{s3}</span></span>
            <span className="text-text-muted">tCO2e</span>
          </div>
        </div>
      </div>

      <div className="mt-4 flex flex-wrap items-center gap-3">
        <Button onClick={applyToP6} disabled={applying}>{applying ? "Applying…" : "Apply to Principle 6"}</Button>
        {note && <span className="text-xs text-text-muted">{note}</span>}
      </div>

      <p className="mt-4 rounded-xl border border-border bg-surface-2/60 p-3 text-xs leading-relaxed text-text-muted">
        Indicative reference factors for orientation. Confirm the current official conversion factors and your emissions
        boundary before using these figures in a disclosure.
      </p>
    </div>
  );
}
