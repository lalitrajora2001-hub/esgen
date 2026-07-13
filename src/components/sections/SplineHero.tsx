import { Button, ArrowRight } from "@/components/ui/Button";

/* Spline's published viewer embed (the raw .splinecode for this remix is not
   public, so we embed the hosted viewer). Runs entirely in the iframe. */
const SPLINE_EMBED = "https://my.spline.design/retrofuturismbganimation-z67i6PcJJ3v1ZE35MYJIdYZS/";

export function SplineHero() {
  return (
    <section className="relative flex min-h-[100svh] items-start overflow-hidden bg-canvas">
      {/* 3D scene, desktop/tablet only; ambient (pointer-events off so it never traps scroll) */}
      <div aria-hidden className="absolute inset-0 hidden md:block" style={{ pointerEvents: "none" }}>
        <iframe
          src={SPLINE_EMBED}
          title="ESGen 3D backdrop"
          loading="lazy"
          className="h-full w-full border-0"
          style={{ pointerEvents: "none" }}
        />
      </div>

      {/* Mobile fallback (WebGL is heavy on phones): a dark branded gradient */}
      <div
        aria-hidden
        className="absolute inset-0 md:hidden"
        style={{ background: "radial-gradient(120% 100% at 15% 10%, rgba(77,139,245,0.22), transparent 55%), radial-gradient(120% 120% at 90% 90%, rgba(67,198,183,0.16), transparent 55%), #06070b" }}
      />

      {/* legibility scrims (dark top-left) */}
      <div aria-hidden className="pointer-events-none absolute inset-0" style={{ background: "linear-gradient(to bottom right, rgba(6,7,11,0.8) 0%, rgba(6,7,11,0.38) 38%, rgba(6,7,11,0.05) 72%, rgba(6,7,11,0) 100%)" }} />
      <div aria-hidden className="pointer-events-none absolute inset-0" style={{ background: "linear-gradient(180deg, rgba(6,7,11,0.3) 0%, transparent 26%, transparent 62%, rgba(6,7,11,0.7) 92%, #06070b 100%)" }} />

      <div className="pointer-events-none relative mx-auto w-full max-w-6xl px-5 pb-24 pt-32 sm:px-6 sm:pt-40">
        <div className="max-w-2xl" style={{ textShadow: "0 1px 30px rgba(2,4,9,0.82), 0 1px 5px rgba(2,4,9,0.7)" }}>
          <h1 className="text-balance font-display text-5xl font-semibold leading-[1.02] text-white sm:text-6xl lg:text-7xl">
            Turn ESG mandates into your competitive advantage.
          </h1>
          <p className="mt-6 max-w-xl text-lg leading-relaxed text-white/85">
            ESGen evaluates your operational footprint and maps a precise, actionable pathway to meet industry-specific ESG standards, so reporting becomes a foundation for growth rather than an administrative burden.
          </p>
          <div className="pointer-events-auto mt-9 flex flex-wrap gap-3">
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
