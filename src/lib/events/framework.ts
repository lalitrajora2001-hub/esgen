import type { FrameworkDef, ModuleDef, QuestionDef } from "@/lib/brsr/types";
import type { ResponseMap, BrsrReport } from "@/lib/brsr/db";
import { num } from "@/lib/brsr/calc";

/**
 * UK Event SME ESG toolkit encoded as a framework definition, reusing the same
 * engine as BRSR. Source: UK_Event_ESG_Toolkit v35.6 (ISO 20121-aligned).
 * Readiness questions are adaptive: relevance depends on the event type chosen
 * in the profile. Factors are the toolkit's indicative UK values (kgCO2e/unit).
 */

export const EVENTS_VERSION = "EVENTS-UK-1";

export type EventType = "Festival / Public Live Event" | "Conference / Convention" | "Exhibition / Trade Show" | "Venue Operator" | "Wedding / Private Events" | "Agency / Production / Logistics";
const EVENT_TYPES: EventType[] = ["Festival / Public Live Event", "Conference / Convention", "Exhibition / Trade Show", "Venue Operator", "Wedding / Private Events", "Agency / Production / Logistics"];
const YN = ["Yes", "No"];
const YPN = ["Yes", "Partial", "No"];

// Relevance per event type (Festival, Conference, Exhibition, Venue, Wedding, Agency). NA = excluded from scoring.
type Rel = "Core" | "Deep" | "Medium" | "Light" | "NA";
export const RELEVANCE: Record<string, Rel[]> = {
  E01: ["Core","Core","Core","Core","Core","Core"], E02: ["Deep","Medium","Medium","Light","Light","NA"],
  E03: ["Core","Core","Core","Core","Core","Core"], E04: ["Deep","Medium","Medium","Medium","Light","Light"],
  E05: ["Deep","Medium","Medium","Deep","Light","Light"], E06: ["Core","Core","Core","Core","Core","Core"],
  E07: ["Deep","Medium","Medium","Medium","Light","Light"], E08: ["Deep","Medium","Deep","Medium","Light","Deep"],
  E09: ["Core","Core","Core","Core","Core","Core"], E10: ["Core","Core","Core","Core","Core","Core"],
  S01: ["Core","Core","Core","Core","Core","Core"], S02: ["Core","Core","Core","Core","Core","Core"],
  S03: ["Core","Core","Core","Core","Core","Core"], S04: ["Core","Core","Core","Core","Core","Core"],
  S05: ["Core","Core","Core","Core","Core","Core"], S06: ["Core","Core","Core","Core","Core","Core"],
  S07: ["Core","Core","Core","Core","Core","Core"], S08: ["Core","Core","Core","Core","Core","Core"],
  S09: ["Core","Core","Core","Deep","Medium","Light"], S10: ["Medium","Medium","Medium","Deep","Medium","NA"],
  S11: ["Deep","Light","Light","Medium","Light","NA"], S12: ["Deep","NA","NA","Medium","Light","NA"],
  S13: ["Deep","Medium","Medium","Medium","Medium","NA"], S14: ["Deep","Light","Light","Medium","Medium","NA"],
  S15: ["Core","Core","Core","Core","Core","Core"], S16: ["Core","Core","Core","Core","Core","Core"],
  S17: ["Medium","Medium","Medium","Medium","Medium","Deep"],
  G01: ["Core","Core","Core","Core","Core","Core"], G02: ["Core","Core","Core","Core","Core","Core"],
  G03: ["Core","Core","Core","Core","Core","Core"], G04: ["Core","Core","Core","Core","Core","Core"],
  G05: ["Core","Core","Core","Core","Core","Core"], G06: ["Core","Core","Core","Core","Core","Core"],
  G07: ["Core","Core","Core","Core","Core","Core"], G08: ["Medium","Medium","Medium","Medium","Light","Light"],
  G09: ["Core","Core","Core","Core","Core","Core"],
  P01: ["Core","Core","Core","Core","Core","Core"], P02: ["Core","Core","Core","Core","Core","Core"],
  P03: ["Core","Core","Core","Core","Core","Core"], P04: ["Core","Core","Core","Core","Core","Core"],
  P05: ["Medium","Medium","Medium","Medium","Medium","Medium"], P06: ["Medium","Medium","Medium","Medium","Light","Medium"],
  P07: ["Medium","Medium","Medium","Medium","Light","Medium"], P08: ["Medium","Medium","Medium","Medium","Light","Medium"],
  P09: ["Core","Core","Core","Core","Core","Core"],
};

// Topic group per readiness question (from the toolkit's question bank) - used
// to find the weakest / strongest topic on the dashboard.
export const TOPIC_GROUP: Record<string, string> = {
  E01: "Carbon", E02: "Carbon", E03: "Energy", E04: "Energy", E05: "Water", E06: "Waste", E07: "Waste",
  E08: "Travel", E09: "Supplier Env", E10: "Scope",
  S01: "Workforce", S02: "Workforce", S03: "Workforce", S04: "Wellbeing", S05: "Wellbeing",
  S06: "H&S", S07: "H&S", S08: "H&S", S09: "Accessibility", S10: "Accessibility",
  S11: "Community", S12: "Community", S13: "Attendee", S14: "Safeguarding",
  S15: "Supplier Social", S16: "Supplier Social", S17: "Contractor Labour",
  G01: "Ownership", G02: "Ownership", G03: "Sign-off", G04: "Sign-off", G05: "Evidence",
  G06: "Evidence", G07: "Policy", G08: "Assurance", G09: "Correction",
  P01: "Scope", P02: "Scope", P03: "Data Mgmt", P04: "Data Mgmt", P05: "Data Mgmt",
  P06: "Supplier Data", P07: "Disclosure", P08: "Comparison", P09: "Assumptions",
};

