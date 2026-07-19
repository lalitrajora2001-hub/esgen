import type { ResponseMap, BrsrReport } from "@/lib/brsr/db";
import type { Company } from "@/lib/tool/types";
import { num } from "@/lib/brsr/calc";

/**
 * XBRL 2.1 instance generator for the BRSR quantitative disclosures, mapped to
 * SEBI's official BRSR taxonomy (the "in-capmkt" capital-market taxonomy that
 * BSE/NSE filings use; concept names verified against publicly filed BRSR XBRL
 * instances, taxonomy version in-capmkt-ent-2026-02-28).
 *
 * Conventions confirmed from filed instances:
 *  - contexts DCYMain (current FY duration) and DPYMain (prior FY duration)
 *  - entity identifier scheme CorporateIdentityNumber (CIN)
 *  - units: Gigajoule (Non-SI:GJ), MtCO2e (Non-SI:MtCO2e = metric tonnes CO2e),
 *    Kiloliters (in-capmkt-types:kl), Tonne (Non-SI:t), iso4217:INR, xbrli:pure,
 *    and divide units such as MtCO2ePerINR for the intensity ratios
 *  - decimals="INF"
 *
 * Current exchange filings are Inline XBRL produced by the BSE/NSE utility;
 * this instance uses the official concepts and units so the figures transfer
 * directly, but it must still be validated with the exchange utility before
 * any filing. This export prepares the data, it does not certify it.
 */

// ---- mapping --------------------------------------------------------------

type UnitId = "MtCO2e" | "Gigajoule" | "Kiloliters" | "Tonne" | "INR" | "pure"
  | "MtCO2ePerINR" | "GigajoulePerINR" | "KilolitersPerINR" | "TonnePerINR";

interface FactMap {
  /** Concept local name. ns "in-capmkt" = confirmed against filed instances. */
  element: string;
  ns: "in-capmkt" | "esgen";
  qKey: string;
  rowKey: string;
  unit: UnitId;
  label: string;
}

