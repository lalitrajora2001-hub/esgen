import { BRSR } from "@/lib/brsr/framework";
import type { FieldType, QuestionDef, TableDef } from "@/lib/brsr/types";
import type { ResponseMap } from "@/lib/brsr/db";
import { num, type RowValues, type Scalar } from "@/lib/brsr/calc";

/**
 * Lightweight data-consistency validation for a BRSR report. Flags values that
 * are internally inconsistent or out of range so they can be corrected before a
 * report is marked final. These are advisory checks, not a compliance guarantee.
 */

export interface Issue {
  questionKey: string;
  moduleKey: string;
  code: string;
  message: string;
  /** errors block "final"; anomalies are advisory (year-on-year outliers). */
  kind: "error" | "anomaly";
}

const REL_TOL = 0.005; // 0.5% tolerance for sum reconciliation
const PCT_EPS = 0.01;
const YOY_THRESHOLD = 0.5; // flag > 50% year-on-year swing

function isNumericType(t: FieldType): boolean {
  return t === "number" || t === "percentage" || t === "currency" || t === "year";
}

function checkCell(type: FieldType, value: Scalar, label: string, out: string[]): void {
  if (value == null || value === "") return;
  if (!isNumericType(type)) return;
  const raw = typeof value === "string" ? value.trim() : value;
  const n = Number(raw);
  if (!Number.isFinite(n)) {
    out.push(`${label}: expected a number.`);
    return;
  }
  if (n < 0) out.push(`${label}: value cannot be negative (${n}).`);
  if (type === "percentage" && n > 100 + PCT_EPS) out.push(`${label}: percentage exceeds 100 (${n}).`);
}

function checkSumRows(
  table: TableDef,
  cells: Record<string, RowValues>,
  periodLabel: string,
  out: string[],
): void {
  for (const row of table.rows ?? []) {
    if (!row.check) continue;
    const target = cells[row.key]?.[row.check.col];
    if (target == null || target === "") continue;
    const parts = row.check.keys.map((k) => cells[k]?.[row.check!.col]);
    if (parts.some((p) => p == null || p === "")) continue; // not all parts entered yet
    const expected = parts.reduce<number>((a, p) => a + num((p ?? null) as Scalar), 0);
    const actual = num(target as Scalar);
    const tol = Math.max(1, Math.abs(expected) * REL_TOL);
    if (Math.abs(expected - actual) > tol) {
      out.push(`${periodLabel}${row.label}: entered ${actual} does not equal the sum of its parts (${expected}).`);
    }
  }
}

function validateTable(table: TableDef, value: Record<string, unknown>, out: string[]): void {
  const doFixed = (cells: Record<string, RowValues>, pfx: string) => {
    for (const row of table.rows ?? []) {
      for (const c of table.columns) {
        if (c.derived) continue;
        checkCell(c.type, cells[row.key]?.[c.key] ?? null, `${pfx}${row.label} / ${c.label}`, out);
      }
    }
    checkSumRows(table, cells, pfx, out);
  };
  const doDynamic = (list: RowValues[], pfx: string) => {
    list.forEach((r, i) => {
      for (const c of table.columns) {
        if (c.derived) continue;
        checkCell(c.type, r[c.key] ?? null, `${pfx}Row ${i + 1} / ${c.label}`, out);
      }
    });
  };

  if (table.perPeriod) {
    if (table.dynamic) {
      doDynamic((value.current as RowValues[]) ?? [], "Current FY: ");
      doDynamic((value.previous as RowValues[]) ?? [], "Previous FY: ");
    } else {
      doFixed((value.current as Record<string, RowValues>) ?? {}, "Current FY: ");
      doFixed((value.previous as Record<string, RowValues>) ?? {}, "Previous FY: ");
    }
  } else if (table.dynamic) {
    doDynamic((value.list as RowValues[]) ?? [], "");
  } else {
    doFixed((value.rows as Record<string, RowValues>) ?? {}, "");
  }
}

/** Year-on-year outliers for per-period fixed tables (advisory). */
function yoyAnomalies(table: TableDef, value: Record<string, unknown>, out: string[]): void {
  if (!table.perPeriod || table.dynamic) return;
  const cur = (value.current as Record<string, RowValues>) ?? {};
  const prev = (value.previous as Record<string, RowValues>) ?? {};
  for (const row of table.rows ?? []) {
    for (const c of table.columns) {
      if (c.derived || !isNumericType(c.type)) continue;
      const a = cur[row.key]?.[c.key];
      const b = prev[row.key]?.[c.key];
      if (a == null || a === "" || b == null || b === "") continue;
      const an = num(a as Scalar);
      const bn = num(b as Scalar);
      if (bn === 0) continue;
      const delta = Math.abs((an - bn) / bn);
      if (delta > YOY_THRESHOLD) {
        out.push(`${row.label} / ${c.label}: current ${an} is ${Math.round(delta * 100)}% ${an > bn ? "higher" : "lower"} than previous year (${bn}).`);
      }
    }
  }
}

function validateQuestion(q: QuestionDef, value: unknown): { errors: string[]; anomalies: string[] } {
  const errors: string[] = [];
  const anomalies: string[] = [];
  if (value == null) return { errors, anomalies };
  const val = value as Record<string, unknown>;

  if (q.kind === "fields") {
    for (const f of q.fields ?? []) {
      if (f.derived) continue;
      checkCell(f.type, (val[f.key] as Scalar) ?? null, f.label, errors);
    }
  } else if (q.kind === "principleGrid" && q.gridCell) {
    for (const p of ["P1", "P2", "P3", "P4", "P5", "P6", "P7", "P8", "P9"]) {
      checkCell(q.gridCell.type, (val[p] as Scalar) ?? null, p, errors);
    }
  } else if (q.kind === "table" && q.table) {
    validateTable(q.table, val, errors);
    yoyAnomalies(q.table, val, anomalies);
  }
  return { errors, anomalies };
}

/** All consistency issues across the report (errors + advisory anomalies). */
export function validateReport(responses: ResponseMap): Issue[] {
  const issues: Issue[] = [];
  for (const m of BRSR.modules) {
    for (const sub of m.subsections) {
      for (const q of sub.questions) {
        const { errors, anomalies } = validateQuestion(q, responses[q.key]);
        for (const message of errors) {
          issues.push({ questionKey: q.key, moduleKey: m.key, code: q.code ?? q.key, message, kind: "error" });
        }
        for (const message of anomalies) {
          issues.push({ questionKey: q.key, moduleKey: m.key, code: q.code ?? q.key, message, kind: "anomaly" });
        }
      }
    }
  }
  return issues;
}
