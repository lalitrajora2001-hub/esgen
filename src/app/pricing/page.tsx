import type { Metadata } from "next";
import { Section, SectionHead } from "@/components/ui/Section";
import { Reveal } from "@/components/ui/Reveal";
import { PageHero, CTASection, Check } from "@/components/sections/blocks";

export const metadata: Metadata = {
  title: "Pricing",
  description: "ESGen pricing is built around your reporting scope, company size, data complexity, and the modules and support you need.",
};

const shapes = [
  { h: "Your reporting scope", p: "The frameworks and disclosures you need to prepare for shape the modules you use." },
  { h: "Company size and complexity", p: "The number of entities, sites, and data sources affects the setup." },
  { h: "Level of support", p: "Whether you need advisory or compliance support alongside the platform." },
];

const modules = [
  "ESG Data Management", "GHG Accounting", "Supplier Assessment", "Reporting Automation",
  "Double Materiality Assessment", "Advisory support", "Compliance support", "Audit support",
];

const factors = [
  "Number of entities or sites",
  "Reporting frameworks required",
  "Scope 1, 2 and 3 complexity",
  "Supplier assessment requirements",
  "Advisory or compliance support",
  "Implementation requirements",
];

export default function PricingPage() {
  return (
    <>
      <PageHero
        kicker="Pricing"
        title="Pricing built around your ESG reporting needs"
        intro="ESGen pricing depends on your reporting scope, company size, data complexity, required modules, and level of advisory or compliance support."
        trail={[{ label: "Home", href: "/" }, { label: "Pricing" }]}
        primary={{ label: "Get in touch", href: "/contact" }}
        secondary={{ label: "Book a demo", href: "/demo" }}
      />

      <Section className="section-blend">
        <SectionHead eyebrow="What shapes your plan" title="Tailored to your organisation" />
        <div className="mt-12 grid gap-5 sm:grid-cols-3">
          {shapes.map((s) => (
            <Reveal key={s.h}><div className="card h-full p-6"><h3 className="font-display text-lg font-semibold">{s.h}</h3><p className="mt-2 text-sm text-text-muted">{s.p}</p></div></Reveal>
          ))}
        </div>
      </Section>

      <Section>
        <div className="grid gap-10 lg:grid-cols-2">
          <div>
            <h2 className="text-2xl font-semibold sm:text-3xl">Modules and support options</h2>
            <p className="mt-3 text-text-muted">Choose the modules and level of support that match your reporting needs. Collect once, and reuse the same data across multiple reporting requirements.</p>
            <div className="mt-6 flex flex-wrap gap-2.5">
              {modules.map((m) => <span key={m} className="inline-flex items-center gap-2 rounded-full border border-border bg-surface px-3.5 py-1.5 text-sm text-text-muted"><Check /> {m}</span>)}
            </div>
          </div>
          <div className="card p-6 sm:p-8">
            <h2 className="font-display text-xl font-semibold">Typical factors considered</h2>
            <ul className="mt-5 space-y-3">
              {factors.map((f) => <li key={f} className="flex items-start gap-3 text-sm text-text-muted"><Check /> {f}</li>)}
            </ul>
          </div>
        </div>
      </Section>

      <CTASection title="Speak to ESGen about the right setup for your organisation" intro="Tell us about your reporting needs and we will put together the right combination of platform and support." primary={{ label: "Get in touch", href: "/contact" }} secondary={{ label: "Book a demo", href: "/demo" }} />
    </>
  );
}
