import type { Metadata } from "next";
import { Section, SectionHead } from "@/components/ui/Section";
import { Reveal } from "@/components/ui/Reveal";
import { PageHero, CTASection } from "@/components/sections/blocks";

export const metadata: Metadata = {
  title: "ESG Regulations and Frameworks Overview",
  description: "A plain overview of the sustainability and carbon reporting frameworks that shape ESG reporting, with links to how ESGen supports each.",
};

const frameworks: { name: string; what: string; href: string }[] = [
  { name: "GHG Protocol", what: "The most widely used standard for corporate greenhouse gas accounting, grouping emissions into three scopes.", href: "/platform/carbon-assessment" },
  { name: "CSRD / ESRS", what: "The EU directive and standards that set sustainability reporting requirements for in-scope companies.", href: "/platform/csrd" },
  { name: "ISSB (IFRS S1/S2)", what: "Global baseline sustainability and climate disclosure standards from the IFRS Foundation.", href: "/platform/tcfd-ifrs" },
  { name: "UK SRS", what: "UK Sustainability Reporting Standards, based on the ISSB standards.", href: "/platform/uk-srs" },
  { name: "CDP", what: "A global environmental disclosure system based on an annual questionnaire.", href: "/solutions/reporting" },
  { name: "CBAM", what: "The EU Carbon Border Adjustment Mechanism, relevant to importers of certain carbon-intensive goods.", href: "/platform/cbam" },
  { name: "BRSR", what: "India's Business Responsibility and Sustainability Report, set by SEBI for large listed companies.", href: "/solutions/reporting" },
  { name: "SECR", what: "UK Streamlined Energy and Carbon Reporting requirements for qualifying organisations.", href: "/platform/secr" },
];

export default function RegulationsPage() {
  return (
    <>
      <PageHero
        kicker="Regulations"
        title="An overview of the frameworks that shape reporting"
        intro="A plain summary of the main sustainability and carbon reporting frameworks, and how ESGen helps you prepare for each."
        trail={[{ label: "Home", href: "/" }, { label: "Resources", href: "/resources" }, { label: "Regulations" }]}
        secondary={{ label: "Reporting solutions", href: "/solutions/reporting" }}
      />
      <Section className="section-blend">
        <SectionHead eyebrow="Frameworks" title="At a glance" />
        <div className="mt-12 grid gap-5 sm:grid-cols-2">
          {frameworks.map((f) => (
            <Reveal key={f.name}>
              <a href={f.href} className="card card-hover block h-full p-6">
                <h3 className="font-display text-lg font-semibold">{f.name}</h3>
                <p className="mt-2 text-sm text-text-muted">{f.what}</p>
                <span className="mt-4 inline-block text-sm font-medium text-accent-3">How ESGen supports this →</span>
              </a>
            </Reveal>
          ))}
        </div>
        <p className="mt-8 font-mono text-xs text-text-muted/60">
          This overview is for general information only and is not legal advice. Requirements change, so please verify the current position for your organisation.
        </p>
      </Section>
      <CTASection />
    </>
  );
}
