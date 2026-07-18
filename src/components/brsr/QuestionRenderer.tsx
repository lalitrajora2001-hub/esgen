"use client";

import { Fragment } from "react";
import type { ColumnDef, QuestionDef, TableDef } from "@/lib/brsr/types";
import type { EvidenceFile } from "@/lib/brsr/db";
import {
  evalDerived, num, type RowValues, type Scalar,
} from "@/lib/brsr/calc";
import { ScalarInput } from "@/components/brsr/Inputs";
import { EvidenceUploader } from "@/components/brsr/EvidenceUploader";
import { coreGuide } from "@/lib/brsr/coreGuidance";

const PRINCIPLES = ["P1", "P2", "P3", "P4", "P5", "P6", "P7", "P8", "P9"];

/** Leading text columns in fixed-row tables that merely repeat the row label. */
const LABEL_DUP_COLS = new Set([
  "param", "segment", "metric", "benefit",
  "source", "location", "aspect", "category", "type",
]);

type V = Record<string, unknown>;

export function QuestionRenderer({
  q,
  value,
  onChange,
  reportId,
  evidence,
  onEvidenceChange,
}: {
  q: QuestionDef;
  value: unknown;
  onChange: (v: unknown) => void;
  reportId: string;
  evidence: EvidenceFile[];
  onEvidenceChange: (files: EvidenceFile[]) => void;
}) {
  const val = (value ?? {}) as V;

  return (
    <div className="card p-5">
      <div className="flex flex-wrap items-center gap-2">
        {q.code && <span className="rounded bg-surface-2 px-2 py-0.5 text-[11px] font-medium text-text-muted">{q.code}</span>}
        {q.isCore && <span className="rounded bg-teal/10 px-2 py-0.5 text-[11px] font-medium text-teal">BRSR Core</span>}
        {q.indicator === "leadership" && <span className="rounded bg-surface-2 px-2 py-0.5 text-[11px] font-medium text-text-muted">Leadership</span>}
      </div>
      <h3 className="mt-2 text-sm font-medium leading-relaxed text-text">{q.title}</h3>
      {q.help && <p className="mt-1 text-xs text-text-muted">{q.help}</p>}

      {(() => {
        const guide = coreGuide(q.key);
        if (!guide) return null;
        return (
          <details className="mt-2 rounded-lg border border-border bg-surface-2/50 text-xs">
            <summary className="cursor-pointer px-3 py-2 font-medium text-accent">Definition &amp; worked example</summary>
            <div className="space-y-2 px-3 pb-3">
              <p><span className="font-medium text-text">What to enter: </span><span className="text-text-muted">{guide.definition}</span></p>
              <p><span className="font-medium text-text">Example: </span><span className="text-text-muted">{guide.example}</span></p>
            </div>
          </details>
        );
      })()}

      <div className="mt-4">
        {q.kind === "fields" && <FieldsEditor q={q} val={val} onChange={onChange} />}
        {q.kind === "boolean" && <BooleanEditor q={q} val={val} onChange={onChange} />}
        {q.kind === "narrative" && <NarrativeEditor val={val} onChange={onChange} />}
        {q.kind === "principleGrid" && <GridEditor q={q} val={val} onChange={onChange} />}
        {q.kind === "table" && q.table && <TableEditor table={q.table} val={val} onChange={onChange} />}
      </div>

      {q.assuranceNote && (
        <div className="mt-3 rounded-lg border border-border bg-surface-2/40 p-3">
          <p className="mb-2 text-xs text-text-muted">
            Independent assessment / evaluation / assurance carried out by an external agency?
          </p>
          <div className="flex flex-wrap items-center gap-3">
            <div className="w-32">
              <ScalarInput
                type="boolean"
                value={(val._assuranceDone as Scalar) ?? null}
                onChange={(v) => onChange({ ...val, _assuranceDone: v })}
                ariaLabel="External assessment carried out"
              />
            </div>
            <div className="min-w-[200px] flex-1">
              <ScalarInput
                type="text"
                value={(val._assuranceAgency as Scalar) ?? null}
                onChange={(v) => onChange({ ...val, _assuranceAgency: v })}
                placeholder="If yes, name of the external agency"
                ariaLabel="Name of the external agency"
              />
            </div>
          </div>
        </div>
      )}

      {q.evidence && (
        <EvidenceUploader
          reportId={reportId}
          questionKey={q.key}
          hint={q.evidenceHint}
          files={evidence}
          onChange={onEvidenceChange}
        />
      )}
    </div>
  );
}

// ---- fields ---------------------------------------------------------------

