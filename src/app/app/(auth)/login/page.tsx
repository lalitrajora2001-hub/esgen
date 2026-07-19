"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAuth } from "@/components/tool/AuthProvider";
import { Button } from "@/components/ui/Button";
import { Field, isEmail } from "@/components/forms/fields";

export default function ToolLoginPage() {
  const { signIn } = useAuth();
  const router = useRouter();
  const [v, setV] = useState({ email: "", password: "" });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [formError, setFormError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);
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
    router.replace("/app");
  };

  return (
    <div>
      <h1 className="text-2xl font-semibold">Welcome back</h1>
      <p className="mt-1.5 text-sm text-text-muted">Sign in to your ESGEN workspace.</p>

      <form onSubmit={submit} noValidate aria-label="Sign in" className="mt-6 space-y-5">
        <Field id="email" label="Email" type="email" inputMode="email" required autoComplete="email" value={v.email} onChange={set("email")} error={errors.email} />
        <Field id="password" label="Password" type="password" required autoComplete="current-password" value={v.password} onChange={set("password")} error={errors.password} />
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
