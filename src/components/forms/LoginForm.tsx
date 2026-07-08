"use client";

import { useState } from "react";
import { Button } from "@/components/ui/Button";
import { Field, isEmail } from "@/components/forms/fields";

/** Login UI only. No real authentication is wired. */
export function LoginForm() {
  const [v, setV] = useState({ email: "", password: "" });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [note, setNote] = useState(false);
  const set = (k: keyof typeof v) => (val: string) => setV((s) => ({ ...s, [k]: val }));

  const submit = (ev: React.FormEvent) => {
    ev.preventDefault();
    const e: Record<string, string> = {};
    if (!isEmail(v.email)) e.email = "Please enter a valid email address.";
    if (v.password.length < 6) e.password = "Please enter your password.";
    setErrors(e);
    if (Object.keys(e).length === 0) setNote(true);
  };

  return (
    <form onSubmit={submit} noValidate aria-label="Login" className="space-y-5">
      <Field id="email" label="Email" type="email" inputMode="email" required autoComplete="email" value={v.email} onChange={set("email")} error={errors.email} />
      <Field id="password" label="Password" type="password" required autoComplete="current-password" value={v.password} onChange={set("password")} error={errors.password} />
      <div className="flex items-center justify-between text-sm">
        <label className="flex items-center gap-2 text-text-muted">
          <input type="checkbox" className="h-4 w-4 rounded border-border bg-surface" /> Remember me
        </label>
        <a href="#" className="text-accent-3 hover:underline">Forgot password?</a>
      </div>
      <Button type="submit" size="lg" className="w-full">Sign in</Button>
      {note && (
        <p className="rounded-xl border border-accent/25 bg-[rgba(77,139,245,0.08)] p-4 font-mono text-xs text-text-muted" role="status">
          This is a UI demo. No authentication is wired. Integration point: connect your identity provider.
        </p>
      )}
      <p className="text-center text-sm text-text-muted">No account? <a href="/demo" className="text-accent-3 hover:underline">Book a demo</a></p>
    </form>
  );
}
