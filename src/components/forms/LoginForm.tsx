"use client";

import { useState } from "react";
import { Button } from "@/components/ui/Button";
import { Field, isEmail } from "@/components/forms/fields";
import { site } from "@/lib/nav";

export function LoginForm() {
  const [v, setV] = useState({ email: "", password: "" });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [note, setNote] = useState(false);
  const set = (k: keyof typeof v) => (val: string) => setV((s) => ({ ...s, [k]: val }));

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    const err: Record<string, string> = {};
    if (!isEmail(v.email)) err.email = "Please enter a valid email address.";
    if (v.password.length < 1) err.password = "Please enter your password.";
    setErrors(err);
    if (Object.keys(err).length === 0) setNote(true);
  };

  return (
    <form onSubmit={submit} noValidate aria-label="Sign in" className="space-y-5">
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
        <p className="rounded-xl border border-accent/25 bg-accent/8 p-4 text-sm text-text-muted" role="status">
          Client access is available for invited users. If you need access, please contact us at <a href={`mailto:${site.email}`} className="text-accent-3">{site.email}</a>.
        </p>
      )}
      <p className="text-center text-sm text-text-muted">New to ESGen? <a href="/demo" className="text-accent-3 hover:underline">Book a demo</a>.</p>
    </form>
  );
}
