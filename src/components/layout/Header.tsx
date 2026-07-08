"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { AnimatePresence, motion } from "framer-motion";
import { mainNav, type NavEntry } from "@/lib/nav";
import { LogoMorph } from "@/components/logo/LogoMorph";
import { Button, ArrowRight } from "@/components/ui/Button";
import { MobileDrawer } from "@/components/layout/MobileDrawer";
import { cn } from "@/lib/cn";

function hasColumns(e: NavEntry): e is Extract<NavEntry, { columns: unknown }> {
  return "columns" in e;
}

export function Header() {
  const [scrolled, setScrolled] = useState(false);
  const [openMenu, setOpenMenu] = useState<string | null>(null);
  const [drawer, setDrawer] = useState(false);
  const closeTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    const update = (y: number) => setScrolled(y > 80);
    const onApp = (e: Event) => update((e as CustomEvent<number>).detail);
    const onNative = () => update(window.scrollY);
    // Lenis broadcasts the real scroll offset via "app:scroll"; window scroll is a fallback.
    window.addEventListener("app:scroll", onApp as EventListener);
    window.addEventListener("scroll", onNative, { passive: true });
    onNative();
    return () => {
      window.removeEventListener("app:scroll", onApp as EventListener);
      window.removeEventListener("scroll", onNative);
    };
  }, []);

  const openWith = (label: string) => {
    if (closeTimer.current) clearTimeout(closeTimer.current);
    setOpenMenu(label);
  };
  const scheduleClose = () => {
    if (closeTimer.current) clearTimeout(closeTimer.current);
    closeTimer.current = setTimeout(() => setOpenMenu(null), 120);
  };

  return (
    <header
      className={cn(
        "fixed inset-x-0 top-0 z-[120] transition-all duration-300",
        scrolled ? "border-b border-border bg-canvas/80 backdrop-blur-xl" : "border-b border-transparent"
      )}
    >
      <div className="mx-auto flex h-16 max-w-[1600px] items-center gap-4 px-5 sm:px-6">
        {/* Large, legible ESGEN wordmark that morphs into the E as you scroll. */}
        <Link href="/" aria-label="ESGen home" className="flex h-9 items-center text-white" onMouseEnter={scheduleClose}>
          <span className="sr-only">ESGen</span>
          <LogoMorph className="h-7" />
        </Link>

        {/* Desktop nav */}
        <nav className="ml-3 hidden items-center gap-1 2xl:flex" aria-label="Primary">
          {mainNav.map((entry) => {
            if (!hasColumns(entry)) {
              return (
                <Link
                  key={entry.label}
                  href={entry.href}
                  className="rounded-lg px-3 py-2 text-sm font-medium text-text-muted transition-colors hover:text-text"
                  onMouseEnter={scheduleClose}
                >
                  {entry.label}
                </Link>
              );
            }
            const isOpen = openMenu === entry.label;
            return (
              <div key={entry.label} className="relative" onMouseEnter={() => openWith(entry.label)} onMouseLeave={scheduleClose}>
                <button
                  className={cn(
                    "flex items-center gap-1 rounded-lg px-3 py-2 text-sm font-medium transition-colors",
                    isOpen ? "text-text" : "text-text-muted hover:text-text"
                  )}
                  aria-expanded={isOpen}
                  onClick={() => setOpenMenu(isOpen ? null : entry.label)}
                >
                  {entry.label}
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className={cn("h-3.5 w-3.5 transition-transform", isOpen && "rotate-180")}>
                    <path d="M6 9l6 6 6-6" />
                  </svg>
                </button>
                <AnimatePresence>
                  {isOpen && (
                    <motion.div
                      initial={{ opacity: 0, y: 8 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: 8 }}
                      transition={{ duration: 0.18, ease: [0.16, 1, 0.3, 1] }}
                      className="absolute left-0 top-full pt-3"
                    >
                      <div className="w-[min(680px,80vw)] overflow-hidden rounded-2xl border border-border bg-surface/95 p-2 shadow-2xl backdrop-blur-xl">
                        <div className={cn("grid gap-1 p-2", entry.columns.length === 1 ? "grid-cols-1" : "grid-cols-3")}>
                          {entry.columns.map((col) => (
                            <div key={col.heading} className="p-2">
                              <p className="mb-2 px-2 font-mono text-[0.68rem] uppercase tracking-[0.12em] text-text-muted/70">{col.heading}</p>
                              <ul>
                                {col.links.map((l) => (
                                  <li key={l.href}>
                                    <Link href={l.href} className="group block rounded-xl px-2 py-2 transition-colors hover:bg-surface-2" onClick={() => setOpenMenu(null)}>
                                      <span className="block text-sm font-medium text-text group-hover:text-white">{l.title}</span>
                                      {l.desc && <span className="mt-0.5 block text-xs text-text-muted">{l.desc}</span>}
                                    </Link>
                                  </li>
                                ))}
                              </ul>
                            </div>
                          ))}
                        </div>
                        {entry.featured && (
                          <Link href={entry.featured.href} className="mt-1 flex items-center justify-between gap-3 rounded-xl border border-border bg-canvas/60 px-4 py-3 transition-colors hover:border-accent/50" onClick={() => setOpenMenu(null)}>
                            <span>
                              <span className="block text-sm font-medium text-text">{entry.featured.title}</span>
                              <span className="block text-xs text-text-muted">{entry.featured.desc}</span>
                            </span>
                            <ArrowRight className="text-accent-3" />
                          </Link>
                        )}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            );
          })}
        </nav>

        {/* Right actions */}
        <div className="ml-auto flex h-16 items-center gap-2">
          <Link href="/login" className="hidden h-9 items-center rounded-lg px-3 text-sm font-medium text-text-muted transition-colors hover:text-text sm:inline-flex">
            Login
          </Link>
          <Button href="/demo" size="md" className="hidden sm:inline-flex">
            Book a demo
          </Button>
          <button
            className="flex h-10 w-10 items-center justify-center rounded-lg text-text 2xl:hidden"
            aria-label="Open menu"
            aria-expanded={drawer}
            onClick={() => setDrawer(true)}
          >
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" className="h-6 w-6">
              <path d="M4 7h16M4 12h16M4 17h16" />
            </svg>
          </button>
        </div>
      </div>

      <MobileDrawer open={drawer} onClose={() => setDrawer(false)} />
    </header>
  );
}
