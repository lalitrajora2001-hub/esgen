import { BRSR, allQuestions, moduleForQuestion, moduleQuestions } from "@/lib/brsr/framework";
import type { QuestionDef, TableDef } from "@/lib/brsr/types";
import type { BrsrReport, ResponseMap } from "@/lib/brsr/db";
import type { Company } from "@/lib/tool/types";
import type { RowValues, Scalar } from "@/lib/brsr/calc";

/**
 * Export/import helpers for a BRSR report.
 *
 * - JSON: a complete, loss-less snapshot of the report meta + all answers.
 *   Round-trips exactly, so it doubles as backup/restore and migration.
 * - XML: an XBRL-style structured document. Each answer is emitted as a fact
 *   with an entity+period context and a stable element id derived from the
 *   question/field/row key. It is ready to be remapped onto SEBI's official
 *   BRSR taxonomy element names; it is NOT itself a filing-valid iXBRL.
 * - CSV: a flat data dictionary / checklist of every disclosure, for offline
 *   review or as an entry template.
 */

// ---- JSON snapshot --------------------------------------------------------

export interface ReportSnapshot {
  format: "esgen-brsr-report";
  version: string;
  exportedForFinancialYear: string;
  reportingBoundary: string;
  turnover: number | null;
  pppFactor: number | null;
  responses: ResponseMap;
}

export function buildJson(report: BrsrReport, responses: ResponseMap): string {
  const snap: ReportSnapshot = {
    format: "esgen-brsr-report",
    version: BRSR.version,
    exportedForFinancialYear: report.financial_year,
    reportingBoundary: report.reporting_boundary,
    turnover: report.turnover,
    pppFactor: report.ppp_factor,
    responses,
  };
  return JSON.stringify(snap, null, 2);
}

export function parseJson(text: string): ResponseMap {
  const data = JSON.parse(text) as Partial<ReportSnapshot>;
  if (data.format !== "esgen-brsr-report" || typeof data.responses !== "object" || !data.responses) {
    throw new Error("This file is not an ESGen BRSR report export.");
  }
  return data.responses;
}

// ---- XBRL-style XML -------------------------------------------------------

