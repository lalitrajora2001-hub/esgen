import type { Metadata } from "next";
import { Reveal } from "@/components/ui/Reveal";
import { INK, BODY, GCrumbs, GPrimaryBtn, GGhostBtn, GH2, GFaq, GreenCTA } from "@/components/platform/greenParts";
import { CEyebrow, FrameworkWall, ScopeNote } from "@/components/platform/complianceKit";
import { PlotTrace } from "@/components/platform/EudrVisuals";

export const metadata: Metadata = {
  title: "EUDR",
  description: "Trace commodities back to the geolocated plots they came from, and hold the evidence a due diligence statement depends on.",
  alternates: { canonical: "/platform/eudr" },
};

const COMMODITIES = ["Cattle", "Cocoa", "Coffee", "Oil palm", "Rubber", "Soya", "Wood"];

const FAQS: [string, string][] = [
  ["What is the EUDR?", "The EU Deforestation Regulation restricts placing certain commodities and derived products on the EU market unless they are deforestation-free, produced in accordance with the law of the country of production, and covered by a due diligence statement."],
  ["Which commodities are covered?", "Cattle, cocoa, coffee, oil palm, rubber, soya, and wood, along with a list of products derived from them, such as leather, chocolate, furniture, and paper."],
  ["What does deforestation-free mean?", "That the commodity was produced on land that was not subject to deforestation after 31 December 2020. For wood, there is an additional condition that the forest has not been degraded after that date."],
  ["Why do I need geolocation?", "The regulation requires the geolocation coordinates of every plot of land where the commodity was produced. Without the coordinates, the deforestation check cannot be made and the due diligence statement cannot be supported."],
  ["What does due diligence involve?", "Collecting the information, assessing the risk that the commodity is non-compliant, and where that risk is not negligible, taking steps to mitigate it before placing the product on the market."],
  ["How does ESGen help?", "ESGen collects plot-level data from your suppliers, keeps the coordinates and evidence against each consignment, and surfaces the plots that need a closer look before you file."],
  ["Does ESGen file the statement for us?", "No. ESGen organises the evidence and makes the gaps visible. The due diligence statement remains the operator's responsibility."],
];

export default function EudrPage() {
  return (
    <div className="bg-white" style={{ color: BODY }}>
      {/* Hero — map-led, text overlays to the left */}
      <section className="relative overflow-hidden pt-24 sm:pt-28">
        <div aria-hidden className="pointer-events-none absolute inset-x-0 top-0 h-[420px]" style={{ background: "linear-gradient(180deg,#f5faf7,#ffffff 74%)" }} />
        <div className="relative mx-auto max-w-6xl px-5 sm:px-6">
          <GCrumbs last="EUDR" />
          <div className="mt-8 max-w-3xl">
            <CEyebrow>ESG compliance</CEyebrow>
            <h1 className="mt-4 font-display text-4xl font-bold leading-[1.05] tracking-tight sm:text-5xl" style={{ color: INK }}>
              Trace every consignment back to the ground it grew on
            </h1>
            <p className="mt-6 max-w-xl text-lg leading-relaxed" style={{ color: BODY }}>
              The EUDR asks for the coordinates of each plot of land. ESGen collects them from your suppliers and keeps the evidence against the consignment it belongs to.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <GPrimaryBtn href="/demo">Request a demo</GPrimaryBtn>
              <GGhostBtn href="/contact">Talk to our team</GGhostBtn>
            </div>
          </div>
          <div className="mt-14"><Reveal><PlotTrace /></Reveal></div>
          <div className="mt-10 pb-4"><ScopeNote>Application dates for the EUDR have been amended more than once since it entered into force. Whether and when it applies to your organisation depends on your role in the supply chain and your size. Confirm your position with your advisers.</ScopeNote></div>
        </div>
      </section>

      {/* Seven commodities — ticker-like band */}
      <section className="py-16 sm:py-24">
        <div className="mx-auto max-w-6xl px-5 sm:px-6">
          <Reveal><div className="max-w-2xl"><GH2>Seven commodities, and everything made from them</GH2>
            <p className="mt-5 text-lg leading-relaxed" style={{ color: BODY }}>The scope reaches downstream: leather from cattle, chocolate from cocoa, furniture and paper from wood.</p></div></Reveal>
          <div className="mt-10 flex flex-wrap gap-3">
            {COMMODITIES.map((c) => (
              <span key={c} className="rounded-full border border-[#e6ece7] px-5 py-2.5 font-display text-base font-bold" style={{ color: INK }}>{c}</span>
            ))}
          </div>
        </div>
      </section>

      {/* The cut-off date — single striking statement */}
      <section className="py-16 sm:py-24" style={{ background: "#f8faf9" }}>
        <div className="mx-auto max-w-6xl px-5 sm:px-6">
          <div className="grid gap-10 lg:grid-cols-[0.9fr_1.1fr] lg:items-center">
            <Reveal>
              <div className="rounded-3xl bg-[#0d1411] p-10 text-center">
                <div className="text-[0.68rem] font-bold uppercase tracking-[0.16em]" style={{ color: "#4ade80" }}>The cut-off</div>
                <div className="mt-4 font-display text-5xl font-bold leading-none text-white sm:text-6xl">31 Dec</div>
                <div className="mt-1 font-display text-3xl font-bold text-white/50">2020</div>
                <p className="mx-auto mt-5 max-w-xs text-[0.86rem] leading-relaxed text-white/60">Land deforested after this date cannot supply an EUDR-compliant commodity.</p>
              </div>
            </Reveal>
            <Reveal>
              <GH2>One date decides whether a plot can supply you</GH2>
              <p className="mt-5 text-lg leading-relaxed" style={{ color: BODY }}>
                That is why coordinates matter more than certificates. A plot boundary can be checked against forest cover on a fixed date; a paper claim cannot.
              </p>
              <ul className="mt-8 space-y-3">
                {[
                  "Collect polygon or point coordinates for every plot",
                  "Check each against forest cover at the cut-off date",
                  "Retain the evidence with the consignment it supports",
                  "Escalate the plots where the risk is not negligible",
                ].map((l) => (
                  <li key={l} className="flex items-start gap-3 text-[0.95rem]" style={{ color: INK }}>
                    <svg viewBox="0 0 24 24" className="mt-0.5 h-5 w-5 shrink-0" fill="none"><circle cx="12" cy="12" r="10" fill="#15803d" /><path d="M7.5 12.5l3 3 6-6.5" stroke="#fff" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" /></svg>
                    {l}
                  </li>
                ))}
              </ul>
            </Reveal>
          </div>
        </div>
      </section>

      <section className="py-16 sm:py-20">
        <div className="mx-auto max-w-6xl px-5 sm:px-6">
          <Reveal><h2 className="mx-auto max-w-2xl text-center font-display text-2xl font-bold sm:text-3xl" style={{ color: INK }}>Supplier data that serves more than one rulebook</h2></Reveal>
          <div className="mt-10"><FrameworkWall highlight="EUDR" /></div>
        </div>
      </section>

      <section className="pb-16 sm:pb-24">
        <div className="mx-auto max-w-6xl px-5 sm:px-6">
          <GH2>Questions about the EUDR</GH2>
          <div className="mt-10"><GFaq items={FAQS} /></div>
        </div>
      </section>

      <GreenCTA title="Start your journey now" intro="See how ESGen turns supplier questionnaires into plot-level traceability evidence." />
    </div>
  );
}
