import type { Metadata } from "next";
import Link from "next/link";
import { Reveal } from "@/components/ui/Reveal";
import { INK, BODY, GREEN, GREENDK, GPrimaryBtn, GH2, GFaq, GreenCTA } from "@/components/platform/greenParts";
import { SupplierDashboard } from "@/components/platform/SupplierVisuals";
import { AppReductionTrajectory, AppScenario, AppExports, AppSuppliersDashboard, QuestionnaireScores, FactorIconGrid, AppSbtiTable, AppCsrdUpload, AppCbamQuestionnaire } from "@/components/platform/AppShots";

export const metadata: Metadata = {
  title: "Suppliers Engagement",
  description: "Engage your suppliers, collect primary emissions data, and strengthen Scope 3 across your value chain with ESGen.",
  alternates: { canonical: "/platform/suppliers-engagement" },
};

const SECTIONS: { t: string; d: string; bullets: string[]; viz: React.ReactNode }[] = [
  {
    t: "Effortlessly manage reliable carbon data",
    d: "An intuitive data-management workspace that gives you a clear understanding of your company's emissions, with structure at every step.",
    bullets: ["Task manager for supplier data collection", "Structured checks and human review", "Access to recognised emission factor sources", "Dashboards you can shape around your categories"],
    viz: <AppReductionTrajectory />,
  },
  {
    t: "Steer your company towards exceptional carbon management",
    d: "Follow best-in-class decarbonisation practice, bring stakeholders with you, and stay on top of current regulation.",
    bullets: ["Tools to build emission reduction pathways", "Practical guidance at each step", "Compliance modules (for example, CSRD)", "Resources to build capability in-house"],
    viz: <AppScenario />,
  },
  {
    t: "Share your commitment",
    d: "Meet stakeholder reporting requirements and showcase your results, both internally and externally.",
    bullets: ["Fully auditable GHG assessment", "Report-ready outputs for stakeholders", "Supplier scorecards and progress summaries", "Evidence linked to every figure"],
    viz: <AppExports />,
  },
];

const COLLAB: [string, string][] = [
  ["Automatic supplier recognition and factor matching", "Suppliers are matched to the right categories and emission factors, so setup does not start from a blank page."],
  ["User-centric functionality", "Identify your most emissive suppliers, validate their relevance to your strategy, and review their carbon maturity scores."],
  ["Help suppliers track emissions", "Onboard suppliers onto the platform so they can calculate their own GHG emissions or complete an LCA."],
];

const FAQS: [string, string][] = [
  ["What is sustainable procurement?", "Sustainable procurement means buying goods and services in a way that accounts for environmental, social, and economic impacts across the supply chain."],
  ["Why is sustainable procurement important?", "It reduces environmental impact, improves reputation, supports requirements such as CBAM and SBTi, and builds long-term value with responsible suppliers."],
  ["What are good sustainable procurement practices?", "Supplier engagement, carbon tracking, responsible sourcing, and life-cycle analysis of what you buy."],
  ["What are the 5 Rs of sustainable procurement?", "Reduce, Reuse, Recycle, Rethink, and Refuse. Together they guide businesses towards less waste and more circular supply chains."],
  ["What are the four foundational elements?", "Transparency, risk management, supplier collaboration, and measurable sustainability goals."],
  ["What are the three pillars of sustainable procurement?", "Environmental responsibility, social equity, and economic viability."],
  ["Does ESGen guarantee compliance?", "ESGen supports compliance workflows and helps structure supplier data for reporting. It does not provide legal advice or guarantee compliance outcomes."],
];

const COMPLIANCE: { t: string; without: string; with_: string; href: string; cta: string; viz: React.ReactNode }[] = [
  { t: "Identify and track your suppliers' commitments to SBTi", without: "Companies commit to SBTi targets that they cannot track or follow.", with_: "Companies can monitor their emissions linked to SBTi targets.", href: "/platform/sbti", cta: "SBTi with ESGen", viz: <AppSbtiTable /> },
  { t: "Streamline supplier data collection for CSRD compliance", without: "You need to disclose KPIs from your suppliers on specific ESRS subtopics.", with_: "Key information for CSRD requirements can be extracted from supplier questionnaires.", href: "/platform/csrd", cta: "CSRD with ESGen", viz: <AppCsrdUpload /> },
  { t: "Make CBAM reporting manageable", without: "Without full supplier visibility, embedded emissions fall back on default values.", with_: "Key CBAM data is collected from supplier questionnaires and kept with its evidence.", href: "/platform/cbam", cta: "CBAM with ESGen", viz: <AppCbamQuestionnaire /> },
];

function Check() {
  return <svg viewBox="0 0 24 24" className="mt-0.5 h-5 w-5 shrink-0" fill="none"><circle cx="12" cy="12" r="10" fill={GREEN} /><path d="M7.5 12.5l3 3 6-6.5" stroke="#fff" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" /></svg>;
}

