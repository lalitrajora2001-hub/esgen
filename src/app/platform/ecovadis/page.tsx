import type { Metadata } from "next";
import { Reveal } from "@/components/ui/Reveal";
import { INK, BODY, GCrumbs, GPrimaryBtn, GGhostBtn, GH2, GFaq, GreenCTA } from "@/components/platform/greenParts";
import { CEyebrow, FrameworkWall, ScopeNote } from "@/components/platform/complianceKit";
import { ScorecardRadar, EvidenceLadder } from "@/components/platform/EcovadisVisuals";

export const metadata: Metadata = {
  title: "EcoVadis",
  description: "Prepare for an EcoVadis assessment by organising the policies, actions, and results the questionnaire asks you to evidence.",
  alternates: { canonical: "/platform/ecovadis" },
};

const FAQS: [string, string][] = [
  ["What is EcoVadis?", "An independent provider of business sustainability ratings. Companies complete an assessment questionnaire and submit supporting documents; EcoVadis analysts produce a scorecard used widely in procurement."],
  ["What does the assessment cover?", "Four themes: Environment, Labour and Human Rights, Ethics, and Sustainable Procurement. The weighting of each theme depends on your sector, size, and country."],
  ["What actually raises a score?", "Evidence, in three layers. A policy shows intent. Actions show you did something about it. Results show whether it worked. Scores tend to be limited by the layer you are missing, not the one you have most of."],
  ["Why are we asked for one?", "Usually because a customer requires it. Assessments are increasingly a condition of being on a supplier list, particularly for companies with their own value-chain reporting obligations."],
  ["Does ESGen rate us or award a score?", "No. EcoVadis carries out the assessment and issues the scorecard. ESGen helps you assemble the underlying evidence, particularly the carbon and value-chain data behind the Environment and Sustainable Procurement themes."],
  ["Can we reuse the evidence elsewhere?", "Yes, and you should. The emissions inventory, supplier data, and policy documentation gathered for an assessment are the same artefacts CSRD, SECR, and customer questionnaires ask for."],
];

export default function EcovadisPage() {
  return (
    <div className="bg-white" style={{ color: BODY }}>
      {/* Hero — split with radar */}
      <section className="relative overflow-hidden pt-24 sm:pt-28">
        <div aria-hidden className="pointer-events-none absolute inset-x-0 top-0 h-[430px]" style={{ background: "linear-gradient(180deg,#f5faf7,#ffffff 73%)" }} />
        <div className="relative mx-auto max-w-6xl px-5 sm:px-6">
          <GCrumbs last="EcoVadis" />
          <div className="mt-8 max-w-3xl">
            <CEyebrow>ESG compliance</CEyebrow>
            <h1 className="mt-4 font-display text-4xl font-bold leading-[1.05] tracking-tight sm:text-5xl" style={{ color: INK }}>
              Four themes decide the score. Evidence decides the themes.
            </h1>
            <p className="mt-6 max-w-xl text-lg leading-relaxed" style={{ color: BODY }}>
              An EcoVadis assessment rewards what you can show, not what you intend. ESGen organises the carbon and supplier evidence that the Environment and Procurement themes rest on.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <GPrimaryBtn href="/demo">Request a demo</GPrimaryBtn>
              <GGhostBtn href="/contact">Talk to our team</GGhostBtn>
            </div>
          </div>
          <div className="mt-14"><Reveal><ScorecardRadar /></Reveal></div>
          <div className="mt-10 pb-4"><ScopeNote>ESGen is not affiliated with EcoVadis and does not assess, score, or rate any organisation. The assessment is carried out by EcoVadis. The weights and scores shown above are illustrative, to explain how a weighted scorecard behaves.</ScopeNote></div>
        </div>
      </section>

      {/* Evidence ladder */}
      <section className="py-16 sm:py-24" style={{ background: "#f8faf9" }}>
        <div className="mx-auto max-w-6xl px-5 sm:px-6">
          <Reveal><div className="max-w-2xl"><GH2>Policies, actions, results</GH2>
            <p className="mt-5 text-lg leading-relaxed" style={{ color: BODY }}>
              Most organisations have the first. Many have the second. The third is where scores are usually lost, because results require data collected consistently over more than one period.
            </p></div></Reveal>
          <div className="mt-12"><EvidenceLadder /></div>
        </div>
      </section>

      {/* Where ESGen fits — honest scoping */}
      <section className="py-16 sm:py-24">
        <div className="mx-auto max-w-6xl px-5 sm:px-6">
          <Reveal><GH2>Where ESGen actually helps</GH2></Reveal>
          <div className="mt-10 grid gap-px overflow-hidden rounded-2xl border border-[#e6ece7] bg-[#e6ece7] lg:grid-cols-2">
            <div className="bg-white p-7">
              <span className="text-[0.66rem] font-bold uppercase tracking-[0.14em]" style={{ color: "#15803d" }}>What we do</span>
              <ul className="mt-5 space-y-3">
                {[
                  "Build the greenhouse gas inventory behind the Environment theme",
                  "Collect primary data from suppliers for Sustainable Procurement",
                  "Track reduction actions and the results they produced",
                  "Keep the source and method behind every figure you submit",
                ].map((l) => (
                  <li key={l} className="flex items-start gap-3 text-[0.92rem]" style={{ color: INK }}>
                    <svg viewBox="0 0 24 24" className="mt-0.5 h-5 w-5 shrink-0" fill="none"><circle cx="12" cy="12" r="10" fill="#15803d" /><path d="M7.5 12.5l3 3 6-6.5" stroke="#fff" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" /></svg>{l}
                  </li>
                ))}
              </ul>
            </div>
            <div className="bg-[#f8faf9] p-7">
              <span className="text-[0.66rem] font-bold uppercase tracking-[0.14em]" style={{ color: "#8a8f94" }}>What we do not do</span>
              <ul className="mt-5 space-y-3">
                {[
                  "Assess, score, or rate your organisation",
                  "Influence the outcome of an EcoVadis assessment",
                  "Guarantee any particular score or rating level",
                  "Act on behalf of EcoVadis in any capacity",
                ].map((l) => (
                  <li key={l} className="flex items-start gap-3 text-[0.92rem]" style={{ color: BODY }}>
                    <svg viewBox="0 0 24 24" className="mt-0.5 h-5 w-5 shrink-0" fill="none" stroke="#a8b0aa" strokeWidth="2.2" strokeLinecap="round"><circle cx="12" cy="12" r="9" /><path d="M9 9l6 6M15 9l-6 6" /></svg>{l}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </section>

      <section className="py-16 sm:py-20" style={{ background: "#f8faf9" }}>
        <div className="mx-auto max-w-6xl px-5 sm:px-6">
          <Reveal><h2 className="mx-auto max-w-2xl text-center font-display text-2xl font-bold sm:text-3xl" style={{ color: INK }}>The same evidence answers the frameworks behind it</h2></Reveal>
          <div className="mt-10"><FrameworkWall /></div>
        </div>
      </section>

      <section className="py-16 sm:py-24">
        <div className="mx-auto max-w-6xl px-5 sm:px-6">
          <GH2>Questions about EcoVadis assessments</GH2>
          <div className="mt-10"><GFaq items={FAQS} /></div>
        </div>
      </section>

      <GreenCTA title="Start your journey now" intro="See how ESGen assembles the carbon and supplier evidence an assessment asks for." />
    </div>
  );
}
