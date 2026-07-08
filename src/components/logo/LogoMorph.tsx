"use client";

import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { MorphSVGPlugin } from "gsap/MorphSVGPlugin";
import { cn } from "@/lib/cn";
import { LETTER_PATHS, WORDMARK_VIEWBOX } from "@/components/logo/wordmarkPaths";

let registered = false;

/**
 * Header ESGEN wordmark that merges into its leading E once you start scrolling.
 *
 * The merge is a time-based, eased animation (not a scroll scrub): the moment you
 * pass a small threshold it plays once, slow at first then accelerating quickly
 * into the E (ease power3.in), while the box width clips to just the E so the nav
 * reflows cleanly with no gap. Scrolling back to the top reverses it. #e1 never
 * moves or scales. Reduced motion shows the full static wordmark.
 */
export function LogoMorph({ className, threshold = 60 }: { className?: string; threshold?: number }) {
  const boxRef = useRef<HTMLSpanElement>(null);
  const svgRef = useRef<SVGSVGElement>(null);

  useEffect(() => {
    const box = boxRef.current;
    const svg = svgRef.current;
    if (!box || !svg) return;

    if (!registered) {
      gsap.registerPlugin(MorphSVGPlugin);
      registered = true;
    }

    const e1 = svg.querySelector<SVGPathElement>("#e1");
    const s = svg.querySelector<SVGPathElement>("#s");
    const g = svg.querySelector<SVGPathElement>("#g");
    const e2 = svg.querySelector<SVGPathElement>("#e2");
    const n = svg.querySelector<SVGPathElement>("#n");
    if (!e1 || !s || !g || !e2 || !n) return;

    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduce) {
      [s, g, e2, n].forEach((el) => (el.style.opacity = "1"));
      return;
    }

    const ctx = gsap.context(() => {
      // Width of the E vs the full wordmark, to clip the box down to just the E.
      const vb = svg.viewBox.baseVal;
      const fullW = svg.getBoundingClientRect().width;
      const eb = e1.getBBox();
      const eW = Math.ceil(((eb.x + eb.width - vb.x) / (vb.width || 1)) * fullW) + 4;

      gsap.set(box, { width: fullW });
      gsap.set([s, g, e2, n], { opacity: 1 });

      // Collapse timeline: full ESGEN -> only the E. Slow start, quick merge.
      const tl = gsap.timeline({ paused: true });
      tl.to(
        [n, e2, g, s],
        { morphSVG: "#e1", opacity: 0, duration: 0.6, ease: "power3.in", stagger: 0.055 },
        0
      );
      tl.to(box, { width: eW, ease: "power3.in", duration: 0.68 }, 0);

      let collapsed = false;
      const getY = () =>
        (window as unknown as { __lenis?: { scroll: number } }).__lenis?.scroll ?? window.scrollY;

      // Initial state without animating (handles a scrolled reload).
      if (getY() > threshold) {
        collapsed = true;
        tl.progress(1);
      }

      const apply = (y: number) => {
        if (!collapsed && y > threshold) {
          collapsed = true;
          tl.play();
        } else if (collapsed && y < threshold * 0.5) {
          collapsed = false;
          tl.reverse();
        }
      };
      const onApp = (e: Event) => apply((e as CustomEvent<number>).detail);
      const onNative = () => apply(window.scrollY);
      window.addEventListener("app:scroll", onApp as EventListener);
      window.addEventListener("scroll", onNative, { passive: true });

      return () => {
        window.removeEventListener("app:scroll", onApp as EventListener);
        window.removeEventListener("scroll", onNative);
        tl.kill();
      };
    }, box);

    return () => ctx.revert();
  }, [threshold]);

  const ids = ["e1", "s", "g", "e2", "n"] as const;

  return (
    <span
      ref={boxRef}
      role="img"
      aria-label="ESGen"
      className={cn("inline-block overflow-hidden align-middle leading-none text-white", className)}
    >
      <svg ref={svgRef} viewBox={WORDMARK_VIEWBOX} aria-hidden="true" className="block h-full w-auto" style={{ overflow: "visible" }}>
        {ids.map((id) => (
          <path key={id} id={id} d={LETTER_PATHS[id]} fill="currentColor" shapeRendering="geometricPrecision" />
        ))}
      </svg>
    </span>
  );
}