/** BRSR quantitative datapoints -> official taxonomy concepts (CY + PY each). */
const MAPPING: FactMap[] = [
  // Energy (P6 EI-1)
  { element: "TotalElectricityConsumptionFromRenewableSources", ns: "in-capmkt", qKey: "C.P6.EI.1", rowKey: "renew_electricity", unit: "Gigajoule", label: "Electricity consumption, renewable" },
  { element: "TotalFuelConsumptionFromRenewableSources", ns: "in-capmkt", qKey: "C.P6.EI.1", rowKey: "renew_fuel", unit: "Gigajoule", label: "Fuel consumption, renewable" },
  { element: "EnergyConsumptionThroughOtherSourcesFromRenewableSources", ns: "in-capmkt", qKey: "C.P6.EI.1", rowKey: "renew_other", unit: "Gigajoule", label: "Other energy, renewable" },
  { element: "TotalEnergyConsumedFromRenewableSources", ns: "in-capmkt", qKey: "C.P6.EI.1", rowKey: "renew_total", unit: "Gigajoule", label: "Total energy, renewable" },
  { element: "TotalElectricityConsumptionFromNonRenewableSources", ns: "in-capmkt", qKey: "C.P6.EI.1", rowKey: "nonrenew_electricity", unit: "Gigajoule", label: "Electricity consumption, non-renewable" },
  { element: "TotalFuelConsumptionFromNonRenewableSources", ns: "in-capmkt", qKey: "C.P6.EI.1", rowKey: "nonrenew_fuel", unit: "Gigajoule", label: "Fuel consumption, non-renewable" },
  { element: "EnergyConsumptionThroughOtherSourcesFromNonRenewableSources", ns: "in-capmkt", qKey: "C.P6.EI.1", rowKey: "nonrenew_other", unit: "Gigajoule", label: "Other energy, non-renewable" },
  { element: "TotalEnergyConsumedFromNonRenewableSources", ns: "in-capmkt", qKey: "C.P6.EI.1", rowKey: "nonrenew_total", unit: "Gigajoule", label: "Total energy, non-renewable" },
  { element: "TotalEnergyConsumedFromRenewableAndNonRenewableSources", ns: "in-capmkt", qKey: "C.P6.EI.1", rowKey: "total_energy", unit: "Gigajoule", label: "Total energy consumed" },
  { element: "EnergyIntensityPerRupeeOfTurnover", ns: "in-capmkt", qKey: "C.P6.EI.1", rowKey: "intensity_turnover", unit: "GigajoulePerINR", label: "Energy intensity per rupee of turnover" },
  { element: "EnergyIntensityPerRupeeOfTurnoverAdjustingForPurchasingPowerParity", ns: "in-capmkt", qKey: "C.P6.EI.1", rowKey: "intensity_ppp", unit: "GigajoulePerINR", label: "Energy intensity, PPP adjusted" },
  { element: "EnergyIntensityInTermOfPhysicalOutput", ns: "in-capmkt", qKey: "C.P6.EI.1", rowKey: "intensity_output", unit: "pure", label: "Energy intensity, physical output" },

  // Water (P6 EI-3 / EI-4)
  { element: "WaterWithdrawalBySurfaceWater", ns: "in-capmkt", qKey: "C.P6.EI.3", rowKey: "wd_surface", unit: "Kiloliters", label: "Withdrawal, surface water" },
  { element: "WaterWithdrawalByGroundwater", ns: "in-capmkt", qKey: "C.P6.EI.3", rowKey: "wd_ground", unit: "Kiloliters", label: "Withdrawal, groundwater" },
  { element: "WaterWithdrawalByThirdPartyWater", ns: "in-capmkt", qKey: "C.P6.EI.3", rowKey: "wd_thirdparty", unit: "Kiloliters", label: "Withdrawal, third-party water" },
  { element: "WaterWithdrawalBySeawaterOrDesalinatedWater", ns: "in-capmkt", qKey: "C.P6.EI.3", rowKey: "wd_seawater", unit: "Kiloliters", label: "Withdrawal, seawater / desalinated" },
  { element: "WaterWithdrawalByOthers", ns: "in-capmkt", qKey: "C.P6.EI.3", rowKey: "wd_others", unit: "Kiloliters", label: "Withdrawal, others" },
  { element: "TotalVolumeOfWaterWithdrawal", ns: "in-capmkt", qKey: "C.P6.EI.3", rowKey: "wd_total", unit: "Kiloliters", label: "Total water withdrawal" },
  { element: "TotalVolumeOfWaterConsumption", ns: "in-capmkt", qKey: "C.P6.EI.3", rowKey: "consumption_total", unit: "Kiloliters", label: "Total water consumption" },
  { element: "WaterIntensityPerRupeeOfTurnover", ns: "in-capmkt", qKey: "C.P6.EI.3", rowKey: "intensity_turnover", unit: "KilolitersPerINR", label: "Water intensity per rupee of turnover" },
  { element: "TotalWaterDischargedInKilolitres", ns: "in-capmkt", qKey: "C.P6.EI.4", rowKey: "total_discharged", unit: "Kiloliters", label: "Total water discharged" },

  // Air emissions (P6 EI-6)
  { element: "NOx", ns: "in-capmkt", qKey: "C.P6.EI.6", rowKey: "nox", unit: "Tonne", label: "NOx" },
  { element: "SOx", ns: "in-capmkt", qKey: "C.P6.EI.6", rowKey: "sox", unit: "Tonne", label: "SOx" },
  { element: "ParticulateMatter", ns: "in-capmkt", qKey: "C.P6.EI.6", rowKey: "pm", unit: "Tonne", label: "Particulate matter" },
  { element: "HazardousAirPollutants", ns: "in-capmkt", qKey: "C.P6.EI.6", rowKey: "hap", unit: "Tonne", label: "Hazardous air pollutants" },

  // GHG (P6 EI-7, LI-2)
  { element: "TotalScope1Emissions", ns: "in-capmkt", qKey: "C.P6.EI.7", rowKey: "scope1", unit: "MtCO2e", label: "Total Scope 1 emissions" },
  { element: "TotalScope2Emissions", ns: "in-capmkt", qKey: "C.P6.EI.7", rowKey: "scope2", unit: "MtCO2e", label: "Total Scope 2 emissions" },
  { element: "TotalScope1AndScope2EmissionsIntensityPerRupeeOfTurnover", ns: "in-capmkt", qKey: "C.P6.EI.7", rowKey: "intensity_turnover", unit: "MtCO2ePerINR", label: "Scope 1+2 intensity per rupee of turnover" },
  { element: "TotalScope1AndScope2EmissionsIntensityPerRupeeOfTurnoverAdjustedForPurchasingPowerParity", ns: "in-capmkt", qKey: "C.P6.EI.7", rowKey: "intensity_ppp", unit: "MtCO2ePerINR", label: "Scope 1+2 intensity, PPP adjusted" },
  { element: "TotalScope3Emissions", ns: "in-capmkt", qKey: "C.P6.LI.2", rowKey: "scope3", unit: "MtCO2e", label: "Total Scope 3 emissions" },
  { element: "TotalScope3EmissionsPerRupeeOfTurnover", ns: "in-capmkt", qKey: "C.P6.LI.2", rowKey: "intensity_turnover", unit: "MtCO2ePerINR", label: "Scope 3 intensity per rupee of turnover" },

  // Waste (P6 EI-9)
  { element: "PlasticWaste", ns: "in-capmkt", qKey: "C.P6.EI.9", rowKey: "gen_plastic", unit: "Tonne", label: "Plastic waste" },
  { element: "EWaste", ns: "in-capmkt", qKey: "C.P6.EI.9", rowKey: "gen_ewaste", unit: "Tonne", label: "E-waste" },
  { element: "BioMedicalWaste", ns: "in-capmkt", qKey: "C.P6.EI.9", rowKey: "gen_biomedical", unit: "Tonne", label: "Bio-medical waste" },
  { element: "ConstructionAndDemolitionWaste", ns: "in-capmkt", qKey: "C.P6.EI.9", rowKey: "gen_construction", unit: "Tonne", label: "Construction and demolition waste" },
  { element: "BatteryWaste", ns: "in-capmkt", qKey: "C.P6.EI.9", rowKey: "gen_battery", unit: "Tonne", label: "Battery waste" },
  { element: "RadioactiveWaste", ns: "in-capmkt", qKey: "C.P6.EI.9", rowKey: "gen_radioactive", unit: "Tonne", label: "Radioactive waste" },
  { element: "OtherHazardousWaste", ns: "in-capmkt", qKey: "C.P6.EI.9", rowKey: "gen_other_hazardous", unit: "Tonne", label: "Other hazardous waste" },
  { element: "OtherNonHazardousWasteGenerated", ns: "in-capmkt", qKey: "C.P6.EI.9", rowKey: "gen_other_nonhazardous", unit: "Tonne", label: "Other non-hazardous waste" },
  { element: "TotalWasteGenerated", ns: "in-capmkt", qKey: "C.P6.EI.9", rowKey: "gen_total", unit: "Tonne", label: "Total waste generated" },
  { element: "WasteRecoveredThroughRecycled", ns: "in-capmkt", qKey: "C.P6.EI.9", rowKey: "recovered_recycled", unit: "Tonne", label: "Waste recovered, recycled" },
  { element: "WasteRecoveredThroughReUsed", ns: "in-capmkt", qKey: "C.P6.EI.9", rowKey: "recovered_reused", unit: "Tonne", label: "Waste recovered, re-used" },
  { element: "WasteRecoveredThroughOtherRecoveryOperations", ns: "in-capmkt", qKey: "C.P6.EI.9", rowKey: "recovered_other", unit: "Tonne", label: "Waste recovered, other" },
  { element: "TotalWasteRecovered", ns: "in-capmkt", qKey: "C.P6.EI.9", rowKey: "recovered_total", unit: "Tonne", label: "Total waste recovered" },
  { element: "WasteDisposedByIncineration", ns: "in-capmkt", qKey: "C.P6.EI.9", rowKey: "disposed_incineration", unit: "Tonne", label: "Waste disposed, incineration" },
  { element: "WasteDisposedByLandfilling", ns: "in-capmkt", qKey: "C.P6.EI.9", rowKey: "disposed_landfilling", unit: "Tonne", label: "Waste disposed, landfilling" },
  { element: "WasteDisposedByOtherDisposalOperations", ns: "in-capmkt", qKey: "C.P6.EI.9", rowKey: "disposed_other", unit: "Tonne", label: "Waste disposed, other" },
  { element: "TotalWasteDisposed", ns: "in-capmkt", qKey: "C.P6.EI.9", rowKey: "disposed_total", unit: "Tonne", label: "Total waste disposed" },
  { element: "WasteIntensityPerRupeeOfTurnover", ns: "in-capmkt", qKey: "C.P6.EI.9", rowKey: "intensity_turnover", unit: "TonnePerINR", label: "Waste intensity per rupee of turnover" },
];

