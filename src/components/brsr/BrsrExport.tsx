"use client";

import type { Company } from "@/lib/tool/types";
import type { BrsrReport, EvidenceFile, ResponseMap } from "@/lib/brsr/db";
import type { ColumnDef, QuestionDef, TableDef } from "@/lib/brsr/types";
import { BRSR } from "@/lib/brsr/framework";
import { evalDerived, computeCoreKpis, type RowValues, type Scalar } from "@/lib/brsr/calc";
import { Button } from "@/components/ui/Button";

const PRINCIPLES = ["P1", "P2", "P3", "P4", "P5", "P6", "P7", "P8", "P9"];

export function BrsrExport({
  report, company, responses, evidence, onBack,
}: {
  report: BrsrReport;
  company: Company;
  responses: ResponseMap;
  evidence: EvidenceFile[];
  onBack: () => void;
}) {
  const kpis = computeCoreKpis(responses, report);

  return (
    <div>
      <div className="no-print mb-4 flex items-center justify-between">
        <Button variant="ghost" onClick={onBack}>Back to editor</Button>
        <Button onClick={() => window.print()}>Print / save as PDF</Button>
      </div>

      <article className="print-sheet mx-auto max-w-4xl rounded-2xl bg-white p-8 text-slate-800 shadow-float sm:p-12">
        <header className="border-b border-slate-200 pb-6">
          <p className="text-xs font-semibold uppercase tracking-widest text-blue-600">Business Responsibility &amp; Sustainability Report</p>
          <h1 className="mt-1 font-display text-2xl font-semibold text-slate-900">{company.name}</h1>
          <p className="mt-1 text-sm text-slate-500">Financial year {report.financial_year} · {report.reporting_boundary} · Prepared with ESGen</p>
        </header>

        <div className="mt-6 rounded-lg border border-amber-300 bg-amber-50 p-4 text-sm text-amber-900">
          <strong>Draft prepared from entered data, not a filed report.</strong> Figures and disclosures are as entered
          and are indicative. Confirm against SEBI&apos;s current BRSR format, and obtain assessment / assurance where
          required, before any filing.
        </div>

        {kpis.length > 0 && (
          <section className="mt-8">
            <h2 className="font-display text-lg font-semibold text-slate-900">BRSR Core KPIs (computed)</h2>
            <table className="mt-2 w-full text-sm">
              <tbody>
                {kpis.map((k) => (
                  <tr key={k.label} className="border-b border-slate-100">
                    <td className="py-2 text-slate-600">{k.label}</td>
                    <td className="py-2 text-right font-mono text-slate-900">{k.value == null ? "—" : k.value.toExponential(3)} {k.unit}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </section>
        )}

        {BRSR.modules.map((m) => (
          <section key={m.key} className="mt-10">
            <h2 className="border-b-2 border-slate-300 pb-1 font-display text-lg font-semibold text-slate-900">{m.title}</h2>
            {m.subsections.map((sub) => (
              <div key={sub.key} className="mt-4">
                <h3 className="text-sm font-semibold text-slate-700">{sub.title}</h3>
                <div className="mt-2 space-y-4">
                  {sub.questions.map((q) => (
                    <div key={q.key} className="break-inside-avoid">
                      <p className="text-sm font-medium text-slate-800">
                        {q.code ? <span className="mr-2 font-mono text-xs text-slate-400">{q.code}</span> : null}
                        {q.title}
                        {q.isCore ? <span className="ml-2 rounded bg-teal-100 px-1.5 text-[10px] text-teal-700">Core</span> : null}
                      </p>
                      <div className="mt-1 text-sm text-slate-700">
                        <AnswerView q={q} value={responses[q.key]} />
                      </div>
                      <EvidenceList files={evidence.filter((e) => e.question_key === q.key)} />
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </section>
        ))}
      </article>
    </div>
  );
}

function EvidenceList({ files }: { files: EvidenceFile[] }) {
  if (files.length === 0) return null;
  return (
    <p className="mt-1 text-xs text-slate-500">
      Evidence: {files.map((f) => f.file_name).join(", ")}
    </p>
  );
}

function AnswerView({ q, value }: { q: QuestionDef; value: unknown }) {
  const val = (value ?? {}) as Record<string, unknown>;
  const empty = <span className="text-slate-400">Not provided</span>;

  if (q.kind === "narrative") {
    const t = (val as { text?: string }).text;
    return t ? <p className="whitespace-pre-wrap">{t}</p> : empty;
  }
  if (q.kind === "boolean") {
    const b = val as { value?: boolean | null; detail?: string };
    if (b.value == null && !b.detail) return empty;
    return <p>{b.value === true ? "Yes" : b.value === false ? "No" : "—"}{b.detail ? `. ${b.detail}` : ""}</p>;
  }
  if (q.kind === "fields") {
    const get = (k: string): Scalar => (val[k] as Scalar) ?? null;
    const rows = q.fields?.filter((f) => (f.derived ? true : val[f.key] != null && val[f.key] !== ""));
    if (!rows || rows.length === 0) return empty;
    return (
      <ul className="space-y-0.5">
        {rows.map((f) => {
          const shown = f.derived ? disp(evalDerived(f.derived, get)) : disp(get(f.key));
          return <li key={f.key}><span className="text-slate-500">{f.label}:</span> {shown}</li>;
        })}
      </ul>
    );
  }
  if (q.kind === "principleGrid") {
    const g = val as Record<string, Scalar>;
    const filled = PRINCIPLES.filter((p) => g[p] != null && g[p] !== "");
    if (filled.length === 0) return empty;
    return (
      <table className="w-full text-xs">
        <tbody>
          {filled.map((p) => <tr key={p}><td className="w-10 py-0.5 font-mono text-slate-400">{p}</td><td className="py-0.5">{disp(g[p])}</td></tr>)}
        </tbody>
      </table>
    );
  }
  if (q.kind === "table" && q.table) {
    return <TableView table={q.table} val={val} />;
  }
  return empty;
}

function TableView({ table, val }: { table: TableDef; val: Record<string, unknown> }) {
  if (table.perPeriod) {
    return (
      <div className="space-y-2">
        <PeriodTable label="Current FY" table={table} data={val.current} />
        <PeriodTable label="Previous FY" table={table} data={val.previous} />
      </div>
    );
  }
  if (table.dynamic) return <RowsTable table={table} list={(val.list as RowValues[]) ?? []} />;
  return <FixedRows table={table} rows={(val.rows as Record<string, RowValues>) ?? {}} />;
}

function PeriodTable({ label, table, data }: { label: string; table: TableDef; data: unknown }) {
  return (
    <div>
      <p className="text-xs font-semibold text-slate-500">{label}</p>
      {table.dynamic
        ? <RowsTable table={table} list={(data as RowValues[]) ?? []} />
        : <FixedRows table={table} rows={(data as Record<string, RowValues>) ?? {}} />}
    </div>
  );
}

function cellDisplay(c: ColumnDef, row: RowValues): string {
  if (c.derived) return disp(evalDerived(c.derived, (k) => row[k] ?? null));
  return disp(row[c.key] ?? null);
}

function FixedRows({ table, rows }: { table: TableDef; rows: Record<string, RowValues> }) {
  const cols = table.columns.filter((c) => c.key !== "param");
  return (
    <table className="mt-1 w-full border border-slate-200 text-xs">
      <thead>
        <tr className="bg-slate-50 text-left">
          <th className="border border-slate-200 px-2 py-1">Row</th>
          {cols.map((c) => <th key={c.key} className="border border-slate-200 px-2 py-1">{c.label}</th>)}
        </tr>
      </thead>
      <tbody>
        {table.rows?.map((r) => (
          <tr key={r.key}>
            <td className="border border-slate-200 px-2 py-1 text-slate-600">{r.label}</td>
            {cols.map((c) => <td key={c.key} className="border border-slate-200 px-2 py-1">{cellDisplay(c, rows[r.key] ?? {})}</td>)}
          </tr>
        ))}
      </tbody>
    </table>
  );
}

function RowsTable({ table, list }: { table: TableDef; list: RowValues[] }) {
  if (list.length === 0) return <p className="text-slate-400">No rows</p>;
  return (
    <table className="mt-1 w-full border border-slate-200 text-xs">
      <thead>
        <tr className="bg-slate-50 text-left">
          {table.columns.map((c) => <th key={c.key} className="border border-slate-200 px-2 py-1">{c.label}</th>)}
        </tr>
      </thead>
      <tbody>
        {list.map((row, i) => (
          <tr key={i}>
            {table.columns.map((c) => <td key={c.key} className="border border-slate-200 px-2 py-1">{cellDisplay(c, row)}</td>)}
          </tr>
        ))}
      </tbody>
    </table>
  );
}

function disp(v: Scalar | number | null): string {
  if (v == null || v === "") return "—";
  if (typeof v === "boolean") return v ? "Yes" : "No";
  if (typeof v === "number") return String(Math.round(v * 1000) / 1000);
  return String(v);
}
