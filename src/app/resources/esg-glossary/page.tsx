import type { Metadata } from "next";
import { Section } from "@/components/ui/Section";
import { Reveal } from "@/components/ui/Reveal";
import { PageHero, CTASection } from "@/components/sections/blocks";

export const metadata: Metadata = {
  title: "ESG Glossary",
  description: "Plain-English definitions of key ESG and carbon accounting terms, from Scope 1 to double materiality and audit trail.",
};

const terms: [string, string][] = [
  ["Scope 1", "Direct emissions from sources a company owns or controls, such as company vehicles and on-site fuel combustion."],
  ["Scope 2", "Indirect emissions from purchased energy, such as electricity, steam, heating, and cooling."],
  ["Scope 3", "All other indirect emissions across the value chain, split into 15 categories. Usually the largest and hardest to measure."],
  ["tCO2e", "Tonnes of carbon dioxide equivalent, the standard unit for expressing greenhouse gas emissions."],
  ["Emission factor", "A value used to convert activity data (such as litres of fuel) into emissions."],
  ["Activity data", "The underlying data on activities that generate emissions, such as energy use, travel, or purchases."],
  ["Materiality", "A way of deciding which topics are significant enough to report on."],
  ["Double materiality", "Reporting both how sustainability issues affect the business and how the business affects people and the environment."],
  ["CSRD", "The EU Corporate Sustainability Reporting Directive, which sets sustainability reporting requirements for in-scope companies."],
  ["ESRS", "The European Sustainability Reporting Standards used to report under CSRD."],
  ["ISSB", "The International Sustainability Standards Board, which issues the IFRS S1 and S2 disclosure standards."],
  ["UK SRS", "UK Sustainability Reporting Standards, based on the ISSB standards."],
  ["CDP", "A global environmental disclosure system where companies respond to an annual questionnaire."],
  ["CBAM", "The EU Carbon Border Adjustment Mechanism, which applies to importers of certain carbon-intensive goods."],
  ["BRSR", "India's Business Responsibility and Sustainability Report, set by SEBI for large listed companies."],
  ["GHG Protocol", "The most widely used standard for corporate greenhouse gas accounting."],
  ["Supplier emissions", "Emissions associated with a company's suppliers, an important part of Scope 3."],
  ["Audit trail", "A record that links each reported figure back to its source, method, and owner."],
];

export default function GlossaryPage() {
  return (
    <>
      <PageHero
        kicker="ESG Glossary"
        title="Key ESG and carbon terms, defined"
        intro="A plain-English reference for the terms that come up most often in ESG and carbon reporting."
        trail={[{ label: "Home", href: "/" }, { label: "Resources", href: "/resources" }, { label: "ESG Glossary" }]}
        secondary={{ label: "Carbon accounting basics", href: "/resources/carbon-accounting-basics" }}
      />
      <Section className="section-blend">
        <dl className="grid gap-4 sm:grid-cols-2">
          {terms.map(([t, d]) => (
            <Reveal key={t}>
              <div className="card h-full p-5">
                <dt className="font-display text-base font-semibold text-white">{t}</dt>
                <dd className="mt-1.5 text-sm text-text-muted">{d}</dd>
              </div>
            </Reveal>
          ))}
        </dl>
      </Section>
      <CTASection />
    </>
  );
}
