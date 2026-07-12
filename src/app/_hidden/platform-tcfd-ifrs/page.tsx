import type { Metadata } from "next";
import { Reveal } from "@/components/ui/Reveal";
import { INK, BODY, GCrumbs, GPrimaryBtn, GGhostBtn, GH2, GFaq, GreenCTA } from "@/components/platform/greenParts";
import { CEyebrow, FrameworkWall, ScopeNote } from "@/components/platform/complianceKit";
import { PillarWheel, TcfdTimeline } from "@/components/platform/TcfdVisuals";

export const metadata: Metadata = {
  title: "TCFD / IFRS",
  description: "Structure climate reporting around the four TCFD pillars, now carried forward into IFRS S2.",
  alternates: { canonical: "/platform/tcfd-ifrs" },
};

const FAQS: [string, string][] = [
  ["What are the four TCFD pillars?", "Governance, Strategy, Risk Management, and Metrics & Targets. Beneath them sit eleven recommended disclosures that give the pillars substance."],
  ["Does the TCFD still exist?", "The Task Force was disbanded in 2024. Its recommendations did not disappear; they were fully incorporated into IFRS S2, and the ISSB took on monitoring companies' climate-related disclosures."],
  ["So should we report against TCFD or IFRS S2?", "In practice you build the same evidence. If you already report against the four pillars, you have most of what IFRS S2 asks for. S2 goes further on industry-specific metrics and on the disclosure of Scope 3 emissions."],
  ["What is scenario analysis for?", "The Strategy pillar asks you to describe the resilience of your strategy under different climate-related scenarios, including a 2°C or lower pathway. The point is to state your assumptions and reasoning, not to predict the future."],
  ["Do we have to disclose Scope 3?", "The TCFD recommendation was to disclose Scope 3 if appropriate. IFRS S2 requires gross Scope 3 emissions, which is a meaningful step up in data collection."],
  ["How does ESGen help?", "ESGen holds the emissions inventory, the scenario assumptions, and the targets, keeping the calculation and source behind each figure so the disclosures can be reviewed and reused across frameworks."],
];

export default function TcfdPage() {
  return (
    <div className="bg-white" style={{ color: BODY }}>
      {/* Hero, wheel is the hero */}
      <section className="relative overflow-hidden pt-24 sm:pt-28">
        <div aria-hidden className="pointer-events-none absolute inset-x-0 top-0 h-[420px]" style={{ background: "linear-gradient(180deg,#f5faf7,#ffffff 74%)" }} />
        <div className="relative mx-auto max-w-6xl px-5 sm:px-6">
          <GCrumbs last="TCFD / IFRS" />
          <div className="mx-auto mt-8 max-w-2xl text-center">
            <div className="flex justify-center"><CEyebrow>ESG compliance</CEyebrow></div>
            <h1 className="mt-5 font-display text-4xl font-bold leading-[1.05] tracking-tight sm:text-[3.3rem]" style={{ color: INK }}>
              Four pillars. Eleven disclosures. One evidence base.
            </h1>
            <p className="mx-auto mt-6 max-w-xl text-lg leading-relaxed" style={{ color: BODY }}>
              The TCFD structure is now carried inside IFRS S2. Build the evidence once and it answers both.
            </p>
            <div className="mt-8 flex flex-wrap justify-center gap-3">
              <GPrimaryBtn href="/demo">Request a demo</GPrimaryBtn>
              <GGhostBtn href="/contact">Talk to our team</GGhostBtn>
            </div>
          </div>
          <div className="mt-16 pb-4"><Reveal><PillarWheel /></Reveal></div>
        </div>
      </section>

      {/* Timeline */}
      <section className="py-16 sm:py-24" style={{ background: "#f8faf9" }}>
        <div className="mx-auto max-w-6xl px-5 sm:px-6">
          <Reveal><div className="max-w-2xl"><GH2>What happened to the TCFD</GH2>
            <p className="mt-5 text-lg leading-relaxed" style={{ color: BODY }}>The Task Force was disbanded, but its architecture survived intact inside the ISSB standards.</p></div></Reveal>
          <div className="mt-14"><TcfdTimeline /></div>
          <div className="mt-12"><ScopeNote>Whether you report against IFRS S1 and S2, a jurisdictional adoption of them such as the UK SRS, or another framework, depends on where you operate and how you are listed. Confirm your obligations with your advisers.</ScopeNote></div>
        </div>
      </section>

      {/* The hard pillar */}
      <section className="py-16 sm:py-24">
        <div className="mx-auto max-w-6xl px-5 sm:px-6">
          <div className="overflow-hidden rounded-3xl bg-[#0d1411] p-8 sm:p-14">
            <div className="max-w-2xl">
              <span className="text-[0.68rem] font-bold uppercase tracking-[0.14em]" style={{ color: "#4ade80" }}>Where most reports thin out</span>
              <h2 className="mt-4 font-display text-3xl font-bold leading-tight text-white sm:text-4xl">Strategy is the pillar that asks for a number you do not have yet</h2>
              <p className="mt-5 text-lg leading-relaxed text-white/65">
                Governance and risk management can be described. Strategy asks you to model resilience under a 2°C or lower pathway, and to say what you assumed. That requires an inventory, a scenario, and the honesty to publish the assumptions alongside the answer.
              </p>
            </div>
            <div className="mt-10 grid gap-4 sm:grid-cols-3">
              {[
                ["State the scenarios", "Which pathways you tested, and where the parameters came from."],
                ["Show the exposure", "Which parts of the business are affected, over what horizon."],
                ["Publish the assumptions", "So a reader can judge the analysis rather than take it on trust."],
              ].map(([t, d]) => (
                <div key={t} className="rounded-2xl bg-white/[0.04] p-5 ring-1 ring-white/10">
                  <h3 className="font-display text-[0.95rem] font-bold text-white">{t}</h3>
                  <p className="mt-1.5 text-[0.84rem] leading-relaxed text-white/60">{d}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="py-16 sm:py-20" style={{ background: "#f8faf9" }}>
        <div className="mx-auto max-w-6xl px-5 sm:px-6">
          <Reveal><h2 className="mx-auto max-w-2xl text-center font-display text-2xl font-bold sm:text-3xl" style={{ color: INK }}>Report once, satisfy many</h2></Reveal>
          <div className="mt-10"><FrameworkWall highlight="TCFD" /></div>
        </div>
      </section>

      <section className="py-16 sm:py-24">
        <div className="mx-auto max-w-6xl px-5 sm:px-6">
          <GH2>Questions about TCFD and IFRS</GH2>
          <div className="mt-10"><GFaq items={FAQS} /></div>
        </div>
      </section>

      <GreenCTA title="Start your journey now" intro="See how ESGen structures climate disclosure around the four pillars." />
    </div>
  );
}
