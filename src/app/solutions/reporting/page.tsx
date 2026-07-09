import type { Metadata } from "next";
import { Reveal } from "@/components/ui/Reveal";
import { Eyebrow, PrimaryBtn, GhostBtn, WH2, WhiteCTA, WNAVY, WSLATE, WBODY, WBLUE } from "@/components/whiteui/parts";
import { ReportEditor, TemplateCard, UploadCard, AnomaliesCard, FrameworkRequirements, EmissionsDisclosure } from "@/components/reporting/ReportingVisuals";

export const metadata: Metadata = {
  title: "ESG & Sustainability Reporting",
  description: "Bring your ESG data into one workspace and prepare structured, evidence-backed disclosures across recognised reporting frameworks, from a single dataset.",
  alternates: { canonical: "/solutions/reporting" },
};

const PILLARS: { title: string; desc: string; viz: React.ReactNode }[] = [
  { title: "Tame data chaos", desc: "Bring scattered spreadsheets and supplier responses into one structured place, and reduce manual work.", viz: <TemplateCard /> },
  { title: "Streamline data ingestion", desc: "Pull data in through templates, direct upload, or connected sources, ready to use.", viz: <UploadCard /> },
  { title: "Improve data quality", desc: "Validate and standardise data on the way in, with anomalies flagged for review.", viz: <AnomaliesCard /> },
];

const CHANGE: [string, string][] = [
  ["Templates that evolve", "Reporting structures update as framework requirements change, so you are not rebuilding from scratch each year."],
  ["Up-to-date factors", "Emission factors are refreshed so your figures stay current and defensible."],
  ["Traceable evidence", "Every figure links back to its source, method, and owner, ready for review and assurance."],
];

