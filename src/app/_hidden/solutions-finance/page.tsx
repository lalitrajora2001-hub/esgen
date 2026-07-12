import type { Metadata } from "next";
import Link from "next/link";
import { Reveal } from "@/components/ui/Reveal";
import { FinanceDashboard } from "@/components/finance/FinanceDashboard";
import { FinanceFrameworks } from "@/components/finance/FinanceFrameworks";

export const metadata: Metadata = {
  title: "ESG for Financial Institutions",
  description: "Banks, asset managers, and insurers use ESGen to consolidate ESG and financed-emissions data in one place for efficient, auditable reporting.",
  alternates: { canonical: "/solutions/finance" },
};

const NAVY = "#12224f";
const SLATE = "#3f4a63";
const BODY = "#5b6472";
const BLUE = "#2f6fe0";

function Eyebrow({ children }: { children: React.ReactNode }) {
  return <p className="text-[0.72rem] font-bold uppercase tracking-[0.16em]" style={{ color: BLUE }}>{children}</p>;
}
function PrimaryBtn({ href, children }: { href: string; children: React.ReactNode }) {
  return <Link href={href} className="inline-flex items-center gap-2 rounded-lg px-5 py-3 text-sm font-semibold text-white transition-colors" style={{ background: BLUE }}>{children}<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" className="h-4 w-4"><path d="M5 12h14M13 6l6 6-6 6" /></svg></Link>;
}
function GhostBtn({ href, children }: { href: string; children: React.ReactNode }) {
  return <Link href={href} className="inline-flex items-center gap-2 rounded-lg bg-[#eef1f6] px-5 py-3 text-sm font-semibold transition-colors hover:bg-[#e4e9f2]" style={{ color: BLUE }}>{children}</Link>;
}
function H2({ children }: { children: React.ReactNode }) {
  return <h2 className="font-display text-3xl font-bold leading-[1.1] tracking-tight sm:text-4xl" style={{ color: NAVY }}>{children}</h2>;
}

const DATA_SOURCES = [
  "Company-level reference data",
  "PCAF-aligned emissions scores",
  "External disclosures such as CDP",
  "Primary survey data from your assets",
  "A broad emission-factor database",
];
const ASSET_CLASSES = [
  "Listed equity & corporate bonds",
  "Unlisted equity & business loans",
  "Commercial lines of insurance",
  "Sovereign debt",
  "Mortgages, and more",
];
const OUTCOMES = [
  "PCAF-aligned methods for financed emissions",
  "Peer benchmarking to see where you stand",
  "A rigorous estimation engine for data gaps",
];

