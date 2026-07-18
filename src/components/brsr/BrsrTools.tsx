"use client";

import { useRef, useState } from "react";
import type { Company } from "@/lib/tool/types";
import type { BrsrReport, ResponseMap } from "@/lib/brsr/db";
import {
  buildJson, parseJson, buildXml, buildCsvTemplate, buildFlatCsv, carryCurrentToPrevious, downloadText,
} from "@/lib/brsr/exporters";

/**
 * Data portability: export the report (JSON backup, XBRL-style XML, CSV
 * dictionary), import a JSON snapshot, and carry current-year figures into the
 * previous-year columns.
 */
export function BrsrTools({
  report, company, responses, onApplyUpdates,
}: {
  report: BrsrReport;
  company: Company;
  responses: ResponseMap;
  onApplyUpdates: (updates: Record<string, unknown>) => Promise<void>;
}) {
  const fileRef = useRef<HTMLInputElement>(null);
  const [note, setNote] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  const fy = report.financial_year.replace(/[^0-9-]/g, "") || "report";

  const onImport = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (fileRef.current) fileRef.current.value = "";
    if (!file) return;
    setBusy(true);
    setNote(null);
    try {
      const text = await file.text();
      const imported = parseJson(text);
      await onApplyUpdates(imported);
      setNote(`Imported ${Object.keys(imported).length} answers from ${file.name}.`);
    } catch (err) {
      setNote(err instanceof Error ? err.message : "Import failed.");
    } finally {
      setBusy(false);
    }
  };

  const onCarry = async () => {
    setBusy(true);
    setNote(null);
    try {
      const updates = carryCurrentToPrevious(responses);
      const n = Object.keys(updates).length;
      if (n === 0) {
        setNote("Nothing to carry forward (no current-year table data, or previous-year already filled).");
      } else {
        await onApplyUpdates(updates);
        setNote(`Carried current-year figures into the previous-year column for ${n} tables.`);
      }
    } catch (err) {
      setNote(err instanceof Error ? err.message : "Carry-forward failed.");
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="card p-6">
      <h3 className="font-display text-base font-semibold">Data &amp; export</h3>
      <p className="mt-1 text-xs text-text-muted">Back up, move, and format the report. XBRL export uses ESGen keys ready to remap to SEBI&apos;s official taxonomy; it is not a filing-valid iXBRL.</p>
      <div className="mt-4 flex flex-wrap gap-2">
        <ToolButton onClick={() => downloadText(`brsr-${fy}-data.csv`, buildFlatCsv(responses), "text/csv")}>Export all data (CSV)</ToolButton>
        <ToolButton onClick={() => downloadText(`brsr-${fy}.json`, buildJson(report, responses), "application/json")}>Export JSON (backup)</ToolButton>
        <ToolButton onClick={() => downloadText(`brsr-${fy}.xml`, buildXml(company, report, responses), "application/xml")}>Export XBRL-style XML</ToolButton>
        <ToolButton onClick={() => downloadText(`brsr-data-dictionary.csv`, buildCsvTemplate(), "text/csv")}>Export CSV template</ToolButton>
        <ToolButton onClick={() => fileRef.current?.click()} disabled={busy}>Import JSON</ToolButton>
        <ToolButton onClick={onCarry} disabled={busy}>Carry forward to previous year</ToolButton>
        <input ref={fileRef} type="file" accept="application/json,.json" className="hidden" onChange={onImport} />
      </div>
      {note && <p className="mt-3 rounded-lg border border-border bg-surface-2/60 p-2.5 text-xs text-text-muted">{note}</p>}
    </div>
  );
}

function ToolButton({ children, onClick, disabled }: { children: React.ReactNode; onClick: () => void; disabled?: boolean }) {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className="rounded-lg border border-border px-3 py-2 text-xs text-text transition hover:border-accent hover:bg-accent/8 disabled:opacity-50"
    >
      {children}
    </button>
  );
}
