"use client";

import { createContext, useContext, useEffect, useState, useCallback } from "react";
import type { Session, User } from "@supabase/supabase-js";
import { getSupabase, supabaseConfigured } from "@/lib/supabase/client";
import { isDemoActive, setDemoActive } from "@/lib/tool/demo";

interface AuthState {
  /** Whether backend credentials are present at all. */
  configured: boolean;
  /** Whether the in-memory demo (no backend) is active. */
  isDemo: boolean;
  /** True until the initial session check resolves. */
  loading: boolean;
  session: Session | null;
  user: User | null;
  signIn: (email: string, password: string) => Promise<{ error: string | null }>;
  signUp: (email: string, password: string) => Promise<{ error: string | null; needsConfirmation: boolean }>;
  signOut: () => Promise<void>;
  /** Send a password-reset email linking to /app/reset. */
  resetPassword: (email: string) => Promise<{ error: string | null }>;
  /** Set a new password for the signed-in (or recovery) session. */
  updatePassword: (password: string) => Promise<{ error: string | null }>;
  enterDemo: () => void;
  exitDemo: () => void;
}

const AuthContext = createContext<AuthState | null>(null);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);
  const [demo, setDemo] = useState(false);

  // Read persisted demo flag on the client (avoids a hydration mismatch).
  useEffect(() => {
    setDemo(isDemoActive());
  }, []);

  useEffect(() => {
    const supabase = getSupabase();
    if (!supabase) {
      setLoading(false);
      return;
    }
    let active = true;

    supabase.auth.getSession().then(({ data }) => {
      if (!active) return;
      setSession(data.session);
      setLoading(false);
    });

    const { data: sub } = supabase.auth.onAuthStateChange((_event, next) => {
      setSession(next);
    });

    return () => {
      active = false;
      sub.subscription.unsubscribe();
    };
  }, []);

  const signIn = useCallback(async (email: string, password: string) => {
    const supabase = getSupabase();
    if (!supabase) return { error: "Backend is not configured." };
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    return { error: error?.message ?? null };
  }, []);

  const signUp = useCallback(async (email: string, password: string) => {
    const supabase = getSupabase();
    if (!supabase) return { error: "Backend is not configured.", needsConfirmation: false };
    const { data, error } = await supabase.auth.signUp({ email, password });
    // If email confirmation is on, a user exists but no session is returned yet.
    const needsConfirmation = !error && !data.session;
    return { error: error?.message ?? null, needsConfirmation };
  }, []);

  const signOut = useCallback(async () => {
    const supabase = getSupabase();
    if (supabase) await supabase.auth.signOut();
    setSession(null);
  }, []);

  const resetPassword = useCallback(async (email: string) => {
    const supabase = getSupabase();
    if (!supabase) return { error: "Backend is not configured." };
    const redirectTo = `${window.location.origin}/app/reset/`;
    const { error } = await supabase.auth.resetPasswordForEmail(email, { redirectTo });
    return { error: error?.message ?? null };
  }, []);

  const updatePassword = useCallback(async (password: string) => {
    const supabase = getSupabase();
    if (!supabase) return { error: "Backend is not configured." };
    const { error } = await supabase.auth.updateUser({ password });
    return { error: error?.message ?? null };
  }, []);

  const enterDemo = useCallback(() => {
    setDemoActive(true);
    setDemo(true);
  }, []);

  const exitDemo = useCallback(() => {
    setDemoActive(false);
    setDemo(false);
  }, []);

  const value: AuthState = {
    configured: supabaseConfigured,
    // Demo is only ever active when there is no real backend; a stale flag
    // must never shadow a configured Supabase project.
    isDemo: supabaseConfigured ? false : demo,
    loading,
    session,
    user: session?.user ?? null,
    signIn,
    signUp,
    signOut,
    resetPassword,
    updatePassword,
    enterDemo,
    exitDemo,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth(): AuthState {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}
