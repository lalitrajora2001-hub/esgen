import type { Metadata } from "next";
import Link from "next/link";
import { INDUSTRY_DATA } from "@/lib/industries";
import { Reveal } from "@/components/ui/Reveal";
import { FootprintBreakdown } from "@/components/industries/FootprintBreakdown";
import { OutputMapper } from "@/components/industries/IndustryInteractives";

export const metadata: Metadata = {
  title: "Manufacturing ESG Reporting Software",
  description: "Carbon accounting for manufacturers: measure materials, sites, and logistics, then answer CBAM requests, product footprints, and disclosures from one inventory.",
  alternates: { canonical: "/industries/manufacturing" },
};

/* Editorial white and black page in the style the owner asked for.
   Photography is stored locally under the Unsplash licence. */

const INK = "#101318";
const MUTED = "#565d68";
const LINE = "#e6e8ec";

const TILES: [string, string][] = [
  ["January 2026", "The EU's Carbon Border Adjustment Mechanism enters its definitive phase. Importers of steel, aluminium, cement, fertilisers, hydrogen, and electricity surrender certificates priced on embedded emissions."],
  ["2027", "The UK has announced its own CBAM, covering a similar set of carbon-intensive sectors. Manufacturers selling into both markets face two certificate regimes."],
  ["15", "Categories of Scope 3 emissions in the GHG Protocol. For most manufacturers the largest is Category 1, the goods and materials you purchase."],
];

const WHY: { icon: string; t: string; d: string }[] = [
  { icon: "M4 20h16M6 20V9l5 3V9l5 3V9l4 3v8M12 4v3", t: "One inventory across every site, entity, and ERP", d: "Manufacturing data lives in plants, subsidiaries, and supplier records that rarely share a format. ESGen brings it into a single inventory where every number traces back to its entity, its emission factor, and the method that produced it." },
  { icon: "M12 3l8 4v5c0 5-3.5 8.5-8 9-4.5-.5-8-4-8-9V7zM9 12l2 2 4-4", t: "Scope 3 Category 1, with the evidence attached", d: "Purchased goods and services is where a manufacturer's footprint concentrates and where reviewers ask the most questions. Each calculation carries its factor version, data source, and method as the inventory is built, not reconstructed before submission." },
  { icon: "M6 3h12v18H6zM9 7h6M9 11h6M9 15h4", t: "Product footprints from the bill of materials", d: "A product carbon footprint request needs BOM data, the right factors, and a method that survives your customer's own review. ESGen builds the figure from the materials you already track and keeps the workings with it." },
];

