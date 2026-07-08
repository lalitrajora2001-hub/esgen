/* ============================================================
   ESGen navigation + full route manifest (Appendix A)
   One source of truth for: mega-menu, mobile drawer, footer,
   dynamic route generation, and section index pages.
   ============================================================ */

export const site = {
  name: "ESGen",
  tagline: "Carbon accounting and ESG software",
  email: "info@esgen.co.uk",
  domain: "esgen.co.uk",
  url: "https://esgen.co.uk",
  description:
    "ESGen is carbon accounting and ESG software that helps businesses measure, report, and reduce emissions with audit-ready data.",
};

export type LinkItem = {
  slug: string;
  title: string;
  desc: string;
};

/** Template kinds map to a rendering template. */
export type Template =
  | "product"
  | "solution"
  | "industry"
  | "compliance"
  | "article"
  | "listing"
  | "company"
  | "legal";

export type Collection = {
  key: string;
  base: string; // route base, e.g. "/platform"
  label: string;
  intro: string;
  template: Template;
  items: LinkItem[];
};

/* ---------- Collections (every item becomes a real page) ---------- */

export const collections: Collection[] = [
  {
    key: "platform",
    base: "/platform",
    label: "Platform",
    intro:
      "The ESGen platform: collect data, calculate emissions, and report against every major framework from one place.",
    template: "product",
    items: [
      { slug: "dashboard", title: "Dashboard", desc: "A live view of your footprint by scope, site, and category." },
      { slug: "data-collection", title: "Data collection", desc: "Bring in energy, travel, and supplier data without the spreadsheet chaos." },
      { slug: "analytics", title: "Analytics", desc: "Break down hotspots and track progress against your targets." },
      { slug: "reporting", title: "Reporting", desc: "Framework-ready reports you can share with confidence." },
      { slug: "automation", title: "Automation", desc: "Cut manual work with connected data and repeatable workflows." },
      { slug: "ai", title: "AI insights", desc: "Guided suggestions for gaps, anomalies, and reduction levers." },
      { slug: "integrations", title: "Integrations", desc: "Connect the accounting, ERP, and cloud tools you already use." },
      { slug: "api", title: "API", desc: "Programmatic access to your emissions data and reports." },
      { slug: "workflow", title: "Workflow", desc: "Assign, review, and sign off data with a clear audit trail." },
      { slug: "data-quality", title: "Data quality", desc: "Validation and completeness checks built into every step." },
      { slug: "permissions", title: "Permissions", desc: "Role-based access so the right people see the right data." },
      { slug: "security", title: "Security", desc: "Encryption, UK and EU hosting, and privacy by design." },
    ],
  },
  {
    key: "features",
    base: "/features",
    label: "Features",
    intro: "The building blocks of ESGen, from automated data capture to scenario analysis.",
    template: "product",
    items: [
      { slug: "automated-data-collection", title: "Automated data collection", desc: "Pull activity data from connected systems and simple forms." },
      { slug: "emissions-calculation", title: "Emissions calculation", desc: "Scope 1, 2, and 3 on the GHG Protocol with recognised factors." },
      { slug: "supplier-management", title: "Supplier management", desc: "Request, track, and improve supplier data across your value chain." },
      { slug: "reporting", title: "Reporting", desc: "Export clean, framework-mapped reports in a few clicks." },
      { slug: "forecasting", title: "Forecasting", desc: "Project your trajectory and test reduction scenarios." },
      { slug: "ai-insights", title: "AI insights", desc: "Surface anomalies, gaps, and the levers that matter most." },
      { slug: "benchmarking", title: "Benchmarking", desc: "See how your intensity compares within your sector." },
      { slug: "collaboration", title: "Collaboration", desc: "Bring finance, operations, and sustainability into one workflow." },
      { slug: "audit-trail", title: "Audit trail", desc: "Every figure traceable to its source, method, and owner." },
      { slug: "scenario-analysis", title: "Scenario analysis", desc: "Model interventions against a business-as-usual baseline." },
    ],
  },
  {
    key: "solutions",
    base: "/solutions",
    label: "Solutions",
    intro: "ESGen shaped around your goal, whether that is compliance, procurement, or net zero.",
    template: "solution",
    items: [
      { slug: "business-size", title: "By business size", desc: "From lean SMEs to multi-site groups." },
      { slug: "department", title: "By department", desc: "Finance, operations, procurement, and sustainability." },
      { slug: "use-case", title: "By use case", desc: "Reporting, reduction, and value-chain engagement." },
      { slug: "compliance", title: "Compliance", desc: "Meet CSRD, SECR, and ISSB-aligned requirements." },
      { slug: "reporting", title: "Reporting", desc: "Produce decision-grade, audit-ready disclosures." },
      { slug: "supply-chain", title: "Supply chain", desc: "Measure and reduce Scope 3 across suppliers." },
      { slug: "procurement", title: "Procurement", desc: "Answer buyer questionnaires and win tenders." },
      { slug: "manufacturing", title: "Manufacturing", desc: "Track process, energy, and material emissions." },
      { slug: "esg", title: "ESG programme", desc: "Bring environmental data into a wider ESG story." },
      { slug: "carbon-management", title: "Carbon management", desc: "One system for measuring and cutting carbon." },
      { slug: "net-zero", title: "Net zero", desc: "Set a credible target and track the pathway." },
      { slug: "risk-management", title: "Risk management", desc: "Understand climate exposure across the business." },
    ],
  },
  {
    key: "industries",
    base: "/industries",
    label: "Industries",
    intro: "Sector-specific guidance, hotspots, and drivers for the industries we serve.",
    template: "industry",
    items: [
      { slug: "manufacturing", title: "Manufacturing", desc: "Energy, process, and material emissions." },
      { slug: "retail", title: "Retail", desc: "Stores, logistics, and purchased goods." },
      { slug: "logistics", title: "Logistics", desc: "Fleet, fuel, and distribution networks." },
      { slug: "food-and-beverage", title: "Food and beverage", desc: "Agriculture, packaging, and cold chain." },
      { slug: "construction", title: "Construction", desc: "Embodied carbon and site energy." },
      { slug: "energy", title: "Energy", desc: "Generation, transmission, and transition." },
      { slug: "financial-services", title: "Financial services", desc: "Financed and operational emissions." },
      { slug: "healthcare", title: "Healthcare", desc: "Estates, supply chain, and procurement." },
      { slug: "technology", title: "Technology", desc: "Cloud, hardware, and value-chain data." },
      { slug: "public-sector", title: "Public sector", desc: "Estates, fleets, and reporting duties." },
      { slug: "professional-services", title: "Professional services", desc: "Travel, offices, and purchased services." },
      { slug: "education", title: "Education", desc: "Campuses, energy, and commuting." },
    ],
  },
  {
    key: "integrations",
    base: "/integrations",
    label: "Integrations",
    intro: "Connect ESGen to the systems your data already lives in.",
    template: "product",
    items: [
      { slug: "erp", title: "ERP", desc: "Sync operational and financial data." },
      { slug: "accounting", title: "Accounting", desc: "Use spend data as an emissions proxy." },
      { slug: "crm", title: "CRM", desc: "Align customer and reporting workflows." },
      { slug: "hr", title: "HR systems", desc: "Commuting and headcount-based estimates." },
      { slug: "procurement", title: "Procurement", desc: "Bring supplier and purchasing data in." },
      { slug: "cloud-storage", title: "Cloud storage", desc: "Import files from the tools you use." },
      { slug: "business-intelligence", title: "Business intelligence", desc: "Push emissions data into your BI stack." },
      { slug: "api", title: "API", desc: "Build your own connections." },
      { slug: "third-party-apps", title: "Third-party apps", desc: "A growing library of connectors." },
    ],
  },
  {
    key: "customers",
    base: "/customers",
    label: "Customers",
    intro: "Stories, case studies, and outcomes from teams using ESGen.",
    template: "listing",
    items: [
      { slug: "stories", title: "Customer stories", desc: "How teams got their first report done." },
      { slug: "case-studies", title: "Case studies", desc: "Detailed, outcome-led write-ups." },
      { slug: "testimonials", title: "Testimonials", desc: "In their own words." },
      { slug: "success-metrics", title: "Success metrics", desc: "The results that matter." },
      { slug: "reviews", title: "Reviews", desc: "What customers say elsewhere." },
      { slug: "logos", title: "Customer logos", desc: "The organisations we work with." },
    ],
  },
  {
    key: "resources",
    base: "/resources",
    label: "Resources",
    intro: "Guides, articles, templates, and tools to help you report with confidence.",
    template: "listing",
    items: [
      { slug: "blog", title: "Blog", desc: "Plain-English takes on carbon and ESG." },
      { slug: "articles", title: "Articles", desc: "Deeper explainers and how-tos." },
      { slug: "news", title: "News", desc: "Updates from ESGen and the sector." },
      { slug: "reports", title: "Reports", desc: "Research and analysis." },
      { slug: "whitepapers", title: "Whitepapers", desc: "In-depth reference documents." },
      { slug: "ebooks", title: "Ebooks", desc: "Long-form guides to download." },
      { slug: "guides", title: "Guides", desc: "Step-by-step walkthroughs." },
      { slug: "webinars", title: "Webinars", desc: "Live and on-demand sessions." },
      { slug: "videos", title: "Videos", desc: "Short explainers and demos." },
      { slug: "podcasts", title: "Podcasts", desc: "Conversations on sustainability." },
      { slug: "research", title: "Research", desc: "Data and findings." },
      { slug: "templates", title: "Templates", desc: "Ready-to-use starting points." },
      { slug: "checklists", title: "Checklists", desc: "Don't miss a step." },
      { slug: "faqs", title: "FAQs", desc: "Answers to common questions." },
      { slug: "documentation", title: "Documentation", desc: "Product help and reference." },
    ],
  },
  {
    key: "knowledge",
    base: "/knowledge",
    label: "Knowledge Hub",
    intro: "The Carbon Academy: learn the fundamentals of carbon accounting and ESG.",
    template: "article",
    items: [
      { slug: "sustainability-basics", title: "Sustainability basics", desc: "Start here if you are new to this." },
      { slug: "esg-knowledge", title: "ESG knowledge", desc: "What environmental, social, and governance means." },
      { slug: "carbon-accounting", title: "Carbon accounting", desc: "How emissions are measured." },
      { slug: "regulations", title: "Regulations", desc: "The rules that may apply to you." },
      { slug: "standards", title: "Standards", desc: "GHG Protocol, ISO, and more." },
      { slug: "frameworks", title: "Frameworks", desc: "CSRD, ISSB, and how they fit together." },
      { slug: "best-practices", title: "Best practices", desc: "How to do this well." },
      { slug: "methodologies", title: "Methodologies", desc: "The methods behind the numbers." },
      { slug: "glossary", title: "Glossary", desc: "Key ESG terms, explained." },
    ],
  },
  {
    key: "compliance",
    base: "/compliance",
    label: "Compliance",
    intro: "Plain, accurate primers on the frameworks that shape reporting, and how ESGen supports each one.",
    template: "compliance",
    items: [
      { slug: "csrd", title: "CSRD", desc: "The EU Corporate Sustainability Reporting Directive." },
      { slug: "ghg-protocol", title: "GHG Protocol", desc: "The most widely used emissions accounting standard." },
      { slug: "ifrs-sustainability", title: "IFRS Sustainability", desc: "IFRS S1 and S2 disclosure standards." },
      { slug: "issb", title: "ISSB", desc: "The global baseline from the IFRS Foundation." },
      { slug: "cdp", title: "CDP", desc: "The leading environmental disclosure system." },
      { slug: "tcfd", title: "TCFD", desc: "Climate risk disclosure, now inside the ISSB standards." },
      { slug: "sbti", title: "SBTi", desc: "Science-based emissions reduction targets." },
      { slug: "iso-standards", title: "ISO standards", desc: "ISO 14064, 14067, 14068, 14001, and 50001." },
      { slug: "sec-climate-rules", title: "SEC climate rules", desc: "The current state of US federal and state rules." },
      { slug: "eu-regulations", title: "EU regulations", desc: "Taxonomy, CSDDD, CBAM, and SFDR." },
      { slug: "brsr", title: "BRSR (India)", desc: "SEBI's Business Responsibility and Sustainability Report." },
    ],
  },
  {
    key: "partners",
    base: "/partners",
    label: "Partners",
    intro: "Build with ESGen: technology, consulting, and integration partnerships.",
    template: "solution",
    items: [
      { slug: "technology", title: "Technology partners", desc: "Integrate your product with ESGen." },
      { slug: "consulting", title: "Consulting partners", desc: "Deliver ESGen to your clients." },
      { slug: "integration", title: "Integration partners", desc: "Connect systems and data." },
      { slug: "affiliate", title: "Affiliate programme", desc: "Refer and earn." },
      { slug: "become-a-partner", title: "Become a partner", desc: "Start a conversation." },
    ],
  },
  {
    key: "company",
    base: "/company",
    label: "Company",
    intro: "Who we are, what we believe, and where we are going.",
    template: "company",
    items: [
      { slug: "about", title: "About", desc: "A small team with a simple goal." },
      { slug: "our-story", title: "Our story", desc: "How ESGen started." },
      { slug: "mission", title: "Mission", desc: "Why we exist." },
      { slug: "vision", title: "Vision", desc: "Where we are heading." },
      { slug: "leadership", title: "Leadership", desc: "The people leading ESGen." },
      { slug: "team", title: "Team", desc: "The people behind the product." },
      { slug: "careers", title: "Careers", desc: "Join us." },
      { slug: "culture", title: "Culture", desc: "How we work." },
      { slug: "investors", title: "Investors", desc: "Information for investors." },
      { slug: "press", title: "Press", desc: "News and media." },
      { slug: "awards", title: "Awards", desc: "Recognition." },
      { slug: "events", title: "Events", desc: "Where to find us." },
      { slug: "contact", title: "Contact", desc: "Get in touch." },
    ],
  },
  {
    key: "careers",
    base: "/careers",
    label: "Careers",
    intro: "Help us make carbon accounting simple and honest.",
    template: "listing",
    items: [
      { slug: "open-positions", title: "Open positions", desc: "Current roles." },
      { slug: "departments", title: "Departments", desc: "How we are organised." },
      { slug: "benefits", title: "Benefits", desc: "What we offer." },
      { slug: "life", title: "Life at ESGen", desc: "A look inside." },
      { slug: "hiring-process", title: "Hiring process", desc: "What to expect." },
      { slug: "graduate-programme", title: "Graduate programme", desc: "Start your career." },
      { slug: "internship-programme", title: "Internships", desc: "Learn with us." },
    ],
  },
  {
    key: "press",
    base: "/press",
    label: "Press",
    intro: "Announcements, media resources, and coverage.",
    template: "listing",
    items: [
      { slug: "releases", title: "Press releases", desc: "Official announcements." },
      { slug: "media-kit", title: "Media kit", desc: "Logos and brand assets." },
      { slug: "brand-assets", title: "Brand assets", desc: "Download our logo and guidelines." },
      { slug: "coverage", title: "Coverage", desc: "ESGen in the news." },
      { slug: "updates", title: "Updates", desc: "Product and company updates." },
    ],
  },
  {
    key: "events",
    base: "/events",
    label: "Events",
    intro: "Webinars, workshops, and conferences.",
    template: "listing",
    items: [
      { slug: "upcoming", title: "Upcoming", desc: "What is next." },
      { slug: "conferences", title: "Conferences", desc: "Where we will be." },
      { slug: "webinars", title: "Webinars", desc: "Learn online." },
      { slug: "workshops", title: "Workshops", desc: "Hands-on sessions." },
      { slug: "past", title: "Past events", desc: "Catch up on demand." },
    ],
  },
  {
    key: "support",
    base: "/support",
    label: "Support",
    intro: "Help when you need it.",
    template: "listing",
    items: [
      { slug: "help-centre", title: "Help centre", desc: "Guides and answers." },
      { slug: "documentation", title: "Documentation", desc: "Product reference." },
      { slug: "tutorials", title: "Tutorials", desc: "Step-by-step help." },
      { slug: "community", title: "Community", desc: "Ask and share." },
      { slug: "status", title: "System status", desc: "Live service status." },
      { slug: "contact-support", title: "Contact support", desc: "Reach the team." },
    ],
  },
  {
    key: "docs",
    base: "/docs",
    label: "Documentation",
    intro: "Everything you need to build with and use ESGen.",
    template: "article",
    items: [
      { slug: "getting-started", title: "Getting started", desc: "Set up your workspace." },
      { slug: "user-guides", title: "User guides", desc: "Use the product day to day." },
      { slug: "api", title: "API reference", desc: "Endpoints and examples." },
      { slug: "sdks", title: "SDKs", desc: "Libraries and tooling." },
      { slug: "developer-portal", title: "Developer portal", desc: "Build integrations." },
      { slug: "release-notes", title: "Release notes", desc: "What is new." },
      { slug: "changelog", title: "Changelog", desc: "Detailed changes." },
    ],
  },
  {
    key: "trust",
    base: "/trust",
    label: "Trust and Security",
    intro: "How we protect your data and earn your trust.",
    template: "product",
    items: [
      { slug: "security-overview", title: "Security overview", desc: "Our approach to security." },
      { slug: "data-privacy", title: "Data privacy", desc: "How we handle personal data." },
      { slug: "compliance", title: "Compliance", desc: "Standards we align to." },
      { slug: "certifications", title: "Certifications", desc: "Where we are on the journey." },
      { slug: "trust-centre", title: "Trust centre", desc: "Documents and answers." },
      { slug: "incident-response", title: "Incident response", desc: "How we respond." },
      { slug: "responsible-disclosure", title: "Responsible disclosure", desc: "Report a vulnerability." },
    ],
  },
  {
    key: "legal",
    base: "/legal",
    label: "Legal",
    intro: "Policies and terms.",
    template: "legal",
    items: [
      { slug: "privacy-policy", title: "Privacy policy", desc: "How we use data." },
      { slug: "cookie-policy", title: "Cookie policy", desc: "How we use cookies." },
      { slug: "terms", title: "Terms of service", desc: "The rules of use." },
      { slug: "accessibility", title: "Accessibility", desc: "Our commitment." },
      { slug: "gdpr", title: "GDPR", desc: "Your data rights." },
      { slug: "data-processing-agreement", title: "Data processing agreement", desc: "For customers." },
      { slug: "cookie-preferences", title: "Cookie preferences", desc: "Manage your choices." },
      { slug: "disclaimer", title: "Disclaimer", desc: "Important notices." },
      { slug: "copyright", title: "Copyright", desc: "Ownership and use." },
    ],
  },
];

