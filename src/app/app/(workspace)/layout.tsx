"use client";

import { useEffect } from "react";
import { usePathname, useRouter } from "next/navigation";
import { useAuth } from "@/components/tool/AuthProvider";
import { useCompany } from "@/components/tool/CompanyProvider";
import { AppShell } from "@/components/tool/AppShell";
import { FullLoader, NotConfigured } from "@/components/tool/AppStates";

export default function WorkspaceLayout({ children }: { children: React.ReactNode }) {
  const { configured, isDemo, loading: authLoading, session } = useAuth();
  const { loading: companyLoading, company } = useCompany();
  const pathname = usePathname();
  const router = useRouter();

  // trailingSlash is on, so usePathname() yields "/app/onboarding/".
  const normalized = pathname?.replace(/\/+$/, "") || "";
  const onboarding = normalized === "/app/onboarding";
  const usable = configured || isDemo;
  const authed = Boolean(session) || isDemo;

  useEffect(() => {
    if (!usable || authLoading) return;
    if (!authed) {
      router.replace("/app/login");
      return;
    }
    if (!companyLoading && !company && !onboarding) {
      router.replace("/app/onboarding");
    }
  }, [usable, authed, authLoading, companyLoading, company, onboarding, router]);

  if (!usable) return <NotConfigured />;
  if (authLoading || !authed) return <FullLoader label="Checking your session" />;
  if (companyLoading) return <FullLoader />;

  // Onboarding renders full-width, without the sidebar (there is no company yet).
  if (!company) {
    if (onboarding) return <>{children}</>;
    return <FullLoader label="Setting up your workspace" />;
  }

  // The BRSR workspace manages its own rail + panel layout edge to edge.
  return <AppShell fullBleed={normalized === "/app/brsr"}>{children}</AppShell>;
}