function rq(id: string, title: string, evidence = false): QuestionDef {
  return {
    key: `EV.${id}`, code: id, section: "A", title, kind: "fields", evidence,
    fields: [{ key: "answer", label: "Answer", type: "enum", options: YPN }],
  };
}

const profile: ModuleDef = {
  key: "EV.PROFILE", navLabel: "Profile", section: "A", title: "Organisation profile",
  intro: "The event type drives which readiness questions count for you. Denominators here feed the carbon intensity figures.",
  subsections: [{ key: "p", title: "Profile", questions: [{
    key: "EV.PROFILE.main", section: "A", title: "Organisation and reporting profile", kind: "fields",
    fields: [
      { key: "event_type", label: "Event type (drives relevance)", type: "enum", options: EVENT_TYPES },
      { key: "size_band", label: "SME size band", type: "enum", options: ["Micro (under 10)", "Small (10-49)", "Medium (50-249)"] },
      { key: "business_model", label: "Main business model", type: "text" },
      { key: "events_per_year", label: "Events per year (approx.)", type: "number" },
      { key: "event_days", label: "Total event days", type: "number" },
      { key: "attendees", label: "Total attendees (approx.)", type: "number" },
      { key: "staff", label: "Permanent staff count", type: "number" },
      { key: "freelancers", label: "Freelance / casual workers (approx.)", type: "number" },
      { key: "own_venue", label: "Uses own venue?", type: "enum", options: YN },
      { key: "third_party_venue", label: "Uses third-party venues?", type: "enum", options: YN },
      { key: "reporting_owner", label: "Sustainability reporting owner", type: "text", help: "A named person or role. Placeholders like 'TBC' count as not assigned." },
      { key: "period_start", label: "Reporting period start", type: "date" },
      { key: "period_end", label: "Reporting period end", type: "date" },
    ],
  }] }],
};

const readinessE: ModuleDef = {
  key: "EV.RE", navLabel: "Readiness: Environment", section: "A", title: "Environmental readiness",
  subsections: [{ key: "e", title: "Answer Yes / Partial / No", questions: [
    rq("E01", "Do you track scope 1 and 2 emissions for your events?", true),
    rq("E02", "Do you estimate emissions from attendee travel?"),
    rq("E03", "Do you track energy consumption (kWh) at events?", true),
    rq("E04", "Do you have energy reduction targets in place?"),
    rq("E05", "Do you track water use at events?"),
    rq("E06", "Do you track waste generated and recycled at events?", true),
    rq("E07", "Do you have a waste diversion / recycling target?"),
    rq("E08", "Do you track logistics / transport for event delivery?"),
    rq("E09", "Do you ask key suppliers for environmental data?", true),
    rq("E10", "Have you defined your reporting boundary and exclusions?", true),
  ] }],
};

const readinessS: ModuleDef = {
  key: "EV.RS", navLabel: "Readiness: Social", section: "A", title: "Social readiness",
  subsections: [{ key: "s", title: "Answer Yes / Partial / No", questions: [
    rq("S01", "Do you maintain a workforce record covering staff and freelancers?", true),
    rq("S02", "Do freelancers receive written role expectations before engagement?", true),
    rq("S03", "Are workers paid on agreed terms and within agreed timescales?", true),
    rq("S04", "Do you consider workload, fatigue and wellbeing risks for staff and freelancers?", true),
    rq("S05", "Is there a process for raising mental health or wellbeing concerns during intensive periods?", true),
    rq("S06", "Is an event-specific health and safety assessment completed before each event?", true),
    rq("S07", "Are incidents and near misses recorded and reviewed?", true),
    rq("S08", "Is there a named person responsible for safety at each event?", true),
    rq("S09", "Is a basic accessibility review completed for events?", true),
    rq("S10", "Do you actively address accessibility requests from attendees or participants?"),
    rq("S11", "Do you assess community or local disruption risk before events?"),
    rq("S12", "Do you engage with local residents or neighbours before / after events?"),
    rq("S13", "Do you have welfare or wellbeing provisions for attendees?"),
    rq("S14", "Is there a safeguarding or crowd welfare policy in place?"),
    rq("S15", "Do key suppliers confirm labour and safety expectations?", true),
    rq("S16", "Do you retain supplier social information (e.g. policies)?", true),
    rq("S17", "Do you assess contractor labour chain risks for critical suppliers?"),
  ] }],
};

const readinessG: ModuleDef = {
  key: "EV.RG", navLabel: "Readiness: Governance", section: "A", title: "Governance readiness",
  subsections: [{ key: "g", title: "Answer Yes / Partial / No", questions: [
    rq("G01", "Is there a named person responsible for sustainability reporting?", true),
    rq("G02", "Are reporting roles documented and communicated internally?", true),
    rq("G03", "Is there a review process before any sustainability information is shared externally?", true),
    rq("G04", "Is there a named sign-off authority for sustainability disclosures?", true),
    rq("G05", "Is supporting evidence retained for all reported figures?", true),
    rq("G06", "Are figures traceable back to their original source?", true),
    rq("G07", "Is there a written sustainability or ESG policy in place?", true),
    rq("G08", "Is there any form of independent review or challenge for sustainability disclosures?"),
    rq("G09", "Is there a process for identifying and correcting errors before publication?", true),
  ] }],
};

const readinessP: ModuleDef = {
  key: "EV.RP", navLabel: "Readiness: Process", section: "A", title: "Process readiness",
  subsections: [{ key: "p", title: "Answer Yes / Partial / No", questions: [
    rq("P01", "Is your reporting period clearly defined?", true),
    rq("P02", "Are scope exclusions documented with reasons?", true),
    rq("P03", "Are data owners identified for each reporting area?", true),
    rq("P04", "Are evidence requirements understood by data owners?", true),
    rq("P05", "Are KPI definitions standardised and consistent year-on-year?"),
    rq("P06", "Is there a process for requesting data from key suppliers?"),
    rq("P07", "Is there a drafting and review process for disclosures?"),
    rq("P08", "Is a prior-year comparison possible for key metrics?"),
    rq("P09", "Are assumptions and estimation methods recorded?", true),
  ] }],
};

