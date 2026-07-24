"use client";

import { useRef, useState } from "react";
import type { Company } from "@/lib/tool/types";
import { listEvidence, type BrsrReport, type ResponseMap } from "@/lib/brsr/db";
import {
  buildJson, parseJson, buildXml, buildCsvTemplate, buildFlatCsv, carryCurrentToPrevious, downloadText, downloadBlob,
} from "@/lib/brsr/exporters";
import { buildXbrlInstance, buildMappingCsv } from "@/lib/brsr/xbrl";
import { buildIntensityUpdates } from "@/lib/brsr/intensity";
import { buildStructuredZip } from "@/lib/brsr/adminExport";

/**
 * Data portability: export the report (JSON backup, XBRL-style XML, CSV
 * dictionary), import a JSON snapshot, and carry current-year figures into the
 * previous-year columns. Raw data exports are ESGEN-staff-only; clients keep
 * only the released report document (BrsrExport) and the utility actions here.
 */
export function BrsrTools({
  report, company, responses, onApplyUpdates, isAdmin,
}: {
  report: BrsrReport;
  company: Company;
  responses: ResponseMap;
  onApplyUpdates: (updates: Record<string, unknown>) => Promise<void>;
  isAdmin: boolean;
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

  const onXbrl = () => {
    const res = buildXbrlInstance(company, report, responses);
    if (res.factCount === 0) {
      setNote("No quantitative BRSR Core data to export yet. Fill Principle 6 in Collect first.");
      return;
    }
    downloadText(`brsr-${fy}-instance.xbrl.xml`, res.xml, "application/xml");
    setNote(
      `XBRL instance exported: ${res.factCount} facts against ${res.mappedCount} SEBI BRSR taxonomy concepts ` +
      `(in-capmkt, DCYMain/DPYMain contexts, taxonomy units)` +
      (res.extensionElements.length ? `, plus ${res.extensionElements.length} extension concepts` : "") +
      `. Validate with the BSE/NSE XBRL utility before filing.`,
    );
  };

  const onIntensities = async () => {
    setBusy(true);
    setNote(null);
    try {
      const { updates, filled } = buildIntensityUpdates(responses, report);
      if (filled === 0) {
        setNote("Nothing to compute. Enter totals (energy, water, waste, GHG) in Collect and set the report's turnover first.");
      } else {
        await onApplyUpdates(updates);
        setNote(`Filled ${filled} intensity blocks (per rupee of turnover${report.ppp_factor ? " + PPP-adjusted" : ""}) from your totals and turnover.`);
      }
    } catch (err) {
      setNote(err instanceof Error ? err.message : "Could not compute intensities.");
    } finally {
      setBusy(false);
    }
  };

  const onZipAll = async () => {
    setBusy(true);
    setNote("Building archive (fetching every uploaded file, this can take a moment)...");
    try {
      const evidence = await listEvidence(report.id);
      const blob = await buildStructuredZip(company, report, responses, evidence);
      downloadBlob(`brsr-${fy}-full-export.zip`, blob);
      setNote(`Downloaded everything: all answers by section, plus ${evidence.length} uploaded file${evidence.length === 1 ? "" : "s"}.`);
    } catch (err) {
      setNote(err instanceof Error ? err.message : "Could not build the archive.");
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
      <p className="mt-1 text-xs text-text-muted">
        {isAdmin
          ? "Back up, move, and format the report. The XBRL instance is a structured XBRL 2.1 document of your BRSR Core figures (CY/PY contexts, typed units); validate it with the BSE/NSE XBRL utility before filing."
          : "Move data in, or roll figures forward into a new year. Raw data exports are handled by ESGEN; your released report document is available once it's reviewed."}
      </p>
      <div className="mt-4 flex flex-wrap gap-2">
        {isAdmin && (
          <>
            <ToolButton onClick={() => downloadText(`brsr-${fy}-data.csv`, buildFlatCsv(responses), "text/csv")}>Export all data (CSV)</ToolButton>
            <ToolButton onClick={() => downloadText(`brsr-${fy}.json`, buildJson(report, responses), "application/json")}>Export JSON (backup)</ToolButton>
            <ToolButton onClick={onXbrl}>Export XBRL instance</ToolButton>
            <ToolButton onClick={() => downloadText(`brsr-xbrl-mapping.csv`, buildMappingCsv(), "text/csv")}>XBRL mapping report</ToolButton>
            <ToolButton onClick={() => downloadText(`brsr-${fy}.xml`, buildXml(company, report, responses), "application/xml")}>Export XBRL-style XML</ToolButton>
            <ToolButton onClick={() => downloadText(`brsr-data-dictionary.csv`, buildCsvTemplate(), "text/csv")}>Export CSV template</ToolButton>
            <ToolButton onClick={onZipAll} disabled={busy}>Download everything (ZIP, incl. files)</ToolButton>
          </>
        )}
        <ToolButton onClick={() => fileRef.current?.click()} disabled={busy}>Import JSON</ToolButton>
        <ToolButton onClick={onCarry} disabled={busy}>Carry forward to previous year</ToolButton>
        <ToolButton onClick={onIntensities} disabled={busy}>Auto-compute intensity rows</ToolButton>
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
