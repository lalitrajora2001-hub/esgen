import type { Metadata } from "next";
import Link from "next/link";
import { Section } from "@/components/ui/Section";
import { Reveal } from "@/components/ui/Reveal";
import { ArrowRight } from "@/components/ui/Button";
import { RBreadcrumb, RCta } from "@/components/resources/light";

export const metadata: Metadata = {
  title: "ESG and Carbon Reporting Blog",
  description: "Notes and updates on ESG reporting practice from ESGen. In the meantime, explore the Knowledge Hub and white papers.",
};

const READING: { title: string; href: string; desc: string }[] = [
  { title: "Carbon accounting", href: "/resources/carbon-accounting-basics", desc: "Scopes, factors, and tCO₂e, in plain English." },
  { title: "Frameworks", href: "/resources/regulations", desc: "An overview of the rules that shape reporting, by jurisdiction." },
  { title: "ESG glossary", href: "/resources/esg-glossary", desc: "Every key term defined and searchable in one place." },
];

export default function BlogPage() {
  return (
    <div className="bg-white">
      <section className="relative overflow-hidden pt-28 pb-6 sm:pt-36">
        <div aria-hidden className="pointer-events-none absolute inset-0" style={{ background: "radial-gradient(900px 460px at 50% -10%, rgba(16,19,24,0.05), transparent 60%)" }} />
        <div className="relative mx-auto max-w-6xl px-5 sm:px-6">
          <RBreadcrumb trail={[{ label: "Home", href: "/" }, { label: "Resources", href: "/resources" }, { label: "Blog" }]} />
          <div className="max-w-2xl">
            <h1 className="text-balance text-4xl font-semibold leading-[1.05] text-[#101318] sm:text-5xl">Notes on ESG reporting practice</h1>
            <p className="mt-5 max-w-xl text-lg text-[#565d68]">We are building out our writing for people doing the work. Until the first pieces land, the Knowledge Hub and white papers are the best place to start.</p>
          </div>
        </div>
      </section>

      <Section size="sm">
        <div className="rounded-3xl border border-dashed border-[#d7dbe1] bg-[#f6f7f9] p-8 text-center sm:p-12">
          <div className="mx-auto grid h-12 w-12 place-items-center rounded-2xl border border-[#e6e8ec] bg-white text-[#101318]">
            <svg viewBox="0 0 24 24" className="h-6 w-6" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round"><path d="M14 6l4 4M4 20l1-5L16 4l4 4L9 19z" /></svg>
          </div>
          <h2 className="mt-4 font-display text-xl font-semibold text-[#101318]">Articles are on the way</h2>
          <p className="mx-auto mt-2 max-w-md text-sm text-[#565d68]">In the meantime, here is where we would point you.</p>
          <div className="mt-8 grid gap-5 text-left sm:grid-cols-3">
            {READING.map((t) => (
              <Reveal key={t.href}>
                <Link href={t.href} className="group block h-full rounded-2xl border border-[#e6e8ec] bg-white p-5 transition-all hover:-translate-y-1 hover:border-[#101318]/30">
                  <h3 className="font-display text-base font-semibold text-[#101318]">{t.title}</h3>
                  <p className="mt-2 text-sm text-[#565d68]">{t.desc}</p>
                  <span className="mt-3 inline-flex items-center gap-1.5 text-sm font-medium text-[#101318]">Read <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" /></span>
                </Link>
              </Reveal>
            ))}
          </div>
        </div>
      </Section>

      <RCta />
    </div>
  );
}
