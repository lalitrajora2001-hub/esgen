import type { Metadata } from "next";
import Link from "next/link";
import { Section, SectionHead } from "@/components/ui/Section";
import { Reveal } from "@/components/ui/Reveal";
import { Breadcrumb, CTASection } from "@/components/sections/blocks";
import { Button, ArrowRight } from "@/components/ui/Button";
import { PlanConfigurator, CompareMatrix } from "@/components/pricing/PricingVisuals";

export const metadata: Metadata = {
  title: "Pricing",
  description: "ESGen is scoped to your reporting needs, company size, and level of support. Configure a setup and get a quote built around it.",
};

const ADDONS: [string, string][] = [
  ["Additional entities", "Consolidate more legal entities or sites into one reporting boundary."],
  ["Advisory day rate", "Time with our team for materiality workshops, methodology, or review."],
  ["Assurance support", "Prepare the evidence pack and answer your assurance provider's questions."],
  ["Custom integrations", "Connect ESGen to your ERP, procurement, or data warehouse."],
  ["Product-level LCA", "Model the footprint of individual products across their life cycle."],
  ["Supplier onboarding", "Hands-on help engaging the suppliers that carry most of your Scope 3."],
];

const FAQS: [string, string][] = [
  ["Why aren't prices listed?", "Because a fair price depends on your scope. A single-entity SECR filing and a multi-entity CSRD programme with assurance are very different pieces of work. The configurator above shows what a setup contains; we quote against it."],
  ["What is the difference between the plans?", "Measure builds a complete inventory and reports to one framework. Comply adds multi-framework mapping, supplier data collection, and an assurance-ready trail. Advise adds hands-on support from our team. Most organisations with a regulatory obligation land on Comply."],
  ["Do we pay per framework?", "No. You collect your data once and reuse it across the frameworks that ask for it. Adding a framework is usually a matter of mapping, not re-collecting."],
  ["Can we start small and grow?", "Yes. Many organisations begin by measuring one year properly, then expand scope as obligations arrive. The inventory you build carries forward."],
  ["Is support included or extra?", "Onboarding is always included. A named contact comes with Comply and Advise. Hands-on advisory and compliance support are the defining feature of Advise, and are also available as add-ons."],
];

export default function PricingPage() {
  return (
    <>
      {/* Hero */}
      <section className="relative overflow-hidden pt-28 pb-10 sm:pt-36">
        <div aria-hidden className="pointer-events-none absolute inset-0" style={{ background: "radial-gradient(900px 480px at 50% -10%, rgba(255,255,255,0.07), transparent 60%)" }} />
        <div className="grid-texture pointer-events-none absolute inset-0 opacity-60" aria-hidden />
        <div className="relative mx-auto max-w-6xl px-5 sm:px-6">
          <Breadcrumb trail={[{ label: "Home", href: "/" }, { label: "Pricing" }]} />
          <div className="max-w-2xl">
            <h1 className="text-balance text-4xl font-semibold leading-[1.05] sm:text-5xl">Priced around your reporting, not a rate card</h1>
            <p className="mt-5 max-w-xl text-lg text-text-muted">Tell us what you report to and how you are structured. We will build a setup around it and quote for that, rather than sell you a tier you half-use.</p>
          </div>
        </div>
      </section>

      {/* Configurator */}
      <Section size="sm">
        <Reveal><PlanConfigurator /></Reveal>
      </Section>

      {/* Three plan shapes / matrix */}
      <Section className="section-blend">
        <SectionHead title="Three shapes, one dataset underneath" intro="Whichever plan fits, you are building the same auditable inventory. The plan decides how far it travels." center />
        <div className="mt-12 rounded-3xl border border-border bg-surface p-5 sm:p-8">
          <CompareMatrix />
        </div>
      </Section>

      {/* Add-ons */}
      <Section>
        <SectionHead title="Add what you need, when you need it" />
        <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {ADDONS.map((a, i) => (
            <Reveal key={a[0]}>
              <div className="card h-full p-6" style={{ transitionDelay: `${i * 30}ms` }}>
                <div className="grid h-9 w-9 place-items-center rounded-xl border border-accent/25 bg-accent/10 font-mono text-sm font-bold text-accent-3">{String(i + 1).padStart(2, "0")}</div>
                <h3 className="mt-4 font-display text-lg font-semibold">{a[0]}</h3>
                <p className="mt-2 text-sm text-text-muted">{a[1]}</p>
              </div>
            </Reveal>
          ))}
        </div>
      </Section>

      {/* FAQ */}
      <Section className="section-blend">
        <div className="grid gap-12 lg:grid-cols-[0.8fr_1.2fr]">
          <div>
            <SectionHead title="Pricing questions" />
            <p className="mt-4 text-text-muted">Still unsure what you would need? <Link href="/contact" className="text-accent-3 hover:underline">Talk to us</Link> and we will map it out with you.</p>
          </div>
          <div className="divide-y divide-border border-y border-border">
            {FAQS.map(([q, a]) => (
              <details key={q} className="group py-4">
                <summary className="flex cursor-pointer items-center justify-between gap-4 font-display text-base font-semibold text-white">
                  {q}
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" className="h-4 w-4 shrink-0 text-accent-3 transition-transform group-open:rotate-45"><path d="M12 5v14M5 12h14" /></svg>
                </summary>
                <p className="mt-2 max-w-2xl text-sm leading-relaxed text-text-muted">{a}</p>
              </details>
            ))}
          </div>
        </div>
      </Section>

      <CTASection title="Let's scope the right setup together" intro="Tell us about your reporting obligations and structure, and we will put together the right combination of platform and support." primary={{ label: "Get in touch", href: "/contact" }} secondary={{ label: "Book a demo", href: "/demo" }} />
    </>
  );
}
