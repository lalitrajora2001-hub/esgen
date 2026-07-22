import Link from "next/link";
import { Reveal } from "@/components/ui/Reveal";
import { EmissionsDisclosure, AnomaliesCard } from "@/components/reporting/ReportingVisuals";

/* Light homepage band: white cards, black headings, grey body, blue buttons. */
const INK = "#101318";
const BODY = "#565d68";
const LINE = "#e6e8ec";
const BLUE = "#2f6fe0";

function Arrow() {
  return <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="M5 12h14M13 6l6 6-6 6" /></svg>;
}

function BlueButton({ href, children }: { href: string; children: React.ReactNode }) {
  return (
    <Link href={href} className="inline-flex w-fit items-center gap-2 rounded-lg px-5 py-2.5 text-sm font-bold text-white transition-transform duration-300 hover:-translate-y-0.5" style={{ background: BLUE }}>
      {children} <Arrow />
    </Link>
  );
}

export function LightHead({ eyebrow, title, intro }: { eyebrow?: string; title: string; intro?: string }) {
  return (
    <div className="mx-auto max-w-2xl text-center">
      {eyebrow && <p className="font-mono text-[0.72rem] uppercase tracking-[0.2em]" style={{ color: BODY }}>{eyebrow}</p>}
      <h2 className={`text-balance font-display text-3xl font-bold tracking-tight sm:text-4xl ${eyebrow ? "mt-3" : ""}`} style={{ color: INK }}>{title}</h2>
      {intro && <p className="mt-4 text-lg leading-relaxed" style={{ color: BODY }}>{intro}</p>}
    </div>
  );
}

/* ---------- Photo card with a blue action button ---------- */
function PhotoCard({ img, alt, title, desc, href }: { img: string; alt: string; title: string; desc: string; href: string }) {
  return (
    <Reveal className="h-full">
      <div className="group flex h-full flex-col overflow-hidden rounded-2xl bg-white transition-shadow duration-300 hover:shadow-[0_18px_50px_-24px_rgba(16,19,24,0.28)]" style={{ border: `1px solid ${LINE}` }}>
        <div className="overflow-hidden">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={img} alt={alt} className="aspect-[16/10] w-full object-cover transition-transform duration-700 group-hover:scale-[1.04]" />
        </div>
        <div className="flex flex-1 flex-col p-7">
          <h3 className="font-display text-xl font-bold leading-snug" style={{ color: INK }}>{title}</h3>
          <p className="mt-3 flex-1 text-[0.95rem] leading-relaxed" style={{ color: BODY }}>{desc}</p>
          <div className="mt-6"><BlueButton href={href}>Find out more</BlueButton></div>
        </div>
      </div>
    </Reveal>
  );
}

/* 1) Outcome cards */
export function ValueCards() {
  return (
    <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
      <PhotoCard href="/solutions/reporting" img="/images/home-reporting.jpg" alt="Team reviewing performance data and charts around a desk"
        title="Collect once, report many times" desc="Bring activity data, supplier responses and evidence into one workspace, then reuse the same figures across every framework you report to." />
      <PhotoCard href="/solutions/supply-chain" img="/images/home-supplychain.jpg" alt="Warehouse aisle with racking and a forklift"
        title="Reduce supply chain risk" desc="Invite suppliers, collect primary data and close the estimate-heavy gaps that weaken Scope 3 across your value chain." />
      <PhotoCard href="/platform/ecovadis" img="/images/home-trust.jpg" alt="Colleagues in a meeting reviewing documents in a modern office"
        title="Win customer and tender trust" desc="Answer buyer questionnaires and tender requirements with figures you can trace back to their source, method and owner." />
    </div>
  );
}

/* 2) Solutions for every team */
export function TeamCards() {
  return (
    <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
      <PhotoCard href="/solutions/reporting" img="/images/team-reporting.jpg" alt="Hands reviewing a printed business report with charts"
        title="Reporting" desc="Prepare framework-ready disclosures from one dataset, with evidence connected to every figure." />
      <PhotoCard href="/solutions/supply-chain" img="/images/container-port.jpg" alt="Container port with stacked shipping containers"
        title="Supply Chain" desc="Engage suppliers, collect primary data and strengthen Scope 3 across your value chain." />
      <PhotoCard href="/solutions/product-footprint" img="/images/team-product.jpg" alt="Worker operating machinery on a modern factory line"
        title="Product Footprint" desc="Measure product-level emissions and life-cycle impact, ready for customers and disclosure." />
    </div>
  );
}

