import type { Metadata } from "next";
import { PageHero } from "@/components/templates/shared";
import { Section } from "@/components/ui/Section";
import { ContactForm } from "@/components/forms/ContactForm";
import { site } from "@/lib/nav";

export const metadata: Metadata = {
  title: "Contact",
  description: "Book a demo or ask a question. ESGen is carbon accounting and ESG software, based in the United Kingdom.",
};

export default function ContactPage() {
  return (
    <>
      <PageHero
        kicker="Contact"
        title="Let us talk"
        intro="Book a demo or ask a question. We read every message and usually reply within one business day."
        trail={[{ label: "Home", href: "/" }, { label: "Contact" }]}
        primary={{ label: "Book a demo", href: "/demo" }}
        secondary={{ label: "See pricing", href: "/pricing" }}
      />
      <Section>
        <div className="grid gap-12 lg:grid-cols-[1.4fr_1fr]">
          <ContactForm />
          <aside className="space-y-6">
            <div className="card-surface p-6">
              <h2 className="font-display text-lg font-semibold">Reach us directly</h2>
              <ul className="mt-4 space-y-4 text-sm">
                <li>
                  <p className="text-text-muted">Email</p>
                  <a href={`mailto:${site.email}`} className="text-text hover:text-accent-3">{site.email}</a>
                </li>
                <li>
                  <p className="text-text-muted">Location</p>
                  <p className="text-text">United Kingdom. Remote friendly.</p>
                </li>
                <li>
                  <p className="text-text-muted">Hours</p>
                  <p className="text-text">Monday to Friday, 9am to 6pm GMT</p>
                </li>
              </ul>
              <p className="mt-4 font-mono text-xs text-text-muted/60">Full address and phone number to be confirmed.</p>
            </div>
            <div className="card-surface p-6" style={{ background: "linear-gradient(160deg, #16161a, #0b0b0d)" }}>
              <h2 className="font-display text-lg font-semibold">Prefer a live walkthrough?</h2>
              <p className="mt-2 text-sm text-text-muted">Book a 30 minute demo at a time that suits you. No preparation needed.</p>
              <a href="/demo" className="mt-4 inline-flex items-center gap-2 font-display text-sm font-semibold text-accent-3 hover:gap-3">Book a demo &rarr;</a>
            </div>
          </aside>
        </div>
      </Section>
    </>
  );
}