export function getCollection(key: string): Collection | undefined {
  return collections.find((c) => c.key === key);
}

/* ---------- Top navigation (mega-menu) ---------- */

export type MegaColumn = { heading: string; links: { title: string; href: string; desc?: string }[] };
export type NavEntry =
  | { label: string; href: string }
  | { label: string; columns: MegaColumn[]; featured?: { title: string; desc: string; href: string } };

const pick = (key: string, slugs: string[]): { title: string; href: string; desc?: string }[] => {
  const c = getCollection(key)!;
  return slugs.map((s) => {
    const it = c.items.find((i) => i.slug === s)!;
    return { title: it.title, href: `${c.base}/${it.slug}`, desc: it.desc };
  });
};

export const mainNav: NavEntry[] = [
  { label: "Home", href: "/" },
  {
    label: "Platform",
    columns: [
      { heading: "Overview", links: [{ title: "Platform overview", href: "/platform", desc: "Everything in one place" }, ...pick("platform", ["dashboard", "data-collection", "reporting"]) ] },
      { heading: "Capabilities", links: pick("platform", ["analytics", "automation", "ai", "workflow"]) },
      { heading: "Trust", links: pick("platform", ["integrations", "api", "data-quality", "security"]) },
    ],
    featured: { title: "See a product tour", desc: "Watch how a report comes together", href: "/demo" },
  },
  {
    label: "Solutions",
    columns: [
      { heading: "By goal", links: pick("solutions", ["compliance", "net-zero", "carbon-management", "risk-management"]) },
      { heading: "By team", links: pick("solutions", ["department", "procurement", "supply-chain", "reporting"]) },
      { heading: "By size", links: [{ title: "All solutions", href: "/solutions", desc: "Browse everything" }, ...pick("solutions", ["business-size", "use-case", "esg"]) ] },
    ],
  },
  {
    label: "Industries",
    columns: [
      { heading: "Sectors", links: pick("industries", ["manufacturing", "retail", "logistics", "food-and-beverage"]) },
      { heading: "More sectors", links: pick("industries", ["construction", "energy", "financial-services", "technology"]) },
      { heading: "Public and services", links: [{ title: "All industries", href: "/industries", desc: "Browse everything" }, ...pick("industries", ["healthcare", "public-sector", "professional-services"]) ] },
    ],
  },
  {
    label: "Customers",
    columns: [
      { heading: "Proof", links: pick("customers", ["stories", "case-studies", "testimonials", "success-metrics"]) },
    ],
  },
  {
    label: "Resources",
    columns: [
      { heading: "Knowledge Hub", links: [{ title: "Carbon Academy", href: "/knowledge", desc: "Learn the fundamentals" }, ...pick("knowledge", ["carbon-accounting", "frameworks", "glossary"]) ] },
      { heading: "Compliance", links: pick("compliance", ["csrd", "ghg-protocol", "issb", "sbti"]) },
      { heading: "Library", links: pick("resources", ["blog", "guides", "webinars", "templates"]) },
    ],
    featured: { title: "Carbon Academy", desc: "Free primers on scopes, frameworks, and reporting", href: "/knowledge" },
  },
  {
    label: "Company",
    columns: [
      { heading: "About ESGen", links: pick("company", ["about", "our-story", "mission", "leadership"]) },
      { heading: "Join and follow", links: pick("company", ["careers", "culture", "press", "events"]) },
    ],
  },
  {
    label: "Partners",
    columns: [
      { heading: "Programmes", links: pick("partners", ["technology", "consulting", "integration", "become-a-partner"]) },
    ],
  },
  { label: "Pricing", href: "/pricing" },
  { label: "Contact", href: "/contact" },
];