function FieldsEditor({ q, val, onChange }: { q: QuestionDef; val: V; onChange: (v: unknown) => void }) {
  const get = (k: string): Scalar => (val[k] as Scalar) ?? null;
  const set = (k: string, v: Scalar) => onChange({ ...val, [k]: v });
  return (
    <div className="grid gap-4 sm:grid-cols-2">
      {q.fields?.map((f) => {
        const derived = f.derived ? evalDerived(f.derived, get) : null;
        return (
          <label key={f.key} className="flex flex-col gap-1.5">
            <span className="text-xs text-text-muted">{f.label}{f.optional ? " (optional)" : ""}</span>
            {f.derived ? (
              <div className="rounded-lg border border-border bg-surface-2/60 px-3 py-2 text-sm">{derived == null ? "—" : round(derived)}</div>
            ) : (
              <ScalarInput type={f.type} value={get(f.key)} onChange={(v) => set(f.key, v)} options={f.options} unit={f.unit} ariaLabel={f.label} />
            )}
            {f.help && <span className="text-[11px] text-text-muted">{f.help}</span>}
          </label>
        );
      })}
    </div>
  );
}

// ---- boolean --------------------------------------------------------------

function BooleanEditor({ q, val, onChange }: { q: QuestionDef; val: V; onChange: (v: unknown) => void }) {
  const b = val as { value?: boolean | null; detail?: string };
  return (
    <div className="space-y-3">
      <div className="max-w-[160px]">
        <ScalarInput type="boolean" value={b.value ?? null} onChange={(v) => onChange({ ...b, value: v })} ariaLabel={q.title} />
      </div>
      {q.booleanDetail && (
        <label className="flex flex-col gap-1.5">
          <span className="text-xs text-text-muted">{q.booleanDetail}</span>
          <ScalarInput type="longtext" value={b.detail ?? ""} onChange={(v) => onChange({ ...b, detail: v })} ariaLabel={q.booleanDetail} />
        </label>
      )}
    </div>
  );
}

// ---- narrative ------------------------------------------------------------

function NarrativeEditor({ val, onChange }: { val: V; onChange: (v: unknown) => void }) {
  const t = (val as { text?: string }).text ?? "";
  return <ScalarInput type="longtext" value={t} onChange={(v) => onChange({ text: v })} ariaLabel="Response" />;
}

// ---- principle grid -------------------------------------------------------

