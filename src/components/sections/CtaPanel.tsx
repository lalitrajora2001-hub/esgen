"use client";

import { useRef } from "react";
import { Button, ArrowRight } from "@/components/ui/Button";

/**
 * Interactive CTA panel — a neutral dark card with a soft white spotlight that
 * follows the cursor, a slow ambient sheen, and a fine grid texture. No blue.
 */
export function CtaPanel({
  title,
  intro,
  primary,
  secondary,
}: {
  title: string;
  intro: string;
  primary: { label: string; href: string };
  secondary: { label: string; href: string };
}) {
  const ref = useRef<HTMLDivElement>(null);

  const onMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const el = ref.current;
    if (!el) return;
    const r = el.getBoundingClientRect();
    el.style.setProperty("--mx", `${e.clientX - r.left}px`);
    el.style.setProperty("--my", `${e.clientY - r.top}px`);
  };

  return (
    <div
      ref={ref}
      onMouseMove={onMove}
      className="group relative overflow-hidden rounded-3xl border border-white/10 p-10 text-center sm:p-16"
      style={{ background: "linear-gradient(160deg, #14171f 0%, #06070b 70%)" }}
    >
      {/* cursor-follow spotlight */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-500 group-hover:opacity-100"
        style={{ background: "radial-gradient(460px circle at var(--mx, 50%) var(--my, 50%), rgba(255,255,255,0.10), transparent 62%)" }}
      />
      {/* ambient drifting sheen */}
      <div
        aria-hidden
        className="pointer-events-none absolute -top-1/3 left-1/2 h-[120%] w-[70%] -translate-x-1/2 animate-cta-sheen opacity-60"
        style={{ background: "radial-gradient(closest-side, rgba(255,255,255,0.07), transparent 70%)" }}
      />
      {/* fine grid texture */}
      <div className="grid-texture pointer-events-none absolute inset-0 opacity-40" aria-hidden />

      <div className="relative">
        <h2 className="mx-auto max-w-2xl text-balance text-3xl font-semibold sm:text-4xl">{title}</h2>
        <p className="mx-auto mt-4 max-w-xl text-lg text-text-muted">{intro}</p>
        <div className="mt-8 flex flex-wrap justify-center gap-3">
          <Button href={primary.href} size="lg">{primary.label} <ArrowRight /></Button>
          <Button href={secondary.href} variant="ghost" size="lg">{secondary.label}</Button>
        </div>
      </div>
    </div>
  );
}
