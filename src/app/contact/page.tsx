import type { Metadata } from "next";
import { PageHero } from "@/components/sections/blocks";
import { Section } from "@/components/ui/Section";
import { ContactForm } from "@/components/forms/ContactForm";
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
      <PageHero
        kicker="Contact"
        title="Get in touch with ESGen"
        intro="Speak to us about carbon accounting, ESG reporting, supplier assessments, compliance support, or partnership opportunities."
        trail={[{ label: "Home", href: "/" }, { label: "Contact" }]}
        primary={{ label: "Book a demo", href: "/demo" }}
        secondary={{ label: "See pricing", href: "/pricing" }}
      />
      <Section>
        <div className="grid gap-12 lg:grid-cols-[1.3fr_1fr]">
          <ContactForm />
          <aside className="space-y-4">
            {cards.map((c) => (
              <div key={c.email} className="card p-5">
                <p className="text-sm text-text-muted">{c.label}</p>
                <a href={`mailto:${c.email}`} className="mt-1 block font-display font-medium text-white hover:text-accent-3">{c.email}</a>
              </div>
            ))}
            <div className="card p-5" style={{ background: "linear-gradient(160deg, #101827, #06070b)" }}>
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
