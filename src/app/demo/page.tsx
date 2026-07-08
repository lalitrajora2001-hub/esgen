import type { Metadata } from "next";
import { PageHero } from "@/components/templates/shared";
import { Section } from "@/components/ui/Section";
import { DemoForm } from "@/components/forms/DemoForm";

export const metadata: Metadata = {
  title: "Book a demo",
  description: "See ESGen in action. Book a short, no-pressure walkthrough tailored to your kind of business.",
};

export default function DemoPage() {
  return (
    <>
      <PageHero
        kicker="Book a demo"
        title="See ESGen in action"
        intro="A short, no-pressure walkthrough tailored to your kind of business. We will show you the platform and be honest about whether it is the right fit."
        trail={[{ label: "Home", href: "/" }, { label: "Book a demo" }]}
        primary={{ label: "Talk to us", href: "/contact" }}
        secondary={{ label: "See pricing", href: "/pricing" }}
      />
      <Section>
        <div className="grid gap-12 lg:grid-cols-[1fr_1.2fr]">
          <div>
            <h2 className="text-2xl font-semibold sm:text-3xl">What to expect</h2>
            <ul className="mt-6 space-y-4">
              {[
                ["A quick chat", "We start by understanding your situation, not by pitching."],
                ["A live tour", "We walk through the platform using a scenario that fits your business."],
                ["Honest advice", "We tell you plainly whether ESGen is right for you, and what it would take."],
                ["Next steps", "No obligation. You decide if and when to go further."],
              ].map(([t, d]) => (
                <li key={t} className="flex gap-4">
                  <span className="mt-0.5 grid h-7 w-7 shrink-0 place-items-center rounded-full bg-[rgba(63,182,168,0.16)] text-[#3fb6a8]">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" className="h-4 w-4"><path d="M5 13l4 4L19 7" /></svg>
                  </span>
                  <span>
                    <span className="block font-display font-semibold text-text">{t}</span>
                    <span className="block text-sm text-text-muted">{d}</span>
                  </span>
                </li>
              ))}
            </ul>
          </div>
          <div className="card-surface p-6 sm:p-8">
            <h2 className="mb-6 font-display text-xl font-semibold">Choose a time</h2>
            <DemoForm />
          </div>
        </div>
      </Section>
    </>
  );
}
