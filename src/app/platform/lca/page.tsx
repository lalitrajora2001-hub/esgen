import type { Metadata } from "next";
import { Reveal } from "@/components/ui/Reveal";
import { INK, BODY, GREENDK, TINT, PEyebrow, GCheck, GCrumbs, HeroPanel, GPrimaryBtn, GH2, GFaq, GreenCTA } from "@/components/platform/greenParts";
import { LcaHeroCard, BomUpload, LcaAppShot, SourceTiles, CircularLoop, ProductLcaTabs, ComplianceOutputs, LcaSteps, PcfDemandChart } from "@/components/platform/LcaVisuals";

export const metadata: Metadata = {
  title: "Life Cycle Assessment (LCA)",
  description: "Model product life-cycle impact from raw materials to end of life, aligned with recognised LCA standards.",
  alternates: { canonical: "/platform/lca" },
};

const HERO_BULLETS = ["Deliver ISO-aligned LCAs in days, not months.", "Save time and effort with a proven methodology.", "Empower your team to become eco-design experts."];

const FEATURES: { tag: string; t: string; bullets: string[]; viz: React.ReactNode }[] = [
  {
    tag: "Productivity",
    t: "Save hours and focus on what matters: product insights",
    bullets: ["Upload a bill of materials and calculate a product's total environmental impact.", "Scale your footprints by matching raw data to the right emission factors.", "Generate structured reports for ISO, EPD, and DPP reporting needs."],
    viz: <BomUpload />,
  },
  {
    tag: "Expertise",
    t: "Turn your team into eco-design experts",
    bullets: ["Read clear, actionable insights instead of decoding complex graphs.", "Build a shared LCA framework on a transparent formula builder and factor database.", "Simulate lower-carbon material swaps to validate eco-design decisions."],
    viz: <LcaAppShot />,
  },
  {
    tag: "Precision & impact",
    t: "Maximise impact with reliable data",
    bullets: ["Draw on recognised life-cycle databases and government datasets.", "Create tailored emission factors for precision in your product modelling.", "Strengthen Scope 3 with self-service modules that pull data from your suppliers."],
    viz: <SourceTiles />,
  },
];

const AUDIENCES: [string, string][] = [
  ["Product engineers & LCA experts", "Design high-performance, sustainable products while cutting cost and development time."],
  ["Procurement & operations", "Drive data-backed decisions on cost and impact across your entire supply chain."],
  ["Sales & marketing", "Win more tenders and attract new clients by leading with a verified climate impact."],
  ["Sustainability & directors", "Ensure readiness for evolving requirements such as PEF, EPD, SECR, and CSRD."],
];

const FAQS: [string, string][] = [
  ["What is Life Cycle Assessment (LCA)?", "LCA is a method for evaluating the environmental impact of a product across its whole life cycle, from raw material extraction through manufacture, distribution, use, and end of life."],
  ["What are the four stages of an LCA?", "Goal and scope definition, inventory analysis, impact assessment, and interpretation. Together they set the boundaries, gather the data, translate it into impacts, and draw conclusions."],
  ["What is an LCA framework?", "A framework sets the rules for how an assessment is carried out, including boundaries, functional unit, data quality, and how results are reported. ISO 14040 and 14044 define the most widely used framework."],
  ["Who needs to perform an LCA?", "Any company that wants to understand or disclose the environmental impact of its products, whether to answer customer requests, support eco-design, or prepare for product-level regulation."],
  ["Why do a Life Cycle Assessment?", "It shows where a product's impact actually comes from, so you can reduce it at the source, back up lower-carbon claims, and meet growing customer and regulatory expectations."],
];

