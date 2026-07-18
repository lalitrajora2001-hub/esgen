"use client";

import { getSupabase } from "@/lib/supabase/client";
import type { ActivityEntry, ActivityEntryDraft, Company } from "@/lib/tool/types";

/**
 * Thin data-access layer over Supabase for the tool. Every function assumes the
 * user is authenticated; Row Level Security enforces ownership server-side, so
 * these queries never need to filter by owner explicitly for security (they do
 * for companies only to scope the result set).
 */

function db() {
  const supabase = getSupabase();
  if (!supabase) throw new Error("Supabase is not configured.");
  return supabase;
}

// ---- Companies ------------------------------------------------------------

export async function fetchCompany(): Promise<Company | null> {
  const { data, error } = await db()
    .from("companies")
    .select("*")
    .order("created_at", { ascending: true })
    .limit(1)
    .maybeSingle();
  if (error) throw error;
  return (data as Company) ?? null;
}

export async function createCompany(input: {
  name: string;
  sector: string;
  reporting_year: number;
  employees: number | null;
}): Promise<Company> {
  const { data, error } = await db()
    .from("companies")
    .insert(input)
    .select("*")
    .single();
  if (error) throw error;
  return data as Company;
}

export async function updateCompany(
  id: string,
  patch: Partial<
    Pick<
      Company,
      | "name" | "sector" | "reporting_year" | "employees"
      | "size_band" | "is_listed" | "value_chain_role" | "country" | "cin" | "contact_email"
    >
  >,
): Promise<Company> {
  const { data, error } = await db()
    .from("companies")
    .update(patch)
    .eq("id", id)
    .select("*")
    .single();
  if (error) throw error;
  return data as Company;
}

// ---- Activity entries -----------------------------------------------------

export async function fetchEntries(companyId: string): Promise<ActivityEntry[]> {
  const { data, error } = await db()
    .from("activity_entries")
    .select("*")
    .eq("company_id", companyId)
    .order("activity_date", { ascending: false });
  if (error) throw error;
  return (data as ActivityEntry[]) ?? [];
}

export async function addEntry(
  companyId: string,
  draft: ActivityEntryDraft,
): Promise<ActivityEntry> {
  const { data, error } = await db()
    .from("activity_entries")
    .insert({ company_id: companyId, ...draft })
    .select("*")
    .single();
  if (error) throw error;
  return data as ActivityEntry;
}

export async function deleteEntry(id: string): Promise<void> {
  const { error } = await db().from("activity_entries").delete().eq("id", id);
  if (error) throw error;
}
