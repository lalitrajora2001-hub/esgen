import type { Metadata } from "next";
import { Reveal } from "@/components/ui/Reveal";
import { INK, BODY, GCrumbs, GPrimaryBtn, GGhostBtn, GH2, GFaq, GreenCTA } from "@/components/platform/greenParts";
import { CEyebrow, FrameworkWall, ScopeNote } from "@/components/platform/complianceKit";
import { ModuleSelector } from "@/components/platform/VsmeVisuals";

export const metadata: Metadata = {
  title: "VSME",
  description: "Report proportionately with the voluntary standard for small and medium-sized undertakings, and answer customer questionnaires once.",
  alternates: { canonical: "/platform/vsme" },
};

const FAQS: [string, string][] = [
  ["What is the VSME?", "A voluntary sustainability reporting standard developed by EFRAG for small and medium-sized undertakings that are not in scope of the CSRD but are asked for sustainability information anyway."],
  ["Why would we report if it is voluntary?", "Because your customers, banks, and insurers ask. The VSME gives a single, proportionate structure to answer with, instead of completing a different bespoke questionnaire for every counterparty."],
  ["What is the difference between the modules?", "The Basic module is the starting point and stands alone. The Comprehensive module builds on it with additional disclosures — targets, climate risks, human rights processes, and governance diversity — for undertakings whose stakeholders need more."],
  ["Which module should we choose?", "Start with Basic unless a specific counterparty has asked for information that only the Comprehensive module covers. Reporting more than you can evidence is worse than reporting less."],
  ["Is the VSME the same as the CSRD?", "No. The CSRD is law for undertakings in its scope and requires the full ESRS with assurance. The VSME is voluntary and deliberately lighter, designed so that value-chain requests can be answered proportionately."],
  ["How does ESGen help?", "ESGen gathers the energy, emissions, workforce, and waste data the disclosures ask for, keeps the source behind each figure, and lets you reuse the same evidence when the next questionnaire arrives."],
];

export default function VsmePage() {
  return (
    <div className="bg-white" style={{ color: BODY }}>
      {/* Hero — statement led, wide selector below */}
      <section className="relative overflow-hidden pt-24 sm:pt-28">
        <div aria-hidden className="pointer-events-none absolute inset-x-0 top-0 h-[440px]" style={{ background: "radial-gradient(110% 90% at 50% 0%, #eef7f1 0%, #f8fbf9 45%, #ffffff 80%)" }} />
        <div className="relative mx-auto max-w-6xl px-5 sm:px-6">
          <GCrumbs last="VSME" />
          <div className="mx-auto mt-8 max-w-2xl text-center">
            <div className="flex justify-center"><CEyebrow>ESG compliance</CEyebrow></div>
            <h1 className="mt-5 font-display text-4xl font-bold leading-[1.05] tracking-tight sm:text-[3.3rem]" style={{ color: INK }}>
              Answer once, not once per customer
            </h1>
            <p className="mx-auto mt-6 max-w-xl text-lg leading-relaxed" style={{ color: BODY }}>
              You are not in scope of the CSRD, but your customers are — and their questions land on you. The VSME gives you one proportionate structure to answer with.
            </p>
            <div className="mt-8 flex flex-wrap justify-center gap-3">
              <GPrimaryBtn href="/demo">Request a demo</GPrimaryBtn>
              <GGhostBtn href="/contact">Talk to our team</GGhostBtn>
            </div>
          </div>
          <div className="mt-14"><Reveal><ModuleSelector /></Reveal></div>
          <div className="mt-10 pb-4"><ScopeNote>The VSME is a voluntary standard published by EFRAG. It does not replace any legal reporting obligation you may have. Where a counterparty specifies a different framework, that request governs.</ScopeNote></div>
        </div>
      </section>

      {/* The trickle-down problem — offset editorial */}
      <section className="py-16 sm:py-24">
        <div className="mx-auto max-w-6xl px-5 sm:px-6">
          <div className="grid gap-12 lg:grid-cols-[1fr_1fr] lg:items-start">
            <Reveal>
              <GH2>The reporting burden rolls downhill</GH2>
              <p className="mt-5 text-lg leading-relaxed" style={{ color: BODY }}>
                A large customer has to disclose its value-chain emissions. That means asking you. So does the next one, in a different format, on a different deadline, with a different spreadsheet.
              </p>
              <p className="mt-4 text-lg leading-relaxed" style={{ color: BODY }}>
                The VSME exists so that you can answer all of them from one dataset, prepared once, at a level of detail proportionate to your size.
              </p>
            </Reveal>
            <Reveal>
              <div className="space-y-3">
                {[
                  ["Your customer's CSRD obligation", "Value-chain emissions must be disclosed, so primary data is requested from suppliers."],
                  ["Their bank's expectations", "Financed-emissions reporting pushes the same questions through lending relationships."],
                  ["Their own customers", "The request propagates, arriving at you in whatever shape the last link chose."],
                ].map(([t, d], i) => (
                  <div key={t} className="flex gap-4 rounded-2xl border border-[#e6ece7] bg-white p-5">
                    <span className="grid h-9 w-9 shrink-0 place-items-center rounded-full font-mono text-[0.7rem] font-bold text-white" style={{ background: "#0d1411" }}>{i + 1}</span>
                    <div>
                      <h3 className="font-display text-[0.95rem] font-bold" style={{ color: INK }}>{t}</h3>
                      <p className="mt-1.5 text-[0.86rem] leading-relaxed" style={{ color: BODY }}>{d}</p>
                    </div>
                  </div>
                ))}
              </div>
            </Reveal>
          </div>
        </div>
      </section>

      {/* Proportionality band */}
      <section className="py-16 sm:py-24" style={{ background: "#f8faf9" }}>
        <div className="mx-auto max-w-6xl px-5 sm:px-6">
          <div className="rounded-3xl bg-[#0d1411] p-8 text-center sm:p-14">
            <h2 className="mx-auto max-w-2xl font-display text-3xl font-bold leading-tight text-white sm:text-4xl">Report less, but be able to prove all of it</h2>
            <p className="mx-auto mt-5 max-w-xl text-lg leading-relaxed text-white/65">
              A short disclosure you can evidence is worth more to a customer than a long one you cannot. That is the whole design principle of the Basic module.
            </p>
          </div>
        </div>
      </section>

      <section className="py-16 sm:py-20">
        <div className="mx-auto max-w-6xl px-5 sm:px-6">
          <Reveal><h2 className="mx-auto max-w-2xl text-center font-display text-2xl font-bold sm:text-3xl" style={{ color: INK }}>One dataset, whichever framework asks</h2></Reveal>
          <div className="mt-10"><FrameworkWall highlight="VSME" /></div>
        </div>
      </section>

      <section className="pb-16 sm:pb-24">
        <div className="mx-auto max-w-6xl px-5 sm:px-6">
          <GH2>Questions about the VSME</GH2>
          <div className="mt-10"><GFaq items={FAQS} /></div>
        </div>
      </section>

      <GreenCTA title="Start your journey now" intro="See how ESGen turns one dataset into an answer for every customer questionnaire." />
    </div>
  );
}
