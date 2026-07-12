import type { Metadata } from "next";
import { Reveal } from "@/components/ui/Reveal";
import { INK, BODY, GREENDK, GCrumbs, GPrimaryBtn, GGhostBtn, GH2, GFaq, GreenCTA } from "@/components/platform/greenParts";
import { CEyebrow, FactStrip, ScopeNote } from "@/components/platform/complianceKit";
import { DisclosureMapper, ScenarioExposure } from "@/components/platform/UkSrsVisuals";

export const metadata: Metadata = {
  title: "UK SRS",
  description: "Prepare structured reporting evidence against UK SRS S1 and S2, with every disclosure traceable to its source data.",
  alternates: { canonical: "/platform/uk-srs" },
};

const FACTS: [string, string][] = [
  ["Built on IFRS S1 and S2", "The UK Sustainability Reporting Standards are based on the ISSB's IFRS S1 and S2, with UK-specific amendments."],
  ["General and climate", "S1 covers sustainability-related financial information. S2 covers climate, including gross Scope 1, 2 and 3 emissions."],
  ["Connected to the accounts", "Disclosures are intended to sit alongside financial reporting, using the same reporting period and boundary."],
];

const FAQS: [string, string][] = [
  ["What are the UK SRS?", "The UK Sustainability Reporting Standards set out how companies disclose sustainability-related risks and opportunities. They are based on the ISSB's IFRS S1 and S2, with amendments made for the UK context."],
  ["How do S1 and S2 differ?", "S1 sets the general requirements: governance, strategy, risk management, and metrics for any sustainability-related risk or opportunity. S2 is climate-specific and adds requirements such as gross Scope 1, 2 and 3 emissions and climate resilience analysis."],
  ["Do we need Scope 3 emissions?", "S2 requires disclosure of gross Scope 3 emissions, alongside Scopes 1 and 2. In practice this is the hardest data to gather, because much of it sits with your suppliers rather than in your own systems."],
  ["What does climate resilience analysis involve?", "Assessing how the business would fare under different warming pathways, and stating the assumptions behind each scenario. The standard asks you to explain your approach, not to reach a particular conclusion."],
  ["How does ESGen help?", "ESGen collects your activity data, applies recognised emission factors, and retains the calculation and its source against each figure. That produces structured evidence you and your assurance provider can review."],
  ["Does using ESGen make us compliant?", "No software can make an organisation compliant on its own. ESGen supports the reporting workflow and helps you prepare structured, traceable evidence. Responsibility for the disclosures remains with the company and its board."],
];

export default function UkSrsPage() {
  return (
    <div className="bg-white" style={{ color: BODY }}>
      {/* Hero — asymmetric, evidence-led */}
      <section className="relative overflow-hidden pt-24 sm:pt-28">
        <div aria-hidden className="pointer-events-none absolute inset-x-0 top-0 h-[460px]" style={{ background: "linear-gradient(180deg,#f5faf7,#ffffff 70%)" }} />
        <div className="relative mx-auto max-w-6xl px-5 sm:px-6">
          <GCrumbs last="UK SRS" />
          <div className="mt-8 grid gap-10 lg:grid-cols-[1.05fr_0.95fr] lg:items-end">
            <div>
              <CEyebrow>ESG compliance</CEyebrow>
              <h1 className="mt-4 font-display text-4xl font-bold leading-[1.05] tracking-tight sm:text-5xl" style={{ color: INK }}>
                Every UK SRS disclosure, traceable to its source
              </h1>
              <p className="mt-6 max-w-lg text-lg leading-relaxed" style={{ color: BODY }}>
                Connect your GHG Protocol data to UK SRS S1 and S2 disclosures, so each figure you publish carries the activity data, method, and factor behind it.
              </p>
              <div className="mt-8 flex flex-wrap gap-3">
                <GPrimaryBtn href="/demo">Request a demo</GPrimaryBtn>
                <GGhostBtn href="/contact">Talk to our team</GGhostBtn>
              </div>
            </div>
            <Reveal className="min-w-0"><ScenarioExposure /></Reveal>
          </div>
          <div className="mt-14 pb-4"><ScopeNote>The UK SRS were published as UK-endorsed versions of IFRS S1 and S2. Whether and when they apply to your organisation depends on decisions taken by the UK government and the FCA. We can help you prepare, but you should confirm your own reporting obligations.</ScopeNote></div>
        </div>
      </section>

      {/* Facts */}
      <section className="py-14 sm:py-20">
        <div className="mx-auto max-w-6xl px-5 sm:px-6">
          <Reveal><FactStrip items={FACTS} /></Reveal>
        </div>
      </section>

      {/* Disclosure mapper — the signature visual */}
      <section className="py-16 sm:py-24" style={{ background: "#f8faf9" }}>
        <div className="mx-auto max-w-6xl px-5 sm:px-6">
          <Reveal>
            <div className="max-w-2xl">
              <GH2>From requirement to evidence, in one view</GH2>
              <p className="mt-5 text-lg leading-relaxed" style={{ color: BODY }}>
                Each S1 and S2 requirement is mapped to the data that answers it. When an assurance provider asks where a number came from, the answer is already attached to it.
              </p>
            </div>
          </Reveal>
          <div className="mt-12"><DisclosureMapper /></div>
        </div>
      </section>

      {/* Scope 3 */}
      <section className="py-16 sm:py-24">
        <div className="mx-auto grid max-w-6xl gap-12 px-5 sm:px-6 lg:grid-cols-2 lg:items-start">
          <Reveal>
            <GH2>Close the Scope 3 gap with primary data</GH2>
            <p className="mt-5 max-w-lg text-lg leading-relaxed" style={{ color: BODY }}>
              S2 asks for gross Scope 3 emissions. Most of that data sits with your suppliers. ESGen collects it from them directly, so spend-based estimates can be replaced with figures that reflect your actual value chain.
            </p>
          </Reveal>
          <Reveal>
            <ol className="space-y-4">
              {[
                ["Start from what you have", "Spend-based estimates give you a first complete picture and show where the material categories are."],
                ["Ask the suppliers that matter", "Target the categories carrying most of the footprint rather than surveying everyone at once."],
                ["Replace estimates with evidence", "As primary data arrives, it displaces the estimate and the change is recorded against the figure."],
              ].map(([t, d], i) => (
                <li key={t} className="flex gap-4 rounded-xl border border-[#e6ece7] bg-white p-4">
                  <span className="grid h-8 w-8 shrink-0 place-items-center rounded-full font-mono text-[0.7rem] font-bold text-white" style={{ background: "#0d1411" }}>{i + 1}</span>
                  <div>
                    <h3 className="font-display text-[0.95rem] font-bold" style={{ color: INK }}>{t}</h3>
                    <p className="mt-1 text-[0.84rem] leading-relaxed" style={{ color: BODY }}>{d}</p>
                  </div>
                </li>
              ))}
            </ol>
          </Reveal>
        </div>
      </section>


      {/* FAQ */}
      <section className="py-16 sm:py-24">
        <div className="mx-auto max-w-6xl px-5 sm:px-6">
          <GH2>Questions about UK SRS</GH2>
          <div className="mt-10"><GFaq items={FAQS} /></div>
          <p className="mt-8 text-[0.8rem]" style={{ color: GREENDK }}>Need something more specific? Get in touch with our team.</p>
        </div>
      </section>

      <GreenCTA title="Start your journey now" intro="See how ESGen turns your activity data into UK SRS disclosures you can stand behind." />
    </div>
  );
}
