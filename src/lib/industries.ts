/* Rich, honest data for the bespoke industry pages. Percentages are
   illustrative of a typical profile, not a measurement of any real company. */

export type Category = { k: string; pct: number; scope: string; driver: string };
export type Industry = {
  slug: string;
  eyebrow: string;
  h1: string;
  lead: string;
  footprintTitle: string;
  categories: Category[];
  challenges: [string, string][];
  features: [string, string][];
  outcome: string;
  faqs: [string, string][];
};

export const INDUSTRY_DATA: Record<string, Industry> = {
  manufacturing: {
    slug: "manufacturing",
    eyebrow: "Industries · Manufacturing",
    h1: "Where a manufacturer's footprint actually sits",
    lead: "Most of it is upstream, in the materials you buy, not in the energy you can see on a meter. ESGen measures the whole picture and helps you act on the part that matters.",
    footprintTitle: "A typical manufacturer's emissions",
    categories: [
      { k: "Purchased materials", pct: 52, scope: "Scope 3", driver: "Steel, aluminium, plastics and components carry embedded emissions from their own production, usually the single largest share of the footprint." },
      { k: "Purchased energy", pct: 18, scope: "Scope 1 & 2", driver: "Electricity and fuel burned on site. Visible on a meter, and often where reduction starts, but rarely the largest slice." },
      { k: "Process emissions", pct: 12, scope: "Scope 1", driver: "Released directly by industrial processes such as heat treatment, chemical reactions, or refrigerant loss." },
      { k: "Inbound & outbound logistics", pct: 10, scope: "Scope 3", driver: "Moving raw materials in and finished goods out, across road, sea, and air freight." },
      { k: "Capital goods", pct: 5, scope: "Scope 3", driver: "The machinery and buildings that produce the product, amortised across their life." },
      { k: "Waste & end of life", pct: 3, scope: "Scope 3", driver: "Scrap, offcuts, and what happens to the product once it is finished with." },
    ],
    challenges: [
      ["The data lives with your suppliers", "The largest share of a manufacturer's footprint is embedded in purchased materials. That number sits in your supplier's installation, not in your systems."],
      ["Many sites, one boundary", "Energy and process emissions are spread across plants, each with its own meters, contracts, and record-keeping."],
      ["Customers ask before regulators do", "Tenders increasingly require a product or corporate footprint. The request often arrives before any legal obligation does."],
    ],
    features: [
      ["Measure materials, not just meters", "Convert your bill of materials into embedded emissions using recognised factors, then replace estimates with supplier data where it matters."],
      ["Consolidate every site", "Bring plants, meters, and contracts into one boundary, with clear ownership of each data source."],
      ["Answer the tender", "Produce the corporate or product-level footprint a customer questionnaire asks for, with the method and source attached."],
    ],
    outcome: "Manufacturers using a structured approach can focus reduction on the categories that actually move the number, rather than the ones that are easiest to see.",
    faqs: [
      ["Do we need product-level footprints or a corporate one?", "It depends who is asking. A CSRD or SECR obligation is corporate. A customer tender is often product-level. ESGen can build both from the same underlying inventory."],
      ["How do we get emissions data from suppliers?", "ESGen collects it directly through supplier questionnaires, targeting the categories that carry most of the footprint first rather than surveying everyone at once."],
      ["Can we start before we have supplier data?", "Yes. Spend and activity-based estimates give you a complete first picture and show where the material categories are. Primary data then replaces the estimates over time."],
    ],
  },
  events: {
    slug: "events",
    eyebrow: "Industries · Events",
    h1: "A footprint that exists for a week, measured properly",
    lead: "Events are temporary, project-based, and spread across dozens of suppliers who appear once and vanish. ESGen gives that fleeting activity a repeatable structure.",
    footprintTitle: "A typical event's emissions",
    categories: [
      { k: "Attendee travel", pct: 58, scope: "Scope 3", driver: "How people get to the event, especially long-haul flights, is almost always the dominant share of an event's footprint." },
      { k: "Venue energy", pct: 15, scope: "Scope 2", driver: "Power and heating for the venue over the event's duration, attributed to the event rather than the building's year." },
      { k: "Catering", pct: 12, scope: "Scope 3", driver: "Food and drink, where menu choices, particularly meat and dairy, drive most of the difference." },
      { k: "Freight & logistics", pct: 8, scope: "Scope 3", driver: "Moving stands, equipment, and materials to and from the site, often at short notice." },
      { k: "Accommodation", pct: 5, scope: "Scope 3", driver: "Hotel nights for attendees, staff, and contractors around the event dates." },
      { k: "Waste", pct: 2, scope: "Scope 3", driver: "What is left behind: single-use materials, signage, and catering waste." },
    ],
    challenges: [
      ["Everything is temporary", "The supply chain for a single event assembles and disperses in weeks. There is no standing relationship to lean on for data."],
      ["Travel dominates, and it's hard to reach", "Attendee travel is usually the largest share and the hardest to capture, because it sits with hundreds of individuals, not one supplier."],
      ["Clients want evidence, fast", "Increasingly a footprint report is a condition of the contract, needed soon after the event closes rather than months later."],
    ],
    features: [
      ["A repeatable event template", "Model each event the same way, venue, travel, catering, freight, waste, so the second one takes a fraction of the effort of the first."],
      ["Capture travel without chasing everyone", "Estimate attendee travel from registration and location data, then refine with surveys where the accuracy is worth it."],
      ["Report before the client asks twice", "Produce the footprint report and evidence pack quickly after the event, with assumptions stated plainly."],
    ],
    outcome: "Organisers using a structured template can compare events on a like-for-like basis and show clients where the footprint genuinely came from.",
    faqs: [
      ["How do you measure attendee travel?", "From what you already know: attendee locations and the venue. That gives a defensible estimate immediately, which surveys can refine for the flights that matter most."],
      ["Can one venue report across many events?", "Yes. Venue energy can be attributed event by event, so both the organiser and the venue get a footprint that reflects their part."],
      ["Is this useful for tenders?", "Very. A consistent, repeatable footprint per event is exactly the evidence clients and framework-bound sponsors increasingly ask for."],
    ],
  },
};
