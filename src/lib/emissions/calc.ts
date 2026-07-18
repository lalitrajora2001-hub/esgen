import { getFactor, type Scope, SCOPE_LABELS } from "@/lib/emissions/factors";
import type { ActivityEntry, ComputedEntry } from "@/lib/tool/types";

/** Resolve an entry against its factor and attach the computed emissions. */
export function computeEntry(entry: ActivityEntry): ComputedEntry | null {
  const factor = getFactor(entry.factor_id);
  if (!factor) return null;
  return {
    ...entry,
    scope: factor.scope,
    category: factor.category,
    activity: factor.activity,
    unit: factor.unit,
    kgco2ePerUnit: factor.kgco2ePerUnit,
    kgco2e: entry.quantity * factor.kgco2ePerUnit,
  };
}

export function computeAll(entries: ActivityEntry[]): ComputedEntry[] {
  return entries
    .map(computeEntry)
    .filter((e): e is ComputedEntry => e !== null);
}

/** kg CO2e -> tonnes CO2e. */
export function toTonnes(kg: number): number {
  return kg / 1000;
}

export interface ScopeTotal {
  scope: Scope;
  label: string;
  kgco2e: number;
  tco2e: number;
}

export function totalsByScope(entries: ComputedEntry[]): ScopeTotal[] {
  return ([1, 2, 3] as Scope[]).map((scope) => {
    const kg = entries
      .filter((e) => e.scope === scope)
      .reduce((sum, e) => sum + e.kgco2e, 0);
    return { scope, label: SCOPE_LABELS[scope], kgco2e: kg, tco2e: toTonnes(kg) };
  });
}

export function totalKg(entries: ComputedEntry[]): number {
  return entries.reduce((sum, e) => sum + e.kgco2e, 0);
}

export interface CategoryTotal {
  category: string;
  scope: Scope;
  kgco2e: number;
  tco2e: number;
}

export function totalsByCategory(entries: ComputedEntry[]): CategoryTotal[] {
  const map = new Map<string, CategoryTotal>();
  for (const e of entries) {
    const existing = map.get(e.category);
    if (existing) {
      existing.kgco2e += e.kgco2e;
      existing.tco2e = toTonnes(existing.kgco2e);
    } else {
      map.set(e.category, {
        category: e.category,
        scope: e.scope,
        kgco2e: e.kgco2e,
        tco2e: toTonnes(e.kgco2e),
      });
    }
  }
  return [...map.values()].sort((a, b) => b.kgco2e - a.kgco2e);
}

export interface MonthTotal {
  /** YYYY-MM */
  month: string;
  /** Short display label, e.g. "Mar". */
  label: string;
  kgco2e: number;
  tco2e: number;
}

const MONTH_LABELS = [
  "Jan", "Feb", "Mar", "Apr", "May", "Jun",
  "Jul", "Aug", "Sep", "Oct", "Nov", "Dec",
];

export function totalsByMonth(entries: ComputedEntry[]): MonthTotal[] {
  const map = new Map<string, number>();
  for (const e of entries) {
    const month = e.activity_date.slice(0, 7); // YYYY-MM
    map.set(month, (map.get(month) ?? 0) + e.kgco2e);
  }
  return [...map.entries()]
    .sort(([a], [b]) => a.localeCompare(b))
    .map(([month, kg]) => {
      const monthIndex = Number(month.slice(5, 7)) - 1;
      return {
        month,
        label: MONTH_LABELS[monthIndex] ?? month,
        kgco2e: kg,
        tco2e: toTonnes(kg),
      };
    });
}

/** Format a tonnes figure for display, e.g. 12.4 or 0.83. */
export function fmtTonnes(t: number): string {
  if (t === 0) return "0";
  if (t < 1) return t.toFixed(2);
  if (t < 100) return t.toFixed(1);
  return Math.round(t).toLocaleString("en-GB");
}
