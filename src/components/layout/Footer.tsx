import Link from "next/link";
import { footerColumns, legalLinks, site } from "@/lib/nav";
import { Logo } from "@/components/logo/Logo";

export function Footer() {
  return (
    <footer className="relative border-t border-[#e6e8ec] bg-white">
      <div className="relative mx-auto max-w-[1400px] px-5 py-16 sm:px-6">
        <div className="grid gap-10 lg:grid-cols-[1.4fr_repeat(5,1fr)]">
          <div className="lg:pr-8">
            <Logo className="h-14" />
            <p className="mt-5 max-w-xs text-sm text-[#565d68]">
              Carbon accounting and ESG reporting software, built around your real data. Collect once, report across
              multiple needs.
            </p>
            <p className="mt-5 text-sm text-[#565d68]">
              <a href={`mailto:${site.email}`} className="text-[#101318] underline-offset-2 hover:underline">{site.email}</a>
            </p>
          </div>

          {footerColumns.map((col) => (
            <div key={col.heading}>
              <h2 className="mb-3 font-mono text-[0.7rem] uppercase tracking-[0.12em] text-[#6b7280]">{col.heading}</h2>
              <ul className="space-y-2">
                {col.links.map((l) => (
                  <li key={l.href}>
                    <Link href={l.href} className="text-sm text-[#565d68] transition-colors hover:text-[#101318]">{l.label}</Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="mt-14 flex flex-col gap-4 border-t border-[#e6e8ec] pt-6 text-sm text-[#565d68] sm:flex-row sm:items-center sm:justify-between">
          <p>© {new Date().getFullYear()} {site.name}. Company No. {site.companyNumber}. Registered in England and Wales.</p>
          <div className="flex flex-wrap gap-x-5 gap-y-2">
            {legalLinks.map((l) => (
              <Link key={l.href} href={l.href} className="transition-colors hover:text-[#101318]">{l.label}</Link>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}
