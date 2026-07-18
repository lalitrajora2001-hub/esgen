import type { ModuleDef } from "@/lib/brsr/types";

export const modulesP7P9: ModuleDef[] = [
  {
    key: "C.P7",
    navLabel: "Principle 7: Policy Advocacy",
    section: "C",
    principle: 7,
    title:
      "Principle 7: Businesses, when engaging in influencing public and regulatory policy, should do so in a manner that is responsible and transparent",
    subsections: [
      {
        key: "C.P7.EI",
        title: "Essential Indicators",
        questions: [
          {
            key: "C.P7.EI.1a",
            code: "Essential Indicator 1a",
            section: "C",
            principle: 7,
            indicator: "essential",
            title:
              "Number of affiliations with trade and industry chambers/associations",
            kind: "fields",
            fields: [
              {
                key: "count",
                label:
                  "Number of affiliations with trade and industry chambers/associations",
                type: "number",
              },
            ],
          },
          {
            key: "C.P7.EI.1b",
            code: "Essential Indicator 1b",
            section: "C",
            principle: 7,
            indicator: "essential",
            title:
              "Top 10 trade and industry chambers/associations (determined based on the total members of such body) the entity is a member of/affiliated to",
            kind: "table",
            evidence: true,
            evidenceHint: "Trade-association membership proof.",
            table: {
              dynamic: true,
              addLabel: "Add chamber/association",
              columns: [
                {
                  key: "name",
                  label:
                    "Name of the trade and industry chambers/associations",
                  type: "text",
                },
                {
                  key: "reach",
                  label:
                    "Reach of trade and industry chambers/associations (State/National)",
                  type: "enum",
                  options: ["State", "National"],
                },
              ],
            },
          },
          {
            key: "C.P7.EI.2",
            code: "Essential Indicator 2",
            section: "C",
            principle: 7,
            indicator: "essential",
            title:
              "Details of corrective action taken or underway on any issues related to anti-competitive conduct by the entity, based on adverse orders from regulatory authorities",
            kind: "table",
            table: {
              dynamic: true,
              addLabel: "Add case",
              columns: [
                { key: "authority", label: "Name of authority", type: "text" },
                { key: "brief", label: "Brief of the case", type: "text" },
                {
                  key: "correctiveAction",
                  label: "Corrective action taken",
                  type: "text",
                },
              ],
            },
          },
        ],
      },
      {
        key: "C.P7.LI",
        title: "Leadership Indicators",
        questions: [
          {
            key: "C.P7.LI.1",
            code: "Leadership Indicator 1",
            section: "C",
            principle: 7,
            indicator: "leadership",
            title:
              "Details of public policy positions advocated by the entity",
            kind: "table",
            table: {
              dynamic: true,
              addLabel: "Add public policy position",
              columns: [
                {
                  key: "policy",
                  label: "Public policy advocated",
                  type: "text",
                },
                {
                  key: "method",
                  label: "Method resorted for such advocacy",
                  type: "text",
                },
                {
                  key: "publicDomain",
                  label:
                    "Whether information available in public domain? (Yes/No)",
                  type: "boolean",
                },
                {
                  key: "reviewFrequency",
                  label: "Frequency of Review by Board",
                  type: "enum",
                  options: ["Annually", "Half-yearly", "Quarterly", "Others"],
                },
                { key: "webLink", label: "Web-link, if available", type: "url" },
              ],
            },
          },
        ],
      },
    ],
  },
  {
    key: "C.P8",
    navLabel: "Principle 8: Inclusive Growth",
    section: "C",
    principle: 8,
    title:
      "Principle 8: Businesses should promote inclusive growth and equitable development",
    subsections: [
      {
        key: "C.P8.EI",
        title: "Essential Indicators",
        questions: [
          {
            key: "C.P8.EI.1",
            code: "Essential Indicator 1",
            section: "C",
            principle: 8,
            indicator: "essential",
            title:
              "Details of Social Impact Assessments (SIA) of projects undertaken by the entity based on applicable laws, in the current financial year",
            kind: "table",
            evidence: true,
            evidenceHint: "SIA reports.",
            table: {
              dynamic: true,
              addLabel: "Add project",
              columns: [
                {
                  key: "project",
                  label: "Name and brief details of project",
                  type: "text",
                },
                {
                  key: "siaNotificationNo",
                  label: "SIA Notification No.",
                  type: "text",
                },
                {
                  key: "notificationDate",
                  label: "Date of notification",
                  type: "date",
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
                { key: "webLink", label: "Relevant Web-link", type: "url" },
              ],
            },
          },
          {
            key: "C.P8.EI.2",
            code: "Essential Indicator 2",
            section: "C",
            principle: 8,
            indicator: "essential",
            title:
              "Information on project(s) for which ongoing Rehabilitation and Resettlement (R&R) is being undertaken by the entity",
            kind: "table",
            evidence: true,
            evidenceHint: "R&R records and PAF payment proofs.",
            table: {
              dynamic: true,
              addLabel: "Add project",
              columns: [
                { key: "project", label: "Name of Project", type: "text" },
                { key: "state", label: "State", type: "text" },
                { key: "district", label: "District", type: "text" },
                {
                  key: "pafs",
                  label: "No. of Project Affected Families (PAFs)",
                  type: "number",
                },
                {
                  key: "pafPct",
                  label: "% of PAFs covered by R&R",
                  type: "percentage",
                },
                {
                  key: "amountPaid",
                  label: "Amounts paid to PAFs in the FY (In INR)",
                  type: "currency",
                  unit: "INR",
                },
              ],
            },
          },
          {
            key: "C.P8.EI.3",
            code: "Essential Indicator 3",
            section: "C",
            principle: 8,
            indicator: "essential",
            title:
              "Describe the mechanisms to receive and redress grievances of the community",
            kind: "narrative",
          },
          {
            key: "C.P8.EI.4",
            code: "Essential Indicator 4",
            section: "C",
            principle: 8,
            indicator: "essential",
            title:
              "Percentage of input material (inputs to total inputs by value) sourced from suppliers",
            isCore: true,
            evidence: true,
            evidenceHint:
              "Purchase / GST records, MSME supplier registrations, procurement ledger",
            kind: "table",
            table: {
              perPeriod: true,
              columns: [
                { key: "source", label: "Source", type: "text" },
                {
                  key: "pct",
                  label: "Percentage",
                  type: "percentage",
                },
              ],
              rows: [
                {
                  key: "msme",
                  label: "Directly sourced from MSMEs/small producers",
                },
                {
                  key: "withinIndia",
                  label: "Directly from within India",
                },
              ],
            },
          },
          {
            key: "C.P8.EI.5",
            code: "Essential Indicator 5",
            section: "C",
            principle: 8,
            indicator: "essential",
            title:
              "Job creation in smaller towns - wages paid as % of total wage cost, by location",
            isCore: true,
            evidence: true,
            evidenceHint:
              "Payroll records with location classification, RBI town-classification mapping",
            kind: "table",
            table: {
              perPeriod: true,
              columns: [
                {
                  key: "location",
                  label: "Location (RBI classification)",
                  type: "text",
                },
                {
                  key: "pct",
                  label:
                    "Wages paid to persons employed as % of total wage cost",
                  type: "percentage",
                },
              ],
              rows: [
                { key: "rural", label: "Rural" },
                { key: "semiurban", label: "Semi-urban" },
                { key: "urban", label: "Urban" },
                { key: "metro", label: "Metropolitan" },
              ],
            },
          },
        ],
      },
      {
        key: "C.P8.LI",
        title: "Leadership Indicators",
        questions: [
          {
            key: "C.P8.LI.1",
            code: "Leadership Indicator 1",
            section: "C",
            principle: 8,
            indicator: "leadership",
            title:
              "Provide details of actions taken to mitigate any negative social impacts identified in the Social Impact Assessments (Reference: Question 1 of Essential Indicators above)",
            kind: "table",
            table: {
              dynamic: true,
              addLabel: "Add impact",
              columns: [
                {
                  key: "impact",
                  label: "Details of negative social impact identified",
                  type: "text",
                },
                {
                  key: "correctiveAction",
                  label: "Corrective action taken",
                  type: "text",
                },
              ],
            },
          },
          {
            key: "C.P8.LI.2",
            code: "Leadership Indicator 2",
            section: "C",
            principle: 8,
            indicator: "leadership",
            title:
              "Provide the following information on CSR projects undertaken by your entity in designated aspirational districts as identified by government bodies",
            kind: "table",
            evidence: true,
            evidenceHint: "CSR project documentation.",
            table: {
              dynamic: true,
              addLabel: "Add CSR project",
              columns: [
                { key: "state", label: "State", type: "text" },
                {
                  key: "district",
                  label: "Aspirational District",
                  type: "text",
                },
                {
                  key: "amount",
                  label: "Amount spent (In INR)",
                  type: "currency",
                  unit: "INR",
                },
              ],
            },
          },
          {
            key: "C.P8.LI.3",
            code: "Leadership Indicator 3",
            section: "C",
            principle: 8,
            indicator: "leadership",
            title:
              "Preferential procurement policy for procuring goods and services from marginalized/vulnerable groups",
            kind: "fields",
            fields: [
              {
                key: "hasPolicy",
                label:
                  "Do you have a preferential procurement policy where you give preference to purchase from suppliers comprising marginalized/vulnerable groups?",
                type: "boolean",
              },
              {
                key: "groups",
                label:
                  "From which marginalized/vulnerable groups do you procure?",
                type: "text",
              },
              {
                key: "pct",
                label:
                  "What percentage of total procurement (by value) does it constitute?",
                type: "percentage",
              },
            ],
          },
          {
            key: "C.P8.LI.4",
            code: "Leadership Indicator 4",
            section: "C",
            principle: 8,
            indicator: "leadership",
            title:
              "Details of the benefits derived and shared from the intellectual properties owned or acquired by your entity (in the current financial year), based on traditional knowledge",
            kind: "table",
            table: {
              dynamic: true,
              addLabel: "Add IP",
              columns: [
                {
                  key: "ip",
                  label:
                    "Intellectual Property based on traditional knowledge",
                  type: "text",
                },
                {
                  key: "ownedAcquired",
                  label: "Owned/Acquired (Yes/No)",
                  type: "boolean",
                },
                {
                  key: "benefitShared",
                  label: "Benefit shared (Yes/No)",
                  type: "boolean",
                },
                {
                  key: "basis",
                  label: "Basis of calculating benefit share",
                  type: "text",
                },
              ],
            },
          },
          {
            key: "C.P8.LI.5",
            code: "Leadership Indicator 5",
            section: "C",
            principle: 8,
            indicator: "leadership",
            title:
              "Details of corrective actions taken or underway, based on any adverse order in intellectual property related disputes wherein usage of traditional knowledge is involved",
            kind: "table",
            table: {
              dynamic: true,
              addLabel: "Add case",
              columns: [
                { key: "authority", label: "Name of authority", type: "text" },
                { key: "brief", label: "Brief of the Case", type: "text" },
                {
                  key: "correctiveAction",
                  label: "Corrective action taken",
                  type: "text",
                },
              ],
            },
          },
          {
            key: "C.P8.LI.6",
            code: "Leadership Indicator 6",
            section: "C",
            principle: 8,
            indicator: "leadership",
            title: "Details of beneficiaries of CSR Projects",
            kind: "table",
            evidence: true,
            evidenceHint: "CSR project documentation.",
            table: {
              dynamic: true,
              addLabel: "Add CSR project",
              columns: [
                { key: "project", label: "CSR Project", type: "text" },
                {
                  key: "beneficiaries",
                  label: "No. of persons benefitted from CSR Projects",
                  type: "number",
                },
                {
                  key: "vulnerablePct",
                  label:
                    "% of beneficiaries from vulnerable and marginalized groups",
                  type: "percentage",
                },
              ],
            },
          },
        ],
      },
    ],
  },
  {
    key: "C.P9",
    navLabel: "Principle 9: Consumer Value",
    section: "C",
    principle: 9,
    title:
      "Principle 9: Businesses should engage with and provide value to their consumers in a responsible manner",
    subsections: [
      {
        key: "C.P9.EI",
        title: "Essential Indicators",
        questions: [
          {
            key: "C.P9.EI.1",
            code: "Essential Indicator 1",
            section: "C",
            principle: 9,
            indicator: "essential",
            title:
              "Describe the mechanisms in place to receive and respond to consumer complaints and feedback",
            kind: "narrative",
          },
          {
            key: "C.P9.EI.2",
            code: "Essential Indicator 2",
            section: "C",
            principle: 9,
            indicator: "essential",
            title:
              "Turnover of products and/or services as a percentage of turnover from all products/service that carry information about",
            kind: "table",
            table: {
              columns: [
                { key: "aspect", label: "Aspect", type: "text" },
                {
                  key: "pct",
                  label: "As a percentage to total turnover",
                  type: "percentage",
                },
              ],
              rows: [
                {
                  key: "envSocial",
                  label:
                    "Environmental and social parameters relevant to the product",
                },
                { key: "safeUsage", label: "Safe and responsible usage" },
                {
                  key: "recycling",
                  label: "Recycling and/or safe disposal",
                },
              ],
            },
          },
          {
            key: "C.P9.EI.3",
            code: "Essential Indicator 3",
            section: "C",
            principle: 9,
            indicator: "essential",
            title: "Number of consumer complaints in respect of the following",
            kind: "table",
            table: {
              perPeriod: true,
              columns: [
                { key: "category", label: "Category", type: "text" },
                {
                  key: "received",
                  label: "Received during the year",
                  type: "number",
                },
                {
                  key: "pending",
                  label: "Pending resolution at end of year",
                  type: "number",
                },
                { key: "remarks", label: "Remarks", type: "text" },
              ],
              rows: [
                { key: "dataPrivacy", label: "Data privacy" },
                { key: "advertising", label: "Advertising" },
                { key: "cyberSecurity", label: "Cyber-security" },
                {
                  key: "delivery",
                  label: "Delivery of essential services",
                },
                {
                  key: "restrictiveTrade",
                  label: "Restrictive Trade Practices",
                },
                { key: "unfairTrade", label: "Unfair Trade Practices" },
                { key: "other", label: "Other" },
              ],
            },
          },
          {
            key: "C.P9.EI.4",
            code: "Essential Indicator 4",
            section: "C",
            principle: 9,
            indicator: "essential",
            title:
              "Details of instances of product recalls on account of safety issues",
            kind: "table",
            evidence: true,
            evidenceHint: "Product-recall notices.",
            table: {
              columns: [
                { key: "type", label: "Type of recall", type: "text" },
                { key: "number", label: "Number", type: "number" },
                {
                  key: "reasons",
                  label: "Reasons for recall",
                  type: "text",
                },
              ],
              rows: [
                { key: "voluntary", label: "Voluntary recalls" },
                { key: "forced", label: "Forced recalls" },
              ],
            },
          },
          {
            key: "C.P9.EI.5",
            code: "Essential Indicator 5",
            section: "C",
            principle: 9,
            indicator: "essential",
            title:
              "Does the entity have a framework/policy on cyber security and risks related to data privacy?",
            kind: "boolean",
            booleanDetail: "Web-link",
            evidence: true,
            evidenceHint: "Cyber-security and data-privacy policy.",
          },
          {
            key: "C.P9.EI.6",
            code: "Essential Indicator 6",
            section: "C",
            principle: 9,
            indicator: "essential",
            title:
              "Provide details of any corrective actions taken or underway on issues relating to advertising, and delivery of essential services; cyber security and data privacy of customers; re-occurrence of instances of product recalls; penalty/action taken by regulatory authorities on safety of products/services",
            kind: "narrative",
          },
          {
            key: "C.P9.EI.7",
            code: "Essential Indicator 7",
            section: "C",
            principle: 9,
            indicator: "essential",
            title: "Provide the following information relating to data breaches",
            isCore: true,
            kind: "fields",
            evidence: true,
            evidenceHint: "Data-breach incident reports.",
            fields: [
              {
                key: "instances",
                label: "Number of instances of data breaches",
                type: "number",
              },
              {
                key: "piiPct",
                label:
                  "Percentage of data breaches involving personally identifiable information of customers",
                type: "percentage",
              },
              {
                key: "impact",
                label: "Impact, if any, of the data breaches",
                type: "text",
              },
            ],
          },
        ],
      },
      {
        key: "C.P9.LI",
        title: "Leadership Indicators",
        questions: [
          {
            key: "C.P9.LI.1",
            code: "Leadership Indicator 1",
            section: "C",
            principle: 9,
            indicator: "leadership",
            title:
              "Channels/platforms where information on products and services of the entity can be accessed (provide web link, if available)",
            kind: "fields",
            fields: [
              {
                key: "webLink",
                label:
                  "Channels/platforms where information can be accessed (web-link)",
                type: "url",
              },
            ],
          },
          {
            key: "C.P9.LI.2",
            code: "Leadership Indicator 2",
            section: "C",
            principle: 9,
            indicator: "leadership",
            title:
              "Steps taken to inform and educate consumers about safe and responsible usage of products and/or services",
            kind: "narrative",
          },
          {
            key: "C.P9.LI.3",
            code: "Leadership Indicator 3",
            section: "C",
            principle: 9,
            indicator: "leadership",
            title:
              "Mechanisms in place to inform consumers of any risk of disruption/discontinuation of essential services",
            kind: "narrative",
          },
          {
            key: "C.P9.LI.4",
            code: "Leadership Indicator 4",
            section: "C",
            principle: 9,
            indicator: "leadership",
            title:
              "Does the entity display product information on the product over and above what is mandated as per local laws? Did your entity carry out any survey with regard to consumer satisfaction relating to the major products/services of the entity?",
            kind: "fields",
            fields: [
              {
                key: "displayOverAndAbove",
                label:
                  "Does the entity display product information on the product over and above what is mandated as per local laws?",
                type: "enum",
                options: ["Yes", "No", "Not Applicable"],
              },
              {
                key: "displayDetails",
                label: "If yes, provide details",
                type: "text",
              },
              {
                key: "satisfactionSurvey",
                label:
                  "Did your entity carry out any survey with regard to consumer satisfaction relating to the major products/services of the entity?",
                type: "boolean",
              },
            ],
          },
        ],
      },
    ],
  },
];
