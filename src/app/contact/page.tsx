import type { Metadata } from "next";
import { Section, SectionHead } from "@/components/ui/Section";
import { Reveal } from "@/components/ui/Reveal";
import { Breadcrumb } from "@/components/sections/blocks";
import { ContactForm } from "@/components/forms/ContactForm";
import { EnquiryRouter } from "@/components/contact/EnquiryRouter";
import { site } from "@/lib/nav";

export const metadata: Metadata = {
  title: "Contact ESGen",
  description: "Speak to ESGen about carbon accounting, ESG reporting, supplier assessments, compliance support, or partnership opportunities.",
};

const cards = [
  { label: "General enquiries", email: site.emails.general },
  { label: "Founder / business contact", email: site.emails.founder },
  { label: "Operations / support contact", email: site.emails.operations },
];

export default function ContactPage() {
  return (
    <>
      {/* Hero */}
      <section className="relative overflow-hidden pt-28 pb-6 sm:pt-36">
        <div aria-hidden className="pointer-events-none absolute inset-0" style={{ background: "radial-gradient(900px 460px at 50% -10%, rgba(255,255,255,0.07), transparent 60%)" }} />
        <div className="grid-texture pointer-events-none absolute inset-0 opacity-60" aria-hidden />
        <div className="relative mx-auto max-w-6xl px-5 sm:px-6">
          <Breadcrumb trail={[{ label: "Home", href: "/" }, { label: "Contact" }]} />
          <div className="max-w-2xl">
            <h1 className="text-balance text-4xl font-semibold leading-[1.05] sm:text-5xl">Let's find the right way to help</h1>
            <p className="mt-5 max-w-xl text-lg text-text-muted">Pick what brings you here and we will point you to the right next step and the right person, no phone tree, no gatekeeping.</p>
          </div>
        </div>
      </section>

      {/* Router */}
      <Section size="sm">
        <Reveal><EnquiryRouter /></Reveal>
      </Section>

      {/* Form + direct contacts */}
      <Section className="section-blend">
        <div className="grid gap-12 lg:grid-cols-[1.3fr_1fr]">
          <div>
            <SectionHead title="Or send us a message" />
            <div className="mt-8"><ContactForm /></div>
          </div>
          <aside className="space-y-4">
            <p className="font-mono text-[0.68rem] uppercase tracking-[0.16em] text-text-muted">Direct contacts</p>
            {cards.map((c) => (
              <div key={c.email} className="rounded-2xl border border-border bg-surface p-5">
                <p className="text-sm text-text-muted">{c.label}</p>
                <a href={`mailto:${c.email}`} className="mt-1 block font-display font-medium text-white hover:text-accent-3">{c.email}</a>
              </div>
            ))}
            <div className="rounded-2xl border border-border p-5" style={{ background: "linear-gradient(160deg, #101827, #06070b)" }}>
              <p className="font-display font-semibold text-white">Prefer a walkthrough?</p>
              <p className="mt-1 text-sm text-text-muted">Book a short demo and we will tailor it to your reporting needs.</p>
              <a href="/demo" className="mt-3 inline-flex items-center gap-2 text-sm font-medium text-accent-3">Book a demo →</a>
            </div>
          </aside>
        </div>
      </Section>
    </>
  );
}
