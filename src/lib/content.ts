/* ============================================================
   Page content for Solutions (use-cases), Platform (capabilities),
   and Industries. All copy is original ESGen copy using cautious,
   safe wording. Platform pages are placeholders to be developed
   page by page.
   ============================================================ */

export type Collection = "solutions" | "platform" | "industries";
export type VisualKey =
  | "platform" | "scopes" | "workflow" | "dataHub" | "materiality" | "supplier"
  | "compliance" | "audit" | "roadmap" | "industry-mfg" | "industry-events";

export type PageSection = { h: string; p: string; bullets?: string[] };

export type ContentPage = {
  slug: string;
  collection: Collection;
  navLabel: string;
  kicker: string;
  h1: string;
  intro: string;
  seoTitle: string;
  seoDescription: string;
  visual: VisualKey;
  frameworks?: string[];
  sections: PageSection[];
};

/* ---- Solutions (by use-case / team) ---- */
const SOLUTIONS: ContentPage[] = [
  {
    slug: "finance", collection: "solutions", navLabel: "Finance",
    kicker: "Finance", h1: "Reporting-grade ESG data your finance team can trust",
    intro: "Give finance and reporting teams audit-ready sustainability data, with every figure traceable to its source and mapped to the disclosures that matter.",
    seoTitle: "ESG for Finance Teams", seoDescription: "Audit-ready ESG and carbon data for finance teams, with traceable figures and disclosure-ready outputs.",
    visual: "audit",
    sections: [
      { h: "Financial-grade data", p: "Bring sustainability data up to the standard finance already works to, with clear ownership, controls, and a full audit trail." },
      { h: "Disclosure mapping", p: "Map figures to the frameworks that apply to your reporting, so a single dataset supports several disclosures." },
      { h: "Audit-ready evidence", p: "Keep source files, methods, and approvals connected to every number, ready for review and assurance." },
    ],
  },
  {
    slug: "supply-chain", collection: "solutions", navLabel: "Supply Chain",
    kicker: "Supply Chain", h1: "Bring your supply chain into your ESG reporting",
    intro: "Engage suppliers, collect primary data, and strengthen Scope 3 across your value chain in one structured workspace.",
    seoTitle: "ESG for Supply Chain", seoDescription: "Engage suppliers, collect primary ESG data, and strengthen Scope 3 reporting across your value chain.",
    visual: "supplier",
    sections: [
      { h: "Supplier engagement", p: "Invite suppliers, send structured questionnaires, and track responses in one place." },
      { h: "Primary Scope 3 data", p: "Collect the supplier data that improves the quality and defensibility of your Scope 3 figures." },
      { h: "Traceability", p: "Keep supplier responses and evidence connected to the figures they support." },
    ],
  },
  {
    slug: "product-footprint", collection: "solutions", navLabel: "Product Footprint",
    kicker: "Product Footprint", h1: "Measure the footprint of your products",
    intro: "Calculate product-level emissions and life-cycle impact, from materials to end of life, ready for customers and disclosure.",
    seoTitle: "Product Carbon Footprint", seoDescription: "Calculate product-level emissions and life-cycle impact, from raw materials to end of life.",
    visual: "dataHub",
    sections: [
      { h: "Product-level emissions", p: "Model the emissions of individual products using structured activity and materials data." },
      { h: "Life-cycle view", p: "Account for impact across the life cycle, from raw materials through use and end of life." },
      { h: "Customer-ready evidence", p: "Prepare clear, defensible product footprints to answer customer and tender questions." },
    ],
  },
  {
    slug: "reporting", collection: "solutions", navLabel: "Reporting",
    kicker: "Reporting", h1: "One dataset, every report",
    intro: "Prepare structured, framework-ready disclosures from a single source of ESG and emissions data, with evidence connected to every figure.",
    seoTitle: "ESG Reporting", seoDescription: "Prepare framework-ready ESG and carbon disclosures from one structured dataset, with evidence on every figure.",
    visual: "compliance", frameworks: ["CSRD / ESRS", "ISSB", "UK SRS", "SECR", "CDP", "GHG Protocol", "VSME", "Evidence"],
    sections: [
      { h: "Framework mapping", p: "Map a single dataset across the frameworks you report to, so you collect once and report across many needs." },
      { h: "Structured outputs", p: "Prepare structured, review-ready outputs with consistent figures throughout." },
      { h: "Evidence and audit trail", p: "Keep evidence connected to each figure, with a clear record of how every number was produced." },
    ],
  },
];

