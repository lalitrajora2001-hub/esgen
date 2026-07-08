import Link from "next/link";
import { Hero } from "@/components/sections/Hero";
import { Section, SectionHead } from "@/components/ui/Section";
import { Reveal, RevealGroup, RevealItem } from "@/components/ui/Reveal";
import { StatCounter } from "@/components/ui/StatCounter";
import { FAQ } from "@/components/ui/FAQ";
import { Button, ArrowRight } from "@/components/ui/Button";
import { ChartCard, EmissionsTrend, HotspotBar, ScopeDonut } from "@/components/charts/Charts";
import { ScopeDiagram } from "@/components/charts/ScopeDiagram";

const IconWrap = ({ children }: { children: React.ReactNode }) => (
  <div className="mb-5 grid h-12 w-12 place-items-center rounded-xl border border-accent/25 bg-accent/10 text-accent-3">
    {children}
  </div>
);

export default function Home() {
  return (
    <>
      <Hero />

      {/* Trust bar (placeholder slots, no invented names) */}
      <Section size="sm" className="section-blend">
        <Reveal className="text-center">
          <p className="mono-label">Trusted by teams getting started with reporting</p>
        </Reveal>
        <div className="mt-8 grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-6">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="flex h-14 items-center justify-center rounded-lg border border-dashed border-border text-xs text-text-muted/70">
              Client logo
            </div>
          ))}
        </div>
      </Section>

      {/* Positioning transition line */}
      <Section size="sm">
        <Reveal>
          <p className="mx-auto max-w-4xl text-center text-2xl font-medium leading-snug text-text sm:text-3xl">
            Emissions reporting is becoming a condition of doing business. ESGen makes the measurement part
            <span className="text-gradient"> clear, defensible, and genuinely usable.</span>
          </p>
        </Reveal>
      </Section>

      {/* Core differentiator */}
      <Section>
        <div className="grid items-center gap-12 lg:grid-cols-2">
          <Reveal>
            <p className="mono-label mb-4">Software plus real guidance</p>
            <h2 className="text-3xl font-semibold sm:text-4xl">The support you would want, without hiring a consultant</h2>
            <p className="mt-4 text-lg text-text-muted">
              A tool can do the arithmetic, but it cannot decide your reporting boundaries or read a standard for you.
              ESGen pairs a straightforward platform with practical guidance from people who understand the frameworks,
              so your first report is something you can stand behind.
            </p>
            <ul className="mt-6 space-y-3">
              {[
                "Emissions calculated on the GHG Protocol",
                "Every figure traceable to its source",
                "Guidance included, not a costly add-on",
              ].map((t) => (
                <li key={t} className="flex items-start gap-3">
                  <span className="mt-0.5 grid h-6 w-6 shrink-0 place-items-center rounded-full bg-[rgba(63,182,168,0.16)] text-[#3fb6a8]">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" className="h-3.5 w-3.5"><path d="M5 13l4 4L19 7" /></svg>
                  </span>
                  <span className="text-text">{t}</span>
                </li>
              ))}
            </ul>
            <div className="mt-8"><Button href="/platform" variant="ghost">See how it works <ArrowRight /></Button></div>
          </Reveal>
          <Reveal delay={0.1}>
            <ChartCard title="Emissions trend and target pathway">
              <EmissionsTrend />
            </ChartCard>
          </Reveal>
        </div>
      </Section>

      {/* Stats band */}
      <Section className="section-blend">
        <div className="rounded-2xl border border-border bg-gradient-to-b from-surface to-canvas p-8 sm:p-12">
          <RevealGroup className="grid grid-cols-2 gap-8 lg:grid-cols-4">
            <RevealItem><StatCounter value={3} label="Emission scopes covered" note="1, 2 and 3" /></RevealItem>
            <RevealItem><StatCounter value={11} suffix="+" label="Frameworks explained" note="CSRD, ISSB, GHG Protocol and more" /></RevealItem>
            <RevealItem><StatCounter value={60} suffix="%" label="Less time on manual data" note="[verify with pilot data]" /></RevealItem>
            <RevealItem><StatCounter value={100} suffix="%" label="Figures with an audit trail" note="[verify]" /></RevealItem>
          </RevealGroup>
        </div>
      </Section>

      {/* Trust and traceability */}
      <Section>
        <SectionHead eyebrow="Trust and traceability" title="Numbers you can defend" intro="Reporting only helps if people believe the figures. ESGen is built so every number can be checked, from headline total down to the original data point." center />
        <RevealGroup className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {[
            { t: "Full data lineage", d: "Trace any figure back to its source file, method, and owner." },
            { t: "Recognised factors", d: "Emission factors from recognised UK and international sources." },
            { t: "Version history", d: "See what changed, when, and why, on every metric." },
            { t: "Export ready", d: "Hand a clean, referenced pack to your auditor or board." },
          ].map((c) => (
            <RevealItem key={c.t}>
              <div className="card-surface h-full p-6">
                <h3 className="font-display text-lg font-semibold">{c.t}</h3>
                <p className="mt-2 text-sm text-text-muted">{c.d}</p>
              </div>
            </RevealItem>
          ))}
        </RevealGroup>
      </Section>

      {/* Three-column feature grid */}
      <Section className="section-blend">
        <SectionHead eyebrow="How it works" title="From scattered data to a report you trust" center />
        <RevealGroup className="mt-12 grid gap-5 lg:grid-cols-3">
          {[
            { t: "Measure", d: "Add energy, travel, and supplier data by upload or simple forms. ESGen turns it into a clear baseline across all three scopes.", icon: <path d="M3 3v18h18M7 15l4-5 3 3 5-7" /> },
            { t: "Report", d: "Map your baseline to CSRD, SECR, or the framework you need, and export a report you can share with confidence.", icon: <><rect x="4" y="3" width="16" height="18" rx="2" /><path d="M9 8h6M9 12h6M9 16h4" /></> },
            { t: "Reduce", d: "Find your biggest sources, set a realistic target, and track progress over time, with guidance along the way.", icon: <path d="M12 20V10M6 20v-5M18 20V6M4 20h16" /> },
          ].map((c) => (
            <RevealItem key={c.t}>
              <div className="card-surface h-full p-7">
                <IconWrap><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" className="h-6 w-6">{c.icon}</svg></IconWrap>
                <h3 className="font-display text-xl font-semibold">{c.t}</h3>
                <p className="mt-2 text-text-muted">{c.d}</p>
              </div>
            </RevealItem>
          ))}
        </RevealGroup>
      </Section>

      {/* Business impact */}
      <Section>
        <div className="grid items-center gap-12 lg:grid-cols-2">
          <Reveal>
            <ChartCard title="Emissions hotspots by category">
              <HotspotBar />
            </ChartCard>
          </Reveal>
          <Reveal delay={0.1}>
            <p className="mono-label mb-4">Why it matters</p>
            <h2 className="text-3xl font-semibold sm:text-4xl">Turn a reporting task into a business advantage</h2>
            <p className="mt-4 text-lg text-text-muted">
              Good emissions data is increasingly asked for in tenders, by investors, and around the board table.
              ESGen helps you answer those questions quickly and credibly, and shows you where reductions will have
              the most effect.
            </p>
            <div className="mt-6 grid gap-4 sm:grid-cols-3">
              {[["Win tenders", "Answer buyer questionnaires with confidence."], ["Reassure investors", "Show a credible plan, not just a number."], ["Support the board", "Bring decision-grade data to the table."]].map(([t, d]) => (
                <div key={t} className="rounded-xl border border-border bg-surface/60 p-4">
                  <p className="font-display text-sm font-semibold">{t}</p>
                  <p className="mt-1 text-xs text-text-muted">{d}</p>
                </div>
              ))}
            </div>
          </Reveal>
        </div>
      </Section>

      {/* Scientific credibility */}
      <Section className="section-blend">
        <SectionHead eyebrow="Built on real standards" title="Grounded in the GHG Protocol" intro="ESGen's calculations follow the GHG Protocol, the most widely used standard for corporate emissions accounting. Where relevant we align to ISO methods and the ISSB baseline. Nothing is a black box." center />
        <RevealGroup className="mt-10 flex flex-wrap justify-center gap-3">
          {["GHG Protocol", "ISSB (IFRS S1/S2)", "TCFD (within ISSB)", "ISO 14064", "CSRD / ESRS", "SECR", "CDP", "SBTi"].map((c) => (
            <RevealItem key={c}>
              <span className="inline-flex items-center gap-2 rounded-full border border-border bg-surface px-4 py-2 text-sm text-text-muted">
                <span className="h-1.5 w-1.5 rounded-full bg-accent" />{c}
              </span>
            </RevealItem>
          ))}
        </RevealGroup>
        <p className="mt-6 text-center font-mono text-xs text-text-muted/60">Framework support and alignment described on each compliance page. Last reviewed early 2026.</p>
      </Section>

      {/* Testimonials (structure only, no invented quotes) */}
      <Section>
        <SectionHead eyebrow="In their words" title="What customers say" intro="We will add real quotes here as our first customers share their experience." center />
        <div className="mt-12 grid gap-5 lg:grid-cols-3">
          {Array.from({ length: 3 }).map((_, i) => (
            <div key={i} className="card-surface p-7">
              <div className="flex gap-1 text-accent-3">{"★★★★★".split("").map((s, j) => <span key={j}>{s}</span>)}</div>
              <p className="mt-4 text-text-muted">[testimonial quote to be added]</p>
              <div className="mt-6 flex items-center gap-3">
                <div className="h-10 w-10 rounded-full bg-surface-2" />
                <div className="text-sm">
                  <p className="font-medium text-text">[name]</p>
                  <p className="text-text-muted">[role, company]</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </Section>

      {/* Educational: What is carbon accounting + scopes */}
      <Section className="section-blend">
        <div className="mx-auto max-w-3xl text-center">
          <p className="mono-label">Carbon Academy</p>
          <h2 className="mt-4 text-3xl font-semibold sm:text-4xl">What is carbon accounting?</h2>
          <p className="mt-4 text-lg text-text-muted">
            Carbon accounting is the process of measuring the greenhouse gas emissions linked to your activities,
            expressed in tonnes of carbon dioxide equivalent (tCO2e). Under the GHG Protocol those emissions are
            grouped into three scopes.
          </p>
        </div>
        <div className="mt-10"><ScopeDiagram /></div>
        <div className="mt-6 text-center">
          <Link href="/knowledge/carbon-accounting" className="inline-flex items-center gap-2 font-display font-semibold text-accent-3 hover:gap-3">
            Read the full explainer <ArrowRight />
          </Link>
        </div>
      </Section>

      {/* Software beats spreadsheets */}
      <Section>
        <SectionHead eyebrow="Why software beats spreadsheets" title="Spreadsheets do not scale with scrutiny" center />
        <div className="mt-10 grid gap-5 lg:grid-cols-2">
          <Reveal>
            <div className="card-surface h-full p-7">
              <p className="font-mono text-xs uppercase tracking-wider text-text-muted">Spreadsheets</p>
              <ul className="mt-4 space-y-3 text-text-muted">
                {["Formulas break and no one notices", "Emission factors go out of date", "No record of who changed what", "Painful to reproduce next year"].map((t) => (
                  <li key={t} className="flex items-start gap-3"><span className="mt-1 text-text-muted/50">·</span>{t}</li>
                ))}
              </ul>
            </div>
          </Reveal>
          <Reveal delay={0.1}>
            <div className="card-surface h-full border-accent/30 p-7">
              <p className="font-mono text-xs uppercase tracking-wider text-accent-3">ESGen</p>
              <ul className="mt-4 space-y-3 text-text">
                {["Calculations are consistent and checked", "Factors kept current for you", "Full audit trail on every figure", "Repeatable, year after year"].map((t) => (
                  <li key={t} className="flex items-start gap-3">
                    <span className="mt-0.5 grid h-6 w-6 shrink-0 place-items-center rounded-full bg-[rgba(63,182,168,0.16)] text-[#3fb6a8]"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" className="h-3.5 w-3.5"><path d="M5 13l4 4L19 7" /></svg></span>
                    {t}
                  </li>
                ))}
              </ul>
            </div>
          </Reveal>
        </div>
      </Section>

      {/* Compliance primer cards */}
      <Section className="section-blend">
        <SectionHead eyebrow="Compliance primer" title="Know which rules apply to you" intro="Short, accurate primers on the frameworks that shape reporting. Each links to a full page." center />
        <RevealGroup className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {[
            { t: "CSRD", d: "The EU directive, narrowed in 2026. Find out if you are still in scope.", href: "/compliance/csrd" },
            { t: "GHG Protocol", d: "The standard behind most carbon accounting.", href: "/compliance/ghg-protocol" },
            { t: "SBTi", d: "Science-based emissions reduction targets.", href: "/compliance/sbti" },
            { t: "BRSR", d: "India's reporting rules for large listed firms and their suppliers.", href: "/compliance/brsr" },
          ].map((c) => (
            <RevealItem key={c.t}>
              <Link href={c.href} className="card-surface block h-full p-6">
                <h3 className="font-display text-lg font-semibold">{c.t}</h3>
                <p className="mt-2 text-sm text-text-muted">{c.d}</p>
                <span className="mt-4 inline-flex items-center gap-2 text-sm font-medium text-accent-3">Learn more <ArrowRight /></span>
              </Link>
            </RevealItem>
          ))}
        </RevealGroup>
      </Section>

      {/* Product tour visual (scope donut) */}
      <Section>
        <div className="grid items-center gap-12 lg:grid-cols-2">
          <Reveal>
            <p className="mono-label mb-4">See your footprint</p>
            <h2 className="text-3xl font-semibold sm:text-4xl">Understand where your emissions come from</h2>
            <p className="mt-4 text-lg text-text-muted">
              A clear breakdown by scope is the starting point for any credible plan. ESGen shows you the split,
              highlights the hotspots, and helps you decide where to focus first.
            </p>
            <div className="mt-8"><Button href="/demo">Book a demo <ArrowRight /></Button></div>
          </Reveal>
          <Reveal delay={0.1}>
            <ChartCard title="Emissions by scope">
              <ScopeDonut />
            </ChartCard>
          </Reveal>
        </div>
      </Section>

      {/* FAQ */}
      <Section className="section-blend">
        <div className="grid gap-10 lg:grid-cols-[0.9fr_1.4fr]">
          <SectionHead eyebrow="FAQ" title="Common questions" />
          <FAQ
            items={[
              { q: "Are you an established company?", a: "We are new, and honest about that. What we offer is care, clarity, and a fair price, with software grounded in recognised standards." },
              { q: "Which frameworks do you support?", a: "We build on the GHG Protocol and explain and support CSRD, SECR, ISSB, TCFD, GRI, CDP, and SBTi. See the compliance pages for detail." },
              { q: "Do I need to be technical to use ESGen?", a: "No. It is built for people doing this for the first time, and guidance is included if you get stuck." },
              { q: "Where is my data stored?", a: "In UK and EU regions, encrypted in transit and at rest, and handled in line with UK GDPR. You can export or delete it whenever you like." },
            ]}
          />
        </div>
      </Section>

      {/* Closing CTA */}
      <Section>
        <Reveal>
          <div className="relative overflow-hidden rounded-2xl border border-border p-10 text-center sm:p-16" style={{ background: "radial-gradient(700px 340px at 80% 0%, rgba(77,139,245,0.12), transparent 60%), linear-gradient(160deg, #0e0e10, #060608)" }}>
            <h2 className="mx-auto max-w-2xl text-3xl font-semibold sm:text-4xl">Get your first report started</h2>
            <p className="mx-auto mt-4 max-w-xl text-lg text-text-muted">
              Book a short, no-pressure demo. We will show you the platform, talk through your situation, and be
              honest about whether ESGen is the right fit.
            </p>
            <div className="mt-8 flex flex-wrap justify-center gap-3">
              <Button href="/demo" size="lg">Book a demo <ArrowRight /></Button>
              <Button href="/contact" variant="ghost" size="lg">Talk to us</Button>
            </div>
          </div>
        </Reveal>
      </Section>
    </>
  );
}
