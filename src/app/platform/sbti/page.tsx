import type { Metadata } from "next";
import { Reveal } from "@/components/ui/Reveal";
import { INK, BODY, GCrumbs, GPrimaryBtn, GGhostBtn, GH2, GFaq, GreenCTA } from "@/components/platform/greenParts";
import { CEyebrow, ScopeNote } from "@/components/platform/complianceKit";
import { TargetCalculator, CriteriaChecks } from "@/components/platform/SbtiVisuals";

export const metadata: Metadata = {
  title: "SBTi",
  description: "Model a science-based reduction pathway, then build the inventory and evidence a target submission depends on.",
  alternates: { canonical: "/platform/sbti" },
};

const FAQS: [string, string][] = [
  ["What is a science-based target?", "A greenhouse gas reduction target consistent with what climate science says is needed to limit warming. The Science Based Targets initiative sets the criteria and validates targets against them."],
  ["How fast do we have to reduce?", "Under the linear annual reduction method, a 1.5°C-aligned near-term target requires an absolute reduction of at least 4.2% per year against the base year. A well-below 2°C pathway requires a lower annual rate."],
  ["How long should the target run?", "Near-term targets cover a period of five to ten years from the base year. Long-term targets extend to net zero, which requires deep absolute reductions before any residual emissions are neutralised."],
  ["Do we need a Scope 3 target?", "A Scope 3 target is expected where value-chain emissions are a significant share of your total. For most companies they are the largest share by far, which makes supplier data the deciding factor."],
  ["What is the base year for?", "It is the reference point every reduction is measured against. It needs a complete, verifiable inventory, and a policy for recalculating it if the business changes shape through acquisition or disposal."],
  ["Does ESGen validate our target?", "No. Validation is carried out by the SBTi against their own criteria. ESGen builds the inventory, models the pathway, and organises the evidence you would submit."],
  ["Is the calculator our actual target?", "No. It applies the linear annual reduction method for orientation. Coverage thresholds, sector pathways, and validation criteria are set by the SBTi and are not modelled here."],
];

export default function SbtiPage() {
  return (
    <div className="bg-white" style={{ color: BODY }}>
      {/* Hero — the rate as the headline */}
      <section className="relative overflow-hidden pt-24 sm:pt-28">
        <div aria-hidden className="pointer-events-none absolute inset-x-0 top-0 h-[440px]" style={{ background: "linear-gradient(180deg,#f5faf7,#ffffff 72%)" }} />
        <div className="relative mx-auto max-w-6xl px-5 sm:px-6">
          <GCrumbs last="SBTi" />
          <div className="mt-8 grid gap-10 lg:grid-cols-[1.05fr_0.95fr] lg:items-center">
            <div>
              <CEyebrow>ESG compliance</CEyebrow>
              <h1 className="mt-4 font-display text-4xl font-bold leading-[1.05] tracking-tight sm:text-5xl" style={{ color: INK }}>
                A 1.5°C target means <span style={{ color: "#15803d" }}>4.2% every year</span>
              </h1>
              <p className="mt-6 max-w-lg text-lg leading-relaxed" style={{ color: BODY }}>
                Not on average, and not eventually. Model the pathway, see what it asks of you, then build the inventory that can prove you walked it.
              </p>
              <div className="mt-8 flex flex-wrap gap-3">
                <GPrimaryBtn href="/demo">Request a demo</GPrimaryBtn>
                <GGhostBtn href="/contact">Talk to our team</GGhostBtn>
              </div>
            </div>
            <Reveal className="min-w-0">
              <div className="rounded-3xl bg-[#0d1411] p-8 text-center sm:p-10">
                <div className="text-[0.66rem] font-bold uppercase tracking-[0.16em]" style={{ color: "#4ade80" }}>Linear annual reduction</div>
                <div className="mt-4 font-display text-6xl font-bold leading-none text-white sm:text-7xl">4.2%</div>
                <div className="mt-2 text-[0.9rem] text-white/50">minimum, per year, for 1.5°C</div>
                <div className="mx-auto mt-8 grid max-w-xs grid-cols-2 gap-3 border-t border-white/10 pt-6 text-left">
                  <div><div className="font-display text-xl font-bold text-white">5–10</div><div className="text-[0.66rem] text-white/45">years, near-term</div></div>
                  <div><div className="font-display text-xl font-bold text-white">Scope 3</div><div className="text-[0.66rem] text-white/45">where significant</div></div>
                </div>
              </div>
            </Reveal>
          </div>
          <div className="mt-14"><Reveal><TargetCalculator /></Reveal></div>
          <div className="mt-10 pb-4"><ScopeNote>The calculator applies the linear annual reduction method for orientation. Sector pathways, coverage thresholds, and validation criteria are set by the SBTi. Setting a target does not itself reduce emissions.</ScopeNote></div>
        </div>
      </section>

      {/* Criteria */}
      <section className="py-16 sm:py-24" style={{ background: "#f8faf9" }}>
        <div className="mx-auto grid max-w-6xl gap-12 px-5 sm:px-6 lg:grid-cols-[0.85fr_1.15fr] lg:items-start">
          <Reveal>
            <GH2>What a submission actually rests on</GH2>
            <p className="mt-5 max-w-md text-lg leading-relaxed" style={{ color: BODY }}>
              The target is the easy part to write. The inventory underneath it is what determines whether it survives contact with a reviewer.
            </p>
          </Reveal>
          <Reveal><CriteriaChecks /></Reveal>
        </div>
      </section>

      {/* Scope 3 reality */}
      <section className="py-16 sm:py-24">
        <div className="mx-auto max-w-6xl px-5 sm:px-6">
          <Reveal><div className="max-w-2xl"><GH2>The target lives or dies in Scope 3</GH2>
            <p className="mt-5 text-lg leading-relaxed" style={{ color: BODY }}>For most companies, the majority of emissions sit with suppliers. A credible pathway means moving data, and then moving suppliers.</p></div></Reveal>
          <div className="mt-12 grid gap-5 lg:grid-cols-3">
            {[
              ["Measure it honestly", "Spend-based estimates are a starting point, not a target baseline. Know which categories are estimates and which are evidence."],
              ["Engage the few that matter", "A small number of suppliers usually carry most of the footprint. Start there rather than surveying everyone."],
              ["Track the trajectory, not the pledge", "Progress is the annual reduction actually achieved against the base year, recorded each year."],
            ].map(([t, d], i) => (
              <Reveal key={t}>
                <div className="h-full rounded-2xl p-6" style={{ background: i === 1 ? "#0d1411" : "#f8faf9" }}>
                  <span className="font-mono text-[0.7rem] font-bold" style={{ color: i === 1 ? "rgba(255,255,255,0.45)" : "#9aa5a0" }}>0{i + 1}</span>
                  <h3 className="mt-3 font-display text-lg font-bold" style={{ color: i === 1 ? "#fff" : INK }}>{t}</h3>
                  <p className="mt-2 text-[0.86rem] leading-relaxed" style={{ color: i === 1 ? "rgba(255,255,255,0.62)" : BODY }}>{d}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>


      <section className="py-16 sm:py-24">
        <div className="mx-auto max-w-6xl px-5 sm:px-6">
          <GH2>Questions about science-based targets</GH2>
          <div className="mt-10"><GFaq items={FAQS} /></div>
        </div>
      </section>

      <GreenCTA title="Start your journey now" intro="See how ESGen builds the inventory a science-based target has to stand on." />
    </div>
  );
}