export default function ReportingPage() {
  return (
    <div className="bg-white" style={{ color: WBODY }}>
      {/* Hero — wide report editor below the headline */}
      <section className="relative overflow-hidden pt-28 pb-12 sm:pt-32 sm:pb-16">
        <div aria-hidden className="pointer-events-none absolute inset-0" style={{ background: "linear-gradient(180deg, #f4f7fd, #ffffff 55%)" }} />
        <div className="relative mx-auto max-w-6xl px-5 sm:px-6">
          <div className="max-w-3xl">
            <Eyebrow>ESGen Reporting</Eyebrow>
            <h1 className="mt-4 font-display text-4xl font-bold leading-[1.05] tracking-tight sm:text-6xl" style={{ color: WSLATE }}>
              Report to every ESG framework, from one dataset
            </h1>
            <p className="mt-5 max-w-2xl text-lg leading-relaxed" style={{ color: WBODY }}>
              Bring your ESG and emissions data into one workspace and prepare structured, evidence-backed disclosures across recognised reporting frameworks, without the spreadsheet chaos.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <PrimaryBtn href="/demo">Request a demo</PrimaryBtn>
              <GhostBtn href="/platform/csrd">Take a tour</GhostBtn>
            </div>
          </div>
          <Reveal className="mt-12"><ReportEditor /></Reveal>
        </div>
      </section>

      {/* One audit-ready workspace — 3-col pillars */}
      <section className="py-16 sm:py-24">
        <div className="mx-auto max-w-6xl px-5 sm:px-6">
          <div className="max-w-2xl">
            <WH2>One audit-ready workspace for all your ESG data</WH2>
            <p className="mt-4 text-lg leading-relaxed" style={{ color: WBODY }}>Bring scattered spreadsheets, supplier data, and activity records into a single source of truth.</p>
          </div>
          <div className="mt-12 grid gap-x-8 gap-y-10 border-t border-[#e6e8ee] pt-10 sm:grid-cols-3 sm:divide-x sm:divide-[#e6e8ee]">
            {PILLARS.map((p) => (
              <div key={p.title} className="sm:px-6 sm:first:pl-0 sm:last:pr-0">
                <h3 className="font-display text-lg font-bold tracking-tight" style={{ color: WNAVY }}>{p.title}</h3>
                <p className="mt-2 text-sm leading-relaxed" style={{ color: WBODY }}>{p.desc}</p>
                {p.viz}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Report to every framework */}
      <section className="py-16 sm:py-24" style={{ background: "#f8fafc" }}>
        <div className="mx-auto grid max-w-6xl gap-12 px-5 sm:px-6 lg:grid-cols-2 lg:items-center">
          <Reveal>
            <WH2>Report to every framework, anytime</WH2>
            <p className="mt-5 max-w-lg text-lg leading-relaxed" style={{ color: WBODY }}>
              From regulatory frameworks to customer questionnaires, map your figures to the requirements that apply to you, so a single dataset supports many reports and updates cascade wherever a metric is used.
            </p>
            <ul className="mt-6 space-y-3">
              {["Repurpose metrics and answers across reports", "Map figures to specific framework requirements", "Update once and cascade everywhere it is used"].map((b) => (
                <li key={b} className="flex items-start gap-3 text-base" style={{ color: WNAVY }}>
                  <svg viewBox="0 0 24 24" fill="none" stroke={WBLUE} strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" className="mt-0.5 h-5 w-5 shrink-0"><path d="M5 13l4 4L19 7" /></svg>{b}
                </li>
              ))}
            </ul>
          </Reveal>
          <Reveal><FrameworkRequirements /></Reveal>
        </div>
      </section>

      {/* Structured disclosures */}
      <section className="py-16 sm:py-24">
        <div className="mx-auto grid max-w-6xl gap-12 px-5 sm:px-6 lg:grid-cols-2 lg:items-center">
          <Reveal className="lg:order-2">
            <WH2>Prepare structured, evidence-backed disclosures</WH2>
            <p className="mt-5 max-w-lg text-lg leading-relaxed" style={{ color: WBODY }}>
              Build your report in one place, tag each figure to the requirement it answers, and keep evidence connected to every number, so disclosures are consistent and ready for review.
            </p>
            <ul className="mt-6 space-y-3">
              {["Draft and structure reports within ESGen", "Tag figures to the requirements they answer", "Keep evidence linked to every disclosure"].map((b) => (
                <li key={b} className="flex items-start gap-3 text-base" style={{ color: WNAVY }}>
                  <svg viewBox="0 0 24 24" fill="none" stroke={WBLUE} strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" className="mt-0.5 h-5 w-5 shrink-0"><path d="M5 13l4 4L19 7" /></svg>{b}
                </li>
              ))}
            </ul>
          </Reveal>
          <Reveal className="lg:order-1"><EmissionsDisclosure /></Reveal>
        </div>
      </section>

      {/* Keep up with change — numbered */}
      <section className="py-16 sm:py-24" style={{ background: "#f8fafc" }}>
        <div className="mx-auto grid max-w-6xl gap-12 px-5 sm:px-6 lg:grid-cols-[0.9fr_1.1fr] lg:items-center">
          <Reveal>
            <WH2>Keep up as requirements change</WH2>
            <p className="mt-5 max-w-md text-lg leading-relaxed" style={{ color: WBODY }}>
              ESG reporting is always in flux. ESGen helps you adapt to shifting requirements and updates in your own data, so reporting stays repeatable rather than a yearly scramble.
            </p>
          </Reveal>
          <div className="divide-y divide-[#e6e8ee] border-y border-[#e6e8ee]">
            {CHANGE.map(([t, d], i) => (
              <Reveal key={t}>
                <div className="flex gap-5 py-6">
                  <span className="font-mono text-sm font-semibold" style={{ color: WBLUE }}>{`0${i + 1}`}</span>
                  <div>
                    <h3 className="font-display text-lg font-semibold" style={{ color: WNAVY }}>{t}</h3>
                    <p className="mt-1.5 text-sm leading-relaxed" style={{ color: WBODY }}>{d}</p>
                  </div>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      <WhiteCTA title="Prepare your next report with confidence" intro="See how ESGen brings your ESG data together and maps it to the frameworks you report to." />
    </div>
  );
}
