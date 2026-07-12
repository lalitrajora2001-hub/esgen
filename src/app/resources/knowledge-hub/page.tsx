import type { Metadata } from "next";
import Link from "next/link";
import { Section } from "@/components/ui/Section";
import { Reveal } from "@/components/ui/Reveal";
import { ArrowRight } from "@/components/ui/Button";
import { RBreadcrumb, RCta } from "@/components/resources/light";

export const metadata: Metadata = {
  title: "ESG Knowledge Hub",
  description: "Fundamentals of ESG reporting, carbon accounting, compliance frameworks, supplier ESG, and data management.",
};

const TOPICS: { n: string; title: string; href: string; desc: string }[] = [
  { n: "01", title: "ESG reporting basics", href: "/resources/carbon-accounting-basics", desc: "What ESG reporting covers, and the single best place to begin." },
  { n: "02", title: "Carbon accounting", href: "/platform/carbon-assessment", desc: "How Scope 1, 2, and 3 emissions are measured, and why Scope 3 is the hard part." },
  { n: "03", title: "Compliance frameworks", href: "/resources/regulations", desc: "CSRD, ISSB, UK SRS, CDP, and CBAM, mapped by who they affect." },
  { n: "04", title: "Supplier ESG", href: "/platform/suppliers-engagement", desc: "Collecting primary data from suppliers to strengthen Scope 3." },
  { n: "05", title: "Data management", href: "/solutions/reporting", desc: "Keeping ESG data structured, owned, and traceable back to source." },
];

export default function KnowledgeHubPage() {
  return (
    <div className="bg-white">
      <section className="relative overflow-hidden pt-28 pb-6 sm:pt-36">
        <div aria-hidden className="pointer-events-none absolute inset-0" style={{ background: "radial-gradient(900px 460px at 50% -10%, rgba(16,19,24,0.05), transparent 60%)" }} />
        <div className="relative mx-auto max-w-6xl px-5 sm:px-6">
          <RBreadcrumb trail={[{ label: "Home", href: "/" }, { label: "Resources", href: "/resources" }, { label: "Knowledge Hub" }]} />
          <div className="max-w-2xl">
            <h1 className="text-balance text-4xl font-semibold leading-[1.05] text-[#101318] sm:text-5xl">The fundamentals, laid out as a path</h1>
            <p className="mt-5 max-w-xl text-lg text-[#565d68]">Not a pile of articles. A route through ESG and carbon reporting, from first principles to the parts of ESGen that put them to work.</p>
          </div>
        </div>
      </section>

      <Section size="sm">
        <div className="space-y-4">
          {TOPICS.map((t, i) => (
            <Reveal key={t.href}>
              <Link href={t.href} className="group flex items-center gap-6 rounded-2xl border border-[#e6e8ec] bg-white p-6 transition-all hover:-translate-y-0.5 hover:border-[#101318]/30" style={{ transitionDelay: `${i * 30}ms` }}>
                <span className="font-display text-3xl font-bold text-[#c8ccd2] transition-colors group-hover:text-[#101318]">{t.n}</span>
                <div className="min-w-0 flex-1">
                  <h2 className="font-display text-lg font-semibold text-[#101318]">{t.title}</h2>
                  <p className="mt-1 text-sm text-[#565d68]">{t.desc}</p>
                </div>
                <ArrowRight className="h-5 w-5 shrink-0 text-[#565d68] transition-all group-hover:translate-x-1 group-hover:text-[#101318]" />
              </Link>
            </Reveal>
          ))}
        </div>
      </Section>

      <RCta />
    </div>
  );
}
