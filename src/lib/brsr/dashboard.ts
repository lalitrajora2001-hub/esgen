import { num } from "@/lib/brsr/calc";
import type { ResponseMap, BrsrReport } from "@/lib/brsr/db";
import type { Company } from "@/lib/tool/types";

/**
 * Client-facing dashboard metrics, derived from the BRSR Core environment data
 * (Principle 6). Read-only insight; never a substitute for the assured figures.
 */

function readVal(responses: ResponseMap, qKey: string, rowKey: string, period: "current" | "previous" = "current", col = "value"): number | null {
  const v = responses[qKey] as { current?: Record<string, Record<string, unknown>>; previous?: Record<string, Record<string, unknown>> } | undefined;
  const cell = v?.[period]?.[rowKey]?.[col];
  return cell == null || cell === "" ? null : num(cell as never);
}

export interface DashboardData {
  hasData: boolean;
  scope1: number;
  scope2: number;
  scope3: number;
  totalGhg: number;
  coreGhg: number; // scope 1 + 2
  prevTotalGhg: number | null;
  ghgYoyPct: number | null;
  intensityPerEmployee: number | null;
  intensityPerTurnover: number | null;
  energyTotal: number | null;
  energyRenewable: number | null;
  energyNonRenewable: number | null;
  renewablePct: number | null;
  waterConsumption: number | null;
  wasteGenerated: number | null;
}

export function dashboardData(responses: ResponseMap, report: BrsrReport, company: Company | null): DashboardData {
  const s1 = readVal(responses, "C.P6.EI.7", "scope1") ?? 0;
  const s2 = readVal(responses, "C.P6.EI.7", "scope2") ?? 0;
  const s3 = readVal(responses, "C.P6.LI.2", "scope3") ?? 0;
  const s1p = readVal(responses, "C.P6.EI.7", "scope1", "previous");
  const s2p = readVal(responses, "C.P6.EI.7", "scope2", "previous");
  const s3p = readVal(responses, "C.P6.LI.2", "scope3", "previous");

  const totalGhg = s1 + s2 + s3;
  const coreGhg = s1 + s2;
  const prevTotalGhg = s1p != null || s2p != null || s3p != null ? (s1p ?? 0) + (s2p ?? 0) + (s3p ?? 0) : null;
  const ghgYoyPct = prevTotalGhg && prevTotalGhg > 0 ? ((totalGhg - prevTotalGhg) / prevTotalGhg) * 100 : null;

  const energyTotal = readVal(responses, "C.P6.EI.1", "total_energy");
  const energyRenewable = readVal(responses, "C.P6.EI.1", "renew_total");
  const energyNonRenewable = readVal(responses, "C.P6.EI.1", "nonrenew_total");
  const renewablePct = energyTotal && energyTotal > 0 && energyRenewable != null ? (energyRenewable / energyTotal) * 100 : null;

  const waterConsumption = readVal(responses, "C.P6.EI.3", "consumption_total");
  const wasteGenerated = readVal(responses, "C.P6.EI.9", "gen_total");

  const turnover = report.turnover ?? null;
  const employees = company?.employees ?? null;

  return {
    hasData: [s1, s2, s3, energyTotal, waterConsumption, wasteGenerated].some((x) => x != null && x !== 0),
    scope1: s1,
    scope2: s2,
    scope3: s3,
    totalGhg,
    coreGhg,
    prevTotalGhg,
    ghgYoyPct,
    intensityPerEmployee: employees && employees > 0 ? totalGhg / employees : null,
    intensityPerTurnover: turnover && turnover > 0 ? coreGhg / turnover : null,
    energyTotal,
    energyRenewable,
    energyNonRenewable,
    renewablePct,
    waterConsumption,
    wasteGenerated,
  };
}

export function fmtNum(n: number | null | undefined, dp = 1): string {
  if (n == null) return "—";
  if (n === 0) return "0";
  if (Math.abs(n) < 1) return n.toFixed(2);
  if (Math.abs(n) < 1000) return n.toFixed(dp);
  return Math.round(n).toLocaleString("en-GB");
}
