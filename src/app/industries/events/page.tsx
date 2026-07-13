import type { Metadata } from "next";
import Link from "next/link";
import { INDUSTRY_DATA } from "@/lib/industries";
import { Reveal } from "@/components/ui/Reveal";
import { EventTimeline } from "@/components/industries/IndustryInteractives";
import { EventFootprintStudio } from "@/components/industries/EventFootprintStudio";

export const metadata: Metadata = {
  title: "Event Sustainability Reporting Software",
  description: "Measure event footprints across venue energy, travel, catering, freight, and waste, with a repeatable template and client-ready reports.",
  alternates: { canonical: "/industries/events" },
};

/* White and black editorial page. The festival photograph is rendered
   grayscale so the page stays strictly monochrome. */

const INK = "#101318";
const MUTED = "#565d68";
const FAINT = "#8a919c";
const LINE = "#e6e8ec";

const EVIDENCE: [string, string, string][] = [
  ["01", "Attendee travel", "Usually the largest share by far, and the hardest to reach, because it sits with hundreds of individuals. Registration data gives a defensible estimate; surveys refine the flights that matter."],
  ["02", "Venue and energy", "The venue's power and heating over your event days, attributed to your event rather than the building's year. The venue choice itself fixes most of this line before anything is measured."],
  ["03", "Catering choices", "Meals served, by menu type. The plant-to-meat mix moves this line more than any other single decision an organiser controls directly."],
  ["04", "Waste prevention", "What leaves the site and where it goes, evidenced by transfer notes. The cheapest line to improve, and the one clients notice first."],
];

const AUDIENCES = ["Associations & NGOs", "International organisations", "Corporate teams", "Private groups"];

