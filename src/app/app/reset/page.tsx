"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAuth } from "@/components/tool/AuthProvider";
import { Logo } from "@/components/logo/Logo";
import { Field } from "@/components/forms/fields";
import { Button } from "@/components/ui/Button";

/**
 * Password-recovery landing page. The email link signs the user in with a
 * temporary recovery session (detectSessionInUrl), then they set a new
 * password here. Lives outside the (auth) group so the signed-in redirect
 * does not bounce the user away before they can type.
 */
export default function ResetPasswordPage() {
  const { session, loading, updatePassword } = useAuth();
  const router = useRouter();
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);
  const [done, setDone] = useState(false);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    if (password.length < 8) { setError("Use at least 8 characters."); return; }
    if (password !== confirm) { setError("The two passwords do not match."); return; }
    setBusy(true);
    const { error: err } = await updatePassword(password);
    setBusy(false);
    if (err) { setError(err); return; }
    setDone(true);
    setTimeout(() => router.replace("/app"), 1200);
  };

  return (
    <section className="app-light relative grid min-h-screen place-items-center bg-canvas px-5 py-14 text-text">
      <div className="w-full max-w-md">
        <div className="mb-8 flex flex-col items-center text-center">
          <Link href="/" aria-label="ESGen home">
            <Logo className="h-12 text-[#101828]" />
          </Link>
          <p className="mt-3.5 text-[0.68rem] font-medium uppercase tracking-[0.2em] text-text-muted">Reporting workspace</p>
        </div>

        <div className="card p-6 sm:p-8">
          {loading ? (
            <p className="text-center text-sm text-text-muted">Checking your reset link...</p>
          ) : done ? (
            <div className="text-center">
              <span className="mx-auto grid h-12 w-12 place-items-center rounded-full bg-teal/10 text-teal">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="h-6 w-6"><path d="M5 13l4 4L19 7" strokeLinecap="round" strokeLinejoin="round" /></svg>
              </span>
              <h1 className="mt-4 text-xl font-semibold">Password updated</h1>
              <p className="mt-2 text-sm text-text-muted">Taking you to your workspace...</p>
            </div>
          ) : !session ? (
            <div className="text-center">
              <h1 className="text-xl font-semibold">Reset link invalid or expired</h1>
              <p className="mt-2 text-sm text-text-muted">
                Reset links are single-use and time-limited. Request a fresh one from the sign-in page.
              </p>
              <Link href="/app/login" className="mt-5 inline-block text-sm font-medium text-teal hover:underline">
                Back to sign in
              </Link>
            </div>
          ) : (
            <div>
              <h1 className="text-xl font-semibold">Set a new password</h1>
              <p className="mt-1.5 text-sm text-text-muted">For {session.user?.email}.</p>
              <form onSubmit={submit} noValidate className="mt-5 space-y-4">
                <Field id="new-password" label="New password" type="password" required autoComplete="new-password" value={password} onChange={setPassword} placeholder="At least 8 characters" />
                <Field id="confirm-password" label="Confirm new password" type="password" required autoComplete="new-password" value={confirm} onChange={setConfirm} />
                {error && <p className="rounded-xl border border-[#e5484d]/30 bg-[#e5484d]/8 p-3 text-sm text-[#b42318]" role="alert">{error}</p>}
                <Button type="submit" size="lg" className="w-full" disabled={busy}>
                  {busy ? "Saving..." : "Save new password"}
                </Button>
              </form>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
