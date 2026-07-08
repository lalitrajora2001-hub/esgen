import Link from "next/link";
import { Section, SectionHead } from "@/components/ui/Section";
import { Reveal, RevealGroup, RevealItem } from "@/components/ui/Reveal";
import { Button, ArrowRight } from "@/components/ui/Button";
import { FAQ } from "@/components/ui/FAQ";
import { ChartCard, EmissionsTrend, HotspotBar, ScenarioLine, ScopeDonut } from "@/components/charts/Charts";
import { ScopeDiagram } from "@/components/charts/ScopeDiagram";
import { PageHero, EducationCallout, CapabilityGrid, RelatedGrid, ClosingCTA, ReviewedNote } from "@/components/templates/shared";
import { getCompliance } from "@/lib/compliance";
import { heroImageFor, images } from "@/lib/images";
import type { Collection, LinkItem } from "@/lib/nav";

type Props = { collection: Collection; item: LinkItem };

/* ---------- Index (section landing) ---------- */
export function IndexPage({ collection }: { collection: Collection }) {
  return (
    <>
      <PageHero
        kicker={collection.label}
        title={collection.label}
        intro={collection.intro}
        trail={[{ label: "Home", href: "/" }, { label: collection.label }]}
        secondary={{ label: "Explore the platform", href: "/platform" }}
        image={heroImageFor(collection.key)}
      />
      <Section>
        <RevealGroup className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {collection.items.map((it) => (
            <RevealItem key={it.slug}>
              <Link href={`${collection.base}/${it.slug}`} className="card-surface block h-full p-6">
                <h3 className="font-display text-lg font-semibold">{it.title}</h3>
                <p className="mt-2 text-sm text-text-muted">{it.desc}</p>
                <span className="mt-4 inline-flex items-center gap-2 text-sm font-medium text-accent-3">Learn more <ArrowRight /></span>
              </Link>
            </RevealItem>
          ))}
        </RevealGroup>
      </Section>
      <ClosingCTA />
    </>
  );
}

/* ---------- Template router ---------- */
export function TemplatePage({ collection, item }: Props) {
  switch (collection.template) {
    case "product": return <ProductT collection={collection} item={item} />;
    case "solution": return <SolutionT collection={collection} item={item} />;
    case "industry": return <IndustryT collection={collection} item={item} />;
    case "compliance": return <ComplianceT collection={collection} item={item} />;
    case "article": return <ArticleT collection={collection} item={item} />;
    case "listing": return <ListingT collection={collection} item={item} />;
    case "company": return <CompanyT collection={collection} item={item} />;
    case "legal": return <LegalT collection={collection} item={item} />;
    default: return <ProductT collection={collection} item={item} />;
  }
}

const trailFor = (c: Collection, i: LinkItem) => [
  { label: "Home", href: "/" },
  { label: c.label, href: c.base },
  { label: i.title },
];

