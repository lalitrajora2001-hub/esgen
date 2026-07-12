import Link from "next/link";
import { Reveal } from "@/components/ui/Reveal";
import { ArrowRight } from "@/components/ui/Button";

/* Minimal, premium cards: one clean white line-symbol per card. */

function Icon({ children }: { children: React.ReactNode }) {
  return (
    <div className="mb-6 grid h-14 w-14 place-items-center rounded-2xl border border-white/12 bg-white/[0.03] text-white transition-colors duration-300 group-hover:border-white/30">
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="h-7 w-7">
        {children}
      </svg>
    </div>
  );
}

function FeatureCard({ href, title, desc, cta = "Explore", icon }: { href: string; title: string; desc: string; cta?: string; icon: React.ReactNode }) {
  return (
    <Reveal className="h-full">
      <Link href={href} className="card card-hover group flex h-full flex-col p-7">
        <Icon>{icon}</Icon>
        <h3 className="font-display text-lg font-semibold">{title}</h3>
        <p className="mt-2 flex-1 text-sm leading-relaxed text-text-muted">{desc}</p>
        <span className="mt-6 inline-flex items-center gap-2 text-sm font-semibold text-white/90">
          {cta} <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
        </span>
      </Link>
    </Reveal>
  );
}

/* --- premium line symbols --- */
const SupplyChainIcon =<><path d="M3 7h10v8H3zM13 10h4l3 3v2h-7z" /><circle cx="7" cy="18" r="1.6" /><circle cx="17" cy="18" r="1.6" /></>;
const ProductFootprintIcon = <><path d="M12 3l8 4.5v9L12 21l-8-4.5v-9z" /><path d="M4 7.5l8 4.5 8-4.5M12 12v9" /></>;
const ReportingIcon = <><rect x="5" y="3" width="14" height="18" rx="2" /><path d="M9 8h6M9 12h6M9 16h4" /></>;
const ManufacturingIcon = <><path d="M3 20V10l5.5 3.2V10l5.5 3.2V7h6.5v13z" /><path d="M7 16.5h1.5M11.5 16.5H13M16 16.5h1.5" /></>;
const EventsIcon = <><rect x="3.5" y="5" width="17" height="16" rx="2.5" /><path d="M3.5 9.5h17M8 3.5v3.5M16 3.5v3.5" /><path d="M12 12.5l1 2 2.2.3-1.6 1.5.4 2.2-2-1-2 1 .4-2.2L9 14.8l2.2-.3z" /></>;

/* Finance card hidden with its page (src/app/_hidden/solutions-finance). */
export function ServiceCards() {
  return (
    <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
      <FeatureCard href="/solutions/reporting" title="Reporting" cta="For reporting leads" desc="Prepare framework-ready disclosures from one dataset, with evidence connected to every figure." icon={ReportingIcon} />
      <FeatureCard href="/solutions/supply-chain" title="Supply Chain" cta="For procurement" desc="Engage suppliers, collect primary data, and strengthen Scope 3 across your value chain." icon={SupplyChainIcon} />
      <FeatureCard href="/solutions/product-footprint" title="Product Footprint" cta="For product teams" desc="Measure product-level emissions and life-cycle impact, ready for customers and disclosure." icon={ProductFootprintIcon} />
    </div>
  );
}

export function IndustryCards() {
  return (
    <div className="grid gap-5 sm:grid-cols-2">
      <FeatureCard href="/industries/manufacturing" title="Manufacturing" cta="For manufacturers" desc="Energy, process emissions, materials, logistics, and supplier data, mapped to Scope 1, 2, and 3 for industrial operations." icon={ManufacturingIcon} />
      <FeatureCard href="/industries/events" title="Events" cta="For event organisers" desc="Venue energy, travel, catering, freight, and waste captured across a whole event to build a credible footprint." icon={EventsIcon} />
    </div>
  );
}

/* --- Why ESGen, six clean white symbols --- */
const WHY: { t: string; d: string; icon: React.ReactNode }[] = [
  { t: "Traceable data", d: "Every figure links back to its source, method, and owner.", icon: <path d="M7 7h4a4 4 0 0 1 0 8H9M17 17h-4a4 4 0 0 1 0-8h2" /> },
  { t: "Guided workflows", d: "A clear, repeatable path from data collection to reporting.", icon: <path d="M5 6h6M5 12h14M5 18h9M17 4l3 3-3 3" /> },
  { t: "Supplier engagement", d: "Collect supplier ESG and Scope 3 data in one place.", icon: <><circle cx="7" cy="8" r="2.4" /><circle cx="17" cy="8" r="2.4" /><path d="M3.5 18a3.5 4 0 0 1 7 0M13.5 18a3.5 4 0 0 1 7 0M9.4 8h5.2" /></> },
  { t: "Framework mapping", d: "One dataset, mapped across recognised frameworks.", icon: <><path d="M4 8l8-4 8 4-8 4z" /><path d="M4 12l8 4 8-4M4 16l8 4 8-4" /></> },
  { t: "Reporting-ready outputs", d: "Structured exports with evidence connected to every figure.", icon: <path d="M8 4h6l4 4v12H6V4zM14 4v4h4M9 14l3 3 3-3M12 10v7" /> },
  { t: "Actionable insights", d: "Spot hotspots and turn data into practical decisions.", icon: <path d="M6 20V12M11 20V6M16 20v-6M21 20V9" /> },
];

export function WhyGrid() {
  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {WHY.map((w) => (
        <Reveal key={w.t}>
          <div className="card group h-full p-6 transition-colors duration-300 hover:border-white/25">
            <Icon>{w.icon}</Icon>
            <h3 className="font-display text-lg font-semibold">{w.t}</h3>
            <p className="mt-2 text-sm leading-relaxed text-text-muted">{w.d}</p>
          </div>
        </Reveal>
      ))}
    </div>
  );
}