/* 3) Shaped around your sector */
export function SectorCards() {
  return (
    <div className="grid gap-6 sm:grid-cols-2">
      <PhotoCard href="/industries/manufacturing" img="/images/manufacturing-welder.jpg" alt="Welder working on a steel fabrication bench"
        title="Manufacturing" desc="Energy, process emissions, materials, logistics and supplier data, mapped to Scope 1, 2 and 3 for industrial operations." />
      <PhotoCard href="/industries/events" img="/images/events-festival.jpg" alt="Festival crowd under falling confetti and stage lights"
        title="Events" desc="Venue energy, travel, catering, freight and waste captured across a whole event to build a credible footprint." />
    </div>
  );
}

/* ---------- Two feature cards: visual panel, bullets, button ---------- */
function FeaturePanelCard({ panel, title, bullets, href }: { panel: React.ReactNode; title: string; bullets: string[]; href: string }) {
  return (
    <Reveal className="h-full">
      <div className="flex h-full flex-col overflow-hidden rounded-2xl bg-white" style={{ border: `1px solid ${LINE}` }}>
        <div className="flex min-h-[172px] items-center justify-center px-6 py-9" style={{ background: "#eef1f4" }}>{panel}</div>
        <div className="flex flex-1 flex-col p-8">
          <h3 className="font-display text-2xl font-bold" style={{ color: INK }}>{title}</h3>
          <ul className="mt-5 space-y-3.5">
            {bullets.map((b) => (
              <li key={b} className="flex items-start gap-3 text-[0.95rem] leading-relaxed" style={{ color: BODY }}>
                <span aria-hidden className="mt-[0.6rem] h-1.5 w-1.5 shrink-0 rounded-full" style={{ background: "#9aa1ab" }} />
                <span>{b}</span>
              </li>
            ))}
          </ul>
          <div className="mt-8"><BlueButton href={href}>Find out more</BlueButton></div>
        </div>
      </div>
    </Reveal>
  );
}

function FrameworkChips() {
  return (
    <div className="flex flex-wrap items-center justify-center gap-3">
      {["CSRD", "UK SRS", "BRSR", "CBAM", "SECR"].map((f) => (
        <span key={f} className="rounded-xl bg-white px-4 py-3 font-display text-sm font-bold shadow-sm" style={{ border: `1px solid ${LINE}`, color: INK }}>{f}</span>
      ))}
    </div>
  );
}

function WorkflowChips() {
  const items = ["Scopes", "Suppliers", "Evidence", "Report"];
  return (
    <div className="flex w-full max-w-md items-center gap-1 rounded-xl bg-white p-1.5 shadow-sm" style={{ border: `1px solid ${LINE}` }}>
      {items.map((it, i) => (
        <span key={it} className="flex-1 rounded-lg px-2 py-2.5 text-center text-[0.82rem] font-semibold"
          style={i === items.length - 1 ? { background: "#eef1f4", color: INK } : { color: BODY }}>{it}</span>
      ))}
    </div>
  );
}

export function ComplianceCards() {
  return (
    <div className="grid gap-6 lg:grid-cols-2">
      <FeaturePanelCard panel={<FrameworkChips />} title="Stay compliant" href="/solutions/reporting"
        bullets={[
          "Collect your data once and reuse it across reporting frameworks",
          "Replace manual spreadsheets and the re-keying errors they cause",
          "Validation, ownership and evidence built into the workflow",
        ]} />
      <FeaturePanelCard panel={<WorkflowChips />} title="Cut reporting effort" href="/platform/carbon-assessment"
        bullets={[
          "See where your emissions and your effort actually concentrate",
          "Prioritise the gaps that make the biggest difference to your footprint",
          "Turn one dataset into every disclosure you are asked for",
        ]} />
    </div>
  );
}

/* ---------- Platform showcase ---------- */
const POINTS: [string, string][] = [
  ["Centralise your data", "ESGen brings activity data, supplier responses and evidence together across your organisation and value chain."],
  ["Report with confidence", "Prepare disclosures from a single, traceable source, with evidence connected to every figure."],
  ["Unlock value for everyone", "Share the same numbers across finance, procurement and operations so decisions line up."],
];

export function PlatformShowcase() {
  return (
    <div className="grid items-center gap-10 lg:grid-cols-[0.8fr_1.2fr]">
      <Reveal>
        <div className="rounded-2xl bg-white p-8" style={{ border: `1px solid ${LINE}` }}>
          <div className="space-y-8">
            {POINTS.map(([t, d]) => (
              <div key={t}>
                <h3 className="font-display text-xl font-bold" style={{ color: INK }}>{t}</h3>
                <p className="mt-2 text-[0.95rem] leading-relaxed" style={{ color: BODY }}>{d}</p>
              </div>
            ))}
          </div>
        </div>
      </Reveal>

      <Reveal className="min-w-0">
        <div className="relative">
          <EmissionsDisclosure />
          <div className="pointer-events-none absolute -bottom-8 -right-4 hidden w-[52%] xl:block">
            <AnomaliesCard />
          </div>
        </div>
      </Reveal>
    </div>
  );
}
