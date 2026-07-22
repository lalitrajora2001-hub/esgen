"use client";

import { useRef, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { AnimatePresence, motion } from "framer-motion";
import { mainNav, hasItems, hasGroups } from "@/lib/nav";
import { LogoMorph } from "@/components/logo/LogoMorph";
import { SearchOverlay } from "@/components/layout/SearchOverlay";
import { MobileMenu } from "@/components/layout/MobileMenu";
import { ArrowRight } from "@/components/ui/Button";
import { cn } from "@/lib/cn";

function Chevron({ open }: { open?: boolean }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className={cn("h-3.5 w-3.5 transition-transform", open && "rotate-180")}>
      <path d="M6 9l6 6 6-6" />
    </svg>
  );
}

const GROUP_COLOR: Record<string, string> = {
  "Carbon management": "#43c6b7",
  "LCA": "#8b5cf6",
  "ESG Management": "#4d8bf5",
};

/* Dropdown opens as a quick wave: panel fades in, then items land one by one. */
const panelV = {
  hidden: { opacity: 0, y: 8 },
  show: { opacity: 1, y: 0, transition: { duration: 0.18, ease: [0.16, 1, 0.3, 1] as const, staggerChildren: 0.032, delayChildren: 0.04 } },
  exit: { opacity: 0, y: 6, transition: { duration: 0.12 } },
};
const itemV = {
  hidden: { opacity: 0, y: 10 },
  show: { opacity: 1, y: 0, transition: { duration: 0.26, ease: [0.16, 1, 0.3, 1] as const } },
  exit: { opacity: 0, transition: { duration: 0.1 } },
};

function Hex({ color }: { color: string }) {
  return (
    <svg viewBox="0 0 24 24" className="mt-0.5 h-4 w-4 shrink-0" aria-hidden>
      <path d="M12 2.2l8.5 4.9v9.8L12 21.8l-8.5-4.9V7.1z" fill={color} fillOpacity="0.22" stroke={color} strokeWidth="1.4" />
    </svg>
  );
}

