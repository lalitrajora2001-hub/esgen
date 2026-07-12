import type { Metadata } from "next";
import { INDUSTRY_DATA } from "@/lib/industries";
import { Section, SectionHead } from "@/components/ui/Section";
import { Reveal } from "@/components/ui/Reveal";
import { Breadcrumb, CTASection } from "@/components/sections/blocks";
import { Button, ArrowRight } from "@/components/ui/Button";
import { FootprintBreakdown } from "@/components/industries/FootprintBreakdown";
import { EventTimeline, PressureCards } from "@/components/industries/IndustryInteractives";

export const metadata: Metadata = {
  title: "Event Sustainability Reporting Software",
  description: "Measure event footprints across venue energy, travel, catering, freight, and waste, with a repeatable template and client-ready reports.",
  alternates: { canonical: "/industries/events" },
};

const PRESSURES = [
  { tag: "Clients", title: "The footprint report is in the contract", desc: "Corporate clients increasingly make a post-event footprint a condition of the brief. The organiser who can deliver one quickly, with assumptions stated, wins the rebook." },
  { tag: "Sponsors", title: "Sponsors carry their own obligations", desc: "Exhibitors and sponsors with CSRD, UK SRS, or SBTi commitments need their share of the event's emissions for their own reporting. That request flows to you." },
  { tag: "Venues", title: "Attribution is genuinely contested", desc: "Venue energy, shared services, and build crews sit between organiser, venue, and contractor. Without a method, everyone counts everything or no one counts anything." },
];

export default function EventsPage() {
  const data = INDUSTRY_DATA.events;

  return (
    <>
      {/* Hero */}
      <section className="relative overflow-hidden pt-28 pb-8 sm:pt-36">
        <div aria-hidden className="pointer-events-none absolute inset-0" style={{ background: "radial-gradient(900px 480px at 25% -10%, rgba(77,139,245,0.16), transparent 60%)" }} />
        <div className="grid-texture pointer-events-none absolute inset-0 opacity-60" aria-hidden />
        <div className="relative mx-auto max-w-6xl px-5 sm:px-6">
          <Breadcrumb trail={[{ label: "Home", href: "/" }, { label: "Industries" }, { label: "Events" }]} />
          <div className="max-w-2xl">
            <h1 className="text-balance text-4xl font-semibold leading-[1.05] sm:text-5xl">{data.h1}</h1>
            <p className="mt-5 max-w-xl text-lg text-text-muted">{data.lead}</p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Button href="/demo" size="lg">Book a demo <ArrowRight /></Button>
              <Button href="/contact" variant="ghost" size="lg">Talk to our team</Button>
            </div>
          </div>
        </div>
      </section>

      {/* Signature: interactive footprint breakdown */}
      <Section size="sm">
        <Reveal><FootprintBreakdown title={data.footprintTitle} categories={data.categories} /></Reveal>
      </Section>

      {/* Why now */}
      <Section className="section-blend">
        <SectionHead title="Why event footprints stopped being optional" intro="Three directions of pressure, all asking for the same measured event." />
        <div className="mt-12"><Reveal><PressureCards items={PRESSURES} /></Reveal></div>
      </Section>

      {/* Lifecycle timeline */}
      <Section>
        <SectionHead title="A footprint with a beginning, a middle, and an end" intro="Events are projects, so the measurement is one too. Walk the three phases and see what gets captured in each." />
        <div className="mt-12"><Reveal><EventTimeline /></Reveal></div>
      </Section>

      {/* Sector challenges */}
      <Section className="section-blend">
        <SectionHead title="What makes events hard" />
        <div className="mt-10 grid gap-5 lg:grid-cols-3">
          {data.challenges.map(([t, d], i) => (
            <Reveal key={t}>
              <div className="card h-full p-6" style={{ transitionDelay: `${i * 40}ms` }}>
                <div className="font-mono text-sm font-bold text-accent-3">{String(i + 1).padStart(2, "0")}</div>
                <h3 className="mt-3 font-display text-lg font-semibold">{t}</h3>
                <p className="mt-2 text-sm leading-relaxed text-text-muted">{d}</p>
              </div>
            </Reveal>
          ))}
        </div>
      </Section>

      {/* How ESGen fits */}
      <Section>
        <div className="grid gap-12 lg:grid-cols-[0.85fr_1.15fr] lg:items-start">
          <Reveal>
            <SectionHead title="How ESGen fits the way you work" />
            <p className="mt-4 text-text-muted">{data.outcome}</p>
          </Reveal>
          <div className="space-y-4">
            {data.features.map(([t, d], i) => (
              <Reveal key={t}>
                <div className="flex gap-5 rounded-2xl border border-border bg-surface p-6" style={{ transitionDelay: `${i * 40}ms` }}>
                  <span className="grid h-10 w-10 shrink-0 place-items-center rounded-xl border border-accent/25 bg-accent/10 font-mono text-sm font-bold text-accent-3">{i + 1}</span>
                  <div>
                    <h3 className="font-display text-lg font-semibold">{t}</h3>
                    <p className="mt-1.5 text-sm leading-relaxed text-text-muted">{d}</p>
                  </div>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </Section>

      {/* FAQ */}
      <Section className="section-blend">
        <div className="grid gap-12 lg:grid-cols-[0.8fr_1.2fr]">
          <SectionHead title="Questions from event teams" />
          <div className="divide-y divide-border border-y border-border">
            {data.faqs.map(([q, a]) => (
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

      <CTASection title="Measure your next event properly" intro="See how ESGen turns registrations, meters, and invoices into a footprint report your client can use." />
    </>
  );
}
