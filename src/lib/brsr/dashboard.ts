import { num } from "@/lib/brsr/calc";
import type { ResponseMap, BrsrReport } from "@/lib/brsr/db";
import type { Company } from "@/lib/tool/types";
import { EMISSION_FACTORS, getFactor, type Scope } from "@/lib/emissions/factors";

/**
 * Client-facing dashboard metrics, derived from the BRSR data entered in
 * Collect (Principle 6 tables, the emissions calculator activity lines and the
 * report's turnover). Read-only insight; never a substitute for assured figures.
 */

type Period = "current" | "previous";

function readVal(responses: ResponseMap, qKey: string, rowKey: string, period: Period = "current", col = "value"): number | null {
  const v = responses[qKey] as { current?: Record<string, Record<string, unknown>>; previous?: Record<string, Record<string, unknown>> } | undefined;
  const cell = v?.[period]?.[rowKey]?.[col];
  return cell == null || cell === "" ? null : num(cell as never);
}

function pctChange(cur: number | null, prev: number | null): number | null {
  if (cur == null || prev == null || prev === 0) return null;
  return ((cur - prev) / prev) * 100;
}

const sumOrNull = (...xs: (number | null)[]): number | null => {
  const present = xs.filter((x): x is number => x != null);
  return present.length ? present.reduce((a, b) => a + b, 0) : null;
};

export interface NamedValue { key: string; label: string; value: number }

export interface ActivityLine { label: string; scope: Scope; tco2e: number; quantity: number; unit: string }

export interface DashboardData {
  hasData: boolean;

  // GHG emissions (tCO2e)
  scope1: number; scope2: number; scope3: number;
  scope1Prev: number | null; scope2Prev: number | null; scope3Prev: number | null;
  totalGhg: number;
  coreGhg: number; // scope 1 + 2
  prevTotalGhg: number | null;
  prevCoreGhg: number | null;
  ghgYoyPct: number | null;
  coreYoyPct: number | null;
  scope1YoyPct: number | null; scope2YoyPct: number | null; scope3YoyPct: number | null;

  // Intensity
  intensityPerEmployee: number | null;
  intensityPerCrore: number | null;      // tCO2e per INR crore of turnover (Scope 1+2)
  intensityPerCrorePpp: number | null;   // PPP-adjusted
  energyIntensityPerCrore: number | null;

  // Energy (unit as entered, GJ recommended)
  energyTotal: number | null; energyTotalPrev: number | null; energyYoyPct: number | null;
  energyRenewable: number | null; energyNonRenewable: number | null;
  renewablePct: number | null;
  energyBreakdown: NamedValue[]; // electricity/fuel/other x renew/non-renew

  // Water (kL)
  waterWithdrawal: NamedValue[]; // by source
  waterWithdrawalTotal: number | null;
  waterConsumption: number | null; waterConsumptionPrev: number | null; waterYoyPct: number | null;
  waterDischargeTotal: number | null;
  waterDischargeTreated: number | null;
  waterDischargeUntreated: number | null;

  // Waste (MT)
  wasteByCategory: NamedValue[];
  wasteGenerated: number | null; wasteGeneratedPrev: number | null; wasteYoyPct: number | null;
  wasteRecovered: number | null;
  wasteDisposed: number | null;
  wasteRecovery: NamedValue[]; // recycled / reused / other
  wasteDisposal: NamedValue[]; // incineration / landfilling / other
  wasteDiversionPct: number | null; // recovered / generated

  // Air emissions (non-GHG)
  airEmissions: NamedValue[];

  // Activity lines from the emissions calculator (by source, per scope)
  activityLines: ActivityLine[];
}

const ENERGY_ROWS: { key: string; label: string }[] = [
  { key: "renew_electricity", label: "Electricity (renewable)" },
  { key: "renew_fuel", label: "Fuel (renewable)" },
  { key: "renew_other", label: "Other (renewable)" },
  { key: "nonrenew_electricity", label: "Electricity (non-renewable)" },
  { key: "nonrenew_fuel", label: "Fuel (non-renewable)" },
  { key: "nonrenew_other", label: "Other (non-renewable)" },
];

const WATER_SOURCE_ROWS: { key: string; label: string }[] = [
  { key: "wd_surface", label: "Surface water" },
  { key: "wd_ground", label: "Groundwater" },
  { key: "wd_thirdparty", label: "Third-party water" },
  { key: "wd_seawater", label: "Seawater / desalinated" },
  { key: "wd_others", label: "Others" },
];

