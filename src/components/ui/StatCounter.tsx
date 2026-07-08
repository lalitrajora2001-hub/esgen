"use client";

import { useEffect, useRef, useState } from "react";
import { useInView, useReducedMotion } from "framer-motion";

/** Counts up to `value` when scrolled into view. Values are illustrative. */
export function StatCounter({
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
  const inView = useInView(ref, { once: true, margin: "0px 0px -20% 0px" });
  const reduce = useReducedMotion();
  const [display, setDisplay] = useState(reduce ? value : 0);

  useEffect(() => {
    if (!inView || reduce) {
      if (reduce) setDisplay(value);
      return;
    }
    let raf = 0;
    const start = performance.now();
    const dur = 1600;
    const tick = (now: number) => {
      const p = Math.min(1, (now - start) / dur);
      const eased = 1 - Math.pow(1 - p, 3);
      setDisplay(value * eased);
      if (p < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [inView, reduce, value]);

  return (
    <div ref={ref}>
      <div className="font-display text-4xl font-semibold tabular-nums sm:text-5xl">
        {prefix}
        {display.toLocaleString("en-GB", { minimumFractionDigits: decimals, maximumFractionDigits: decimals })}
        <span className="text-accent-3">{suffix}</span>
      </div>
      <div className="mt-3 h-px w-10 bg-accent" />
      <p className="mt-3 text-text-muted">{label}</p>
      {note && <p className="mt-1 font-mono text-xs text-text-muted/70">{note}</p>}
    </div>
  );
}
