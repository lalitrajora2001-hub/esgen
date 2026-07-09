import Link from "next/link";

/* Server-safe green scaffolding shared across the Platform pages. */
export const INK = "#0f1720";
export const BODY = "#47505c";
export const GREEN = "#16a34a";
export const GREENDK = "#15803d";

/* Life-cycle-assessment category accent — deep forest, never blue or purple. */
export const ACCENT = "#0b3d2c";
export const ACCENT_DK = "#062a1e";
export const TINT = "#eaf6ef";

export function GEyebrow({ children }: { children: React.ReactNode }) {
  return <p className="text-[0.72rem] font-bold uppercase tracking-[0.16em]" style={{ color: GREEN }}>{children}</p>;
}

/** "Life cycle assessment" category eyebrow with a small leaf mark. */
export function PEyebrow({ children }: { children: React.ReactNode }) {
  return (
    <p className="flex items-center gap-1.5 text-[0.72rem] font-bold uppercase tracking-[0.14em]" style={{ color: ACCENT }}>
      <svg viewBox="0 0 24 24" className="h-3.5 w-3.5" fill="none" stroke={ACCENT} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M5 21V4M5 4c4-2 8 2 12 0v9c-4 2-8-2-12 0" /></svg>
      {children}
    </p>
  );
}

/** Monochrome standards wall for the Platform pages (green + black only). */
const STANDARDS = ["GHG Protocol", "ISO 14064", "ISO 14040/44", "ISO 14067", "SBTi", "CSRD / ESRS", "TCFD", "CDP", "SECR", "UK SRS", "CBAM", "EU DPP"];
export function MonoFrameworks() {
  return (
    <div className="grid grid-cols-2 gap-px overflow-hidden rounded-2xl border border-[#e6ece7] bg-[#e6ece7] sm:grid-cols-3 lg:grid-cols-4">
      {STANDARDS.map((s) => (
        <div key={s} className="flex h-20 items-center justify-center bg-white px-3 text-center transition-colors hover:bg-[#f7faf8]">
          <span className="font-display text-[0.82rem] font-extrabold tracking-tight" style={{ color: INK }}>{s}</span>
        </div>
      ))}
    </div>
  );
}

/** Green circle check used in the bullet lists on the LCA pages. */
export function GCheck() {
  return <svg viewBox="0 0 24 24" className="mt-0.5 h-5 w-5 shrink-0" fill="none"><circle cx="12" cy="12" r="10" fill={GREEN} /><path d="M7.5 12.5l3 3 6-6.5" stroke="#fff" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" /></svg>;
}

/** Breadcrumb used across the platform pages. */
export function GCrumbs({ last }: { last: string }) {
  return (
    <nav aria-label="Breadcrumb" className="flex items-center gap-2 text-[0.78rem]" style={{ color: BODY }}>
      <Link href="/" className="hover:underline">ESGen</Link><span>›</span>
      <Link href="/platform/carbon-assessment" className="hover:underline">Platform</Link><span>›</span>
      <span style={{ color: INK }}>{last}</span>
    </nav>
  );
}

/** The deep-green organic panel that frames the LCA-category hero visuals. */
export function HeroPanel({ children }: { children: React.ReactNode }) {
  return (
    <div className="relative overflow-hidden rounded-2xl p-6 sm:p-8" style={{ background: "linear-gradient(140deg,#0f3d2b 0%,#1a5c3d 38%,#2d7a4a 72%,#0d1411 100%)" }}>
      <div aria-hidden className="absolute inset-0" style={{ background: "radial-gradient(70% 60% at 25% 30%, rgba(255,255,255,0.18), transparent 60%)" }} />
      <div className="relative">{children}</div>
    </div>
  );
}
export function GArrow() {
  return <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" className="h-4 w-4"><path d="M5 12h14M13 6l6 6-6 6" /></svg>;
}
export function GPrimaryBtn({ href, children }: { href: string; children: React.ReactNode }) {
  return <Link href={href} className="inline-flex items-center gap-2 rounded-lg px-5 py-3 text-sm font-semibold text-white transition-colors hover:brightness-110" style={{ background: GREEN }}>{children}<GArrow /></Link>;
}
export function GGhostBtn({ href, children }: { href: string; children: React.ReactNode }) {
  return <Link href={href} className="inline-flex items-center gap-2 rounded-lg bg-[#ecfdf3] px-5 py-3 text-sm font-semibold transition-colors hover:bg-[#d6f7e2]" style={{ color: GREENDK }}>{children}</Link>;
}
export function GH2({ children }: { children: React.ReactNode }) {
  return <h2 className="font-display text-3xl font-bold leading-[1.1] tracking-tight sm:text-4xl" style={{ color: INK }}>{children}</h2>;
}