const scope: ModuleDef = {
  key: "EV.SCOPE", navLabel: "Scope boundary", section: "A", title: "Scope boundary",
  subsections: [{ key: "s", title: "What is in and out of this report", questions: [{
    key: "EV.SCOPE.main", section: "A", title: "Boundary and exclusions", kind: "fields", evidence: true,
    fields: [
      { key: "included", label: "Included in this report", type: "longtext", help: "e.g. all UK events delivered in the period, office energy, own logistics." },
      { key: "excluded", label: "Excluded, with reasons", type: "longtext", help: "e.g. attendee travel (no data yet), overseas events." },
      { key: "confirmed", label: "Boundary confirmed before data entry?", type: "enum", options: YN },
    ],
  }] }],
};

// Carbon calculator activities: toolkit's indicative UK factors, kgCO2e per unit.
export const EVENT_ACTIVITIES: { key: string; label: string; unit: string; factor: number; optional?: boolean; group: string }[] = [
  { key: "electricity", label: "Electricity used", unit: "kWh", factor: 0.207, group: "Energy" },
  { key: "gas", label: "Gas used", unit: "kWh", factor: 0.183, group: "Energy" },
  { key: "mileage", label: "Company car / van mileage", unit: "miles", factor: 0.273, group: "Fuel / transport" },
  { key: "fuel", label: "Diesel / petrol fuel used", unit: "litres", factor: 2.35, group: "Fuel / transport" },
  { key: "waste_general", label: "General waste", unit: "kg", factor: 0.467, group: "Waste" },
  { key: "waste_recycled", label: "Recycled waste", unit: "kg", factor: 0.021, group: "Waste" },
  { key: "water", label: "Water used", unit: "m3", factor: 0.149, optional: true, group: "Optional" },
  { key: "attendee_travel", label: "Attendee travel estimate", unit: "miles", factor: 0.168, optional: true, group: "Optional" },
  { key: "hotel_nights", label: "Hotel nights", unit: "nights", factor: 21.3, optional: true, group: "Optional" },
  { key: "supplier_delivery", label: "Supplier delivery mileage", unit: "miles", factor: 0.273, optional: true, group: "Optional" },
  { key: "venue_data", label: "Venue-provided emissions", unit: "kgCO2e", factor: 1, optional: true, group: "Optional" },
];

const QUALITY = ["Complete - evidence confirmed", "Complete estimate", "Partial", "Not available"];

const carbon: ModuleDef = {
  key: "EV.CARBON", navLabel: "Carbon calculator", section: "A", title: "Carbon calculator",
  intro: "Enter simple activity data (kWh, litres, miles, kg). Emissions are computed with the toolkit's indicative UK factors; update factors annually. Do not guess: mark unknown rows Not available.",
  subsections: [{ key: "c", title: "Activity data for the reporting period", questions: [{
    key: "EV.CARBON.main", section: "A", title: "Activity inputs", kind: "table", evidence: true,
    evidenceHint: "Bills, meter readings, mileage logs, fuel receipts, waste contractor reports",
    table: {
      columns: [
        { key: "input", label: "Amount", type: "number" },
        { key: "source", label: "Evidence source", type: "text" },
        { key: "quality", label: "Data quality", type: "enum", options: QUALITY },
      ],
      rows: EVENT_ACTIVITIES.map((a) => ({ key: a.key, label: `${a.label} (${a.unit}, x ${a.factor})`, group: a.optional ? "Optional - only if available" : "Minimum estimate" })),
    },
  }] }],
};

function kpiTable(key: string, navLabel: string, title: string, rows: { key: string; label: string; unit: string }[]): ModuleDef {
  return {
    key, navLabel, section: "A", title,
    intro: "Enter prior year (if known), current year and target. Percentages as 65 for 65%.",
    subsections: [{ key: "k", title, questions: [{
      key: `${key}.main`, section: "A", title: "KPIs", kind: "table", evidence: true,
      table: {
        columns: [
          { key: "prior", label: "Prior year", type: "number" },
          { key: "current", label: "Current year", type: "number" },
          { key: "target", label: "Target", type: "number" },
          { key: "evidence", label: "Evidence complete?", type: "enum", options: YN },
          { key: "owner", label: "Owner / notes", type: "text" },
        ],
        rows: rows.map((r) => ({ key: r.key, label: `${r.label} (${r.unit})` })),
      },
    }] }],
  };
}

export const KPI_DIRECTION: Record<string, "lower" | "higher"> = {
  KE01: "lower", KE02: "lower", KE03: "lower", KE04: "lower", KE05: "higher", KE06: "lower", KE07: "lower", KE08: "higher", KE09: "higher", KE10: "lower",
  KS01: "higher", KS02: "higher", KS03: "lower", KS04: "higher", KS05: "higher", KS06: "higher", KS07: "higher", KS08: "higher", KS09: "lower", KS10: "higher", KS11: "higher",
  KG02: "higher", KG03: "higher", KG04: "higher", KG05: "higher", KG06: "higher",
};

