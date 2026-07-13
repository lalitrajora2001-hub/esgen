import { Button, ArrowRight } from "@/components/ui/Button";

/* Full-viewport homepage hero: a living aurora backdrop with the headline
   anchored top-left, mirroring the industries heroes. */
export function HomeHero() {
  return (
    <section className="relative flex min-h-[100svh] items-start overflow-hidden bg-canvas">
      <video
        className="absolute inset-0 h-full w-full object-cover"
        autoPlay
        muted
        loop
        playsInline
        preload="auto"
        style={{ filter: "saturate(1.1) contrast(1.03)" }}
      >
        <source src="/videos/sunset.mp4" type="video/mp4" />
      </video>

      {/* colour-preserving scrims: dark top-left for legibility, a soft vignette, and a blend into the page */}
      <div aria-hidden className="pointer-events-none absolute inset-0" style={{ background: "linear-gradient(to bottom right, rgba(4,6,12,0.9) 0%, rgba(4,6,12,0.5) 36%, rgba(4,6,12,0.12) 68%, rgba(4,6,12,0) 100%)" }} />
      <div aria-hidden className="pointer-events-none absolute inset-0" style={{ background: "radial-gradient(125% 120% at 28% 18%, transparent 42%, rgba(2,4,9,0.55) 100%)" }} />
      <div aria-hidden className="pointer-events-none absolute inset-0" style={{ background: "linear-gradient(180deg, rgba(4,6,12,0.3) 0%, transparent 24%, transparent 60%, rgba(6,7,11,0.72) 92%, #06070b 100%)" }} />

      <div className="relative mx-auto w-full max-w-6xl px-5 pb-24 pt-32 sm:px-6 sm:pt-40">
        <div className="max-w-2xl" style={{ textShadow: "0 1px 30px rgba(2,4,9,0.82), 0 1px 5px rgba(2,4,9,0.7)" }}>
          <p className="font-mono text-[0.72rem] uppercase tracking-[0.22em]" style={{ color: "#ffd9a8" }}>ESG &amp; carbon intelligence</p>
          <h1 className="mt-5 text-balance font-display text-5xl font-semibold leading-[1.02] text-white sm:text-6xl lg:text-7xl">
            Turn ESG mandates into your{" "}
            <span style={{ backgroundImage: "linear-gradient(92deg, #ffe3b0 0%, #ffcf9e 45%, #ffb3c9 100%)", WebkitBackgroundClip: "text", backgroundClip: "text", color: "transparent" }}>
              competitive advantage.
            </span>
          </h1>
          <p className="mt-6 max-w-xl text-lg leading-relaxed text-white/85">
            ESGen evaluates your operational footprint and maps a precise, actionable pathway to meet industry-specific ESG standards, so reporting becomes a foundation for growth rather than an administrative burden.
          </p>
          <div className="mt-9 flex flex-wrap gap-3">
            <Button href="/demo" size="lg">Book a demo <ArrowRight /></Button>
            <Button href="/platform/carbon-assessment" variant="ghost" size="lg">Explore the platform</Button>
          </div>
        </div>
      </div>

      {/* scroll cue */}
      <div aria-hidden className="absolute inset-x-0 bottom-6 flex justify-center">
        <svg viewBox="0 0 24 24" className="h-6 w-6 animate-bounce text-white/55" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M6 9l6 6 6-6" /></svg>
      </div>
    </section>
  );
}
