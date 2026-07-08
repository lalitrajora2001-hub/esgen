"use client";

import { useState } from "react";
import Link from "next/link";
import { AnimatePresence, motion } from "framer-motion";
import { mainNav, type NavEntry } from "@/lib/nav";
import { Button } from "@/components/ui/Button";
import { Wordmark } from "@/components/logo/Logo";

function hasColumns(e: NavEntry): e is Extract<NavEntry, { columns: unknown }> {
  return "columns" in e;
}

export function MobileDrawer({ open, onClose }: { open: boolean; onClose: () => void }) {
  const [expanded, setExpanded] = useState<string | null>(null);

  return (
    <AnimatePresence>
      {open && (
        <>
          <motion.div
            className="fixed inset-0 z-[130] bg-black/60 backdrop-blur-sm xl:hidden"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
          />
          <motion.aside
            className="fixed inset-y-0 right-0 z-[140] flex w-[min(420px,90vw)] flex-col border-l border-border bg-surface xl:hidden"
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "spring", stiffness: 320, damping: 34 }}
            aria-label="Menu"
          >
            <div className="flex h-16 items-center justify-between border-b border-border px-5">
              <Wordmark className="h-4 text-white" />
              <button aria-label="Close menu" onClick={onClose} className="flex h-10 w-10 items-center justify-center rounded-lg text-text">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" className="h-6 w-6">
                  <path d="M6 6l12 12M18 6L6 18" />
                </svg>
              </button>
            </div>

            <nav className="flex-1 overflow-y-auto px-3 py-4" aria-label="Mobile">
              {mainNav.map((entry) => {
                if (!hasColumns(entry)) {
                  return (
                    <Link key={entry.label} href={entry.href} onClick={onClose} className="block rounded-xl px-3 py-3 font-display text-lg font-medium text-text hover:bg-surface-2">
                      {entry.label}
                    </Link>
                  );
                }
                const isOpen = expanded === entry.label;
                return (
                  <div key={entry.label}>
                    <button
                      className="flex w-full items-center justify-between rounded-xl px-3 py-3 font-display text-lg font-medium text-text hover:bg-surface-2"
                      onClick={() => setExpanded(isOpen ? null : entry.label)}
                      aria-expanded={isOpen}
                    >
                      {entry.label}
                      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className={`h-4 w-4 transition-transform ${isOpen ? "rotate-180" : ""}`}>
                        <path d="M6 9l6 6 6-6" />
                      </svg>
                    </button>
                    <AnimatePresence initial={false}>
                      {isOpen && (
                        <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }} exit={{ height: 0, opacity: 0 }} className="overflow-hidden pl-3">
                          {entry.columns.flatMap((c) => c.links).map((l) => (
                            <Link key={l.href} href={l.href} onClick={onClose} className="block rounded-lg px-3 py-2 text-sm text-text-muted hover:text-text">
                              {l.title}
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
              <Link href="/login" onClick={onClose} className="mb-3 block text-center text-sm text-text-muted">Login</Link>
              <Button href="/demo" className="w-full" onClick={onClose}>Book a demo</Button>
            </div>
          </motion.aside>
        </>
      )}
    </AnimatePresence>
  );
}
