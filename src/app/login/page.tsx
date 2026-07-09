import type { Metadata } from "next";
import { LoginForm } from "@/components/forms/LoginForm";
import { Logo } from "@/components/logo/Logo";

export const metadata: Metadata = {
  title: "Sign in",
  description: "Sign in to your ESGen workspace. Client access is available for invited users.",
};

export default function LoginPage() {
  return (
    <section className="relative flex min-h-screen items-center justify-center overflow-hidden px-5 py-32">
      <div aria-hidden className="pointer-events-none absolute inset-0" style={{ background: "radial-gradient(600px 380px at 50% 0%, rgba(77,139,245,0.14), transparent 60%)" }} />
      <div className="relative w-full max-w-md">
        <div className="mb-8 flex flex-col items-center text-center">
          <Logo />
          <h1 className="mt-6 text-2xl font-semibold">Sign in to your workspace</h1>
          <p className="mt-2 text-sm text-text-muted">Client access is available for invited users.</p>
        </div>
        <div className="card p-6 sm:p-8">
          <LoginForm />
        </div>
      </div>
    </section>
  );
}
