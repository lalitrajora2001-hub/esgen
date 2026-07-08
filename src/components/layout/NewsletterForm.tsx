"use client";

import { useState } from "react";
import { Button } from "@/components/ui/Button";

/** Newsletter signup UI. Demo only: no real submission endpoint is wired. */
export function NewsletterForm() {
  const [done, setDone] = useState(false);
  return (
    <div>
      <p className="mono-label mb-2">Newsletter</p>
      {done ? (
        <p className="text-sm text-[#3fb6a8]">Thanks. You are on the list.</p>
      ) : (
        <form
          className="flex max-w-sm gap-2"
          onSubmit={(e) => {
            e.preventDefault();
            setDone(true);
          }}
          aria-label="Newsletter signup"
        >
          <label htmlFor="footer-email" className="sr-only">
            Email address
          </label>
          <input
            id="footer-email"
            type="email"
            required
            placeholder="you@company.co.uk"
            className="h-11 flex-1 rounded-full border border-border bg-surface px-4 text-sm text-text placeholder:text-text-muted/60 focus:border-accent focus:outline-none"
          />
          <Button type="submit" size="md">
            Subscribe
          </Button>
        </form>
      )}
      <p className="mt-2 font-mono text-[0.7rem] text-text-muted/60">Demo only. Wire to your email provider.</p>
    </div>
  );
}