const WASTE_CATEGORY_ROWS: { key: string; label: string }[] = [
  { key: "gen_plastic", label: "Plastic" },
  { key: "gen_ewaste", label: "E-waste" },
  { key: "gen_biomedical", label: "Bio-medical" },
  { key: "gen_construction", label: "Construction & demolition" },
  { key: "gen_battery", label: "Battery" },
  { key: "gen_radioactive", label: "Radioactive" },
  { key: "gen_other_hazardous", label: "Other hazardous" },
  { key: "gen_other_nonhazardous", label: "Other non-hazardous" },
];

const AIR_ROWS: { key: string; label: string }[] = [
  { key: "nox", label: "NOx" },
  { key: "sox", label: "SOx" },
  { key: "pm", label: "Particulate matter" },
  { key: "voc", label: "VOC" },
  { key: "hap", label: "HAP" },
  { key: "others", label: "Others" },
];

const DISCHARGE_TREATED_KEYS = ["surface_treated", "ground_treated", "seawater_treated", "thirdparty_treated", "others_treated"];
const DISCHARGE_UNTREATED_KEYS = ["surface_none", "ground_none", "seawater_none", "thirdparty_none", "others_none"];

function readNamed(responses: ResponseMap, qKey: string, rows: { key: string; label: string }[]): NamedValue[] {
  return rows
    .map((r) => ({ key: r.key, label: r.label, value: readVal(responses, qKey, r.key) ?? 0 }))
    .filter((r) => r.value > 0);
}

