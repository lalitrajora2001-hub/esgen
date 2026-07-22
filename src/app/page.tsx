import { Section, SectionHead } from "@/components/ui/Section";
import { ScrollStat } from "@/components/ui/ScrollStat";
import { CTASection } from "@/components/sections/blocks";
import { ValueCards, ServiceCards, IndustryCards } from "@/components/sections/HomeSections";
import { ComplianceCards, PlatformShowcase } from "@/components/sections/HomeFeatures";
import { ProcessFlow } from "@/components/sections/ProcessFlow";
import { HomeHero } from "@/components/sections/HomeHero";

export default function Home() {
  return (
    <>
      {/* 1. Full-viewport hero */}
      <HomeHero />

      {/* 2. What ESGen helps you do, image-led */}
      <Section>
        <SectionHead title="Where ESGen makes the difference" intro="Turn scattered activity data into reporting you can stand behind, and reuse it everywhere it is asked for." center />
        <div className="mt-12"><ValueCards /></div>
      </Section>

      {/* 2b. Compliance + effort, two feature cards */}
      <Section className="section-blend" size="sm">
        <SectionHead title="ESGen helps you to" center />
        <div className="mt-12"><ComplianceCards /></div>
      </Section>

      {/* 3. Scale, the impact band */}
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

      {/* 4. Our platform */}
      <Section>
        <div className="mx-auto max-w-2xl text-center">
          <p className="font-mono text-[0.72rem] uppercase tracking-[0.2em] text-text-muted">Our platform</p>
          <h2 className="mt-3 text-balance text-3xl font-semibold sm:text-4xl">Streamline your sustainability data in one platform</h2>
        </div>
        <div className="mt-14"><PlatformShowcase /></div>
      </Section>

      {/* 5. How it works, the journey */}
      <Section className="section-blend">
        <SectionHead title="How ESGen works" intro="A clear path from first assessment through to audit-ready assurance." center />
        <div className="mt-16"><ProcessFlow /></div>
      </Section>

      {/* 6. Who it's for, teams */}
      <Section>
        <SectionHead title="Solutions for every team" intro="ESGen fits the way each team already works, from finance and procurement to product and reporting." center />
        <div className="mt-12"><ServiceCards /></div>
      </Section>

      {/* 7. Who it's for, sectors */}
      <Section className="section-blend">
        <SectionHead title="Shaped around your sector" center />
        <div className="mt-12"><IndustryCards /></div>
      </Section>

      {/* 8. Final CTA */}
      <CTASection />
    </>
  );
}
