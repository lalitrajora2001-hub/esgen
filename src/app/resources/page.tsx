import type { Metadata } from "next";
import Link from "next/link";
import { Section } from "@/components/ui/Section";
import { Reveal } from "@/components/ui/Reveal";
import { Breadcrumb, CTASection } from "@/components/sections/blocks";
import { ArrowRight } from "@/components/ui/Button";

export const metadata: Metadata = {
  title: "ESG and Carbon Reporting Resources",
  description: "Guides, an interactive ESG glossary, carbon accounting basics, and a plain overview of the frameworks that shape reporting.",
};

const IC = {
  book: "M4 5a2 2 0 0 1 2-2h9l5 5v11a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2zM14 3v6h6M8 13h8M8 17h5",
  spark: "M12 3l1.9 5.1L19 10l-5.1 1.9L12 17l-1.9-5.1L5 10l5.1-1.9zM19 3v3M20.5 4.5h-3",
  glossary: "M6 4h11a3 3 0 0 1 3 3v13H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2zM8 8h7M8 12h7",
  calc: "M6 3h12v18H6zM9 7h6M8 11h.01M12 11h.01M16 11h.01M8 15h.01M12 15h.01M16 15v4",
  scale: "M12 3v18M7 8l-4 8h8zM17 8l-4 8h8zM3 8h18",
  pen: "M14 6l4 4M4 20l1-5L16 4l4 4L9 19z",
};

const FEATURED = { href: "/resources/carbon-accounting-basics", eyebrow: "Start here", title: "Carbon accounting, from zero", desc: "Scopes, emission factors, and tCO₂e, the vocabulary everything else is built on, explained without assuming you already know it.", icon: IC.calc };

const CARDS: { href: string; title: string; desc: string; icon: string; tag: string }[] = [
  { href: "/resources/esg-glossary", title: "ESG Glossary", desc: "Every term, searchable and filterable by topic. Jump to a letter or hunt by keyword.", icon: IC.glossary, tag: "Interactive" },
  { href: "/resources/regulations", title: "Regulations", desc: "The frameworks that shape reporting, mapped by jurisdiction with who each one affects.", icon: IC.scale, tag: "Interactive" },
  { href: "/resources/knowledge-hub", title: "Knowledge Hub", desc: "The fundamentals of ESG and carbon reporting, laid out as a path rather than a pile.", icon: IC.book, tag: "Learn" },
  { href: "/resources/guides", title: "Guides", desc: "Practical, step-by-step walkthroughs for the tasks that actually take time.", icon: IC.spark, tag: "Practical" },
  { href: "/resources/blog", title: "Blog", desc: "Notes on ESG reporting practice, written for people doing the work.", icon: IC.pen, tag: "Reading" },
];

export default function ResourcesPage() {
  return (
    <>
      <section className="relative overflow-hidden pt-28 pb-6 sm:pt-36">
        <div aria-hidden className="pointer-events-none absolute inset-0" style={{ background: "radial-gradient(900px 480px at 50% -10%, rgba(77,139,245,0.16), transparent 60%)" }} />
        <div className="grid-texture pointer-events-none absolute inset-0 opacity-60" aria-hidden />
        <div className="relative mx-auto max-w-6xl px-5 sm:px-6">
          <Breadcrumb trail={[{ label: "Home", href: "/" }, { label: "Resources" }]} />
          <div className="max-w-2xl">
            <h1 className="text-balance text-4xl font-semibold leading-[1.05] sm:text-5xl">Learn the essentials, without the jargon</h1>
            <p className="mt-5 max-w-xl text-lg text-text-muted">Plain-English material on carbon accounting, ESG data, and the frameworks that shape reporting, some of it interactive, all of it built for people who have to actually do this.</p>
          </div>
        </div>
      </section>

      <Section size="sm">
        <Reveal>
          <Link href={FEATURED.href} className="group relative block overflow-hidden rounded-3xl border border-border bg-gradient-to-br from-surface-2 to-surface p-8 sm:p-12">
            <div aria-hidden className="pointer-events-none absolute -right-16 -top-16 h-56 w-56 rounded-full opacity-60 transition-transform duration-500 group-hover:scale-125" style={{ background: "radial-gradient(circle, rgba(77,139,245,0.25), transparent 70%)" }} />
            <div className="relative flex flex-wrap items-center gap-8">
              <div className="grid h-16 w-16 shrink-0 place-items-center rounded-2xl border border-accent/25 bg-accent/10 text-accent-3">
                <svg viewBox="0 0 24 24" className="h-8 w-8" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"><path d={FEATURED.icon} /></svg>
              </div>
              <div className="min-w-0 flex-1">
                <span className="font-mono text-[0.66rem] uppercase tracking-[0.16em] text-accent-3">{FEATURED.eyebrow}</span>
                <h2 className="mt-2 font-display text-2xl font-bold text-white sm:text-3xl">{FEATURED.title}</h2>
                <p className="mt-3 max-w-xl text-text-muted">{FEATURED.desc}</p>
                <span className="mt-4 inline-flex items-center gap-2 text-sm font-semibold text-accent-3">Read the basics <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" /></span>
              </div>
            </div>
          </Link>
        </Reveal>

        <div className="mt-6 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {CARDS.map((c, i) => (
            <Reveal key={c.href}>
              <Link href={c.href} className="group flex h-full flex-col rounded-3xl border border-border bg-surface p-6 transition-all hover:-translate-y-1 hover:border-accent/40" style={{ transitionDelay: `${i * 30}ms` }}>
                <div className="flex items-center justify-between">
                  <div className="grid h-11 w-11 place-items-center rounded-xl border border-accent/25 bg-accent/10 text-accent-3">
                    <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round"><path d={c.icon} /></svg>
                  </div>
                  <span className="rounded-full border border-border px-2.5 py-0.5 text-[0.6rem] font-bold uppercase tracking-wide text-text-muted">{c.tag}</span>
                </div>
                <h3 className="mt-5 font-display text-lg font-semibold">{c.title}</h3>
                <p className="mt-2 flex-1 text-sm leading-relaxed text-text-muted">{c.desc}</p>
                <span className="mt-4 inline-flex items-center gap-2 text-sm font-medium text-accent-3">Explore <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" /></span>
              </Link>
            </Reveal>
          ))}
        </div>
      </Section>

      <CTASection title="Want to see ESGen in action?" intro="Book a short walkthrough and we will map it to your reporting needs." />
    </>
  );
}