export default function ManufacturingPage() {
  const data = INDUSTRY_DATA.manufacturing;

  return (
    <div className="bg-white" style={{ color: INK }}>
      {/* Full-viewport grayscale hero, content held on the right; the page
          content starts on scroll */}
      <section className="relative flex min-h-[100svh] items-end overflow-hidden">
        <img src="/images/manufacturing-welder.jpg" alt="Welder working on a steel fabrication bench"
          className="absolute inset-0 h-full w-full object-cover" style={{ filter: "grayscale(1) contrast(1.05)" }} />
        <div aria-hidden className="absolute inset-0" style={{ background: "linear-gradient(110deg, rgba(11,13,17,0.85) 0%, rgba(11,13,17,0.5) 42%, rgba(11,13,17,0.18) 100%)" }} />
        <div aria-hidden className="absolute inset-x-0 bottom-0 h-40" style={{ background: "linear-gradient(180deg, transparent, rgba(11,13,17,0.6))" }} />
        <div aria-hidden className="absolute bottom-6 left-1/2 z-10 -translate-x-1/2">
          <span className="flex flex-col items-center gap-1.5 text-[0.6rem] font-bold uppercase tracking-[0.2em] text-white/60">
            Scroll
            <svg viewBox="0 0 24 24" className="h-4 w-4 motion-safe:animate-bounce" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M6 9l6 6 6-6" /></svg>
          </span>
        </div>
        <div className="relative mx-auto w-full max-w-6xl px-5 pb-20 pt-40 sm:px-6">
          <div className="max-w-xl">
            <nav aria-label="Breadcrumb" className="flex flex-wrap items-center gap-2 font-mono text-xs text-white/60">
              <Link href="/" className="hover:underline">Home</Link><span>/</span>
              <span>Industries</span><span>/</span>
              <span className="text-white">Manufacturing</span>
            </nav>
            <h1 className="mt-5 font-display text-4xl font-bold leading-[1.05] tracking-tight text-white sm:text-5xl">
              Carbon accounting for manufacturers. Audit-ready, tender-ready.
            </h1>
            <p className="mt-6 max-w-xl text-lg leading-relaxed text-white/80">
              Most of a manufacturer&rsquo;s footprint is upstream, in the materials you buy, not on a meter you can read. ESGen measures the whole picture and turns it into the answers your customers now ask for.
            </p>
            <div className="mt-9 flex flex-wrap gap-3">
              <Link href="/demo" className="inline-flex items-center gap-2 bg-white px-6 py-3.5 text-sm font-bold transition-transform hover:-translate-y-0.5" style={{ color: INK }}>
                Book a demo
                <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="M5 12h14M13 6l6 6-6 6" /></svg>
              </Link>
              <Link href="/contact" className="inline-flex items-center border border-white/50 px-6 py-3.5 text-sm font-bold text-white transition-colors hover:bg-white/10">
                Talk to our team
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Impacts: black stat tiles */}
      <section className="border-t py-16 sm:py-24" style={{ borderColor: LINE }}>
        <div className="mx-auto max-w-6xl px-5 sm:px-6">
          <div className="grid gap-8 lg:grid-cols-[0.5fr_1.5fr] lg:items-end">
            <h2 className="font-display text-3xl font-bold tracking-tight sm:text-4xl" style={{ color: INK }}>Impacts</h2>
            <p className="max-w-xl text-base leading-relaxed lg:justify-self-end" style={{ color: MUTED }}>
              Manufacturing generates a significant amount of carbon, and accounting for it is genuinely hard. Three numbers set the context.
            </p>
          </div>
          <div className="mt-10 grid gap-5 lg:grid-cols-3">
            {TILES.map(([big, small], i) => (
              <Reveal key={big}>
                <div className="flex h-full min-h-[280px] flex-col justify-between p-8 text-white" style={{ background: "#0b0d11", transitionDelay: `${i * 50}ms` }}>
                  <div className="font-display text-5xl font-bold leading-[1.05] tracking-tight sm:text-6xl">{big}</div>
                  <p className="mt-8 text-[0.92rem] leading-relaxed text-white/70">{small}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* Barriers: editorial prose + port photo */}
      <section className="py-16 sm:py-24">
        <div className="mx-auto grid max-w-6xl gap-12 px-5 sm:px-6 lg:grid-cols-[1.05fr_0.95fr]">
          <div>
            <h2 className="max-w-md font-display text-3xl font-bold leading-[1.1] tracking-tight sm:text-4xl" style={{ color: INK }}>Barriers to accurate carbon reporting</h2>
            <div className="mt-8 max-w-xl space-y-5 text-[1.02rem] leading-relaxed" style={{ color: "#3a414c" }}>
              <p>
                For most of the last decade, carbon reporting in manufacturing was a disclosure exercise. Something the sustainability team produced once a year, reviewed by the board, and filed with the annual report. The number mattered, but it did not affect the order book.
              </p>
              <p>That has changed on three fronts at once.</p>
              <p>
                <strong style={{ color: INK }}>CBAM turns your emissions into your customer&rsquo;s cost.</strong> From 2026, EU importers of covered goods surrender certificates priced against the EU carbon market, calculated on the emissions embedded in each consignment. Importers who cannot produce verified data fall back to default values, and defaults rarely flatter anyone. The UK has announced its own version for 2027. If you sell steel, aluminium, cement or products made from them into those markets, your data now sets someone&rsquo;s bill.
              </p>
              <p>
                <strong style={{ color: INK }}>Product footprint requests are in the sales inbox.</strong> Per-product carbon figures have moved from a nice-to-have into standard procurement questionnaires. Customers with their own CSRD or SBTi commitments need to know the embedded carbon in the goods they buy, and they are shortlisting suppliers accordingly.
              </p>
              <p>
                <strong style={{ color: INK }}>Your customers must now report your emissions.</strong> CSRD and UK SRS require in-scope companies to disclose their value chain. Their Scope 3 is your Scope 1 and 2, so the data request lands with you whether you are in scope yourself or not, and it has to hold up to their assurance provider, not just yours.
              </p>
              <p>
                The manufacturers who can produce a traceable, defensible carbon number for every product, every entity, and every year are the ones winning the bids the others are losing.
              </p>
            </div>
          </div>
          <div className="relative min-h-[380px] overflow-hidden lg:sticky lg:top-24 lg:h-[560px]">
            <img src="/images/container-port.jpg" alt="Aerial view of a container port with cranes and stacked shipping containers" className="absolute inset-0 h-full w-full object-cover" />
          </div>
        </div>
      </section>

      {/* Footprint breakdown (dark interactive reads as a black tile on white) */}
      <section className="border-t py-16 sm:py-24" style={{ borderColor: LINE }}>
        <div className="mx-auto max-w-6xl px-5 sm:px-6">
          <div className="max-w-2xl">
            <h2 className="font-display text-3xl font-bold tracking-tight sm:text-4xl" style={{ color: INK }}>Where the footprint actually sits</h2>
            <p className="mt-4 text-base leading-relaxed" style={{ color: MUTED }}>
              A typical manufacturer&rsquo;s emissions, category by category. Select a segment to see what drives it.
            </p>
          </div>
          <div className="mt-10"><Reveal><FootprintBreakdown title={data.footprintTitle} categories={data.categories} variant="light" /></Reveal></div>
        </div>
      </section>

      {/* Why ESGen: three editorial columns */}
      <section className="py-16 sm:py-24">
        <div className="mx-auto max-w-6xl px-5 sm:px-6">
          <h2 className="font-display text-3xl font-bold tracking-tight sm:text-4xl" style={{ color: INK }}>Why ESGen</h2>
          <div className="mt-12 grid gap-10 lg:grid-cols-3">
            {WHY.map((w, i) => (
              <Reveal key={w.t}>
                <div style={{ transitionDelay: `${i * 40}ms` }}>
                  <svg viewBox="0 0 24 24" className="h-7 w-7" fill="none" stroke={INK} strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"><path d={w.icon} /></svg>
                  <h3 className="mt-5 font-display text-xl font-bold leading-snug" style={{ color: INK }}>{w.t}</h3>
                  <p className="mt-3 text-[0.95rem] leading-relaxed" style={{ color: MUTED }}>{w.d}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* One inventory, three answers */}
      <section className="border-t py-16 sm:py-24" style={{ borderColor: LINE }}>
        <div className="mx-auto max-w-6xl px-5 sm:px-6">
          <div className="max-w-2xl">
            <h2 className="font-display text-3xl font-bold tracking-tight sm:text-4xl" style={{ color: INK }}>Collect once, answer everyone</h2>
            <p className="mt-4 text-base leading-relaxed" style={{ color: MUTED }}>
              Pick an output and watch which parts of the inventory feed it. The work is collecting the rows. The answers are then a mapping, not a new project.
            </p>
          </div>
          <div className="mt-10"><Reveal><OutputMapper /></Reveal></div>
        </div>
      </section>

      {/* FAQ */}
      <section className="py-16 sm:py-24">
        <div className="mx-auto grid max-w-6xl gap-12 px-5 sm:px-6 lg:grid-cols-[0.8fr_1.2fr]">
          <h2 className="font-display text-3xl font-bold tracking-tight sm:text-4xl" style={{ color: INK }}>Questions from manufacturing teams</h2>
          <div className="divide-y border-y" style={{ borderColor: LINE }}>
            {data.faqs.map(([q, a]) => (
              <details key={q} className="group py-5" style={{ borderColor: LINE }}>
                <summary className="flex cursor-pointer items-center justify-between gap-4 font-display text-base font-bold" style={{ color: INK }}>
                  {q}
                  <svg viewBox="0 0 24 24" fill="none" stroke={INK} strokeWidth="2.4" strokeLinecap="round" className="h-4 w-4 shrink-0 transition-transform group-open:rotate-45"><path d="M12 5v14M5 12h14" /></svg>
                </summary>
                <p className="mt-3 max-w-2xl text-[0.95rem] leading-relaxed" style={{ color: MUTED }}>{a}</p>
              </details>
            ))}
          </div>
        </div>
      </section>

      {/* Final CTA: black band */}
      <section className="px-5 pb-20 sm:px-6">
        <div className="mx-auto max-w-6xl bg-[#0b0d11] px-8 py-16 text-center sm:px-16">
          <h2 className="mx-auto max-w-2xl font-display text-3xl font-bold text-white sm:text-4xl">Carbon insight that reaches the order book</h2>
          <p className="mx-auto mt-4 max-w-xl text-lg text-white/70">One inventory behind your CBAM answers, product footprints, and disclosures. Measured properly, kept defensible.</p>
          <div className="mt-9 flex flex-wrap justify-center gap-3">
            <Link href="/demo" className="inline-flex items-center gap-2 bg-white px-6 py-3.5 text-sm font-bold text-[#0b0d11] transition-transform hover:-translate-y-0.5">
              Book a demo
              <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="M5 12h14M13 6l6 6-6 6" /></svg>
            </Link>
            <Link href="/contact" className="inline-flex items-center border border-white/40 px-6 py-3.5 text-sm font-bold text-white transition-colors hover:bg-white/10">
              Contact us
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
