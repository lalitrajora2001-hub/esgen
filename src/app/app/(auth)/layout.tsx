"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useAuth } from "@/components/tool/AuthProvider";
import { FullLoader, NotConfigured } from "@/components/tool/AppStates";
import { Logo } from "@/components/logo/Logo";
import { workspaceHomePath } from "@/lib/tool/workspaceDest";

/**
 * Centered premium auth screen for the ESGEN workspace. Deliberately generic:
 * it serves every framework the workspace supports, now and later.
 */
export default function AuthLayout({ children }: { children: React.ReactNode }) {
  const { configured, isDemo, loading, session } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (session || isDemo) router.replace(workspaceHomePath());
  }, [session, isDemo, router]);

  if (!configured && !isDemo) return <NotConfigured />;
  if (loading || session || isDemo) return <FullLoader label="Checking your session" />;

  return (
    <section className="app-light relative flex min-h-screen flex-col overflow-hidden bg-white px-5 py-8" style={{ color: "#101318" }}>
      <div className="relative flex flex-1 flex-col items-center justify-center py-8">
        <div className="w-full max-w-[420px]">
          <div className="mb-10 flex flex-col items-center text-center">
            <Link href="/" aria-label="ESGen home" className="transition-opacity hover:opacity-80">
              <Logo className="h-[72px] text-[#101318]" />
            </Link>
            <p className="mt-5 text-[0.68rem] font-semibold uppercase tracking-[0.24em]" style={{ color: "#565d68" }}>
              Manufacturing and Events
            </p>
          </div>

          <div className="rounded-2xl bg-white p-6 sm:p-8" style={{ border: "1px solid #e6e8ec", boxShadow: "0 18px 50px -30px rgba(16,19,24,0.3)" }}>
            {children}
          </div>

          <p className="mx-auto mt-6 max-w-[340px] text-center text-xs leading-relaxed" style={{ color: "#565d68" }}>
            One workspace to collect, evidence and report your sustainability data.
            Figures produced here are indicative.
          </p>
        </div>
      </div>

      <p className="relative pb-2 text-center text-xs" style={{ color: "#565d68" }}>
        <Link href="/" className="transition-colors hover:text-[#101318]">Back to esgen.co.uk</Link>
      </p>
    </section>
  );
}
