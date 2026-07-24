"use client";

import JSZip from "jszip";
import { BRSR, moduleForQuestion } from "@/lib/brsr/framework";
import { buildJson, buildSectionCsvs } from "@/lib/brsr/exporters";
import { evidenceUrl, type BrsrReport, type EvidenceFile, type ResponseMap } from "@/lib/brsr/db";
import type { Company } from "@/lib/tool/types";

/**
 * Admin-only: one ZIP containing every answer AND every uploaded file,
 * organised section-by-section (Section A, Section B, Principle 1-9) so a
 * reviewer can work through it the same way the tool is navigated.
 */
export async function buildStructuredZip(
  company: Company,
  report: BrsrReport,
  responses: ResponseMap,
  evidence: EvidenceFile[],
): Promise<Blob> {
  const zip = new JSZip();
  const sections = buildSectionCsvs(responses);
  const evidenceByModule = new Map<string, EvidenceFile[]>();
  for (const file of evidence) {
    const mod = moduleForQuestion(file.question_key);
    const key = mod?.key ?? "__unmatched__";
    const list = evidenceByModule.get(key) ?? [];
    list.push(file);
    evidenceByModule.set(key, list);
  }

  zip.file(
    "README.txt",
    [
      `ESGen BRSR structured export`,
      `Company: ${company.name}`,
      `Financial year: ${report.financial_year}`,
      `Generated: ${new Date().toISOString()}`,
      ``,
      `Each numbered folder is one section/principle of the BRSR framework.`,
      `Inside each folder: data.csv (that section's entered answers) and an`,
      `evidence/ subfolder with the files the client uploaded for that section.`,
      `report-backup.json is a lossless snapshot of every answer (re-importable in the tool).`,
    ].join("\n"),
  );
  zip.file("report-backup.json", buildJson(report, responses));

  for (let i = 0; i < BRSR.modules.length; i++) {
    const mod = BRSR.modules[i];
    const section = sections[i];
    const folderName = `${String(i + 1).padStart(2, "0")} ${section.label}`.replace(/[\\/]/g, "-");
    const folder = zip.folder(folderName);
    if (!folder) continue;
    folder.file("data.csv", section.csv);

    const files = evidenceByModule.get(mod.key) ?? [];
    if (files.length === 0) continue;
    const evidenceFolder = folder.folder("evidence");
    if (!evidenceFolder) continue;
    for (const file of files) {
      const url = await evidenceUrl(file.file_path);
      if (!url) continue;
      try {
        const res = await fetch(url);
        if (!res.ok) continue;
        const blob = await res.blob();
        evidenceFolder.file(`${file.question_key}_${file.file_name}`, blob);
      } catch {
        // Skip files that fail to fetch rather than aborting the whole export.
      }
    }
  }

  const unmatched = evidenceByModule.get("__unmatched__") ?? [];
  if (unmatched.length > 0) {
    const folder = zip.folder("Unmatched evidence");
    if (folder) {
      for (const file of unmatched) {
        const url = await evidenceUrl(file.file_path);
        if (!url) continue;
        try {
          const res = await fetch(url);
          if (!res.ok) continue;
          folder.file(`${file.question_key}_${file.file_name}`, await res.blob());
        } catch {
          // Skip.
        }
      }
    }
  }

  return zip.generateAsync({ type: "blob" });
}
