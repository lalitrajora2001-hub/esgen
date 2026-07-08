import type { Metadata } from "next";
import { LoginForm } from "@/components/forms/LoginForm";
import { Wordmark } from "@/components/logo/Logo";

export const metadata: Metadata = {
  title: "Login",
  description: "Sign in to your ESGen workspace.",
};

export default function LoginPage() {
  return (
    <section className="relative flex min-h-screen items-center justify-center overflow-hidden px-5 py-32">
      <div aria-hidden className="pointer-events-none absolute inset-0" style={{ background: "radial-gradient(600px 400px at 50% 0%, rgba(77,139,245,0.1), transparent 60%)" }} />
      <div className="relative w-full max-w-md">
        <div className="mb-8 text-center">
          <Wordmark className="mx-auto h-7 text-white" />
          <h1 className="mt-6 text-2xl font-semibold">Sign in to your workspace</h1>
          <p className="mt-2 text-sm text-text-muted">Welcome back. Enter your details to continue.</p>
        </div>
        <div className="card-surface p-6 sm:p-8">
          <LoginForm />
        </div>
        <p className="mt-6 text-center font-mono text-xs text-text-muted/60">UI demo. No real authentication is wired.</p>
      </div>
    </section>
  );
}
