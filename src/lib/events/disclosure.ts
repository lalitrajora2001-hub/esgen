import type { ResponseMap } from "@/lib/brsr/db";
import type { EventsData } from "@/lib/events/framework";
import { EVENT_ACTIVITIES } from "@/lib/events/framework";
import { num } from "@/lib/brsr/calc";

/**
 * Draft disclosure text, computed (never hand-typed) from the data entered
 * elsewhere in the workspace. Mirrors the toolkit's own safety rules: no
 * paragraph claims more certainty than the underlying data and evidence
 * support, and nothing here is safe to copy externally until the gate is
 * green.
 */

export interface DisclosureParagraph { id: string; title: string; text: string; level: "missing" | "draft" | "internal" | "ready" }
export interface Disclosure { externalUseOk: boolean; gateMessage: string; paragraphs: DisclosureParagraph[] }

function evAvail(responses: ResponseMap, pillar: "E" | "S" | "G", key: string): string {
  const rows = (responses[`EV.DATA${pillar}.main`] as { rows?: Record<string, Record<string, unknown>> } | undefined)?.rows;
  return (rows?.[key]?.availability as string) ?? "Not yet assessed";
}

function kpiCurrent(responses: ResponseMap, moduleKey: string, id: string): number | null {
  const rows = (responses[`${moduleKey}.main`] as { rows?: Record<string, Record<string, unknown>> } | undefined)?.rows;
  const v = rows?.[id]?.current;
  return v == null || v === "" ? null : num(v as never);
}

const t1 = (n: number) => Math.round(n * 10) / 10;

