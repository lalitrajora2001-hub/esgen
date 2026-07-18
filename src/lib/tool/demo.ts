"use client";

import type { ActivityEntry, ActivityEntryDraft, Company } from "@/lib/tool/types";

/**
 * Demo mode: lets someone explore the tool without a Supabase backend. Data is
 * held in memory (resets on reload) and nothing is persisted. It is only
 * offered while Supabase is unconfigured, so it disappears once real keys exist.
 */

const KEY = "esgen-demo";

export function isDemoActive(): boolean {
  if (typeof window === "undefined") return false;
  return window.localStorage.getItem(KEY) === "1";
}

export function setDemoActive(on: boolean): void {
  if (typeof window === "undefined") return;
  if (on) window.localStorage.setItem(KEY, "1");
  else window.localStorage.removeItem(KEY);
}

export const DEMO_COMPANY: Company = {
  id: "demo-company",
  owner_id: "demo-user",
  name: "Northwind Manufacturing Ltd",
  sector: "Manufacturing",
  reporting_year: 2026,
  employees: 48,
  size_band: "Medium",
  is_listed: true,
  value_chain_role: "self",
  country: "India",
  cin: null,
  contact_email: null,
  created_at: "2026-01-01T00:00:00Z",
};

function seed(): ActivityEntry[] {
  const rows: Array<[string, string, number, string | null]> = [
    // Scope 2: electricity
    ["s2-electricity-kwh", "2026-01-31", 4200, "January electricity"],
    ["s2-electricity-kwh", "2026-02-28", 3850, null],
    ["s2-electricity-kwh", "2026-03-31", 4100, null],
    ["s2-electricity-kwh", "2026-04-30", 3600, null],
    ["s2-electricity-kwh", "2026-05-31", 3900, null],
    ["s2-electricity-kwh", "2026-06-30", 4300, null],
    // Scope 1: natural gas
    ["s1-natural-gas-kwh", "2026-01-31", 9200, "Winter heating"],
    ["s1-natural-gas-kwh", "2026-02-28", 8100, null],
    ["s1-natural-gas-kwh", "2026-03-31", 5200, null],
    // Scope 1: fleet diesel
    ["s1-diesel-litre", "2026-03-15", 620, "Fleet refuel"],
    ["s1-diesel-litre", "2026-05-20", 540, null],
    // Scope 3: business travel
    ["s3-flight-long-km", "2026-04-10", 8800, "Client visit, return"],
    ["s3-rail-km", "2026-02-12", 640, "Conference"],
    ["s3-car-km", "2026-06-05", 1200, "Supplier audits"],
  ];
  return rows.map(([factor_id, activity_date, quantity, note], i) => ({
    id: `demo-${i + 1}`,
    company_id: DEMO_COMPANY.id,
    factor_id,
    activity_date,
    quantity,
    note,
    created_at: `${activity_date}T00:00:00Z`,
  }));
}

let entries: ActivityEntry[] = seed();
let counter = entries.length;

export function demoFetchEntries(): ActivityEntry[] {
  return [...entries].sort((a, b) => b.activity_date.localeCompare(a.activity_date));
}

export function demoAddEntry(draft: ActivityEntryDraft): ActivityEntry {
  counter += 1;
  const created: ActivityEntry = {
    id: `demo-${counter}`,
    company_id: DEMO_COMPANY.id,
    ...draft,
    created_at: `${draft.activity_date}T00:00:00Z`,
  };
  entries = [created, ...entries];
  return created;
}

export function demoDeleteEntry(id: string): void {
  entries = entries.filter((e) => e.id !== id);
}
