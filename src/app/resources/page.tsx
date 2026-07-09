import type { Metadata } from "next";
import { Section, SectionHead } from "@/components/ui/Section";
import { Reveal } from "@/components/ui/Reveal";
import { PageHero, CTASection, LinkCard } from "@/components/sections/blocks";
import { ResourcesLibrary } from "@/components/mockups";
import { resources } from "@/lib/nav";

export const metadata: Metadata = {
  title: "ESG and Carbon Reporting Resources",
  description: "Guides, an ESG glossary, carbon accounting basics, and a plain overview of the frameworks that shape reporting.",
};

export default function ResourcesPage() {
  const cards = resources.filter((r) => r.href !== "/resources");
  return (
    <>
      <PageHero
        kicker="Resources"
        title="Learn the essentials of ESG and carbon reporting"
        intro="Practical, plain-English material to help you understand carbon accounting, ESG data, and the frameworks that shape reporting."
        trail={[{ label: "Home", href: "/" }, { label: "Resources" }]}
        secondary={{ label: "Book a demo", href: "/demo" }}
        visual={<ResourcesLibrary />}
      />
      <Section className="section-blend">
        <SectionHead eyebrow="Explore" title="Where to start" />
        <div className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {cards.map((c) => <Reveal key={c.href}><LinkCard href={c.href} title={c.label} desc={c.desc ?? ""} /></Reveal>)}
        </div>
      </Section>
      <CTASection title="Want to see ESGen in action?" intro="Book a short walkthrough and we will map it to your reporting needs." />
    </>
  );
}