export default function FinanceSolutionPage() {
  return (
    <div className="bg-white" style={{ color: BODY }}>
      {/* Hero */}
      <section className="relative overflow-hidden pt-28 pb-16 sm:pt-32 sm:pb-20">
        <div aria-hidden className="pointer-events-none absolute inset-0" style={{ background: "radial-gradient(55% 55% at 8% 100%, rgba(120,160,240,0.18), transparent 60%), linear-gradient(180deg, #fffdf7, #ffffff 40%)" }} />
        <div className="relative mx-auto grid max-w-6xl items-center gap-12 px-5 sm:px-6 lg:grid-cols-[1.05fr_1.2fr]">
          <div>
            <Eyebrow>ESGen Finance</Eyebrow>
            <h1 className="mt-4 font-display text-4xl font-bold leading-[1.07] tracking-tight sm:text-5xl" style={{ color: SLATE }}>
              The complete ESG solution for financial institutions
            </h1>
            <p className="mt-5 max-w-md text-lg leading-relaxed" style={{ color: BODY }}>
              Banks, asset managers, and insurers use ESGen to consolidate their ESG and financed-emissions data in one place for more efficient, auditable reporting.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <PrimaryBtn href="/demo">Request a demo</PrimaryBtn>
              <GhostBtn href="/platform/carbon-assessment">Take a tour</GhostBtn>
            </div>
          </div>
          <Reveal className="min-w-0"><FinanceDashboard /></Reveal>
        </div>
      </section>

      {/* Consolidate data */}
      <section className="py-16 sm:py-24">
        <div className="mx-auto grid max-w-6xl gap-12 px-5 sm:px-6 lg:grid-cols-2 lg:items-center">
          <Reveal>
            <H2>Consolidate all your data in one place <span style={{ color: BLUE }}>→</span></H2>
            <p className="mt-4 text-xl font-semibold" style={{ color: BLUE }}>Get a complete and auditable view</p>
            <p className="mt-4 max-w-lg text-lg leading-relaxed" style={{ color: BODY }}>
              Collect, estimate, and aggregate emissions data from your core business and every asset in one place, reducing overhead and giving you sharper insight into your levers for progress.
            </p>
          </Reveal>
          <Reveal>
            <ul className="space-y-0">
              {DATA_SOURCES.map((s) => (
                <li key={s} className="border-l-2 py-4 pl-5 text-lg" style={{ borderColor: "#dbe3f2", color: NAVY }}>{s}</li>
              ))}
            </ul>
          </Reveal>
        </div>
      </section>

      {/* Asset classes */}
      <section className="py-16 sm:py-24" style={{ background: "#f8fafc" }}>
        <div className="mx-auto grid max-w-6xl gap-12 px-5 sm:px-6 lg:grid-cols-2 lg:items-center">
          <Reveal><H2>Cover a wide range of asset classes</H2></Reveal>
          <Reveal>
            <p className="max-w-lg text-lg leading-relaxed" style={{ color: BODY }}>
              Scale your sustainability reporting across a growing number of asset classes supported within ESGen Finance, including:
            </p>
            <ul className="mt-5 space-y-3">
              {ASSET_CLASSES.map((a) => (
                <li key={a} className="flex items-start gap-3 text-lg" style={{ color: NAVY }}>
                  <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full" style={{ background: BLUE }} />{a}
                </li>
              ))}
            </ul>
          </Reveal>
        </div>
      </section>

      {/* Power reports */}
      <section className="py-16 sm:py-24">
        <div className="mx-auto grid max-w-6xl gap-12 px-5 sm:px-6 lg:grid-cols-2 lg:items-center">
          <Reveal>
            <H2>Power reporting and better decisions</H2>
            <p className="mt-4 text-xl font-semibold" style={{ color: BLUE }}>Better data leads to better outcomes</p>
            <p className="mt-4 max-w-lg text-lg leading-relaxed" style={{ color: BODY }}>
              Turn a complete, auditable dataset into clear reports and benchmarks, so your teams can act with confidence and show their working.
            </p>
          </Reveal>
          <Reveal>
            <ul className="space-y-3">
              {OUTCOMES.map((o) => (
                <li key={o} className="flex items-start gap-3 rounded-xl border border-[#e6e8ee] bg-white px-4 py-4 text-base font-medium" style={{ color: NAVY }}>
                  <svg viewBox="0 0 24 24" fill="none" stroke={BLUE} strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" className="mt-0.5 h-5 w-5 shrink-0"><path d="M5 13l4 4L19 7" /></svg>{o}
                </li>
              ))}
            </ul>
          </Reveal>
        </div>
      </section>

      {/* Frameworks */}
      <section className="py-16 sm:py-20" style={{ background: "#fbfaf6" }}>
        <div className="mx-auto max-w-6xl px-5 sm:px-6">
          <Reveal>
            <h2 className="mx-auto max-w-2xl text-center font-display text-2xl font-bold sm:text-3xl" style={{ color: NAVY }}>Built for financial-sector reporting standards</h2>
            <p className="mx-auto mt-3 max-w-xl text-center text-base" style={{ color: BODY }}>ESGen is designed to support the disclosure standards and frameworks that matter to financial institutions.</p>
          </Reveal>
          <div className="mt-10"><FinanceFrameworks /></div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 sm:py-24">
        <div className="mx-auto max-w-6xl px-5 sm:px-6">
          <Reveal>
            <div className="overflow-hidden rounded-3xl px-8 py-14 text-center sm:px-16" style={{ background: "linear-gradient(155deg, #14171f 0%, #06070b 75%)" }}>
              <h2 className="mx-auto max-w-2xl font-display text-3xl font-bold text-white sm:text-4xl">Bring your financed emissions into one place</h2>
              <p className="mx-auto mt-4 max-w-xl text-lg text-white/85">See how ESGen consolidates ESG and financed-emissions data for efficient, auditable reporting.</p>
              <div className="mt-8 flex flex-wrap justify-center gap-3">
                <Link href="/demo" className="inline-flex items-center gap-2 rounded-lg bg-white px-5 py-3 text-sm font-semibold" style={{ color: BLUE }}>Request a demo <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" className="h-4 w-4"><path d="M5 12h14M13 6l6 6-6 6" /></svg></Link>
                <Link href="/contact" className="inline-flex items-center gap-2 rounded-lg border border-white/40 px-5 py-3 text-sm font-semibold text-white transition-colors hover:bg-white/10">Contact us</Link>
              </div>
            </div>
          </Reveal>
        </div>
      </section>
    </div>
  );
}
