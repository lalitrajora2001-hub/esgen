import type { Metadata } from "next";
import Link from "next/link";
import { Reveal } from "@/components/ui/Reveal";
import { MonoFrameworks } from "@/components/platform/greenParts";

import {
  CarbonDashboard, ReductionPathway, FeatureCard, DataArcs, FactorTableViz, CoverageMeter,
  StepCard, LaunchViz, SparklineViz, TrajectoryViz, ActionsViz, AccountViz, GreenStat,
} from "@/components/platform/CarbonVisuals";

export const metadata: Metadata = {
  title: "Carbon Assessment",
  description: "Measure your Scope 1, 2, and 3 emissions with a clear, auditable method, then turn the numbers into a practical reduction plan.",
  alternates: { canonical: "/platform/carbon-assessment" },
};

const INK = "#0f1720";
const BODY = "#47505c";
const GREEN = "#16a34a";
const GREENDK = "#15803d";

function Eyebrow({ children }: { children: React.ReactNode }) { return <p className="text-[0.72rem] font-bold uppercase tracking-[0.16em]" style={{ color: GREEN }}>{children}</p>; }
function Arrow() { return <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" className="h-4 w-4"><path d="M5 12h14M13 6l6 6-6 6" /></svg>; }
function PrimaryBtn({ href, children }: { href: string; children: React.ReactNode }) { return <Link href={href} className="inline-flex items-center gap-2 rounded-lg px-5 py-3 text-sm font-semibold text-white transition-colors hover:brightness-110" style={{ background: GREEN }}>{children}<Arrow /></Link>; }
function GhostBtn({ href, children }: { href: string; children: React.ReactNode }) { return <Link href={href} className="inline-flex items-center gap-2 rounded-lg bg-[#ecfdf3] px-5 py-3 text-sm font-semibold transition-colors hover:bg-[#d6f7e2]" style={{ color: GREENDK }}>{children}</Link>; }
function H2({ children }: { children: React.ReactNode }) { return <h2 className="font-display text-3xl font-bold leading-[1.1] tracking-tight sm:text-4xl" style={{ color: INK }}>{children}</h2>; }

const SCOPES: [string, string][] = [
  ["Scope 1 · Direct", "Emissions from sources you own or control, such as fuel combustion, company vehicles, and process emissions."],
  ["Scope 2 · Energy", "Indirect emissions from the electricity, heat, and steam you purchase and consume."],
  ["Scope 3 · Value chain", "All other indirect emissions across your value chain, from purchased goods and travel to logistics."],
];

const WHY: { tone: "dark" | "light" | "greenDark" | "greenLight"; t: string; d: string; icon: React.ReactNode }[] = [
  { tone: "dark", t: "Build credibility", d: "Show customers and investors your climate claims are backed by real, traceable data.", icon: <path d="M12 3l7 2.6v5.7c0 4.4-3 7.4-7 8.7-4-1.3-7-4.3-7-8.7V5.6zM9 12l2 2 4-4" /> },
  { tone: "greenDark", t: "Win more tenders", d: "Buyers increasingly include carbon criteria in RFPs and supplier questionnaires.", icon: <path d="M8 21h8M12 17v4M7 4h10v5a5 5 0 0 1-10 0zM7 6H4v1a3 3 0 0 0 3 3M17 6h3v1a3 3 0 0 1-3 3" /> },
  { tone: "light", t: "Stay ahead of regulation", d: "Anticipate reporting obligations and prepare early, rather than scrambling to catch up.", icon: <path d="M12 3v18M5 7l7-4 7 4M5 7l-2 6a4 4 0 0 0 8 0zM19 7l2 6a4 4 0 0 1-8 0z" /> },
  { tone: "greenLight", t: "Do your part", d: "Align your business with global climate goals, and act on what the science requires.", icon: <path d="M12 3a9 9 0 1 0 9 9M12 3c3 3 3 15 0 18M12 3c-3 3-3 15 0 18M3.5 9h17M3.5 15h17" /> },
];
const WHY_TONE = {
  dark: { bg: "#0d1411", ink: "#fff", sub: "rgba(255,255,255,0.7)" },
  greenDark: { bg: "#0f2a1c", ink: "#fff", sub: "rgba(255,255,255,0.72)" },
  light: { bg: "#f2f4f3", ink: INK, sub: BODY },
  greenLight: { bg: "#d6f5e1", ink: INK, sub: "#3f5a49" },
} as const;

const FAQS: [string, string][] = [
  ["What is a carbon assessment?", "A carbon assessment measures the greenhouse gas emissions your organisation is responsible for over a period, across Scope 1, 2, and 3, expressed in tonnes of CO₂ equivalent (tCO₂e)."],
  ["What are Scope 1, 2, and 3?", "Scope 1 is direct emissions from sources you own or control. Scope 2 is indirect emissions from the energy you buy. Scope 3 covers all other indirect emissions across your value chain, such as suppliers, travel, and logistics."],
  ["How is a carbon footprint calculated?", "Activity data, such as litres of fuel or kWh of electricity, is multiplied by recognised emission factors to produce emissions in tCO₂e. ESGen keeps the factors and calculation logic transparent so every figure can be traced."],
  ["Which frameworks does ESGen support?", "ESGen is designed to support structured reporting across recognised frameworks, including CSRD/ESRS, ISSB, SECR, and CDP, from a single dataset."],
  ["Does ESGen guarantee compliance?", "ESGen supports compliance workflows and helps you prepare structured, evidence-backed reporting. It does not provide legal advice or guarantee compliance or audit outcomes."],
];

export default function CarbonAssessmentPage() {
  return (
    <div className="bg-white" style={{ color: BODY }}>
      {/* Hero */}
      <section className="relative overflow-hidden pt-28 pb-16 sm:pt-32 sm:pb-20">
        <div aria-hidden className="pointer-events-none absolute inset-0" style={{ background: "radial-gradient(55% 55% at 82% 35%, rgba(22,163,74,0.10), transparent 60%), linear-gradient(180deg, #f6fef9, #ffffff 45%)" }} />
        <div className="relative mx-auto grid max-w-6xl items-center gap-12 px-5 sm:px-6 lg:grid-cols-[1.05fr_1.05fr]">
          <div>
            <Eyebrow>Carbon Assessment</Eyebrow>
            <h1 className="mt-4 font-display text-4xl font-bold leading-[1.06] tracking-tight sm:text-5xl" style={{ color: INK }}>
              Measure your carbon footprint, <span style={{ color: GREEN }}>then act on it</span>
            </h1>
            <p className="mt-5 max-w-md text-lg leading-relaxed" style={{ color: BODY }}>
              Calculate your Scope 1, 2, and 3 emissions with a clear, auditable method, find where they come from, and turn the numbers into a practical reduction plan.
            </p>
            <div className="mt-8 flex flex-wrap gap-3"><PrimaryBtn href="/demo">Request a demo</PrimaryBtn><GhostBtn href="/platform/decarbonization-strategy">See the workflow</GhostBtn></div>
          </div>
          <Reveal className="min-w-0"><CarbonDashboard /></Reveal>
        </div>
      </section>

      {/* Scopes explainer */}
      <section className="py-14 sm:py-20">
        <div className="mx-auto max-w-6xl px-5 sm:px-6">
          <div className="max-w-2xl"><H2>Account for every scope</H2><p className="mt-4 text-lg leading-relaxed" style={{ color: BODY }}>A complete footprint covers all three GHG Protocol scopes, including the 15 Scope 3 categories where most emissions usually sit.</p></div>
          <div className="mt-10 grid gap-5 sm:grid-cols-3">
            {SCOPES.map(([t, d], i) => (
              <Reveal key={t}><div className="h-full rounded-2xl border border-[#e6ece7] bg-white p-6"><div className="grid h-10 w-10 place-items-center rounded-xl font-display text-sm font-bold text-white" style={{ background: [GREENDK, GREEN, "#4ade80"][i] }}>{i + 1}</div><h3 className="mt-4 font-display text-lg font-bold" style={{ color: INK }}>{t}</h3><p className="mt-2 text-sm leading-relaxed" style={{ color: BODY }}>{d}</p></div></Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* Three-feature row */}
      <section className="py-14 sm:py-20" style={{ background: "#f6fbf7" }}>
        <div className="mx-auto max-w-6xl px-5 sm:px-6">
          <div className="max-w-2xl"><Eyebrow>Built for accuracy</Eyebrow><h2 className="mt-3 font-display text-3xl font-bold tracking-tight sm:text-4xl" style={{ color: INK }}>A footprint you can defend</h2></div>
          <div className="mt-10 grid gap-5 lg:grid-cols-3">
            <FeatureCard tone="green" title="Streamlined data management" desc="Bring quantitative, value-chain, and narrative data together with harmonisation tools, supplier data collection, and clean, reusable exports."><DataArcs /></FeatureCard>
            <FeatureCard tone="cream" title="Every factor matters" desc="Apply recognised, transparent emission factors, kept up to date, so every figure can be traced and defended."><FactorTableViz /></FeatureCard>
            <FeatureCard tone="dark" title="Stronger Scope 3 coverage" desc="Supplier engagement improves the quality of your value-chain data, where most emissions usually sit."><CoverageMeter /></FeatureCard>
          </div>
        </div>
      </section>

      {/* Do more. Spend less. */}
      <section className="py-16 sm:py-20">
        <div className="mx-auto max-w-6xl px-5 sm:px-6">
          <H2>Do more. Spend less.</H2>
          <div className="mt-10 grid gap-8 border-t border-[#e6ece7] pt-10 sm:grid-cols-3 sm:divide-x sm:divide-[#e6ece7]">
            <div className="sm:pr-8"><GreenStat value={3} label="Emission scopes measured in one workspace" /></div>
            <div className="sm:px-8"><GreenStat value={15} label="Scope 3 categories covered across your value chain" /></div>
            <div className="sm:pl-8"><GreenStat value={6} suffix="+" label="Reporting frameworks supported from a single dataset" /></div>
          </div>
        </div>
      </section>

      {/* Path to impact */}
      <section className="py-16 sm:py-24" style={{ background: "#f6fbf7" }}>
        <div className="mx-auto max-w-6xl px-5 sm:px-6">
          <div className="max-w-2xl"><H2>Your path to impact</H2><p className="mt-4 text-lg leading-relaxed" style={{ color: BODY }}>A clear, repeatable route from first measurement through to transparent reporting.</p></div>
          <div className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            <StepCard tone="dark" n={1} title="Launch" desc="Collect activity, spend, and supplier data across your operations and value chain."><LaunchViz /></StepCard>
            <StepCard tone="greenLt" n={2} title="Assess impact" desc="Calculate emissions across every scope and get a clear, precise view of your footprint."><SparklineViz /></StepCard>
            <StepCard tone="grey" n={3} title="Set targets" desc="Set data-driven goals aligned with recognised standards, focused where they make the most difference."><TrajectoryViz /></StepCard>
            <StepCard tone="green" n={4} title="Drive action" desc="Turn the plan into progress with practical initiatives across energy, efficiency, and sourcing."><ActionsViz /></StepCard>
            <StepCard tone="dark" n={5} title="Ensure accountability" desc="Track progress over time and report transparently through frameworks such as CSRD, SECR, and CDP."><AccountViz /></StepCard>
          </div>
        </div>
      </section>

      {/* Reduction pathway */}
      <section className="py-16 sm:py-24">
        <div className="mx-auto grid max-w-6xl gap-12 px-5 sm:px-6 lg:grid-cols-2 lg:items-center">
          <Reveal className="lg:order-2">
            <H2>Turn measurement into reduction</H2>
            <p className="mt-5 max-w-lg text-lg leading-relaxed" style={{ color: BODY }}>Measuring is only the start. ESGen helps you set a target aligned with a 1.5°C pathway and track a concrete reduction plan over time, with progress you can report transparently.</p>
          </Reveal>
          <Reveal className="lg:order-1"><ReductionPathway /></Reveal>
        </div>
      </section>

      {/* Why calculate emissions */}
      <section className="py-16 sm:py-24" style={{ background: "#f6fbf7" }}>
        <div className="mx-auto max-w-6xl px-5 sm:px-6">
          <h2 className="mx-auto max-w-2xl text-center font-display text-3xl font-bold tracking-tight sm:text-4xl" style={{ color: INK }}>Why measure your emissions?</h2>
          <div className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {WHY.map((w) => {
              const t = WHY_TONE[w.tone];
              return (
                <Reveal key={w.t}>
                  <div className="flex h-full min-h-[220px] flex-col rounded-2xl p-6" style={{ background: t.bg }}>
                    <span className="grid h-11 w-11 place-items-center rounded-xl" style={{ background: w.tone === "light" ? "#e6f7ec" : "rgba(255,255,255,0.12)" }}>
                      <svg viewBox="0 0 24 24" fill="none" stroke={w.tone === "light" ? GREEN : w.tone === "greenLight" ? GREENDK : "#8ff0b0"} strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" className="h-6 w-6">{w.icon}</svg>
                    </span>
                    <h3 className="mt-5 font-display text-lg font-bold tracking-tight" style={{ color: t.ink }}>{w.t}</h3>
                    <p className="mt-2 text-sm leading-relaxed" style={{ color: t.sub }}>{w.d}</p>
                  </div>
                </Reveal>
              );
            })}
          </div>
        </div>
      </section>

      {/* Standards wall */}
      <section className="py-16 sm:py-20">
        <div className="mx-auto max-w-6xl px-5 sm:px-6">
          <Reveal>
            <h2 className="mx-auto max-w-2xl text-center font-display text-2xl font-bold sm:text-3xl" style={{ color: INK }}>Built to support the world&rsquo;s leading standards</h2>
            <p className="mx-auto mt-3 max-w-xl text-center text-base" style={{ color: BODY }}>ESGen is designed to support structured reporting across the frameworks that shape carbon and ESG disclosure.</p>
          </Reveal>
          <div className="mt-10"><MonoFrameworks /></div>
        </div>
      </section>

      {/* FAQ */}
      <section className="py-16 sm:py-24" style={{ background: "#f6fbf7" }}>
        <div className="mx-auto grid max-w-6xl gap-10 px-5 sm:px-6 lg:grid-cols-[0.8fr_1.2fr]">
          <div><H2>Common questions</H2><p className="mt-4 max-w-sm text-lg leading-relaxed" style={{ color: BODY }}>The essentials of carbon assessment, answered.</p></div>
          <div className="divide-y divide-[#dbeadf] border-y border-[#dbeadf]">
            {FAQS.map(([q, a]) => (
              <details key={q} className="group py-4">
                <summary className="flex cursor-pointer items-center justify-between gap-4 font-display text-base font-semibold" style={{ color: INK }}>{q}<svg viewBox="0 0 24 24" fill="none" stroke={GREEN} strokeWidth="2.4" strokeLinecap="round" className="h-4 w-4 shrink-0 transition-transform group-open:rotate-45"><path d="M12 5v14M5 12h14" /></svg></summary>
                <p className="mt-2 max-w-2xl text-sm leading-relaxed" style={{ color: BODY }}>{a}</p>
              </details>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 sm:py-24">
        <div className="mx-auto max-w-6xl px-5 sm:px-6">
          <div className="overflow-hidden rounded-3xl px-8 py-14 text-center sm:px-16" style={{ background: "linear-gradient(150deg, #16a34a, #0f6b42)" }}>
            <h2 className="mx-auto max-w-2xl font-display text-3xl font-bold text-white sm:text-4xl">Start measuring your footprint</h2>
            <p className="mx-auto mt-4 max-w-xl text-lg text-white/90">See how ESGen calculates your Scope 1, 2, and 3 emissions and helps you turn them into action.</p>
            <div className="mt-8 flex flex-wrap justify-center gap-3">
              <Link href="/demo" className="inline-flex items-center gap-2 rounded-lg bg-white px-5 py-3 text-sm font-semibold" style={{ color: GREENDK }}>Request a demo <Arrow /></Link>
              <Link href="/contact" className="inline-flex items-center gap-2 rounded-lg border border-white/50 px-5 py-3 text-sm font-semibold text-white transition-colors hover:bg-white/10">Contact us</Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
