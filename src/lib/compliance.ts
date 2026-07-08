/* ============================================================
   Accurate compliance reference (source of truth: Appendix B).
   British English. No em dashes. Add a visible "last reviewed"
   note on each page and tell readers to verify current status.
   ============================================================ */

export type ComplianceEntry = {
  slug: string;
  name: string;
  full: string;
  summary: string;
  whatItIs: string[];
  status: { heading: string; body: string[] };
  requirements: { t: string; d: string }[];
  esgenHelps: string[];
  faqs: { q: string; a: string }[];
  lastReviewed: string;
};

const REVIEWED = "Early 2026";

export const complianceData: Record<string, ComplianceEntry> = {
  csrd: {
    slug: "csrd",
    name: "CSRD",
    full: "Corporate Sustainability Reporting Directive",
    summary:
      "The EU directive that sets how in-scope companies report sustainability information. Its scope was narrowed sharply in 2026, so the first question is whether it still applies to you.",
    whatItIs: [
      "The Corporate Sustainability Reporting Directive (CSRD) requires in-scope companies to report sustainability information against the European Sustainability Reporting Standards (ESRS), with limited assurance, on a double-materiality basis. Double materiality means you report both how sustainability issues affect your business and how your business affects people and the environment.",
      "In February 2026 the EU adopted the Omnibus I package, in force from 18 March 2026, which significantly narrowed who has to report. Broadly, only companies with more than 1,000 employees and more than 450 million euros in net turnover are now in scope, and listed small and medium-sized enterprises are excluded.",
    ],
    status: {
      heading: "Who it applies to and current status",
      body: [
        "The narrowed scope applies for financial years beginning on or after 1 January 2027. First-wave companies that are already reporting continue under the existing rules for financial years 2024 to 2026, although member states may choose to exempt companies that have been taken out of scope.",
        "A simplified voluntary standard, known as VSME, is intended for smaller companies in the value chains of larger reporters. In practice, many small and medium-sized businesses that expected to report are now out of scope. That makes voluntary, value-chain-driven measurement more relevant than a blanket mandate, because large customers still need data from their suppliers.",
      ],
    },
    requirements: [
      { t: "ESRS reporting", d: "Report against the European Sustainability Reporting Standards, covering environmental, social, and governance topics." },
      { t: "Double materiality", d: "Assess both financial materiality and impact materiality to decide what to report." },
      { t: "Limited assurance", d: "Have the sustainability information independently assured to a limited level." },
      { t: "Value-chain data", d: "Include relevant data from your value chain, which is where much of the effort sits." },
    ],
    esgenHelps: [
      "Measure Scope 1, 2, and 3 emissions on the GHG Protocol, which underpins the climate parts of ESRS.",
      "Keep a clear audit trail so figures are ready for limited assurance.",
      "Help suppliers respond to large customers even when they are not directly in scope.",
    ],
    faqs: [
      { q: "Are small companies still in scope of CSRD?", a: "Under the 2026 Omnibus reset, most small and medium-sized enterprises, including listed ones, are no longer directly in scope. Many still need to provide data to larger customers, so voluntary measurement remains valuable." },
      { q: "What is double materiality?", a: "It means reporting both how sustainability issues affect your business financially and how your business affects people and the planet." },
    ],
    lastReviewed: REVIEWED,
  },
  "ghg-protocol": {
    slug: "ghg-protocol",
    name: "GHG Protocol",
    full: "Greenhouse Gas Protocol",
    summary:
      "The most widely used standard for corporate emissions accounting, and the foundation ESGen is built on.",
    whatItIs: [
      "The Greenhouse Gas Protocol is the most widely used greenhouse gas accounting standard in the world. It was developed by the World Resources Institute and the World Business Council for Sustainable Development.",
      "Its core standards are the Corporate Standard, the Scope 2 Guidance, and the Corporate Value Chain (Scope 3) Standard, plus a Product Standard. It underpins most other frameworks, including IFRS S2 and CDP.",
    ],
    status: {
      heading: "Current status",
      body: [
        "The standards are being revised through a multi-year process, with updates expected around 2026 to 2027. The core approach of grouping emissions into three scopes is stable and widely adopted.",
      ],
    },
    requirements: [
      { t: "Scope 1", d: "Direct emissions from sources you own or control, such as company vehicles and on-site fuel combustion." },
      { t: "Scope 2", d: "Indirect emissions from the energy you purchase, such as electricity, steam, heating, and cooling." },
      { t: "Scope 3", d: "All other indirect emissions across your value chain, split into 15 categories. Usually the largest and hardest to measure." },
      { t: "Consistent methods", d: "Use recognised emission factors and document your assumptions." },
    ],
    esgenHelps: [
      "Calculate all three scopes using recognised UK and international emission factors.",
      "Show the factors and assumptions behind every figure, so nothing is a black box.",
      "Produce a clean, referenced pack you can share with an auditor.",
    ],
    faqs: [
      { q: "Do I have to report Scope 3?", a: "It depends on the framework you are reporting under, but Scope 3 is usually the largest part of a footprint, so measuring it gives the fullest picture and is increasingly expected." },
      { q: "Is the GHG Protocol mandatory?", a: "The GHG Protocol is a standard, not a law. Many mandatory frameworks are built on top of it, so following it prepares you for most reporting requirements." },
    ],
    lastReviewed: REVIEWED,
  },
  "ifrs-sustainability": {
    slug: "ifrs-sustainability",
    name: "IFRS Sustainability",
    full: "IFRS Sustainability Disclosure Standards",
    summary:
      "The global baseline for sustainability disclosure, issued by the ISSB as IFRS S1 and IFRS S2.",
    whatItIs: [
      "The IFRS Sustainability Disclosure Standards are issued by the International Sustainability Standards Board (ISSB), part of the IFRS Foundation. The first two standards were issued in June 2023: IFRS S1 covers general sustainability-related financial disclosures, and IFRS S2 covers climate-related disclosures.",
      "They are effective for annual reporting periods beginning on or after 1 January 2024. IFRS S2 fully incorporates the four pillars of the TCFD and requires disclosure of Scope 1, 2, and 3 emissions plus industry-specific metrics.",
    ],
    status: {
      heading: "Current status",
      body: [
        "The standards are intended as a global baseline. As of late 2025 around 30 jurisdictions had adopted them or were in the process of adopting them. Check whether your jurisdiction has adopted them and on what timeline.",
      ],
    },
    requirements: [
      { t: "IFRS S1", d: "General sustainability-related financial information that is material to investors." },
      { t: "IFRS S2", d: "Climate-related disclosures, including governance, strategy, risk management, and metrics and targets." },
      { t: "Scope 1, 2, and 3", d: "Disclose greenhouse gas emissions across all three scopes." },
      { t: "Industry metrics", d: "Provide industry-specific metrics, drawing on SASB standards." },
    ],
    esgenHelps: [
      "Produce Scope 1, 2, and 3 figures ready for IFRS S2 disclosure.",
      "Keep the underlying data organised so climate metrics and targets are easy to report.",
      "Support a CDP response, which is aligned with IFRS S2.",
    ],
    faqs: [
      { q: "Is IFRS S2 the same as TCFD?", a: "IFRS S2 incorporates the four TCFD pillars. Companies that apply IFRS S2 already meet the TCFD recommendations." },
      { q: "Does IFRS S2 require Scope 3?", a: "Yes, it requires disclosure of Scope 1, 2, and 3 emissions, with some relief provisions in early years depending on jurisdiction adoption." },
    ],
    lastReviewed: REVIEWED,
  },
  issb: {
    slug: "issb",
    name: "ISSB",
    full: "International Sustainability Standards Board",
    summary:
      "The board that sets the IFRS Sustainability Disclosure Standards, the emerging global baseline.",
    whatItIs: [
      "The International Sustainability Standards Board (ISSB) is part of the IFRS Foundation. It issued IFRS S1 and IFRS S2 in June 2023 to create a global baseline for sustainability disclosure.",
      "IFRS S2 fully incorporates the four TCFD pillars and requires Scope 1, 2, and 3 emissions disclosure plus industry-specific metrics that draw on SASB.",
    ],
    status: {
      heading: "Current status",
      body: [
        "The standards are effective for annual reporting periods beginning on or after 1 January 2024. Adoption is happening jurisdiction by jurisdiction, with around 30 jurisdictions adopting or moving to adopt as of late 2025.",
      ],
    },
    requirements: [
      { t: "Global baseline", d: "A consistent starting point that jurisdictions can build on." },
      { t: "Investor focus", d: "Disclosures aimed at the information investors need to price risk." },
      { t: "Climate first", d: "IFRS S2 sets the climate-related requirements, including emissions." },
      { t: "Connected to accounts", d: "Sustainability information reported alongside financial reporting." },
    ],
    esgenHelps: [
      "Give you audit-ready Scope 1, 2, and 3 data for IFRS S2.",
      "Track climate metrics and targets over time.",
      "Keep methods transparent so disclosures stand up to scrutiny.",
    ],
    faqs: [
      { q: "What is the difference between the ISSB and IFRS standards?", a: "The ISSB is the board. The IFRS Sustainability Disclosure Standards, IFRS S1 and S2, are the standards it issues." },
      { q: "Has the UK adopted the ISSB standards?", a: "Adoption is decided jurisdiction by jurisdiction and is evolving. Check the current position for your country before relying on it." },
    ],
    lastReviewed: REVIEWED,
  },
  cdp: {
    slug: "cdp",
    name: "CDP",
    full: "CDP environmental disclosure",
    summary:
      "The leading global environmental disclosure system, used by investors and large buyers.",
    whatItIs: [
      "CDP is a global non-profit that runs the leading environmental disclosure system. It was formerly known as the Carbon Disclosure Project.",
      "Companies respond to an annual questionnaire on climate, water, and forests. Responses are scored and used by investors and large buyers to assess environmental performance.",
    ],
    status: {
      heading: "Current status",
      body: [
        "In 2024 CDP aligned its corporate questionnaire with IFRS S2. That means a CDP response supports ISSB-aligned reporting, so the work you do for one increasingly supports the other.",
      ],
    },
    requirements: [
      { t: "Annual questionnaire", d: "Respond on climate, and optionally water and forests." },
      { t: "Emissions data", d: "Report Scope 1, 2, and often Scope 3 emissions." },
      { t: "Targets and governance", d: "Describe targets, governance, and risk management." },
      { t: "Scoring", d: "Responses are scored, and the score is visible to investors and buyers." },
    ],
    esgenHelps: [
      "Prepare the emissions figures a CDP response needs.",
      "Keep supporting evidence organised for the questionnaire.",
      "Reuse the same data for ISSB-aligned reporting.",
    ],
    faqs: [
      { q: "Who asks for a CDP response?", a: "Often large customers and investors request one. Responding can be a condition of staying on a supplier list." },
      { q: "Is CDP the same as the GHG Protocol?", a: "No. CDP is a disclosure system. It uses emissions data that you calculate using the GHG Protocol." },
    ],
    lastReviewed: REVIEWED,
  },
  tcfd: {
    slug: "tcfd",
    name: "TCFD",
    full: "Task Force on Climate-related Financial Disclosures",
    summary:
      "The foundational climate risk framework that now lives inside the ISSB standards.",
    whatItIs: [
      "The Task Force on Climate-related Financial Disclosures (TCFD) was created by the Financial Stability Board in 2015 and published its recommendations in 2017. They are built on four pillars: governance, strategy, risk management, and metrics and targets.",
      "The TCFD disbanded in October 2023, and monitoring responsibilities passed to the IFRS Foundation from 2024. Companies that apply IFRS S2 already meet the TCFD recommendations.",
    ],
    status: {
      heading: "Current status",
      body: [
        "TCFD is best understood as the foundational framework that now lives inside the ISSB standards, rather than as a separate live obligation. If you are working towards IFRS S2, you are also meeting the TCFD recommendations.",
      ],
    },
    requirements: [
      { t: "Governance", d: "How the board and management oversee climate-related risks and opportunities." },
      { t: "Strategy", d: "The actual and potential impacts of climate on the business." },
      { t: "Risk management", d: "How climate risks are identified, assessed, and managed." },
      { t: "Metrics and targets", d: "The metrics and targets used, including emissions." },
    ],
    esgenHelps: [
      "Provide the emissions metrics that sit under the metrics and targets pillar.",
      "Organise data so climate reporting is repeatable year to year.",
      "Prepare you for IFRS S2, which incorporates all four TCFD pillars.",
    ],
    faqs: [
      { q: "Is TCFD still a thing?", a: "The task force has disbanded, but its four pillars live on inside IFRS S2. Meeting IFRS S2 means meeting the TCFD recommendations." },
      { q: "Do I report TCFD separately?", a: "Increasingly no. It is best approached through the ISSB standards that now carry it forward." },
    ],
    lastReviewed: REVIEWED,
  },
  sbti: {
    slug: "sbti",
    name: "SBTi",
    full: "Science Based Targets initiative",
    summary:
      "The initiative that validates corporate emissions reduction targets against climate science.",
    whatItIs: [
      "The Science Based Targets initiative (SBTi) validates corporate emissions reduction targets that are aligned with climate science, typically limiting warming to 1.5 degrees Celsius.",
      "Its Corporate Net-Zero Standard sets requirements for near-term and long-term targets and for neutralising residual emissions.",
    ],
    status: {
      heading: "Current status",
      body: [
        "The operative standard is the 2021 version. A major revision, the Corporate Net-Zero Standard version 2, was released as a second draft for consultation in November 2025 and is not yet finalised, so it should be treated as in development.",
      ],
    },
    requirements: [
      { t: "Near-term targets", d: "Reduce emissions in line with a 1.5 degree pathway over the next several years." },
      { t: "Long-term targets", d: "Set a net-zero target with deep reductions before neutralising the remainder." },
      { t: "Cover the value chain", d: "Include Scope 3 where it is significant." },
      { t: "Validation", d: "Have the target reviewed and validated by the SBTi." },
    ],
    esgenHelps: [
      "Build the baseline you need before setting a target.",
      "Model reduction scenarios against business as usual.",
      "Track progress against your target over time.",
    ],
    faqs: [
      { q: "Do I need SBTi validation?", a: "It is voluntary, but a validated target is a credible, widely recognised signal to customers and investors." },
      { q: "Is a new SBTi standard coming?", a: "A version 2 of the Corporate Net-Zero Standard is in development as of late 2025. Check the SBTi for the current status before committing." },
    ],
    lastReviewed: REVIEWED,
  },
  "iso-standards": {
    slug: "iso-standards",
    name: "ISO standards",
    full: "ISO environmental and energy standards",
    summary:
      "Voluntary, verifiable standards that complement the GHG Protocol.",
    whatItIs: [
      "Several ISO standards are relevant to carbon and energy management. They are voluntary and verifiable, and they complement the GHG Protocol rather than replacing it.",
      "The most relevant are ISO 14064 for greenhouse gas quantification and verification, ISO 14067 for product carbon footprints, ISO 14068-1:2023 for carbon neutrality, ISO 14001 for environmental management systems, and ISO 50001 for energy management.",
    ],
    status: {
      heading: "Current status",
      body: [
        "These are established standards. Which ones matter depends on your goals: organisational reporting, product footprints, neutrality claims, or management systems.",
      ],
    },
    requirements: [
      { t: "ISO 14064", d: "Quantify and verify greenhouse gas emissions, in three parts." },
      { t: "ISO 14067", d: "Measure the carbon footprint of a product." },
      { t: "ISO 14068-1", d: "Requirements for carbon neutrality claims." },
      { t: "ISO 14001 and 50001", d: "Environmental and energy management systems." },
    ],
    esgenHelps: [
      "Provide quantification aligned with recognised methods.",
      "Keep verifiable records that support assurance.",
      "Organise energy and emissions data in one place.",
    ],
    faqs: [
      { q: "Do ISO standards replace the GHG Protocol?", a: "No. They complement it. Many organisations use the GHG Protocol for accounting and ISO standards for verification or management systems." },
      { q: "Which ISO standard is for products?", a: "ISO 14067 covers product carbon footprints." },
    ],
    lastReviewed: REVIEWED,
  },
  "sec-climate-rules": {
    slug: "sec-climate-rules",
    name: "SEC climate rules",
    full: "United States climate disclosure",
    summary:
      "The federal rule is effectively dormant. In practice, US climate disclosure is driven mainly by state law.",
    whatItIs: [
      "The US Securities and Exchange Commission adopted climate disclosure rules in March 2024, but they were stayed and never took effect. The SEC withdrew its legal defence in March 2025 and formally proposed to rescind the rules in May 2026, with a final decision not expected before late 2026 or 2027.",
      "In practice the federal rule is effectively dormant. It is better to plan around the current reality than around the 2024 rule as if it were in force.",
    ],
    status: {
      heading: "Current status",
      body: [
        "United States climate disclosure is now driven mainly by state law. The most notable are California SB 253, which requires greenhouse gas reporting with first Scope 1 and 2 deadlines in 2026, and SB 261, which covers climate risk. New York has proposed similar legislation.",
        "Companies with international operations also face the ISSB standards and, where still in scope, CSRD. If you operate in California or sell into it, the state rules are the ones to watch.",
      ],
    },
    requirements: [
      { t: "California SB 253", d: "Greenhouse gas reporting, with first Scope 1 and 2 deadlines in 2026." },
      { t: "California SB 261", d: "Climate-related financial risk reporting." },
      { t: "ISSB and CSRD", d: "Relevant for companies with international operations." },
      { t: "Watch federal", d: "The federal rule is dormant but could change." },
    ],
    esgenHelps: [
      "Produce Scope 1 and 2 figures for state reporting such as SB 253.",
      "Keep data ready if federal rules return or state rules expand.",
      "Support ISSB-aligned reporting for international operations.",
    ],
    faqs: [
      { q: "Do I need to follow the SEC climate rule?", a: "The federal rule is effectively dormant. Most US climate disclosure obligations now come from state law, especially in California." },
      { q: "What is California SB 253?", a: "A state law requiring greenhouse gas reporting, with first Scope 1 and 2 deadlines in 2026." },
    ],
    lastReviewed: REVIEWED,
  },
  "eu-regulations": {
    slug: "eu-regulations",
    name: "EU regulations",
    full: "Wider EU sustainability framework",
    summary:
      "Beyond CSRD, several EU rules shape sustainability data, from the Taxonomy to CBAM.",
    whatItIs: [
      "Beyond CSRD, the EU framework includes several important regulations. The EU Taxonomy is a classification of environmentally sustainable activities. The Corporate Sustainability Due Diligence Directive (CSDDD) was narrowed by Omnibus I to the largest companies from 2029.",
      "The Carbon Border Adjustment Mechanism (CBAM) has a definitive regime that applies from 2026 to importers of carbon-intensive goods such as steel, cement, aluminium, and fertilisers. The Sustainable Finance Disclosure Regulation (SFDR) applies to financial market participants.",
    ],
    status: {
      heading: "Current status",
      body: [
        "These rules change and interact. CBAM in particular affects supply chains for carbon-intensive imports. Check which of these touch your business and on what timeline.",
      ],
    },
    requirements: [
      { t: "EU Taxonomy", d: "Classify activities against environmental criteria." },
      { t: "CSDDD", d: "Due diligence duties, narrowed to the largest companies from 2029." },
      { t: "CBAM", d: "Reporting and charges on carbon-intensive imports from 2026." },
      { t: "SFDR", d: "Disclosure rules for financial market participants." },
    ],
    esgenHelps: [
      "Provide the emissions data that supports Taxonomy and CBAM work.",
      "Help suppliers give importers the data CBAM requires.",
      "Keep a defensible record across your value chain.",
    ],
    faqs: [
      { q: "What is CBAM?", a: "The Carbon Border Adjustment Mechanism. From 2026 it applies to importers of carbon-intensive goods such as steel, cement, aluminium, and fertilisers." },
      { q: "Does the EU Taxonomy apply to my business?", a: "It mainly affects larger companies and financial products, but it can flow down to suppliers through customer requests." },
    ],
    lastReviewed: REVIEWED,
  },
  brsr: {
    slug: "brsr",
    name: "BRSR",
    full: "Business Responsibility and Sustainability Report (India)",
    summary:
      "India's sustainability reporting framework for large listed companies, and increasingly their suppliers.",
    whatItIs: [
      "The Business Responsibility and Sustainability Report (BRSR) is set by the Securities and Exchange Board of India (SEBI). It is mandatory for the top 1,000 listed companies in India by market capitalisation.",
      "A subset known as BRSR Core, which is subject to assurance, is being phased in. BRSR is relevant to Indian small and medium-sized enterprises that sit in the value chains of these large companies.",
    ],
    status: {
      heading: "Who it applies to and current status",
      body: [
        "The core obligation sits with the top 1,000 listed companies. If you supply one of them, you may be asked for emissions and other sustainability data so they can complete their report. Measuring early puts you ahead of those requests.",
      ],
    },
    requirements: [
      { t: "Top 1,000 listed", d: "Mandatory for the largest listed companies by market capitalisation." },
      { t: "BRSR Core", d: "An assured subset, phased in over time." },
      { t: "Value-chain data", d: "Large reporters need data from their suppliers." },
      { t: "ESG breadth", d: "Covers environmental, social, and governance topics." },
    ],
    esgenHelps: [
      "Help suppliers produce the emissions data large reporters request.",
      "Build a baseline that supports BRSR and other frameworks at once.",
      "Keep evidence organised for assured reporting.",
    ],
    faqs: [
      { q: "Does BRSR apply to small companies?", a: "The direct obligation is on the top 1,000 listed companies, but their suppliers are increasingly asked for data, which brings smaller firms into scope indirectly." },
      { q: "What is BRSR Core?", a: "A subset of BRSR that is subject to assurance and is being phased in." },
    ],
    lastReviewed: REVIEWED,
  },
};

export function getCompliance(slug: string): ComplianceEntry | undefined {
  return complianceData[slug];
}