const kpiE = kpiTable("EV.KPIE", "KPIs: Environment", "Environmental KPIs", [
  { key: "KE01", label: "Total estimated GHG emissions (scope 1+2)", unit: "tCO2e" },
  { key: "KE02", label: "Emissions per event", unit: "tCO2e" },
  { key: "KE03", label: "Total energy use (electricity + fuel)", unit: "kWh" },
  { key: "KE04", label: "Energy use per event", unit: "kWh" },
  { key: "KE05", label: "Renewable energy proportion", unit: "%" },
  { key: "KE06", label: "Total water use", unit: "m3" },
  { key: "KE07", label: "Total waste generated", unit: "tonnes" },
  { key: "KE08", label: "Waste diverted from landfill", unit: "%" },
  { key: "KE09", label: "Supplier environmental data coverage", unit: "%" },
  { key: "KE10", label: "Fleet / event logistics emissions", unit: "tCO2e" },
]);
const kpiS = kpiTable("EV.KPIS", "KPIs: Social", "Social KPIs", [
  { key: "KS01", label: "Workforce with documented briefing / induction", unit: "%" },
  { key: "KS02", label: "Workers paid on agreed terms", unit: "%" },
  { key: "KS03", label: "Safety incidents (incl. reportable)", unit: "count" },
  { key: "KS04", label: "Near misses recorded", unit: "count" },
  { key: "KS05", label: "Events with completed H&S assessment", unit: "%" },
  { key: "KS06", label: "Events with attendee welfare arrangements", unit: "%" },
  { key: "KS07", label: "Events with accessibility review completed", unit: "%" },
  { key: "KS08", label: "Accessibility requests received", unit: "count" },
  { key: "KS09", label: "Community complaints", unit: "count" },
  { key: "KS10", label: "Key suppliers with labour / safety information", unit: "%" },
  { key: "KS11", label: "Events where fatigue / wellbeing risk considered", unit: "%" },
]);
const kpiG = kpiTable("EV.KPIG", "KPIs: Governance", "Governance KPIs", [
  { key: "KG01", label: "Named sustainability reporting owner in place (1 = yes)", unit: "yes/no" },
  { key: "KG02", label: "Reporting areas with named data owner", unit: "%" },
  { key: "KG03", label: "Disclosures reviewed before external issue", unit: "%" },
  { key: "KG04", label: "Reports with documented sign-off", unit: "%" },
  { key: "KG05", label: "KPI figures with traceable evidence", unit: "%" },
  { key: "KG06", label: "Reporting areas with written process", unit: "%" },
  { key: "KG08", label: "Written sustainability / ESG policy in place (1 = yes)", unit: "yes/no" },
  { key: "KG09", label: "Named sign-off authority for disclosures (1 = yes)", unit: "yes/no" },
  { key: "KG10", label: "Incidents / corrections process documented (1 = yes)", unit: "yes/no" },
]);

// ---- Data & Evidence tracker (35 items: 13 environmental, 13 social, 9 governance) ----

const AVAILABILITY = ["Available", "Partially available", "Not available", "Not yet assessed"];
const PRIORITY = ["Urgent now", "Soon", "Later", "Not urgent"];

interface EvidenceItem { key: string; topic: string; label: string; unit: string }

export const EVIDENCE_ITEMS: { pillar: "E" | "S" | "G"; items: EvidenceItem[] }[] = [
  { pillar: "E", items: [
    { key: "carbon_scope12", topic: "Carbon & Emissions", label: "Total estimated GHG emissions (scope 1+2)", unit: "tCO2e" },
    { key: "carbon_scope3", topic: "Carbon & Emissions", label: "Scope 3 travel emissions (if in scope)", unit: "tCO2e" },
    { key: "energy_elec", topic: "Energy", label: "Total electricity consumed", unit: "kWh" },
    { key: "energy_gas", topic: "Energy", label: "Total gas / fuel consumed", unit: "kWh or litres" },
    { key: "energy_renew", topic: "Energy", label: "Renewable energy proportion", unit: "% or kWh" },
    { key: "water_total", topic: "Water", label: "Total water consumed", unit: "m3" },
    { key: "waste_stream", topic: "Waste", label: "Total waste generated by stream", unit: "tonnes" },
    { key: "waste_diverted", topic: "Waste", label: "Waste diverted from landfill", unit: "tonnes or %" },
    { key: "waste_hazardous", topic: "Waste", label: "Hazardous waste (if applicable)", unit: "tonnes" },
    { key: "travel_fleet", topic: "Travel & Logistics", label: "Fleet vehicle fuel use", unit: "litres" },
    { key: "travel_business", topic: "Travel & Logistics", label: "Business travel (air/rail)", unit: "miles or £" },
    { key: "sup_env_policy", topic: "Supplier Environmental", label: "% key suppliers with environmental policy", unit: "% or count" },
    { key: "sup_env_data", topic: "Supplier Environmental", label: "% key suppliers providing emissions data", unit: "% or count" },
  ] },
  { pillar: "S", items: [
    { key: "wf_headcount", topic: "Workforce & Fair Engagement", label: "Total headcount (permanent + freelance)", unit: "count" },
    { key: "wf_briefing", topic: "Workforce & Fair Engagement", label: "Workers with documented briefing / induction", unit: "% or count" },
    { key: "wf_paid", topic: "Workforce & Fair Engagement", label: "Workers paid on agreed terms and timescales", unit: "%" },
    { key: "wb_fatigue", topic: "Fatigue, Wellbeing & Mental Health", label: "Workload / fatigue risks considered in planning", unit: "Yes/No/Partial" },
    { key: "wb_process", topic: "Fatigue, Wellbeing & Mental Health", label: "Process for raising wellbeing concerns", unit: "Yes/No/Partial" },
    { key: "hs_incidents", topic: "Health & Safety", label: "Safety incidents (RIDDOR + non-RIDDOR)", unit: "count" },
    { key: "hs_nearmiss", topic: "Health & Safety", label: "Near misses recorded", unit: "count" },
    { key: "hs_assessment", topic: "Health & Safety", label: "Events with H&S assessment completed", unit: "%" },
    { key: "acc_review", topic: "Accessibility & Inclusion", label: "Events with accessibility review completed", unit: "%" },
    { key: "acc_requests", topic: "Accessibility & Inclusion", label: "Accessibility requests received and addressed", unit: "count" },
    { key: "com_complaints", topic: "Community Impact", label: "Community / resident complaints", unit: "count" },
    { key: "com_engagement", topic: "Community Impact", label: "Community engagement pre/post event", unit: "Yes/No/Partial" },
    { key: "sup_soc_labour", topic: "Supplier Social", label: "Key suppliers confirming labour/safety expectations", unit: "% or count" },
  ] },
  { pillar: "G", items: [
    { key: "own_named", topic: "Reporting Ownership", label: "Named individual responsible for sustainability reporting", unit: "name" },
    { key: "own_pct", topic: "Reporting Ownership", label: "Reporting areas with a named data owner", unit: "%" },
    { key: "pol_esg", topic: "Policies", label: "Written sustainability / ESG policy in place", unit: "Yes/No/Draft" },
    { key: "pol_hs", topic: "Policies", label: "Health & safety policy", unit: "Yes/No" },
    { key: "so_pct", topic: "Sign-off & Review", label: "Disclosures reviewed before external sharing", unit: "%" },
    { key: "so_named", topic: "Sign-off & Review", label: "Named sign-off authority for ESG disclosures", unit: "name" },
    { key: "ev_storage", topic: "Evidence Control", label: "Evidence storage location and format", unit: "description" },
    { key: "ev_traceable", topic: "Evidence Control", label: "KPI figures traceable to source data", unit: "%" },
    { key: "assurance", topic: "Assurance", label: "Independent review / challenge of disclosures", unit: "Yes/No/Partial" },
  ] },
];