/* ---------- Product / Feature ---------- */
function ProductT({ collection, item }: Props) {
  return (
    <>
      <PageHero
        kicker={collection.label}
        title={item.title}
        intro={`${item.desc} ESGen brings this together in one place, so your data stays consistent and every figure can be traced back to its source.`}
        trail={trailFor(collection, item)}
        secondary={{ label: "See the platform", href: "/platform" }}
        image={heroImageFor(collection.key)}
      />

      <Section>
        <div className="grid items-center gap-12 lg:grid-cols-2">
          <Reveal>
            <p className="mono-label mb-4">The problem</p>
            <h2 className="text-3xl font-semibold sm:text-4xl">Scattered data slows everything down</h2>
            <p className="mt-4 text-lg text-text-muted">
              Most teams start with a pile of spreadsheets, a few PDFs, and data spread across systems that were never
              meant to talk to each other. That makes {item.title.toLowerCase()} slow, error-prone, and hard to repeat.
            </p>
            <p className="mt-4 text-text-muted">
              ESGen replaces that with one connected workflow. You bring data in once, and it flows through calculation,
              reporting, and analysis without re-keying. When something changes, everything downstream updates with it.
            </p>
          </Reveal>
          <Reveal delay={0.1}>
            <ChartCard title="Emissions trend and target pathway"><EmissionsTrend /></ChartCard>
          </Reveal>
        </div>
      </Section>

      <Section className="section-blend">
        <SectionHead eyebrow="What you get" title={`How ${item.title.toLowerCase()} works in ESGen`} intro="A focused set of capabilities, built to do the job well rather than to impress with a long feature list." center />
        <div className="mt-12">
          <CapabilityGrid items={[
            { t: "One place for your data", d: "Collect, store, and organise activity data so it is ready to use." },
            { t: "Consistent calculations", d: "Recognised methods and factors, applied the same way every time." },
            { t: "Full traceability", d: "Every figure links back to its source, method, and owner." },
            { t: "Made for teams", d: "Assign work, review it, and sign it off with a clear record." },
            { t: "Ready to share", d: "Export clean, referenced outputs for auditors and boards." },
            { t: "Guidance included", d: "Talk to a real person when a decision is not obvious." },
          ]} />
        </div>
      </Section>

      <Section>
        <SectionHead eyebrow="How it fits your workflow" title="Three simple steps" center />
        <RevealGroup className="mt-10 grid gap-5 lg:grid-cols-3">
          {[
            { n: "01", t: "Connect", d: "Bring in your data by upload, form, or integration." },
            { n: "02", t: "Work", d: `Use ${item.title.toLowerCase()} alongside the rest of ESGen.` },
            { n: "03", t: "Report", d: "Export a result you can share with confidence." },
          ].map((s) => (
            <RevealItem key={s.n}>
              <div className="card-surface h-full p-7">
                <span className="font-mono text-sm text-accent-3">{s.n}</span>
                <h3 className="mt-2 font-display text-xl font-semibold">{s.t}</h3>
                <p className="mt-2 text-text-muted">{s.d}</p>
              </div>
            </RevealItem>
          ))}
        </RevealGroup>
      </Section>

      <Section className="section-blend">
        <EducationCallout title="Why traceability matters">
          <p>Reporting only helps if people believe the figures. That means being able to show where each number came from,
          what method produced it, and who signed it off. ESGen keeps that record automatically, so a review or audit is
          a walk through the evidence rather than a scramble.</p>
        </EducationCallout>
      </Section>

      <RelatedGrid collection={collection} current={item.slug} />
      <ClosingCTA />
    </>
  );
}

/* ---------- Solution ---------- */
function SolutionT({ collection, item }: Props) {
  return (
    <>
      <PageHero
        kicker={collection.label}
        title={item.title}
        intro={`${item.desc} ESGen helps you get there with clear data, practical guidance, and a workflow you can repeat.`}
        trail={trailFor(collection, item)}
        secondary={{ label: "See compliance", href: "/compliance" }}
        image={heroImageFor(collection.key)}
      />

      <Section>
        <div className="grid gap-12 lg:grid-cols-2">
          <Reveal>
            <p className="mono-label mb-4">The pains</p>
            <h2 className="text-3xl font-semibold sm:text-4xl">What gets in the way</h2>
            <ul className="mt-6 space-y-3 text-text-muted">
              {["Data lives in too many places", "Methods are inconsistent year to year", "It is hard to prove the numbers", "The work does not scale as demands grow"].map((t) => (
                <li key={t} className="flex items-start gap-3"><span className="mt-1 text-text-muted/50">·</span>{t}</li>
              ))}
            </ul>
          </Reveal>
          <Reveal delay={0.1}>
            <p className="mono-label mb-4">How ESGen solves it</p>
            <h2 className="text-3xl font-semibold sm:text-4xl">A clear path forward</h2>
            <ul className="mt-6 space-y-3 text-text">
              {["One connected place for your data", "Recognised methods, applied consistently", "A full audit trail on every figure", "A workflow that scales with you"].map((t) => (
                <li key={t} className="flex items-start gap-3">
                  <span className="mt-0.5 grid h-6 w-6 shrink-0 place-items-center rounded-full bg-[rgba(63,182,168,0.16)] text-[#3fb6a8]"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" className="h-3.5 w-3.5"><path d="M5 13l4 4L19 7" /></svg></span>
                  {t}
                </li>
              ))}
            </ul>
          </Reveal>
        </div>
      </Section>

      <Section className="section-blend">
        <div className="rounded-2xl border border-border bg-gradient-to-b from-surface to-canvas p-8 sm:p-12">
          <div className="grid gap-8 text-center sm:grid-cols-3">
            {[["[verify]", "Faster reporting cycle"], ["[verify]", "Less manual data work"], ["[verify]", "Figures with an audit trail"]].map(([v, l]) => (
              <div key={l}>
                <div className="font-display text-3xl font-semibold text-accent-3 sm:text-4xl">{v}</div>
                <p className="mt-2 text-text-muted">{l}</p>
              </div>
            ))}
          </div>
          <p className="mt-6 text-center font-mono text-xs text-text-muted/60">Outcome metrics are placeholders. Replace with verified results.</p>
        </div>
      </Section>

      <Section>
        <ChartCard title="Reduction scenario vs business as usual"><ScenarioLine /></ChartCard>
      </Section>

      <Section className="section-blend">
        <EducationCallout title="How this connects to reporting">
          <p>Whatever your goal, the underlying data is the same. Measure well once, on the GHG Protocol, and you can serve
          compliance, procurement questions, and reduction planning from a single source. See the <Link href="/compliance" className="text-accent-3 underline">compliance primers</Link> for the frameworks that may apply to you.</p>
        </EducationCallout>
      </Section>

      <RelatedGrid collection={collection} current={item.slug} />
      <ClosingCTA />
    </>
  );
}

