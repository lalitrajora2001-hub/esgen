"use client";

import { useEffect } from "react";
import Lenis from "lenis";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

/**
 * Site-wide smooth momentum scrolling via Lenis, integrated with GSAP ScrollTrigger.
 *
 * Lenis drives the scroll, gsap.ticker drives Lenis, and every Lenis scroll calls
 * ScrollTrigger.update() so scroll-scrubbed animations (for example the header logo
 * morph) stay in sync. We also broadcast the offset on an "app:scroll" event for
 * non-GSAP listeners (the frosted header). Disabled under reduced motion.
 */
export function SmoothScroll({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    const emit = (y: number) => window.dispatchEvent(new CustomEvent("app:scroll", { detail: y }));

    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduce) {
      const onScroll = () => emit(window.scrollY);
      window.addEventListener("scroll", onScroll, { passive: true });
      emit(window.scrollY);
      return () => window.removeEventListener("scroll", onScroll);
    }

    gsap.registerPlugin(ScrollTrigger);

    const lenis = new Lenis({
      duration: 1.1,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      smoothWheel: true,
    });
    (window as unknown as { __lenis?: Lenis }).__lenis = lenis;

    lenis.on("scroll", (e: { scroll: number }) => {
      ScrollTrigger.update();
      emit(e.scroll);
    });

    const tick = (time: number) => lenis.raf(time * 1000);
    gsap.ticker.add(tick);
    gsap.ticker.lagSmoothing(0);
    emit(0);

    return () => {
      gsap.ticker.remove(tick);
      lenis.destroy();
      delete (window as unknown as { __lenis?: Lenis }).__lenis;
    };
  }, []);

  return <>{children}</>;
}
