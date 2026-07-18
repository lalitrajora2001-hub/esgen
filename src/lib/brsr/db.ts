"use client";

import { getSupabase } from "@/lib/supabase/client";

/** Data-access layer for the BRSR module. RLS enforces ownership server-side. */

export interface BrsrReport {
  id: string;
  company_id: string;
  financial_year: string;
  framework_version: string;
  reporting_boundary: string;
  turnover: number | null;
  ppp_factor: number | null;
  status: string;
  created_at: string;
  updated_at: string;
}

export interface EvidenceFile {
  id: string;
  report_id: string;
  question_key: string;
  file_path: string;
  file_name: string;
  size: number | null;
  created_at: string;
}

/** A question's answer, shaped by the question kind (stored as JSONB). */
export type ResponseValue = unknown;
export type ResponseMap = Record<string, ResponseValue>;

const BUCKET = "brsr-evidence";

function db() {
  const supabase = getSupabase();
  if (!supabase) throw new Error("Supabase is not configured.");
  return supabase;
}

// ---- Reports --------------------------------------------------------------

export async function listReports(companyId: string): Promise<BrsrReport[]> {
  const { data, error } = await db()
    .from("brsr_reports")
    .select("*")
    .eq("company_id", companyId)
    .order("created_at", { ascending: false });
  if (error) throw error;
  return (data as BrsrReport[]) ?? [];
}

export async function createReport(input: {
  company_id: string;
  financial_year: string;
  reporting_boundary: string;
  turnover: number | null;
  ppp_factor: number | null;
}): Promise<BrsrReport> {
  const { data, error } = await db().from("brsr_reports").insert(input).select("*").single();
  if (error) throw error;
  return data as BrsrReport;
}

export async function updateReport(
  id: string,
  patch: Partial<Pick<BrsrReport, "reporting_boundary" | "turnover" | "ppp_factor" | "status" | "financial_year">>,
): Promise<BrsrReport> {
  const { data, error } = await db()
    .from("brsr_reports")
    .update({ ...patch, updated_at: new Date().toISOString() })
    .eq("id", id)
    .select("*")
    .single();
  if (error) throw error;
  return data as BrsrReport;
}

// ---- Responses ------------------------------------------------------------

export async function fetchResponses(reportId: string): Promise<ResponseMap> {
  const { data, error } = await db()
    .from("brsr_responses")
    .select("question_key,value")
    .eq("report_id", reportId);
  if (error) throw error;
  const map: ResponseMap = {};
  for (const row of (data as { question_key: string; value: ResponseValue }[]) ?? []) {
    map[row.question_key] = row.value;
  }
  return map;
}

export async function saveResponse(
  reportId: string,
  questionKey: string,
  value: ResponseValue,
): Promise<void> {
  const { error } = await db()
    .from("brsr_responses")
    .upsert(
      { report_id: reportId, question_key: questionKey, value, updated_at: new Date().toISOString() },
      { onConflict: "report_id,question_key" },
    );
  if (error) throw error;
}

// ---- Evidence -------------------------------------------------------------

export async function listEvidence(reportId: string): Promise<EvidenceFile[]> {
  const { data, error } = await db()
    .from("brsr_evidence")
    .select("*")
    .eq("report_id", reportId)
    .order("created_at", { ascending: false });
  if (error) throw error;
  return (data as EvidenceFile[]) ?? [];
}

export async function uploadEvidence(
  reportId: string,
  questionKey: string,
  file: File,
): Promise<EvidenceFile> {
  const supabase = db();
  const safeName = file.name.replace(/[^a-zA-Z0-9._-]/g, "_");
  const path = `${reportId}/${questionKey}/${Date.now()}_${safeName}`;
  const { error: upErr } = await supabase.storage.from(BUCKET).upload(path, file, { upsert: false });
  if (upErr) throw upErr;
  const { data, error } = await supabase
    .from("brsr_evidence")
    .insert({ report_id: reportId, question_key: questionKey, file_path: path, file_name: file.name, size: file.size })
    .select("*")
    .single();
  if (error) throw error;
  return data as EvidenceFile;
}

export async function deleteEvidence(file: EvidenceFile): Promise<void> {
  const supabase = db();
  await supabase.storage.from(BUCKET).remove([file.file_path]);
  const { error } = await supabase.from("brsr_evidence").delete().eq("id", file.id);
  if (error) throw error;
}

export async function evidenceUrl(path: string): Promise<string | null> {
  const { data, error } = await db().storage.from(BUCKET).createSignedUrl(path, 3600);
  if (error) return null;
  return data.signedUrl;
}
