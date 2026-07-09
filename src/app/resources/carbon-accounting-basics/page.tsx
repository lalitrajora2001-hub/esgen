import type { Metadata } from "next";
import { Section } from "@/components/ui/Section";
import { PageHero, CTASection } from "@/components/sections/blocks";
import { ScopeDiagram } from "@/components/charts/ScopeDiagram";

export const metadata: Metadata = {
  title: "Carbon Accounting Basics",
  description: "What carbon accounting is, how Scope 1, 2, and 3 work, and why activity data, emission factors, and evidence matter.",
};

const sections = [
  { h: "What is carbon accounting?", p: "Carbon accounting is the process of measuring the greenhouse gas emissions linked to an organisation's activities, expressed in tonnes of carbon dioxide equivalent (tCO2e). It gives you a baseline to understand your footprint and act on it." },
  { h: "Activity data", p: "Activity data is the underlying information about activities that generate emissions, such as energy use, fuel, business travel, and purchased goods. Good carbon accounting starts with collecting this data reliably and knowing where it came from." },
  { h: "Emission factors", p: "Emission factors convert activity data into emissions. For example, a factor turns litres of fuel or kilowatt hours of electricity into tCO2e. Using recognised, up-to-date factors keeps your figures credible." },
  { h: "tCO2e", p: "Different greenhouse gases have different warming effects, so emissions are expressed in a common unit: tonnes of carbon dioxide equivalent. This lets you add up and compare emissions across sources." },
  { h: "Why evidence matters", p: "Reporting only helps if people believe the figures. Keeping evidence connected to each number, with a clear method and owner, means you can answer questions from auditors, customers, and investors with confidence." },
  { h: "Why data quality matters", p: "The quality of your footprint depends on the quality of your data. Validation, clear ownership, and consistent methods reduce errors and make reporting repeatable year after year." },
];

export default function BasicsPage() {
  return (
    <>
      <PageHero
        kicker="Carbon Accounting Basics"
        title="Carbon accounting, explained from the ground up"
        intro="A plain-English introduction to how emissions are measured, and why data and evidence quality matter."
        trail={[{ label: "Home", href: "/" }, { label: "Resources", href: "/resources" }, { label: "Carbon Accounting Basics" }]}
        secondary={{ label: "ESG glossary", href: "/resources/esg-glossary" }}
      />
      <Section className="section-blend">
        <div className="mx-auto max-w-3xl">
          <div className="prose-esgen">
            <h2 className="text-2xl font-semibold sm:text-3xl">The three scopes</h2>
            <p className="mt-3 text-text-muted">Under the GHG Protocol, emissions are grouped into three scopes. Scope 1 covers direct emissions from sources you own or control. Scope 2 covers purchased energy. Scope 3 covers all other indirect emissions across your value chain, and is usually the largest.</p>
          </div>
          <div className="mt-8"><ScopeDiagram /></div>
          <div className="mt-12 space-y-10">
            {sections.map((s) => (
              <div key={s.h}>
                <h2 className="text-2xl font-semibold sm:text-3xl">{s.h}</h2>
                <p className="mt-3 text-text-muted">{s.p}</p>
              </div>
            ))}
          </div>
        </div>
      </Section>
      <CTASection title="Ready to measure your footprint?" />
    </>
  );
}
