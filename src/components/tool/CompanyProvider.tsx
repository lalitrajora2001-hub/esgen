"use client";

import { createContext, useContext, useEffect, useState, useCallback } from "react";
import { useAuth } from "@/components/tool/AuthProvider";
import { fetchCompany } from "@/lib/tool/db";
import { claimMemberships } from "@/lib/brsr/pro";
import { DEMO_COMPANY } from "@/lib/tool/demo";
import type { Company } from "@/lib/tool/types";

interface CompanyState {
  loading: boolean;
  company: Company | null;
  error: string | null;
  /** Re-fetch from the backend (after create/update). */
  reload: () => Promise<void>;
  /** Optimistically set the current company. */
  setCompany: (c: Company) => void;
}

const CompanyContext = createContext<CompanyState | null>(null);

export function CompanyProvider({ children }: { children: React.ReactNode }) {
  const { session, loading: authLoading, isDemo } = useAuth();
  const [company, setCompanyState] = useState<Company | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const load = useCallback(async () => {
    if (isDemo) {
      setCompanyState(DEMO_COMPANY);
      setLoading(false);
      return;
    }
    if (!session) {
      setCompanyState(null);
      setLoading(false);
      return;
    }
    setLoading(true);
    setError(null);
    try {
      // Link any pending team invitations addressed to this user's email so the
      // shared company becomes visible before we load it.
      if (session.user?.email) await claimMemberships(session.user.email);
      const c = await fetchCompany();
      setCompanyState(c);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Could not load your workspace.");
    } finally {
      setLoading(false);
    }
  }, [session, isDemo]);

  useEffect(() => {
    if (authLoading) return;
    void load();
  }, [authLoading, load]);

  const value: CompanyState = {
    loading: authLoading || loading,
    company,
    error,
    reload: load,
    setCompany: setCompanyState,
  };

  return <CompanyContext.Provider value={value}>{children}</CompanyContext.Provider>;
}

export function useCompany(): CompanyState {
  const ctx = useContext(CompanyContext);
  if (!ctx) throw new Error("useCompany must be used within CompanyProvider");
  return ctx;
}
