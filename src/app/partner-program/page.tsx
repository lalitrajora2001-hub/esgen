import type { Metadata } from "next";
import { Section, SectionHead } from "@/components/ui/Section";
import { Reveal } from "@/components/ui/Reveal";
import { Breadcrumb, CTASection } from "@/components/sections/blocks";
import { Button, ArrowRight } from "@/components/ui/Button";
import { TierSelector, PracticeModel } from "@/components/partner/PartnerVisuals";

export const metadata: Metadata = {
  title: "Partner Program",
  description: "Build a sustainability practice on ESGen. Refer, deliver, or white-label, the program grows with you.",
};

const FEATURES: [string, string][] = [
  ["Consultant workspace", "Work across all your clients from one place, with each engagement kept separate and secure."],
  ["White-labelled output", "At the top tier, deliver reporting under your own brand rather than ours."],
  ["Deal registration", "Register opportunities and earn referral commission on the ones that close."],
  ["Reusable templates", "Standardise your methodology once and apply it across every client you onboard."],
  ["Priority support", "A faster line to our team when a client deadline is on the horizon."],
  ["Partner directory", "Certified partners are listed where prospective clients look for delivery help."],
];

const STEPS: [string, string][] = [
  ["Apply", "Tell us about your practice and the clients you serve. We will match you to the right entry tier."],
  ["Get certified", "Your team completes product training and delivers a first engagement with our support."],
  ["Grow your practice", "Add clients, deepen engagements, and move up the tiers as your book grows."],
];

const WHY: [string, string][] = [
  ["Reporting is recurring, not one-off", "Frameworks report annually and obligations expand. A client measured once is a client you serve every year."],
  ["Manual reporting caps your growth", "Spreadsheet-based delivery does not scale past a handful of clients. A platform is what lets a small team serve many."],
  ["Your methodology, kept consistent", "Templates and a shared factor database mean every consultant delivers to the same standard, whoever picks up the work."],
];

export default function PartnerProgramPage() {
  return (
    <>
      {/* Hero */}
      <section className="relative overflow-hidden pt-28 pb-10 sm:pt-36">
        <div aria-hidden className="pointer-events-none absolute inset-0" style={{ background: "radial-gradient(900px 480px at 70% -10%, rgba(77,139,245,0.16), transparent 60%)" }} />
        <div className="grid-texture pointer-events-none absolute inset-0 opacity-60" aria-hidden />
        <div className="relative mx-auto max-w-6xl px-5 sm:px-6">
          <Breadcrumb trail={[{ label: "Home", href: "/" }, { label: "Partner Program" }]} />
          <div className="max-w-2xl">
            <h1 className="text-balance text-4xl font-semibold leading-[1.05] sm:text-5xl">Build a sustainability practice on ESGen</h1>
            <p className="mt-5 max-w-xl text-lg text-text-muted">Whether you refer clients, deliver engagements, or want to run your whole practice on the platform, the program grows with you.</p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Button href="/contact" size="lg">Become a partner <ArrowRight /></Button>
              <Button href="/demo" variant="ghost" size="lg">See the platform</Button>
            </div>
          </div>
        </div>
      </section>

      {/* Tier selector */}
      <Section size="sm">
        <SectionHead title="Three tiers, each building on the last" intro="Start by referring, grow into delivering, and, when you are ready, run your practice on ESGen under your own brand." />
        <div className="mt-10"><Reveal><TierSelector /></Reveal></div>
      </Section>

      {/* Why partner */}
      <Section className="section-blend">
        <SectionHead title="Why build on a platform at all" center />
        <div className="mt-12 grid gap-5 lg:grid-cols-3">
          {WHY.map(([t, d], i) => (
            <Reveal key={t}>
              <div className="card h-full p-6" style={{ transitionDelay: `${i * 40}ms` }}>
                <h3 className="font-display text-lg font-semibold">{t}</h3>
                <p className="mt-2 text-sm leading-relaxed text-text-muted">{d}</p>
              </div>
            </Reveal>
          ))}
        </div>
      </Section>

      {/* Practice model */}
      <Section>
        <div className="grid gap-12 lg:grid-cols-[0.85fr_1.15fr] lg:items-center">
          <Reveal>
            <SectionHead title="See how the relationships work" />
            <p className="mt-4 text-text-muted">Deeper engagements tend to mean broader platform use and stronger retention. Move the inputs to see how the shape changes.</p>
          </Reveal>
          <Reveal><PracticeModel /></Reveal>
        </div>
      </Section>

      {/* What partners get */}
      <Section className="section-blend">
        <SectionHead title="What partners get" />
        <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {FEATURES.map((f, i) => (
            <Reveal key={f[0]}>
              <div className="card h-full p-6" style={{ transitionDelay: `${i * 30}ms` }}>
                <div className="grid h-9 w-9 place-items-center rounded-xl border border-accent/25 bg-accent/10 font-mono text-sm font-bold text-accent-3">{String(i + 1).padStart(2, "0")}</div>
                <h3 className="mt-4 font-display text-lg font-semibold">{f[0]}</h3>
                <p className="mt-2 text-sm text-text-muted">{f[1]}</p>
              </div>
            </Reveal>
          ))}
        </div>
      </Section>

      {/* How to join */}
      <Section>
        <SectionHead title="How to join" center />
        <div className="mt-12 grid gap-5 sm:grid-cols-3">
          {STEPS.map(([t, d], i) => (
            <Reveal key={t}>
              <div className="relative h-full rounded-2xl border border-border bg-surface p-6" style={{ transitionDelay: `${i * 50}ms` }}>
                <span className="grid h-11 w-11 place-items-center rounded-full border border-accent/25 bg-accent/10 font-display text-lg font-bold text-accent-3">{i + 1}</span>
                <h3 className="mt-4 font-display text-lg font-semibold">{t}</h3>
                <p className="mt-2 text-sm leading-relaxed text-text-muted">{d}</p>
              </div>
            </Reveal>
          ))}
        </div>
      </Section>

      <CTASection title="Ready to grow your practice with ESGen?" intro="Tell us about your firm and the clients you serve, and we will find the right way to work together." primary={{ label: "Become a partner", href: "/contact" }} secondary={{ label: "Book a demo", href: "/demo" }} />
    </>
  );
}
