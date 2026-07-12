import type { Metadata } from "next";
import { Reveal } from "@/components/ui/Reveal";
import { INK, BODY, GCrumbs, GPrimaryBtn, GGhostBtn, GH2, GFaq, GreenCTA } from "@/components/platform/greenParts";
import { CEyebrow, ScopeNote } from "@/components/platform/complianceKit";
import { EligibilityChecker, ReportComposer } from "@/components/platform/SecrVisuals";

export const metadata: Metadata = {
  title: "SECR",
  description: "Work out whether SECR applies to you, then assemble the energy and carbon disclosures your directors' report needs.",
  alternates: { canonical: "/platform/secr" },
};

const FAQS: [string, string][] = [
  ["What is SECR?", "Streamlined Energy and Carbon Reporting requires in-scope UK companies and LLPs to disclose their energy use and greenhouse gas emissions in their annual report, alongside an intensity ratio and the energy efficiency actions they have taken."],
  ["Who has to report?", "Quoted companies report regardless of size. Large unquoted companies and LLPs report if they meet at least two of three criteria: turnover of £36m or more, a balance sheet total of £18m or more, or 250 or more employees."],
  ["What if we use very little energy?", "Organisations that consume 40,000 kWh or less over the reporting period may state that in their report rather than making the full disclosures."],
  ["What exactly must be disclosed?", "UK energy use in kWh, Scope 1 and Scope 2 greenhouse gas emissions, at least one intensity ratio, the methodology used, and a narrative on the energy efficiency actions taken in the period. Quoted companies also report global energy use and emissions."],
  ["Is Scope 3 required?", "SECR does not require full Scope 3 reporting. Business travel in vehicles the company owns or leases is captured for unquoted companies. Many organisations report more than the minimum because customers and investors ask for it."],
  ["Where does the disclosure go?", "In the directors' report, or for LLPs the energy and carbon report, for the same financial year as the accounts."],
  ["How does ESGen help?", "ESGen gathers the energy and activity data, applies recognised emission factors, calculates the intensity ratio, and retains the method and source behind each figure so the disclosure can be reviewed."],
];

export default function SecrPage() {
  return (
    <div className="bg-white" style={{ color: BODY }}>
      {/* Hero, centred question, checker beneath */}
      <section className="relative overflow-hidden pt-24 sm:pt-28">
        <div aria-hidden className="pointer-events-none absolute inset-x-0 top-0 h-[480px]" style={{ background: "radial-gradient(110% 90% at 50% 0%, #eef7f1 0%, #f8fbf9 45%, #ffffff 80%)" }} />
        <div className="relative mx-auto max-w-6xl px-5 sm:px-6">
          <GCrumbs last="SECR" />
          <div className="mx-auto mt-8 max-w-2xl text-center">
            <div className="flex justify-center"><CEyebrow>ESG compliance</CEyebrow></div>
            <h1 className="mt-5 font-display text-4xl font-bold leading-[1.05] tracking-tight sm:text-[3.3rem]" style={{ color: INK }}>
              Does SECR apply to you? Find out in ten seconds
            </h1>
            <p className="mx-auto mt-6 max-w-xl text-lg leading-relaxed" style={{ color: BODY }}>
              Then let ESGen gather the energy data, calculate the emissions and intensity ratio, and keep the method behind every figure.
            </p>
            <div className="mt-8 flex flex-wrap justify-center gap-3">
              <GPrimaryBtn href="/demo">Request a demo</GPrimaryBtn>
              <GGhostBtn href="/contact">Talk to our team</GGhostBtn>
            </div>
          </div>
          <div className="mx-auto mt-14 max-w-4xl"><Reveal><EligibilityChecker /></Reveal></div>
          <div className="mx-auto mt-10 max-w-4xl pb-4"><ScopeNote>The checker reflects the published size criteria and is indicative only. Company structure, group membership, and financial year can all affect the answer. Confirm your position with your advisers.</ScopeNote></div>
        </div>
      </section>

      {/* What must be disclosed, composer */}
      <section className="py-16 sm:py-24" style={{ background: "#f8faf9" }}>
        <div className="mx-auto max-w-6xl px-5 sm:px-6">
          <Reveal>
            <div className="max-w-2xl">
              <GH2>Five things the report must contain</GH2>
              <p className="mt-5 text-lg leading-relaxed" style={{ color: BODY }}>
                Energy use, Scope 1 and 2 emissions, an intensity ratio, the method, and what you actually did about it. Toggle each to see the extract assemble.
              </p>
            </div>
          </Reveal>
          <div className="mt-12"><ReportComposer /></div>
        </div>
      </section>

      {/* Intensity ratio explainer, numbered rail */}
      <section className="py-16 sm:py-24">
        <div className="mx-auto max-w-6xl px-5 sm:px-6">
          <Reveal><GH2>An intensity ratio makes the number comparable</GH2></Reveal>
          <div className="mt-10 grid gap-5 sm:grid-cols-3">
            {[
              ["Per £m of turnover", "The most common choice, and the easiest for readers of the accounts to interpret."],
              ["Per full-time employee", "Useful for service organisations where headcount drives energy use more than revenue."],
              ["Per unit of production", "Suits manufacturers, where output volume is the honest denominator."],
            ].map(([t, d], i) => (
              <Reveal key={t}>
                <div className="h-full rounded-2xl border border-[#e6ece7] p-6">
                  <span className="font-mono text-[0.7rem] font-bold" style={{ color: "#9aa5a0" }}>0{i + 1}</span>
                  <h3 className="mt-3 font-display text-base font-bold" style={{ color: INK }}>{t}</h3>
                  <p className="mt-2 text-[0.86rem] leading-relaxed" style={{ color: BODY }}>{d}</p>
                </div>
              </Reveal>
            ))}
          </div>
          <p className="mt-6 text-[0.82rem]" style={{ color: BODY }}>You must report at least one. Reporting the same ratio year on year is what makes the trend meaningful.</p>
        </div>
      </section>


      <section className="py-16 sm:py-24">
        <div className="mx-auto max-w-6xl px-5 sm:px-6">
          <GH2>Questions about SECR</GH2>
          <div className="mt-10"><GFaq items={FAQS} /></div>
        </div>
      </section>

      <GreenCTA title="Start your journey now" intro="See how ESGen turns meter readings and fuel records into a SECR disclosure you can sign off." />
    </div>
  );
}
