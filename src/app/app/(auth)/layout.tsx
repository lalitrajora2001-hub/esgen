"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useAuth } from "@/components/tool/AuthProvider";
import { FullLoader, NotConfigured } from "@/components/tool/AppStates";
import { Logo } from "@/components/logo/Logo";

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  const { configured, isDemo, loading, session } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (session || isDemo) router.replace("/app");
  }, [session, isDemo, router]);

  if (!configured && !isDemo) return <NotConfigured />;
  if (loading || session || isDemo) return <FullLoader label="Checking your session" />;

  return (
    <section className="app-light relative grid min-h-screen place-items-center overflow-hidden bg-canvas px-5 py-16 text-text">
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0"
        style={{ background: "radial-gradient(620px 400px at 50% 0%, rgba(47,111,224,0.08), transparent 62%)" }}
      />
      <div className="relative w-full max-w-md">
        <div className="mb-8 flex flex-col items-center text-center">
          <Link href="/" aria-label="ESGen">
            <Logo className="h-12 text-[#101828]" />
          </Link>
          <p className="mt-3 text-xs font-medium uppercase tracking-[0.18em] text-text-muted">BRSR Reporting</p>
        </div>
        <div className="card p-6 sm:p-8">{children}</div>
        <p className="mt-6 text-center text-xs text-text-muted">
          A workspace to prepare Business Responsibility &amp; Sustainability Report data. Figures produced here are indicative.
        </p>
      </div>
    </section>
  );
}
