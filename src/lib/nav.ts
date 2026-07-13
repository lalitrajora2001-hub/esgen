/* ============================================================
   ESGen navigation + route manifest (single source of truth)
   ============================================================ */

export const site = {
  name: "ESGen",
  companyNumber: "17212184",
  email: "contactus@esgen.co.uk",
  emails: {
    general: "contactus@esgen.co.uk",
    founder: "kunjpatel@esgen.co.uk",
    operations: "janvi@esgen.co.uk",
  },
  url: "https://esgen.co.uk",
  /* This is the description Google shows under the homepage result.
     Edit here and it updates the meta description, OG, and JSON-LD together. */
  description:
    "ESGen is a UK carbon accounting and ESG reporting platform. Measure Scope 1, 2 and 3 emissions, engage suppliers, and prepare reporting evidence for UK SRS, CSRD and SECR.",
};

export type NavLink = { label: string; href: string; desc?: string };
export type NavGroup = { heading: string; items: NavLink[] };

/* ---- Solutions (by use-case / team) ----
   Finance is hidden for now (page stored in src/app/_hidden/solutions-finance);
   restore by moving the folder back and re-adding its entry here. */
export const solutions: NavLink[] = [
  { label: "Reporting", href: "/solutions/reporting", desc: "One dataset, every framework-ready report." },
  { label: "Supply Chain", href: "/solutions/supply-chain", desc: "Engage suppliers and strengthen Scope 3." },
  { label: "Product Footprint", href: "/solutions/product-footprint", desc: "Measure product-level emissions and impact." },
];

/* ---- Platform (product capabilities), grouped for the mega-menu ---- */
export const platformGroups: NavGroup[] = [
  {
    heading: "Carbon management",
    items: [
      { label: "Carbon Assessment", href: "/platform/carbon-assessment", desc: "Measure your Scope 1, 2 & 3 emissions" },
      { label: "Suppliers Engagement", href: "/platform/suppliers-engagement", desc: "Onboard your entire value chain" },
    ],
  },
  {
    heading: "LCA",
    items: [
      { label: "Emissions Factors", href: "/platform/emissions-factors", desc: "Access our certified database" },
      { label: "LCA", href: "/platform/lca", desc: "Analyse your product lifecycle impact" },
    ],
  },
  {
    heading: "ESG Management",
    /* TCFD/IFRS, EUDR, VSME and DPP are hidden for now (pages stored in
       src/app/_hidden); restore by moving the folders back and re-adding here. */
    items: [
      { label: "UK SRS", href: "/platform/uk-srs", desc: "Structure your UK climate reporting" },
      { label: "EcoVadis", href: "/platform/ecovadis", desc: "Boost your ESG performance score" },
      { label: "CSRD", href: "/platform/csrd", desc: "Structure your CSRD compliance" },
      { label: "CBAM", href: "/platform/cbam", desc: "Prepare for the carbon border tax" },
      { label: "SBTi", href: "/platform/sbti", desc: "Align your targets with climate science" },
      { label: "SECR", href: "/platform/secr", desc: "Manage your UK carbon reporting" },
      { label: "BRSR", href: "/platform/brsr", desc: "Prepare India's SEBI sustainability report" },
    ],
  },
];

/** Flat list of every platform page (footer, sitemap, search). */
export const platform: NavLink[] = platformGroups.flatMap((g) => g.items);

export const industries: NavLink[] = [
  { label: "Manufacturing", href: "/industries/manufacturing", desc: "Energy, process, materials, and supplier data." },
  { label: "Events", href: "/industries/events", desc: "Venue, travel, catering, and event footprint." },
];

export const resources: NavLink[] = [
  { label: "Resources Overview", href: "/resources", desc: "White papers, glossary, and framework explainers." },
  { label: "White papers", href: "/resources/guides", desc: "In-depth walkthroughs by topic." },
  { label: "Knowledge Hub", href: "/resources/knowledge-hub", desc: "ESG and carbon reporting fundamentals." },
  { label: "Blog", href: "/resources/blog", desc: "Notes on ESG reporting practice." },
  { label: "ESG Glossary", href: "/resources/esg-glossary", desc: "Key ESG and carbon terms explained." },
  { label: "Carbon Accounting Basics", href: "/resources/carbon-accounting-basics", desc: "Scopes, factors, and tCO2e explained." },
  { label: "Regulations", href: "/resources/regulations", desc: "An overview of relevant frameworks." },
];

/* ---- Top navigation ---- */

export type NavEntry =
  | { label: string; href: string }
  | { label: string; base: string; items: NavLink[]; columns?: number; featured?: { title: string; desc: string; href: string } }
  | { label: string; base: string; groups: NavGroup[] };

export const mainNav: NavEntry[] = [
  { label: "Home", href: "/" },
  {
    label: "Solutions",
    base: "/solutions",
    items: solutions,
    featured: { title: "Not sure where to start?", desc: "Book a demo and we will map it to your reporting needs.", href: "/demo" },
  },
  { label: "Platform", base: "/platform", groups: platformGroups },
  { label: "Industries", base: "/industries", items: industries },
  { label: "Partner Program", href: "/partner-program" },
  { label: "Resources", base: "/resources", items: resources },
];

export function hasItems(e: NavEntry): e is Extract<NavEntry, { items: NavLink[] }> {
  return "items" in e;
}
export function hasGroups(e: NavEntry): e is Extract<NavEntry, { groups: NavGroup[] }> {
  return "groups" in e;
}

/* ---- Search quick links ---- */
export const searchQuickLinks: NavLink[] = [
  { label: "Carbon Assessment", href: "/platform/carbon-assessment" },
  { label: "Suppliers Engagement", href: "/platform/suppliers-engagement" },
  { label: "CSRD", href: "/platform/csrd" },
  { label: "Reporting", href: "/solutions/reporting" },
  { label: "Manufacturing", href: "/industries/manufacturing" },
  { label: "Events", href: "/industries/events" },
  { label: "Book a demo", href: "/demo" },
];

/* ---- Footer ---- */
export const legalLinks: NavLink[] = [
  { label: "Privacy Policy", href: "/legal/privacy-policy" },
  { label: "Terms", href: "/legal/terms" },
  { label: "Cookie Policy", href: "/legal/cookie-policy" },
  { label: "Accessibility", href: "/legal/accessibility" },
  { label: "Data Protection", href: "/legal/gdpr" },
];

export const footerColumns: { heading: string; links: NavLink[] }[] = [
  { heading: "Solutions", links: solutions },
  { heading: "Platform", links: platform.slice(0, 6) },
  { heading: "Standards", links: platform.slice(6, 12) },
  { heading: "Industries", links: [...industries, { label: "Partner Program", href: "/partner-program" }] },
  { heading: "Resources", links: resources.slice(0, 5) },
  { heading: "Company", links: [
    { label: "Pricing", href: "/pricing" },
    { label: "Contact", href: "/contact" },
    { label: "Book a demo", href: "/demo" },
    { label: "Sign in", href: "/login" },
  ] },
];
