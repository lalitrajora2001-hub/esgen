import type { Metadata } from "next";
import { Section, SectionHead } from "@/components/ui/Section";
import { Reveal } from "@/components/ui/Reveal";
import { PageHero, CTASection, Check } from "@/components/sections/blocks";
import { PartnerPortal } from "@/components/mockups";

export const metadata: Metadata = {
  title: "ESG Partner Program",
  description: "For consultants, accountants, auditors, and advisors. Deliver ESG and carbon reporting to clients with ESGen, co-branded and supported.",
};

const cards = [
  { h: "Who the partner program is for", p: "Consultants, accountants, auditors, sustainability advisors, implementation partners, and agencies who deliver ESG and carbon reporting to clients." },
  { h: "Partner benefits", p: "A structured platform to deliver reporting, plus guidance and resources to support your engagements." },
  { h: "Delivery model", p: "Manage multiple client workspaces in one place, with clear ownership and progress across engagements." },
  { h: "Co-branded ESG support", p: "Deliver ESG and carbon reporting to your clients with ESGen behind the scenes." },
  { h: "Partner resources", p: "Access explainers, templates, and guidance to help you deliver consistently." },
  { h: "Implementation workflow", p: "A clear path from onboarding a client through to reporting, so delivery is repeatable." },
];

const forWhom = ["Consultants", "Accountants", "Auditors", "Sustainability advisors", "Implementation partners", "Agencies"];

export default function PartnerProgramPage() {
  return (
    <>
      <PageHero
        kicker="Partner Program"
        title="Deliver ESG and carbon reporting to your clients"
        intro="Partner with ESGen to deliver structured ESG and carbon reporting, with client workspaces, guided workflows, and supporting resources."
        trail={[{ label: "Home", href: "/" }, { label: "Partner Program" }]}
        primary={{ label: "Contact ESGen", href: "/contact" }}
        secondary={{ label: "Book a demo", href: "/demo" }}
        visual={<PartnerPortal />}
      />

      <Section className="section-blend">
        <SectionHead eyebrow="Who it is for" title="Built for advisory and delivery teams" />
        <div className="mt-8 flex flex-wrap gap-3">
          {forWhom.map((w) => (
            <span key={w} className="inline-flex items-center gap-2 rounded-full border border-border bg-surface px-4 py-2 text-sm text-text-muted">
              <Check /> {w}
            </span>
          ))}
        </div>
      </Section>

      <Section>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {cards.map((c) => (
            <Reveal key={c.h}>
              <div className="card h-full p-6">
                <h3 className="font-display text-lg font-semibold">{c.h}</h3>
                <p className="mt-2 text-sm text-text-muted">{c.p}</p>
              </div>
            </Reveal>
          ))}
        </div>
      </Section>

      <CTASection title="Interested in partnering with ESGen?" intro="Tell us about your practice and the clients you support, and we will follow up." primary={{ label: "Contact ESGen", href: "/contact" }} secondary={{ label: "Book a demo", href: "/demo" }} />
    </>
  );
}
