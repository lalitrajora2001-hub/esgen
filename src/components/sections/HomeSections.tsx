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

/* ---------- Photo cards: premium image-led cards, neutral (no blue tint) ---------- */
function PhotoCard({ img, alt, title, desc, href, cta }: { img: string; alt: string; title: string; desc: string; href?: string; cta?: string }) {
  const body = (
    <>
      <div className="relative overflow-hidden">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={img} alt={alt} className="aspect-[16/10] w-full object-cover transition-transform duration-700 group-hover:scale-[1.04]" />
        <div aria-hidden className="absolute inset-0" style={{ background: "linear-gradient(180deg, rgba(6,7,11,0) 45%, rgba(6,7,11,0.55) 100%)" }} />
      </div>
      <div className="flex flex-1 flex-col p-7">
        <h3 className="font-display text-lg font-semibold">{title}</h3>
        <p className="mt-2 flex-1 text-sm leading-relaxed text-text-muted">{desc}</p>
        {href && cta && (
          <span className="mt-6 inline-flex items-center gap-2 text-sm font-semibold text-white/90">
            {cta} <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
          </span>
        )}
      </div>
    </>
  );

  const shell = "group flex h-full flex-col overflow-hidden rounded-2xl border border-border bg-surface transition-all duration-300 hover:-translate-y-1 hover:border-white/25";

  return (
    <Reveal className="h-full">
      {href ? <Link href={href} className={shell}>{body}</Link> : <div className={shell}>{body}</div>}
    </Reveal>
  );
}

/* Image-led card with a solid action button (card itself is not a link). */
function PhotoActionCard({ img, alt, title, desc, href }: { img: string; alt: string; title: string; desc: string; href: string }) {
  return (
    <Reveal className="h-full">
      <div className="group flex h-full flex-col overflow-hidden rounded-2xl border border-border bg-surface transition-all duration-300 hover:-translate-y-1 hover:border-white/25">
        <div className="relative overflow-hidden">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={img} alt={alt} className="aspect-[16/10] w-full object-cover transition-transform duration-700 group-hover:scale-[1.04]" />
        </div>
        <div className="flex flex-1 flex-col p-7">
          <h3 className="font-display text-xl font-bold leading-snug">{title}</h3>
          <p className="mt-3 flex-1 text-sm leading-relaxed text-text-muted">{desc}</p>
          <Link href={href} className="mt-6 inline-flex w-fit items-center gap-2 rounded-xl bg-accent px-5 py-2.5 text-sm font-bold text-white transition-all duration-300 hover:-translate-y-0.5 hover:bg-accent-2">
            Find out more <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </div>
    </Reveal>
  );
}

/* What ESGen helps you do, image-led with action buttons. */
export function ValueCards() {
  return (
    <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
      <PhotoActionCard
        href="/solutions/reporting"
        img="/images/home-reporting.jpg"
        alt="Team reviewing performance data and charts around a desk"
        title="Collect once, report many times"
        desc="Bring activity data, supplier responses, and evidence into one workspace, then reuse the same figures across every framework you report to."
      />
      <PhotoActionCard
        href="/solutions/supply-chain"
        img="/images/home-supplychain.jpg"
        alt="Warehouse aisle with racking and a forklift"
        title="Reduce supply chain risk"
        desc="Invite suppliers, collect primary data, and close the estimate-heavy gaps that weaken Scope 3 across your value chain."
      />
      <PhotoActionCard
        href="/platform/ecovadis"
        img="/images/home-trust.jpg"
        alt="Colleagues in a meeting reviewing documents in a modern office"
        title="Win customer and tender trust"
        desc="Answer buyer questionnaires and tender requirements with figures you can trace back to their source, method, and owner."
      />
    </div>
  );
}

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
      <PhotoCard
        href="/industries/manufacturing"
        img="/images/manufacturing-welder.jpg"
        alt="Welder working on a steel fabrication bench"
        title="Manufacturing"
        cta="For manufacturers"
        desc="Energy, process emissions, materials, logistics, and supplier data, mapped to Scope 1, 2, and 3 for industrial operations."
      />
      <PhotoCard
        href="/industries/events"
        img="/images/events-festival.jpg"
        alt="Festival crowd under falling confetti and stage lights"
        title="Events"
        cta="For event organisers"
        desc="Venue energy, travel, catering, freight, and waste captured across a whole event to build a credible footprint."
      />
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