function evidenceModule(pillar: "E" | "S" | "G", navLabel: string, title: string): ModuleDef {
  const items = EVIDENCE_ITEMS.find((p) => p.pillar === pillar)!.items;
  return {
    key: `EV.DATA${pillar}`, navLabel, section: "A", title,
    intro: "Record what evidence you hold for each data item. This is what an assurer or funder will ask to see.",
    subsections: [{ key: "d", title: "Data & evidence requirements", questions: [{
      key: `EV.DATA${pillar}.main`, section: "A", title: "Evidence", kind: "table",
      table: {
        columns: [
          { key: "availability", label: "Current availability", type: "enum", options: AVAILABILITY },
          { key: "priority", label: "Priority", type: "enum", options: PRIORITY },
          { key: "notes", label: "Notes / gap action", type: "text" },
        ],
        rows: items.map((i) => ({ key: i.key, label: `${i.label} (${i.unit})`, group: i.topic })),
      },
    }] }],
  };
}

const evidenceE = evidenceModule("E", "Data & evidence: Environment", "Environmental data & evidence");
const evidenceS = evidenceModule("S", "Data & evidence: Social", "Social data & evidence");
const evidenceG = evidenceModule("G", "Data & evidence: Governance", "Governance data & evidence");

const suppliers: ModuleDef = {
  key: "EV.SUP", navLabel: "Supplier assessment", section: "A", title: "Supplier mini-assessment",
  intro: "Assess your most important suppliers only (start with the 3-5 most critical). Risk flags are computed automatically.",
  subsections: [{ key: "s", title: "Key suppliers", questions: [{
    key: "EV.SUP.main", section: "A", title: "Suppliers", kind: "table",
    table: {
      dynamic: true, addLabel: "Add supplier",
      columns: [
        { key: "name", label: "Supplier name", type: "text" },
        { key: "type", label: "Type", type: "enum", options: ["Venue", "Catering", "Production / staging", "AV / technical", "Security", "Waste", "Transport / logistics", "Other"] },
        { key: "critical", label: "Critical?", type: "enum", options: YN },
        { key: "env", label: "Env data?", type: "enum", options: YPN },
        { key: "labour", label: "Labour / safety policy?", type: "enum", options: YN },
        { key: "sustain", label: "Sustainability policy?", type: "enum", options: YN },
        { key: "carbon", label: "Carbon data?", type: "enum", options: YPN },
        { key: "followup", label: "Follow-up required?", type: "enum", options: YN },
        { key: "notes", label: "Notes", type: "text" },
      ],
    },
  }] }],
};

const actions: ModuleDef = {
  key: "EV.ACT", navLabel: "Action plan", section: "A", title: "Action plan",
  intro: "Convert gaps into owners, due dates and next steps, then re-check the dashboard.",
  subsections: [{ key: "a", title: "Actions", questions: [{
    key: "EV.ACT.main", section: "A", title: "Actions", kind: "table",
    table: {
      dynamic: true, addLabel: "Add action",
      columns: [
        { key: "gap", label: "Gap / issue", type: "text" },
        { key: "action", label: "Action", type: "text" },
        { key: "owner", label: "Owner", type: "text" },
        { key: "due", label: "Due date", type: "date" },
        { key: "status", label: "Status", type: "enum", options: ["Open", "In progress", "Done"] },
      ],
    },
  }] }],
};

export const EVENTS: FrameworkDef = {
  version: EVENTS_VERSION,
  label: "UK Event SME ESG toolkit (ISO 20121-aligned)",
  modules: [
    profile, readinessE, readinessS, readinessG, readinessP, scope,
    evidenceE, evidenceS, evidenceG,
    carbon, kpiE, kpiS, kpiG, suppliers, actions,
  ],
};

// ---- computed insights ----------------------------------------------------

const SCORE: Record<string, number> = { Yes: 2, Partial: 1, No: 0 };
const typeIndex = (t: string | undefined): number => Math.max(0, EVENT_TYPES.indexOf((t ?? "") as EventType));