/* ---------- Industry ---------- */
function IndustryT({ collection, item }: Props) {
  return (
    <>
      <PageHero
        kicker="Industries"
        title={`ESG and carbon software for ${item.title.toLowerCase()}`}
        intro={`${item.desc} ESGen is built to handle the data and hotspots that matter most in ${item.title.toLowerCase()}.`}
        trail={trailFor(collection, item)}
        secondary={{ label: "All industries", href: "/industries" }}
        image={heroImageFor(collection.key)}
      />

      <Section>
        <div className="grid items-center gap-12 lg:grid-cols-2">
          <Reveal>
            <p className="mono-label mb-4">Sector drivers</p>
            <h2 className="text-3xl font-semibold sm:text-4xl">What is pushing {item.title.toLowerCase()} to measure</h2>
            <p className="mt-4 text-lg text-text-muted">
              Across {item.title.toLowerCase()}, the pressure to measure emissions is coming from customers, investors, and
              regulation at once. Larger buyers ask suppliers for data, tenders increasingly require it, and frameworks such
              as the GHG Protocol and ISSB set the expectations for how it is done.
            </p>
            <p className="mt-4 text-text-muted">
              Getting ahead of these requests is easier than scrambling to answer them later. A clear baseline turns a
              reactive task into a repeatable process.
            </p>
          </Reveal>
          <Reveal delay={0.1}>
            <ChartCard title={`Typical emissions hotspots, ${item.title.toLowerCase()}`}><HotspotBar /></ChartCard>
          </Reveal>
        </div>
      </Section>

      <Section className="section-blend">
        <SectionHead eyebrow="How ESGen helps" title={`Built for ${item.title.toLowerCase()} teams`} center />
        <div className="mt-12">
          <CapabilityGrid items={[
            { t: "Capture the right data", d: "Bring in the activity data that drives emissions in your sector." },
            { t: "See your hotspots", d: "Find the categories that matter most, so you focus effort well." },
            { t: "Answer buyers", d: "Respond to customer and tender questionnaires with confidence." },
            { t: "Plan reductions", d: "Model changes against a business-as-usual baseline." },
            { t: "Report cleanly", d: "Produce framework-ready outputs with a clear audit trail." },
            { t: "Get guidance", d: "Talk to a real person about sector-specific questions." },
          ]} />
        </div>
      </Section>

      <Section>
        <Reveal>
          <div className="rounded-2xl border border-dashed border-border p-8 text-center">
            <p className="mono-label">Case study</p>
            <p className="mt-3 text-lg text-text-muted">[case study placeholder: add a real {item.title.toLowerCase()} customer story once available]</p>
          </div>
        </Reveal>
      </Section>

      <RelatedGrid collection={collection} current={item.slug} />
      <ClosingCTA />
    </>
  );
}

