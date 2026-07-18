import type { Derived, QuestionDef } from "@/lib/brsr/types";
import type { BrsrReport, ResponseMap } from "@/lib/brsr/db";

/**
 * Formula engine + canonical response-value shapes.
 *
 * Every question's answer is stored as one JSONB object. The shape depends on
 * the question kind (see the accessors below). Renderers read/write these
 * shapes; calc reads them for derived cells and Core KPIs.
 */

export type Scalar = string | number | boolean | null;
export type RowValues = Record<string, Scalar>; // colKey -> value

// ---- shape helpers --------------------------------------------------------

export interface FieldsValue { [fieldKey: string]: Scalar }
export interface BooleanValue { value: boolean | null; detail?: string }
export interface NarrativeValue { text: string }
export interface FixedTableValue { rows: Record<string, RowValues> } // rowKey -> cells
export interface FixedTablePeriodValue { current: Record<string, RowValues>; previous: Record<string, RowValues> }
export interface DynamicTableValue { list: RowValues[] }
export interface DynamicTablePeriodValue { current: RowValues[]; previous: RowValues[] }
export interface GridValue { [principleKey: string]: Scalar } // "P1".."P9" -> value

export function num(v: Scalar): number {
  if (typeof v === "number") return v;
  if (typeof v === "string" && v.trim() !== "") {
    const n = Number(v);
    return Number.isFinite(n) ? n : 0;
  }
  return 0;
}

/** Evaluate a derived value against a getter for sibling keys (row cells or fields). */
export function evalDerived(d: Derived, get: (key: string) => Scalar): number | null {
  switch (d.op) {
    case "sum":
      return d.keys.reduce((acc, k) => acc + num(get(k)), 0);
    case "ratio": {
      const den = num(get(d.den));
      return den === 0 ? null : num(get(d.num)) / den;
    }
    case "ratioPct": {
      const den = num(get(d.den));
      return den === 0 ? null : (100 * num(get(d.num))) / den;
    }
    case "kpi":
      return null; // resolved by the KPI engine, not inline
  }
}

// ---- completion tracking --------------------------------------------------

/** Whether a stored answer counts as "started" (any non-empty content). */
export function isAnswered(value: unknown): boolean {
  if (value == null) return false;
  if (typeof value === "object") {
    const json = JSON.stringify(value);
    return json !== "{}" && json !== '{"rows":{}}' && json !== '{"list":[]}' && /[^\s\[\]{}",:0]/.test(json.replace(/"(current|previous|rows|list|value|text|detail)":/g, ""));
  }
  return String(value).trim() !== "";
}

export function moduleCompletion(questions: QuestionDef[], responses: ResponseMap): { answered: number; total: number } {
  const total = questions.length;
  const answered = questions.filter((q) => isAnswered(responses[q.key])).length;
  return { answered, total };
}

// ---- BRSR Core intensity KPIs ---------------------------------------------

export interface Kpi {
  label: string;
  value: number | null;
  unit: string;
  note?: string;
}

/** Read a value from a perPeriod fixed-row table by matching a row label substring. */
function readPeriodRowByLabel(
  responses: ResponseMap,
  questionKey: string,
  labelIncludes: string,
  colKey: string,
  period: "current" | "previous" = "current",
): number | null {
  const v = responses[questionKey] as FixedTablePeriodValue | undefined;
  if (!v || !v[period]) return null;
  // rows are keyed by rowKey; we do not know agent-generated keys, so the
  // caller passes a rowKey directly where known. Here rowKey === labelIncludes.
  const row = v[period][labelIncludes];
  if (!row) return null;
  const cell = row[colKey];
  return cell == null || cell === "" ? null : num(cell);
}

/**
 * Compute the headline BRSR Core intensity ratios from Principle 6 tables and
 * the report's turnover. Defensive: only returns a KPI when its inputs exist.
 * Row keys follow the encoded Principle 6 definitions (scope1/scope2 in the GHG
 * table using the "value" column).
 */
export function computeCoreKpis(responses: ResponseMap, report: BrsrReport): Kpi[] {
  const kpis: Kpi[] = [];
  const turnover = report.turnover != null ? Number(report.turnover) : null;
  const ppp = report.ppp_factor != null ? Number(report.ppp_factor) : null;

  const usable = turnover && turnover > 0;

  // GHG (Scope 1 + Scope 2) intensity — BRSR Core.
  const scope1 = readPeriodRowByLabel(responses, "C.P6.EI.7", "scope1", "value");
  const scope2 = readPeriodRowByLabel(responses, "C.P6.EI.7", "scope2", "value");
  if (scope1 != null && scope2 != null && usable) {
    pushIntensity(kpis, "GHG emission intensity (Scope 1+2)", scope1 + scope2, turnover!, ppp, "tCO2e");
  }

  // Energy intensity — BRSR Core (total energy consumed).
  const energy = readPeriodRowByLabel(responses, "C.P6.EI.1", "total_energy", "value");
  if (energy != null && usable) pushIntensity(kpis, "Energy intensity (total energy consumed)", energy, turnover!, ppp, "unit");

  // Water intensity — BRSR Core (total water consumption).
  const water = readPeriodRowByLabel(responses, "C.P6.EI.3", "consumption_total", "value");
  if (water != null && usable) pushIntensity(kpis, "Water intensity (total consumption)", water, turnover!, ppp, "kL");

  // Waste intensity — BRSR Core (total waste generated).
  const waste = readPeriodRowByLabel(responses, "C.P6.EI.9", "gen_total", "value");
  if (waste != null && usable) pushIntensity(kpis, "Waste intensity (total waste generated)", waste, turnover!, ppp, "MT");

  return kpis;
}

function pushIntensity(kpis: Kpi[], label: string, numerator: number, turnover: number, ppp: number | null, unit: string) {
  kpis.push({ label: `${label} per turnover`, value: numerator / turnover, unit: `${unit} / INR` });
  if (ppp && ppp > 0) {
    kpis.push({ label: `${label} per turnover (PPP adjusted)`, value: numerator / (turnover / ppp), unit: `${unit} / INR-PPP` });
  }
}
