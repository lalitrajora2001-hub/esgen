import type { Metadata } from "next";
import Link from "next/link";
import { Section } from "@/components/ui/Section";
import { Reveal } from "@/components/ui/Reveal";
import { Breadcrumb, CTASection } from "@/components/sections/blocks";
import { ArrowRight } from "@/components/ui/Button";

export const metadata: Metadata = {
  title: "ESG Reporting Guides",
  description: "Practical guide topics on carbon accounting, supplier ESG data, materiality, and framework preparation.",
};

const GUIDES: { title: string; href: string; desc: string; mins: string }[] = [
  { title: "Getting started with carbon accounting", href: "/resources/carbon-accounting-basics", desc: "Scopes, activity data, factors, and tCO₂e — the groundwork.", mins: "Foundations" },
  { title: "Improving Scope 3 with supplier data", href: "/platform/suppliers-engagement", desc: "How to collect primary data from the suppliers that matter most.", mins: "Scope 3" },
  { title: "Understanding double materiality", href: "/platform/csrd", desc: "Impact and financial materiality, and how a topic becomes reportable.", mins: "CSRD" },
  { title: "Preparing for CSRD and ESRS", href: "/platform/csrd", desc: "Datapoint mapping, evidence, and the assurance conversation.", mins: "CSRD" },
  { title: "Building an ESG data workspace", href: "/solutions/reporting", desc: "Structure data once, then report across every framework that asks.", mins: "Data" },
  { title: "Reporting readiness overview", href: "/solutions/reporting", desc: "Framework mapping and a plain gap assessment.", mins: "Readiness" },
];

export default function GuidesPage() {
  return (
    <>
      <section className="relative overflow-hidden pt-28 pb-6 sm:pt-36">
        <div aria-hidden className="pointer-events-none absolute inset-0" style={{ background: "radial-gradient(900px 460px at 50% -10%, rgba(77,139,245,0.14), transparent 60%)" }} />
        <div className="relative mx-auto max-w-6xl px-5 sm:px-6">
          <Breadcrumb trail={[{ label: "Home", href: "/" }, { label: "Resources", href: "/resources" }, { label: "Guides" }]} />
          <div className="max-w-2xl">
            <h1 className="text-balance text-4xl font-semibold leading-[1.05] sm:text-5xl">Practical walkthroughs for the slow parts</h1>
            <p className="mt-5 max-w-xl text-lg text-text-muted">Step-by-step guides to the tasks that actually take time — the ones where a clear method saves days.</p>
          </div>
        </div>
      </section>

      <Section size="sm">
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {GUIDES.map((g, i) => (
            <Reveal key={g.title}>
              <Link href={g.href} className="group flex h-full flex-col rounded-3xl border border-border bg-surface p-6 transition-all hover:-translate-y-1 hover:border-accent/40" style={{ transitionDelay: `${i * 30}ms` }}>
                <span className="w-fit rounded-full border border-border px-2.5 py-0.5 text-[0.6rem] font-bold uppercase tracking-wide text-text-muted">{g.mins}</span>
                <h2 className="mt-4 font-display text-lg font-semibold">{g.title}</h2>
                <p className="mt-2 flex-1 text-sm leading-relaxed text-text-muted">{g.desc}</p>
                <span className="mt-4 inline-flex items-center gap-2 text-sm font-medium text-accent-3">Read the guide <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" /></span>
              </Link>
            </Reveal>
          ))}
        </div>
      </Section>

      <CTASection />
    </>
  );
}
