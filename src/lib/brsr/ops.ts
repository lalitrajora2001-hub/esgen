"use client";

import { getSupabase } from "@/lib/supabase/client";
import type { Scope } from "@/lib/emissions/factors";

/**
 * Data access for workspace operations: the client's own emission-factor
 * library, organisation units (sites), and scheduled collection tasks.
 * Tables live in supabase/brsr_ops.sql; RLS enforces company membership.
 */

export interface CompanyFactor {
  id: string;
  company_id: string;
  activity: string;
  scope: Scope;
  unit: string;
  kgco2e_per_unit: number;
  co2_factor: number | null;
  ch4_factor: number | null;
  n2o_factor: number | null;
  valid_from: string | null;
  valid_to: string | null;
  source_label: string;
  source_url: string | null;
  note: string | null;
  created_at: string;
}

export interface OrgUnit {
  id: string;
  company_id: string;
  name: string;
  location: string | null;
  note: string | null;
  created_at: string;
}

export type TaskSchedule = "one_off" | "monthly" | "quarterly" | "annual";
export type TaskStatus = "open" | "submitted" | "done";

export interface CollectionTask {
  id: string;
  company_id: string;
  report_id: string | null;
  title: string;
  question_key: string | null;
  org_unit_id: string | null;
  assignee_email: string | null;
  schedule: TaskSchedule;
  period: string | null;
  due_date: string | null;
  status: TaskStatus;
  value: number | null;
  unit: string | null;
  note: string | null;
  created_at: string;
}

function db() {
  const supabase = getSupabase();
  if (!supabase) throw new Error("Supabase is not configured.");
  return supabase;
}

/** True when the brsr_ops.sql migration has not been run yet. */
export function isMissingTable(e: unknown): boolean {
  const msg = e instanceof Error ? e.message : String((e as { message?: string })?.message ?? e);
  return /relation .* does not exist|Could not find the table|schema cache/i.test(msg);
}

// ---- emission factors -----------------------------------------------------

export async function listCompanyFactors(companyId: string): Promise<CompanyFactor[]> {
  const { data, error } = await db()
    .from("company_emission_factors")
    .select("*")
    .eq("company_id", companyId)
    .order("scope")
    .order("activity");
  if (error) throw error;
  return (data as CompanyFactor[]) ?? [];
}

export async function addCompanyFactor(input: Omit<CompanyFactor, "id" | "created_at">): Promise<CompanyFactor> {
  const { data, error } = await db().from("company_emission_factors").insert(input).select("*").single();
  if (error) throw error;
  return data as CompanyFactor;
}

export async function updateCompanyFactor(id: string, patch: Partial<Omit<CompanyFactor, "id" | "company_id" | "created_at">>): Promise<CompanyFactor> {
  const { data, error } = await db()
    .from("company_emission_factors")
    .update({ ...patch, updated_at: new Date().toISOString() })
    .eq("id", id)
    .select("*")
    .single();
  if (error) throw error;
  return data as CompanyFactor;
}

export async function deleteCompanyFactor(id: string): Promise<void> {
  const { error } = await db().from("company_emission_factors").delete().eq("id", id);
  if (error) throw error;
}

// ---- org units ------------------------------------------------------------

export async function listOrgUnits(companyId: string): Promise<OrgUnit[]> {
  const { data, error } = await db().from("org_units").select("*").eq("company_id", companyId).order("name");
  if (error) throw error;
  return (data as OrgUnit[]) ?? [];
}

export async function addOrgUnit(companyId: string, name: string, location: string | null): Promise<OrgUnit> {
  const { data, error } = await db().from("org_units").insert({ company_id: companyId, name, location }).select("*").single();
  if (error) throw error;
  return data as OrgUnit;
}

export async function deleteOrgUnit(id: string): Promise<void> {
  const { error } = await db().from("org_units").delete().eq("id", id);
  if (error) throw error;
}

// ---- collection tasks -----------------------------------------------------

export async function listTasks(companyId: string): Promise<CollectionTask[]> {
  const { data, error } = await db()
    .from("collection_tasks")
    .select("*")
    .eq("company_id", companyId)
    .order("status")
    .order("due_date", { ascending: true, nullsFirst: false });
  if (error) throw error;
  return (data as CollectionTask[]) ?? [];
}

