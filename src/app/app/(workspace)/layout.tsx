"use client";

import { useEffect, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import { useAuth } from "@/components/tool/AuthProvider";
import { useCompany } from "@/components/tool/CompanyProvider";
import { AppShell } from "@/components/tool/AppShell";
import { FullLoader, NotConfigured } from "@/components/tool/AppStates";
import { fetchIsAdmin, fetchMyApprovalStatus, type ApprovalStatus } from "@/lib/brsr/pro";

export default function WorkspaceLayout({ children }: { children: React.ReactNode }) {
  const { configured, isDemo, loading: authLoading, session, signOut } = useAuth();
  const { loading: companyLoading, company } = useCompany();
  const pathname = usePathname();
  const router = useRouter();

  // trailingSlash is on, so usePathname() yields "/app/onboarding/".
  const normalized = pathname?.replace(/\/+$/, "") || "";
  const onboarding = normalized === "/app/onboarding";
  const usable = configured || isDemo;
  const authed = Boolean(session) || isDemo;

  // Signup approval gate: ESGEN staff always pass; everyone else needs an
  // 'approved' row. Starts null (checking) so we never flash the workspace
  // before we know the answer.
  const [gateChecked, setGateChecked] = useState(false);
  const [approval, setApproval] = useState<ApprovalStatus>("pending");
  const [isStaff, setIsStaff] = useState(false);

  useEffect(() => {
    if (!authed || isDemo) { setGateChecked(true); return; }
    setGateChecked(false);
    (async () => {
      const [admin, status] = await Promise.all([fetchIsAdmin(), fetchMyApprovalStatus()]);
      setIsStaff(admin);
      setApproval(status);
      setGateChecked(true);
    })();
  }, [authed, isDemo, session?.user?.id]);

  const gatePassed = isDemo || isStaff || approval === "approved";

  useEffect(() => {
    if (!usable || authLoading) return;
    if (!authed) {
      router.replace("/app/login");
      return;
    }
    if (!gateChecked || !gatePassed) return;
    if (!companyLoading && !company && !onboarding) {
      router.replace("/app/onboarding");
    }
  }, [usable, authed, authLoading, companyLoading, company, onboarding, router, gateChecked, gatePassed]);

  if (!usable) return <NotConfigured />;
  if (authLoading || !authed) return <FullLoader label="Checking your session" />;
  if (!gateChecked) return <FullLoader label="Checking your access" />;

  if (!gatePassed) {
    return (
      <div className="app-light grid min-h-screen place-items-center bg-canvas px-6 text-text">
        <div className="card max-w-md p-8 text-center">
          {approval === "rejected" ? (
            <>
              <h1 className="text-xl font-semibold">Access not approved</h1>
              <p className="mt-3 text-sm leading-relaxed text-text-muted">
                Your account request was not approved. If you believe this is a mistake, contact{" "}
                <a href="mailto:contactus@esgen.co.uk" className="text-accent-3 underline">contactus@esgen.co.uk</a>.
              </p>
            </>
          ) : (
            <>
              <span className="mx-auto grid h-12 w-12 place-items-center rounded-full bg-[#f0a020]/12 text-[#92600a]">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="h-6 w-6"><circle cx="12" cy="12" r="9" /><path d="M12 7v5l3 3" strokeLinecap="round" strokeLinejoin="round" /></svg>
              </span>
              <h1 className="mt-4 text-xl font-semibold">Awaiting approval</h1>
              <p className="mt-3 text-sm leading-relaxed text-text-muted">
                Your account has been created. ESGEN reviews every new sign-up before granting access to
                the platform. You will be able to sign in as soon as it is approved.
              </p>
              <p className="mt-2 text-xs text-text-muted">
                Questions? <a href="mailto:contactus@esgen.co.uk" className="text-accent-3 underline">contactus@esgen.co.uk</a>
              </p>
            </>
          )}
          <button onClick={() => signOut()} className="mt-6 rounded-lg border border-border px-4 py-2 text-xs text-text-muted transition hover:border-accent hover:text-text">
            Sign out
          </button>
        </div>
      </div>
    );
  }

  if (companyLoading) return <FullLoader />;

  // Onboarding renders full-width, without the sidebar (there is no company yet).
  if (!company) {
    if (onboarding) return <>{children}</>;
    return <FullLoader label="Setting up your workspace" />;
  }

  // The BRSR workspace manages its own rail + panel layout edge to edge.
  return <AppShell fullBleed={normalized === "/app/brsr"} isAdmin={isStaff}>{children}</AppShell>;
}
