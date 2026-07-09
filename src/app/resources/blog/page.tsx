import type { Metadata } from "next";
import { Section, SectionHead } from "@/components/ui/Section";
import { Reveal } from "@/components/ui/Reveal";
import { PageHero, CTASection, LinkCard } from "@/components/sections/blocks";

export const metadata: Metadata = {
  title: "ESG and Carbon Reporting Blog",
  description: "Notes and updates on ESG reporting practice from ESGen. In the meantime, explore the Knowledge Hub and guides.",
};

const topics = [
  { title: "Carbon accounting", href: "/resources/carbon-accounting-basics", desc: "Scopes, factors, and tCO2e, in plain English." },
  { title: "Frameworks", href: "/resources/regulations", desc: "An overview of the rules that shape reporting." },
  { title: "ESG glossary", href: "/resources/esg-glossary", desc: "Key terms defined in one place." },
];

export default function BlogPage() {
  return (
    <>
      <PageHero
        kicker="Blog"
        title="Notes on ESG reporting practice"
        intro="We are building out our writing on carbon accounting and ESG reporting. In the meantime, the Knowledge Hub and guides are the best place to start."
        trail={[{ label: "Home", href: "/" }, { label: "Resources", href: "/resources" }, { label: "Blog" }]}
        secondary={{ label: "Knowledge Hub", href: "/resources/knowledge-hub" }}
      />
      <Section className="section-blend">
        <SectionHead eyebrow="In the meantime" title="Useful reading" />
        <div className="mt-12 grid gap-5 sm:grid-cols-3">
          {topics.map((t) => <Reveal key={t.href}><LinkCard {...t} /></Reveal>)}
        </div>
      </Section>
      <CTASection />
    </>
  );
}
