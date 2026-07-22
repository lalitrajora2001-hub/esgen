import type { Metadata } from "next";
import { Section } from "@/components/ui/Section";
import { Reveal } from "@/components/ui/Reveal";
import { DemoForm } from "@/components/forms/DemoForm";
import { RBreadcrumb } from "@/components/resources/light";

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
    <div className="bg-white">
      <section className="relative overflow-hidden pt-28 pb-6 sm:pt-36">
        <div aria-hidden className="pointer-events-none absolute inset-0" style={{ background: "radial-gradient(900px 460px at 30% -10%, rgba(16,19,24,0.05), transparent 60%)" }} />
        <div className="relative mx-auto max-w-6xl px-5 sm:px-6">
          <RBreadcrumb trail={[{ label: "Home", href: "/" }, { label: "Book a demo" }]} />
          <div className="max-w-2xl">
            <h1 className="text-balance font-display text-4xl font-bold leading-[1.05] tracking-tight text-[#101318] sm:text-5xl">See ESGen against your own reporting</h1>
            <p className="mt-5 max-w-xl text-lg text-[#565d68]">Tell us what you report to and we will build the walkthrough around it. Thirty minutes, tailored, no obligation.</p>
          </div>
        </div>
      </section>

      <Section size="sm">
        <div className="grid gap-12 lg:grid-cols-[1fr_1.15fr] lg:items-start">
          <div>
            <Reveal>
              <h2 className="font-display text-2xl font-bold tracking-tight text-[#101318] sm:text-3xl">What to expect</h2>
            </Reveal>
            <ol className="relative mt-8">
              <div aria-hidden className="absolute bottom-4 left-[19px] top-3 w-px bg-[#e6e8ec]" />
              {STEPS.map(([t, d], i) => (
                <Reveal key={t}>
                  <li className="relative flex gap-5 pb-8 last:pb-0">
                    <span className="relative z-10 grid h-10 w-10 shrink-0 place-items-center rounded-full border border-[#e6e8ec] bg-[#f6f7f9] font-display text-sm font-bold text-[#101318]">{i + 1}</span>
                    <div className="pt-1.5">
                      <h3 className="font-display text-lg font-semibold text-[#101318]">{t}</h3>
                      <p className="mt-1.5 text-sm leading-relaxed text-[#565d68]">{d}</p>
                    </div>
                  </li>
                </Reveal>
              ))}
            </ol>
            <div className="mt-4 rounded-2xl border border-[#e6e8ec] bg-[#f6f7f9] p-5">
              <p className="text-sm text-[#565d68]">Not ready for a demo? <a href="/contact" className="font-semibold text-[#101318] hover:underline">Ask us anything by email</a> and we will get back to you.</p>
            </div>
          </div>

          <Reveal>
            <div className="rounded-3xl border border-[#e6e8ec] bg-white p-6 shadow-[0_24px_60px_-40px_rgba(15,23,42,0.45)] sm:p-8">
              <h2 className="mb-6 font-display text-xl font-bold tracking-tight text-[#101318]">Request a demo</h2>
              <DemoForm />
            </div>
          </Reveal>
        </div>
      </Section>
    </div>
  );
}