/* ---------- Compliance (bespoke, accurate) ---------- */
function ComplianceT({ collection, item }: Props) {
  const data = getCompliance(item.slug);
  if (!data) return <ProductT collection={collection} item={item} />;
  return (
    <>
      <PageHero
        kicker="Compliance primer"
        title={data.name}
        intro={data.summary}
        trail={trailFor(collection, item)}
        secondary={{ label: "All frameworks", href: "/compliance" }}
        image={heroImageFor(collection.key)}
      />

      <Section>
        <div className="grid gap-12 lg:grid-cols-[1.5fr_1fr]">
          <div>
            <Reveal>
              <p className="mono-label mb-3">{data.full}</p>
              <h2 className="text-3xl font-semibold sm:text-4xl">What it is</h2>
              <div className="mt-4 space-y-4 text-lg text-text-muted">
                {data.whatItIs.map((p, i) => <p key={i}>{p}</p>)}
              </div>
            </Reveal>
            <Reveal>
              <h2 className="mt-12 text-3xl font-semibold sm:text-4xl">{data.status.heading}</h2>
              <div className="mt-4 space-y-4 text-text-muted">
                {data.status.body.map((p, i) => <p key={i}>{p}</p>)}
              </div>
            </Reveal>
          </div>
          <aside className="lg:pt-2">
            <div className="card-surface sticky top-24 p-6">
              <p className="mono-label mb-4">Key requirements</p>
              <ul className="space-y-4">
                {data.requirements.map((r) => (
                  <li key={r.t}>
                    <p className="font-display text-sm font-semibold text-text">{r.t}</p>
                    <p className="mt-1 text-sm text-text-muted">{r.d}</p>
                  </li>
                ))}
              </ul>
            </div>
          </aside>
        </div>
      </Section>

      <Section className="section-blend">
        <EducationCallout title={`How ESGen supports ${data.name}`}>
          <ul className="space-y-2">
            {data.esgenHelps.map((h) => (
              <li key={h} className="flex items-start gap-3">
                <span className="mt-0.5 grid h-6 w-6 shrink-0 place-items-center rounded-full bg-[rgba(63,182,168,0.16)] text-[#3fb6a8]"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" className="h-3.5 w-3.5"><path d="M5 13l4 4L19 7" /></svg></span>
                <span className="text-text-muted">{h}</span>
              </li>
            ))}
          </ul>
        </EducationCallout>
      </Section>

      <Section>
        <SectionHead eyebrow="Questions" title={`${data.name} FAQ`} />
        <div className="mt-8"><FAQ items={data.faqs} /></div>
        <div className="mt-8"><ReviewedNote date={data.lastReviewed} /></div>
      </Section>

      <RelatedGrid collection={collection} current={item.slug} />
      <ClosingCTA title={`Prepare for ${data.name} with confidence`} />
    </>
  );
}

