"use client";

import { useState } from "react";
import { motion } from "framer-motion";

const ACCENT = "#4d8bf5";

/* Routes an enquiry to the right next step and contact. Uses only ESGen's
   real published addresses — no invented phone numbers or offices. */
type Route = { k: string; icon: string; blurb: string; to: string; cta: string; href: string };
const ROUTES: Route[] = [
  { k: "I need to report to a framework", icon: "M4 5a2 2 0 0 1 2-2h9l5 5v11a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2zM14 3v6h6", blurb: "Tell us which frameworks you are preparing for and how you are structured. We will scope the right setup and walk you through the platform.", to: "contactus@esgen.co.uk", cta: "Book a demo", href: "/demo" },
  { k: "I want to understand pricing", icon: "M12 1v22M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6", blurb: "Pricing is scoped to your reporting needs. Configure a setup on the pricing page, then send it over and we will quote against it.", to: "contactus@esgen.co.uk", cta: "Open the configurator", href: "/pricing" },
  { k: "I'm a consultant or advisor", icon: "M9 8a3 3 0 1 0 0-6 3 3 0 0 0 0 6zM3 20a6 6 0 0 1 12 0M17 11a2.5 2.5 0 1 0 0-5M16 20h5a5 5 0 0 0-5-5", blurb: "The partner program lets you refer, deliver, or run your whole practice on ESGen. Kunj handles partnership conversations directly.", to: "kunjpatel@esgen.co.uk", cta: "See the partner program", href: "/partner-program" },
  { k: "I'm an existing client", icon: "M12 3l8 4v5c0 5-3.5 8.5-8 9-4.5-.5-8-4-8-9V7z", blurb: "For support with your workspace, reach the operations team and we will get you to the right person.", to: "janvi@esgen.co.uk", cta: "Sign in", href: "/login" },
];

export function EnquiryRouter() {
  const [i, setI] = useState(0);
  const r = ROUTES[i];
  return (
    <div className="overflow-hidden rounded-3xl border border-border bg-surface shadow-float">
      <div className="border-b border-border px-6 py-4">
        <span className="font-mono text-[0.68rem] uppercase tracking-[0.16em] text-text-muted">What brings you here?</span>
      </div>
      <div className="grid md:grid-cols-[1fr_1fr]">
        <div className="p-3">
          {ROUTES.map((x, k) => {
            const on = k === i;
            return (
              <button key={x.k} onClick={() => setI(k)} onMouseEnter={() => setI(k)} aria-pressed={on}
                className="flex w-full items-center gap-3 rounded-xl px-3 py-3.5 text-left transition-colors hover:bg-white/[0.03] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-1 focus-visible:outline-accent"
                style={{ background: on ? "rgba(77,139,245,0.08)" : undefined, boxShadow: on ? `inset 3px 0 0 ${ACCENT}` : undefined }}>
                <span className="grid h-9 w-9 shrink-0 place-items-center rounded-lg border" style={{ borderColor: on ? "rgba(77,139,245,0.4)" : "var(--color-border)", background: on ? "rgba(77,139,245,0.12)" : "transparent" }}>
                  <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke={on ? "#8fbaff" : "var(--color-text-muted)"} strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round"><path d={x.icon} /></svg>
                </span>
                <span className="min-w-0 flex-1 text-[0.86rem] font-medium" style={{ color: on ? "#fff" : "var(--color-text-muted)" }}>{x.k}</span>
                <svg viewBox="0 0 24 24" className="h-4 w-4 shrink-0 transition-transform" style={{ color: on ? "#8fbaff" : "transparent", transform: on ? "translateX(2px)" : "none" }} fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="M9 6l6 6-6 6" /></svg>
              </button>
            );
          })}
        </div>
        <motion.div key={r.k} initial={{ opacity: 0, x: 8 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.24 }}
          className="flex flex-col border-t border-border bg-gradient-to-br from-surface-2 to-surface p-6 md:border-l md:border-t-0">
          <p className="text-[0.92rem] leading-relaxed text-white">{r.blurb}</p>
          <div className="mt-5 rounded-xl border border-border bg-canvas p-3.5">
            <div className="font-mono text-[0.6rem] uppercase tracking-wide text-text-muted">Best contact</div>
            <a href={`mailto:${r.to}`} className="mt-1 block font-display text-sm font-medium text-white hover:text-accent-3">{r.to}</a>
          </div>
          <a href={r.href} className="mt-auto inline-flex items-center gap-2 pt-5 text-sm font-semibold text-accent-3 hover:underline">
            {r.cta} <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="M5 12h14M13 6l6 6-6 6" /></svg>
          </a>
        </motion.div>
      </div>
    </div>
  );
}
