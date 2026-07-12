import type { Metadata } from "next";
import { Reveal } from "@/components/ui/Reveal";
import { INK, BODY, GCrumbs, GPrimaryBtn, GGhostBtn, GH2, GFaq, GreenCTA } from "@/components/platform/greenParts";
import { CEyebrow, FrameworkWall, ScopeNote } from "@/components/platform/complianceKit";
import { PassportCard } from "@/components/platform/DppVisuals";

export const metadata: Metadata = {
  title: "DPP",
  description: "Assemble the product-level data a Digital Product Passport carries, from materials and repairability to end of life.",
  alternates: { canonical: "/platform/dpp" },
};

const FAQS: [string, string][] = [
  ["What is a Digital Product Passport?", "A structured, machine-readable record of a product's sustainability information, reachable from a data carrier on the product itself, such as a QR code. It is introduced through the EU's Ecodesign for Sustainable Products Regulation."],
  ["What does it contain?", "It depends on the product category. Typically a unique identifier, information about materials and substances of concern, durability and repairability, and what should happen at end of life."],
  ["Which products will need one?", "The requirements are set category by category through delegated acts under the ESPR, with priority given to product groups such as textiles, batteries, electronics, and construction products. Timing follows those acts rather than a single date."],
  ["Who reads it?", "Different audiences see different fields. Consumers get repair and disposal information; recyclers get material composition; regulators and market surveillance see compliance data."],
  ["What is the hard part?", "The data does not exist in one place. Material composition sits with your suppliers, repairability with your design team, and recycled content with your procurement records. Assembling it per product is the work."],
  ["How does ESGen help?", "ESGen already holds product-level footprint and supplier data through its LCA and supplier modules. That is the same evidence base a passport draws on for materials, footprint, and end-of-life information."],
  ["Does ESGen issue the passport?", "No. ESGen organises the underlying product data. Issuing and hosting a compliant passport, and registering the identifier, remain the responsibility of the economic operator placing the product on the market."],
];

export default function DppPage() {
  return (
    <div className="bg-white" style={{ color: BODY }}>
      {/* Hero — the passport is the argument */}
      <section className="relative overflow-hidden pt-24 sm:pt-28">
        <div aria-hidden className="pointer-events-none absolute inset-x-0 top-0 h-[420px]" style={{ background: "linear-gradient(180deg,#f5faf7,#ffffff 74%)" }} />
        <div className="relative mx-auto max-w-6xl px-5 sm:px-6">
          <GCrumbs last="DPP" />
          <div className="mt-8 max-w-3xl">
            <CEyebrow>ESG compliance</CEyebrow>
            <h1 className="mt-4 font-display text-4xl font-bold leading-[1.05] tracking-tight sm:text-5xl" style={{ color: INK }}>
              Everything the product knows about itself, in one scan
            </h1>
            <p className="mt-6 max-w-xl text-lg leading-relaxed" style={{ color: BODY }}>
              A Digital Product Passport turns scattered product data into a structured record that a consumer, a recycler, or a regulator can read.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <GPrimaryBtn href="/demo">Request a demo</GPrimaryBtn>
              <GGhostBtn href="/contact">Talk to our team</GGhostBtn>
            </div>
          </div>
          <div className="mt-16 pb-4"><Reveal><PassportCard /></Reveal></div>
          <div className="mt-12 pb-4"><ScopeNote>Requirements are introduced product group by product group through delegated acts under the ESPR. Whether and when a passport is required for your products depends on those acts. Confirm your position with your advisers.</ScopeNote></div>
        </div>
      </section>

      {/* Different readers — three-column contrast */}
      <section className="py-16 sm:py-24" style={{ background: "#f8faf9" }}>
        <div className="mx-auto max-w-6xl px-5 sm:px-6">
          <Reveal><div className="max-w-2xl"><GH2>One record, three readers</GH2>
            <p className="mt-5 text-lg leading-relaxed" style={{ color: BODY }}>The passport is not a marketing page. Different audiences are entitled to different fields, and the record has to serve all of them.</p></div></Reveal>
          <div className="mt-12 grid gap-5 lg:grid-cols-3">
            {[
              ["The person who bought it", "How to repair it, how long parts remain available, and what to do with it when it is finished.", "M12 3a6 6 0 0 1 4 10.5V17H8v-3.5A6 6 0 0 1 12 3zM9 20h6"],
              ["The person who recycles it", "What it is made of, where the battery is, and which substances need separating before it is shredded.", "M7 6h10l-1 14H8zM10 6V4h4v2"],
              ["The person who checks it", "Whether the declared data matches the product actually placed on the market.", "M12 3l8 4v5c0 5-3.5 8.5-8 9-4.5-.5-8-4-8-9V7z"],
            ].map(([t, d, icon], i) => (
              <Reveal key={t}>
                <div className="h-full rounded-2xl p-7" style={{ background: i === 1 ? "#0d1411" : "#fff", border: i === 1 ? "none" : "1px solid #e6ece7" }}>
                  <svg viewBox="0 0 24 24" className="h-7 w-7" fill="none" stroke={i === 1 ? "#4ade80" : "#15803d"} strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"><path d={icon} /></svg>
                  <h3 className="mt-5 font-display text-lg font-bold leading-tight" style={{ color: i === 1 ? "#fff" : INK }}>{t}</h3>
                  <p className="mt-2.5 text-[0.88rem] leading-relaxed" style={{ color: i === 1 ? "rgba(255,255,255,0.62)" : BODY }}>{d}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* Where the data comes from */}
      <section className="py-16 sm:py-24">
        <div className="mx-auto max-w-6xl px-5 sm:px-6">
          <Reveal><div className="max-w-2xl"><GH2>The passport is only as good as the bill of materials</GH2>
            <p className="mt-5 text-lg leading-relaxed" style={{ color: BODY }}>
              Material composition sits with your suppliers. Footprint comes from a life-cycle assessment. Recycled content lives in procurement records. A passport is the moment those three finally have to agree.
            </p></div></Reveal>
          <div className="mt-12 grid gap-px overflow-hidden rounded-2xl border border-[#e6ece7] bg-[#e6ece7] sm:grid-cols-3">
            {[
              ["From your suppliers", "Material composition, substances of concern, and the origin of each component."],
              ["From your LCA", "The product footprint, per life-cycle stage, with the factors and method retained."],
              ["From your operations", "Recycled input, spare-part availability, and the take-back route you actually offer."],
            ].map(([t, d]) => (
              <div key={t} className="bg-white p-6">
                <h3 className="font-display text-base font-bold" style={{ color: INK }}>{t}</h3>
                <p className="mt-2 text-[0.86rem] leading-relaxed" style={{ color: BODY }}>{d}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-16 sm:py-20" style={{ background: "#f8faf9" }}>
        <div className="mx-auto max-w-6xl px-5 sm:px-6">
          <Reveal><h2 className="mx-auto max-w-2xl text-center font-display text-2xl font-bold sm:text-3xl" style={{ color: INK }}>Product data that serves more than the passport</h2></Reveal>
          <div className="mt-10"><FrameworkWall highlight="DPP" /></div>
        </div>
      </section>

      <section className="py-16 sm:py-24">
        <div className="mx-auto max-w-6xl px-5 sm:px-6">
          <GH2>Questions about Digital Product Passports</GH2>
          <div className="mt-10"><GFaq items={FAQS} /></div>
        </div>
      </section>

      <GreenCTA title="Start your journey now" intro="See how ESGen assembles the product-level data a passport has to carry." />
    </div>
  );
}
