import Link from "next/link";

/* Server-safe scaffolding shared across the white product pages. */
export const WNAVY = "#12224f";
export const WSLATE = "#3f4a63";
export const WBODY = "#5b6472";
export const WBLUE = "#2f6fe0";

export function Eyebrow({ children }: { children: React.ReactNode }) {
  return <p className="text-[0.72rem] font-bold uppercase tracking-[0.16em]" style={{ color: WBLUE }}>{children}</p>;
}

function Arrow() {
  return <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" className="h-4 w-4"><path d="M5 12h14M13 6l6 6-6 6" /></svg>;
}

export function PrimaryBtn({ href, children }: { href: string; children: React.ReactNode }) {
  return <Link href={href} className="inline-flex items-center gap-2 rounded-lg px-5 py-3 text-sm font-semibold text-white transition-colors hover:brightness-110" style={{ background: WBLUE }}>{children}<Arrow /></Link>;
}
export function GhostBtn({ href, children }: { href: string; children: React.ReactNode }) {
  return <Link href={href} className="inline-flex items-center gap-2 rounded-lg bg-[#eef1f6] px-5 py-3 text-sm font-semibold transition-colors hover:bg-[#e4e9f2]" style={{ color: WBLUE }}>{children}</Link>;
}
export function WH2({ children }: { children: React.ReactNode }) {
  return <h2 className="font-display text-3xl font-bold leading-[1.1] tracking-tight sm:text-4xl" style={{ color: WNAVY }}>{children}</h2>;
}

export function WhiteCTA({ title, intro, primary = { label: "Request a demo", href: "/demo" }, secondary = { label: "Contact us", href: "/contact" } }: { title: string; intro: string; primary?: { label: string; href: string }; secondary?: { label: string; href: string } }) {
  return (
    <section className="py-16 sm:py-24">
      <div className="mx-auto max-w-6xl px-5 sm:px-6">
        <div className="overflow-hidden rounded-3xl px-8 py-14 text-center sm:px-16" style={{ background: "linear-gradient(155deg, #14171f 0%, #06070b 75%)" }}>
          <h2 className="mx-auto max-w-2xl font-display text-3xl font-bold text-white sm:text-4xl">{title}</h2>
          <p className="mx-auto mt-4 max-w-xl text-lg text-white/85">{intro}</p>
          <div className="mt-8 flex flex-wrap justify-center gap-3">
            <Link href={primary.href} className="inline-flex items-center gap-2 rounded-lg bg-white px-5 py-3 text-sm font-semibold" style={{ color: WBLUE }}>{primary.label} <Arrow /></Link>
            <Link href={secondary.href} className="inline-flex items-center gap-2 rounded-lg border border-white/40 px-5 py-3 text-sm font-semibold text-white transition-colors hover:bg-white/10">{secondary.label}</Link>
          </div>
        </div>
      </div>
    </section>
  );
}
