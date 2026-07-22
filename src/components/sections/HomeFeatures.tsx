import Link from "next/link";
import { Reveal } from "@/components/ui/Reveal";
import { EmissionsDisclosure, AnomaliesCard } from "@/components/reporting/ReportingVisuals";
import { FrameworkRow } from "@/components/frameworks";

/* Light homepage band: white cards, black headings, grey body, blue buttons. */
const INK = "#101318";
const BODY = "#565d68";
const LINE = "#e6e8ec";
const BLUE = "#121317";

function Arrow() {
  return <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="M5 12h14M13 6l6 6-6 6" /></svg>;
}

function BlueButton({ href, children }: { href: string; children: React.ReactNode }) {
  return (
    <Link href={href} className="inline-flex w-fit items-center gap-2 px-6 py-3.5 text-sm font-bold text-white transition-transform duration-300 hover:-translate-y-0.5" style={{ background: BLUE }}>
      {children} <Arrow />
    </Link>
  );
}

export function LightHead({ eyebrow, title, intro }: { eyebrow?: string; title: string; intro?: string }) {
  return (
    <div className="mx-auto max-w-2xl text-center">
      {eyebrow && (
        <Reveal>
          <p className="font-mono text-[0.72rem] uppercase tracking-[0.2em]" style={{ color: BODY }}>{eyebrow}</p>
        </Reveal>
      )}
      <Reveal delay={eyebrow ? 0.06 : 0}>
        <h2 style={{ color: INK }} className={`text-balance font-display text-3xl font-bold tracking-tight sm:text-4xl ${eyebrow ? "mt-3" : ""}`}>{title}</h2>
      </Reveal>
      {intro && (
        <Reveal delay={0.12}>
          <p className="mt-4 text-lg leading-relaxed" style={{ color: BODY }}>{intro}</p>
        </Reveal>
      )}
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
          <h3 className="font-display text-xl font-bold tracking-tight" style={{ color: INK }}>{title}</h3>
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
function FeaturePanelCard({ panel, photo, alt, title, bullets, href }: { panel?: React.ReactNode; photo?: string; alt?: string; title: string; bullets: string[]; href: string }) {
  return (
    <Reveal className="h-full">
      <div className="flex h-full flex-col overflow-hidden rounded-2xl bg-white" style={{ border: `1px solid ${LINE}` }}>
        {photo ? (
          <div className="overflow-hidden">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={photo} alt={alt ?? ""} className="h-[218px] w-full object-cover" />
          </div>
        ) : (
          <div className="flex min-h-[218px] items-center justify-center px-6 py-9" style={{ background: "#f2f4f7" }}>{panel}</div>
        )}
        <div className="flex flex-1 flex-col p-8">
          <h3 className="font-display text-2xl font-bold tracking-tight" style={{ color: INK }}>{title}</h3>
          <ul className="mt-5 flex-1 space-y-3.5">
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

export function ComplianceCards() {
  return (
    <div className="grid gap-6 lg:grid-cols-2">
      <FeaturePanelCard panel={<FrameworkRow keys={["csrd", "gri", "brsr", "cdp", "issb", "tcfd"]} />} title="Stay compliant" href="/solutions/reporting"
        bullets={[
          "Collect your data once and reuse it across reporting frameworks",
          "Replace manual spreadsheets and the re-keying errors they cause",
          "Validation, ownership and evidence built into the workflow",
        ]} />
      <FeaturePanelCard photo="/images/effort.jpg" alt="Hands organising paperwork efficiently at a desk" title="Cut reporting effort" href="/platform/carbon-assessment"
        bullets={[
          "See where your emissions and your effort actually concentrate",
          "Prioritise the gaps that make the biggest difference to your footprint",
          "Turn one dataset into every disclosure you are asked for",
        ]} />
    </div>
  );
}

/* ---------- How ESGen works: four light steps ---------- */
const STEPS: [string, string][] = [
  ["Assess", "Establish scope, boundaries and the data you already hold."],
  ["Collect", "Pull activity data and supplier responses into one structured place."],
  ["Report", "Map figures to the frameworks you answer to and build the disclosure."],
  ["Assure", "Keep evidence, method and ownership attached, ready for review."],
];

export function ProcessSteps() {
  return (
    <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
      {STEPS.map(([t, d], i) => (
        <Reveal key={t} delay={i * 0.08} className="h-full">
          <div className="flex h-full flex-col rounded-2xl bg-white p-7" style={{ border: `1px solid ${LINE}` }}>
            <span className="font-mono text-[0.72rem] tracking-[0.18em]" style={{ color: "#8a919c" }}>{`0${i + 1}`}</span>
            <h3 className="mt-4 font-display text-xl font-bold tracking-tight" style={{ color: INK }}>{t}</h3>
            <p className="mt-2 text-[0.95rem] leading-relaxed" style={{ color: BODY }}>{d}</p>
          </div>
        </Reveal>
      ))}
    </div>
  );
}

/* ---------- Closing CTA ---------- */
/* Black band CTA, the same concept as the industries pages. */
export function LightCta({
  title = "One inventory behind every answer you owe",
  intro = "Bring your emissions data, ESG evidence and reporting workflow into one clear workspace. Measured properly, kept defensible.",
}: { title?: string; intro?: string } = {}) {
  return (
    <section className="bg-white px-5 pb-20 pt-4 sm:px-6">
      <Reveal>
        <div className="mx-auto max-w-6xl bg-[#0b0d11] px-8 py-16 text-center sm:px-16">
          <h2 className="mx-auto max-w-2xl font-display text-3xl font-bold tracking-tight text-white sm:text-4xl">
            {title}
          </h2>
          <p className="mx-auto mt-4 max-w-xl text-lg text-white/70">
            {intro}
          </p>
          <div className="mt-9 flex flex-wrap justify-center gap-3">
            <Link href="/demo" className="inline-flex items-center gap-2 bg-white px-6 py-3.5 text-sm font-bold text-[#0b0d11] transition-transform hover:-translate-y-0.5">
              Book a demo <Arrow />
            </Link>
            <Link href="/contact" className="inline-flex items-center border border-white/40 px-6 py-3.5 text-sm font-bold text-white transition-colors hover:bg-white/10">
              Contact us
            </Link>
          </div>
        </div>
      </Reveal>
    </section>
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