export function dashboardData(responses: ResponseMap, report: BrsrReport, company: Company | null): DashboardData {
  // --- GHG ---
  const s1 = readVal(responses, "C.P6.EI.7", "scope1") ?? 0;
  const s2 = readVal(responses, "C.P6.EI.7", "scope2") ?? 0;
  const s3 = readVal(responses, "C.P6.LI.2", "scope3") ?? 0;
  const s1p = readVal(responses, "C.P6.EI.7", "scope1", "previous");
  const s2p = readVal(responses, "C.P6.EI.7", "scope2", "previous");
  const s3p = readVal(responses, "C.P6.LI.2", "scope3", "previous");

  const totalGhg = s1 + s2 + s3;
  const coreGhg = s1 + s2;
  const prevTotalGhg = s1p != null || s2p != null || s3p != null ? (s1p ?? 0) + (s2p ?? 0) + (s3p ?? 0) : null;
  const prevCoreGhg = s1p != null || s2p != null ? (s1p ?? 0) + (s2p ?? 0) : null;

  // --- Energy ---
  const energyTotal = readVal(responses, "C.P6.EI.1", "total_energy");
  const energyTotalPrev = readVal(responses, "C.P6.EI.1", "total_energy", "previous");
  const energyRenewable = readVal(responses, "C.P6.EI.1", "renew_total");
  const energyNonRenewable = readVal(responses, "C.P6.EI.1", "nonrenew_total");
  const renewablePct = energyTotal && energyTotal > 0 && energyRenewable != null ? (energyRenewable / energyTotal) * 100 : null;

  // --- Water ---
  const waterWithdrawal = readNamed(responses, "C.P6.EI.3", WATER_SOURCE_ROWS);
  const waterWithdrawalTotal = readVal(responses, "C.P6.EI.3", "wd_total") ?? sumOrNull(...waterWithdrawal.map((w) => w.value));
  const waterConsumption = readVal(responses, "C.P6.EI.3", "consumption_total");
  const waterConsumptionPrev = readVal(responses, "C.P6.EI.3", "consumption_total", "previous");
  const waterDischargeTotal = readVal(responses, "C.P6.EI.4", "total_discharged");
  const waterDischargeTreated = sumOrNull(...DISCHARGE_TREATED_KEYS.map((k) => readVal(responses, "C.P6.EI.4", k)));
  const waterDischargeUntreated = sumOrNull(...DISCHARGE_UNTREATED_KEYS.map((k) => readVal(responses, "C.P6.EI.4", k)));

  // --- Waste ---
  const wasteByCategory = readNamed(responses, "C.P6.EI.9", WASTE_CATEGORY_ROWS);
  const wasteGenerated = readVal(responses, "C.P6.EI.9", "gen_total") ?? sumOrNull(...wasteByCategory.map((w) => w.value));
  const wasteGeneratedPrev = readVal(responses, "C.P6.EI.9", "gen_total", "previous");
  const wasteRecovered = readVal(responses, "C.P6.EI.9", "recovered_total");
  const wasteDisposed = readVal(responses, "C.P6.EI.9", "disposed_total");
  const wasteRecovery = readNamed(responses, "C.P6.EI.9", [
    { key: "recovered_recycled", label: "Recycled" },
    { key: "recovered_reused", label: "Re-used" },
    { key: "recovered_other", label: "Other recovery" },
  ]);
  const wasteDisposal = readNamed(responses, "C.P6.EI.9", [
    { key: "disposed_incineration", label: "Incineration" },
    { key: "disposed_landfilling", label: "Landfilling" },
    { key: "disposed_other", label: "Other disposal" },
  ]);
  const wasteDiversionPct = wasteGenerated && wasteGenerated > 0 && wasteRecovered != null ? (wasteRecovered / wasteGenerated) * 100 : null;

  // --- Air ---
  const airEmissions = readNamed(responses, "C.P6.EI.6", AIR_ROWS);

  // --- Activity lines (emissions calculator) ---
  const stored = (responses["_emissions"] as { entries?: { factor_id: string; quantity: string }[] } | undefined)?.entries ?? [];
  const lineMap = new Map<string, ActivityLine>();
  for (const l of stored) {
    const f = getFactor(l.factor_id) ?? EMISSION_FACTORS.find((x) => x.id === l.factor_id);
    const q = Number(l.quantity);
    if (!f || !Number.isFinite(q) || q <= 0) continue;
    const t = (q * f.kgco2ePerUnit) / 1000;
    const existing = lineMap.get(f.id);
    if (existing) {
      existing.tco2e += t;
      existing.quantity += q;
    } else {
      lineMap.set(f.id, { label: f.activity, scope: f.scope, tco2e: t, quantity: q, unit: f.unit });
    }
  }
  const activityLines = [...lineMap.values()].sort((a, b) => b.tco2e - a.tco2e);

  // --- Intensity ---
  const turnover = report.turnover != null ? Number(report.turnover) : null;
  const ppp = report.ppp_factor != null ? Number(report.ppp_factor) : null;
  const employees = company?.employees ?? null;
  const crores = turnover && turnover > 0 ? turnover / 1e7 : null; // 1 crore = 10^7 INR

  return {
    hasData: [s1, s2, s3].some((x) => x > 0) || [energyTotal, waterConsumption, wasteGenerated].some((x) => x != null && x !== 0),

    scope1: s1, scope2: s2, scope3: s3,
    scope1Prev: s1p, scope2Prev: s2p, scope3Prev: s3p,
    totalGhg, coreGhg, prevTotalGhg, prevCoreGhg,
    ghgYoyPct: pctChange(totalGhg > 0 ? totalGhg : null, prevTotalGhg),
    coreYoyPct: pctChange(coreGhg > 0 ? coreGhg : null, prevCoreGhg),
    scope1YoyPct: pctChange(s1 > 0 ? s1 : null, s1p),
    scope2YoyPct: pctChange(s2 > 0 ? s2 : null, s2p),
    scope3YoyPct: pctChange(s3 > 0 ? s3 : null, s3p),

    intensityPerEmployee: employees && employees > 0 && totalGhg > 0 ? totalGhg / employees : null,
    intensityPerCrore: crores && coreGhg > 0 ? coreGhg / crores : null,
    intensityPerCrorePpp: crores && ppp && ppp > 0 && coreGhg > 0 ? coreGhg / (turnover! / ppp / 1e7) : null,
    energyIntensityPerCrore: crores && energyTotal ? energyTotal / crores : null,

    energyTotal, energyTotalPrev,
    energyYoyPct: pctChange(energyTotal, energyTotalPrev),
    energyRenewable, energyNonRenewable, renewablePct,
    energyBreakdown: readNamed(responses, "C.P6.EI.1", ENERGY_ROWS),

    waterWithdrawal, waterWithdrawalTotal,
    waterConsumption, waterConsumptionPrev,
    waterYoyPct: pctChange(waterConsumption, waterConsumptionPrev),
    waterDischargeTotal, waterDischargeTreated, waterDischargeUntreated,

    wasteByCategory, wasteGenerated, wasteGeneratedPrev,
    wasteYoyPct: pctChange(wasteGenerated, wasteGeneratedPrev),
    wasteRecovered, wasteDisposed, wasteRecovery, wasteDisposal, wasteDiversionPct,

    airEmissions,
    activityLines,
  };
}

export function fmtNum(n: number | null | undefined, dp = 1): string {
  if (n == null) return "—";
  if (n === 0) return "0";
  if (Math.abs(n) < 1) return n.toFixed(2);
  if (Math.abs(n) < 1000) return n.toFixed(dp);
  return Math.round(n).toLocaleString("en-GB");
}
