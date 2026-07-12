import type { Metadata } from "next";
import { Reveal } from "@/components/ui/Reveal";
import { Eyebrow, PrimaryBtn, GhostBtn, WhiteCTA, WNAVY, WBODY } from "@/components/whiteui/parts";
import { ProductGraphHero, ProductsTable, PcfReport, ProductionGraphMini, MaterialsCompare, CorporateFootprint, VariantBars } from "@/components/productfootprint/ProductFootprintVisuals";

export const metadata: Metadata = {
  title: "Product Carbon Footprints",
  description: "Measure the carbon footprint of every product across its life cycle, respond to customer PCF requests, and design lower-carbon goods.",
  alternates: { canonical: "/solutions/product-footprint" },
};

const METHODS = ["ISO 14067", "GHG Protocol Product Standard", "ISO 14040 / 44", "PEF", "PACT"];

const FEATURES: { viz: React.ReactNode; title: string; desc: string }[] = [
  { viz: <ProductsTable />, title: "Build PCFs across your portfolio", desc: "Create a product carbon footprint for every product you make, accounting for the nuance of each supply chain." },
  { viz: <PcfReport />, title: "Create clear PCF reports", desc: "Produce structured, cradle-to-gate PCF reports so you can answer customer data requests with confidence." },
  { viz: <ProductionGraphMini />, title: "See the full supply chain behind each PCF", desc: "Every PCF is backed by a production graph that breaks down each input, process, and material." },
  { viz: <MaterialsCompare />, title: "Compare materials on cost and emissions", desc: "Put material and supplier options side by side to support procurement and design decisions." },
  { viz: <CorporateFootprint />, title: "Roll PCFs into your corporate footprint", desc: "Connect product footprints to your Scope 1, 2, and 3 inventory so product progress shows up in reporting." },
  { viz: <VariantBars />, title: "Market lower-carbon products", desc: "Understand what drives emissions so you can build and substantiate lower-carbon products." },
];

export default function ProductFootprintPage() {
  return (
    <div className="bg-white" style={{ color: WBODY }}>
      {/* Hero */}
      <section className="relative overflow-hidden pt-28 pb-16 sm:pt-32 sm:pb-20">
        <div aria-hidden className="pointer-events-none absolute inset-0" style={{ background: "radial-gradient(55% 55% at 82% 40%, rgba(120,160,240,0.10), transparent 60%), linear-gradient(180deg, #fffdf7, #ffffff 45%)" }} />
        <div className="relative mx-auto grid max-w-6xl items-center gap-12 px-5 sm:px-6 lg:grid-cols-[1.02fr_1.15fr]">
          <div>
            <Eyebrow>ESGen Product Footprint</Eyebrow>
            <h1 className="mt-4 font-display text-4xl font-bold leading-[1.07] tracking-tight sm:text-5xl" style={{ color: WNAVY }}>
              PCFs that reflect your unique supply chain
            </h1>
            <p className="mt-5 max-w-md text-lg leading-relaxed" style={{ color: WBODY }}>
              Measure the carbon footprint of every product across its life cycle, respond to customer PCF requests, and build the insight to design and source lower-carbon goods.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <PrimaryBtn href="/demo">Request a demo</PrimaryBtn>
              <GhostBtn href="/platform/lca">Take a tour</GhostBtn>
            </div>
          </div>
          <Reveal className="min-w-0"><ProductGraphHero /></Reveal>
        </div>
      </section>

      {/* Feature grid */}
      <section className="py-14 sm:py-20">
        <div className="mx-auto max-w-6xl px-5 sm:px-6">
          <div className="max-w-2xl">
            <h2 className="font-display text-3xl font-bold leading-[1.1] tracking-tight sm:text-4xl" style={{ color: WNAVY }}>PCFs that protect and drive value</h2>
            <p className="mt-4 text-lg leading-relaxed" style={{ color: WBODY }}>
              Respond to customer requests, inform procurement, and design lower-carbon goods, all from product footprints grounded in your real data.
            </p>
          </div>
          <div className="mt-12 grid gap-x-8 gap-y-14 sm:grid-cols-2">
            {FEATURES.map((f) => (
              <div key={f.title}>
                {f.viz}
                <h3 className="mt-6 font-display text-xl font-bold tracking-tight" style={{ color: WNAVY }}>{f.title}</h3>
                <p className="mt-2 max-w-md text-base leading-relaxed" style={{ color: WBODY }}>{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Methods */}
      <section className="py-16 sm:py-20" style={{ background: "#fbfaf6" }}>
        <div className="mx-auto max-w-6xl px-5 sm:px-6">
          <Reveal>
            <h2 className="mx-auto max-w-2xl text-center font-display text-2xl font-bold sm:text-3xl" style={{ color: WNAVY }}>Built on recognised LCA standards</h2>
            <p className="mx-auto mt-3 max-w-xl text-center text-base" style={{ color: WBODY }}>ESGen&rsquo;s product footprints are designed to align with recognised life-cycle assessment and product-carbon standards.</p>
          </Reveal>
          <div className="mt-10 grid grid-cols-2 gap-3 sm:grid-cols-3 sm:gap-4 lg:grid-cols-5">
            {METHODS.map((m) => (
              <div key={m} className="flex min-h-[84px] items-center justify-center rounded-2xl border border-[#e6e8ee] bg-white px-4 py-5 text-center">
                <span className="font-display text-sm font-extrabold tracking-tight" style={{ color: "#111827" }}>{m}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      <WhiteCTA title="Measure the footprint of every product" intro="See how ESGen helps you build product carbon footprints and design lower-carbon goods." />
    </div>
  );
}
