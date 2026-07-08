"use client";

import { useEffect, useRef } from "react";
import { motion, useReducedMotion } from "framer-motion";
import { Button, ArrowRight } from "@/components/ui/Button";
import { images } from "@/lib/images";

/** Homepage hero with a cursor-reactive accent glow and a product visual. */
export function Hero() {
  const ref = useRef<HTMLDivElement>(null);
  const reduce = useReducedMotion();

  useEffect(() => {
    const el = ref.current;
    if (!el || reduce) return;
    if (window.matchMedia("(pointer: coarse)").matches) return;

    let raf = 0;
    const target = { x: 0.72, y: 0.2 };
    const current = { x: 0.72, y: 0.2 };
    const onMove = (e: MouseEvent) => {
      const r = el.getBoundingClientRect();
      target.x = (e.clientX - r.left) / r.width;
      target.y = (e.clientY - r.top) / r.height;
    };
    const loop = () => {
      current.x += (target.x - current.x) * 0.08;
      current.y += (target.y - current.y) * 0.08;
      el.style.setProperty("--mx", `${(current.x * 100).toFixed(2)}%`);
      el.style.setProperty("--my", `${(current.y * 100).toFixed(2)}%`);
      raf = requestAnimationFrame(loop);
    };
    el.addEventListener("mousemove", onMove);
    raf = requestAnimationFrame(loop);
    return () => {
      el.removeEventListener("mousemove", onMove);
      cancelAnimationFrame(raf);
    };
  }, [reduce]);

  const lines = ["Measure, report,", "and reduce your", "emissions."];

  return (
    <section
      ref={ref}
      className="relative overflow-hidden pt-36 pb-20 sm:pt-44 sm:pb-28"
      style={{ ["--mx" as string]: "72%", ["--my" as string]: "20%" }}
    >
      {/* Cursor-reactive glow */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            "radial-gradient(520px 400px at var(--mx) var(--my), rgba(77,139,245,0.12), transparent 62%)",
        }}
      />
      <div className="grid-texture pointer-events-none absolute inset-0" aria-hidden />

      <div className="relative mx-auto grid max-w-6xl items-center gap-12 px-5 sm:px-6 lg:grid-cols-[1.05fr_0.95fr]">
        <div>
          <motion.p
            initial={reduce ? false : { opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="mono-label"
          >
            Carbon accounting and ESG software
          </motion.p>
          <h1 className="mt-5 text-5xl font-semibold leading-[1.02] tracking-tight sm:text-6xl lg:text-[4.4rem]">
            {lines.map((line, i) => (
              <span key={i} className="block overflow-hidden">
                <motion.span
                  className="block"
                  initial={reduce ? false : { y: "110%" }}
                  animate={{ y: 0 }}
                  transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1], delay: 0.1 + i * 0.09 }}
                >
                  {i === 2 ? <span className="text-gradient">{line}</span> : line}
                </motion.span>
              </span>
            ))}
          </h1>
          <motion.p
            initial={reduce ? false : { opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.5 }}
            className="mt-6 max-w-xl text-lg text-text-muted"
          >
            ESGen turns scattered activity data into audit-ready emissions figures, so you can report against
            the standards that matter and act on what you find. Software plus real guidance, built for teams
            doing this for the first time.
          </motion.p>
          <motion.div
            initial={reduce ? false : { opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.62 }}
            className="mt-8 flex flex-wrap items-center gap-3"
          >
            <Button href="/demo" size="lg">Book a demo <ArrowRight /></Button>
            <Button href="/platform" variant="ghost" size="lg">Explore the platform</Button>
          </motion.div>
          <p className="mt-6 font-mono text-xs text-text-muted/70">Built on the GHG Protocol. CSRD and SECR ready.</p>
        </div>

        <motion.div
          initial={reduce ? false : { opacity: 0, y: 24, scale: 0.98 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ duration: 0.9, delay: 0.3, ease: [0.16, 1, 0.3, 1] }}
          className="relative"
        >
          <div className="relative overflow-hidden rounded-2xl border border-border shadow-[var(--shadow-card)]">
            <img
              src={images.team.src}
              alt={images.team.alt}
              loading="lazy"
              className="aspect-[4/3] w-full object-cover"
            />
            <div aria-hidden className="pointer-events-none absolute inset-0" style={{ background: "linear-gradient(180deg, rgba(6,6,8,0) 45%, rgba(6,6,8,0.72))" }} />
          </div>
          {/* Small floating metric chip: a rare accent on the photo. */}
          <div className="absolute -bottom-4 -left-4 hidden rounded-xl border border-border bg-surface/90 p-4 shadow-[var(--shadow-card)] backdrop-blur sm:block">
            <p className="font-mono text-[0.6rem] uppercase tracking-wider text-text-muted">Report readiness</p>
            <p className="mt-1 font-display text-2xl font-semibold">72<span className="text-accent-3">%</span></p>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
