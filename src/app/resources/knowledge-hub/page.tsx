import type { Metadata } from "next";
import { Section, SectionHead } from "@/components/ui/Section";
import { Reveal } from "@/components/ui/Reveal";
import { PageHero, CTASection, LinkCard } from "@/components/sections/blocks";

export const metadata: Metadata = {
  title: "ESG Knowledge Hub",
  description: "Fundamentals of ESG reporting, carbon accounting, compliance frameworks, supplier ESG, and data management.",
};

const topics = [
  { title: "ESG reporting basics", href: "/resources/carbon-accounting-basics", desc: "What ESG reporting covers and where to begin." },
  { title: "Carbon accounting", href: "/platform/carbon-assessment", desc: "How Scope 1, 2, and 3 emissions are measured." },
  { title: "Compliance frameworks", href: "/resources/regulations", desc: "CSRD, ISSB, UK SRS, CDP, BRSR, and CBAM at a glance." },
  { title: "Supplier ESG", href: "/platform/suppliers-engagement", desc: "Collecting supplier data to strengthen Scope 3." },
  { title: "Data management", href: "/solutions/reporting", desc: "Keeping ESG data structured, owned, and traceable." },
];

export default function KnowledgeHubPage() {
  return (
    <>
      <PageHero
        kicker="Knowledge Hub"
        title="ESG and carbon reporting, explained simply"
        intro="Short, practical explainers on the fundamentals, with links to the parts of ESGen that support each one."
        trail={[{ label: "Home", href: "/" }, { label: "Resources", href: "/resources" }, { label: "Knowledge Hub" }]}
        secondary={{ label: "All resources", href: "/resources" }}
      />
      <Section className="section-blend">
        <SectionHead eyebrow="Topics" title="Start with the fundamentals" />
        <div className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {topics.map((t) => <Reveal key={t.href}><LinkCard {...t} /></Reveal>)}
        </div>
      </Section>
      <CTASection />
    </>
  );
}
