"use client";

import { useEffect, useRef, useState } from "react";

/**
 * A stat that counts up from 0 to `value` the moment it scrolls into view, then
 * holds — the live "number ticking up" effect used by Normative / Greenly. Uses a
 * plain IntersectionObserver (robust regardless of the smooth-scroll layer) and an
 * eased rAF tween. Respects reduced motion by showing the final value.
 */
export function ScrollStat({
  value,
  prefix = "",
  suffix = "",
  decimals = 0,
  label,
  note,
}: {
  value: number;
  prefix?: string;
  suffix?: string;
  decimals?: number;
  label: string;
  note?: string;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const [display, setDisplay] = useState(0);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      setDisplay(value);
      return;
    }

    let raf = 0;
    let started = false;
    const run = () => {
      if (started) return;
      started = true;
      const t0 = performance.now();
      const dur = 1900;
      const tick = (now: number) => {
        const p = Math.min(1, (now - t0) / dur);
        const eased = 1 - Math.pow(1 - p, 4);
        setDisplay(value * eased);
        if (p < 1) raf = requestAnimationFrame(tick);
      };
      raf = requestAnimationFrame(tick);
    };

    const io = new IntersectionObserver(
      (entries) => entries.forEach((e) => e.isIntersecting && run()),
      { threshold: 0.35 }
    );
    io.observe(el);

    // Fallback: if it's already within the viewport on mount, start immediately.
    const r = el.getBoundingClientRect();
    if (window.innerHeight && r.top < window.innerHeight && r.bottom > 0) run();

    return () => {
      cancelAnimationFrame(raf);
      io.disconnect();
    };
  }, [value]);

  return (
    <div ref={ref}>
      <div className="font-display text-5xl font-bold leading-none tracking-tight tabular-nums text-white sm:text-6xl">
        {prefix}
        {display.toLocaleString("en-GB", { minimumFractionDigits: decimals, maximumFractionDigits: decimals })}
        {suffix}
      </div>
      <div className="mt-4 h-px w-12 bg-white/25" />
      <p className="mt-4 text-sm font-medium text-text">{label}</p>
      {note && <p className="mt-1 text-xs text-text-muted">{note}</p>}
    </div>
  );
}
