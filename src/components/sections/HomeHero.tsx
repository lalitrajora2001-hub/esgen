import { Button, ArrowRight } from "@/components/ui/Button";

/* Full-viewport homepage hero: bright ambient nature footage with the
   headline scrimmed on the left for legibility. Mirrors the industries heroes. */
export function HomeHero() {
  return (
    <section className="relative flex min-h-[100svh] items-center overflow-hidden bg-canvas">
      <video
        className="absolute inset-0 h-full w-full object-cover motion-reduce:hidden"
        autoPlay
        muted
        loop
        playsInline
        preload="auto"
        style={{ filter: "brightness(1.1) saturate(1.25) contrast(1.03)" }}
      >
        <source src="/videos/forest.mp4" type="video/mp4" />
      </video>

      {/* legibility scrims, footage stays bright on the right */}
      <div aria-hidden className="pointer-events-none absolute inset-0" style={{ background: "linear-gradient(90deg, rgba(6,7,11,0.9) 0%, rgba(6,7,11,0.55) 32%, rgba(6,7,11,0.1) 66%, rgba(6,7,11,0) 100%)" }} />
      <div aria-hidden className="pointer-events-none absolute inset-0" style={{ background: "linear-gradient(180deg, rgba(6,7,11,0.5) 0%, rgba(6,7,11,0) 26%, rgba(6,7,11,0) 60%, rgba(6,7,11,0.72) 92%, #06070b 100%)" }} />

      <div className="relative mx-auto w-full max-w-6xl px-5 sm:px-6">
        <div className="max-w-2xl" style={{ textShadow: "0 1px 28px rgba(3,6,10,0.72), 0 1px 4px rgba(3,6,10,0.6)" }}>
          <p className="font-mono text-[0.72rem] uppercase tracking-[0.2em] text-accent-3">ESG &amp; carbon intelligence</p>
          <h1 className="mt-5 text-balance font-display text-5xl font-semibold leading-[1.03] text-white sm:text-6xl lg:text-7xl">
            Turn ESG mandates into your competitive advantage.
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
