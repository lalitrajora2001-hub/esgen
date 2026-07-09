import type { Metadata } from "next";
import { Section, SectionHead } from "@/components/ui/Section";
import { Reveal } from "@/components/ui/Reveal";
import { PageHero, CTASection, LinkCard } from "@/components/sections/blocks";

export const metadata: Metadata = {
  title: "ESG Reporting Guides",
  description: "Practical guide topics on carbon accounting, supplier ESG data, materiality, and framework preparation.",
};

const guides = [
  { title: "Getting started with carbon accounting", href: "/resources/carbon-accounting-basics", desc: "Scopes, activity data, factors, and tCO2e." },
  { title: "Improving Scope 3 with supplier data", href: "/platform/suppliers-engagement", desc: "How to collect and use supplier ESG data." },
  { title: "Understanding double materiality", href: "/platform/csrd", desc: "Impact and financial materiality, explained." },
  { title: "Preparing for CSRD and ESRS", href: "/platform/csrd", desc: "Datapoint mapping, evidence, and traceability." },
  { title: "Building an ESG data workspace", href: "/solutions/reporting", desc: "Structure data once, report across needs." },
  { title: "Reporting readiness overview", href: "/solutions/reporting", desc: "Framework mapping and gap assessment." },
];

export default function GuidesPage() {
  return (
    <>
      <PageHero
        kicker="Guides"
        title="Practical guides by topic"
        intro="Clear walkthroughs of the topics that matter most for carbon accounting and ESG reporting."
        trail={[{ label: "Home", href: "/" }, { label: "Resources", href: "/resources" }, { label: "Guides" }]}
        secondary={{ label: "All resources", href: "/resources" }}
      />
      <Section className="section-blend">
        <SectionHead eyebrow="Topics" title="Choose a topic" />
        <div className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {guides.map((g) => <Reveal key={g.href}><LinkCard {...g} /></Reveal>)}
        </div>
      </Section>
      <CTASection />
    </>
  );
}
