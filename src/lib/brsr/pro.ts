"use client";

import { getSupabase } from "@/lib/supabase/client";

/** Data access for the workflow, audit trail and team-member features. */

export type SectionState = "not_started" | "in_progress" | "submitted" | "approved" | "needs_changes";

export interface SectionStatus {
  id: string;
  report_id: string;
  module_key: string;
  assignee_email: string | null;
  state: SectionState;
  reviewer_comment: string | null;
  updated_at: string;
}

export interface AuditEntry {
  id: string;
  report_id: string;
  question_key: string;
  actor_email: string | null;
  value: unknown;
  created_at: string;
}

export interface Member {
  id: string;
  company_id: string;
  email: string;
  user_id: string | null;
  role: string;
  created_at: string;
}

function db() {
  const supabase = getSupabase();
  if (!supabase) throw new Error("Supabase is not configured.");
  return supabase;
}

// ---- audit ----------------------------------------------------------------

export async function logAudit(reportId: string, questionKey: string, actorEmail: string | null, value: unknown): Promise<void> {
  // Best-effort; never block data entry on an audit write.
  try {
    await db().from("brsr_audit").insert({ report_id: reportId, question_key: questionKey, actor_email: actorEmail, value });
  } catch {
    /* ignore */
  }
}

export async function fetchAudit(reportId: string, questionKey?: string, limit = 100): Promise<AuditEntry[]> {
  let q = db().from("brsr_audit").select("*").eq("report_id", reportId).order("created_at", { ascending: false }).limit(limit);
  if (questionKey) q = q.eq("question_key", questionKey);
  const { data, error } = await q;
  if (error) throw error;
  return (data as AuditEntry[]) ?? [];
}

// ---- section status -------------------------------------------------------

export async function fetchSectionStatuses(reportId: string): Promise<Record<string, SectionStatus>> {
  const { data, error } = await db().from("brsr_section_status").select("*").eq("report_id", reportId);
  if (error) throw error;
  const map: Record<string, SectionStatus> = {};
  for (const s of (data as SectionStatus[]) ?? []) map[s.module_key] = s;
  return map;
}

export async function upsertSectionStatus(
  reportId: string,
  moduleKey: string,
  patch: Partial<Pick<SectionStatus, "assignee_email" | "state" | "reviewer_comment">>,
): Promise<SectionStatus> {
  const { data, error } = await db()
    .from("brsr_section_status")
    .upsert(
      { report_id: reportId, module_key: moduleKey, ...patch, updated_at: new Date().toISOString() },
      { onConflict: "report_id,module_key" },
    )
    .select("*")
    .single();
  if (error) throw error;
  return data as SectionStatus;
}

// ---- per-KPI status (state machine) ---------------------------------------

export type KpiState =
  | "not_started" | "in_progress" | "data_entered" | "evidence_attached"
  | "validated" | "assurance_ready" | "needs_changes" | "not_applicable";

export interface KpiStatus {
  id: string;
  report_id: string;
  question_key: string;
  status: KpiState;
  assignee_email: string | null;
  validated_by: string | null;
  validated_at: string | null;
  note: string | null;
  updated_at: string;
}

export async function fetchKpiStatuses(reportId: string): Promise<Record<string, KpiStatus>> {
  const { data, error } = await db().from("brsr_kpi_status").select("*").eq("report_id", reportId);
  if (error) throw error;
  const map: Record<string, KpiStatus> = {};
  for (const s of (data as KpiStatus[]) ?? []) map[s.question_key] = s;
  return map;
}

export async function upsertKpiStatus(
  reportId: string,
  questionKey: string,
  patch: Partial<Pick<KpiStatus, "status" | "assignee_email" | "validated_by" | "validated_at" | "note">>,
): Promise<KpiStatus> {
  const { data, error } = await db()
    .from("brsr_kpi_status")
    .upsert(
      { report_id: reportId, question_key: questionKey, ...patch, updated_at: new Date().toISOString() },
      { onConflict: "report_id,question_key" },
    )
    .select("*")
    .single();
  if (error) throw error;
  return data as KpiStatus;
}

// ---- members --------------------------------------------------------------

export async function fetchMembers(companyId: string): Promise<Member[]> {
  const { data, error } = await db().from("company_members").select("*").eq("company_id", companyId).order("created_at");
  if (error) throw error;
  return (data as Member[]) ?? [];
}

export async function addMember(companyId: string, email: string, role: string): Promise<Member> {
  const { data, error } = await db()
    .from("company_members")
    .insert({ company_id: companyId, email: email.trim().toLowerCase(), role })
    .select("*")
    .single();
  if (error) throw error;
  return data as Member;
}

export async function removeMember(id: string): Promise<void> {
  const { error } = await db().from("company_members").delete().eq("id", id);
  if (error) throw error;
}

/** After sign-in, link any membership invitations addressed to this email. */
export async function claimMemberships(email: string): Promise<void> {
  const supabase = getSupabase();
  if (!supabase) return;
  const { data: userRes } = await supabase.auth.getUser();
  const uid = userRes.user?.id;
  if (!uid) return;
  try {
    await supabase.from("company_members").update({ user_id: uid }).eq("email", email.toLowerCase()).is("user_id", null);
  } catch {
    /* ignore */
  }
}
