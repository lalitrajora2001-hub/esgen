"use client";

import Link from "next/link";
import { useRouter, usePathname } from "next/navigation";
import { useAuth } from "@/components/tool/AuthProvider";
import { useCompany } from "@/components/tool/CompanyProvider";
import { Logo } from "@/components/logo/Logo";

/**
 * Professional top-bar shell shared by every workspace (BRSR and Events). Uses
 * the real ESGen wordmark to match esgen.co.uk. The label and home link are
 * derived from the URL, not a stored preference, so they are always correct
 * regardless of how the user arrived here.
 */
export function AppShell({
  children, fullBleed = false, isAdmin = false,
}: {
  children: React.ReactNode;
  fullBleed?: boolean;
  isAdmin?: boolean;
}) {
  const router = useRouter();
  const pathname = usePathname() ?? "";
  const normalized = pathname.replace(/\/+$/, "");
  const isEvents = normalized.startsWith("/app/events");
  const isAdminRoute = normalized.startsWith("/app/admin");
  const homeHref = isEvents ? "/app/events" : "/app/brsr";
  const workspaceLabel = isAdminRoute ? "Admin Portal" : isEvents ? "Events ESG Reporting" : "BRSR Reporting";
  const { user, signOut, isDemo, exitDemo } = useAuth();
  const { company, companies, switchCompany } = useCompany();

  const onSignOut = async () => {
    if (isDemo) {
      exitDemo();
      router.replace("/app");
      return;
    }
    await signOut();
    router.replace("/app/login");
  };

  return (
    <div className={`${isAdminRoute ? "app-admin" : "app-light"} min-h-screen bg-canvas text-text`}>
      <header className="no-print sticky top-0 z-30 border-b border-border bg-surface/95 backdrop-blur">
        <div aria-hidden className="h-[2px] w-full" style={{ background: isAdminRoute ? "#f0a020" : "#059669" }} />
        <div className="mx-auto flex h-[72px] max-w-7xl items-center justify-between gap-4 px-5 sm:px-8">
          <div className="flex items-center gap-4">
            <Link href={isAdminRoute ? "/app/admin" : homeHref} aria-label="ESGen home" className="transition-opacity hover:opacity-80">
              <Logo className={`h-11 ${isAdminRoute ? "text-[#fdf6ec]" : "text-[#101828]"}`} />
            </Link>
            <span className="hidden border-l border-border pl-4 text-sm font-medium tracking-wide text-text-muted sm:inline">
              {workspaceLabel}
            </span>
          </div>
          <div className="flex items-center gap-3 text-sm">
            {isAdmin && (
              isAdminRoute ? (
                <Link
                  href={homeHref}
                  className="hidden rounded-lg border border-border px-3 py-1.5 text-xs font-semibold text-text-muted transition hover:border-accent hover:text-text md:inline-block"
                >
                  &larr; Back to workspace
                </Link>
              ) : (
                <Link
                  href="/app/admin"
                  className="hidden rounded-lg bg-[#f0a020] px-3 py-1.5 text-xs font-bold text-[#1c1712] shadow-sm transition hover:bg-[#d4870a] md:inline-block"
                >
                  Admin portal
                </Link>
              )
            )}
            {!isAdminRoute && (companies.length > 1 ? (
              <select
                value={company?.id ?? ""}
                onChange={(e) => switchCompany(e.target.value)}
                aria-label="Switch company"
                className="hidden h-9 max-w-[220px] rounded-lg border border-border bg-surface px-2 text-xs md:block"
              >
                {companies.map((c) => <option key={c.id} value={c.id}>{c.name}</option>)}
              </select>
            ) : (
              company && <span className="hidden max-w-[200px] truncate text-text-muted md:inline">{company.name}</span>
            ))}
            {isDemo && <span className="rounded bg-accent/12 px-2 py-0.5 text-xs text-accent-3">Demo</span>}
            {!isDemo && user?.email && <span className="hidden text-text-muted lg:inline">{user.email}</span>}
            <button
              onClick={onSignOut}
              className="rounded-lg border border-border px-3 py-1.5 text-xs text-text-muted transition hover:border-accent hover:text-text"
            >
              {isDemo ? "Exit demo" : "Sign out"}
            </button>
          </div>
        </div>
        {isDemo && (
          <div className="border-t border-accent/25 bg-accent/8 px-5 py-1.5 text-center text-xs text-accent-3 sm:px-8">
            Demo mode with sample data. Nothing is saved.
          </div>
        )}
      </header>

      {fullBleed ? <main>{children}</main> : <main className="mx-auto max-w-7xl px-5 py-8 sm:px-8">{children}</main>}
    </div>
  );
}