/* ---- Platform (product capabilities) ---- */
const P = (o: Omit<ContentPage, "collection">): ContentPage => ({ ...o, collection: "platform" });

const PLATFORM: ContentPage[] = [
  /* Carbon management */
  P({
    slug: "carbon-assessment", navLabel: "Carbon Assessment",
    kicker: "Carbon management", h1: "Measure your full carbon footprint",
    intro: "Turn activity data into Scope 1, 2, and 3 emissions with recognised factors, transparent calculations, and a full audit trail.",
    seoTitle: "Carbon Assessment", seoDescription: "Measure Scope 1, 2, and 3 emissions with recognised factors, transparent calculations, and a full audit trail.",
    visual: "scopes",
    sections: [
      { h: "Scope 1, 2 and 3 coverage", p: "Account for direct emissions, purchased energy, and value-chain emissions across the 15 Scope 3 categories." },
      { h: "Transparent calculations", p: "Apply recognised emission factors with calculation logic you can inspect and defend." },
      { h: "Hotspots and trends", p: "See which categories drive your footprint and track progress against a baseline over time." },
    ],
  }),
  P({
    slug: "suppliers-engagement", navLabel: "Suppliers Engagement",
    kicker: "Carbon management", h1: "Onboard and engage your entire value chain",
    intro: "Invite suppliers, collect primary ESG and emissions data, and track responses to strengthen your Scope 3 reporting.",
    seoTitle: "Suppliers Engagement", seoDescription: "Onboard suppliers, collect primary ESG and emissions data, and strengthen Scope 3 reporting.",
    visual: "supplier",
    sections: [
      { h: "Onboard suppliers", p: "Invite your value chain and gather consistent responses with structured questionnaires." },
      { h: "Primary data", p: "Collect supplier-specific emissions and ESG data to improve Scope 3 quality." },
      { h: "Response tracking", p: "See who has responded, what is outstanding, and where to follow up." },
    ],
  }),
  P({
    slug: "decarbonization-strategy", navLabel: "Decarbonization Strategy",
    kicker: "Carbon management", h1: "Build a concrete decarbonisation plan",
    intro: "Identify your biggest emission sources, model reduction levers, and turn targets into a practical, trackable action plan.",
    seoTitle: "Decarbonization Strategy", seoDescription: "Identify emission hotspots, model reduction levers, and build a practical decarbonisation action plan.",
    visual: "roadmap",
    sections: [
      { h: "Find the hotspots", p: "Focus effort where it matters by understanding which sources drive your footprint." },
      { h: "Model reduction levers", p: "Explore the impact of different actions before you commit to a plan." },
      { h: "Track the plan", p: "Turn targets into a phased action plan with owners and progress tracking." },
    ],
  }),
  /* LCA */
  P({
    slug: "emissions-factors", navLabel: "Emissions Factors",
    kicker: "LCA", h1: "A transparent emissions factor database",
    intro: "Apply recognised UK and international emission factors, kept transparent and up to date, so your calculations stay defensible.",
    seoTitle: "Emissions Factors Database", seoDescription: "Access recognised UK and international emission factors, kept transparent and up to date for defensible calculations.",
    visual: "dataHub",
    sections: [
      { h: "Recognised factors", p: "Use recognised UK and international emission factor sets across your calculations." },
      { h: "Transparent and traceable", p: "See the source and version of every factor applied to your data." },
      { h: "Kept up to date", p: "Work with current factors so your figures stay defensible year to year." },
    ],
  }),
  P({
    slug: "lca", navLabel: "LCA",
    kicker: "LCA", h1: "Life-cycle assessment for your products",
    intro: "Model the impact of your products across their life cycle, from raw materials to end of life, in a structured workspace.",
    seoTitle: "Life Cycle Assessment (LCA)", seoDescription: "Model product life-cycle impact from raw materials to end of life in a structured LCA workspace.",
    visual: "workflow",
    sections: [
      { h: "Life-cycle stages", p: "Structure impact across materials, manufacturing, distribution, use, and end of life." },
      { h: "Product modelling", p: "Build reusable product models from your activity and materials data." },
      { h: "Comparable results", p: "Produce consistent, comparable results you can share with confidence." },
    ],
  }),
  /* ESG Management */
  P({
    slug: "uk-srs", navLabel: "UK SRS",
    kicker: "ESG Management", h1: "Structure your UK climate reporting",
    intro: "Organise climate disclosure data, governance evidence, risk information, metrics, and targets to support UK SRS readiness.",
    seoTitle: "UK SRS Readiness", seoDescription: "Support UK Sustainability Reporting Standards readiness across climate data, governance, risk, metrics, and targets.",
    visual: "compliance", frameworks: ["UK SRS", "Climate", "Governance", "Risk", "Metrics", "Targets", "Evidence", "Scope 1/2/3"],
    sections: [
      { h: "Climate disclosure mapping", p: "Map your climate data to the disclosures UK SRS will require." },
      { h: "Governance and risk", p: "Organise governance evidence and track climate-related risks and opportunities." },
      { h: "Metrics and targets", p: "Bring together the metrics and targets your reporting requires, including emissions." },
    ],
  }),
  P({
    slug: "ecovadis", navLabel: "EcoVadis",
    kicker: "ESG Management", h1: "Boost your EcoVadis performance",
    intro: "Organise the policies, actions, and evidence behind your EcoVadis assessment to present your ESG performance clearly.",
    seoTitle: "EcoVadis Preparation", seoDescription: "Organise policies, actions, and evidence to prepare a clear, well-supported EcoVadis submission.",
    visual: "compliance", frameworks: ["Environment", "Labour & Human Rights", "Ethics", "Sustainable Procurement", "Policies", "Actions", "Evidence", "Scoring"],
    sections: [
      { h: "Structured by theme", p: "Organise evidence across the themes EcoVadis assesses." },
      { h: "Policies and actions", p: "Show the policies and actions behind your performance in one place." },
      { h: "Evidence library", p: "Keep supporting documents connected and ready to submit." },
    ],
  }),
  P({
    slug: "csrd", navLabel: "CSRD",
    kicker: "ESG Management", h1: "Structure your CSRD compliance",
    intro: "Map ESRS datapoints, connect double materiality, manage evidence, and keep a clear audit trail through the disclosure workflow.",
    seoTitle: "CSRD & ESRS Support", seoDescription: "Support CSRD and ESRS reporting through datapoint mapping, materiality, evidence management, and traceability.",
    visual: "compliance", frameworks: ["CSRD / ESRS", "Double materiality", "Datapoints", "Evidence", "Governance", "Assurance-ready", "Audit trail", "Disclosure"],
    sections: [
      { h: "ESRS datapoint mapping", p: "Map your data to ESRS datapoints so disclosures are structured from the start." },
      { h: "Double materiality", p: "Connect materiality outputs to the topics you report on." },
      { h: "Evidence and audit trail", p: "Attach evidence to each disclosure and keep every figure traceable." },
    ],
  }),
  P({
    slug: "tcfd-ifrs", navLabel: "TCFD / IFRS",
    kicker: "ESG Management", h1: "Structure your climate reporting",
    intro: "Organise governance, strategy, risk, and metrics to support TCFD-aligned and IFRS S1/S2 climate disclosure.",
    seoTitle: "TCFD / IFRS Climate Reporting", seoDescription: "Support TCFD-aligned and IFRS S1/S2 climate disclosure across governance, strategy, risk, and metrics.",
    visual: "compliance", frameworks: ["TCFD", "IFRS S1", "IFRS S2", "Governance", "Strategy", "Risk", "Metrics", "Targets"],
    sections: [
      { h: "Governance and strategy", p: "Capture governance and how climate risks and opportunities affect your business." },
      { h: "Risk management", p: "Document how climate risks are identified, assessed, and managed." },
      { h: "Metrics and targets", p: "Bring together the metrics and targets your disclosure requires." },
    ],
  }),
  P({
    slug: "eudr", navLabel: "EUDR",
    kicker: "ESG Management", h1: "Ensure supply chain traceability",
    intro: "Collect due-diligence data and geolocation evidence to support EU Deforestation Regulation traceability.",
    seoTitle: "EUDR Traceability", seoDescription: "Support EU Deforestation Regulation due diligence with supply chain traceability and geolocation evidence.",
    visual: "supplier",
    sections: [
      { h: "Due-diligence data", p: "Collect the supplier and commodity data EUDR due diligence requires." },
      { h: "Geolocation evidence", p: "Keep plot-level geolocation and supporting evidence organised." },
      { h: "Traceability", p: "Trace commodities through your supply chain in a structured way." },
    ],
  }),
  P({
    slug: "cbam", navLabel: "CBAM",
    kicker: "ESG Management", h1: "Prepare for the carbon border tax",
    intro: "Bring product mapping, supplier emissions data, and embedded emissions evidence together to support CBAM reporting preparation.",
    seoTitle: "CBAM Support", seoDescription: "Organise embedded emissions and supplier evidence for CBAM reporting preparation, with product mapping.",
    visual: "compliance", frameworks: ["CBAM", "Embedded emissions", "Supplier data", "Product mapping", "Importer workflow", "Evidence", "Gap tracking", "Reporting"],
    sections: [
      { h: "Product and category mapping", p: "Map imported goods to the categories and data you need for CBAM." },
      { h: "Embedded emissions evidence", p: "Request supplier emissions data and store the evidence behind embedded emissions." },
      { h: "Gap tracking", p: "Identify missing data and turn it into a clear list of actions." },
    ],
  }),
  P({
    slug: "sbti", navLabel: "SBTi",
    kicker: "ESG Management", h1: "Align your targets with climate science",
    intro: "Build and track emissions reduction targets aligned with climate science, from baseline to trajectory.",
    seoTitle: "Science-Based Targets (SBTi)", seoDescription: "Set and track science-based emissions reduction targets, from baseline through trajectory.",
    visual: "roadmap",
    sections: [
      { h: "Set a baseline", p: "Establish a clear baseline from your measured footprint." },
      { h: "Science-aligned targets", p: "Build reduction targets aligned with climate science." },
      { h: "Track the trajectory", p: "Monitor progress against your target trajectory over time." },
    ],
  }),
  P({
    slug: "vsme", navLabel: "VSME",
    kicker: "ESG Management", h1: "Simplify your ESG reporting",
    intro: "Prepare a proportionate ESG report using the voluntary SME standard, with only the data that matters.",
    seoTitle: "VSME ESG Reporting", seoDescription: "Prepare a proportionate ESG report using the voluntary SME standard, focused on the data that matters.",
    visual: "compliance", frameworks: ["VSME", "Basic module", "Comprehensive module", "Environment", "Social", "Governance", "Evidence", "Disclosure"],
    sections: [
      { h: "Proportionate scope", p: "Report using a standard designed to be proportionate for smaller businesses." },
      { h: "Only what matters", p: "Focus on the data points that are relevant to your business." },
      { h: "Reusable evidence", p: "Reuse the same structured data across other reporting needs." },
    ],
  }),
  P({
    slug: "secr", navLabel: "SECR",
    kicker: "ESG Management", h1: "Manage your UK carbon reporting",
    intro: "Organise UK energy use and carbon data to prepare SECR disclosures for your annual report.",
    seoTitle: "SECR Reporting", seoDescription: "Organise UK energy and carbon data to prepare Streamlined Energy and Carbon Reporting disclosures.",
    visual: "compliance", frameworks: ["SECR", "Energy use", "Scope 1", "Scope 2", "Intensity ratio", "Energy efficiency", "Evidence", "Annual report"],
    sections: [
      { h: "Energy and carbon data", p: "Bring together the UK energy and carbon data SECR requires." },
      { h: "Intensity ratios", p: "Calculate the intensity ratios your disclosure needs." },
      { h: "Annual report ready", p: "Prepare structured outputs ready for your annual report." },
    ],
  }),
  P({
    slug: "dpp", navLabel: "DPP",
    kicker: "ESG Management", h1: "Create your digital product passports",
    intro: "Bring product, material, and sustainability data together to prepare digital product passports.",
    seoTitle: "Digital Product Passport (DPP)", seoDescription: "Bring product, material, and sustainability data together to prepare digital product passports.",
    visual: "dataHub",
    sections: [
      { h: "Product and material data", p: "Organise the product and material data a passport needs." },
      { h: "Sustainability attributes", p: "Attach sustainability and compliance attributes to each product." },
      { h: "Structured output", p: "Prepare structured product passport data ready to share." },
    ],
  }),
];