export function Header() {
  const [openMenu, setOpenMenu] = useState<string | null>(null);
  const [search, setSearch] = useState(false);
  const [mobile, setMobile] = useState(false);
  const closeTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  /* The header CTA picks up the section's accent: blue on Solutions,
     green on Platform, black everywhere else. */
  const pathname = usePathname() ?? "";
  const accent = pathname.startsWith("/solutions")
    ? "#2f6fe0"
    : pathname.startsWith("/platform")
      ? "#16a34a"
      : "#121317";

  const open = (label: string) => {
    if (closeTimer.current) clearTimeout(closeTimer.current);
    setOpenMenu(label);
  };
  const scheduleClose = () => {
    if (closeTimer.current) clearTimeout(closeTimer.current);
    closeTimer.current = setTimeout(() => setOpenMenu(null), 120);
  };

  return (
    <>
      <header className="fixed inset-x-0 top-0 z-[120] bg-white/85 backdrop-blur-xl">
        <div className="flex h-14 w-full items-center gap-6 px-4 sm:px-6 text-[#121317]">
          {/* Fixed-width box: the wordmark morphs inside it, so the nav never reflows. */}
          <div className="w-[124px] shrink-0">
            <Link href="/" aria-label="ESGen home" onMouseEnter={scheduleClose} className="inline-block">
              <LogoMorph className="h-6" />
            </Link>
          </div>

          {/* Desktop nav, centered */}
          <nav className="hidden flex-1 items-center justify-center gap-1 lg:flex" aria-label="Primary">
            {mainNav.map((entry) => {
              if (!hasItems(entry) && !hasGroups(entry)) {
                return (
                  <Link
                    key={entry.label}
                    href={entry.href}
                    className="glass-tab rounded-full px-3.5 py-2 text-sm font-medium text-[#1b1d22] transition-colors hover:text-[#121317]"
                    onMouseEnter={scheduleClose}
                  >
                    {entry.label}
                  </Link>
                );
              }
              const isOpen = openMenu === entry.label;
              const mega = hasGroups(entry);
              return (
                <div key={entry.label} className="relative" onMouseEnter={() => open(entry.label)} onMouseLeave={scheduleClose}>
                  <button
                    className={cn("glass-tab flex items-center gap-1.5 rounded-full px-3.5 py-2 text-sm font-medium transition-colors", isOpen ? "text-[#121317]" : "text-[#1b1d22] hover:text-[#121317]")}
                    aria-expanded={isOpen}
                    aria-haspopup="true"
                    onClick={() => setOpenMenu(isOpen ? null : entry.label)}
                    onFocus={() => open(entry.label)}
                  >
                    {entry.label}
                    <Chevron open={isOpen} />
                  </button>
                  <AnimatePresence>
                    {isOpen && (
                      <motion.div
                        variants={panelV}
                        initial="hidden"
                        animate="show"
                        exit="exit"
                        className={cn("absolute top-full pt-3", mega ? "left-1/2 -translate-x-1/2" : "left-0")}
                      >
                        {mega ? (
                          <div className="w-[860px] max-w-[94vw] overflow-hidden rounded-2xl border border-[#e6e8ec] bg-white p-5 shadow-2xl backdrop-blur-xl">
                            <div className="flex gap-5">
                              {entry.groups.map((g, gi) => (
                                <div
                                  key={g.heading}
                                  className={cn(
                                    "min-w-0",
                                    gi < entry.groups.length - 1 && "border-r border-[#e6e8ec] pr-5",
                                    g.heading === "ESG Management" ? "flex-1" : g.heading === "Carbon management" ? "w-56 shrink-0" : "w-48 shrink-0"
                                  )}
                                >
                                  <p className="mb-2 px-2.5 font-mono text-[0.7rem] uppercase tracking-[0.12em] text-[#6b7280]">{g.heading}</p>
                                  <ul className={cn("grid gap-0.5", g.items.length > 4 && "sm:grid-cols-2")}>
                                    {g.items.map((it) => (
                                      <motion.li key={it.href} variants={itemV}>
                                        <Link href={it.href} onClick={() => setOpenMenu(null)} className="flex items-start gap-2.5 rounded-xl px-2.5 py-2 transition-colors hover:bg-[#f2f4f7]">
                                          <Hex color={GROUP_COLOR[g.heading] ?? "#4d8bf5"} />
                                          <span className="min-w-0">
                                            <span className="block text-sm font-semibold text-[#121317]">{it.label}</span>
                                            {it.desc && <span className="mt-0.5 block text-xs leading-snug text-[#5b6472]">{it.desc}</span>}
                                          </span>
                                        </Link>
                                      </motion.li>
                                    ))}
                                  </ul>
                                </div>
                              ))}
                            </div>
                          </div>
                        ) : (
                          <div className={cn("overflow-hidden rounded-2xl border border-[#e6e8ec] bg-white p-2 shadow-2xl backdrop-blur-xl", entry.columns === 2 ? "w-[560px]" : "w-[340px]")}>
                            <ul className={cn("grid gap-0.5", entry.columns === 2 && "grid-cols-2")}>
                              {entry.items.map((it) => (
                                <motion.li key={it.href} variants={itemV}>
                                  <Link href={it.href} className="group block rounded-xl px-3 py-2.5 transition-colors hover:bg-[#f2f4f7]" onClick={() => setOpenMenu(null)}>
                                    <span className="block text-sm font-medium text-[#121317]">{it.label}</span>
                                    {it.desc && <span className="mt-0.5 block text-xs text-[#5b6472]">{it.desc}</span>}
                                  </Link>
                                </motion.li>
                              ))}
                            </ul>
                            {entry.featured && (
                              <Link href={entry.featured.href} onClick={() => setOpenMenu(null)} className="mt-1 flex items-center justify-between gap-3 rounded-xl border border-[#e6e8ec] bg-[#f6f7f9] px-4 py-3 transition-colors hover:border-[#121317]/25">
                                <span>
                                  <span className="block text-sm font-medium text-[#121317]">{entry.featured.title}</span>
                                  <span className="block text-xs text-[#5b6472]">{entry.featured.desc}</span>
                                </span>
                                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" className="h-4 w-4 text-[#121317]"><path d="M5 12h14M13 6l6 6-6 6" /></svg>
                              </Link>
                            )}
                          </div>
                        )}
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              );
            })}
          </nav>

          {/* Right actions */}
          <div className="ml-auto flex items-center gap-3 lg:ml-0">
            <button aria-label="Search" onClick={() => setSearch(true)} className="hidden h-9 w-9 items-center justify-center rounded-lg text-[#1b1d22] transition-colors hover:text-[#121317] lg:flex">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="h-5 w-5"><circle cx="11" cy="11" r="7" /><path d="M21 21l-4.3-4.3" /></svg>
            </button>
            <span className="hidden h-5 w-px bg-[#e6e8ec] lg:block" aria-hidden="true" />
            <Link href="/app/login" className="hidden text-sm font-medium text-[#1b1d22] transition-colors hover:text-[#121317] lg:block">Sign in</Link>

            {/* Book a demo, bold, chunky */}
            <Link
              href="/demo"
              className="glass-press hidden items-center gap-2 rounded-full px-5 py-2 text-sm font-bold text-white hover:brightness-110 sm:inline-flex"
              style={{ background: accent }}
            >
              Book a demo <ArrowRight className="h-4 w-4" />
            </Link>

            <button
              aria-label={mobile ? "Close menu" : "Open menu"}
              aria-expanded={mobile}
              onClick={() => setMobile(true)}
              className="flex h-10 w-10 items-center justify-center rounded-lg text-[#121317] lg:hidden"
            >
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" className="h-6 w-6"><path d="M4 7h16M4 12h16M4 17h16" /></svg>
            </button>
          </div>
        </div>
      </header>

      <SearchOverlay open={search} onClose={() => setSearch(false)} />
      <MobileMenu open={mobile} onClose={() => setMobile(false)} onSearch={() => { setMobile(false); setSearch(true); }} />
    </>
  );
}