// ---- helpers --------------------------------------------------------------

function esc(s: string): string {
  return s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");
}

function readCell(responses: ResponseMap, qKey: string, rowKey: string, period: "current" | "previous"): number | null {
  const v = responses[qKey] as { current?: Record<string, Record<string, unknown>>; previous?: Record<string, Record<string, unknown>> } | undefined;
  const cell = v?.[period]?.[rowKey]?.["value"];
  if (cell == null || cell === "") return null;
  const n = num(cell as never);
  return Number.isFinite(n) ? n : null;
}

/** "2026-27" -> {start:"2026-04-01", end:"2027-03-31"} (Indian FY). */
export function fyPeriod(financialYear: string): { start: string; end: string } | null {
  const m = financialYear.trim().match(/^(\d{4})\s*-\s*(\d{2,4})$/);
  if (!m) return null;
  const y1 = Number(m[1]);
  return { start: `${y1}-04-01`, end: `${y1 + 1}-03-31` };
}

function readCin(responses: ResponseMap, company: Company): string {
  const a = responses["A.I.details"] as { cin?: string } | undefined;
  return a?.cin || company.cin || "";
}

// ---- instance builder -----------------------------------------------------

const TAXONOMY_VERSION = "2026-02-28";
const SCHEMA_REF = `https://listing.bseindia.com/xbrl//BRSRTaxonomy/BRSR/in-capmkt-ent-${TAXONOMY_VERSION}.xsd`;

