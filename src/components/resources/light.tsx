import Link from "next/link";

/* Black-and-white editorial palette for the Resources pages. No blue. */
export const INK = "#101318";
export const MUTED = "#565d68";
export const LINE = "#e6e8ec";
export const SUBTLE = "#f6f7f9";

/* Light-theme breadcrumb (the shared one is styled for the dark theme). */
export function RBreadcrumb({ trail }: { trail: { label: string; href?: string }[] }) {
  return (
    <nav aria-label="Breadcrumb" className="mb-5 flex flex-wrap items-center gap-2 font-mono text-xs">
      {trail.map((t, i) => (
        <span key={i} className="flex items-center gap-2">
          {t.href ? (
            <Link href={t.href} className="text-[#565d68] transition-colors hover:text-[#101318]">{t.label}</Link>
          ) : (
            <span className="text-[#101318]">{t.label}</span>
          )}
          {i < trail.length - 1 && <span className="text-[#565d68] opacity-40">/</span>}
        </span>
      ))}
    </nav>
  );
}

/* Monochrome CTA band (the shared CTA uses the blue brand button). */
export function RCta({
  title = "Ready to simplify ESG reporting?",
  intro = "Bring your emissions data, ESG evidence, and reporting workflow into one clear workspace.",
}: { title?: string; intro?: string }) {
  return (
    <section className="bg-white py-16 sm:py-24">
      <div className="mx-auto max-w-6xl px-5 sm:px-6">
        <div className="overflow-hidden rounded-3xl px-8 py-14 text-center sm:px-16" style={{ background: INK }}>
          <h2 className="mx-auto max-w-2xl font-display text-3xl font-bold text-white sm:text-4xl">{title}</h2>
          <p className="mx-auto mt-4 max-w-xl text-lg text-white/70">{intro}</p>
          <div className="mt-8 flex flex-wrap justify-center gap-3">
            <Link href="/demo" className="inline-flex items-center gap-2 rounded-xl bg-white px-5 py-3 text-sm font-bold text-[#101318] transition-transform hover:-translate-y-0.5">
              Book a demo <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="M5 12h14M13 6l6 6-6 6" /></svg>
            </Link>
            <Link href="/contact" className="inline-flex items-center gap-2 rounded-xl border border-white/30 px-5 py-3 text-sm font-semibold text-white transition-colors hover:bg-white/10">Contact us</Link>
          </div>
        </div>
      </div>
    </section>
  );
}

/* Shared light hero shell: white background, faint neutral glow, no blue. */
export function RHero({ trail, title, intro }: { trail: { label: string; href?: string }[]; title: string; intro: string }) {
  return (
    <section className="relative overflow-hidden bg-white pt-28 pb-6 sm:pt-36">
      <div aria-hidden className="pointer-events-none absolute inset-0" style={{ background: "radial-gradient(900px 460px at 50% -10%, rgba(16,19,24,0.05), transparent 60%)" }} />
      <div className="relative mx-auto max-w-6xl px-5 sm:px-6">
        <RBreadcrumb trail={trail} />
        <div className="max-w-2xl">
          <h1 className="text-balance text-4xl font-semibold leading-[1.05] text-[#101318] sm:text-5xl">{title}</h1>
          <p className="mt-5 max-w-xl text-lg text-[#565d68]">{intro}</p>
        </div>
      </div>
    </section>
  );
}
