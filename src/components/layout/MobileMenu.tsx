"use client";

import { useState } from "react";
import Link from "next/link";
import { AnimatePresence, motion } from "framer-motion";
import { mainNav, hasItems, hasGroups } from "@/lib/nav";
import { Logo } from "@/components/logo/Logo";

export function MobileMenu({ open, onClose, onSearch }: { open: boolean; onClose: () => void; onSearch: () => void }) {
  const [expanded, setExpanded] = useState<string | null>(null);

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          className="fixed inset-0 z-[190] flex flex-col bg-canvas lg:hidden"
          initial={{ opacity: 0, x: "100%" }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: "100%" }}
          transition={{ type: "spring", stiffness: 320, damping: 34 }}
          aria-label="Menu"
        >
          <div className="flex h-16 items-center justify-between border-b border-border px-5">
            <Logo />
            <div className="flex items-center gap-1">
              <button aria-label="Search" onClick={onSearch} className="flex h-10 w-10 items-center justify-center rounded-lg text-text-muted hover:text-white">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="h-5 w-5"><circle cx="11" cy="11" r="7" /><path d="M21 21l-4.3-4.3" /></svg>
              </button>
              <button aria-label="Close menu" onClick={onClose} className="flex h-10 w-10 items-center justify-center rounded-lg text-white">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" className="h-6 w-6"><path d="M6 6l12 12M18 6L6 18" /></svg>
              </button>
            </div>
          </div>

          <nav className="flex-1 overflow-y-auto px-3 py-4" aria-label="Mobile">
            {mainNav.map((entry) => {
              if (!hasItems(entry) && !hasGroups(entry)) {
                return (
                  <Link key={entry.label} href={entry.href} onClick={onClose} className="block rounded-xl px-3 py-3 font-display text-lg font-medium text-white hover:bg-surface">
                    {entry.label}
                  </Link>
                );
              }
              const isOpen = expanded === entry.label;
              return (
                <div key={entry.label}>
                  <button
                    className="flex w-full items-center justify-between rounded-xl px-3 py-3 font-display text-lg font-medium text-white hover:bg-surface"
                    aria-expanded={isOpen}
                    onClick={() => setExpanded(isOpen ? null : entry.label)}
                  >
                    {entry.label}
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className={`h-4 w-4 transition-transform ${isOpen ? "rotate-180" : ""}`}><path d="M6 9l6 6 6-6" /></svg>
                  </button>
                  <AnimatePresence initial={false}>
                    {isOpen && (
                      <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }} exit={{ height: 0, opacity: 0 }} className="overflow-hidden pl-3">
                        {hasGroups(entry)
                          ? entry.groups.map((g) => (
                              <div key={g.heading} className="mb-1">
                                <p className="px-3 pb-1 pt-2 font-mono text-[0.65rem] uppercase tracking-[0.12em] text-text-muted/60">{g.heading}</p>
                                {g.items.map((l) => (
                                  <Link key={l.href} href={l.href} onClick={onClose} className="block rounded-lg px-3 py-2 text-sm text-text-muted hover:text-white">
                                    {l.label}
                                  </Link>
                                ))}
                              </div>
                            ))
                          : entry.items.map((l) => (
                              <Link key={l.href} href={l.href} onClick={onClose} className="block rounded-lg px-3 py-2 text-sm text-text-muted hover:text-white">
                                {l.label}
                              </Link>
                            ))}
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              );
            })}
          </nav>

          <div className="border-t border-border p-4">
            <Link href="/login" onClick={onClose} className="mb-3 block text-center text-sm text-text-muted">Sign in</Link>
            <Link href="/demo" onClick={onClose} className="flex h-12 items-center justify-center gap-2 rounded-xl bg-accent font-semibold text-white">
              Book a demo
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" className="h-4 w-4"><path d="M5 12h14M13 6l6 6-6 6" /></svg>
            </Link>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
