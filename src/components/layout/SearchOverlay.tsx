"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import Link from "next/link";
import { AnimatePresence, motion } from "framer-motion";
import { searchQuickLinks, solutions, platform, industries, resources } from "@/lib/nav";

const ALL = [...solutions, ...platform, ...industries, ...resources, { label: "Book a demo", href: "/demo" }, { label: "Contact", href: "/contact" }, { label: "Pricing", href: "/pricing" }, { label: "Partner Program", href: "/partner-program" }];

export function SearchOverlay({ open, onClose }: { open: boolean; onClose: () => void }) {
  const [q, setQ] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (open) {
      setQ("");
      const t = setTimeout(() => inputRef.current?.focus(), 60);
      return () => clearTimeout(t);
    }
  }, [open]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => { if (e.key === "Escape") onClose(); };
    if (open) window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, onClose]);

  const results = useMemo(() => {
    const t = q.trim().toLowerCase();
    if (!t) return searchQuickLinks;
    return ALL.filter((l) => l.label.toLowerCase().includes(t)).slice(0, 8);
  }, [q]);

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          className="fixed inset-0 z-[200] flex items-start justify-center bg-black/70 px-4 pt-24 backdrop-blur-sm"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          role="dialog"
          aria-modal="true"
          aria-label="Search ESGen"
        >
          <motion.div
            className="w-full max-w-xl overflow-hidden rounded-2xl border border-border bg-surface shadow-2xl"
            initial={{ opacity: 0, y: -12, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -12, scale: 0.98 }}
            transition={{ duration: 0.2, ease: [0.16, 1, 0.3, 1] }}
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between border-b border-border px-5 py-3">
              <span className="font-display text-sm font-semibold text-white">Search ESGen</span>
              <button aria-label="Close search" onClick={onClose} className="rounded-lg p-1.5 text-text-muted hover:text-white">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" className="h-5 w-5"><path d="M6 6l12 12M18 6L6 18" /></svg>
              </button>
            </div>
            <div className="flex items-center gap-3 border-b border-border px-5 py-3">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="h-5 w-5 text-text-muted"><circle cx="11" cy="11" r="7" /><path d="M21 21l-4.3-4.3" /></svg>
              <input
                ref={inputRef}
                value={q}
                onChange={(e) => setQ(e.target.value)}
                placeholder="Search solutions, services, industries…"
                aria-label="Search"
                className="w-full bg-transparent text-white placeholder:text-text-muted/70 focus:outline-none"
              />
            </div>
            <div className="p-3">
              <p className="px-2 pb-2 font-mono text-[0.65rem] uppercase tracking-wider text-text-muted/70">{q.trim() ? "Results" : "Quick links"}</p>
              {results.length === 0 ? (
                <p className="px-2 py-4 text-sm text-text-muted">Try “GHG”, “CSRD”, “supplier”, or “manufacturing”.</p>
              ) : (
                <ul>
                  {results.map((l) => (
                    <li key={l.href}>
                      <Link href={l.href} onClick={onClose} className="flex items-center justify-between rounded-xl px-3 py-2.5 text-sm text-white transition-colors hover:bg-surface-2">
                        {l.label}
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" className="h-4 w-4 text-text-muted"><path d="M5 12h14M13 6l6 6-6 6" /></svg>
                      </Link>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