export function GFaq({ items }: { items: [string, string][] }) {
  return (
    <div className="divide-y divide-[#dbeadf] border-y border-[#dbeadf]">
      {items.map(([q, a]) => (
        <details key={q} className="group py-4">
          <summary className="flex cursor-pointer items-center justify-between gap-4 font-display text-base font-semibold" style={{ color: INK }}>
            {q}
            <svg viewBox="0 0 24 24" fill="none" stroke={GREEN} strokeWidth="2.4" strokeLinecap="round" className="h-4 w-4 shrink-0 transition-transform group-open:rotate-45"><path d="M12 5v14M5 12h14" /></svg>
          </summary>
          <p className="mt-2 max-w-2xl text-sm leading-relaxed" style={{ color: BODY }}>{a}</p>
        </details>
      ))}
    </div>
  );
}

export function GreenCTA({ title, intro }: { title: string; intro: string }) {
  return (
    <section className="py-16 sm:py-24">
      <div className="mx-auto max-w-6xl px-5 sm:px-6">
        <div className="overflow-hidden rounded-3xl px-8 py-14 text-center sm:px-16" style={{ background: "linear-gradient(150deg, #16a34a, #0f6b42)" }}>
          <h2 className="mx-auto max-w-2xl font-display text-3xl font-bold text-white sm:text-4xl">{title}</h2>
          <p className="mx-auto mt-4 max-w-xl text-lg text-white/90">{intro}</p>
          <div className="mt-8 flex flex-wrap justify-center gap-3">
            <Link href="/demo" className="inline-flex items-center gap-2 rounded-lg bg-white px-5 py-3 text-sm font-semibold" style={{ color: GREENDK }}>Request a demo <GArrow /></Link>
            <Link href="/contact" className="inline-flex items-center gap-2 rounded-lg border border-white/50 px-5 py-3 text-sm font-semibold text-white transition-colors hover:bg-white/10">Contact us</Link>
          </div>
        </div>
      </div>
    </section>
  );
}

/** "Without / With ESGen" comparison block used on the compliance sections. */
export function BeforeAfter({ title, without, with_, href, cta }: { title: string; without: string; with_: string; href: string; cta: string }) {
  return (
    <div className="rounded-2xl border border-[#e6ece7] bg-white p-6">
      <h3 className="font-display text-lg font-bold" style={{ color: INK }}>{title}</h3>
      <div className="mt-4 grid gap-3 sm:grid-cols-2">
        <div className="rounded-xl bg-[#f4f5f5] p-4">
          <div className="flex items-center gap-1.5 text-[0.62rem] font-bold uppercase tracking-wide" style={{ color: "#8a8f94" }}>
            <svg viewBox="0 0 24 24" className="h-3.5 w-3.5" fill="none" stroke="#8a8f94" strokeWidth="2.4" strokeLinecap="round"><path d="M6 6l12 12M18 6L6 18" /></svg>Without ESGen
          </div>
          <p className="mt-2 text-sm leading-relaxed" style={{ color: BODY }}>{without}</p>
        </div>
        <div className="rounded-xl bg-[#ecfdf3] p-4">
          <div className="flex items-center gap-1.5 text-[0.62rem] font-bold uppercase tracking-wide" style={{ color: GREENDK }}>
            <svg viewBox="0 0 24 24" className="h-3.5 w-3.5" fill="none" stroke={GREENDK} strokeWidth="2.8" strokeLinecap="round" strokeLinejoin="round"><path d="M5 13l4 4L19 7" /></svg>With ESGen
          </div>
          <p className="mt-2 text-sm leading-relaxed" style={{ color: "#3f5a49" }}>{with_}</p>
        </div>
      </div>
      <Link href={href} className="mt-4 inline-flex items-center gap-2 text-sm font-semibold" style={{ color: GREENDK }}>{cta} <GArrow /></Link>
    </div>
  );
}