/* ---------- Footer ---------- */

export const footerColumns: { heading: string; links: { title: string; href: string }[] }[] = [
  {
    heading: "Product",
    links: [
      { title: "Platform", href: "/platform" },
      { title: "Features", href: "/features" },
      { title: "Integrations", href: "/integrations" },
      { title: "Pricing", href: "/pricing" },
      { title: "Book a demo", href: "/demo" },
    ],
  },
  {
    heading: "Solutions",
    links: [
      { title: "Compliance", href: "/solutions/compliance" },
      { title: "Net zero", href: "/solutions/net-zero" },
      { title: "Supply chain", href: "/solutions/supply-chain" },
      { title: "Industries", href: "/industries" },
      { title: "Manufacturing", href: "/industries/manufacturing" },
    ],
  },
  {
    heading: "Resources",
    links: [
      { title: "Carbon Academy", href: "/knowledge" },
      { title: "Compliance primers", href: "/compliance" },
      { title: "Blog", href: "/resources/blog" },
      { title: "Guides", href: "/resources/guides" },
      { title: "Glossary", href: "/knowledge/glossary" },
    ],
  },
  {
    heading: "Company",
    links: [
      { title: "About", href: "/company/about" },
      { title: "Careers", href: "/careers" },
      { title: "Press", href: "/press" },
      { title: "Partners", href: "/partners" },
      { title: "Contact", href: "/contact" },
    ],
  },
  {
    heading: "Trust",
    links: [
      { title: "Trust centre", href: "/trust" },
      { title: "Security", href: "/platform/security" },
      { title: "Privacy policy", href: "/legal/privacy-policy" },
      { title: "Terms", href: "/legal/terms" },
      { title: "Status", href: "/support/status" },
    ],
  },
];

export const legalLinks = [
  { title: "Privacy", href: "/legal/privacy-policy" },
  { title: "Cookies", href: "/legal/cookie-policy" },
  { title: "Terms", href: "/legal/terms" },
  { title: "Accessibility", href: "/legal/accessibility" },
  { title: "GDPR", href: "/legal/gdpr" },
];
