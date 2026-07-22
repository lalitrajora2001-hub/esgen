import { Section, SectionHead } from "@/components/ui/Section";
import { ScrollStat } from "@/components/ui/ScrollStat";
import { CTASection } from "@/components/sections/blocks";
import { ProcessFlow } from "@/components/sections/ProcessFlow";
import { HomeHero } from "@/components/sections/HomeHero";
import { LightHead, ValueCards, ComplianceCards, PlatformShowcase, TeamCards, SectorCards } from "@/components/sections/HomeFeatures";

export default function Home() {
  return (
    <>
      {/* 1. Full-viewport hero */}
      <HomeHero />

      {/* ---------- light content band ---------- */}

      {/* 2. Outcome cards */}
      <Section className="bg-white">
        <LightHead title="Where ESGen makes the difference" intro="Turn scattered activity data into reporting you can stand behind, and reuse it everywhere it is asked for." />
        <div className="mt-14"><ValueCards /></div>
      </Section>

      {/* 3. Compliance and effort */}
      <Section className="bg-[#f6f7f9]">
        <LightHead title="ESGen helps you to" />
        <div className="mt-14"><ComplianceCards /></div>
      </Section>

      {/* 4. Our platform */}
      <Section className="bg-white">
        <LightHead eyebrow="Our platform" title="Streamline your sustainability data in one platform" />
        <div className="mt-16"><PlatformShowcase /></div>
      </Section>

      {/* 5. Solutions for every team */}
      <Section className="bg-[#f6f7f9]">
        <LightHead title="Solutions for every team" intro="ESGen fits the way each team already works, from finance and procurement to product and reporting." />
        <div className="mt-14"><TeamCards /></div>
      </Section>

      {/* 6. Shaped around your sector */}
      <Section className="bg-white">
        <LightHead title="Shaped around your sector" intro="Sector-specific guidance built around how your operations actually generate emissions." />
        <div className="mt-14"><SectorCards /></div>
      </Section>

      {/* ---------- back to the dark theme ---------- */}

      {/* 7. Scale, the impact band */}
      <Section className="section-blend" size="sm">
        <div className="rounded-3xl border border-border bg-gradient-to-b from-surface to-canvas p-8 sm:p-14">
          <h2 className="max-w-3xl font-display text-3xl font-bold leading-[1.12] text-white sm:text-4xl">
            Measure everything. Report once. <span className="text-text-muted">Stay ahead of every mandate.</span>
          </h2>
          <p className="mt-4 max-w-xl text-text-muted">One workspace that turns raw activity data into audit-ready disclosure across the frameworks that matter.</p>
          <div className="mt-12 grid grid-cols-2 gap-x-6 gap-y-10 border-t border-border pt-12 sm:grid-cols-4">
            <ScrollStat value={3} label="Emission scopes covered" note="Scope 1, 2 and 3" />
            <ScrollStat value={15} label="Scope 3 categories" note="Full GHG Protocol value chain" />
            <ScrollStat value={6} suffix="+" label="Reporting frameworks supported" note="CSRD, ISSB, SECR, CDP and more" />
            <ScrollStat value={1} label="Workspace for it all" note="Collect once, report across needs" />
          </div>
        </div>
      </Section>

      {/* 8. How ESGen works */}
      <Section className="section-blend">
        <SectionHead title="How ESGen works" intro="A clear path from first assessment through to audit-ready assurance." center />
        <div className="mt-16"><ProcessFlow /></div>
      </Section>

      {/* 9. Final CTA */}
      <CTASection />
    </>
  );
}
