"use client";

import { createContext, useContext, useEffect, useState, useCallback } from "react";
import { useAuth } from "@/components/tool/AuthProvider";
import { fetchCompanies } from "@/lib/tool/db";
import { claimMemberships } from "@/lib/brsr/pro";
import { DEMO_COMPANY } from "@/lib/tool/demo";
import type { Company } from "@/lib/tool/types";

interface CompanyState {
  loading: boolean;
  company: Company | null;
  /** Every company this user can see (own, member of, or ESGEN staff: all). */
  companies: Company[];
  error: string | null;
  /** Switch the active workspace (persisted per browser). */
  switchCompany: (id: string) => void;
  /** Re-fetch from the backend (after create/update). */
  reload: () => Promise<void>;
  /** Optimistically set the current company. */
  setCompany: (c: Company) => void;
}

const ACTIVE_KEY = "esgen-active-company";

const CompanyContext = createContext<CompanyState | null>(null);

export function CompanyProvider({ children }: { children: React.ReactNode }) {
  const { session, loading: authLoading, isDemo } = useAuth();
  const [companies, setCompanies] = useState<Company[]>([]);
  const [company, setCompanyState] = useState<Company | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const pickActive = (list: Company[]): Company | null => {
    if (list.length === 0) return null;
    try {
      const saved = localStorage.getItem(ACTIVE_KEY);
      const match = saved ? list.find((c) => c.id === saved) : null;
      if (match) return match;
    } catch { /* storage unavailable */ }
    return list[0];
  };

  const load = useCallback(async () => {
    if (isDemo) {
      setCompanies([DEMO_COMPANY]);
      setCompanyState(DEMO_COMPANY);
      setLoading(false);
      return;
    }
    if (!session) {
      setCompanies([]);
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
      const list = await fetchCompanies();
      setCompanies(list);
      setCompanyState(pickActive(list));
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

  const switchCompany = useCallback((id: string) => {
    setCompanies((list) => {
      const next = list.find((c) => c.id === id);
      if (next) {
        setCompanyState(next);
        try { localStorage.setItem(ACTIVE_KEY, id); } catch { /* fine */ }
      }
      return list;
    });
  }, []);

  const setCompany = useCallback((c: Company) => {
    setCompanyState(c);
    setCompanies((list) => {
      const i = list.findIndex((x) => x.id === c.id);
      if (i === -1) return [...list, c];
      const next = [...list];
      next[i] = c;
      return next;
    });
  }, []);

  const value: CompanyState = {
    loading: authLoading || loading,
    company,
    companies,
    error,
    switchCompany,
    reload: load,
    setCompany,
  };

  return <CompanyContext.Provider value={value}>{children}</CompanyContext.Provider>;
}

export function useCompany(): CompanyState {
  const ctx = useContext(CompanyContext);
  if (!ctx) throw new Error("useCompany must be used within CompanyProvider");
  return ctx;
}
