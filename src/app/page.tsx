import { Section } from "@/components/ui/Section";
import { ScrollStat } from "@/components/ui/ScrollStat";
import { HomeHero } from "@/components/sections/HomeHero";
import { LightHead, ValueCards, ComplianceCards, PlatformShowcase, TeamCards, SectorCards, ProcessSteps, LightCta } from "@/components/sections/HomeFeatures";

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

      {/* 7. Scale, the impact band */}
      <Section className="bg-[#f6f7f9]" size="sm">
        <div className="rounded-3xl bg-white p-8 sm:p-14" style={{ border: "1px solid #e6e8ec" }}>
          <h2 className="max-w-3xl font-display text-[clamp(1.8rem,3.2vw,2.6rem)] leading-[1.12]" style={{ color: "#101318", fontWeight: 450 }}>
            Measure everything. Report once. <span style={{ color: "#8a919c" }}>Stay ahead of every mandate.</span>
          </h2>
          <p className="mt-4 max-w-xl" style={{ color: "#565d68" }}>One workspace that turns raw activity data into audit-ready disclosure across the frameworks that matter.</p>
          <div className="mt-12 grid grid-cols-2 gap-x-6 gap-y-10 pt-12 sm:grid-cols-4" style={{ borderTop: "1px solid #e6e8ec" }}>
            <ScrollStat value={3} label="Emission scopes covered" note="Scope 1, 2 and 3" />
            <ScrollStat value={15} label="Scope 3 categories" note="Full GHG Protocol value chain" />
            <ScrollStat value={6} suffix="+" label="Reporting frameworks supported" note="CSRD, ISSB, SECR, CDP and more" />
            <ScrollStat value={1} label="Workspace for it all" note="Collect once, report across needs" />
          </div>
        </div>
      </Section>

      {/* 8. How ESGen works */}
      <Section className="bg-white">
        <LightHead title="How ESGen works" intro="A clear path from first assessment through to audit-ready assurance." />
        <div className="mt-16"><ProcessSteps /></div>
      </Section>

      {/* 9. Final CTA */}
      <LightCta />
    </>
  );
}
