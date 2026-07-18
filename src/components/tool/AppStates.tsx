"use client";

import { useRouter } from "next/navigation";
import { useAuth } from "@/components/tool/AuthProvider";
import { Button } from "@/components/ui/Button";

/** Shared loading / setup states for the tool. */

export function FullLoader({ label = "Loading your workspace" }: { label?: string }) {
  return (
    <div className="app-light grid min-h-screen place-items-center bg-canvas px-6 text-text">
      <div className="flex flex-col items-center gap-4 text-center">
        <span className="h-8 w-8 animate-spin rounded-full border-2 border-border border-t-accent" />
        <p className="text-sm text-text-muted">{label}</p>
      </div>
    </div>
  );
}

export function NotConfigured() {
  const { enterDemo } = useAuth();
  const router = useRouter();

  const startDemo = () => {
    enterDemo();
    router.replace("/app");
  };

  return (
    <div className="app-light grid min-h-screen place-items-center bg-canvas px-6 text-text">
      <div className="card max-w-lg p-8 text-center">
        <h1 className="text-xl font-semibold">Explore the tool</h1>
        <p className="mt-3 text-sm leading-relaxed text-text-muted">
          Try the full workspace now with sample data, or connect a backend for real accounts and
          saved data.
        </p>
        <div className="mt-6 flex flex-col items-center gap-3">
          <Button onClick={startDemo} size="lg" className="w-full sm:w-auto">
            Explore the demo (sample data)
          </Button>
          <p className="text-xs text-text-muted">Nothing is saved in demo mode.</p>
        </div>
        <div className="mt-7 border-t border-border pt-6 text-left">
          <p className="text-sm font-medium">To go live with real accounts</p>
          <p className="mt-2 text-sm leading-relaxed text-text-muted">
            Create a free Supabase project, add its URL and anon key to a{" "}
            <code className="rounded bg-surface-2 px-1.5 py-0.5 text-accent-3">.env.local</code> file
            (see <code className="rounded bg-surface-2 px-1.5 py-0.5 text-accent-3">.env.local.example</code>) and run the SQL
            in <code className="rounded bg-surface-2 px-1.5 py-0.5 text-accent-3">supabase/schema.sql</code>.
            This screen is then replaced by the live sign-in.
          </p>
        </div>
      </div>
    </div>
  );
}

/** Small reusable disclaimer used wherever the tool shows computed figures. */
export function IllustrativeNote({ children }: { children?: React.ReactNode }) {
  return (
    <p className="rounded-xl border border-border bg-surface-2/60 p-3 text-xs leading-relaxed text-text-muted">
      {children ?? (
        <>
          Indicative figures for orientation only. They depend on the emission factors and data you
          enter, and are not a substitute for verified reporting. Confirm the current official
          conversion factors and your specific circumstances before any disclosure.
        </>
      )}
    </p>
  );
}
