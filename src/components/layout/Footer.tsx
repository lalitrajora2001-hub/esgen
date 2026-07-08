import Link from "next/link";
import { footerColumns, legalLinks, site } from "@/lib/nav";
import { NewsletterForm } from "@/components/layout/NewsletterForm";
import { Wordmark } from "@/components/logo/Logo";

export function Footer() {
  return (
    <footer className="relative mt-8 border-t border-border bg-[#090d14]">
      <div className="glow" style={{ width: 520, height: 320, top: -120, left: "50%", transform: "translateX(-50%)", background: "rgba(77,139,245,0.07)" }} aria-hidden />
      <div className="relative mx-auto max-w-7xl px-5 py-16 sm:px-6">
        <div className="grid gap-10 lg:grid-cols-[1.4fr_repeat(5,1fr)]">
          <div className="lg:pr-8">
            <Link href="/" className="inline-block text-white" aria-label="ESGen home"><Wordmark className="h-5" /></Link>
            <p className="mt-4 max-w-xs text-sm text-text-muted">
              Carbon accounting and ESG software that helps businesses measure, report, and reduce emissions with audit-ready data.
            </p>
            <div className="mt-6">
              <NewsletterForm />
            </div>
          </div>

          {footerColumns.map((col) => (
            <div key={col.heading}>
              <h5 className="mb-3 font-mono text-[0.7rem] uppercase tracking-[0.12em] text-text-muted/70">{col.heading}</h5>
              <ul className="space-y-2">
                {col.links.map((l) => (
                  <li key={l.href}>
                    <Link href={l.href} className="text-sm text-text-muted transition-colors hover:text-text">{l.title}</Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="mt-14 flex flex-col gap-4 border-t border-border pt-6 text-sm text-text-muted sm:flex-row sm:items-center sm:justify-between">
          <p>© {new Date().getFullYear()} {site.name}. Registered in England and Wales. Company details to be confirmed.</p>
          <div className="flex flex-wrap gap-x-5 gap-y-2">
            {legalLinks.map((l) => (
              <Link key={l.href} href={l.href} className="transition-colors hover:text-text">{l.title}</Link>
            ))}
          </div>
        </div>
        <p className="mt-4 font-mono text-[0.7rem] text-text-muted/50">
          Contact: {site.email}. Address and registration number are placeholders to be confirmed.
        </p>
      </div>
    </footer>
  );
}
