"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAuth } from "@/components/tool/AuthProvider";
import { useCompany } from "@/components/tool/CompanyProvider";
import { Logo } from "@/components/logo/Logo";

/**
 * Professional top-bar shell for the BRSR reporting tool. Uses the real ESGen
 * wordmark to match esgen.co.uk. The BRSR workspace supplies its own section
 * navigation below.
 */
export function AppShell({ children, fullBleed = false }: { children: React.ReactNode; fullBleed?: boolean }) {
  const router = useRouter();
  const { user, signOut, isDemo, exitDemo } = useAuth();
  const { company } = useCompany();

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
    <div className="app-light min-h-screen bg-canvas text-text">
      <header className="no-print sticky top-0 z-30 border-b border-border bg-surface/95 backdrop-blur">
        <div aria-hidden className="h-[2px] w-full" style={{ background: "#059669" }} />
        <div className="mx-auto flex h-[72px] max-w-7xl items-center justify-between gap-4 px-5 sm:px-8">
          <div className="flex items-center gap-4">
            <Link href="/app/brsr" aria-label="ESGen home" className="transition-opacity hover:opacity-80">
              <Logo className="h-11 text-[#101828]" />
            </Link>
            <span className="hidden border-l border-border pl-4 text-sm font-medium tracking-wide text-text-muted sm:inline">
              BRSR Reporting
            </span>
          </div>
          <div className="flex items-center gap-3 text-sm">
            {company && <span className="hidden max-w-[200px] truncate text-text-muted md:inline">{company.name}</span>}
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
