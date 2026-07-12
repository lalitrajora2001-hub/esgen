import type { Metadata } from "next";
import { Reveal } from "@/components/ui/Reveal";
import { INK, BODY, GCrumbs, GPrimaryBtn, GGhostBtn, GH2, GFaq, GreenCTA } from "@/components/platform/greenParts";
import { CEyebrow, ScopeNote } from "@/components/platform/complianceKit";
import { MaterialityMatrix, EsrsCoverage } from "@/components/platform/CsrdVisuals";

export const metadata: Metadata = {
  title: "CSRD",
  description: "Run a double materiality assessment and prepare structured ESRS reporting evidence, with every datapoint traceable to its source.",
  alternates: { canonical: "/platform/csrd" },
};

const FAQS: [string, string][] = [
  ["What is the CSRD?", "The Corporate Sustainability Reporting Directive is EU law requiring in-scope companies to report sustainability information using the European Sustainability Reporting Standards (ESRS), with the information subject to assurance."],
  ["What is double materiality?", "Two tests applied to every sustainability topic. Impact materiality asks how your business affects people and the environment. Financial materiality asks how the topic affects your own financial position, performance, and cash flows. A topic is material if it passes either test."],
  ["Which standards would we report against?", "ESRS 2, the general disclosures, applies to every undertaking in scope. The topical standards — E1 to E5, S1 to S4, and G1 — apply where your materiality assessment finds the topic material."],
  ["Does the CSRD apply to UK companies?", "It can. Scope depends on factors such as EU turnover, whether you have a large EU subsidiary, and securities listed on an EU regulated market. The scope and timing have also been subject to change through the EU's Omnibus proposals, so you should confirm your position rather than assume it."],
  ["What does assurance mean here?", "The sustainability statement is subject to an assurance engagement. In practice that means an assurance provider will want to see the source data, the method, and the trail behind each figure, not just the final number."],
  ["How does ESGen help?", "ESGen structures the materiality assessment, holds the underlying data against each disclosure, and retains the calculation and its source. That produces the evidence base your assurance provider will ask for. Responsibility for the statement remains with the company."],
];