export function buildDisclosure(d: EventsData, responses: ResponseMap): Disclosure {
  const paras: DisclosureParagraph[] = [];

  // E1 - Carbon & Energy: follows the toolkit's exact five-tier ladder.
  const minimumKeys = EVENT_ACTIVITIES.filter((a) => !a.optional).map((a) => a.key);
  const carbonRows = (responses["EV.CARBON.main"] as { rows?: Record<string, Record<string, unknown>> } | undefined)?.rows ?? {};
  const minimumEntered = minimumKeys.filter((k) => { const v = carbonRows[k]?.input; return v != null && v !== "" && num(v as never) > 0; }).length;
  const carbonEvidence = evAvail(responses, "E", "carbon_scope12");
  if (d.carbon.totalKg === 0) {
    paras.push({ id: "E1", title: "E1 - Carbon & Energy", level: "missing", text: "Data not yet available. Complete the Carbon calculator with energy, fuel and waste activity figures before drafting this section." });
  } else if (minimumEntered === 0) {
    paras.push({ id: "E1", title: "E1 - Carbon & Energy", level: "missing", text: "Optional data only - not a minimum carbon estimate. Enter the minimum activity categories (electricity, gas, mileage, fuel, waste) before disclosing a headline figure." });
  } else if (d.carbon.missingMinimum > 0) {
    paras.push({ id: "E1", title: "E1 - Carbon & Energy", level: "draft", text: `Draft only - partial minimum data. Based on the categories entered so far, estimated Scope 1+2 equivalent emissions are approximately ${t1(d.carbon.totalT)} tCO2e. ${d.carbon.missingMinimum} minimum categor${d.carbon.missingMinimum === 1 ? "y" : "ies"} still need${d.carbon.missingMinimum === 1 ? "s" : ""} data or a recorded "Not available".` });
  } else if (carbonEvidence !== "Available") {
    paras.push({ id: "E1", title: "E1 - Carbon & Energy", level: "internal", text: `Estimated Scope 1+2 equivalent emissions for the reporting period are approximately ${t1(d.carbon.totalT)} tCO2e, calculated from energy, fuel and waste activity data using indicative UK conversion factors. Internal review only - supporting evidence for this figure has not yet been confirmed in Data & Evidence.` });
  } else {
    paras.push({ id: "E1", title: "E1 - Carbon & Energy", level: "ready", text: `Estimated Scope 1+2 equivalent emissions for the reporting period are approximately ${t1(d.carbon.totalT)} tCO2e${d.carbon.perEvent != null ? `, or ${t1(d.carbon.perEvent)} tCO2e per event` : ""}, calculated using indicative UK conversion factors and supported by retained evidence. Ready for supervised management review before any external use.` });
  }

  // E2 - Waste & Water.
  const wasteKg = d.carbon.byGroup["Waste"] ?? 0;
  const waterEv = evAvail(responses, "E", "water_total");
  const wasteEv = evAvail(responses, "E", "waste_stream");
  if (wasteKg === 0 && waterEv === "Not yet assessed") {
    paras.push({ id: "E2", title: "E2 - Waste & Water", level: "missing", text: "Data not yet available. Enter waste and water activity data before drafting this section." });
  } else {
    const ready = wasteEv === "Available" && waterEv !== "Not yet assessed";
    paras.push({ id: "E2", title: "E2 - Waste & Water", level: ready ? "ready" : "internal", text: `Waste-related emissions for the reporting period are approximately ${t1(wasteKg / 1000)} tCO2e from general and recycled waste. ${ready ? "Supported by retained evidence; ready for supervised review." : "Internal review only - confirm evidence in Data & Evidence before external use."}` });
  }

  // E3 - Supply Chain.
  const supEnvEv = evAvail(responses, "E", "sup_env_data");
  if (d.suppliers.total === 0) {
    paras.push({ id: "E3", title: "E3 - Supply Chain", level: "missing", text: "Data not yet available. Assess your key suppliers in Supplier_Assessment before drafting supply-chain disclosure." });
  } else {
    paras.push({ id: "E3", title: "E3 - Supply Chain", level: supEnvEv === "Available" ? "ready" : "internal", text: `${d.suppliers.total} key supplier${d.suppliers.total === 1 ? "" : "s"} assessed for environmental and labour risk; ${d.suppliers.high} flagged high risk. ${supEnvEv === "Available" ? "Supplier environmental data evidence confirmed." : "Supplier environmental data evidence not yet confirmed - internal review only."}` });
  }

  // S1 - Workforce & Inclusion.
  const wfEv = evAvail(responses, "S", "wf_briefing");
  const ks01 = kpiCurrent(responses, "EV.KPIS", "KS01");
  if (ks01 == null && wfEv === "Not yet assessed") {
    paras.push({ id: "S1", title: "S1 - Workforce & Inclusion", level: "missing", text: "Data not yet available. Enter workforce and induction KPI data before drafting this section." });
  } else {
    paras.push({ id: "S1", title: "S1 - Workforce & Inclusion", level: wfEv === "Available" ? "ready" : "internal", text: `${ks01 != null ? `${ks01}% of the workforce received a documented briefing or induction. ` : ""}${wfEv === "Available" ? "Supported by retained evidence; ready for supervised review." : "Internal review only - confirm workforce evidence before external use."}` });
  }

  // S2 - Community & Accessibility.
  const accEv = evAvail(responses, "S", "acc_review");
  const ks07 = kpiCurrent(responses, "EV.KPIS", "KS07");
  if (ks07 == null && accEv === "Not yet assessed") {
    paras.push({ id: "S2", title: "S2 - Community & Accessibility", level: "missing", text: "Data not yet available. Enter community and accessibility KPI data before drafting this section." });
  } else {
    paras.push({ id: "S2", title: "S2 - Community & Accessibility", level: accEv === "Available" ? "ready" : "internal", text: `${ks07 != null ? `${ks07}% of events had a completed accessibility review. ` : ""}${accEv === "Available" ? "Supported by retained evidence." : "Internal review only - confirm accessibility evidence before external use."}` });
  }

  // G1 - Reporting Ownership & Review.
  const ownerArea = d.areas.find((a) => a.key === "owner");
  const soEv = evAvail(responses, "G", "so_pct");
  if (ownerArea?.status === "missing") {
    paras.push({ id: "G1", title: "G1 - Reporting Ownership & Review", level: "missing", text: "Data not yet available. Assign a named sustainability reporting owner in Profile before drafting this section." });
  } else {
    paras.push({ id: "G1", title: "G1 - Reporting Ownership & Review", level: soEv === "Available" ? "ready" : "internal", text: `A named individual is responsible for sustainability reporting. ${soEv === "Available" ? "Sign-off and review evidence confirmed; ready for supervised review." : "Sign-off and review evidence not yet confirmed - internal review only."}` });
  }

  // Boundary & Exclusions.
  const scope = (responses["EV.SCOPE.main"] ?? {}) as Record<string, unknown>;
  if (!scope.included) {
    paras.push({ id: "SCOPE", title: "Boundary & Exclusions Statement", level: "missing", text: "Data not yet available. Complete Scope_Boundary before drafting a boundary statement." });
  } else {
    paras.push({ id: "SCOPE", title: "Boundary & Exclusions Statement", level: scope.confirmed === "Yes" ? "ready" : "internal", text: `This report covers: ${String(scope.included)}.${scope.excluded ? ` Excluded, with reasons: ${String(scope.excluded)}.` : ""} ${scope.confirmed === "Yes" ? "Boundary confirmed." : "Boundary not yet formally confirmed - internal review only."}` });
  }

  // Evidence & Assurance note - always present, reflects live counts.
  paras.push({
    id: "ASSURANCE", title: "Evidence & Assurance Note", level: d.status === "copy_safe" ? "ready" : "internal",
    text: `Of 35 tracked data and evidence items, ${d.evidence.available} are confirmed available, ${d.evidence.partial} partially available, ${d.evidence.notAvailable} not available and ${d.evidence.notAssessed} not yet assessed. This report is for internal draft use only. Evidence means a document, record, invoice, log or policy supporting a claim; assurance means independent or second-person review of evidence and disclosure wording. No independent assurance has been obtained unless separately confirmed.`,
  });

  return {
    externalUseOk: d.status === "copy_safe",
    gateMessage: d.status === "copy_safe"
      ? "Final Readiness Gate is clear. This draft may be used internally and, once management/legal have reviewed it, externally."
      : "Do not copy this text into an external report. The Final Readiness Gate has red or amber items outstanding - see the Dashboard for blockers.",
    paragraphs: paras,
  };
}