/** Every open/overdue task across every company (admin only; RLS enforces this). */
export async function fetchAllOpenTasks(): Promise<CollectionTask[]> {
  const { data, error } = await db()
    .from("collection_tasks")
    .select("*")
    .neq("status", "done")
    .order("due_date", { ascending: true, nullsFirst: false });
  if (error) throw error;
  return (data as CollectionTask[]) ?? [];
}

export async function addTask(input: Omit<CollectionTask, "id" | "created_at" | "status" | "value"> & { status?: TaskStatus }): Promise<CollectionTask> {
  const { data, error } = await db().from("collection_tasks").insert(input).select("*").single();
  if (error) throw error;
  return data as CollectionTask;
}

export async function updateTask(id: string, patch: Partial<Omit<CollectionTask, "id" | "company_id" | "created_at">>): Promise<CollectionTask> {
  const { data, error } = await db()
    .from("collection_tasks")
    .update({ ...patch, updated_at: new Date().toISOString() })
    .eq("id", id)
    .select("*")
    .single();
  if (error) throw error;
  return data as CollectionTask;
}

export async function deleteTask(id: string): Promise<void> {
  const { error } = await db().from("collection_tasks").delete().eq("id", id);
  if (error) throw error;
}

// ---- value-chain suppliers ------------------------------------------------

export type InviteStatus = "invited" | "submitted" | "accepted" | "declined";

export interface SupplierPayload {
  period?: string;
  scope1?: number | null;
  scope2?: number | null;
  scope3?: number | null;
  energy_total_gj?: number | null;
  renewable_pct?: number | null;
  allocation_basis?: string;
  allocation_pct?: number | null;
  method_note?: string;
  /** Server-computed allocated figure (Scope 1+2 x share), stored redacted. */
  allocated_tco2e?: number | null;
  /** Supplier opted in to share raw totals and share % with the client. */
  shared_details?: boolean;
}

export interface SupplierInvite {
  id: string;
  company_id: string;
  token: string;
  supplier_name: string;
  contact_email: string | null;
  financial_year: string;
  message: string | null;
  status: InviteStatus;
  created_at: string;
  submitted_at: string | null;
  supplier_submissions?: { id: string; payload: SupplierPayload; submitted_by: string | null; created_at: string }[];
}

export async function listSupplierInvites(companyId: string): Promise<SupplierInvite[]> {
  const { data, error } = await db()
    .from("supplier_invites")
    .select("*, supplier_submissions(*)")
    .eq("company_id", companyId)
    .order("created_at", { ascending: false });
  if (error) throw error;
  return (data as SupplierInvite[]) ?? [];
}

export async function createSupplierInvite(input: {
  company_id: string;
  supplier_name: string;
  contact_email: string | null;
  financial_year: string;
  message: string | null;
}): Promise<SupplierInvite> {
  const { data, error } = await db().from("supplier_invites").insert(input).select("*, supplier_submissions(*)").single();
  if (error) throw error;
  return data as SupplierInvite;
}

export async function setSupplierInviteStatus(id: string, status: InviteStatus): Promise<void> {
  const { error } = await db().from("supplier_invites").update({ status }).eq("id", id);
  if (error) throw error;
}

export async function deleteSupplierInvite(id: string): Promise<void> {
  const { error } = await db().from("supplier_invites").delete().eq("id", id);
  if (error) throw error;
}

/** Supplier-side (token, no auth): what the invite link shows. */
export async function fetchInviteByToken(token: string): Promise<{
  supplier_name: string; client_name: string; financial_year: string; message: string | null; status: InviteStatus;
} | null> {
  const { data, error } = await db().rpc("esgen_supplier_invite", { p_token: token });
  if (error) throw error;
  return (data as never) ?? null;
}

/** Supplier-side (token, no auth): submit or replace the data. */
export async function submitSupplierData(token: string, payload: SupplierPayload, email: string): Promise<{ ok: boolean; error?: string }> {
  const { data, error } = await db().rpc("esgen_supplier_submit", { p_token: token, p_payload: payload, p_email: email });
  if (error) throw error;
  return data as { ok: boolean; error?: string };
}
