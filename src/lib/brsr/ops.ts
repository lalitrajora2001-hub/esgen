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
