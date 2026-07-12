import type { Metadata } from "next";
import { Reveal } from "@/components/ui/Reveal";
import { INK, BODY, GCrumbs, GPrimaryBtn, GGhostBtn, GH2, GFaq, GreenCTA } from "@/components/platform/greenParts";
import { CEyebrow, FactStrip, ScopeNote } from "@/components/platform/complianceKit";
import { PrincipleBoard, ReportAnatomy } from "@/components/platform/BrsrVisuals";

export const metadata: Metadata = {
  title: "BRSR",
  description: "Prepare India's Business Responsibility and Sustainability Report with structured, principle-wise ESG data and traceable evidence.",
  alternates: { canonical: "/platform/brsr" },
};

const FACTS: [string, string][] = [
  ["Set by SEBI", "The Business Responsibility and Sustainability Report is required under SEBI's listing regulations, replacing the earlier BRR format."],
  ["Top 1,000 listed entities", "Mandatory for the top 1,000 listed companies by market capitalisation, with others able to file voluntarily."],
  ["BRSR Core assurance", "A subset of key indicators is subject to assurance or assessment, phased in from the largest listed companies downwards."],
];

const FAQS: [string, string][] = [
  ["What is the BRSR?", "India's Business Responsibility and Sustainability Report — a structured ESG disclosure that listed companies file with their annual report under SEBI's listing regulations. It replaced the earlier, lighter Business Responsibility Report."],
  ["Who has to file it?", "The top 1,000 listed entities by market capitalisation must file; other listed companies may adopt it voluntarily. If you are in an Indian group or supply chain, the request can also reach you from a customer who files."],
  ["What are the nine principles?", "The National Guidelines on Responsible Business Conduct set nine principles covering ethics, product sustainability, employee well-being, stakeholders, human rights, environment, policy advocacy, inclusive growth, and consumer value. Section C of the BRSR reports against each one."],
  ["What is the difference between essential and leadership indicators?", "Essential indicators are mandatory for every filer. Leadership indicators are voluntary — for companies that want to demonstrate more than the minimum and can evidence it."],
  ["What is BRSR Core?", "A focused subset of key performance indicators that SEBI subjects to assurance or assessment, phased in from the largest listed companies. SEBI has adjusted the timelines and requirements more than once, so check the current position for your filing year."],
  ["How does ESGen help?", "The heaviest data in a BRSR sits in Principle 6: energy, emissions, water, effluents, and waste. That is exactly the inventory ESGen builds, with the source and method retained against each figure. Responsibility for the filing remains with the company."],
];

export default function BrsrPage() {
  return (
    <div className="bg-white" style={{ color: BODY }}>
      {/* Hero — board leads */}
      <section className="relative overflow-hidden pt-24 sm:pt-28">
        <div aria-hidden className="pointer-events-none absolute inset-x-0 top-0 h-[440px]" style={{ background: "linear-gradient(180deg,#f5faf7,#ffffff 72%)" }} />
        <div className="relative mx-auto max-w-6xl px-5 sm:px-6">
          <GCrumbs last="BRSR" />
          <div className="mt-8 max-w-3xl">
            <CEyebrow>ESG compliance</CEyebrow>
            <h1 className="mt-4 font-display text-4xl font-bold leading-[1.05] tracking-tight sm:text-5xl" style={{ color: INK }}>
              Nine principles. One report. India&rsquo;s BRSR.
            </h1>
            <p className="mt-6 max-w-xl text-lg leading-relaxed" style={{ color: BODY }}>
              SEBI&rsquo;s Business Responsibility and Sustainability Report structures ESG disclosure around the NGRBC principles. ESGen organises the data behind each one, with the environment principle — the heaviest — fed straight from your inventory.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <GPrimaryBtn href="/demo">Request a demo</GPrimaryBtn>
              <GGhostBtn href="/contact">Talk to our team</GGhostBtn>
            </div>
          </div>
          <div className="mt-14"><Reveal><PrincipleBoard /></Reveal></div>
          <div className="mt-10 pb-4"><ScopeNote>Whether and how the BRSR applies to you depends on SEBI&rsquo;s listing regulations and your own circumstances, and SEBI has revised the assurance and value-chain requirements more than once. Confirm the current position for your filing year with your advisers.</ScopeNote></div>
        </div>
      </section>

      {/* Facts */}
      <section className="py-14 sm:py-20">
        <div className="mx-auto max-w-6xl px-5 sm:px-6">
          <Reveal><FactStrip items={FACTS} /></Reveal>
        </div>
      </section>

      {/* Report anatomy */}
      <section className="py-16 sm:py-24" style={{ background: "#f8faf9" }}>
        <div className="mx-auto max-w-6xl px-5 sm:px-6">
          <Reveal>
            <div className="max-w-2xl">
              <GH2>Three sections, unevenly heavy</GH2>
              <p className="mt-5 text-lg leading-relaxed" style={{ color: BODY }}>
                Sections A and B are mostly facts and policies. Section C is where the year&rsquo;s work concentrates — indicator after indicator, principle by principle.
              </p>
            </div>
          </Reveal>
          <div className="mt-12"><ReportAnatomy /></div>
        </div>
      </section>

      {/* P6 = the inventory */}
      <section className="py-16 sm:py-24">
        <div className="mx-auto max-w-6xl px-5 sm:px-6">
          <div className="overflow-hidden rounded-3xl bg-[#0d1411] p-8 sm:p-14">
            <div className="grid gap-10 lg:grid-cols-2 lg:items-center">
              <div>
                <span className="text-[0.68rem] font-bold uppercase tracking-[0.14em]" style={{ color: "#4ade80" }}>Principle 6</span>
                <h2 className="mt-4 font-display text-3xl font-bold leading-tight text-white sm:text-4xl">The environment principle is an inventory in disguise</h2>
                <p className="mt-5 max-w-md text-lg leading-relaxed text-white/65">
                  Energy consumed, Scope 1 and 2 emissions, water withdrawn and discharged, waste generated and recovered — Principle 6 asks for the same structured data a carbon inventory holds. Build it once and the filing draws from it every year.
                </p>
              </div>
              <div className="space-y-3">
                {[
                  ["Energy & emissions", "Total energy consumed and intensity, Scope 1 and 2 emissions, and Scope 3 where you report it."],
                  ["Water & effluents", "Withdrawal by source, consumption, and discharge by treatment level."],
                  ["Waste", "Generated by category, recovered through reuse and recycling, and disposed."],
                ].map(([t, d]) => (
                  <div key={t} className="rounded-xl bg-white/[0.04] p-4 ring-1 ring-white/10">
                    <h3 className="font-display text-[0.95rem] font-bold text-white">{t}</h3>
                    <p className="mt-1.5 text-[0.84rem] leading-relaxed text-white/60">{d}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="py-16 sm:py-24" style={{ background: "#f8faf9" }}>
        <div className="mx-auto max-w-6xl px-5 sm:px-6">
          <GH2>Questions about the BRSR</GH2>
          <div className="mt-10"><GFaq items={FAQS} /></div>
        </div>
      </section>

      <GreenCTA title="Start your journey now" intro="See how ESGen turns one inventory into principle-wise BRSR evidence." />
    </div>
  );
}
