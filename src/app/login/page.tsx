"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

/**
 * The real sign-in lives at /app/login (the BRSR tool). This route only exists
 * so old links and bookmarks land in the right place.
 */
export default function LoginRedirect() {
  const router = useRouter();
  useEffect(() => {
    router.replace("/app/login");
  }, [router]);
  return (
    <section className="grid min-h-screen place-items-center px-5">
      <div className="flex flex-col items-center gap-4 text-center">
        <span className="h-8 w-8 animate-spin rounded-full border-2 border-border border-t-accent" />
        <p className="text-sm text-text-muted">Taking you to sign in</p>
        <p className="text-sm text-text-muted">
          Not redirected? <Link href="/app/login" className="text-accent-3 underline">Continue to sign in</Link>.
        </p>
      </div>
    </section>
  );
}
