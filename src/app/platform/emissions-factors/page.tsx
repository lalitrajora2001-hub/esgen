import type { Metadata } from "next";
import { Reveal } from "@/components/ui/Reveal";

import { INK, BODY, PEyebrow, GCrumbs, GPrimaryBtn, GGhostBtn, GH2, GreenCTA, MonoFrameworks } from "@/components/platform/greenParts";
import { FactorConsole, PrecisionLadder, ProvenanceTrail, CustomFactorCompare, NetworkLoop } from "@/components/platform/FactorVisuals";

export const metadata: Metadata = {
  title: "Emissions Factors",
  description: "Apply recognised, transparent emission factors, kept up to date, so every carbon figure can be traced and defended.",
  alternates: { canonical: "/platform/emissions-factors" },
};

export default function EmissionsFactorsPage() {
  return (
    <div className="bg-white" style={{ color: BODY }}>
      {/* Hero — centred, with the console beneath */}
      <section className="relative overflow-hidden pt-24 sm:pt-28">
        <div aria-hidden className="pointer-events-none absolute inset-x-0 top-0 h-[520px]" style={{ background: "radial-gradient(120% 100% at 50% 0%, #eef7f1 0%, #f8fbf9 42%, #ffffff 78%)" }} />
        <div className="relative mx-auto max-w-6xl px-5 sm:px-6">
          <GCrumbs last="Emissions factors" />
          <div className="mx-auto mt-8 max-w-3xl text-center">
            <div className="flex justify-center"><PEyebrow>Life cycle assessment</PEyebrow></div>
            <h1 className="mt-5 font-display text-4xl font-bold leading-[1.05] tracking-tight sm:text-[3.4rem]" style={{ color: INK }}>
              Efficiency meets accuracy in emission calculations
            </h1>
            <p className="mx-auto mt-6 max-w-xl text-lg leading-relaxed" style={{ color: BODY }}>
              A transparent, continuously maintained factor database, so every carbon figure you publish can be traced back to its source, method, and vintage.
            </p>
            <div className="mt-9 flex flex-wrap justify-center gap-3">
              <GPrimaryBtn href="/demo">Start with ESGen</GPrimaryBtn>
              <GGhostBtn href="/contact">Talk to our team</GGhostBtn>
            </div>
          </div>
          <div className="mt-16 pb-20"><FactorConsole /></div>
        </div>
      </section>

      {/* Precision ladder */}
      <section className="border-t border-[#eef1ef] py-16 sm:py-24">
        <div className="mx-auto max-w-6xl px-5 sm:px-6">
          <Reveal>
            <div className="max-w-2xl">
              <GH2>Four ways to measure, one common standard</GH2>
              <p className="mt-5 text-lg leading-relaxed" style={{ color: BODY }}>
                Start with the data you have today and move up as your data quality improves. Every factor type resolves into the same auditable calculation.
              </p>
            </div>
          </Reveal>
          <div className="mt-14"><PrecisionLadder /></div>
        </div>
      </section>

      {/* Provenance trail */}
      <section className="py-16 sm:py-24" style={{ background: "#f8faf9" }}>
        <div className="mx-auto max-w-6xl px-5 sm:px-6">
          <Reveal>
            <div className="max-w-2xl">
              <GH2>Every number, traceable to its source</GH2>
              <p className="mt-5 text-lg leading-relaxed" style={{ color: BODY }}>
                Each figure keeps a record of the activity data behind it, the factor applied, and the calculation performed, so your reporting evidence holds up to scrutiny.
              </p>
            </div>
          </Reveal>
          <div className="mt-16"><ProvenanceTrail /></div>
        </div>
      </section>

      {/* Custom factors */}
      <section className="py-16 sm:py-24">
        <div className="mx-auto max-w-6xl px-5 sm:px-6">
          <div className="mx-auto max-w-2xl text-center">
            <GH2>Custom emission factors, tailored to your needs</GH2>
            <p className="mt-5 text-lg leading-relaxed" style={{ color: BODY }}>
              When standard databases fall short, ESGen fills the gap with custom factors for your specific products, regions, and supply chains.
            </p>
          </div>
          <div className="mt-14"><CustomFactorCompare /></div>
        </div>
      </section>

      {/* Network loop */}
      <section className="pb-16 sm:pb-24">
        <div className="mx-auto max-w-6xl px-5 sm:px-6">
          <Reveal>
            <div className="mx-auto mb-12 max-w-2xl text-center">
              <h2 className="font-display text-2xl font-bold tracking-tight sm:text-3xl" style={{ color: INK }}>The database improves with every dataset it sees</h2>
              <p className="mt-4 text-base leading-relaxed" style={{ color: BODY }}>
                As the range of use cases grows, the analysis behind each factor becomes more precise, and the figures you report become easier to defend.
              </p>
            </div>
          </Reveal>
          <NetworkLoop />
        </div>
      </section>

      {/* Standards */}
      <section className="border-t border-[#eef1ef] py-16 sm:py-20">
        <div className="mx-auto max-w-6xl px-5 sm:px-6">
          <Reveal>
            <h2 className="mx-auto max-w-2xl text-center font-display text-2xl font-bold sm:text-3xl" style={{ color: INK }}>Built to support the world&rsquo;s leading standards</h2>
            <p className="mx-auto mt-3 max-w-xl text-center text-base" style={{ color: BODY }}>Factors that feed straight into the frameworks you report to.</p>
          </Reveal>
          <div className="mt-10"><MonoFrameworks /></div>
        </div>
      </section>

      <GreenCTA title="Start your journey now" intro="See how ESGen's factor database turns your activity and spend data into figures you can defend." />
    </div>
  );
}
