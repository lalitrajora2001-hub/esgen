import type { Metadata } from "next";
import Link from "next/link";
import { Reveal } from "@/components/ui/Reveal";
import { SupplierHierarchy, SuppliersBoard, SupplierDetail } from "@/components/supplychain/SupplyChainVisuals";

export const metadata: Metadata = {
  title: "Supply Chain Decarbonisation",
  description: "ESGen streamlines supplier engagement so you can measure and reduce Scope 3 emissions across your value chain.",
  alternates: { canonical: "/solutions/supply-chain" },
};

const NAVY = "#12224f";

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

const OUTCOMES = [
  "Prioritise suppliers by emissions impact and spend",
  "Share clear reduction pathways with your vendors",
  "Track progress against supplier targets over time",
];

export default function SupplyChainPage() {
  return (
    <div className="bg-white" style={{ color: BODY }}>
      {/* Hero, network as ambient background */}
      <section className="relative overflow-hidden">
        <div aria-hidden className="pointer-events-none absolute inset-0" style={{ background: "radial-gradient(55% 55% at 78% 45%, rgba(16,19,24,0.05), transparent 60%), linear-gradient(180deg, #fffdf7, #ffffff 45%)" }} />
        <div className="relative mx-auto flex min-h-[560px] max-w-6xl items-center px-5 pb-16 pt-28 sm:min-h-[660px] sm:px-6">
          <div aria-hidden className="pointer-events-none absolute right-5 top-1/2 hidden w-[48%] -translate-y-1/2 sm:right-6 lg:block" style={{ WebkitMaskImage: "linear-gradient(90deg, transparent, #000 42%)", maskImage: "linear-gradient(90deg, transparent, #000 42%)" }}>
            <SupplierHierarchy />
          </div>
          <div className="relative max-w-xl">
            <Eyebrow>ESGen Supply Chain</Eyebrow>
            <h1 className="mt-4 font-display text-4xl font-bold leading-[1.07] tracking-tight sm:text-5xl" style={{ color: NAVY }}>
              Decarbonise your supply chain
            </h1>
            <p className="mt-5 max-w-md text-lg leading-relaxed" style={{ color: BODY }}>
              ESGen streamlines supplier engagement so you can measure and reduce Scope 3 emissions, working with your vendors and the teams and tools you already use.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <PrimaryBtn href="/demo">Request a demo</PrimaryBtn>
              <GhostBtn href="/platform/suppliers-engagement">Take a tour</GhostBtn>
            </div>
          </div>
        </div>
      </section>

      {/* Engage suppliers at scale */}
      <section className="py-16 sm:py-24">
        <div className="mx-auto grid max-w-6xl gap-12 px-5 sm:px-6 lg:grid-cols-2 lg:items-center">
          <Reveal>
            <H2>Engage suppliers at scale</H2>
            <p className="mt-5 max-w-lg text-lg leading-relaxed" style={{ color: BODY }}>
              For most businesses, Scope 3 emissions from suppliers and vendors make up the majority of their total carbon footprint. ESGen works directly with your value chain, and alongside your existing teams and tools, to measure and analyse supplier emissions quickly.
            </p>
          </Reveal>
          <Reveal><SuppliersBoard /></Reveal>
        </div>
      </section>

      {/* Understand supplier emissions */}
      <section className="py-16 sm:py-24" style={{ background: "#f8fafc" }}>
        <div className="mx-auto grid max-w-6xl gap-12 px-5 sm:px-6 lg:grid-cols-2 lg:items-center">
          <Reveal className="lg:order-2">
            <H2>Understand supplier emissions</H2>
            <p className="mt-5 max-w-lg text-lg leading-relaxed" style={{ color: BODY }}>
              See each supplier&rsquo;s emissions, targets, and actions in a single dashboard, then drill into individual suppliers to find the clearest opportunities for meaningful reduction.
            </p>
          </Reveal>
          <Reveal className="lg:order-1"><SupplierDetail /></Reveal>
        </div>
      </section>

      {/* Take action, together */}
      <section className="py-16 sm:py-24">
        <div className="mx-auto grid max-w-6xl gap-12 px-5 sm:px-6 lg:grid-cols-2 lg:items-center">
          <Reveal>
            <H2>Take action, together</H2>
            <p className="mt-5 max-w-lg text-lg leading-relaxed" style={{ color: BODY }}>
              Track an individual supplier&rsquo;s progress, or scale your engagement and reduction planning across many vendors at once, and make purchasing decisions informed by real climate action.
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

      {/* CTA */}
      <section className="py-16 sm:py-24">
        <div className="mx-auto max-w-6xl px-5 sm:px-6">
          <Reveal>
            <div className="overflow-hidden rounded-3xl px-8 py-14 text-center sm:px-16" style={{ background: "linear-gradient(155deg, #14171f 0%, #06070b 75%)" }}>
              <h2 className="mx-auto max-w-2xl font-display text-3xl font-bold text-white sm:text-4xl">Engage your suppliers and cut Scope 3</h2>
              <p className="mx-auto mt-4 max-w-xl text-lg text-white/85">See how ESGen helps you measure, understand, and reduce supplier emissions across your value chain.</p>
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