/* ---------- Article (knowledge, docs) ---------- */
function ArticleT({ collection, item }: Props) {
  const isCarbon = item.slug === "carbon-accounting";
  return (
    <>
      <PageHero
        kicker={collection.label}
        title={item.title}
        intro={item.desc}
        trail={trailFor(collection, item)}
        secondary={{ label: `All ${collection.label.toLowerCase()}`, href: collection.base }}
      />

      <Section>
        <div className="grid gap-12 lg:grid-cols-[1fr_2.4fr]">
          <aside className="lg:sticky lg:top-24 lg:self-start">
            <p className="mono-label mb-3">On this page</p>
            <ul className="space-y-2 text-sm text-text-muted">
              <li><a href="#overview" className="hover:text-text">Overview</a></li>
              <li><a href="#detail" className="hover:text-text">In detail</a></li>
              <li><a href="#takeaways" className="hover:text-text">Key takeaways</a></li>
            </ul>
          </aside>

          <article className="prose-esgen max-w-2xl">
            <h2 id="overview" className="text-2xl font-semibold sm:text-3xl">Overview</h2>
            <p className="mt-4 text-lg text-text-muted">
              {item.desc} This guide explains the essentials in plain language, so you can act with confidence rather than
              wade through jargon.
            </p>
            <p className="mt-4 text-text-muted">
              Carbon accounting is the process of measuring the greenhouse gas emissions linked to your activities,
              expressed in tonnes of carbon dioxide equivalent, written as tCO2e. Under the GHG Protocol, those emissions
              are grouped into three scopes.
            </p>

            {isCarbon && <div className="my-8 not-prose"><ScopeDiagram /></div>}

            <h2 id="detail" className="mt-10 text-2xl font-semibold sm:text-3xl">In detail</h2>
            <p className="mt-4 text-text-muted">
              Scope 1 covers direct emissions from sources you own or control, such as company vehicles and on-site fuel
              combustion. Scope 2 covers indirect emissions from the energy you buy, such as electricity, steam, heating,
              and cooling. Scope 3 covers all other indirect emissions across your value chain, split into 15 categories,
              and it is usually the largest and hardest to measure.
            </p>
            <p className="mt-4 text-text-muted">
              The goal is not perfection on day one. It is a defensible baseline you can improve over time, with clear
              methods and sources behind every figure.
            </p>

            <div id="takeaways" className="not-prose mt-10 rounded-2xl border border-accent/20 bg-[rgba(77,139,245,0.06)] p-6">
              <p className="mono-label mb-3">Key takeaways</p>
              <ul className="space-y-2 text-text-muted">
                <li className="flex gap-3"><span className="text-accent-3">1.</span> Emissions are measured in tCO2e and grouped into three scopes.</li>
                <li className="flex gap-3"><span className="text-accent-3">2.</span> Scope 3 is usually the largest and needs value-chain data.</li>
                <li className="flex gap-3"><span className="text-accent-3">3.</span> A defensible baseline beats a perfect one that arrives too late.</li>
              </ul>
            </div>
          </article>
        </div>
      </Section>

      <RelatedGrid collection={collection} current={item.slug} />
      <ClosingCTA />
    </>
  );
}

/* ---------- Listing (customers, resources, careers, press, events, support) ---------- */
function ListingT({ collection, item }: Props) {
  const chips = ["All", "Latest", "Popular", "Guides", "Updates"];
  return (
    <>
      <PageHero
        kicker={collection.label}
        title={item.title}
        intro={item.desc}
        trail={trailFor(collection, item)}
        secondary={{ label: `All ${collection.label.toLowerCase()}`, href: collection.base }}
      />

      {collection.key === "customers" && (
        <Section size="sm">
          <div className="overflow-hidden rounded-2xl border border-border">
            <img src={images.team.src} alt={images.team.alt} loading="lazy" className="h-56 w-full object-cover sm:h-72 md:h-80" />
          </div>
        </Section>
      )}

      <Section>
        <div className="mb-8 flex flex-wrap items-center gap-2">
          {chips.map((c, i) => (
            <span key={c} className={`rounded-full border px-4 py-1.5 text-sm ${i === 0 ? "border-accent bg-accent/10 text-text" : "border-border text-text-muted"}`}>{c}</span>
          ))}
          <span className="ml-auto font-mono text-xs text-text-muted/60">Sample cards. Replace with real content.</span>
        </div>
        <RevealGroup className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: 6 }).map((_, i) => (
            <RevealItem key={i}>
              <div className="card-surface h-full overflow-hidden">
                <div className="aspect-[16/10] w-full" style={{ background: "linear-gradient(160deg, #17171a, #060608)" }} />
                <div className="p-6">
                  <p className="font-mono text-[0.7rem] uppercase tracking-wider text-accent-3">{item.title}</p>
                  <h3 className="mt-2 font-display text-lg font-semibold">[sample title {i + 1}]</h3>
                  <p className="mt-2 text-sm text-text-muted">[short summary placeholder for this {collection.label.toLowerCase()} item.]</p>
                </div>
              </div>
            </RevealItem>
          ))}
        </RevealGroup>
        <div className="mt-10 flex justify-center gap-2 font-mono text-sm text-text-muted">
          <span className="rounded-lg border border-accent bg-accent/10 px-3 py-1.5 text-text">1</span>
          <span className="rounded-lg border border-border px-3 py-1.5">2</span>
          <span className="rounded-lg border border-border px-3 py-1.5">3</span>
        </div>
      </Section>

      <ClosingCTA />
    </>
  );
}

