"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAuth } from "@/components/tool/AuthProvider";
import { Button } from "@/components/ui/Button";
import { Field, isEmail } from "@/components/forms/fields";

export default function ToolLoginPage() {
  const { signIn, resetPassword } = useAuth();
  const router = useRouter();
  const [v, setV] = useState({ email: "", password: "" });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [formError, setFormError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);
  const [mode, setMode] = useState<"signin" | "forgot" | "sent">("signin");
  // Which workspace to land in after sign-in (remembered per browser).
  const [dest, setDest] = useState<"esg" | "events">(() => {
    try { return localStorage.getItem("esgen-workspace") === "events" ? "events" : "esg"; } catch { return "esg"; }
  });
  const pickDest = (d: "esg" | "events") => {
    setDest(d);
    try { localStorage.setItem("esgen-workspace", d); } catch { /* fine */ }
  };
  const set = (k: keyof typeof v) => (val: string) => setV((s) => ({ ...s, [k]: val }));

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError(null);
    const err: Record<string, string> = {};
    if (!isEmail(v.email)) err.email = "Enter a valid email address.";
    if (v.password.length < 1) err.password = "Enter your password.";
    setErrors(err);
    if (Object.keys(err).length) return;

    setBusy(true);
    const { error } = await signIn(v.email.trim(), v.password);
    setBusy(false);
    if (error) {
      setFormError(error);
      return;
    }
    router.replace(dest === "events" ? "/app/events" : "/app");
  };

  const sendReset = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError(null);
    if (!isEmail(v.email)) { setErrors({ email: "Enter the email you signed up with." }); return; }
    setErrors({});
    setBusy(true);
    const { error } = await resetPassword(v.email.trim());
    setBusy(false);
    if (error) { setFormError(error); return; }
    setMode("sent");
  };

  if (mode === "sent") {
    return (
      <div className="text-center">
        <div className="mx-auto grid h-12 w-12 place-items-center rounded-full bg-teal/10 text-teal">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="h-6 w-6">
            <path d="M4 6l8 6 8-6M4 6v12h16V6" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </div>
        <h1 className="mt-5 text-xl font-semibold">Check your email</h1>
        <p className="mt-2 text-sm text-text-muted">
          If an account exists for <span className="text-text">{v.email}</span>, a password-reset link is
          on its way. The link opens a page where you set a new password.
        </p>
        <button onClick={() => setMode("signin")} className="mt-5 text-sm font-medium text-teal hover:underline">
          Back to sign in
        </button>
      </div>
    );
  }

  if (mode === "forgot") {
    return (
      <div>
        <h1 className="text-2xl font-semibold">Reset your password</h1>
        <p className="mt-1.5 text-sm text-text-muted">We&apos;ll email you a link to set a new one.</p>

        <form onSubmit={sendReset} noValidate aria-label="Reset password" className="mt-6 space-y-5">
          <Field id="email" label="Email" type="email" inputMode="email" required autoComplete="email" value={v.email} onChange={set("email")} error={errors.email} />
          {formError && (
            <p className="rounded-xl border border-[#e5484d]/30 bg-[#e5484d]/8 p-3 text-sm text-[#b42318]" role="alert">{formError}</p>
          )}
          <Button type="submit" size="lg" className="w-full" disabled={busy}>
            {busy ? "Sending..." : "Send reset link"}
          </Button>
        </form>

        <p className="mt-6 text-center text-sm text-text-muted">
          Remembered it?{" "}
          <button onClick={() => { setMode("signin"); setFormError(null); }} className="text-teal hover:underline">Sign in</button>.
        </p>
      </div>
    );
  }

  return (
    <div>
      {/* Workspace selector: company ESG reporting vs the events-industry toolkit */}
      <div className="mb-5 grid grid-cols-2 gap-1 rounded-full bg-surface-2 p-1">
        <button type="button" onClick={() => pickDest("esg")} aria-pressed={dest === "esg"} className={dest === "esg" ? "rounded-full bg-white px-3 py-1.5 text-sm font-semibold shadow-sm" : "rounded-full px-3 py-1.5 text-sm font-medium text-text-muted hover:text-text"}>
          ESG reporting
        </button>
        <button type="button" onClick={() => pickDest("events")} aria-pressed={dest === "events"} className={dest === "events" ? "rounded-full bg-white px-3 py-1.5 text-sm font-semibold shadow-sm" : "rounded-full px-3 py-1.5 text-sm font-medium text-text-muted hover:text-text"}>
          Events industry
        </button>
      </div>
      <h1 className="text-2xl font-semibold">Welcome back</h1>
      <p className="mt-1.5 text-sm text-text-muted">
        {dest === "events"
          ? "Sign in to the events-industry ESG toolkit (ISO 20121-aligned)."
          : "Sign in to your ESGEN workspace."}
      </p>

      <form onSubmit={submit} noValidate aria-label="Sign in" className="mt-6 space-y-5">
        <Field id="email" label="Email" type="email" inputMode="email" required autoComplete="email" value={v.email} onChange={set("email")} error={errors.email} />
        <Field id="password" label="Password" type="password" required autoComplete="current-password" value={v.password} onChange={set("password")} error={errors.password} />
        <div className="flex justify-end">
          <button type="button" onClick={() => { setMode("forgot"); setFormError(null); }} className="text-xs font-medium text-text-muted transition-colors hover:text-text">
            Forgot password?
          </button>
        </div>
        {formError && (
          <p className="rounded-xl border border-[#e5484d]/30 bg-[#e5484d]/8 p-3 text-sm text-[#b42318]" role="alert">
            {formError}
          </p>
        )}
        <Button type="submit" size="lg" className="w-full" disabled={busy}>
          {busy ? "Signing in..." : "Sign in"}
        </Button>
      </form>

      <p className="mt-6 text-center text-sm text-text-muted">
        New to the workspace? <Link href="/app/signup" className="text-accent-3 hover:underline">Create an account</Link>.
      </p>
    </div>
  );
}
