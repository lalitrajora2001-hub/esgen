import type { Metadata } from "next";
import Link from "next/link";
import { Section } from "@/components/ui/Section";
import { Reveal } from "@/components/ui/Reveal";
import { ArrowRight } from "@/components/ui/Button";
import { RBreadcrumb, RCta } from "@/components/resources/light";

export const metadata: Metadata = {
  title: "ESG White Papers",
  description: "In-depth white papers on carbon accounting, supplier ESG data, materiality, and framework preparation.",
  alternates: { canonical: "/resources/guides" },
};

const GUIDES: { title: string; href: string; desc: string; mins: string }[] = [
  { title: "Getting started with carbon accounting", href: "/resources/carbon-accounting-basics", desc: "Scopes, activity data, factors, and tCO₂e, the groundwork.", mins: "Foundations" },
  { title: "Improving Scope 3 with supplier data", href: "/platform/suppliers-engagement", desc: "How to collect primary data from the suppliers that matter most.", mins: "Scope 3" },
  { title: "Understanding double materiality", href: "/platform/csrd", desc: "Impact and financial materiality, and how a topic becomes reportable.", mins: "CSRD" },
  { title: "Preparing for CSRD and ESRS", href: "/platform/csrd", desc: "Datapoint mapping, evidence, and the assurance conversation.", mins: "CSRD" },
  { title: "Building an ESG data workspace", href: "/solutions/reporting", desc: "Structure data once, then report across every framework that asks.", mins: "Data" },
  { title: "Reporting readiness overview", href: "/solutions/reporting", desc: "Framework mapping and a plain gap assessment.", mins: "Readiness" },
];

export default function WhitePapersPage() {
  return (
    <div className="bg-white">
      <section className="relative overflow-hidden pt-28 pb-6 sm:pt-36">
        <div aria-hidden className="pointer-events-none absolute inset-0" style={{ background: "radial-gradient(900px 460px at 50% -10%, rgba(16,19,24,0.05), transparent 60%)" }} />
        <div className="relative mx-auto max-w-6xl px-5 sm:px-6">
          <RBreadcrumb trail={[{ label: "Home", href: "/" }, { label: "Resources", href: "/resources" }, { label: "White papers" }]} />
          <div className="max-w-2xl">
            <h1 className="text-balance font-display text-4xl font-bold leading-[1.05] tracking-tight text-[#101318] sm:text-5xl">White papers for the slow parts</h1>
            <p className="mt-5 max-w-xl text-lg text-[#565d68]">In-depth walkthroughs of the tasks that actually take time, the ones where a clear method saves days.</p>
          </div>
        </div>
      </section>

      <Section size="sm">
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {GUIDES.map((g, i) => (
            <Reveal key={g.title}>
              <Link href={g.href} className="group flex h-full flex-col rounded-3xl border border-[#e6e8ec] bg-white p-6 transition-all hover:-translate-y-1 hover:border-[#101318]/30" style={{ transitionDelay: `${i * 30}ms` }}>
                <span className="w-fit rounded-full border border-[#e6e8ec] px-2.5 py-0.5 text-[0.6rem] font-bold uppercase tracking-wide text-[#565d68]">{g.mins}</span>
                <h2 className="mt-4 font-display text-lg font-semibold text-[#101318]">{g.title}</h2>
                <p className="mt-2 flex-1 text-sm leading-relaxed text-[#565d68]">{g.desc}</p>
                <span className="mt-4 inline-flex items-center gap-2 text-sm font-medium text-[#101318]">Read the white paper <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" /></span>
              </Link>
            </Reveal>
          ))}
        </div>
      </Section>

      <RCta />
    </div>
  );
}
