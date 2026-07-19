"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useAuth } from "@/components/tool/AuthProvider";
import { FullLoader, NotConfigured } from "@/components/tool/AppStates";
import { Logo } from "@/components/logo/Logo";

/**
 * Centered premium auth screen for the ESGEN workspace. Deliberately generic:
 * it serves every framework the workspace supports, now and later.
 */
export default function AuthLayout({ children }: { children: React.ReactNode }) {
  const { configured, isDemo, loading, session } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (session || isDemo) router.replace("/app");
  }, [session, isDemo, router]);

  if (!configured && !isDemo) return <NotConfigured />;
  if (loading || session || isDemo) return <FullLoader label="Checking your session" />;

  return (
    <section className="app-light relative flex min-h-screen flex-col overflow-hidden bg-canvas px-5 py-8 text-text">
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            "radial-gradient(640px 420px at 50% -8%, rgba(15,118,110,0.10), transparent 62%), radial-gradient(520px 380px at 88% 100%, rgba(47,111,224,0.06), transparent 60%)",
        }}
      />

      <div className="relative flex flex-1 flex-col items-center justify-center py-8">
        <div className="w-full max-w-[420px]">
          <div className="mb-9 flex flex-col items-center text-center">
            <Link href="/" aria-label="ESGen home" className="transition-opacity hover:opacity-80">
              <Logo className="h-12 text-[#101828]" />
            </Link>
            <p className="mt-3.5 text-[0.68rem] font-medium uppercase tracking-[0.2em] text-text-muted">
              Reporting workspace
            </p>
          </div>

          <div className="card p-6 sm:p-8">{children}</div>

          <p className="mx-auto mt-6 max-w-[340px] text-center text-xs leading-relaxed text-text-muted">
            One workspace to collect, evidence and report your sustainability data.
            Figures produced here are indicative.
          </p>
        </div>
      </div>

      <p className="relative pb-2 text-center text-xs text-text-muted">
        <Link href="/" className="transition-colors hover:text-text">Back to esgen.co.uk</Link>
      </p>
    </section>
  );
}
