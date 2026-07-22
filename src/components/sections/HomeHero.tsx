import Link from "next/link";
import { Reveal } from "@/components/ui/Reveal";
import { HeroShowcase } from "@/components/sections/HeroShowcase";

const INK = "#101318";
const MUTED = "#565d68";

export function HomeHero() {
  return (
    <section className="relative overflow-hidden bg-white">
      <div className="mx-auto grid max-w-6xl items-center gap-20 px-5 pb-28 pt-28 sm:px-6 sm:pt-36 lg:grid-cols-[1.05fr_0.95fr] lg:gap-14">
        {/* Heading and CTA sit in front of the composition */}
        <div className="relative z-20">
          <Reveal>
            <h1 className="text-balance font-display text-4xl font-bold leading-[1.05] tracking-tight sm:text-5xl lg:text-[3.4rem]" style={{ color: INK }}>
              Turn ESG mandates into your competitive advantage.
            </h1>
          </Reveal>
          <Reveal delay={0.08}>
            <p className="mt-6 max-w-xl text-lg leading-relaxed" style={{ color: MUTED }}>
              ESGen measures your operational footprint and maps a precise, actionable pathway to the standards your customers, tenders and lenders ask about, so reporting becomes a foundation for growth rather than an administrative burden.
            </p>
          </Reveal>
          <Reveal delay={0.16}>
            <div className="mt-9 flex flex-wrap items-center gap-3">
              <Link href="/demo" className="inline-flex items-center gap-2 px-6 py-3.5 text-sm font-bold text-white transition-transform duration-300 hover:-translate-y-0.5" style={{ background: "#0b0d11" }}>
                Book a demo
                <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="M5 12h14M13 6l6 6-6 6" /></svg>
              </Link>
              <Link href="/platform/carbon-assessment" className="inline-flex items-center px-6 py-3.5 text-sm font-bold transition-colors duration-300 hover:bg-[#f2f4f7]" style={{ border: `1px solid ${INK}`, color: INK }}>
                Explore the platform
              </Link>
            </div>
          </Reveal>
        </div>

        <Reveal delay={0.12} className="relative z-10 min-w-0">
          <HeroShowcase />
        </Reveal>
      </div>
    </section>
  );
}
