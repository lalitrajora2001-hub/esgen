"use client";

import { motion } from "framer-motion";

/* Horizontal four-step process, connected by an animated line — the steps
   reveal in sequence as the section scrolls into view. */

const STEPS: { n: string; t: string; d: string; icon: React.ReactNode }[] = [
  { n: "01", t: "Assess", d: "Understand your footprint and obligations with a materiality and gap review.", icon: <><circle cx="11" cy="11" r="6" /><path d="M20 20l-4.3-4.3" /></> },
  { n: "02", t: "Collect", d: "Bring activity, energy, and supplier data into one structured workspace.", icon: <><path d="M12 3l9 5-9 5-9-5z" /><path d="M3 13l9 5 9-5" /></> },
  { n: "03", t: "Report", d: "Map figures to the frameworks you need and prepare structured disclosures.", icon: <><rect x="6" y="3" width="12" height="18" rx="2" /><path d="M9 8h6M9 12h6M9 16h4" /></> },
  { n: "04", t: "Assure", d: "Trace every figure back to its evidence, ready for assurance and audit.", icon: <><path d="M12 3l7 2.6v5.7c0 4.4-3 7.4-7 8.7-4-1.3-7-4.3-7-8.7V5.6z" /><path d="M9 12l2 2 4-4" /></> },
];

export function ProcessFlow() {
  return (
    <div className="relative">
      {/* connecting line (desktop) */}
      <div className="pointer-events-none absolute inset-x-0 top-8 hidden lg:block" aria-hidden>
        <motion.div
          className="mx-auto h-px w-[76%] origin-left bg-gradient-to-r from-transparent via-white/30 to-transparent"
          initial={{ scaleX: 0, opacity: 0 }}
          whileInView={{ scaleX: 1, opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 1.1, ease: [0.16, 1, 0.3, 1] }}
        />
      </div>

      <div className="grid gap-y-14 lg:grid-cols-4">
        {STEPS.map((s, i) => (
          <motion.div
            key={s.t}
            className="relative flex flex-col items-center px-4 text-center"
            initial={{ opacity: 0, y: 22 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "0px 0px -12% 0px" }}
            transition={{ duration: 0.55, delay: i * 0.14, ease: [0.16, 1, 0.3, 1] }}
          >
            <div className="relative z-10 grid h-16 w-16 place-items-center rounded-full border border-white/15 bg-canvas text-white shadow-[0_0_0_7px_var(--color-canvas)] transition-colors duration-300 hover:border-white/40">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="h-7 w-7">{s.icon}</svg>
            </div>
            <span className="mt-6 font-mono text-xs tracking-[0.2em] text-text-muted/70">{s.n}</span>
            <h3 className="mt-1.5 font-display text-lg font-semibold">{s.t}</h3>
            <p className="mt-2 max-w-[15rem] text-sm leading-relaxed text-text-muted">{s.d}</p>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
