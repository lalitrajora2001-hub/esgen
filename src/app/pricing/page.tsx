import type { Metadata } from "next";
import Link from "next/link";
import { PageHero, ClosingCTA } from "@/components/templates/shared";
import { Section, SectionHead } from "@/components/ui/Section";
import { Reveal, RevealGroup, RevealItem } from "@/components/ui/Reveal";
import { Button, ArrowRight } from "@/components/ui/Button";
import { FAQ } from "@/components/ui/FAQ";
import { RoiCalculator } from "@/components/pricing/RoiCalculator";

export const metadata: Metadata = {
  title: "Pricing",
  description: "Simple, fair pricing for carbon accounting and ESG software. Plans for small teams through to larger groups, with guidance included.",
};

const tiers = [
  { name: "Starter", price: "[price]", tagline: "For small teams getting started", features: ["Scope 1 and 2 emissions", "Core reporting", "Guidance by email", "Up to [n] users"], cta: "Book a demo", highlight: false },
  { name: "Growth", price: "[price]", tagline: "For teams that need the full picture", features: ["Everything in Starter", "Scope 3 and supplier data", "All frameworks", "Priority guidance", "Up to [n] users"], cta: "Book a demo", highlight: true },
  { name: "Enterprise", price: "Let's talk", tagline: "For larger or multi-site groups", features: ["Everything in Growth", "SSO and permissions", "API access", "Named contact", "Custom onboarding"], cta: "Contact us", highlight: false },
];

const comparison = [
  ["Scope 1 and 2 emissions", true, true, true],
  ["Scope 3 and supplier data", false, true, true],
  ["All frameworks (CSRD, SECR, ISSB)", false, true, true],
  ["Audit trail on every figure", true, true, true],
  ["Guidance from a real person", "Email", "Priority", "Named contact"],
  ["SSO and role-based permissions", false, false, true],
  ["API access", false, false, true],
] as const;

export default function PricingPage() {
  return (
    <>
      <PageHero
        kicker="Pricing"
        title="Simple, fair pricing"
        intro="Plans for small teams through to larger groups, with guidance included on every plan. Prices are placeholders until confirmed."
        trail={[{ label: "Home", href: "/" }, { label: "Pricing" }]}
        secondary={{ label: "Compare plans", href: "#compare" }}
      />

      {/* Tiers */}
      <Section>
        <RevealGroup className="grid gap-5 lg:grid-cols-3">
          {tiers.map((t) => (
            <RevealItem key={t.name}>
              <div className={`card-surface flex h-full flex-col p-7 ${t.highlight ? "border-accent/50 shadow-[var(--shadow-glow)]" : ""}`}>
                {t.highlight && <span className="mb-3 inline-block w-fit rounded-full bg-accent/15 px-3 py-1 font-mono text-[0.65rem] uppercase tracking-wider text-accent-3">Most popular</span>}
                <h2 className="font-display text-xl font-semibold">{t.name}</h2>
                <p className="mt-1 text-sm text-text-muted">{t.tagline}</p>
                <p className="mt-5 font-display text-4xl font-semibold">{t.price}</p>
                <p className="text-sm text-text-muted">{t.price === "Let's talk" ? "custom" : "per month, placeholder"}</p>
                <ul className="mt-6 flex-1 space-y-3">
                  {t.features.map((f) => (
                    <li key={f} className="flex items-start gap-3 text-sm text-text-muted">
                      <span className="mt-0.5 grid h-5 w-5 shrink-0 place-items-center rounded-full bg-[rgba(63,182,168,0.16)] text-[#3fb6a8]"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" className="h-3 w-3"><path d="M5 13l4 4L19 7" /></svg></span>
                      {f}
                    </li>
                  ))}
                </ul>
                <div className="mt-7">
                  <Button href={t.name === "Enterprise" ? "/contact" : "/demo"} variant={t.highlight ? "primary" : "ghost"} className="w-full">{t.cta}</Button>
                </div>
              </div>
            </RevealItem>
          ))}
        </RevealGroup>
        <p className="mt-6 text-center font-mono text-xs text-text-muted/60">Prices and user limits are placeholders. Replace with confirmed figures.</p>
      </Section>

      {/* Comparison table */}
      <Section id="compare" className="section-blend">
        <SectionHead eyebrow="Compare plans" title="What is included" center />
        <Reveal className="mt-10 overflow-x-auto">
          <table className="w-full min-w-[640px] border-collapse text-sm">
            <thead>
              <tr className="border-b border-border text-left">
                <th className="py-4 font-display font-semibold">Feature</th>
                <th className="py-4 text-center font-display font-semibold">Starter</th>
                <th className="py-4 text-center font-display font-semibold">Growth</th>
                <th className="py-4 text-center font-display font-semibold">Enterprise</th>
              </tr>
            </thead>
            <tbody>
              {comparison.map((row) => (
                <tr key={row[0] as string} className="border-b border-border/60">
                  <td className="py-4 text-text-muted">{row[0]}</td>
                  {row.slice(1).map((cell, i) => (
                    <td key={i} className="py-4 text-center">
                      {cell === true ? (
                        <span className="inline-grid h-6 w-6 place-items-center rounded-full bg-[rgba(63,182,168,0.16)] text-[#3fb6a8]"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" className="h-3.5 w-3.5"><path d="M5 13l4 4L19 7" /></svg></span>
                      ) : cell === false ? (
                        <span className="text-text-muted/40">—</span>
                      ) : (
                        <span className="font-mono text-xs text-text">{cell}</span>
                      )}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </Reveal>
      </Section>

      {/* ROI calculator */}
      <Section>
        <SectionHead eyebrow="ROI calculator" title="Estimate the time you could save" intro="Move the sliders to see a rough estimate. All figures are illustrative." center />
        <div className="mt-10"><RoiCalculator /></div>
      </Section>

      {/* Enterprise strip */}
      <Section className="section-blend">
        <Reveal>
          <div className="flex flex-col items-center justify-between gap-6 rounded-2xl border border-border bg-gradient-to-b from-surface to-canvas p-8 text-center sm:flex-row sm:text-left">
            <div>
              <h2 className="font-display text-2xl font-semibold">Need something bigger?</h2>
              <p className="mt-2 text-text-muted">Multi-site groups, custom onboarding, and named support. Let us build the right plan.</p>
            </div>
            <Button href="/contact" size="lg">Talk to us <ArrowRight /></Button>
          </div>
        </Reveal>
      </Section>

      {/* FAQ */}
      <Section>
        <SectionHead eyebrow="Pricing FAQ" title="Common questions" />
        <div className="mt-8">
          <FAQ items={[
            { q: "Why are prices shown as placeholders?", a: "We are finalising plans and want to confirm real figures before publishing them. Book a demo and we will talk you through current pricing." },
            { q: "Is guidance really included?", a: "Yes. Every plan includes access to real people who understand the frameworks. Higher plans get faster, more hands-on support." },
            { q: "Can I change plan later?", a: "Yes. You can move up or down as your needs change." },
            { q: "Do you offer a plan for very small businesses?", a: "Yes. The Starter plan is designed for small teams doing this for the first time." },
          ]} />
        </div>
        <p className="mt-8"><Link href="/login" className="font-mono text-sm text-accent-3 hover:underline">Already a customer? Log in.</Link></p>
      </Section>

      <ClosingCTA title="See it before you decide" intro="Book a short demo and we will show you the platform and talk through the right plan for you." />
    </>
  );
}
