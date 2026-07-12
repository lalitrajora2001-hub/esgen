import type { Metadata } from "next";
import { Section, SectionHead } from "@/components/ui/Section";
import { Reveal } from "@/components/ui/Reveal";
import { Breadcrumb, CTASection } from "@/components/sections/blocks";
import { RegulationExplorer, type Reg } from "@/components/resources/ResourceVisuals";

export const metadata: Metadata = {
  title: "ESG Regulations and Frameworks Overview",
  description: "A plain overview of the sustainability and carbon reporting frameworks that shape ESG reporting, filterable by jurisdiction.",
};

const REGS: Reg[] = [
  { name: "GHG Protocol", juris: "Global", who: "Any organisation measuring its carbon footprint.", what: "The most widely used standard for corporate greenhouse gas accounting, grouping emissions into Scopes 1, 2, and 3. Most other frameworks build on its methodology.", href: "/platform/carbon-assessment" },
  { name: "CSRD / ESRS", juris: "EU", who: "Large EU companies and some non-EU groups with significant EU activity.", what: "The EU directive and its European Sustainability Reporting Standards, requiring a double materiality assessment and assured sustainability disclosures.", href: "/platform/csrd" },
  { name: "IFRS S1 / S2 (ISSB)", juris: "Global", who: "Companies in jurisdictions adopting the ISSB baseline.", what: "Global baseline sustainability and climate disclosure standards from the IFRS Foundation. S2 fully incorporates the TCFD recommendations.", href: "/platform/uk-srs" },
  { name: "UK SRS", juris: "UK", who: "UK organisations, subject to government and FCA decisions on scope.", what: "UK Sustainability Reporting Standards, endorsed versions of IFRS S1 and S2 with UK-specific amendments.", href: "/platform/uk-srs" },
  { name: "SECR", juris: "UK", who: "Quoted companies, and large unquoted companies and LLPs.", what: "Streamlined Energy and Carbon Reporting: energy use, Scope 1 and 2 emissions, an intensity ratio, and efficiency actions in the annual report.", href: "/platform/secr" },
  { name: "CBAM", juris: "EU", who: "Importers of cement, steel, aluminium, fertilisers, electricity, and hydrogen.", what: "The Carbon Border Adjustment Mechanism, which prices the emissions embedded in certain imported goods to match the EU carbon price.", href: "/platform/cbam" },
  { name: "EUDR", juris: "EU", who: "Operators and traders placing certain commodities on the EU market.", what: "The EU Deforestation Regulation, requiring geolocated, deforestation-free supply chains for commodities such as cocoa, coffee, soya, and wood.", href: "/platform/suppliers-engagement" },
  { name: "SBTi", juris: "Global", who: "Any company setting a science-aligned emissions target.", what: "The Science Based Targets initiative, which validates targets against what climate science says is needed to limit warming.", href: "/platform/sbti" },
  { name: "CDP", juris: "Global", who: "Companies asked to disclose by customers or investors.", what: "A global environmental disclosure system based on an annual questionnaire, widely used in procurement and investment.", href: "/solutions/reporting" },
  { name: "VSME", juris: "EU", who: "Small and medium-sized undertakings not in CSRD scope.", what: "A voluntary EFRAG standard giving SMEs a proportionate way to answer the sustainability questions their customers and banks ask.", href: "/solutions/reporting" },
];

export default function RegulationsPage() {
  return (
    <>
      <section className="relative overflow-hidden pt-28 pb-6 sm:pt-36">
        <div aria-hidden className="pointer-events-none absolute inset-0" style={{ background: "radial-gradient(900px 460px at 50% -10%, rgba(77,139,245,0.14), transparent 60%)" }} />
        <div className="relative mx-auto max-w-6xl px-5 sm:px-6">
          <Breadcrumb trail={[{ label: "Home", href: "/" }, { label: "Resources", href: "/resources" }, { label: "Regulations" }]} />
          <h1 className="max-w-2xl text-balance text-4xl font-semibold leading-[1.05] sm:text-5xl">The frameworks that shape reporting, mapped</h1>
          <p className="mt-5 max-w-xl text-lg text-text-muted">Filter by jurisdiction, see who each one affects in plain terms, and jump to how ESGen helps you prepare.</p>
        </div>
      </section>

      <Section size="sm">
        <Reveal><RegulationExplorer regs={REGS} /></Reveal>
        <p className="mt-10 font-mono text-xs text-text-muted/60">
          This overview is for general information only and is not legal advice. Requirements change, several of these have been amended recently, so verify the current position for your organisation.
        </p>
      </Section>

      <CTASection title="One inventory, every framework it feeds" intro="See how the same data answers the frameworks that apply to you." />
    </>
  );
}
