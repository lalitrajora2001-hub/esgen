import Link from "next/link";
import { Section, SectionHead } from "@/components/ui/Section";
import { Reveal } from "@/components/ui/Reveal";
import { ArrowRight } from "@/components/ui/Button";
import { PageHero, CTASection, Check } from "@/components/sections/blocks";
import { type ContentPage as CP, pagesIn } from "@/lib/content";
import {
  PlatformDashboard, ScopesDashboard, WorkflowMockup, DataHubMockup, MaterialityMatrix,
  SupplierTracker, ComplianceGrid, AuditTrail, RoadmapMockup, IndustryDashboard,
} from "@/components/mockups";

function Visual({ page }: { page: CP }) {
  switch (page.visual) {
    case "platform": return <PlatformDashboard />;
    case "scopes": return <ScopesDashboard />;
    case "workflow": return <WorkflowMockup />;
    case "dataHub": return <DataHubMockup />;
    case "materiality": return <MaterialityMatrix />;
    case "supplier": return <SupplierTracker />;
    case "compliance": return <ComplianceGrid frameworks={page.frameworks} />;
    case "audit": return <AuditTrail />;
    case "roadmap": return <RoadmapMockup />;
    case "industry-mfg": return <IndustryDashboard title="manufacturing" categories={[["Energy", 74], ["Process", 58], ["Materials", 82], ["Logistics", 46], ["Waste", 28]]} />;
    case "industry-events": return <IndustryDashboard title="events" categories={[["Venue energy", 70], ["Travel", 84], ["Catering", 52], ["Suppliers", 40], ["Waste", 30]]} />;
    default: return <PlatformDashboard />;
  }
}

const trailBase: Record<CP["collection"], { label: string; href: string }> = {
  solutions: { label: "Solutions", href: "/solutions/reporting" },
  platform: { label: "Platform", href: "/platform/carbon-assessment" },
  industries: { label: "Industries", href: "/industries/manufacturing" },
};

export function ContentPage({ page }: { page: CP }) {
  const related = pagesIn(page.collection).filter((p) => p.slug !== page.slug).slice(0, 3);
  const base = trailBase[page.collection];
  return (
    <>
      <PageHero
        kicker={page.kicker}
        title={page.h1}
        intro={page.intro}
        trail={[{ label: "Home", href: "/" }, base, { label: page.navLabel }]}
        secondary={{ label: "Explore platform", href: "/platform/carbon-assessment" }}
        visual={<Visual page={page} />}
      />

      <Section className="section-blend">
        <SectionHead eyebrow="How ESGen helps" title={`Inside ${page.navLabel}`} intro="A structured, practical way to prepare the data, evidence, and reporting your teams need." />
        <div className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {page.sections.map((s) => (
            <Reveal key={s.h}>
              <div className="card h-full p-6">
                <h3 className="font-display text-lg font-semibold">{s.h}</h3>
                <p className="mt-2 text-sm text-text-muted">{s.p}</p>
                {s.bullets && (
                  <ul className="mt-4 space-y-2">
                    {s.bullets.map((b) => (
                      <li key={b} className="flex items-start gap-2.5 text-sm text-text-muted"><Check /> {b}</li>
                    ))}
                  </ul>
                )}
              </div>
            </Reveal>
          ))}
        </div>
      </Section>

      {related.length > 0 && (
        <Section>
          <div className="mb-8 flex items-end justify-between gap-4">
            <h2 className="text-2xl font-semibold sm:text-3xl">Related {base.label.toLowerCase()}</h2>
            <Link href={base.href} className="inline-flex items-center gap-2 text-sm font-medium text-accent-3 hover:gap-3">View all <ArrowRight className="h-4 w-4" /></Link>
          </div>
          <div className="grid gap-4 sm:grid-cols-3">
            {related.map((r) => (
              <Link key={r.slug} href={`/${r.collection}/${r.slug}`} className="card card-hover block p-6">
                <h3 className="font-display text-lg font-semibold">{r.navLabel}</h3>
                <p className="mt-2 text-sm text-text-muted">{r.intro}</p>
                <span className="mt-4 inline-flex items-center gap-2 text-sm font-medium text-accent-3">Learn more <ArrowRight className="h-4 w-4" /></span>
              </Link>
            ))}
          </div>
        </Section>
      )}

      <CTASection title={`Talk to ESGen about ${page.navLabel.toLowerCase()}`} />
    </>
  );
}
