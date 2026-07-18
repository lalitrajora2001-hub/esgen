import type { ModuleDef } from "@/lib/brsr/types";

export const modulesP1P2: ModuleDef[] = [
  {
    key: "C.P1",
    navLabel: "Principle 1: Ethics & Transparency",
    section: "C",
    principle: 1,
    title:
      "Principle 1: Businesses should conduct and govern themselves with integrity, and in a manner that is Ethical, Transparent and Accountable",
    subsections: [
      {
        key: "C.P1.EI",
        title: "Essential Indicators",
        questions: [
          {
            key: "C.P1.EI.1",
            code: "Essential Indicator 1",
            section: "C",
            principle: 1,
            indicator: "essential",
            title:
              "Percentage coverage by training and awareness programmes on any of the Principles during the financial year",
            kind: "table",
            table: {
              columns: [
                { key: "segment", label: "Segment", type: "text" },
                {
                  key: "programmes",
                  label: "Total number of training and awareness programmes held",
                  type: "number",
                },
                {
                  key: "topics",
                  label:
                    "Topics / principles covered under the training and its impact",
                  type: "text",
                },
                {
                  key: "pct",
                  label:
                    "% age of persons in respective category covered by the awareness programmes",
                  type: "percentage",
                },
              ],
              rows: [
                { key: "bod", label: "Board of Directors" },
                { key: "kmp", label: "Key Managerial Personnel" },
                { key: "emp", label: "Employees other than BoD and KMPs" },
                { key: "workers", label: "Workers" },
              ],
            },
          },
          {
            key: "C.P1.EI.2a",
            code: "Essential Indicator 2 (a)",
            section: "C",
            principle: 1,
            indicator: "essential",
            title:
              "Details of fines / penalties / punishment / award / compounding fees / settlement amount paid — Monetary",
            help:
              "Details of fines / penalties / punishment / award / compounding fees / settlement amount paid in proceedings (by the entity or by directors / KMPs) with regulators / law enforcement agencies / judicial institutions, in the financial year.",
            kind: "table",
            evidence: true,
            evidenceHint:
              "Copies of the relevant regulator / court orders and settlement documents.",
            table: {
              columns: [
                { key: "principle", label: "NGRBC Principle", type: "text" },
                {
                  key: "agency",
                  label:
                    "Name of the regulatory / enforcement agencies / judicial institutions",
                  type: "text",
                },
                { key: "amount", label: "Amount (In INR)", type: "currency" },
                { key: "brief", label: "Brief of the Case", type: "text" },
                {
                  key: "appeal",
                  label: "Has an appeal been preferred? (Yes/No)",
                  type: "boolean",
                },
              ],
              rows: [
                { key: "penalty", label: "Penalty / Fine" },
                { key: "settlement", label: "Settlement" },
                { key: "compounding", label: "Compounding fee" },
              ],
            },
          },
          {
            key: "C.P1.EI.2b",
            code: "Essential Indicator 2 (b)",
            section: "C",
            principle: 1,
            indicator: "essential",
            title:
              "Details of fines / penalties / punishment / award / compounding fees / settlement amount paid — Non-Monetary",
            help:
              "Details of non-monetary actions in proceedings (by the entity or by directors / KMPs) with regulators / law enforcement agencies / judicial institutions, in the financial year.",
            kind: "table",
            evidence: true,
            evidenceHint:
              "Copies of the relevant regulator / court orders imposing the non-monetary action.",
            table: {
              columns: [
                { key: "principle", label: "NGRBC Principle", type: "text" },
                {
                  key: "agency",
                  label:
                    "Name of the regulatory / enforcement agencies / judicial institutions",
                  type: "text",
                },
                { key: "brief", label: "Brief of the Case", type: "text" },
                {
                  key: "appeal",
                  label: "Has an appeal been preferred? (Yes/No)",
                  type: "boolean",
                },
              ],
              rows: [
                { key: "imprisonment", label: "Imprisonment" },
                { key: "punishment", label: "Punishment" },
              ],
            },
          },
          {
            key: "C.P1.EI.3",
            code: "Essential Indicator 3",
            section: "C",
            principle: 1,
            indicator: "essential",
            title:
              "Details of the Appeal / Revision preferred in cases where monetary or non-monetary action has been appealed",
            kind: "table",
            table: {
              dynamic: true,
              addLabel: "Add appeal / revision",
              columns: [
                { key: "caseDetails", label: "Case Details", type: "text" },
                {
                  key: "agency",
                  label:
                    "Name of the regulatory / enforcement agencies / judicial institutions",
                  type: "text",
                },
              ],
            },
          },
          {
            key: "C.P1.EI.4",
            code: "Essential Indicator 4",
            section: "C",
            principle: 1,
            indicator: "essential",
            title:
              "Does the entity have an anti-corruption or anti-bribery policy? If yes, provide details in brief and if available, provide a web-link to the policy.",
            kind: "boolean",
            booleanDetail: "Brief details and web-link to the policy",
            evidence: true,
            evidenceHint: "Copy of the anti-corruption / anti-bribery policy.",
          },
          {
            key: "C.P1.EI.5",
            code: "Essential Indicator 5",
            section: "C",
            principle: 1,
            indicator: "essential",
            title:
              "Number of Directors / KMPs / employees / workers against whom disciplinary action was taken by any law enforcement agency for the charges of bribery / corruption",
            kind: "table",
            table: {
              perPeriod: true,
              columns: [{ key: "number", label: "Number", type: "number" }],
              rows: [
                { key: "directors", label: "Directors" },
                { key: "kmps", label: "KMPs" },
                { key: "employees", label: "Employees" },
                { key: "workers", label: "Workers" },
              ],
            },
          },
          {
            key: "C.P1.EI.6",
            code: "Essential Indicator 6",
            section: "C",
            principle: 1,
            indicator: "essential",
            title: "Details of complaints with regard to conflict of interest",
            kind: "table",
            table: {
              perPeriod: true,
              columns: [
                { key: "number", label: "Number", type: "number" },
                { key: "remarks", label: "Remarks", type: "text" },
              ],
              rows: [
                {
                  key: "directors",
                  label:
                    "Number of complaints received in relation to issues of Conflict of Interest of the Directors",
                },
                {
                  key: "kmps",
                  label:
                    "Number of complaints received in relation to issues of Conflict of Interest of the KMPs",
                },
              ],
            },
          },
          {
            key: "C.P1.EI.7",
            code: "Essential Indicator 7",
            section: "C",
            principle: 1,
            indicator: "essential",
            title:
              "Provide details of any corrective action taken or underway on issues related to fines / penalties / action taken by regulators / law enforcement agencies / judicial institutions, on cases of corruption and conflicts of interest.",
            kind: "narrative",
          },
          {
            key: "C.P1.EI.8",
            code: "Essential Indicator 8",
            section: "C",
            principle: 1,
            indicator: "essential",
            title: "Number of days of accounts payable",
            help:
              "Number of days of accounts payable = (Accounts payable × 365) / Cost of goods / services procured.",
            kind: "table",
            isCore: true,
            evidence: true,
            evidenceHint:
              "Financial statements supporting accounts payable and cost of goods / services procured.",
            table: {
              perPeriod: true,
              columns: [
                { key: "value", label: "Value (in days)", type: "number", unit: "days" },
              ],
              rows: [{ key: "apDays", label: "Accounts payable days" }],
            },
          },
          {
            key: "C.P1.EI.9",
            code: "Essential Indicator 9",
            section: "C",
            principle: 1,
            indicator: "essential",
            title:
              "Openness of business — details of concentration of purchases and sales with trading houses, dealers, and related parties, and of related-party transactions (RPTs)",
            kind: "table",
            isCore: true,
            evidence: true,
            evidenceHint:
              "Related-party transaction audit / financial statements substantiating the concentration ratios.",
            table: {
              perPeriod: true,
              columns: [
                { key: "metric", label: "Metric", type: "text" },
                { key: "value", label: "Value (% or count, per row label)", type: "number" },
              ],
              rows: [
                {
                  key: "purchTradingPct",
                  label:
                    "Purchases from trading houses as % of total purchases",
                  group: "Concentration of Purchases",
                },
                {
                  key: "numTradingHouses",
                  label: "Number of trading houses where purchases are made from",
                  group: "Concentration of Purchases",
                },
                {
                  key: "purchTop10Pct",
                  label:
                    "Purchases from top 10 trading houses as % of total purchases from trading houses",
                  group: "Concentration of Purchases",
                },
                {
                  key: "salesDealersPct",
                  label:
                    "Sales to dealers / distributors as % of total sales",
                  group: "Concentration of Sales",
                },
                {
                  key: "numDealers",
                  label: "Number of dealers / distributors to whom sales are made",
                  group: "Concentration of Sales",
                },
                {
                  key: "salesTop10Pct",
                  label:
                    "Sales to top 10 dealers / distributors as % of total sales to dealers / distributors",
                  group: "Concentration of Sales",
                },
                {
                  key: "rptPurchasesPct",
                  label: "Purchases (Related Party Transactions) as % of total purchases",
                  group: "Share of RPTs in",
                },
                {
                  key: "rptSalesPct",
                  label: "Sales (Related Party Transactions) as % of total sales",
                  group: "Share of RPTs in",
                },
                {
                  key: "rptLoansPct",
                  label:
                    "Loans & advances (Related Party Transactions) as % of total loans & advances",
                  group: "Share of RPTs in",
                },
                {
                  key: "rptInvestmentsPct",
                  label:
                    "Investments (Related Party Transactions) as % of total investments",
                  group: "Share of RPTs in",
                },
              ],
            },
          },
        ],
      },
      {
        key: "C.P1.LI",
        title: "Leadership Indicators",
        questions: [
          {
            key: "C.P1.LI.1",
            code: "Leadership Indicator 1",
            section: "C",
            principle: 1,
            indicator: "leadership",
            title:
              "Awareness programmes conducted for value chain partners on any of the Principles during the financial year",
            kind: "table",
            table: {
              columns: [
                {
                  key: "programmes",
                  label: "Total number of awareness programmes held",
                  type: "number",
                },
                {
                  key: "topics",
                  label: "Topics / principles covered under the training",
                  type: "text",
                },
                {
                  key: "pct",
                  label:
                    "% age of value chain partners covered (by value of business done with such partners) under the awareness programmes",
                  type: "percentage",
                },
              ],
            },
          },
          {
            key: "C.P1.LI.2",
            code: "Leadership Indicator 2",
            section: "C",
            principle: 1,
            indicator: "leadership",
            title:
              "Does the entity have processes in place to avoid / manage conflict of interests involving members of the Board? If yes, provide details of the same.",
            kind: "boolean",
            booleanDetail: "Details of the processes",
          },
        ],
      },
    ],
  },
  {
    key: "C.P2",
    navLabel: "Principle 2: Sustainable & Safe Goods",
    section: "C",
    principle: 2,
    title:
      "Principle 2: Businesses should provide goods and services in a manner that is sustainable and safe",
    subsections: [
      {
        key: "C.P2.EI",
        title: "Essential Indicators",
        questions: [
          {
            key: "C.P2.EI.1",
            code: "Essential Indicator 1",
            section: "C",
            principle: 2,
            indicator: "essential",
            title:
              "Percentage of R&D and capital expenditure (capex) investments in specific technologies to improve the environmental and social impacts of product and processes to total R&D and capex investments made by the entity, respectively.",
            kind: "table",
            table: {
              columns: [
                { key: "segment", label: "Segment", type: "text" },
                { key: "currentFy", label: "Current Financial Year", type: "percentage" },
                { key: "previousFy", label: "Previous Financial Year", type: "percentage" },
                {
                  key: "details",
                  label:
                    "Details of improvements in environmental and social impacts",
                  type: "text",
                },
              ],
              rows: [
                { key: "rd", label: "R&D" },
                { key: "capex", label: "Capex" },
              ],
            },
          },
          {
            key: "C.P2.EI.2",
            code: "Essential Indicator 2",
            section: "C",
            principle: 2,
            indicator: "essential",
            title: "Sustainable sourcing",
            kind: "fields",
            fields: [
              {
                key: "hasProcedures",
                label: "Does the entity have procedures in place for sustainable sourcing?",
                type: "boolean",
              },
              {
                key: "pctSustainable",
                label:
                  "If yes, what percentage of inputs were sourced sustainably?",
                type: "percentage",
                optional: true,
              },
            ],
          },
          {
            key: "C.P2.EI.3",
            code: "Essential Indicator 3",
            section: "C",
            principle: 2,
            indicator: "essential",
            title:
              "Describe the processes in place to safely reclaim your products for reusing, recycling and disposing at the end of life, for (a) Plastics (including packaging) (b) E-waste (c) Hazardous waste and (d) Other waste.",
            kind: "table",
            table: {
              columns: [
                {
                  key: "process",
                  label: "Description of the process in place",
                  type: "text",
                },
              ],
              rows: [
                { key: "plastics", label: "Plastics (including packaging)" },
                { key: "ewaste", label: "E-waste" },
                { key: "hazardous", label: "Hazardous waste" },
                { key: "other", label: "Other waste" },
              ],
            },
          },
          {
            key: "C.P2.EI.4",
            code: "Essential Indicator 4",
            section: "C",
            principle: 2,
            indicator: "essential",
            title:
              "Whether Extended Producer Responsibility (EPR) is applicable to the entity's activities. If yes, whether the waste collection plan is in line with the Extended Producer Responsibility (EPR) plan submitted to Pollution Control Boards? If not, provide steps taken to address the same.",
            kind: "boolean",
            booleanDetail:
              "Whether the waste collection plan is in line with the EPR plan submitted to Pollution Control Boards; if not, steps taken to address the same",
            evidence: true,
            evidenceHint:
              "EPR registration / EPR plan submitted to the Pollution Control Boards.",
          },
        ],
      },
      {
        key: "C.P2.LI",
        title: "Leadership Indicators",
        questions: [
          {
            key: "C.P2.LI.1",
            code: "Leadership Indicator 1",
            section: "C",
            principle: 2,
            indicator: "leadership",
            title:
              "Has the entity conducted Life Cycle Perspective / Assessments (LCA) for any of its products (for manufacturing industry) or for its services (for service industry)? If yes, provide details.",
            kind: "table",
            evidence: true,
            evidenceHint: "Life Cycle Assessment (LCA) reports.",
            table: {
              dynamic: true,
              addLabel: "Add product / service LCA",
              columns: [
                { key: "nicCode", label: "NIC Code", type: "text" },
                { key: "productName", label: "Name of Product / Service", type: "text" },
                {
                  key: "turnoverPct",
                  label: "% of total Turnover contributed",
                  type: "percentage",
                },
                {
                  key: "boundary",
                  label: "Boundary for which the Life Cycle Perspective / Assessment was conducted",
                  type: "text",
                },
                {
                  key: "externalAgency",
                  label:
                    "Whether conducted by independent external agency (Yes/No)",
                  type: "boolean",
                },
                {
                  key: "publicDomain",
                  label:
                    "Results communicated in public domain (Yes/No)",
                  type: "boolean",
                },
                { key: "webLink", label: "If yes, provide the web-link", type: "url" },
              ],
            },
          },
          {
            key: "C.P2.LI.2",
            code: "Leadership Indicator 2",
            section: "C",
            principle: 2,
            indicator: "leadership",
            title:
              "If there are any significant social or environmental concerns and / or risks arising from production or disposal of your products / services, as identified in the Life Cycle Perspective / Assessments (LCA) or through any other means, briefly describe the same along-with action taken to mitigate the same.",
            kind: "table",
            table: {
              dynamic: true,
              addLabel: "Add concern / risk",
              columns: [
                { key: "productName", label: "Name of Product / Service", type: "text" },
                {
                  key: "risk",
                  label: "Description of the risk / concern",
                  type: "text",
                },
                { key: "action", label: "Action Taken", type: "text" },
              ],
            },
          },
          {
            key: "C.P2.LI.3",
            code: "Leadership Indicator 3",
            section: "C",
            principle: 2,
            indicator: "leadership",
            title:
              "Percentage of recycled or reused input material to total material (by value) used in production (for manufacturing industry) or providing services (for service industry).",
            kind: "table",
            table: {
              perPeriod: true,
              dynamic: true,
              addLabel: "Add input material",
              columns: [
                {
                  key: "material",
                  label: "Indicate input material",
                  type: "text",
                },
                {
                  key: "recycledPct",
                  label:
                    "Recycled or re-used input material to total material",
                  type: "percentage",
                },
              ],
            },
          },
          {
            key: "C.P2.LI.4",
            code: "Leadership Indicator 4",
            section: "C",
            principle: 2,
            indicator: "leadership",
            title:
              "Of the products and packaging reclaimed at end of life of products, amount (in metric tonnes) reused, recycled, and safely disposed.",
            kind: "table",
            table: {
              perPeriod: true,
              columns: [
                { key: "reused", label: "Re-Used", type: "number", unit: "MT" },
                { key: "recycled", label: "Recycled", type: "number", unit: "MT" },
                {
                  key: "safelyDisposed",
                  label: "Safely Disposed",
                  type: "number",
                  unit: "MT",
                },
              ],
              rows: [
                { key: "plastics", label: "Plastics (including packaging)" },
                { key: "ewaste", label: "E-waste" },
                { key: "hazardous", label: "Hazardous waste" },
                { key: "other", label: "Other waste" },
              ],
            },
          },
          {
            key: "C.P2.LI.5",
            code: "Leadership Indicator 5",
            section: "C",
            principle: 2,
            indicator: "leadership",
            title:
              "Reclaimed products and their packaging materials (as percentage of products sold) for each product category.",
            kind: "table",
            table: {
              dynamic: true,
              addLabel: "Add product category",
              columns: [
                { key: "category", label: "Indicate product category", type: "text" },
                {
                  key: "reclaimedPct",
                  label:
                    "Reclaimed products and their packaging materials as % of total products sold in respective category",
                  type: "percentage",
                },
              ],
            },
          },
        ],
      },
    ],
  },
];