export default function CsrdPage() {
  return (
    <div className="bg-white" style={{ color: BODY }}>
      {/* Hero — matrix leads, text supports */}
      <section className="relative overflow-hidden pt-24 sm:pt-28">
        <div aria-hidden className="pointer-events-none absolute inset-x-0 top-0 h-[420px]" style={{ background: "linear-gradient(180deg,#f5faf7,#ffffff 75%)" }} />
        <div className="relative mx-auto max-w-6xl px-5 sm:px-6">
          <GCrumbs last="CSRD" />
          <div className="mt-8 max-w-3xl">
            <CEyebrow>ESG compliance</CEyebrow>
            <h1 className="mt-4 font-display text-4xl font-bold leading-[1.05] tracking-tight sm:text-5xl" style={{ color: INK }}>
              Start where the CSRD starts: double materiality
            </h1>
            <p className="mt-6 max-w-xl text-lg leading-relaxed" style={{ color: BODY }}>
              Two tests decide what you report. ESGen helps you run the assessment, evidence the outcome, and carry it through to a structured ESRS sustainability statement.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <GPrimaryBtn href="/demo">Request a demo</GPrimaryBtn>
              <GGhostBtn href="/contact">Talk to our team</GGhostBtn>
            </div>
          </div>
          <div className="mt-14"><Reveal><MaterialityMatrix /></Reveal></div>
          <div className="mt-10 pb-4"><ScopeNote>CSRD scope and timing have been amended through the EU&rsquo;s Omnibus process. Whether the directive applies to your organisation, and from which financial year, depends on your own circumstances. We can help you prepare; confirm your obligations with your advisers.</ScopeNote></div>
        </div>
      </section>

      {/* Two tests explained — asymmetric split */}
      <section className="py-16 sm:py-24" style={{ background: "#f8faf9" }}>
        <div className="mx-auto max-w-6xl px-5 sm:px-6">
          <Reveal><GH2>One topic, two questions</GH2></Reveal>
          <div className="mt-10 grid gap-5 lg:grid-cols-2">
            {[
              { t: "Impact materiality", q: "How does the business affect people and the environment?", d: "Considers actual and potential impacts, negative and positive, across your own operations and your value chain, over the short, medium, and long term.", tone: "dark" },
              { t: "Financial materiality", q: "How does the topic affect the business?", d: "Considers risks and opportunities that could reasonably affect your financial position, performance, cash flows, access to finance, or cost of capital.", tone: "light" },
            ].map((c) => (
              <Reveal key={c.t}>
                <div className="flex h-full flex-col rounded-2xl p-7" style={{ background: c.tone === "dark" ? "#0d1411" : "#ffffff", border: c.tone === "dark" ? "none" : "1px solid #e6ece7" }}>
                  <span className="text-[0.66rem] font-bold uppercase tracking-[0.14em]" style={{ color: c.tone === "dark" ? "#4ade80" : "#15803d" }}>{c.t}</span>
                  <h3 className="mt-4 font-display text-2xl font-bold leading-tight" style={{ color: c.tone === "dark" ? "#fff" : INK }}>{c.q}</h3>
                  <p className="mt-4 text-[0.92rem] leading-relaxed" style={{ color: c.tone === "dark" ? "rgba(255,255,255,0.68)" : BODY }}>{c.d}</p>
                  <p className="mt-auto pt-6 text-[0.78rem] font-semibold" style={{ color: c.tone === "dark" ? "rgba(255,255,255,0.5)" : "#9aa5a0" }}>Pass either test and the topic is material.</p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ESRS coverage */}
      <section className="py-16 sm:py-24">
        <div className="mx-auto grid max-w-6xl gap-12 px-5 sm:px-6 lg:grid-cols-[0.85fr_1.15fr] lg:items-center">
          <Reveal>
            <GH2>The standards follow the assessment</GH2>
            <p className="mt-5 max-w-md text-lg leading-relaxed" style={{ color: BODY }}>
              You do not report everything. ESRS 2 always applies; the topical standards apply where the assessment says they do. Where a topic is not material, you explain why.
            </p>
          </Reveal>
          <Reveal><EsrsCoverage /></Reveal>
        </div>
      </section>

      {/* Evidence for assurance */}
      <section className="py-16 sm:py-24" style={{ background: "#f8faf9" }}>
        <div className="mx-auto max-w-6xl px-5 sm:px-6">
          <Reveal><div className="max-w-2xl"><GH2>Built for the assurance conversation</GH2>
            <p className="mt-5 text-lg leading-relaxed" style={{ color: BODY }}>The sustainability statement is assured. Your assurance provider will ask where each figure came from — so ESGen keeps the answer attached to it.</p></div></Reveal>
          <div className="mt-12 grid gap-px overflow-hidden rounded-2xl border border-[#e6ece7] bg-[#e6ece7] sm:grid-cols-3">
            {[
              ["The assessment itself", "How topics were scored, who was consulted, and why each conclusion was reached."],
              ["The datapoints behind it", "Activity data, emission factors, and the calculation performed for every disclosed figure."],
              ["The changes since", "A record of what moved, when, and why, so restatements can be explained rather than discovered."],
            ].map(([t, d]) => (
              <div key={t} className="bg-white p-6">
                <h3 className="font-display text-base font-bold" style={{ color: INK }}>{t}</h3>
                <p className="mt-2 text-[0.86rem] leading-relaxed" style={{ color: BODY }}>{d}</p>
              </div>
            ))}
          </div>
        </div>
      </section>


      <section className="pb-16 sm:pb-24">
        <div className="mx-auto max-w-6xl px-5 sm:px-6">
          <GH2>Questions about the CSRD</GH2>
          <div className="mt-10"><GFaq items={FAQS} /></div>
        </div>
      </section>

      <GreenCTA title="Start your journey now" intro="See how ESGen turns a double materiality assessment into a structured ESRS evidence base." />
    </div>
  );
}
