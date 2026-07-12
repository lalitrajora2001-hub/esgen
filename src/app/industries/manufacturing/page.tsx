import type { Metadata } from "next";
import { INDUSTRY_DATA } from "@/lib/industries";
import { Section, SectionHead } from "@/components/ui/Section";
import { Reveal } from "@/components/ui/Reveal";
import { Breadcrumb, CTASection } from "@/components/sections/blocks";
import { Button, ArrowRight } from "@/components/ui/Button";
import { FootprintBreakdown } from "@/components/industries/FootprintBreakdown";
import { OutputMapper, PressureCards } from "@/components/industries/IndustryInteractives";

export const metadata: Metadata = {
  title: "Manufacturing ESG Reporting Software",
  description: "Carbon accounting for manufacturers: measure materials, sites, and logistics, then answer CBAM requests, product footprints, and disclosures from one inventory.",
  alternates: { canonical: "/industries/manufacturing" },
};

const PRESSURES = [
  { tag: "CBAM", title: "Your emissions become your customer's cost", desc: "From 2026, EU importers of covered goods surrender certificates priced on embedded emissions, and the UK has announced its own CBAM for 2027. If you sell steel, aluminium, cement or their products into those markets, your data sets your customer's bill." },
  { tag: "Procurement", title: "Product footprints are now tender questions", desc: "Per-product carbon figures have moved from a nice-to-have into standard procurement questionnaires. The manufacturer who can answer with a defensible number keeps the shortlist spot." },
  { tag: "Disclosure", title: "Your customers must report your emissions", desc: "CSRD and UK SRS require in-scope companies to disclose value-chain emissions. Their Scope 3 is your Scope 1 and 2, so the data request lands with you whether you are in scope or not." },
];

export default function ManufacturingPage() {
  const data = INDUSTRY_DATA.manufacturing;

  return (
    <>
      {/* Hero */}
      <section className="relative overflow-hidden pt-28 pb-8 sm:pt-36">
        <div aria-hidden className="pointer-events-none absolute inset-0" style={{ background: "radial-gradient(900px 480px at 75% -10%, rgba(77,139,245,0.16), transparent 60%)" }} />
        <div className="grid-texture pointer-events-none absolute inset-0 opacity-60" aria-hidden />
        <div className="relative mx-auto max-w-6xl px-5 sm:px-6">
          <Breadcrumb trail={[{ label: "Home", href: "/" }, { label: "Industries" }, { label: "Manufacturing" }]} />
          <div className="max-w-2xl">
            <h1 className="text-balance text-4xl font-semibold leading-[1.05] sm:text-5xl">Carbon accounting for manufacturers. Ready for the audit, ready for the tender.</h1>
            <p className="mt-5 max-w-xl text-lg text-text-muted">Most of a manufacturer&rsquo;s footprint is upstream, in the materials you buy, not on a meter you can read. ESGen measures the whole picture and turns it into the answers your customers now ask for.</p>
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

      {/* Why now: three pressures */}
      <Section className="section-blend">
        <SectionHead title="Three pressures, arriving at once" intro="None of them asks whether you find carbon accounting interesting. All of them ask for the same underlying data." />
        <div className="mt-12"><Reveal><PressureCards items={PRESSURES} /></Reveal></div>
      </Section>

      {/* One inventory, three answers */}
      <Section>
        <SectionHead title="Collect once, answer everyone" intro="Pick an output and watch which parts of the inventory feed it. The work is collecting the rows; the answers are then a mapping, not a new project." />
        <div className="mt-12"><Reveal><OutputMapper /></Reveal></div>
      </Section>

      {/* Sector challenges */}
      <Section className="section-blend">
        <SectionHead title="What makes manufacturing hard" />
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
          <SectionHead title="Questions from manufacturing teams" />
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

      <CTASection title="Bring your manufacturing footprint into one workspace" intro="See how ESGen measures materials, sites, and logistics, then answers CBAM, tenders, and disclosure from the same inventory." />
    </>
  );
}