/* ---------- Company ---------- */
function CompanyT({ collection, item }: Props) {
  return (
    <>
      <PageHero
        kicker="Company"
        title={item.title}
        intro={item.desc}
        trail={trailFor(collection, item)}
        secondary={{ label: "Contact us", href: "/contact" }}
      />

      <Section>
        <div className="mx-auto max-w-3xl">
          <Reveal>
            <p className="text-lg text-text-muted">
              ESGen is a new company with a simple goal: to make carbon accounting and ESG reporting clear, honest, and
              genuinely usable for businesses that are doing it for the first time. We would rather earn trust than claim
              it, so we are upfront about being early.
            </p>
            <p className="mt-4 text-text-muted">
              We pair a straightforward platform with real guidance. That means people who understand the frameworks are a
              message away when a decision is not obvious, not hidden behind a paywall.
            </p>
          </Reveal>
        </div>
        <RevealGroup className="mt-12 grid gap-4 sm:grid-cols-3">
          {[["Honesty first", "We tell you what we cannot do yet, not just what we can."], ["Clarity over cleverness", "Plain language and clear numbers."], ["Actually helpful", "Real support from real people."]].map(([t, d]) => (
            <RevealItem key={t}>
              <div className="card-surface h-full p-6">
                <h3 className="font-display text-lg font-semibold">{t}</h3>
                <p className="mt-2 text-sm text-text-muted">{d}</p>
              </div>
            </RevealItem>
          ))}
        </RevealGroup>
        <div className="mt-10 rounded-2xl border border-dashed border-border p-6 text-center">
          <p className="font-mono text-sm text-text-muted">[team member placeholders: add real names, roles, and photos]</p>
        </div>
      </Section>

      <Section className="section-blend">
        <div className="grid gap-4 sm:grid-cols-2">
          <div className="overflow-hidden rounded-2xl border border-border">
            <img src={images.office.src} alt={images.office.alt} loading="lazy" className="h-56 w-full object-cover sm:h-64" />
          </div>
          <div className="overflow-hidden rounded-2xl border border-border">
            <img src={images.meeting.src} alt={images.meeting.alt} loading="lazy" className="h-56 w-full object-cover sm:h-64" />
          </div>
        </div>
      </Section>

      <RelatedGrid collection={collection} current={item.slug} />
      <ClosingCTA title="Come and say hello" intro="Whether you are ready to start or just curious, we are happy to talk." />
    </>
  );
}

/* ---------- Legal ---------- */
function LegalT({ collection, item }: Props) {
  const sections = [
    { id: "intro", h: "Introduction", b: `This ${item.title.toLowerCase()} explains how ESGen approaches this topic. It uses standard placeholder wording and must be reviewed by a qualified legal adviser before publishing.` },
    { id: "scope", h: "Scope", b: "This document applies to the ESGen website and services. Specific terms will be confirmed before launch." },
    { id: "your-rights", h: "Your rights", b: "You have rights over your data under UK GDPR, including access, correction, and deletion. Contact us to exercise them." },
    { id: "contact", h: "Contact", b: `Questions about this ${item.title.toLowerCase()} can be sent to info@esgen.co.uk.` },
  ];
  return (
    <>
      <PageHero
        kicker="Legal"
        title={item.title}
        intro="Placeholder wording. This page must be reviewed by a qualified legal adviser before it is published."
        trail={trailFor(collection, item)}
      />
      <Section>
        <div className="grid gap-12 lg:grid-cols-[1fr_2.4fr]">
          <aside className="lg:sticky lg:top-24 lg:self-start">
            <p className="mono-label mb-3">Sections</p>
            <ul className="space-y-2 text-sm text-text-muted">
              {sections.map((s) => <li key={s.id}><a href={`#${s.id}`} className="hover:text-text">{s.h}</a></li>)}
            </ul>
            <p className="mt-6 font-mono text-xs text-text-muted/60">Last updated: [date]</p>
          </aside>
          <div className="max-w-2xl">
            {sections.map((s) => (
              <div key={s.id} id={s.id} className="mb-8 scroll-mt-24">
                <h2 className="text-2xl font-semibold">{s.h}</h2>
                <p className="mt-3 text-text-muted">{s.b}</p>
              </div>
            ))}
            <div className="rounded-xl border border-accent/20 bg-[rgba(77,139,245,0.06)] p-5 font-mono text-xs text-text-muted">
              Note: legal review is required before publishing. Do not rely on this placeholder wording.
            </div>
          </div>
        </div>
      </Section>
    </>
  );
}