export type AreaStatus = "complete" | "partial" | "missing";
export interface AreaCheck { key: string; label: string; status: AreaStatus; message: string; jump: string }

export interface EventsData {
  eventType: string | null;
  pillars: { key: string; label: string; answered: number; relevant: number; score: number; max: number; pct: number | null }[];
  overallPct: number | null;
  status: "not_ready" | "internal_draft" | "ready_for_review" | "copy_safe";
  carbon: { totalKg: number; totalT: number; byGroup: Record<string, number>; perEvent: number | null; perDay: number | null; perAttendee: number | null; missingMinimum: number };
  suppliers: { total: number; high: number; medium: number; low: number; followups: number };
  kpis: { onTrack: number; offTrack: number; noTarget: number };
  evidence: { available: number; partial: number; notAvailable: number; notAssessed: number; total: number; mostAffectedTopic: string | null };
  areas: AreaCheck[];
  blockers: AreaCheck[];
  weakestTopic: { label: string; pct: number } | null;
  strongestTopic: { label: string; pct: number } | null;
}

export function eventsData(responses: ResponseMap, _report: BrsrReport): EventsData {
  const prof = (responses["EV.PROFILE.main"] ?? {}) as Record<string, unknown>;
  const ti = typeIndex(prof.event_type as string);

  const pillarDefs = [
    { key: "E", label: "Environment", mod: readinessE }, { key: "S", label: "Social", mod: readinessS },
    { key: "G", label: "Governance", mod: readinessG }, { key: "P", label: "Process", mod: readinessP },
  ];
  const pillars = pillarDefs.map((p) => {
    let answered = 0, relevant = 0, score = 0, max = 0;
    for (const q of p.mod.subsections[0].questions) {
      const id = q.code!;
      if ((RELEVANCE[id]?.[ti] ?? "Core") === "NA") continue;
      relevant++;
      max += 2;
      const a = (responses[q.key] as { answer?: string } | undefined)?.answer;
      if (a) { answered++; score += SCORE[a] ?? 0; }
    }
    return { key: p.key, label: p.label, answered, relevant, score, max, pct: answered > 0 ? (score / max) * 100 : null };
  });
  const totScore = pillars.reduce((a, p) => a + p.score, 0);
  const totMax = pillars.reduce((a, p) => a + p.max, 0);
  const totAnswered = pillars.reduce((a, p) => a + p.answered, 0);
  const totRelevant = pillars.reduce((a, p) => a + p.relevant, 0);
  const overallPct = totAnswered > 0 ? (totScore / totMax) * 100 : null;

  // Carbon.
  const carbonRows = ((responses["EV.CARBON.main"] as { rows?: Record<string, Record<string, unknown>> })?.rows) ?? {};
  let totalKg = 0, missingMinimum = 0;
  const byGroup: Record<string, number> = {};
  for (const a of EVENT_ACTIVITIES) {
    const row = carbonRows[a.key];
    const v = row?.input == null || row.input === "" ? null : num(row.input as never);
    if (v != null && v > 0) {
      const kg = v * a.factor;
      totalKg += kg;
      byGroup[a.group] = (byGroup[a.group] ?? 0) + kg;
    } else if (!a.optional && (row?.quality as string) !== "Not available") {
      missingMinimum++;
    }
  }
  const div = (d: unknown): number | null => { const n = num(d as never); return Number.isFinite(n) && n > 0 ? totalKg / 1000 / n : null; };

  // Suppliers.
  const supRows = (((responses["EV.SUP.main"] as { list?: Record<string, unknown>[] })?.list) ?? []).filter((r) => (r.name as string)?.trim());
  let high = 0, medium = 0, low = 0, followups = 0;
  for (const r of supRows) {
    const critical = r.critical === "Yes";
    const envNo = r.env === "No", labourNo = r.labour === "No";
    const partial = r.env === "Partial" || r.carbon === "Partial" || r.sustain === "No";
    if (r.followup === "Yes") followups++;
    if (critical && (envNo || labourNo)) high++;
    else if (r.followup === "Yes" || partial || envNo || labourNo) medium++;
    else low++;
  }

  // KPI on-track: compare current vs target with direction.
  let onTrack = 0, offTrack = 0, noTarget = 0;
  for (const mod of [kpiE, kpiS, kpiG]) {
    const rows = ((responses[`${mod.key}.main`] as { rows?: Record<string, Record<string, unknown>> })?.rows) ?? {};
    for (const [id, r] of Object.entries(rows)) {
      const cur = r.current == null || r.current === "" ? null : num(r.current as never);
      const tgt = r.target == null || r.target === "" ? null : num(r.target as never);
      if (cur == null) continue;
      if (tgt == null) { noTarget++; continue; }
      const dir = KPI_DIRECTION[id];
      if (!dir) { noTarget++; continue; }
      const ok = dir === "lower" ? cur <= tgt : cur >= tgt;
      if (ok) onTrack++; else offTrack++;
    }
  }

  const complete = totRelevant > 0 && totAnswered === totRelevant;
  const status: EventsData["status"] =
    overallPct == null || overallPct < 40 ? "not_ready"
    : !complete || missingMinimum > 0 ? "internal_draft"
    : overallPct < 70 ? "ready_for_review"
    : "copy_safe";

  // Weakest / strongest readiness topic (across all four pillars, answered only).
  const topicScore = new Map<string, { score: number; max: number }>();
  for (const mod of [readinessE, readinessS, readinessG, readinessP]) {
    for (const q of mod.subsections[0].questions) {
      const id = q.code!;
      if ((RELEVANCE[id]?.[ti] ?? "Core") === "NA") continue;
      const a = (responses[q.key] as { answer?: string } | undefined)?.answer;
      if (!a) continue;
      const topic = TOPIC_GROUP[id] ?? id;
      const t = topicScore.get(topic) ?? { score: 0, max: 0 };
      t.score += SCORE[a] ?? 0; t.max += 2;
      topicScore.set(topic, t);
    }
  }
  const topicPct = [...topicScore.entries()].map(([label, v]) => ({ label, pct: (v.score / v.max) * 100 }));
  const weakestTopic = topicPct.length ? topicPct.reduce((a, b) => (b.pct < a.pct ? b : a)) : null;
  const strongestTopic = topicPct.length ? topicPct.reduce((a, b) => (b.pct > a.pct ? b : a)) : null;

  // Evidence rollup across the 35 data & evidence items.
  let available = 0, partial = 0, notAvailable = 0, notAssessed = 0;
  const topicGaps = new Map<string, number>();
  for (const p of EVIDENCE_ITEMS) {
    const rows = ((responses[`EV.DATA${p.pillar}.main`] as { rows?: Record<string, Record<string, unknown>> })?.rows) ?? {};
    for (const item of p.items) {
      const v = (rows[item.key]?.availability as string) ?? "Not yet assessed";
      if (v === "Available") available++;
      else if (v === "Partially available") { partial++; topicGaps.set(item.topic, (topicGaps.get(item.topic) ?? 0) + 1); }
      else if (v === "Not available") { notAvailable++; topicGaps.set(item.topic, (topicGaps.get(item.topic) ?? 0) + 1); }
      else { notAssessed++; topicGaps.set(item.topic, (topicGaps.get(item.topic) ?? 0) + 1); }
    }
  }
  const evidenceTotal = EVIDENCE_ITEMS.reduce((a, p) => a + p.items.length, 0);
  let mostAffectedTopic: string | null = null, worstGap = 0;
  for (const [topic, n] of topicGaps) if (n > worstGap) { worstGap = n; mostAffectedTopic = topic; }

  // KPI inputs: how many rows (across all three KPI tables) have a current value entered.
  let kpiRowsTotal = 0, kpiRowsEntered = 0;
  for (const mod of [kpiE, kpiS, kpiG]) {
    const rows = ((responses[`${mod.key}.main`] as { rows?: Record<string, Record<string, unknown>> })?.rows) ?? {};
    const defRows = mod.subsections[0].questions[0].table!.rows ?? [];
    kpiRowsTotal += defRows.length;
    for (const r of defRows) {
      const cur = rows[r.key]?.current;
      if (cur != null && cur !== "") kpiRowsEntered++;
    }
  }

  const scopeVal = (responses["EV.SCOPE.main"] ?? {}) as Record<string, unknown>;
  const ownerRaw = String(prof.reporting_owner ?? "").trim();
  const ownerPlaceholder = /^(tbc|tbd|n\/?a|to be (confirmed|assigned)|-)$/i.test(ownerRaw);
  const evidenceAssessed = available + partial + notAvailable;

  const mkArea = (key: string, label: string, jump: string, status: AreaStatus, message: string): AreaCheck => ({ key, label, jump, status, message });
  const areas: AreaCheck[] = [
    mkArea("profile", "Profile", "EV.PROFILE", prof.event_type ? "complete" : "missing",
      prof.event_type ? "Complete." : "Go to Profile and select an event type - it drives every readiness question."),
    mkArea("owner", "Reporting owner", "EV.PROFILE", ownerRaw && !ownerPlaceholder ? "complete" : "missing",
      ownerRaw && !ownerPlaceholder ? "Complete." : "Enter a real named person or role for the sustainability reporting owner."),
    mkArea("readiness", "Readiness questions", "EV.RE", !totRelevant ? "missing" : complete ? "complete" : totAnswered > 0 ? "partial" : "missing",
      complete ? "Complete." : `${totAnswered}/${totRelevant} answered - finish Readiness_E, S, G and Process.`),
    mkArea("scope", "Scope boundary", "EV.SCOPE", scopeVal.confirmed === "Yes" ? "complete" : scopeVal.included ? "partial" : "missing",
      scopeVal.confirmed === "Yes" ? "Complete." : "Define what is included/excluded and confirm the boundary."),
    mkArea("carbon", "Carbon data", "EV.CARBON", totalKg > 0 && missingMinimum === 0 ? "complete" : totalKg > 0 ? "partial" : "missing",
      missingMinimum === 0 && totalKg > 0 ? "Complete." : `${missingMinimum} minimum activity row(s) still empty - enter data or mark Not available.`),
    mkArea("suppliers", "Suppliers", "EV.SUP", supRows.length === 0 ? "missing" : high > 0 || followups > 0 ? "partial" : "complete",
      supRows.length === 0 ? "Assess your 3-5 most critical suppliers." : high > 0 ? `${high} supplier(s) flagged high risk - follow up.` : "Complete."),
    mkArea("evidence", "Data & evidence", "EV.DATAE", evidenceAssessed === 0 ? "missing" : evidenceAssessed === evidenceTotal ? "complete" : "partial",
      evidenceAssessed === evidenceTotal ? "Complete." : `${evidenceTotal - evidenceAssessed} item(s) not yet assessed across Environment, Social and Governance.`),
    mkArea("kpis", "KPI inputs", "EV.KPIE", kpiRowsEntered === 0 ? "missing" : kpiRowsEntered === kpiRowsTotal ? "complete" : "partial",
      kpiRowsEntered === kpiRowsTotal ? "Complete." : `${kpiRowsEntered}/${kpiRowsTotal} KPIs have a current-year figure.`),
    mkArea("disclosure", "Disclosure", "EV.DISCLOSURE", status === "copy_safe" ? "complete" : status === "ready_for_review" ? "partial" : "missing",
      status === "copy_safe" ? "Copy-safe draft available." : "Internal draft only until the readiness gate is clear."),
  ];
  const blockers = areas.filter((a) => a.status === "missing");

  return {
    eventType: (prof.event_type as string) ?? null,
    pillars, overallPct, status,
    carbon: { totalKg, totalT: totalKg / 1000, byGroup, perEvent: div(prof.events_per_year), perDay: div(prof.event_days), perAttendee: div(prof.attendees), missingMinimum },
    suppliers: { total: supRows.length, high, medium, low, followups },
    kpis: { onTrack, offTrack, noTarget },
    evidence: { available, partial, notAvailable, notAssessed, total: evidenceTotal, mostAffectedTopic },
    areas, blockers, weakestTopic, strongestTopic,
  };
}

