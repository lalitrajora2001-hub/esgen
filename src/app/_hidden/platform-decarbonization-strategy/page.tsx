import type { Metadata } from "next";
import Link from "next/link";
import { Reveal } from "@/components/ui/Reveal";
import { INK, BODY, GREEN, GPrimaryBtn, GH2, GreenCTA } from "@/components/platform/greenParts";
import { HeroFloatingCards, ProcessTabs, SSPChart } from "@/components/platform/DecarbVisuals";

export const metadata: Metadata = {
  title: "Decarbonization Strategy",
  description: "Build a decarbonisation roadmap with science-aligned targets, modelled reduction scenarios, and concrete steps towards net zero.",
  alternates: { canonical: "/platform/decarbonization-strategy" },
};

const PILLARS: [string, string][] = [
  ["Autonomous design", "Design a range of emissions pathway scenarios tailored to your company, business unit, or individual sites."],
  ["Expertise and tools", "Assess the reduction potential of each lever, and the cost that comes with it, before you commit."],
  ["Custom guidelines", "Choose industry-specific actions, each accompanied by step-by-step implementation guidance."],
  ["Change driver", "Drive change with structured action-plan sessions, or work through the resources independently."],
];

const WHY: [string, string][] = [
  ["Take action for the planet", "It is a pivotal moment for companies to take bold, impactful measures that drive real change and help address the climate crisis."],
  ["Enhance brand image", "Growing awareness is driving companies to prioritise environmental responsibility and ethical consumption."],
  ["Reduce cost and increase resilience", "Setting these objectives supports efficient, resilient operations and prepares your business for rising resource costs."],
  ["Boost investor confidence", "Investors are increasingly interested in the environmental policies businesses adopt. Companies that set decarbonisation targets demonstrate innovation, ultimately making them more attractive to investors."],
];

export default function DecarbonizationStrategyPage() {
  return (
    <div className="bg-white" style={{ color: BODY }}>
      {/* Hero */}
      <section className="relative overflow-hidden pt-28 pb-16 sm:pt-32 sm:pb-20">
        <div aria-hidden className="pointer-events-none absolute inset-0" style={{ background: "linear-gradient(180deg, #f8fdfa, #ffffff 50%)" }} />
        <div className="relative mx-auto grid max-w-6xl items-center gap-12 px-5 sm:px-6 lg:grid-cols-[1fr_1fr]">
          <div>
            <nav aria-label="Breadcrumb" className="flex items-center gap-2 text-[0.78rem]" style={{ color: BODY }}>
              <Link href="/" className="hover:underline">ESGen</Link><span>›</span>
              <Link href="/platform/carbon-assessment" className="hover:underline">Platform</Link><span>›</span>
              <span style={{ color: INK }}>Decarbonization strategy</span>
            </nav>
            <p className="mt-6 flex items-center gap-1.5 text-[0.72rem] font-bold uppercase tracking-[0.14em]" style={{ color: GREEN }}>
              <svg viewBox="0 0 24 24" className="h-3.5 w-3.5" fill="none" stroke={GREEN} strokeWidth="2"><circle cx="12" cy="12" r="9" /><path d="M12 7v10" /></svg>
              Carbon management
            </p>
            <h1 className="mt-4 font-display text-4xl font-bold leading-[1.05] tracking-tight sm:text-5xl" style={{ color: INK }}>
              Build your<br />carbon action blueprint
            </h1>
            <p className="mt-5 max-w-sm text-lg leading-relaxed" style={{ color: BODY }}>
              Create a decarbonisation roadmap with science-aligned goals and steps toward net zero.
            </p>
            <div className="mt-8"><GPrimaryBtn href="/demo">Start with ESGen</GPrimaryBtn></div>
          </div>
          <Reveal className="min-w-0"><HeroFloatingCards /></Reveal>
        </div>
      </section>

      {/* Four pillars: 3 across, 1 below */}
      <section className="py-14 sm:py-20">
        <div className="mx-auto max-w-6xl px-5 sm:px-6">
          <div className="grid gap-x-10 gap-y-10 border-t border-[#e6ece7] pt-12 sm:grid-cols-3">
            {PILLARS.slice(0, 3).map(([t, d]) => (
              <Reveal key={t}>
                <div>
                  <h3 className="font-display text-lg font-bold tracking-tight" style={{ color: INK }}>{t}</h3>
                  <p className="mt-3 max-w-xs text-sm leading-relaxed" style={{ color: BODY }}>{d}</p>
                </div>
              </Reveal>
            ))}
          </div>
          <div className="mt-12 max-w-xl">
            <Reveal>
              <h3 className="font-display text-lg font-bold tracking-tight" style={{ color: INK }}>{PILLARS[3][0]}</h3>
              <p className="mt-3 text-sm leading-relaxed" style={{ color: BODY }}>{PILLARS[3][1]}</p>
            </Reveal>
          </div>
        </div>
      </section>

      {/* Process tabs */}
      <section className="py-16 sm:py-24" style={{ background: "#f6fbf7" }}>
        <div className="mx-auto max-w-6xl px-5 sm:px-6">
          <p className="max-w-xl text-base" style={{ color: BODY }}>A streamlined and straightforward process suitable for any organisation</p>
          <div className="mt-8"><ProcessTabs /></div>
        </div>
      </section>

      {/* Why it matters */}
      <section className="py-16 sm:py-24">
        <div className="mx-auto grid max-w-6xl gap-12 px-5 sm:px-6 lg:grid-cols-[0.9fr_1.1fr]">
          <div>
            <GH2>Why a decarbonisation strategy matters</GH2>
            <p className="mt-5 max-w-md text-lg leading-relaxed" style={{ color: BODY }}>
              Decarbonisation targets are key to any impactful climate strategy. ESGen equips you with the tools to define and achieve science-aligned objectives.
            </p>
          </div>
          <div className="divide-y divide-[#e6ece7] border-y border-[#e6ece7]">
            {WHY.map(([t, d]) => (
              <Reveal key={t}>
                <div className="py-6">
                  <h3 className="font-display text-base font-bold" style={{ color: INK }}>{t}</h3>
                  <p className="mt-2 text-sm leading-relaxed" style={{ color: BODY }}>{d}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* Big SSP chart */}
      <section className="py-16 sm:py-24" style={{ background: "#fbfcfb" }}>
        <div className="mx-auto max-w-6xl px-5 sm:px-6">
          <Reveal><SSPChart /></Reveal>
        </div>
      </section>

      <GreenCTA title="Start your journey now" intro="See how ESGen turns your footprint into science-aligned targets and a plan you can deliver." />
    </div>
  );
}