function esc(s: string): string {
  return s.replace(/[<>&"']/g, (c) => ({ "<": "&lt;", ">": "&gt;", "&": "&amp;", '"': "&quot;", "'": "&apos;" }[c] as string));
}

function factsForQuestion(q: QuestionDef, value: unknown, emit: (elementId: string, period: string, v: Scalar) => void): void {
  if (value == null) return;
  const val = value as Record<string, unknown>;
  const base = q.key;

  if (q.kind === "narrative") {
    const t = (val as { text?: string }).text;
    if (t) emit(`${base}`, "current", t);
    return;
  }
  if (q.kind === "boolean") {
    const b = val as { value?: boolean | null; detail?: string };
    if (b.value != null) emit(`${base}`, "current", b.value);
    if (b.detail) emit(`${base}.detail`, "current", b.detail);
    return;
  }
  if (q.kind === "fields") {
    for (const f of q.fields ?? []) {
      const v = val[f.key] as Scalar;
      if (v != null && v !== "") emit(`${base}.${f.key}`, "current", v);
    }
    return;
  }
  if (q.kind === "principleGrid") {
    for (const p of ["P1", "P2", "P3", "P4", "P5", "P6", "P7", "P8", "P9"]) {
      const v = val[p] as Scalar;
      if (v != null && v !== "") emit(`${base}.${p}`, "current", v);
    }
    return;
  }
  if (q.kind === "table" && q.table) {
    emitTable(base, q.table, val, emit);
  }
}

function emitTable(base: string, table: TableDef, val: Record<string, unknown>, emit: (id: string, period: string, v: Scalar) => void): void {
  const doFixed = (cells: Record<string, RowValues>, period: string) => {
    for (const r of table.rows ?? []) {
      for (const c of table.columns) {
        const v = cells[r.key]?.[c.key];
        if (v != null && v !== "") emit(`${base}.${r.key}.${c.key}`, period, v);
      }
    }
  };
  const doDynamic = (list: RowValues[], period: string) => {
    list.forEach((row, i) => {
      for (const c of table.columns) {
        const v = row[c.key];
        if (v != null && v !== "") emit(`${base}.row${i + 1}.${c.key}`, period, v);
      }
    });
  };
  if (table.perPeriod) {
    if (table.dynamic) {
      doDynamic((val.current as RowValues[]) ?? [], "current");
      doDynamic((val.previous as RowValues[]) ?? [], "previous");
    } else {
      doFixed((val.current as Record<string, RowValues>) ?? {}, "current");
      doFixed((val.previous as Record<string, RowValues>) ?? {}, "previous");
    }
  } else if (table.dynamic) {
    doDynamic((val.list as RowValues[]) ?? [], "current");
  } else {
    doFixed((val.rows as Record<string, RowValues>) ?? {}, "current");
  }
}

export function buildXml(company: Company, report: BrsrReport, responses: ResponseMap): string {
  const facts: string[] = [];
  const emit = (elementId: string, period: string, v: Scalar) => {
    const contextRef = period === "previous" ? "PY" : "CY";
    const text = typeof v === "boolean" ? (v ? "true" : "false") : String(v);
    facts.push(`  <brsr:fact element="${esc(elementId)}" contextRef="${contextRef}">${esc(text)}</brsr:fact>`);
  };
  for (const q of allQuestions()) factsForQuestion(q, responses[q.key], emit);

  return [
    `<?xml version="1.0" encoding="UTF-8"?>`,
    `<!-- ESGen BRSR structured export (XBRL-style). Element ids are stable ESGen keys, ready to remap to SEBI's official BRSR taxonomy. Not a filing-valid iXBRL instance. -->`,
    `<brsr:report xmlns:brsr="https://esgen.co.uk/brsr/${esc(BRSR.version)}">`,
    `  <brsr:entity name="${esc(company.name)}" cin="${esc(readCin(responses))}"/>`,
    `  <brsr:context id="CY" period="current" financialYear="${esc(report.financial_year)}"/>`,
    `  <brsr:context id="PY" period="previous"/>`,
    `  <brsr:unit id="INR" measure="INR"/>`,
    ...facts,
    `</brsr:report>`,
  ].join("\n");
}

function readCin(responses: ResponseMap): string {
  const a = responses["A.I.details"] as { cin?: string } | undefined;
  return a?.cin ?? "";
}

// ---- CSV data dictionary --------------------------------------------------

export function buildCsvTemplate(): string {
  const rows: string[][] = [["Section/Module", "Question code", "Question key", "Kind", "Core", "Requires prev FY", "Title"]];
  for (const m of BRSR.modules) {
    for (const sub of m.subsections) {
      for (const q of sub.questions) {
        rows.push([
          m.navLabel,
          q.code ?? "",
          q.key,
          q.kind,
          q.isCore ? "Yes" : "",
          q.table?.perPeriod || q.requiresPrevYear ? "Yes" : "",
          q.title,
        ]);
      }
    }
  }
  return rows.map((r) => r.map(csvCell).join(",")).join("\n");
}

function csvCell(s: string): string {
  return /[",\n]/.test(s) ? `"${s.replace(/"/g, '""')}"` : s;
}

// ---- labelled flat export (one row per data point) ------------------------

interface FlatRow {
  section: string;
  code: string;
  question: string;
  period: string;
  row: string;
  column: string;
  value: string;
  unit: string;
}

const HELPER_COLS = new Set(["param", "unit", "segment", "metric", "benefit", "source", "location", "aspect", "category", "type"]);

function scalarText(v: unknown): string {
  if (v == null || v === "") return "";
  if (typeof v === "boolean") return v ? "Yes" : "No";
  return String(v);
}

function flatForQuestion(q: QuestionDef, value: unknown, push: (r: Omit<FlatRow, "section" | "code" | "question">) => void): void {
  if (value == null) return;
  const val = value as Record<string, unknown>;

  if (q.kind === "narrative") {
    const t = (val as { text?: string }).text;
    if (t) push({ period: "", row: "", column: "", value: t, unit: "" });
    return;
  }
  if (q.kind === "boolean") {
    const b = val as { value?: boolean | null; detail?: string };
    if (b.value != null) push({ period: "", row: "", column: "Answer", value: b.value ? "Yes" : "No", unit: "" });
    if (b.detail) push({ period: "", row: "", column: "Details", value: b.detail, unit: "" });
    return;
  }
  if (q.kind === "fields") {
    for (const f of q.fields ?? []) {
      const v = val[f.key];
      if (v != null && v !== "") push({ period: "", row: "", column: f.label, value: scalarText(v), unit: f.unit ?? "" });
    }
    return;
  }
  if (q.kind === "principleGrid") {
    for (const p of ["P1", "P2", "P3", "P4", "P5", "P6", "P7", "P8", "P9"]) {
      const v = val[p];
      if (v != null && v !== "") push({ period: "", row: p, column: "", value: scalarText(v), unit: "" });
    }
    return;
  }
  if (q.kind === "table" && q.table) flatTable(q.table, val, push);
}

function flatTable(table: TableDef, val: Record<string, unknown>, push: (r: Omit<FlatRow, "section" | "code" | "question">) => void): void {
  const dataCols = table.columns.filter((c) => !HELPER_COLS.has(c.key));
  const fixed = (cells: Record<string, RowValues>, period: string) => {
    for (const r of table.rows ?? []) {
      const rc = cells[r.key] ?? {};
      const unit = scalarText(rc["unit"]);
      for (const c of dataCols) {
        const v = rc[c.key];
        if (v != null && v !== "") push({ period, row: r.label, column: c.label, value: scalarText(v), unit: unit || c.unit || "" });
      }
    }
  };
  const dynamic = (list: RowValues[], period: string) => {
    list.forEach((rc, i) => {
      const unit = scalarText(rc["unit"]);
      for (const c of dataCols) {
        const v = rc[c.key];
        if (v != null && v !== "") push({ period, row: `Item ${i + 1}`, column: c.label, value: scalarText(v), unit: unit || c.unit || "" });
      }
    });
  };
  if (table.perPeriod) {
    if (table.dynamic) {
      dynamic((val.current as RowValues[]) ?? [], "Current FY");
      dynamic((val.previous as RowValues[]) ?? [], "Previous FY");
    } else {
      fixed((val.current as Record<string, RowValues>) ?? {}, "Current FY");
      fixed((val.previous as Record<string, RowValues>) ?? {}, "Previous FY");
    }
  } else if (table.dynamic) {
    dynamic((val.list as RowValues[]) ?? [], "");
  } else {
    fixed((val.rows as Record<string, RowValues>) ?? {}, "");
  }
}

/** Every entered data point as a flat, labelled CSV (mirrors the input tables). */
export function buildFlatCsv(responses: ResponseMap): string {
  const header = ["Section", "Question code", "Question", "Period", "Row", "Column", "Value", "Unit"];
  const rows: string[][] = [header];
  for (const q of allQuestions()) {
    const section = moduleForQuestion(q.key)?.navLabel ?? "";
    flatForQuestion(q, responses[q.key], (r) => {
      rows.push([section, q.code ?? q.key, q.title, r.period, r.row, r.column, r.value, r.unit]);
    });
  }
  return rows.map((r) => r.map(csvCell).join(",")).join("\n");
}

/** Same data as buildFlatCsv, split one CSV per module (admin structured export). */
export function buildSectionCsvs(responses: ResponseMap): { label: string; filename: string; csv: string }[] {
  const header = ["Question code", "Question", "Period", "Row", "Column", "Value", "Unit"];
  return BRSR.modules.map((m) => {
    const rows: string[][] = [header];
    for (const q of moduleQuestions(m)) {
      flatForQuestion(q, responses[q.key], (r) => {
        rows.push([q.code ?? q.key, q.title, r.period, r.row, r.column, r.value, r.unit]);
      });
    }
    const safeName = m.navLabel.replace(/[^a-zA-Z0-9 _-]/g, "").trim();
    return { label: m.navLabel, filename: `${safeName}.csv`, csv: rows.map((r) => r.map(csvCell).join(",")).join("\n") };
  });
}

// ---- prior-year carry-forward ---------------------------------------------

/**
 * Copy every per-period table's Current-FY data into its Previous-FY slot, so a
 * new report can start from last year's figures. Returns updated response
 * objects for the affected question keys (does not overwrite already-entered
 * previous-year data unless `overwrite` is true).
 */
export function carryCurrentToPrevious(responses: ResponseMap, overwrite = false): Record<string, unknown> {
  const updates: Record<string, unknown> = {};
  for (const q of allQuestions()) {
    if (q.kind !== "table" || !q.table?.perPeriod) continue;
    const v = responses[q.key] as { current?: unknown; previous?: unknown } | undefined;
    if (!v || v.current == null) continue;
    if (!overwrite && v.previous != null && JSON.stringify(v.previous) !== "{}" && JSON.stringify(v.previous) !== "[]") continue;
    updates[q.key] = { ...v, previous: JSON.parse(JSON.stringify(v.current)) };
  }
  return updates;
}

// ---- download helper ------------------------------------------------------

export function downloadText(filename: string, text: string, mime: string): void {
  downloadBlob(filename, new Blob([text], { type: mime }));
}

export function downloadBlob(filename: string, blob: Blob): void {
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  a.remove();
  URL.revokeObjectURL(url);
}
