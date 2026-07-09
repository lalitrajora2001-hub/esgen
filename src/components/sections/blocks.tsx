import Link from "next/link";
import { Section } from "@/components/ui/Section";
import { Reveal } from "@/components/ui/Reveal";
import { Button, ArrowRight } from "@/components/ui/Button";
import { CtaPanel } from "@/components/sections/CtaPanel";
import { cn } from "@/lib/cn";

export function Breadcrumb({ trail }: { trail: { label: string; href?: string }[] }) {
  return (
    <nav aria-label="Breadcrumb" className="mb-5 flex flex-wrap items-center gap-2 font-mono text-xs text-text-muted/70">
      {trail.map((t, i) => (
        <span key={i} className="flex items-center gap-2">
          {t.href ? <Link href={t.href} className="hover:text-white">{t.label}</Link> : <span className="text-text-muted">{t.label}</span>}
          {i < trail.length - 1 && <span className="opacity-50">/</span>}
        </span>
      ))}
    </nav>
  );
}

export function PageHero({
  title,
  intro,
  trail,
  primary = { label: "Book a demo", href: "/demo" },
  secondary,
  visual,
}: {
  kicker?: string;
  title: string;
  intro: string;
  trail?: { label: string; href?: string }[];
  primary?: { label: string; href: string };
  secondary?: { label: string; href: string };
  visual?: React.ReactNode;
}) {
  return (
    <section className="relative overflow-hidden pt-28 pb-14 sm:pt-36 sm:pb-20">
      <div aria-hidden className="pointer-events-none absolute inset-0" style={{ background: "radial-gradient(900px 480px at 78% -10%, rgba(77,139,245,0.16), transparent 60%)" }} />
      <div className="grid-texture pointer-events-none absolute inset-0 opacity-60" aria-hidden />
      <div className={cn("relative mx-auto max-w-6xl px-5 sm:px-6", visual ? "grid items-center gap-12 lg:grid-cols-[1.05fr_1fr]" : "")}>
        <div>
          {trail && <Breadcrumb trail={trail} />}
          <h1 className="max-w-2xl text-balance text-4xl font-semibold leading-[1.05] sm:text-5xl">{title}</h1>
          <p className="mt-5 max-w-xl text-lg text-text-muted">{intro}</p>
          <div className="mt-8 flex flex-wrap gap-3">
            <Button href={primary.href} size="lg">{primary.label} <ArrowRight /></Button>
            {secondary && <Button href={secondary.href} variant="ghost" size="lg">{secondary.label}</Button>}
          </div>
        </div>
        {visual && (
          <Reveal className="min-w-0">{visual}</Reveal>
        )}
      </div>
    </section>
  );
}

export function CTASection({
  title = "Ready to simplify ESG reporting?",
  intro = "Bring your emissions data, ESG evidence, and reporting workflow into one clear workspace.",
  primary = { label: "Book a demo", href: "/demo" },
  secondary = { label: "Contact us", href: "/contact" },
}: {
  title?: string;
  intro?: string;
  primary?: { label: string; href: string };
  secondary?: { label: string; href: string };
}) {
  return (
    <Section>
      <Reveal>
        <CtaPanel title={title} intro={intro} primary={primary} secondary={secondary} />
      </Reveal>
    </Section>
  );
}

export function LinkCard({ href, title, desc, icon }: { href: string; title: string; desc: string; icon?: React.ReactNode }) {
  return (
    <Link href={href} className="card card-hover group block h-full p-6">
      {icon && <div className="mb-4 grid h-11 w-11 place-items-center rounded-xl border border-accent/25 bg-accent/10 text-accent-3">{icon}</div>}
      <h3 className="font-display text-lg font-semibold">{title}</h3>
      <p className="mt-2 text-sm text-text-muted">{desc}</p>
      <span className="mt-4 inline-flex items-center gap-2 text-sm font-medium text-accent-3">Learn more <ArrowRight className="h-4 w-4" /></span>
    </Link>
  );
}

export function Check() {
  return (
    <span className="mt-0.5 grid h-5 w-5 shrink-0 place-items-center rounded-full bg-[rgba(67,198,183,0.16)] text-teal">
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" className="h-3 w-3"><path d="M5 13l4 4L19 7" /></svg>
    </span>
  );
}
