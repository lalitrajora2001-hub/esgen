import type { Metadata } from "next";
import { Reveal } from "@/components/ui/Reveal";
import { INK, BODY, GCrumbs, GPrimaryBtn, GGhostBtn, GH2, GFaq, GreenCTA } from "@/components/platform/greenParts";
import { CEyebrow, FrameworkWall, ScopeNote } from "@/components/platform/complianceKit";
import { CbamCostModel, ImportFlow } from "@/components/platform/CbamVisuals";

export const metadata: Metadata = {
  title: "CBAM",
  description: "Understand your exposure to the carbon border adjustment mechanism, and collect the embedded-emissions data your declarations depend on.",
  alternates: { canonical: "/platform/cbam" },
};

const FAQS: [string, string][] = [
  ["What is CBAM?", "The Carbon Border Adjustment Mechanism puts a carbon price on certain goods imported into the EU, so that imports face a cost comparable to the one that EU producers pay under the EU Emissions Trading System."],
  ["Which goods are covered?", "Cement, iron and steel, aluminium, fertilisers, electricity, and hydrogen, together with certain downstream products made from them."],
  ["What are embedded emissions?", "The greenhouse gases released during the production of the imported good. They are the quantity CBAM is priced against, which is why the data has to come from the producing installation rather than an average."],
  ["What if a carbon price was already paid abroad?", "A carbon price effectively paid in the country of production can be deducted, so the same tonne is not charged twice. Evidence of that payment is required."],
  ["Is there a UK CBAM?", "The UK government has announced a UK CBAM intended to apply from 2027, covering a similar set of sectors. The design is still being finalised, so treat it as something to prepare for rather than a settled rulebook."],
  ["How does ESGen help?", "ESGen collects embedded-emissions data from your suppliers, keeps it against each good and installation, and models the exposure so you can see where the cost falls before the declaration is due."],
  ["Does the calculator give my actual liability?", "No. It is a simplified orientation model using placeholder intensities. Actual liabilities depend on verified installation data, the applicable adjustments, and the rules in force at the time."],
];

export default function CbamPage() {
  return (
    <div className="bg-white" style={{ color: BODY }}>
      {/* Hero — split, calculator carries the weight */}
      <section className="relative overflow-hidden pt-24 sm:pt-28">
        <div aria-hidden className="pointer-events-none absolute inset-x-0 top-0 h-[440px]" style={{ background: "linear-gradient(180deg,#f5faf7,#ffffff 72%)" }} />
        <div className="relative mx-auto max-w-6xl px-5 sm:px-6">
          <GCrumbs last="CBAM" />
          <div className="mt-8 max-w-3xl">
            <CEyebrow>ESG compliance</CEyebrow>
            <h1 className="mt-4 font-display text-4xl font-bold leading-[1.05] tracking-tight sm:text-5xl" style={{ color: INK }}>
              Put a number on your carbon border exposure
            </h1>
            <p className="mt-6 max-w-xl text-lg leading-relaxed" style={{ color: BODY }}>
              CBAM prices the emissions embedded in what you import. Model the cost, then collect the supplier data that turns an estimate into a declaration.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <GPrimaryBtn href="/demo">Request a demo</GPrimaryBtn>
              <GGhostBtn href="/contact">Talk to our team</GGhostBtn>
            </div>
          </div>
          <div className="mt-14"><Reveal><CbamCostModel /></Reveal></div>
          <div className="mt-10 pb-4"><ScopeNote>The model above is for orientation only and uses placeholder emission intensities. Your actual obligations depend on the goods you import, verified installation data, and the rules in force at the time. Confirm your position with your advisers.</ScopeNote></div>
        </div>
      </section>

      {/* Why the data is the hard part — dark band */}
      <section className="py-16 sm:py-24">
        <div className="mx-auto max-w-6xl px-5 sm:px-6">
          <div className="overflow-hidden rounded-3xl bg-[#0d1411] p-8 sm:p-14">
            <div className="grid gap-10 lg:grid-cols-2 lg:items-center">
              <div>
                <span className="text-[0.68rem] font-bold uppercase tracking-[0.14em]" style={{ color: "#4ade80" }}>The real difficulty</span>
                <h2 className="mt-4 font-display text-3xl font-bold leading-tight text-white sm:text-4xl">The number has to come from the furnace, not a spreadsheet</h2>
                <p className="mt-5 max-w-md text-lg leading-relaxed text-white/65">
                  CBAM is priced on the emissions embedded in each consignment. That figure sits inside your supplier&rsquo;s installation, in a different country, often in a different language. Getting it is the work.
                </p>
              </div>
              <div className="space-y-3">
                {[
                  ["Ask the installation, not the trader", "Embedded emissions are a property of where the good was made, so the request has to reach that far up the chain."],
                  ["Default values carry a cost", "Where actual data is unavailable, defaults may apply — and they rarely flatter the importer."],
                  ["Evidence the carbon already paid", "A price paid at origin can reduce what you surrender, but only if you can show it was paid."],
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

      {/* Flow */}
      <section className="py-16 sm:py-24" style={{ background: "#f8faf9" }}>
        <div className="mx-auto max-w-6xl px-5 sm:px-6">
          <Reveal><div className="max-w-2xl"><GH2>From supplier data to surrendered certificates</GH2>
            <p className="mt-5 text-lg leading-relaxed" style={{ color: BODY }}>Four steps, each of which depends on the one before it holding up to scrutiny.</p></div></Reveal>
          <div className="mt-12"><ImportFlow /></div>
        </div>
      </section>

      <section className="py-16 sm:py-20">
        <div className="mx-auto max-w-6xl px-5 sm:px-6">
          <Reveal><h2 className="mx-auto max-w-2xl text-center font-display text-2xl font-bold sm:text-3xl" style={{ color: INK }}>The same supplier data serves more than CBAM</h2></Reveal>
          <div className="mt-10"><FrameworkWall highlight="CBAM" /></div>
        </div>
      </section>

      <section className="pb-16 sm:pb-24">
        <div className="mx-auto max-w-6xl px-5 sm:px-6">
          <GH2>Questions about CBAM</GH2>
          <div className="mt-10"><GFaq items={FAQS} /></div>
        </div>
      </section>

      <GreenCTA title="Start your journey now" intro="See how ESGen collects embedded-emissions data from the installations that actually hold it." />
    </div>
  );
}
