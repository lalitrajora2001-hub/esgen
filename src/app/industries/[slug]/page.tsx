import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import { pagesIn, getPage } from "@/lib/content";
import { INDUSTRY_DATA } from "@/lib/industries";
import { Section, SectionHead } from "@/components/ui/Section";
import { Reveal } from "@/components/ui/Reveal";
import { Breadcrumb, CTASection } from "@/components/sections/blocks";
import { Button, ArrowRight } from "@/components/ui/Button";
import { FootprintBreakdown } from "@/components/industries/FootprintBreakdown";

export const dynamicParams = false;
export function generateStaticParams() {
  return pagesIn("industries").map((p) => ({ slug: p.slug }));
}
export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const page = getPage("industries", slug);
  if (!page) return {};
  return { title: page.seoTitle, description: page.seoDescription, alternates: { canonical: `/industries/${slug}` }, openGraph: { title: `${page.seoTitle} | ESGen`, description: page.seoDescription } };
}

export default async function Page({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const page = getPage("industries", slug);
  const data = INDUSTRY_DATA[slug];
  if (!page || !data) notFound();

  return (
    <>
      {/* Hero */}
      <section className="relative overflow-hidden pt-28 pb-8 sm:pt-36">
        <div aria-hidden className="pointer-events-none absolute inset-0" style={{ background: "radial-gradient(900px 480px at 75% -10%, rgba(77,139,245,0.16), transparent 60%)" }} />
        <div className="grid-texture pointer-events-none absolute inset-0 opacity-60" aria-hidden />
        <div className="relative mx-auto max-w-6xl px-5 sm:px-6">
          <Breadcrumb trail={[{ label: "Home", href: "/" }, { label: "Industries", href: "/industries/manufacturing" }, { label: page.navLabel }]} />
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

      {/* Challenges */}
      <Section className="section-blend">
        <SectionHead title="What makes this sector hard" />
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

      {/* Features */}
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
          <SectionHead title={`Questions from ${page.navLabel.toLowerCase()} teams`} />
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

      <CTASection title={`Bring your ${page.navLabel.toLowerCase()} footprint into one workspace`} intro="See how ESGen measures the whole picture and helps you act on the part that counts." />
    </>
  );
}