export default function SuppliersEngagementPage() {
  return (
    <div className="bg-white" style={{ color: BODY }}>
      {/* Hero */}
      <section className="relative overflow-hidden pt-28 pb-14 sm:pt-32">
        <div aria-hidden className="pointer-events-none absolute inset-0" style={{ background: "linear-gradient(180deg, #f8fdfa, #ffffff 50%)" }} />
        <div className="relative mx-auto max-w-6xl px-5 sm:px-6">
          <nav aria-label="Breadcrumb" className="flex items-center gap-2 text-[0.78rem]" style={{ color: BODY }}>
            <Link href="/" className="hover:underline">ESGen</Link><span>›</span>
            <Link href="/platform/carbon-assessment" className="hover:underline">Platform</Link><span>›</span>
            <span style={{ color: INK }}>Suppliers engagement</span>
          </nav>
          <p className="mt-6 flex items-center gap-1.5 text-[0.72rem] font-bold uppercase tracking-[0.14em]" style={{ color: GREEN }}>
            <svg viewBox="0 0 24 24" className="h-3.5 w-3.5" fill="none" stroke={GREEN} strokeWidth="2"><circle cx="12" cy="12" r="9" /><path d="M12 7v10" /></svg>
            Carbon management
          </p>
          <h1 className="mt-4 max-w-4xl font-display text-4xl font-bold leading-[1.06] tracking-tight sm:text-5xl" style={{ color: INK }}>
            Align your supply chain with <span style={{ color: GREEN }}>SBTi and CBAM</span>
          </h1>
          <p className="mt-5 max-w-md text-lg leading-relaxed" style={{ color: BODY }}>
            Empower your procurement team to decarbonise their supply chain through efficient engagement tools and climate strategy assessments.
          </p>
          <div className="mt-8"><GPrimaryBtn href="/demo">Request a demo</GPrimaryBtn></div>

          <Reveal className="mt-12">
            <div className="relative overflow-hidden rounded-2xl p-6 sm:p-10" style={{ background: "linear-gradient(140deg,#1d3d22 0%,#2f6b32 45%,#5aa046 100%)" }}>
              <div aria-hidden className="absolute inset-0" style={{ background: "radial-gradient(70% 60% at 20% 25%, rgba(255,255,255,0.16), transparent 60%)" }} />
              <div className="relative mx-auto max-w-xl"><SupplierDashboard /></div>
            </div>
          </Reveal>
        </div>
      </section>

      {/* Three alternating feature sections with app screenshots */}
      {SECTIONS.map((s, i) => (
        <section key={s.t} className="py-14 sm:py-20" style={{ background: i % 2 ? "#f6fbf7" : "#ffffff" }}>
          <div className="mx-auto max-w-6xl px-5 sm:px-6">
            <Reveal>
              <h2 className="font-display text-2xl font-bold tracking-tight sm:text-3xl" style={{ color: INK }}>{s.t}</h2>
              <p className="mt-3 max-w-3xl text-base leading-relaxed" style={{ color: BODY }}>{s.d}</p>
              <ul className="mt-5 grid gap-2.5 sm:max-w-2xl">
                {s.bullets.map((b) => <li key={b} className="flex items-start gap-2.5 text-[0.95rem]" style={{ color: INK }}><Check />{b}</li>)}
              </ul>
            </Reveal>
            <div className="mt-10">{s.viz}</div>
          </div>
        </section>
      ))}

      {/* Procurement mosaic */}
      <section className="py-16 sm:py-24">
        <div className="mx-auto max-w-6xl px-5 sm:px-6">
          <h2 className="mx-auto max-w-2xl text-center font-display text-2xl font-bold tracking-tight sm:text-3xl" style={{ color: INK }}>Spend less time chasing suppliers, more time reducing emissions</h2>

          <div className="mt-14 grid gap-12 lg:grid-cols-2 lg:items-start">
            <Reveal>
              <h3 className="font-display text-lg font-bold" style={{ color: INK }}>Effortless and accurate emissions tracking</h3>
              <p className="mt-3 text-sm leading-relaxed" style={{ color: BODY }}>Bring supplier data into your Scope 3 reporting with automatic supplier recognition and recognised emission-factor sources.</p>
              <div className="mt-6"><FactorIconGrid /></div>
            </Reveal>
            <Reveal>
              <h3 className="font-display text-lg font-bold" style={{ color: INK }}>Assess your suppliers on KPIs that really matter</h3>
              <p className="mt-3 text-sm leading-relaxed" style={{ color: BODY }}>Sector-specific questionnaires, designed around the indicators that actually drive climate performance.</p>
              <div className="mt-6"><QuestionnaireScores /></div>
            </Reveal>
          </div>

          <div className="mt-16 grid gap-10 border-t border-[#e6ece7] pt-12 sm:grid-cols-3">
            {[["Less chasing", "One workspace for requests, reminders, and responses, so your team stops living in spreadsheets."], ["A transparent factor database", "Recognised factors, kept current, so every supplier figure can be traced and defended."], ["Stronger Scope 3 measurement", "Primary supplier data replaces estimates where it matters most in your value chain."]].map(([t, d]) => (
              <Reveal key={t}><div><h3 className="font-display text-lg font-bold" style={{ color: INK }}>{t}</h3><p className="mt-3 text-sm leading-relaxed" style={{ color: BODY }}>{d}</p></div></Reveal>
            ))}
          </div>

          <div className="mt-16 grid gap-12 lg:grid-cols-2 lg:items-center">
            <Reveal>
              <h3 className="font-display text-xl font-bold" style={{ color: INK }}>Make data-driven sustainable procurement decisions</h3>
              <p className="mt-3 max-w-md text-base leading-relaxed" style={{ color: BODY }}>A personalised dashboard helps you make better decisions, improve environmental performance, and stay aligned with your climate commitments such as SBTi and CSRD.</p>
            </Reveal>
            <Reveal>
              <h3 className="font-display text-xl font-bold" style={{ color: INK }}>Simplify GHG and LCA assessments for suppliers</h3>
              <p className="mt-3 max-w-md text-base leading-relaxed" style={{ color: BODY }}>With industry-specific modules and ready-to-use templates, suppliers can complete their assessments directly on the platform.</p>
            </Reveal>
          </div>
        </div>
      </section>

      {/* Compliance rows */}
      <section className="py-16 sm:py-24" style={{ background: "#f6fbf7" }}>
        <div className="mx-auto max-w-6xl px-5 sm:px-6">
          <h2 className="mx-auto max-w-md text-center font-display text-2xl font-bold tracking-tight sm:text-3xl" style={{ color: INK }}>Compliant with leading regulations and frameworks</h2>
          <div className="mt-14 space-y-16">
            {COMPLIANCE.map((c) => (
              <div key={c.t} className="grid gap-10 lg:grid-cols-2 lg:items-center">
                <Reveal>{c.viz}</Reveal>
                <Reveal>
                  <h3 className="font-display text-xl font-bold tracking-tight" style={{ color: INK }}>{c.t}</h3>
                  <div className="mt-6 grid gap-6 sm:grid-cols-2">
                    <div>
                      <div className="text-[0.8rem] font-semibold" style={{ color: "#9aa5a0" }}>Without ESGen</div>
                      <p className="mt-2 text-sm leading-relaxed" style={{ color: INK }}>{c.without}</p>
                    </div>
                    <div>
                      <div className="flex items-center gap-1.5 text-[0.8rem] font-semibold" style={{ color: INK }}>
                        <svg viewBox="0 0 24 24" className="h-3.5 w-3.5" fill="none"><circle cx="12" cy="12" r="10" fill={GREENDK} /><path d="M7.5 12.5l3 3 6-6.5" stroke="#fff" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" /></svg>
                        With ESGen
                      </div>
                      <p className="mt-2 text-sm leading-relaxed" style={{ color: BODY }}>{c.with_}</p>
                    </div>
                  </div>
                  <Link href={c.href} className="mt-6 inline-flex items-center rounded-lg border border-[#cfe3d7] bg-white px-4 py-2.5 text-sm font-semibold" style={{ color: GREENDK }}>{c.cta}</Link>
                </Reveal>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Collaboration + big dashboard */}
      <section className="py-16 sm:py-24">
        <div className="mx-auto max-w-6xl px-5 sm:px-6">
          <div className="mx-auto max-w-2xl text-center">
            <h2 className="font-display text-2xl font-bold tracking-tight sm:text-3xl" style={{ color: INK }}>Enhanced transparency and collaboration in carbon emissions reporting</h2>
            <p className="mt-4 text-lg leading-relaxed" style={{ color: BODY }}>Built around structured, automated Scope 3 supplier engagement.</p>
          </div>
          <div className="mt-12"><AppSuppliersDashboard /></div>
          <div className="mt-12 grid gap-8 sm:grid-cols-3">
            {COLLAB.map(([t, d]) => (
              <Reveal key={t}>
                <div>
                  <div className="flex items-start gap-2.5"><Check /><h3 className="font-display text-base font-bold leading-snug" style={{ color: INK }}>{t}</h3></div>
                  <p className="mt-3 text-sm leading-relaxed" style={{ color: BODY }}>{d}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="py-16 sm:py-24" style={{ background: "#f6fbf7" }}>
        <div className="mx-auto max-w-6xl px-5 sm:px-6">
          <GH2>I have more questions about sustainable procurement</GH2>
          <p className="mt-4 max-w-2xl text-base leading-relaxed" style={{ color: BODY }}>Need more detail? Explore the knowledge hub, or get in touch with our team.</p>
          <div className="mt-10"><GFaq items={FAQS} /></div>
        </div>
      </section>

      <GreenCTA title="Bring your suppliers on board" intro="See how ESGen helps you engage suppliers, collect primary data, and cut Scope 3 emissions." />
    </div>
  );
}