/** Simple measures; divide units are handled separately below. */
const SIMPLE_UNITS: Record<string, string> = {
  MtCO2e: "Non-SI:MtCO2e",
  Gigajoule: "Non-SI:GJ",
  Kiloliters: "in-capmkt-types:kl",
  Tonne: "Non-SI:t",
  INR: "iso4217:INR",
  pure: "xbrli:pure",
};

const DIVIDE_UNITS: Record<string, { num: string; den: string }> = {
  MtCO2ePerINR: { num: "Non-SI:MtCO2e", den: "iso4217:INR" },
  GigajoulePerINR: { num: "Non-SI:GJ", den: "iso4217:INR" },
  KilolitersPerINR: { num: "in-capmkt-types:kl", den: "iso4217:INR" },
  TonnePerINR: { num: "Non-SI:t", den: "iso4217:INR" },
};

export interface XbrlResult {
  xml: string;
  factCount: number;
  skipped: number;
  /** Concepts in the official in-capmkt namespace. */
  mappedCount: number;
  /** Concepts emitted in the esgen extension namespace (not confirmed in the taxonomy). */
  extensionElements: string[];
}

export function buildXbrlInstance(company: Company, report: BrsrReport, responses: ResponseMap): XbrlResult {
  const cy = fyPeriod(report.financial_year);
  const py = cy ? { start: `${Number(cy.start.slice(0, 4)) - 1}-04-01`, end: `${Number(cy.start.slice(0, 4))}-03-31` } : null;
  const cin = readCin(responses, company);
  const scheme = "https://www.sebi.gov.in/in-capmkt/CorporateIdentityNumber";

  const facts: string[] = [];
  const usedUnits = new Set<string>();
  const extension = new Set<string>();
  const mapped = new Set<string>();
  let skipped = 0;

  const emit = (fm: FactMap, period: "current" | "previous") => {
    if (period === "previous" && !py) { skipped++; return; }
    const value = readCell(responses, fm.qKey, fm.rowKey, period);
    if (value == null) { skipped++; return; }
    const ctx = period === "current" ? "DCYMain" : "DPYMain";
    usedUnits.add(fm.unit);
    if (fm.ns === "esgen") extension.add(fm.element); else mapped.add(fm.element);
    facts.push(`  <${fm.ns}:${fm.element} contextRef="${ctx}" unitRef="${fm.unit}" decimals="INF">${value}</${fm.ns}:${fm.element}>`);
  };

  for (const fm of MAPPING) {
    emit(fm, "current");
    emit(fm, "previous");
  }

  // Section A entity facts (all confirmed concepts).
  const entityFacts: string[] = [];
  entityFacts.push(`  <in-capmkt:NameOfTheCompany contextRef="DCYMain">${esc(company.name)}</in-capmkt:NameOfTheCompany>`);
  if (cin) entityFacts.push(`  <in-capmkt:CorporateIdentityNumber contextRef="DCYMain">${esc(cin)}</in-capmkt:CorporateIdentityNumber>`);
  if (cy) {
    entityFacts.push(`  <in-capmkt:DateOfStartOfFinancialYear contextRef="DCYMain">${cy.start}</in-capmkt:DateOfStartOfFinancialYear>`);
    entityFacts.push(`  <in-capmkt:DateOfEndOfFinancialYear contextRef="DCYMain">${cy.end}</in-capmkt:DateOfEndOfFinancialYear>`);
  }
  if (report.reporting_boundary) {
    entityFacts.push(`  <in-capmkt:ReportingBoundary contextRef="DCYMain">${esc(report.reporting_boundary)} basis</in-capmkt:ReportingBoundary>`);
  }
  if (report.turnover != null) {
    usedUnits.add("INR");
    entityFacts.push(`  <in-capmkt:Turnover contextRef="DCYMain" unitRef="INR" decimals="0">${Number(report.turnover)}</in-capmkt:Turnover>`);
  }

  const unitXml = [...usedUnits].map((u) => {
    if (SIMPLE_UNITS[u]) return `  <xbrli:unit id="${u}"><xbrli:measure>${SIMPLE_UNITS[u]}</xbrli:measure></xbrli:unit>`;
    const d = DIVIDE_UNITS[u];
    if (!d) return "";
    return [
      `  <xbrli:unit id="${u}"><xbrli:divide>`,
      `    <xbrli:unitNumerator><xbrli:measure>${d.num}</xbrli:measure></xbrli:unitNumerator>`,
      `    <xbrli:unitDenominator><xbrli:measure>${d.den}</xbrli:measure></xbrli:unitDenominator>`,
      `  </xbrli:divide></xbrli:unit>`,
    ].join("\n");
  }).filter(Boolean);

  const contextBlock = (id: string, p: { start: string; end: string }) => [
    `  <xbrli:context id="${id}">`,
    `    <xbrli:entity><xbrli:identifier scheme="${scheme}">${esc(cin || company.name)}</xbrli:identifier></xbrli:entity>`,
    `    <xbrli:period><xbrli:startDate>${p.start}</xbrli:startDate><xbrli:endDate>${p.end}</xbrli:endDate></xbrli:period>`,
    `  </xbrli:context>`,
  ].join("\n");

  const allFacts = [...entityFacts, ...facts];

  const xml = [
    `<?xml version="1.0" encoding="UTF-8"?>`,
    `<!--`,
    `  BRSR quantitative disclosures, XBRL 2.1 instance prepared by ESGEN.`,
    `  Concepts, contexts (DCYMain/DPYMain) and units follow SEBI's BRSR taxonomy`,
    `  (in-capmkt, version ${TAXONOMY_VERSION}) as used in filed instances. Exchange`,
    `  filings are made through the BSE/NSE XBRL utility (currently Inline XBRL);`,
    `  validate there before filing. Indicative until assured.`,
    `-->`,
    `<xbrli:xbrl`,
    `  xmlns:xbrli="http://www.xbrl.org/2003/instance"`,
    `  xmlns:link="http://www.xbrl.org/2003/linkbase"`,
    `  xmlns:xlink="http://www.w3.org/1999/xlink"`,
    `  xmlns:iso4217="http://www.xbrl.org/2003/iso4217"`,
    `  xmlns:Non-SI="http://www.xbrl.org/2009/utr"`,
    `  xmlns:in-capmkt="https://www.sebi.gov.in/xbrl/${TAXONOMY_VERSION}/in-capmkt"`,
    `  xmlns:in-capmkt-types="https://www.sebi.gov.in/xbrl/${TAXONOMY_VERSION}/in-capmkt-types"`,
    `  xmlns:esgen="https://esgen.co.uk/xbrl/brsr/2024">`,
    `  <link:schemaRef xlink:type="simple" xlink:href="${SCHEMA_REF}"/>`,
    cy ? contextBlock("DCYMain", cy) : `  <!-- financial year "${esc(report.financial_year)}" could not be parsed; contexts omitted -->`,
    py ? contextBlock("DPYMain", py) : "",
    ...unitXml,
    ...allFacts,
    `</xbrli:xbrl>`,
  ].filter(Boolean).join("\n");

  return {
    xml,
    factCount: allFacts.length,
    skipped,
    mappedCount: mapped.size,
    extensionElements: [...extension].sort(),
  };
}

/** Human-readable mapping report so reviewers can see exactly what maps where. */
export function buildMappingCsv(): string {
  const rows = [["Taxonomy concept", "Namespace", "BRSR question", "Row", "Unit", "Label"]];
  for (const fm of MAPPING) {
    rows.push([fm.element, fm.ns === "in-capmkt" ? `in-capmkt (SEBI BRSR taxonomy ${TAXONOMY_VERSION})` : "esgen extension", fm.qKey, fm.rowKey, fm.unit, fm.label]);
  }
  return rows.map((r) => r.map((c) => (/[",\n]/.test(c) ? `"${c.replace(/"/g, '""')}"` : c)).join(",")).join("\n");
}
