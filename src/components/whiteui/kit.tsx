"use client";

import { useEffect, useRef, useState } from "react";
import { useInView } from "framer-motion";

/* Shared building blocks for the white product pages (Finance, Supply Chain, …). */

export const CK = {
  navy: "#12224f", blue: "#2f6fe0", blue2: "#6d97f0", blue3: "#a9c4f7",
  ink: "#111827", muted: "#6b7480", line: "#e7ebf3", pale: "#e6eeff",
  green: "#2f9e44", amber: "#e0a11b", orange: "#f0743a", teal: "#17a2a2", sky: "#8fd0ef",
};

export function useReveal() {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "0px 0px -12% 0px" });
  return { ref, inView };
}

/** Count up to `to` once `play` is true. */
export function Count({ to, play, decimals = 0, prefix = "", suffix = "" }: { to: number; play: boolean; decimals?: number; prefix?: string; suffix?: string }) {
  const [v, setV] = useState(0);
  useEffect(() => {
    if (!play) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) { setV(to); return; }
    let raf = 0; const t0 = performance.now(); const dur = 1500;
    const tick = (now: number) => { const p = Math.min(1, (now - t0) / dur); setV(to * (1 - Math.pow(1 - p, 3))); if (p < 1) raf = requestAnimationFrame(tick); };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [play, to]);
  return <>{prefix}{v.toLocaleString("en-GB", { minimumFractionDigits: decimals, maximumFractionDigits: decimals })}{suffix}</>;
}

/** The ESGen "E" mark in a chosen colour (default black). */
export function EsgenMark({ color = "#111827", className = "h-6 w-8" }: { color?: string; className?: string }) {
  return (
    <span
      className={`block shrink-0 ${className}`}
      style={{ background: color, WebkitMaskImage: "url(/brand/esgen-symbol.svg)", maskImage: "url(/brand/esgen-symbol.svg)", WebkitMaskRepeat: "no-repeat", maskRepeat: "no-repeat", WebkitMaskSize: "contain", maskSize: "contain", WebkitMaskPosition: "center", maskPosition: "center" }}
      aria-label="ESGen" role="img"
    />
  );
}

/** Small pulsing "Live" indicator. */
export function LiveTag() {
  return (
    <span className="flex items-center gap-1.5 text-[0.55rem] font-semibold uppercase tracking-wide" style={{ color: CK.muted }}>
      <span className="live-dot h-1.5 w-1.5 rounded-full" style={{ background: "#22c55e" }} />Live
    </span>
  );
}