export default function EventsPage() {
  const data = INDUSTRY_DATA.events;

  return (
    <div className="bg-white" style={{ color: INK }}>
      {/* Full-viewport grayscale hero; the page content starts on scroll */}
      <section className="relative flex min-h-[100svh] items-start overflow-hidden">
        <img src="/images/events-festival.jpg" alt="Festival crowd under falling confetti and stage lights"
          className="absolute inset-0 h-full w-full object-cover" style={{ filter: "grayscale(1) contrast(1.05)" }} />
        <div aria-hidden className="absolute inset-0" style={{ background: "linear-gradient(to bottom right, rgba(11,13,17,0.88) 0%, rgba(11,13,17,0.45) 40%, rgba(11,13,17,0.12) 76%, transparent 100%)" }} />
        <div aria-hidden className="absolute inset-x-0 bottom-0 h-40" style={{ background: "linear-gradient(180deg, transparent, rgba(11,13,17,0.6))" }} />
        <div aria-hidden className="absolute bottom-6 left-1/2 z-10 -translate-x-1/2">
          <span className="flex flex-col items-center gap-1.5 text-[0.6rem] font-bold uppercase tracking-[0.2em] text-white/60">
            Scroll
            <svg viewBox="0 0 24 24" className="h-4 w-4 motion-safe:animate-bounce" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M6 9l6 6 6-6" /></svg>
          </span>
        </div>
        <div className="relative mx-auto w-full max-w-6xl px-5 pb-20 pt-32 sm:px-6 sm:pt-40">
          <div className="max-w-2xl">
          <nav aria-label="Breadcrumb" className="flex flex-wrap items-center gap-2 font-mono text-xs text-white/60">
            <Link href="/" className="hover:underline">Home</Link><span>/</span>
            <span>Industries</span><span>/</span>
            <span className="text-white">Events</span>
          </nav>
          <h1 className="mt-5 font-display text-4xl font-bold leading-[1.05] tracking-tight text-white sm:text-6xl">
            The footprint of a great day out
          </h1>
          <p className="mt-5 max-w-xl text-lg leading-relaxed text-white/80">
            An event exists for a week and vanishes. Its footprint is real, your client wants it reported, and the data scatters the moment the site clears. ESGen catches it while it is still catchable.
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <Link href="/demo" className="inline-flex items-center gap-2 bg-white px-6 py-3.5 text-sm font-bold transition-transform hover:-translate-y-0.5" style={{ color: INK }}>
              Book a demo
              <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="M5 12h14M13 6l6 6-6 6" /></svg>
            </Link>
            <Link href="/contact" className="inline-flex items-center border border-white/50 px-6 py-3.5 text-sm font-bold text-white transition-colors hover:bg-white/10">
              Talk to our team
            </Link>
          </div>
          </div>
        </div>
      </section>

      {/* Editorial intro */}
      <section className="py-16 sm:py-24">
        <div className="mx-auto grid max-w-6xl gap-10 px-5 sm:px-6 lg:grid-cols-[1fr_1fr]">
          <h2 className="max-w-md font-display text-3xl font-bold leading-[1.1] tracking-tight sm:text-4xl" style={{ color: INK }}>
            The footprint is decided in planning, not measured after
          </h2>
          <div className="space-y-5 text-[1.02rem] leading-relaxed" style={{ color: "#3a414c" }}>
            <p>
              By the time the doors open, most of an event&rsquo;s footprint is already fixed. The venue set the energy line. The menu set the catering line. The location, and who you invited, set the travel line, and travel usually dwarfs everything else.
            </p>
            <p>
              That is why sustainable event delivery starts with venue strategy, catering choices, and waste prevention, and why the measurement has to start there too. A footprint report assembled months later from whatever survived is a guess. One built alongside the planning is evidence.
            </p>
            <p>
              Clients increasingly write that evidence into the brief, and sponsors with their own reporting obligations need their share of it. The organiser who can hand over a documented carbon analysis while the event still matters is the one who gets rebooked.
            </p>
          </div>
        </div>
      </section>

      {/* Footprint Studio */}
      <section className="border-t py-16 sm:py-24" style={{ borderColor: LINE }}>
        <div className="mx-auto max-w-6xl px-5 sm:px-6">
          <div className="max-w-2xl">
            <h2 className="font-display text-3xl font-bold tracking-tight sm:text-4xl" style={{ color: INK }}>Feel how the choices move the number</h2>
            <p className="mt-4 text-base leading-relaxed" style={{ color: MUTED }}>
              Set the size, the length, the travel mix, and the menu. Watch the footprint recompose as you decide.
            </p>
          </div>
          <div className="mt-10"><Reveal><EventFootprintStudio /></Reveal></div>
        </div>
      </section>

      {/* What organisers evidence: numbered hairline rows */}
      <section className="py-16 sm:py-24">
        <div className="mx-auto max-w-6xl px-5 sm:px-6">
          <h2 className="max-w-2xl font-display text-3xl font-bold tracking-tight sm:text-4xl" style={{ color: INK }}>Four lines every client report needs</h2>
          <div className="mt-10 divide-y border-y" style={{ borderColor: LINE }}>
            {EVIDENCE.map(([n, t, d]) => (
              <Reveal key={n}>
                <div className="grid gap-4 py-8 lg:grid-cols-[110px_0.8fr_1.2fr] lg:items-baseline">
                  <span className="font-display text-4xl font-bold tabular-nums sm:text-5xl" style={{ color: "#d3d7dc" }}>{n}</span>
                  <h3 className="font-display text-xl font-bold" style={{ color: INK }}>{t}</h3>
                  <p className="text-[0.98rem] leading-relaxed" style={{ color: MUTED }}>{d}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* Lifecycle timeline */}
      <section className="border-t py-16 sm:py-24" style={{ borderColor: LINE }}>
        <div className="mx-auto max-w-6xl px-5 sm:px-6">
          <div className="max-w-2xl">
            <h2 className="font-display text-3xl font-bold tracking-tight sm:text-4xl" style={{ color: INK }}>A footprint with a beginning, a middle, and an end</h2>
            <p className="mt-4 text-base leading-relaxed" style={{ color: MUTED }}>
              Events are projects, so the measurement is one too. Walk the three phases and see what gets captured in each.
            </p>
          </div>
          <div className="mt-10"><Reveal><EventTimeline /></Reveal></div>
        </div>
      </section>

      {/* Audiences */}
      <section className="py-16 sm:py-24">
        <div className="mx-auto max-w-6xl px-5 sm:px-6">
          <div className="flex flex-wrap items-center justify-between gap-6">
            <h2 className="font-display text-2xl font-bold tracking-tight sm:text-3xl" style={{ color: INK }}>Whoever the client, the question is the same</h2>
            <p className="max-w-sm text-sm leading-relaxed" style={{ color: MUTED }}>Conferences, seminars, formal dinners, festivals. The evidence a footprint report needs does not change with the guest list.</p>
          </div>
          <div className="mt-8 flex flex-wrap gap-3">
            {AUDIENCES.map((a) => (
              <span key={a} className="rounded-full border px-5 py-2.5 font-display text-base font-bold" style={{ borderColor: INK, color: INK }}>{a}</span>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="border-t py-16 sm:py-24" style={{ borderColor: LINE }}>
        <div className="mx-auto grid max-w-6xl gap-12 px-5 sm:px-6 lg:grid-cols-[0.8fr_1.2fr]">
          <h2 className="font-display text-3xl font-bold tracking-tight sm:text-4xl" style={{ color: INK }}>Questions from event teams</h2>
          <div className="divide-y border-y" style={{ borderColor: LINE }}>
            {data.faqs.map(([q, a]) => (
              <details key={q} className="group py-5">
                <summary className="flex cursor-pointer items-center justify-between gap-4 font-display text-base font-bold" style={{ color: INK }}>
                  {q}
                  <svg viewBox="0 0 24 24" fill="none" stroke={INK} strokeWidth="2.4" strokeLinecap="round" className="h-4 w-4 shrink-0 transition-transform group-open:rotate-45"><path d="M12 5v14M5 12h14" /></svg>
                </summary>
                <p className="mt-3 max-w-2xl text-[0.95rem] leading-relaxed" style={{ color: MUTED }}>{a}</p>
              </details>
            ))}
          </div>
        </div>
      </section>

      {/* Final CTA: black band */}
      <section className="px-5 pb-20 sm:px-6">
        <div className="mx-auto max-w-6xl bg-[#0b0d11] px-8 py-16 text-center sm:px-16">
          <h2 className="mx-auto max-w-2xl font-display text-3xl font-bold text-white sm:text-4xl">Measure your next event while it still matters</h2>
          <p className="mx-auto mt-4 max-w-xl text-lg text-white/70">Registrations, meters, and invoices in. A footprint report your client can use, out, with the assumptions stated.</p>
          <div className="mt-9 flex flex-wrap justify-center gap-3">
            <Link href="/demo" className="inline-flex items-center gap-2 bg-white px-6 py-3.5 text-sm font-bold text-[#0b0d11] transition-transform hover:-translate-y-0.5">
              Book a demo
              <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="M5 12h14M13 6l6 6-6 6" /></svg>
            </Link>
            <Link href="/contact" className="inline-flex items-center border border-white/40 px-6 py-3.5 text-sm font-bold text-white transition-colors hover:bg-white/10">
              Contact us
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