/* ---- Industries ---- */
const INDUSTRIES: ContentPage[] = [
  {
    slug: "manufacturing", collection: "industries", navLabel: "Manufacturing",
    kicker: "Manufacturing", h1: "ESG and carbon reporting for manufacturers",
    intro: "ESGen helps manufacturers measure energy, process, and material emissions, collect supplier data, and prepare reporting for customers and tenders.",
    seoTitle: "Manufacturing ESG Reporting Software", seoDescription: "ESGen supports manufacturers with emissions data, supplier data, product and operational footprints, and reporting.",
    visual: "industry-mfg",
    sections: [
      { h: "Manufacturing ESG challenges", p: "Manufacturers face pressure from customers, investors, and regulation to measure and report emissions across complex operations and supply chains." },
      { h: "Energy and process emissions", p: "Track energy use and process emissions across sites, with clear ownership and validation." },
      { h: "Materials and supplier data", p: "Collect data on purchased materials and supplier emissions to strengthen Scope 3." },
      { h: "Logistics and waste", p: "Account for logistics and waste alongside energy and materials for a fuller picture." },
      { h: "Scope 3 visibility", p: "Improve visibility of value-chain emissions and focus reduction where it counts." },
      { h: "Reporting and tender support", p: "Prepare structured outputs and evidence to answer customer and tender questions with confidence." },
    ],
  },
  {
    slug: "events", collection: "industries", navLabel: "Events",
    kicker: "Events", h1: "Event footprint reporting and ESG evidence",
    intro: "ESGen helps event organisers, venues, and event supply chains measure footprints across venue energy, travel, catering, suppliers, and waste.",
    seoTitle: "Event Sustainability Reporting Software", seoDescription: "ESGen supports event organisers and venues with event footprint reporting, ESG evidence, and temporary supply-chain data.",
    visual: "industry-events",
    sections: [
      { h: "Event ESG challenges", p: "Events involve temporary, project-based activity across many suppliers, which makes footprints hard to measure without a structured approach." },
      { h: "Venue energy", p: "Capture venue energy use and attribute it to each event." },
      { h: "Catering", p: "Account for catering and food-related emissions." },
      { h: "Travel", p: "Include attendee and staff travel in the event footprint." },
      { h: "Suppliers", p: "Collect data from event suppliers and contractors." },
      { h: "Waste", p: "Track waste generated across the event." },
      { h: "Temporary project-based supply chains", p: "Handle the short-lived supply chains typical of events in a repeatable way." },
      { h: "Client and tender reporting", p: "Prepare footprint reports and evidence for clients and tenders." },
    ],
  },
];

export const ALL_PAGES: ContentPage[] = [...SOLUTIONS, ...PLATFORM, ...INDUSTRIES];

export function getPage(collection: Collection, slug: string): ContentPage | undefined {
  return ALL_PAGES.find((p) => p.collection === collection && p.slug === slug);
}
export function pagesIn(collection: Collection): ContentPage[] {
  return ALL_PAGES.filter((p) => p.collection === collection);
}