// ---- auto-diagnosed action priorities (mirrors the toolkit's live-diagnosed section) ----

export type Timing = "Urgent" | "Soon" | "Later";
export interface DiagnosedAction { area: string; pillar: string; issue: string; action: string; why: string; timing: Timing; jump: string }

const TIMING_ORDER: Record<Timing, number> = { Urgent: 0, Soon: 1, Later: 2 };

export function diagnosePriorities(d: EventsData): DiagnosedAction[] {
  const items: DiagnosedAction[] = [];

  const owner = d.areas.find((a) => a.key === "owner");
  if (owner?.status !== "complete") {
    items.push({ area: "Reporting ownership", pillar: "Governance", issue: "No named sustainability reporting owner", action: "Assign a real named person or role in Profile", why: "Without an owner, nothing else can be reviewed, signed off or trusted.", timing: "Urgent", jump: "EV.PROFILE" });
  }

  const scope = d.areas.find((a) => a.key === "scope");
  if (scope?.status !== "complete") {
    items.push({ area: "Scope boundary", pillar: "Process", issue: scope?.status === "missing" ? "Reporting boundary not defined" : "Reporting boundary not confirmed", action: "Define what is included/excluded in Scope_Boundary and confirm it", why: "Every KPI and disclosure assumes a defined, confirmed boundary.", timing: "Urgent", jump: "EV.SCOPE" });
  }

  for (const p of d.pillars) {
    if (p.relevant === 0) continue;
    if (p.answered === 0) {
      items.push({ area: `${p.label} readiness`, pillar: p.label, issue: `No ${p.label.toLowerCase()} readiness questions answered`, action: `Work through Readiness_${p.key} for your event type`, why: "This pillar currently contributes nothing to your overall readiness score.", timing: "Urgent", jump: `EV.R${p.key}` });
    } else if (p.answered < p.relevant) {
      items.push({ area: `${p.label} readiness`, pillar: p.label, issue: `${p.relevant - p.answered} ${p.label.toLowerCase()} question(s) unanswered`, action: `Finish the remaining Readiness_${p.key} questions`, why: "Partial answers understate your true readiness.", timing: "Soon", jump: `EV.R${p.key}` });
    }
  }

  if (d.carbon.missingMinimum > 0) {
    items.push({ area: "Carbon data", pillar: "Environment", issue: `${d.carbon.missingMinimum} minimum carbon input(s) still empty`, action: "Complete the minimum Carbon_Calculator rows or mark them Not available", why: "Blocks a valid carbon estimate and the E1 disclosure paragraph.", timing: "Urgent", jump: "EV.CARBON" });
  }

  if (d.suppliers.total === 0) {
    items.push({ area: "Suppliers", pillar: "Environment / Social", issue: "No suppliers assessed", action: "Assess your 3-5 most critical suppliers", why: "Supplier risk is a Core readiness item and feeds the supply-chain disclosure.", timing: "Soon", jump: "EV.SUP" });
  } else if (d.suppliers.high > 0) {
    items.push({ area: "Suppliers", pillar: "Environment / Social", issue: `${d.suppliers.high} supplier(s) flagged high risk`, action: "Follow up on missing labour/environmental data from flagged suppliers", why: "High-risk suppliers are the biggest disclosure liability.", timing: "Urgent", jump: "EV.SUP" });
  }

  if (d.evidence.notAssessed > 0) {
    items.push({
      area: "Data & evidence", pillar: "All", issue: `${d.evidence.notAssessed} of ${d.evidence.total} evidence items not yet assessed`,
      action: `Work through Data & Evidence, starting with ${d.evidence.mostAffectedTopic ?? "the most affected topic"}`,
      why: "Evidence is what turns a claimed figure into a disclosure an assurer or funder can trust.",
      timing: d.evidence.notAssessed > d.evidence.total * 0.6 ? "Urgent" : "Soon", jump: "EV.DATAE",
    });
  }

  if (d.kpis.onTrack + d.kpis.offTrack === 0) {
    items.push({ area: "KPIs", pillar: "All", issue: "No KPI current-year figures entered", action: "Enter current-year values for at least the Core KPIs", why: "KPIs are the quantified evidence behind every disclosure paragraph.", timing: "Soon", jump: "EV.KPIE" });
  } else if (d.kpis.offTrack > 0) {
    items.push({ area: "KPIs", pillar: "All", issue: `${d.kpis.offTrack} KPI(s) off track against target`, action: "Review off-track KPIs and log a corrective action", why: "Off-track KPIs are exactly what a funder or board will ask about.", timing: "Soon", jump: "EV.KPIE" });
  }

  if (d.weakestTopic && d.weakestTopic.pct < 50) {
    items.push({ area: "Weakest topic", pillar: "-", issue: `${d.weakestTopic.label} is your weakest topic (${Math.round(d.weakestTopic.pct)}%)`, action: `Prioritise ${d.weakestTopic.label} in your next data-collection push`, why: "This single topic is dragging down your overall readiness score the most.", timing: "Later", jump: "EV.RE" });
  }

  return items.sort((a, b) => TIMING_ORDER[a.timing] - TIMING_ORDER[b.timing]);
}
