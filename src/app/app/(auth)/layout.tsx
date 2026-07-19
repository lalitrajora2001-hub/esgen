"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useAuth } from "@/components/tool/AuthProvider";
import { FullLoader, NotConfigured } from "@/components/tool/AppStates";
import { Logo } from "@/components/logo/Logo";

/**
 * Premium split-screen auth for the BRSR tool. The left brand panel matches
 * the dark esgen.co.uk identity; the right side is the light tool theme.
 * Copy is deliberately BRSR-only: that is the framework live today.
 */

const FEATURES: { icon: React.ReactNode; title: string; sub: string }[] = [
  {
    icon: <path d="M9 11l3 3 8-8M21 12v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h11" strokeLinecap="round" strokeLinejoin="round" />,
    title: "Guided BRSR Core collection",
    sub: "The nine assured attributes, broken into clear KPI cards with guidance.",
  },
  {
    icon: <path d="M12 3l9 5-9 5-9-5 9-5zM3 13l9 5 9-5" strokeLinecap="round" strokeLinejoin="round" />,
    title: "Scope 1, 2 and 3 emissions",
    sub: "India-specific factors: CEA grid electricity, IPCC fuel values.",
  },
  {
    icon: <path d="M14 3v5h5M14 3H7a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V8l-5-5zM9 14l2 2 4-4" strokeLinecap="round" strokeLinejoin="round" />,
    title: "Evidence on every datapoint",
    sub: "Upload bills and registers against each KPI, with a full audit trail.",
  },
  {
    icon: <path d="M4 20V10M10 20V4M16 20v-7M21 20H3" strokeLinecap="round" strokeLinejoin="round" />,
    title: "Live sustainability dashboard",
    sub: "Emissions, energy, water and waste insights as the data lands.",
  },
];

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  const { configured, isDemo, loading, session } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (session || isDemo) router.replace("/app");
  }, [session, isDemo, router]);

  if (!configured && !isDemo) return <NotConfigured />;
  if (loading || session || isDemo) return <FullLoader label="Checking your session" />;

  return (
    <section className="app-light grid min-h-screen bg-canvas text-text lg:grid-cols-[1.05fr_1fr]">
      {/* Brand panel: dark, matching esgen.co.uk */}
      <aside className="relative hidden overflow-hidden bg-[#06070b] text-[#eef1f7] lg:flex lg:flex-col lg:justify-between lg:p-12 xl:p-16">
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0"
          style={{
            background:
              "radial-gradient(560px 420px at 12% 0%, rgba(77,139,245,0.16), transparent 60%), radial-gradient(640px 480px at 88% 100%, rgba(67,198,183,0.12), transparent 62%)",
          }}
        />
        <div aria-hidden className="pointer-events-none absolute inset-0 opacity-[0.05]" style={{ backgroundImage: "linear-gradient(#fff 1px, transparent 1px), linear-gradient(90deg, #fff 1px, transparent 1px)", backgroundSize: "44px 44px" }} />

        <Link href="/" aria-label="ESGen home" className="relative w-fit transition-opacity hover:opacity-80">
          <Logo className="h-10 text-white" />
        </Link>

        <div className="relative max-w-lg">
          <p className="font-mono text-[0.68rem] font-medium uppercase tracking-[0.2em] text-[#43c6b7]">
            BRSR reporting workspace
          </p>
          <h1 className="mt-4 font-display text-4xl font-semibold leading-[1.1] text-white xl:text-[2.75rem]">
            Your BRSR, collected properly.
          </h1>
          <p className="mt-4 text-[0.95rem] leading-relaxed text-[#94a0b5]">
            A guided workspace to collect, evidence and validate every SEBI BRSR datapoint,
            with live insight into your emissions, energy, water and waste.
          </p>

          <ul className="mt-9 space-y-5">
            {FEATURES.map((f) => (
              <li key={f.title} className="flex items-start gap-3.5">
                <span className="mt-0.5 grid h-9 w-9 shrink-0 place-items-center rounded-xl border border-white/10 bg-white/[0.04] text-[#43c6b7]">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" style={{ height: 18, width: 18 }}>{f.icon}</svg>
                </span>
                <span>
                  <span className="block text-sm font-semibold text-white">{f.title}</span>
                  <span className="mt-0.5 block text-[0.82rem] leading-relaxed text-[#94a0b5]">{f.sub}</span>
                </span>
              </li>
            ))}
          </ul>
        </div>

        <p className="relative text-xs leading-relaxed text-[#94a0b5]/80">
          Built around SEBI&apos;s Business Responsibility and Sustainability Reporting framework.
          Additional frameworks are on the ESGEN roadmap.
        </p>
      </aside>

      {/* Form side: light tool theme */}
      <div className="relative flex flex-col px-5 py-8 sm:px-10">
        {/* Compact brand header for small screens */}
        <div className="mb-10 flex items-center justify-between lg:hidden">
          <Link href="/" aria-label="ESGen home">
            <Logo className="h-9 text-[#101828]" />
          </Link>
          <span className="rounded-full border border-border bg-surface px-3 py-1 text-[0.68rem] font-medium uppercase tracking-[0.14em] text-text-muted">
            BRSR reporting
          </span>
        </div>

        <div className="flex flex-1 items-center justify-center">
          <div className="w-full max-w-md">
            <div className="mb-8 hidden items-center justify-between lg:flex">
              <span className="rounded-full border border-border bg-surface px-3 py-1 text-[0.68rem] font-medium uppercase tracking-[0.14em] text-text-muted">
                BRSR reporting
              </span>
              <Link href="/" className="text-xs text-text-muted transition-colors hover:text-text">
                Back to esgen.co.uk
              </Link>
            </div>
            <div className="card p-6 sm:p-8">{children}</div>
            <p className="mt-6 text-center text-xs leading-relaxed text-text-muted">
              A workspace to prepare Business Responsibility &amp; Sustainability Report data.
              Figures produced here are indicative.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
