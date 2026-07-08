import Link from "next/link";
import { Section } from "@/components/ui/Section";
import { Reveal, RevealGroup, RevealItem } from "@/components/ui/Reveal";
import { Button, ArrowRight } from "@/components/ui/Button";
import type { Collection, LinkItem } from "@/lib/nav";
import type { Img } from "@/lib/images";

export function Breadcrumb({ trail }: { trail: { label: string; href?: string }[] }) {
  return (
    <nav aria-label="Breadcrumb" className="mb-5 flex flex-wrap items-center gap-2 font-mono text-xs text-text-muted/70">
      {trail.map((t, i) => (
        <span key={i} className="flex items-center gap-2">
          {t.href ? <Link href={t.href} className="hover:text-text">{t.label}</Link> : <span className="text-text-muted">{t.label}</span>}
          {i < trail.length - 1 && <span className="opacity-50">/</span>}
        </span>
      ))}
    </nav>
  );
}

export function PageHero({
  kicker,
  title,
  intro,
  trail,
  primary = { label: "Book a demo", href: "/demo" },
  secondary,
  image,
}: {
  kicker: string;
  title: string;
  intro: string;
  trail: { label: string; href?: string }[];
  primary?: { label: string; href: string };
  secondary?: { label: string; href: string };
  image?: Img;
}) {
  return (
    <section className="relative overflow-hidden pt-32 pb-14 sm:pt-40 sm:pb-20">
      <div aria-hidden className="pointer-events-none absolute inset-0" style={{ background: "radial-gradient(760px 420px at 82% -10%, rgba(77,139,245,0.10), transparent 60%)" }} />
      <div className="grid-texture pointer-events-none absolute inset-0" aria-hidden />
      <div className="relative mx-auto max-w-6xl px-5 sm:px-6">
        <Breadcrumb trail={trail} />
        <p className="mono-label">{kicker}</p>
        <h1 className="mt-4 max-w-3xl text-4xl font-semibold leading-[1.05] sm:text-5xl">{title}</h1>
        <p className="mt-5 max-w-2xl text-lg text-text-muted">{intro}</p>
        <div className="mt-8 flex flex-wrap gap-3">
          <Button href={primary.href} size="lg">{primary.label} <ArrowRight /></Button>
          {secondary && <Button href={secondary.href} variant="ghost" size="lg">{secondary.label}</Button>}
        </div>
        {image && (
          <div className="relative mt-12 overflow-hidden rounded-2xl border border-border">
            <img src={image.src} alt={image.alt} loading="lazy" className="h-52 w-full object-cover sm:h-72 md:h-80" />
            <div aria-hidden className="pointer-events-none absolute inset-0" style={{ background: "linear-gradient(180deg, transparent 55%, rgba(6,6,8,0.55))" }} />
          </div>
        )}
      </div>
    </section>
  );
}

/** "What this means" education callout for commercial pages. */
export function EducationCallout({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <Reveal>
      <div className="rounded-2xl border border-accent/20 bg-gradient-to-br from-[rgba(77,139,245,0.08)] to-transparent p-6 sm:p-8">
        <p className="mono-label mb-3">What this means</p>
        <h3 className="font-display text-xl font-semibold">{title}</h3>
        <div className="mt-3 space-y-3 text-text-muted">{children}</div>
      </div>
    </Reveal>
  );
}

export function CapabilityGrid({ items }: { items: { t: string; d: string }[] }) {
  return (
    <RevealGroup className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {items.map((c) => (
        <RevealItem key={c.t}>
          <div className="card-surface h-full p-6">
            <div className="mb-4 grid h-10 w-10 place-items-center rounded-lg border border-accent/25 bg-accent/10 text-accent-3">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" className="h-5 w-5"><path d="M5 13l4 4L19 7" /></svg>
            </div>
            <h3 className="font-display text-lg font-semibold">{c.t}</h3>
            <p className="mt-2 text-sm text-text-muted">{c.d}</p>
          </div>
        </RevealItem>
      ))}
    </RevealGroup>
  );
}

export function RelatedGrid({ collection, current }: { collection: Collection; current: string }) {
  const related: LinkItem[] = collection.items.filter((i) => i.slug !== current).slice(0, 3);
  if (related.length === 0) return null;
  return (
    <Section className="section-blend">
      <div className="mb-8 flex items-end justify-between gap-4">
        <h2 className="text-2xl font-semibold sm:text-3xl">More in {collection.label}</h2>
        <Link href={collection.base} className="inline-flex items-center gap-2 text-sm font-medium text-accent-3 hover:gap-3">View all <ArrowRight /></Link>
      </div>
      <div className="grid gap-4 sm:grid-cols-3">
        {related.map((r) => (
          <Link key={r.slug} href={`${collection.base}/${r.slug}`} className="card-surface block p-6">
            <h3 className="font-display text-lg font-semibold">{r.title}</h3>
            <p className="mt-2 text-sm text-text-muted">{r.desc}</p>
            <span className="mt-4 inline-flex items-center gap-2 text-sm font-medium text-accent-3">Learn more <ArrowRight /></span>
          </Link>
        ))}
      </div>
    </Section>
  );
}

export function ClosingCTA({
  title = "Get your first report started",
  intro = "Book a short, no-pressure demo. We will show you the platform, talk through your situation, and be honest about whether ESGen is the right fit.",
}: {
  title?: string;
  intro?: string;
}) {
  return (
    <Section>
      <Reveal>
        <div className="relative overflow-hidden rounded-2xl border border-border p-10 text-center sm:p-16" style={{ background: "radial-gradient(700px 340px at 80% 0%, rgba(77,139,245,0.12), transparent 60%), linear-gradient(160deg, #0e0e10, #060608)" }}>
          <h2 className="mx-auto max-w-2xl text-3xl font-semibold sm:text-4xl">{title}</h2>
          <p className="mx-auto mt-4 max-w-xl text-lg text-text-muted">{intro}</p>
          <div className="mt-8 flex flex-wrap justify-center gap-3">
            <Button href="/demo" size="lg">Book a demo <ArrowRight /></Button>
            <Button href="/contact" variant="ghost" size="lg">Talk to us</Button>
          </div>
        </div>
      </Reveal>
    </Section>
  );
}

/** Small "last reviewed" note for compliance and education pages. */
export function ReviewedNote({ date }: { date: string }) {
  return (
    <p className="font-mono text-xs text-text-muted/60">
      Last reviewed {date}. Regulations change, so please verify the current status before relying on this page.
    </p>
  );
}
