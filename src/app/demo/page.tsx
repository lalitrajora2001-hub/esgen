import type { Metadata } from "next";
import { PageHero, Check } from "@/components/sections/blocks";
import { Section } from "@/components/ui/Section";
import { DemoForm } from "@/components/forms/DemoForm";

export const metadata: Metadata = {
  title: "Book a Demo",
  description: "See ESGen in action. Request a demo tailored to your carbon accounting and ESG reporting needs.",
};

const expect = [
  ["A quick conversation", "We start by understanding your reporting needs, not by pitching."],
  ["A tailored walkthrough", "We show the platform using a scenario that fits your business."],
  ["Clear next steps", "Practical advice on where ESGen fits, with no obligation."],
];

export default function DemoPage() {
  return (
    <>
      <PageHero
        kicker="Book a demo"
        title="See ESGen in action"
        intro="Request a demo and we will tailor it to your carbon accounting and ESG reporting needs."
        trail={[{ label: "Home", href: "/" }, { label: "Book a demo" }]}
        primary={{ label: "Talk to us", href: "/contact" }}
        secondary={{ label: "See pricing", href: "/pricing" }}
      />
      <Section>
        <div className="grid gap-12 lg:grid-cols-[1fr_1.2fr]">
          <div>
            <h2 className="text-2xl font-semibold sm:text-3xl">What to expect</h2>
            <ul className="mt-6 space-y-4">
              {expect.map(([t, d]) => (
                <li key={t} className="flex gap-4">
                  <Check />
                  <span>
                    <span className="block font-display font-semibold text-white">{t}</span>
                    <span className="block text-sm text-text-muted">{d}</span>
                  </span>
                </li>
              ))}
            </ul>
          </div>
          <div className="card p-6 sm:p-8">
            <h2 className="mb-6 font-display text-xl font-semibold">Request a demo</h2>
            <DemoForm />
          </div>
        </div>
      </Section>
    </>
  );
}
