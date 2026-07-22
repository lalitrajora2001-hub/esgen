"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAuth } from "@/components/tool/AuthProvider";
import { Field, isEmail } from "@/components/forms/fields";

export default function ToolSignupPage() {
  const { signUp } = useAuth();
  const router = useRouter();
  const [v, setV] = useState({ email: "", password: "" });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [formError, setFormError] = useState<string | null>(null);
  const [confirm, setConfirm] = useState(false);
  const [busy, setBusy] = useState(false);
  const set = (k: keyof typeof v) => (val: string) => setV((s) => ({ ...s, [k]: val }));

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError(null);
    const err: Record<string, string> = {};
    if (!isEmail(v.email)) err.email = "Enter a valid email address.";
    if (v.password.length < 8) err.password = "Use at least 8 characters.";
    setErrors(err);
    if (Object.keys(err).length) return;

    setBusy(true);
    const { error, needsConfirmation } = await signUp(v.email.trim(), v.password);
    setBusy(false);
    if (error) {
      setFormError(error);
      return;
    }
    if (needsConfirmation) {
      setConfirm(true);
      return;
    }
    router.replace("/app/onboarding");
  };

  if (confirm) {
    return (
      <div className="text-center">
        <div className="mx-auto grid h-12 w-12 place-items-center rounded-full bg-accent/12 ring-1 ring-accent/25">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="h-6 w-6 text-accent-3">
            <path d="M4 6l8 6 8-6M4 6v12h16V6" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </div>
        <h1 className="mt-5 font-display text-xl font-bold tracking-tight text-[#101318]">Confirm your email</h1>
        <p className="mt-2 text-sm text-[#565d68]">
          We sent a confirmation link to <span className="font-semibold text-[#101318]">{v.email}</span>. Open it, then sign in.
        </p>
        <Link href="/app/login" className="mt-5 inline-block text-sm text-accent-3 hover:underline">
          Back to sign in
        </Link>
      </div>
    );
  }

  return (
    <div>
      <h1 className="font-display text-2xl font-bold tracking-tight text-[#101318]">Create your account</h1>
      <p className="mt-1.5 text-sm text-[#565d68]">Set up your organisation&apos;s reporting workspace.</p>

      <form onSubmit={submit} noValidate aria-label="Create account" className="mt-6 space-y-5">
        <Field id="email" label="Work email" type="email" inputMode="email" required autoComplete="email" value={v.email} onChange={set("email")} error={errors.email} />
        <Field id="password" label="Password" type="password" required autoComplete="new-password" value={v.password} onChange={set("password")} error={errors.password} placeholder="At least 8 characters" />
        {formError && (
          <p className="rounded-xl border border-[#e5484d]/30 bg-[#e5484d]/8 p-3 text-sm text-[#b42318]" role="alert">
            {formError}
          </p>
        )}
        <button type="submit" disabled={busy} className="w-full rounded-xl bg-[#101318] px-5 py-3 text-sm font-bold text-white transition-colors hover:bg-[#2a2c33] disabled:opacity-60">
          {busy ? "Creating account..." : "Create account"}
        </button>
        <p className="text-center text-[11px] leading-relaxed text-[#565d68]">
          By creating an account you agree to our{" "}
          <Link href="/legal/terms" className="underline hover:text-[#101318]">Terms</Link> and{" "}
          <Link href="/legal/privacy-policy" className="underline hover:text-[#101318]">Privacy Policy</Link>.
          Your data is stored securely and used only for your reporting.
        </p>
      </form>

      <p className="mt-6 text-center text-sm text-[#565d68]">
        Already have an account? <Link href="/app/login" className="font-semibold text-[#101318] hover:underline">Sign in</Link>.
      </p>
    </div>
  );
}