function GridEditor({ q, val, onChange }: { q: QuestionDef; val: V; onChange: (v: unknown) => void }) {
  const cell = q.gridCell ?? { type: "text" as const };
  return (
    <div className="overflow-x-auto">
      <table className="w-full text-sm">
        <tbody>
          {PRINCIPLES.map((p) => (
            <tr key={p} className="border-b border-border/60 last:border-0">
              <td className="py-2 pr-3 font-mono text-xs text-text-muted">{p}</td>
              <td className="py-2">
                <ScalarInput
                  type={cell.type}
                  options={cell.options}
                  value={(val[p] as Scalar) ?? null}
                  onChange={(v) => onChange({ ...val, [p]: v })}
                  ariaLabel={`${q.title} ${p}`}
                />
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

// ---- tables ---------------------------------------------------------------

function TableEditor({ table, val, onChange }: { table: TableDef; val: V; onChange: (v: unknown) => void }) {
  if (table.perPeriod) {
    const cur = val.current ?? (table.dynamic ? [] : {});
    const prev = val.previous ?? (table.dynamic ? [] : {});
    return (
      <div className="space-y-5">
        <PeriodBlock label="Current financial year" table={table} data={cur} onChange={(d) => onChange({ ...val, current: d })} />
        <PeriodBlock label="Previous financial year" table={table} data={prev} onChange={(d) => onChange({ ...val, previous: d })} />
      </div>
    );
  }
  if (table.dynamic) {
    const list = (val.list as RowValues[]) ?? [];
    return <DynamicTable table={table} list={list} onChange={(l) => onChange({ list: l })} />;
  }
  const rows = (val.rows as Record<string, RowValues>) ?? {};
  return <FixedTable table={table} rows={rows} onChange={(r) => onChange({ rows: r })} />;
}

function PeriodBlock({ label, table, data, onChange }: { label: string; table: TableDef; data: unknown; onChange: (d: unknown) => void }) {
  return (
    <div>
      <p className="mb-2 text-xs font-medium uppercase tracking-wide text-text-muted">{label}</p>
      {table.dynamic ? (
        <DynamicTable table={table} list={(data as RowValues[]) ?? []} onChange={onChange} />
      ) : (
        <FixedTable table={table} rows={(data as Record<string, RowValues>) ?? {}} onChange={onChange} />
      )}
    </div>
  );
}

function derivedCell(col: ColumnDef, row: RowValues): number | null {
  if (!col.derived) return null;
  return evalDerived(col.derived, (k) => row[k] ?? null);
}

function FixedTable({ table, rows, onChange }: { table: TableDef; rows: Record<string, RowValues>; onChange: (r: Record<string, RowValues>) => void }) {
  const setCell = (rowKey: string, colKey: string, v: Scalar) => {
    onChange({ ...rows, [rowKey]: { ...(rows[rowKey] ?? {}), [colKey]: v } });
  };
  let lastGroup: string | undefined;
  // In fixed-row tables the row label already states the parameter/segment, so
  // a leading label-duplicating text column would just repeat it. Hide it.
  const cols = table.columns.filter((c) => !LABEL_DUP_COLS.has(c.key));
  return (
    <div className="overflow-x-auto">
      <table className="w-full border-collapse text-sm">
        <thead>
          <tr className="border-b border-border text-left text-xs text-text-muted">
            <th className="py-2 pr-3 font-medium">Row</th>
            {cols.map((c) => (
              <th key={c.key} className="px-2 py-2 font-medium">{c.label}{c.unit ? ` (${c.unit})` : ""}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {table.rows?.map((r) => {
            const showGroup = r.group && r.group !== lastGroup;
            lastGroup = r.group;
            const rowVals = rows[r.key] ?? {};
            return (
              <Fragment key={r.key}>
                {showGroup && (
                  <tr><td colSpan={cols.length + 1} className="pt-3 pb-1 text-xs font-semibold text-accent-3">{r.group}</td></tr>
                )}
                <tr className="border-b border-border/50 last:border-0 align-top">
                  <td className="py-2 pr-3 text-text-muted">{r.label}</td>
                  {cols.map((c) => (
                    <td key={c.key} className="px-2 py-1.5">
                      {c.derived ? (
                        <div className="rounded-lg border border-border bg-surface-2/60 px-2 py-1.5 text-xs">{fmt(derivedCell(c, rowVals))}</div>
                      ) : (
                        <ScalarInput type={c.type} options={c.options} value={rowVals[c.key] ?? null} onChange={(v) => setCell(r.key, c.key, v)} ariaLabel={`${r.label} ${c.label}`} />
                      )}
                    </td>
                  ))}
                </tr>
              </Fragment>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}

function DynamicTable({ table, list, onChange }: { table: TableDef; list: RowValues[]; onChange: (l: RowValues[]) => void }) {
  const setCell = (i: number, colKey: string, v: Scalar) => {
    const next = list.map((row, idx) => (idx === i ? { ...row, [colKey]: v } : row));
    onChange(next);
  };
  const addRow = () => onChange([...list, {}]);
  const removeRow = (i: number) => onChange(list.filter((_, idx) => idx !== i));
  return (
    <div>
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-border text-left text-xs text-text-muted">
              {table.columns.map((c) => (
                <th key={c.key} className="px-2 py-2 font-medium">{c.label}{c.unit ? ` (${c.unit})` : ""}</th>
              ))}
              <th className="w-8" />
            </tr>
          </thead>
          <tbody>
            {list.length === 0 && (
              <tr><td colSpan={table.columns.length + 1} className="py-3 text-xs text-text-muted">No rows yet.</td></tr>
            )}
            {list.map((row, i) => (
              <tr key={i} className="border-b border-border/50 last:border-0 align-top">
                {table.columns.map((c) => (
                  <td key={c.key} className="px-2 py-1.5">
                    {c.derived ? (
                      <div className="rounded-lg border border-border bg-surface-2/60 px-2 py-1.5 text-xs">{fmt(derivedCell(c, row))}</div>
                    ) : (
                      <ScalarInput type={c.type} options={c.options} value={row[c.key] ?? null} onChange={(v) => setCell(i, c.key, v)} ariaLabel={c.label} />
                    )}
                  </td>
                ))}
                <td className="px-1 py-1.5">
                  <button onClick={() => removeRow(i)} aria-label="Remove row" className="text-text-muted hover:text-[#e5484d]">×</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <button onClick={addRow} className="mt-2 rounded-lg border border-border px-3 py-1.5 text-xs text-text transition hover:border-accent hover:bg-accent/8">
        {table.addLabel ?? "Add row"}
      </button>
    </div>
  );
}

function round(n: number): string {
  return Math.round(n * 100) / 100 + "";
}
function fmt(n: number | null): string {
  return n == null ? "—" : round(n);
}
