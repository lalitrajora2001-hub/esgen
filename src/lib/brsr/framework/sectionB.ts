import type { ModuleDef } from "@/lib/brsr/types";

/**
 * Section B: Management and Process Disclosures. Most questions are answered
 * once per principle (P1..P9) via the principleGrid kind; a few are entity-level.
 */
export const sectionB: ModuleDef = {
  key: "B",
  navLabel: "Section B: Management & Process",
  section: "B",
  title: "Section B: Management and Process Disclosures",
  intro:
    "How the entity's policies and management processes embed the National Guidelines on Responsible Business Conduct (NGRBC). Grid questions are answered for each of the 9 principles.",
  subsections: [
    {
      key: "B.policy",
      title: "Policy and management processes",
      questions: [
        { key: "B.1a", code: "Q1a", section: "B", title: "Whether your entity's policy/policies cover each principle and its core elements of the NGRBCs (Yes/No)", kind: "principleGrid", gridCell: { type: "boolean" } },
        { key: "B.1b", code: "Q1b", section: "B", title: "Has the policy been approved by the Board? (Yes/No)", kind: "principleGrid", gridCell: { type: "boolean" } },
        { key: "B.1c", code: "Q1c", section: "B", title: "Web link of the Policies, if available", kind: "principleGrid", gridCell: { type: "url" }, evidence: true, evidenceHint: "Policy documents for each principle." },
        { key: "B.2", code: "Q2", section: "B", title: "Whether the entity has translated the policy into procedures (Yes/No)", kind: "principleGrid", gridCell: { type: "boolean" } },
        { key: "B.3", code: "Q3", section: "B", title: "Do the enlisted policies extend to your value chain partners? (Yes/No)", kind: "principleGrid", gridCell: { type: "boolean" } },
        { key: "B.4", code: "Q4", section: "B", title: "Name of the national and international codes / certifications / labels / standards adopted and mapped to each principle", kind: "principleGrid", gridCell: { type: "text" }, evidence: true, evidenceHint: "Certifications (ISO 14001/45001/9001, SA 8000, FSC, Fairtrade, etc.)." },
        { key: "B.5", code: "Q5", section: "B", title: "Specific commitments, goals and targets set by the entity with defined timelines, if any", kind: "principleGrid", gridCell: { type: "text" } },
        { key: "B.6", code: "Q6", section: "B", title: "Performance against the specific commitments, goals and targets, with reasons in case the same are not met", kind: "principleGrid", gridCell: { type: "text" } },
      ],
    },
    {
      key: "B.governance",
      title: "Governance, leadership and oversight",
      questions: [
        { key: "B.7", code: "Q7", section: "B", title: "Statement by director responsible for the business responsibility report, highlighting ESG-related challenges, targets and achievements", kind: "narrative" },
        { key: "B.8", code: "Q8", section: "B", title: "Details of the highest authority responsible for implementation and oversight of the Business Responsibility policy(ies)", kind: "narrative" },
        { key: "B.9", code: "Q9", section: "B", title: "Does the entity have a specified Committee of the Board / Director responsible for decision making on sustainability related issues? If yes, provide details.", kind: "boolean", booleanDetail: "Details" },
        {
          key: "B.10a",
          code: "Q10 (reviewed by)",
          section: "B",
          title: "Details of Review of NGRBCs by the Company: indicate whether review was undertaken by Director / Committee of the Board / Any other Committee",
          help: "Covers both (a) performance against above policies and follow up action, and (b) compliance with statutory requirements of relevance to the principles, and rectification of any non-compliances.",
          kind: "principleGrid",
          gridCell: { type: "enum", options: ["Director", "Committee of the Board", "Any other Committee", "Not reviewed"] },
        },
        {
          key: "B.10b",
          code: "Q10 (frequency)",
          section: "B",
          title: "Details of Review of NGRBCs by the Company: frequency of review",
          help: "Covers both performance against policies and statutory-compliance review.",
          kind: "principleGrid",
          gridCell: { type: "enum", options: ["Annually", "Half-yearly", "Quarterly", "Any other"] },
        },
        { key: "B.11", code: "Q11", section: "B", title: "Has the entity carried out independent assessment / evaluation of the working of its policies by an external agency? (Yes/No). If yes, name of the agency.", kind: "principleGrid", gridCell: { type: "text" }, evidence: true, evidenceHint: "Independent policy-assessment report." },
        {
          key: "B.12",
          code: "Q12",
          section: "B",
          title: "If answer to question (1) above is No (i.e. not all Principles are covered by a policy), reasons to be stated (indicate Yes/No against each Principle for the applicable reasons)",
          kind: "table",
          table: {
            columns: [
              { key: "P1", label: "P1", type: "boolean" },
              { key: "P2", label: "P2", type: "boolean" },
              { key: "P3", label: "P3", type: "boolean" },
              { key: "P4", label: "P4", type: "boolean" },
              { key: "P5", label: "P5", type: "boolean" },
              { key: "P6", label: "P6", type: "boolean" },
              { key: "P7", label: "P7", type: "boolean" },
              { key: "P8", label: "P8", type: "boolean" },
              { key: "P9", label: "P9", type: "boolean" },
            ],
            rows: [
              { key: "r1", label: "The entity does not consider the Principles material to its business" },
              { key: "r2", label: "The entity is not at a stage where it is in a position to formulate and implement the policies on specified principles" },
              { key: "r3", label: "The entity does not have the financial or/human and technical resources available for the task" },
              { key: "r4", label: "It is planned to be done in the next financial year" },
              { key: "r5", label: "Any other reason (please specify)" },
            ],
          },
        },
        {
          key: "B.12b",
          code: "Q12 (specify)",
          section: "B",
          title: "If 'Any other reason' was selected above, please specify",
          kind: "narrative",
        },
      ],
    },
  ],
};
