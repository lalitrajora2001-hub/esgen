import type { ModuleDef } from "@/lib/brsr/types";

/** Section A: General Disclosures (entity details, operations, employees, CSR, transparency). */
export const sectionA: ModuleDef = {
  key: "A",
  navLabel: "Section A: General Disclosures",
  section: "A",
  title: "Section A: General Disclosures",
  intro:
    "Basic details about the entity, its products and operations, its workforce, holding structure, CSR applicability and complaints. Figures entered here are used across the report.",
  subsections: [
    {
      key: "A.I",
      title: "Details of the listed entity",
      questions: [
        {
          key: "A.I.details",
          code: "Q1-Q15",
          section: "A",
          title: "Entity details",
          kind: "fields",
          fields: [
            { key: "cin", label: "Corporate Identity Number (CIN)", type: "text" },
            { key: "name", label: "Name of the Listed Entity", type: "text" },
            { key: "yearIncorp", label: "Year of incorporation", type: "year" },
            { key: "regOffice", label: "Registered office address", type: "longtext" },
            { key: "corpAddress", label: "Corporate address", type: "longtext" },
            { key: "email", label: "E-mail", type: "text" },
            { key: "telephone", label: "Telephone", type: "text" },
            { key: "website", label: "Website", type: "url" },
            { key: "financialYear", label: "Financial year for which reporting is being done", type: "text" },
            { key: "stockExchanges", label: "Stock Exchange(s) where shares are listed", type: "text" },
            { key: "paidUpCapital", label: "Paid-up Capital", type: "currency" },
            { key: "contactName", label: "Name of the BRSR contact person", type: "text" },
            { key: "contactPhone", label: "Contact telephone", type: "text" },
            { key: "contactEmail", label: "Contact e-mail", type: "text" },
            { key: "boundary", label: "Reporting boundary", type: "enum", options: ["Standalone", "Consolidated"] },
            { key: "assuranceProvider", label: "Name of assurance / assessment provider", type: "text", optional: true },
            {
              key: "assuranceType",
              label: "Type of assurance / assessment obtained",
              type: "enum",
              options: ["Reasonable assurance", "Limited assurance", "Assessment", "None"],
              optional: true,
            },
          ],
          evidence: true,
          evidenceHint: "Assurance / assessment statement, engagement letter, independence declaration.",
        },
      ],
    },
    {
      key: "A.II",
      title: "Products / Services",
      questions: [
        {
          key: "A.II.activities",
          code: "Q16",
          section: "A",
          title: "Business activities accounting for 90% of turnover",
          kind: "table",
          table: {
            dynamic: true,
            addLabel: "Add activity",
            columns: [
              { key: "mainActivity", label: "Description of Main Activity", type: "text" },
              { key: "businessActivity", label: "Description of Business Activity", type: "text" },
              { key: "pct", label: "% of Turnover of the entity", type: "percentage" },
            ],
          },
        },
        {
          key: "A.II.products",
          code: "Q17",
          section: "A",
          title: "Products / Services sold accounting for 90% of turnover",
          kind: "table",
          table: {
            dynamic: true,
            addLabel: "Add product / service",
            columns: [
              { key: "product", label: "Product / Service", type: "text" },
              { key: "nic", label: "NIC Code", type: "text" },
              { key: "pct", label: "% of total Turnover contributed", type: "percentage" },
            ],
          },
        },
      ],
    },
    {
      key: "A.III",
      title: "Operations",
      questions: [
        {
          key: "A.III.locations",
          code: "Q18",
          section: "A",
          title: "Number of locations where plants and/or operations/offices are situated",
          kind: "table",
          table: {
            columns: [
              { key: "plants", label: "Number of plants", type: "number" },
              { key: "offices", label: "Number of offices", type: "number" },
              { key: "total", label: "Total", type: "number", derived: { op: "sum", keys: ["plants", "offices"] } },
            ],
            rows: [
              { key: "national", label: "National" },
              { key: "international", label: "International" },
            ],
          },
        },
        {
          key: "A.III.markets",
          code: "Q19",
          section: "A",
          title: "Markets served by the entity",
          kind: "fields",
          fields: [
            { key: "statesNational", label: "Number of States (national)", type: "number" },
            { key: "countriesIntl", label: "Number of Countries (international)", type: "number" },
            { key: "exportsPct", label: "Contribution of exports as % of total turnover", type: "percentage" },
            { key: "customers", label: "A brief on types of customers", type: "longtext" },
          ],
        },
      ],
    },
    {
      key: "A.IV",
      title: "Employees",
      questions: [
        {
          key: "A.IV.employees",
          code: "Q20a",
          section: "A",
          title: "Employees and workers (including differently abled) as at the end of the financial year",
          kind: "table",
          table: {
            columns: [
              { key: "total", label: "Total (A)", type: "number" },
              { key: "maleNo", label: "Male No. (B)", type: "number" },
              { key: "malePct", label: "Male % (B/A)", type: "percentage", derived: { op: "ratioPct", num: "maleNo", den: "total" } },
              { key: "femaleNo", label: "Female No. (C)", type: "number" },
              { key: "femalePct", label: "Female % (C/A)", type: "percentage", derived: { op: "ratioPct", num: "femaleNo", den: "total" } },
            ],
            rows: [
              { key: "emp_perm", label: "Permanent (D)", group: "Employees" },
              { key: "emp_other", label: "Other than Permanent (E)", group: "Employees" },
              { key: "emp_total", label: "Total employees (D + E)", group: "Employees" },
              { key: "wrk_perm", label: "Permanent (F)", group: "Workers" },
              { key: "wrk_other", label: "Other than Permanent (G)", group: "Workers" },
              { key: "wrk_total", label: "Total workers (F + G)", group: "Workers" },
            ],
          },
        },
        {
          key: "A.IV.differentlyAbled",
          code: "Q20b",
          section: "A",
          title: "Differently abled Employees and workers",
          kind: "table",
          table: {
            columns: [
              { key: "total", label: "Total (A)", type: "number" },
              { key: "maleNo", label: "Male No. (B)", type: "number" },
              { key: "malePct", label: "Male % (B/A)", type: "percentage", derived: { op: "ratioPct", num: "maleNo", den: "total" } },
              { key: "femaleNo", label: "Female No. (C)", type: "number" },
              { key: "femalePct", label: "Female % (C/A)", type: "percentage", derived: { op: "ratioPct", num: "femaleNo", den: "total" } },
            ],
            rows: [
              { key: "emp_perm", label: "Permanent (D)", group: "Differently abled Employees" },
              { key: "emp_other", label: "Other than Permanent (E)", group: "Differently abled Employees" },
              { key: "emp_total", label: "Total (D + E)", group: "Differently abled Employees" },
              { key: "wrk_perm", label: "Permanent (F)", group: "Differently abled Workers" },
              { key: "wrk_other", label: "Other than Permanent (G)", group: "Differently abled Workers" },
              { key: "wrk_total", label: "Total (F + G)", group: "Differently abled Workers" },
            ],
          },
        },
        {
          key: "A.IV.womenRep",
          code: "Q21",
          section: "A",
          title: "Participation / Inclusion / Representation of women",
          kind: "table",
          table: {
            columns: [
              { key: "total", label: "Total (A)", type: "number" },
              { key: "femaleNo", label: "No. of Females (B)", type: "number" },
              { key: "femalePct", label: "% (B/A)", type: "percentage", derived: { op: "ratioPct", num: "femaleNo", den: "total" } },
            ],
            rows: [
              { key: "board", label: "Board of Directors" },
              { key: "kmp", label: "Key Management Personnel" },
            ],
          },
        },
        {
          key: "A.IV.turnover",
          code: "Q22",
          section: "A",
          title: "Turnover rate for permanent employees and workers",
          help: "Turnover rate for the current FY and the two preceding financial years.",
          kind: "table",
          table: {
            columns: [
              { key: "cy_male", label: "Current FY - Male %", type: "percentage" },
              { key: "cy_female", label: "Current FY - Female %", type: "percentage" },
              { key: "cy_total", label: "Current FY - Total %", type: "percentage" },
              { key: "py_male", label: "Previous FY - Male %", type: "percentage" },
              { key: "py_female", label: "Previous FY - Female %", type: "percentage" },
              { key: "py_total", label: "Previous FY - Total %", type: "percentage" },
              { key: "ppy_male", label: "FY prior to previous - Male %", type: "percentage" },
              { key: "ppy_female", label: "FY prior to previous - Female %", type: "percentage" },
              { key: "ppy_total", label: "FY prior to previous - Total %", type: "percentage" },
            ],
            rows: [
              { key: "perm_emp", label: "Permanent Employees" },
              { key: "perm_wrk", label: "Permanent Workers" },
            ],
          },
        },
      ],
    },
    {
      key: "A.V",
      title: "Holding, Subsidiary and Associate Companies (including JVs)",
      questions: [
        {
          key: "A.V.entities",
          code: "Q23",
          section: "A",
          title: "Names of holding / subsidiary / associate companies / joint ventures",
          kind: "table",
          table: {
            dynamic: true,
            addLabel: "Add company",
            columns: [
              { key: "name", label: "Name of the entity", type: "text" },
              { key: "type", label: "Holding / Subsidiary / Associate / Joint Venture", type: "enum", options: ["Holding", "Subsidiary", "Associate", "Joint Venture"] },
              { key: "sharesPct", label: "% of shares held by listed entity", type: "percentage" },
              { key: "participates", label: "Does the entity participate in the BR initiatives of the listed entity? (Yes/No)", type: "boolean" },
            ],
          },
        },
      ],
    },
    {
      key: "A.VI",
      title: "CSR Details",
      questions: [
        {
          key: "A.VI.csr",
          code: "Q24",
          section: "A",
          title: "CSR details",
          kind: "fields",
          fields: [
            { key: "applicable", label: "Whether CSR is applicable as per Section 135 of Companies Act 2013 (Yes/No)", type: "boolean" },
            { key: "turnover", label: "Turnover (INR)", type: "currency" },
            { key: "netWorth", label: "Net worth (INR)", type: "currency" },
          ],
        },
      ],
    },
    {
      key: "A.VII",
      title: "Transparency and Disclosures Compliances",
      questions: [
        {
          key: "A.VII.complaints",
          code: "Q25",
          section: "A",
          title: "Complaints / Grievances on any of the Principles (Principles 1 to 9) under the NGRBC",
          kind: "table",
          table: {
            perPeriod: true,
            columns: [
              { key: "mechanism", label: "Grievance Redressal Mechanism in Place (Yes/No)", type: "boolean" },
              { key: "webLink", label: "Web-link for grievance redress policy (if Yes)", type: "url" },
              { key: "filed", label: "Number of complaints filed during the year", type: "number" },
              { key: "pending", label: "Number of complaints pending resolution at close of year", type: "number" },
              { key: "remarks", label: "Remarks", type: "text" },
            ],
            rows: [
              { key: "communities", label: "Communities" },
              { key: "investors", label: "Investors (other than shareholders)" },
              { key: "shareholders", label: "Shareholders" },
              { key: "employees", label: "Employees and workers" },
              { key: "customers", label: "Customers" },
              { key: "valueChain", label: "Value Chain Partners" },
              { key: "other", label: "Other (please specify)" },
            ],
          },
        },
        {
          key: "A.VII.material",
          code: "Q26",
          section: "A",
          title: "Overview of the entity's material responsible business conduct issues",
          kind: "table",
          table: {
            dynamic: true,
            addLabel: "Add material issue",
            columns: [
              { key: "issue", label: "Material issue identified", type: "text" },
              { key: "riskOpp", label: "Indicate whether risk or opportunity (R/O)", type: "enum", options: ["Risk", "Opportunity"] },
              { key: "rationale", label: "Rationale for identifying the risk / opportunity", type: "text" },
              { key: "approach", label: "In case of risk, approach to adapt or mitigate", type: "text" },
              { key: "financial", label: "Financial implications of the risk or opportunity (positive / negative)", type: "text" },
            ],
          },
        },
      ],
    },
  ],
};