export default function LcaPage() {
  return (
    <div className="bg-white" style={{ color: BODY }}>
      {/* Hero */}
      <section className="relative overflow-hidden pt-28 pb-14 sm:pt-32">
        <div aria-hidden className="pointer-events-none absolute inset-0" style={{ background: "linear-gradient(180deg, #f5faf7, #ffffff 55%)" }} />
        <div className="relative mx-auto grid max-w-6xl items-center gap-12 px-5 sm:px-6 lg:grid-cols-[1fr_1fr]">
          <div>
            <GCrumbs last="LCA" />
            <div className="mt-6"><PEyebrow>Life cycle assessment</PEyebrow></div>
            <h1 className="mt-4 font-display text-4xl font-bold leading-[1.06] tracking-tight sm:text-5xl" style={{ color: INK }}>
              From spreadsheet LCAs to <span style={{ color: GREENDK }}>scalable eco-design</span>
            </h1>
            <ul className="mt-6 space-y-2.5">
              {HERO_BULLETS.map((b) => <li key={b} className="flex items-start gap-2.5 text-[0.95rem]" style={{ color: INK }}><GCheck />{b}</li>)}
            </ul>
            <div className="mt-8"><GPrimaryBtn href="/demo">Request a demo</GPrimaryBtn></div>
          </div>
          <Reveal className="min-w-0"><HeroPanel><LcaHeroCard /></HeroPanel></Reveal>
        </div>
      </section>

      {/* Three feature sections */}
      {FEATURES.map((f, i) => (
        <section key={f.t} className="py-14 sm:py-20" style={{ background: i % 2 ? "#f8faf9" : "#ffffff" }}>
          <div className="mx-auto max-w-6xl px-5 sm:px-6">
            <Reveal>
              <p className="text-[0.7rem] font-bold uppercase tracking-[0.14em]" style={{ color: GREENDK }}>{f.tag}</p>
              <h2 className="mt-3 max-w-3xl font-display text-2xl font-bold tracking-tight sm:text-3xl" style={{ color: INK }}>{f.t}</h2>
              <ul className="mt-5 space-y-2.5 sm:max-w-3xl">
                {f.bullets.map((b) => <li key={b} className="flex items-start gap-2.5 text-[0.92rem]" style={{ color: INK }}><GCheck />{b}</li>)}
              </ul>
            </Reveal>
            <div className="mt-10">{f.viz}</div>
          </div>
        </section>
      ))}

      {/* Sustainability by design */}
      <section className="py-16 sm:py-24">
        <div className="mx-auto grid max-w-6xl items-center gap-12 px-5 sm:px-6 lg:grid-cols-2">
          <Reveal>
            <GH2>Sustainability by design:<br />built into every product</GH2>
            <p className="mt-5 max-w-md text-lg leading-relaxed" style={{ color: BODY }}>
              When impact data sits alongside design decisions, eco-design stops being a separate project and becomes part of how products are made.
            </p>
            <div className="mt-8"><GPrimaryBtn href="/demo">Get started</GPrimaryBtn></div>
          </Reveal>
          <Reveal><CircularLoop /></Reveal>
        </div>
      </section>

      {/* Product tabs */}
      <section className="py-16 sm:py-24" style={{ background: "#f8faf9" }}>
        <div className="mx-auto max-w-6xl px-5 sm:px-6">
          <h2 className="mx-auto max-w-2xl text-center font-display text-2xl font-bold tracking-tight sm:text-3xl" style={{ color: INK }}>Scale LCA across any product or portfolio</h2>
          <div className="mt-10"><ProductLcaTabs /></div>
        </div>
      </section>

      {/* Compliance outputs */}
      <section className="py-16 sm:py-24">
        <div className="mx-auto max-w-6xl px-5 sm:px-6">
          <h2 className="mx-auto max-w-2xl text-center font-display text-2xl font-bold tracking-tight sm:text-3xl" style={{ color: INK }}>One platform, every compliance output</h2>
          <div className="mt-12"><ComplianceOutputs /></div>
        </div>
      </section>

      {/* How an LCA works */}
      <section className="py-16 sm:py-24" style={{ background: "#f8faf9" }}>
        <div className="mx-auto max-w-6xl px-5 sm:px-6">
          <GH2>How does an LCA with ESGen work?</GH2>
          <div className="mt-10"><LcaSteps /></div>
        </div>
      </section>

      {/* Audiences */}
      <section className="py-16 sm:py-24">
        <div className="mx-auto max-w-6xl px-5 sm:px-6">
          <p className="text-center font-display text-lg font-bold" style={{ color: INK }}>One intuitive platform. Every stakeholder aligned.</p>
          <div className="mt-12 grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
            {AUDIENCES.map(([t, d]) => (
              <Reveal key={t}>
                <div>
                  <span className="grid h-10 w-10 place-items-center rounded-xl" style={{ background: TINT }}>
                    <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke={GREENDK} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><circle cx="9" cy="8" r="3" /><path d="M3 20a6 6 0 0 1 12 0M16 11h5M18.5 8.5v5" /></svg>
                  </span>
                  <h3 className="mt-4 font-display text-base font-bold" style={{ color: INK }}>{t}</h3>
                  <p className="mt-2 text-sm leading-relaxed" style={{ color: BODY }}>{d}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* Why embrace LCA */}
      <section className="py-16 sm:py-24" style={{ background: "#f8faf9" }}>
        <div className="mx-auto max-w-6xl px-5 sm:px-6">
          <p className="text-center font-display text-lg font-bold" style={{ color: INK }}>Why every company should embrace life cycle assessment</p>
          <div className="mt-12 grid gap-12 lg:grid-cols-2">
            <Reveal>
              <h3 className="font-display text-lg font-bold" style={{ color: INK }}>Deliver the product carbon footprints your customers expect</h3>
              <p className="mt-3 max-w-md text-sm leading-relaxed" style={{ color: BODY }}>Stay competitive as customer requests for product-level data grow, and as reporting requirements reach further down the value chain.</p>
              <div className="mt-8"><PcfDemandChart /></div>
            </Reveal>
            <Reveal>
              <h3 className="font-display text-lg font-bold" style={{ color: INK }}>Manage environmental liabilities and climate risk in your supply chain</h3>
              <p className="mt-3 max-w-md text-sm leading-relaxed" style={{ color: BODY }}>Prepare early for product-level regulation while reducing cost through eco-design and better material choices.</p>
              <div className="mt-8 flex flex-wrap gap-2">
                {["EPD", "ISO 14040/44", "ISO 14067", "PEF", "DPP", "CBAM"].map((s) => (
                  <span key={s} className="rounded-lg border border-[#e6ece7] bg-white px-3 py-2 text-[0.72rem] font-bold" style={{ color: INK }}>{s}</span>
                ))}
              </div>
            </Reveal>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="py-16 sm:py-24">
        <div className="mx-auto max-w-6xl px-5 sm:px-6">
          <GH2>Still have questions about LCAs?</GH2>
          <p className="mt-4 max-w-2xl text-base leading-relaxed" style={{ color: BODY }}>Explore the knowledge hub for more detail, or get in touch with our team.</p>
          <div className="mt-10"><GFaq items={FAQS} /></div>
        </div>
      </section>

      <GreenCTA title="Start your journey now" intro="See how ESGen turns bills of materials into product footprints and eco-design decisions." />
    </div>
  );
}
