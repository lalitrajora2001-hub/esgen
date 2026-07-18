import type { Scope } from "@/lib/emissions/factors";

/** A user's reporting entity. One row per workspace in Supabase. */
export interface Company {
  id: string;
  owner_id: string;
  name: string;
  sector: string;
  reporting_year: number;
  employees: number | null;
  size_band: string | null;
  is_listed: boolean | null;
  value_chain_role: string | null;
  country: string | null;
  cin: string | null;
  contact_email: string | null;
  created_at: string;
}

export const SIZE_BANDS = ["Micro", "Small", "Medium", "Large"] as const;
export const VALUE_CHAIN_ROLES = [
  { value: "self", label: "Reporting entity (self)" },
  { value: "upstream_partner", label: "Upstream value chain partner (supplier)" },
  { value: "downstream_partner", label: "Downstream value chain partner" },
] as const;

/** A single activity-data line the user records against a factor. */
export interface ActivityEntry {
  id: string;
  company_id: string;
  factor_id: string;
  /** ISO date (YYYY-MM-DD) the activity relates to. */
  activity_date: string;
  quantity: number;
  note: string | null;
  created_at: string;
}

/** A draft entry before it has been saved (no server-assigned fields). */
export interface ActivityEntryDraft {
  factor_id: string;
  activity_date: string;
  quantity: number;
  note: string | null;
}

/** An entry joined with its resolved emissions figure, for display. */
export interface ComputedEntry extends ActivityEntry {
  scope: Scope;
  category: string;
  activity: string;
  unit: string;
  kgco2ePerUnit: number;
  /** Emissions for this line, in kg CO2e. */
  kgco2e: number;
}

export const SECTORS = [
  "Manufacturing",
  "Professional services",
  "Retail & wholesale",
  "Technology & software",
  "Construction",
  "Transport & logistics",
  "Hospitality & events",
  "Financial services",
  "Healthcare",
  "Education",
  "Other",
] as const;

export type Sector = (typeof SECTORS)[number];
