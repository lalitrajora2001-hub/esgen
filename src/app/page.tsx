import { Section, SectionHead } from "@/components/ui/Section";
import { ScrollStat } from "@/components/ui/ScrollStat";
import { PageHero, CTASection } from "@/components/sections/blocks";
import { ProductTabs } from "@/components/sections/ProductTabs";
import { InsightsDashboard } from "@/components/appmockups";
import { FrameworkLogos } from "@/components/frameworks";
import { SolutionCards } from "@/components/sections/SolutionCards";
import { ServiceCards, IndustryCards } from "@/components/sections/HomeSections";
import { ProcessFlow } from "@/components/sections/ProcessFlow";

export default function Home() {
  return (
    <>
      {/* 1. Hero */}
      <PageHero
        title="Turn ESG mandates into your competitive advantage."
        intro="ESGen evaluates your current operational footprint and maps a precise, actionable pathway to meet industry-specific ESG standards, so reporting becomes a foundation for growth rather than an administrative burden."
        primary={{ label: "Book a demo", href: "/demo" }}
        secondary={{ label: "Explore the platform", href: "/platform/carbon-assessment" }}
        visual={<InsightsDashboard />}
      />

      {/* 2. Reporting landscape / standards */}
      <Section className="section-blend" size="sm">
        <SectionHead title="Built for today's reporting landscape" intro="ESGen is designed to support structured reporting workflows across the sustainability and carbon reporting standards that shape the market." center />
        <div className="mt-12"><FrameworkLogos /></div>
      </Section>

      {/* 3. Platform suite */}
      <Section>
        <SectionHead title="One platform for carbon and ESG intelligence" center />
        <div className="mt-12"><SolutionCards /></div>
      </Section>

      {/* 4. Scroll-driven impact band */}
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

      {/* 5. Interactive product tabs */}
      <Section>
        <SectionHead title="See how the workflow fits together" />
        <div className="mt-10"><ProductTabs /></div>
      </Section>

      {/* 6. Solutions by team */}
      <Section className="section-blend">
        <SectionHead title="Solutions for every team" intro="ESGen fits the way each team already works, from finance and procurement to product and reporting." center />
        <div className="mt-12"><ServiceCards /></div>
      </Section>

      {/* 7. Industries preview */}
      <Section>
        <SectionHead title="Shaped around your sector" center />
        <div className="mt-12"><IndustryCards /></div>
      </Section>

      {/* 8. How ESGen works, process flow */}
      <Section className="section-blend">
        <SectionHead title="How ESGen works" intro="A clear path from first assessment through to audit-ready assurance." center />
        <div className="mt-16"><ProcessFlow /></div>
      </Section>

      {/* 9. Final CTA */}
      <CTASection />
    </>
  );
}
