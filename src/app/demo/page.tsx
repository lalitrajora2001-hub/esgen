import type { Metadata } from "next";
import { Breadcrumb } from "@/components/sections/blocks";
import { Section } from "@/components/ui/Section";
import { DemoForm } from "@/components/forms/DemoForm";

export const metadata: Metadata = {
  title: "Book a Demo",
  description: "See ESGen in action. Request a demo tailored to your carbon accounting and ESG reporting needs.",
};

const STEPS: [string, string][] = [
  ["A short conversation", "We start by understanding your reporting obligations and how you are structured, not by pitching features you do not need."],
  ["A tailored walkthrough", "We show the platform against a scenario that fits your business, using the frameworks that actually apply to you."],
  ["Honest next steps", "Practical advice on where ESGen fits and where it does not, with no obligation and no pressure."],
];

export default function DemoPage() {
  return (
    <>
      {/* Hero */}
      <section className="relative overflow-hidden pt-28 pb-6 sm:pt-36">
        <div aria-hidden className="pointer-events-none absolute inset-0" style={{ background: "radial-gradient(900px 460px at 30% -10%, rgba(77,139,245,0.16), transparent 60%)" }} />
        <div className="grid-texture pointer-events-none absolute inset-0 opacity-60" aria-hidden />
        <div className="relative mx-auto max-w-6xl px-5 sm:px-6">
          <Breadcrumb trail={[{ label: "Home", href: "/" }, { label: "Book a demo" }]} />
          <div className="max-w-2xl">
            <h1 className="text-balance text-4xl font-semibold leading-[1.05] sm:text-5xl">See ESGen against your own reporting</h1>
            <p className="mt-5 max-w-xl text-lg text-text-muted">Tell us what you report to and we will build the walkthrough around it. Thirty minutes, tailored, no obligation.</p>
          </div>
        </div>
      </section>

      <Section size="sm">
        <div className="grid gap-12 lg:grid-cols-[1fr_1.15fr] lg:items-start">
          {/* What to expect, connected timeline */}
          <div>
            <h2 className="text-2xl font-semibold sm:text-3xl">What to expect</h2>
            <ol className="relative mt-8">
              <div aria-hidden className="absolute bottom-4 left-[19px] top-3 w-px bg-border" />
              {STEPS.map(([t, d], i) => (
                <li key={t} className="relative flex gap-5 pb-8 last:pb-0">
                  <span className="relative z-10 grid h-10 w-10 shrink-0 place-items-center rounded-full border border-accent/25 bg-accent/10 font-display text-sm font-bold text-accent-3">{i + 1}</span>
                  <div className="pt-1.5">
                    <h3 className="font-display text-lg font-semibold text-white">{t}</h3>
                    <p className="mt-1.5 text-sm leading-relaxed text-text-muted">{d}</p>
                  </div>
                </li>
              ))}
            </ol>
            <div className="mt-4 rounded-2xl border border-border bg-surface p-5">
              <p className="text-sm text-text-muted">Not ready for a demo? <a href="/contact" className="text-accent-3 hover:underline">Ask us anything by email</a> and we will get back to you.</p>
            </div>
          </div>

          {/* Form */}
          <div className="rounded-3xl border border-border bg-surface p-6 shadow-float sm:p-8">
            <h2 className="mb-6 font-display text-xl font-semibold">Request a demo</h2>
            <DemoForm />
          </div>
        </div>
      </Section>
    </>
  );
}
