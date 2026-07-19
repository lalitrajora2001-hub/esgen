import type { ResponseMap, BrsrReport } from "@/lib/brsr/db";
import { num } from "@/lib/brsr/calc";
import { toBaseUnit } from "@/lib/brsr/units";

/**
 * Auto-fill the SEBI intensity rows (per rupee of turnover, and PPP-adjusted)
 * from the totals the client already entered plus the report's turnover and
 * PPP factor. Returns response updates in the same shape the tables store, or
 * an empty object when there is nothing computable.
 */

const TARGETS: { qKey: string; sourceRow: string }[] = [
  { qKey: "C.P6.EI.1", sourceRow: "total_energy" },
  { qKey: "C.P6.EI.3", sourceRow: "consumption_total" },
  { qKey: "C.P6.EI.9", sourceRow: "gen_total" },
];

type Period = "current" | "previous";
type Table = { current?: Record<string, Record<string, unknown>>; previous?: Record<string, Record<string, unknown>> };

function readBase(responses: ResponseMap, qKey: string, rowKey: string, period: Period): number | null {
  const v = responses[qKey] as Table | undefined;
  const row = v?.[period]?.[rowKey];
  const cell = row?.["value"];
  if (cell == null || cell === "") return null;
  const n = num(cell as never);
  return Number.isFinite(n) ? toBaseUnit(qKey, row?.unit, n) : null;
}

export function buildIntensityUpdates(responses: ResponseMap, report: BrsrReport): { updates: Record<string, unknown>; filled: number } {
  const turnover = report.turnover != null ? Number(report.turnover) : null;
  const ppp = report.ppp_factor != null ? Number(report.ppp_factor) : null;
  if (!turnover || turnover <= 0) return { updates: {}, filled: 0 };
  const pppTurnover = ppp && ppp > 0 ? turnover / ppp : null;

  const updates: Record<string, unknown> = {};
  let filled = 0;

  const fill = (qKey: string, numerator: number | null, period: Period) => {
    if (numerator == null) return;
    const existing = (updates[qKey] ?? responses[qKey] ?? {}) as Table;
    const block = { ...(existing[period] ?? {}) };
    block.intensity_turnover = { ...(block.intensity_turnover ?? {}), value: numerator / turnover };
    if (pppTurnover) block.intensity_ppp = { ...(block.intensity_ppp ?? {}), value: numerator / pppTurnover };
    updates[qKey] = { ...existing, [period]: block };
    filled++;
  };

  for (const period of ["current", "previous"] as Period[]) {
    // Simple totals (energy, water, waste).
    for (const t of TARGETS) {
      fill(t.qKey, readBase(responses, t.qKey, t.sourceRow, period), period);
    }
    // GHG Scope 1+2 (EI-7) and Scope 3 (LI-2).
    const s1 = readBase(responses, "C.P6.EI.7", "scope1", period);
    const s2 = readBase(responses, "C.P6.EI.7", "scope2", period);
    if (s1 != null || s2 != null) fill("C.P6.EI.7", (s1 ?? 0) + (s2 ?? 0), period);
    const s3 = readBase(responses, "C.P6.LI.2", "scope3", period);
    if (s3 != null) {
      const existing = (updates["C.P6.LI.2"] ?? responses["C.P6.LI.2"] ?? {}) as Table;
      const block = { ...(existing[period] ?? {}) };
      block.intensity_turnover = { ...(block.intensity_turnover ?? {}), value: s3 / turnover };
      updates["C.P6.LI.2"] = { ...existing, [period]: block };
      filled++;
    }
  }

  return { updates, filled };
}
