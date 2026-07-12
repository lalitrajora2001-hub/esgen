import type { Metadata } from "next";
import { Section } from "@/components/ui/Section";
import { Reveal } from "@/components/ui/Reveal";
import { RHero, RCta } from "@/components/resources/light";
import { GlossaryExplorer, type Term } from "@/components/resources/ResourceVisuals";

export const metadata: Metadata = {
  title: "ESG Glossary",
  description: "Plain-English definitions of key ESG and carbon accounting terms, searchable and filterable by topic.",
};

const TERMS: Term[] = [
  { term: "Activity data", cat: "Data", def: "The underlying data on activities that generate emissions, such as energy use, travel, or purchases." },
  { term: "Assurance", cat: "Frameworks", def: "An independent check of reported sustainability information, increasingly required alongside financial audit." },
  { term: "Audit trail", cat: "Data", def: "A record that links each reported figure back to its source, method, and owner." },
  { term: "BRSR", cat: "Frameworks", def: "India's Business Responsibility and Sustainability Report, set by SEBI for large listed companies." },
  { term: "CBAM", cat: "Frameworks", def: "The EU Carbon Border Adjustment Mechanism, which prices the emissions embedded in certain imported goods." },
  { term: "CDP", cat: "Frameworks", def: "A global environmental disclosure system where companies respond to an annual questionnaire." },
  { term: "CSRD", cat: "Frameworks", def: "The EU Corporate Sustainability Reporting Directive, which sets sustainability reporting requirements for in-scope companies." },
  { term: "Double materiality", cat: "Frameworks", def: "Reporting both how sustainability issues affect the business and how the business affects people and the environment." },
  { term: "Embedded emissions", cat: "Carbon", def: "The greenhouse gases released during the production of a good, carried with it through the supply chain." },
  { term: "Emission factor", cat: "Carbon", def: "A value used to convert activity data, such as litres of fuel, into emissions." },
  { term: "ESRS", cat: "Frameworks", def: "The European Sustainability Reporting Standards used to report under the CSRD." },
  { term: "GHG Protocol", cat: "Carbon", def: "The most widely used standard for corporate greenhouse gas accounting, grouping emissions into three scopes." },
  { term: "Intensity ratio", cat: "Carbon", def: "Emissions expressed per unit of activity, such as per £m of turnover, to make figures comparable over time." },
  { term: "ISSB", cat: "Frameworks", def: "The International Sustainability Standards Board, which issues the IFRS S1 and S2 disclosure standards." },
  { term: "LCA", cat: "Carbon", def: "Life cycle assessment: modelling a product's environmental impact from raw materials to end of life." },
  { term: "Materiality", cat: "Frameworks", def: "A way of deciding which topics are significant enough to report on." },
  { term: "Primary data", cat: "Data", def: "Data collected directly from the source, such as a supplier's own measured emissions, rather than an estimate." },
  { term: "SBTi", cat: "Frameworks", def: "The Science Based Targets initiative, which sets criteria for emissions targets aligned with climate science." },
  { term: "Scope 1", cat: "Carbon", def: "Direct emissions from sources a company owns or controls, such as company vehicles and on-site fuel combustion." },
  { term: "Scope 2", cat: "Carbon", def: "Indirect emissions from purchased energy, such as electricity, steam, heating, and cooling." },
  { term: "Scope 3", cat: "Carbon", def: "All other indirect emissions across the value chain, split into 15 categories. Usually the largest and hardest to measure." },
  { term: "SECR", cat: "Frameworks", def: "UK Streamlined Energy and Carbon Reporting requirements for qualifying organisations." },
  { term: "Supplier emissions", cat: "Data", def: "Emissions associated with a company's suppliers, an important part of Scope 3." },
  { term: "tCO₂e", cat: "Carbon", def: "Tonnes of carbon dioxide equivalent, the standard unit for expressing greenhouse gas emissions." },
  { term: "UK SRS", cat: "Frameworks", def: "UK Sustainability Reporting Standards, based on the ISSB's IFRS S1 and S2." },
  { term: "Vintage", cat: "Data", def: "The year an emission factor represents, important because factors change as grids and methods evolve." },
];

export default function GlossaryPage() {
  return (
    <div className="bg-white">
      <RHero
        trail={[{ label: "Home", href: "/" }, { label: "Resources", href: "/resources" }, { label: "ESG Glossary" }]}
        title="The ESG glossary, in plain English"
        intro="Search, filter by topic, or jump to a letter. Every term defined without the jargon it usually comes wrapped in."
      />

      <Section size="sm">
        <Reveal><GlossaryExplorer terms={TERMS} /></Reveal>
      </Section>

      <RCta title="Turn the terms into a working inventory" intro="See how ESGen puts these concepts to work on your own data." />
    </div>
  );
}
