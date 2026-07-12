import type { Metadata } from "next";
import { Section, SectionHead } from "@/components/ui/Section";
import { Reveal } from "@/components/ui/Reveal";
import { CTASection } from "@/components/sections/blocks";
import { Button, ArrowRight } from "@/components/ui/Button";

export const metadata: Metadata = {
  title: "Partner Program",
  description: "Join the ESGen partner ecosystem. Combine your client relationships with our ESG expertise and reporting software to deliver audit-ready sustainability outcomes.",
};

type Benefit = { icon: React.ReactNode; title: string; desc: string };

const BENEFITS: Benefit[] = [
  {
    icon: <path d="M13 2L4.5 12.5H11l-1 9.5 8.5-11H12z" />,
    title: "Automate the heavy lifting",
    desc: "Stop wrestling with manual data collection. Put our reporting software to work so you can offer clients an automated, single source of truth for their complex ESG metrics.",
  },
  {
    icon: (
      <>
        <circle cx="9" cy="8" r="3" />
        <path d="M15 11a3 3 0 100-6M3 20a6 6 0 0112 0M15.5 14a6 6 0 015 6" />
      </>
    ),
    title: "Tap into deep expertise",
    desc: "Co-sell and collaborate with a team fluent in GHG accounting and high-scrutiny frameworks like CSRD, BRSR, and CBAM.",
  },
  {
    icon: <path d="M3 17l6-6 4 4 8-8M17 7h4v4" />,
    title: "Drive new revenue streams",
    desc: "Unlock referral agreements and co-branded growth opportunities that benefit your firm's bottom line.",
  },
  {
    icon: <path d="M12 3l9 5-9 5-9-5 9-5zM3 13l9 5 9-5M3 17l9 5 9-5" />,
    title: "Scale without adding headcount",
    desc: "Multiply your team's output. Automation reduces the hours required per account, so your existing team can manage more complex clients without increasing operational overhead.",
  },
];

const PARTNERS: { name: string; img: string }[] = [
  { name: "GPEC-X", img: "/images/partners/gpecx.png" },
  { name: "TiiEC", img: "/images/partners/tiiec.png" },
];

export default function PartnerProgramPage() {
  return (
    <>
      {/* Full-viewport photo hero */}
      <section className="relative flex min-h-[100svh] items-center overflow-hidden">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src="/images/partnership.jpg" alt="Two professionals shaking hands to mark a new partnership" className="absolute inset-0 h-full w-full object-cover" />
        <div aria-hidden className="absolute inset-0" style={{ background: "linear-gradient(100deg, rgba(4,5,9,0.94) 0%, rgba(4,5,9,0.8) 38%, rgba(4,5,9,0.42) 72%, rgba(4,5,9,0.25) 100%)" }} />
        <div className="relative mx-auto w-full max-w-6xl px-5 sm:px-6">
          <div className="max-w-xl">
            <p className="font-mono text-[0.72rem] uppercase tracking-[0.18em] text-accent-3">Partner ecosystem</p>
            <h1 className="mt-4 text-balance text-4xl font-semibold leading-[1.04] text-white sm:text-6xl">The ESGen Partner Ecosystem</h1>
            <p className="mt-5 text-xl text-white/85">Powering the next generation of ESG execution.</p>
            <p className="mt-5 max-w-lg text-base leading-relaxed text-white/70">
              Combine your trusted client relationships with our ESG expertise and reporting software, and deliver audit-ready, financial-grade sustainability outcomes without building the infrastructure yourself.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Button href="/contact" size="lg">Join our partner network <ArrowRight /></Button>
              <Button href="/demo" variant="ghost" size="lg">See the platform</Button>
            </div>
          </div>
        </div>
        {/* scroll cue */}
        <div aria-hidden className="absolute inset-x-0 bottom-6 flex justify-center">
          <svg viewBox="0 0 24 24" className="h-6 w-6 animate-bounce text-white/55" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M6 9l6 6 6-6" /></svg>
        </div>
      </section>

      {/* Intro */}
      <Section>
        <Reveal>
          <div className="mx-auto max-w-3xl text-center">
            <h2 className="text-balance font-display text-3xl font-bold sm:text-4xl">One ecosystem for scalable ESG delivery</h2>
            <p className="mt-5 text-lg leading-relaxed text-text-muted">
              The transition to sustainable business is too complex for any single firm to tackle alone. The ESGen Partner Ecosystem is built for forward-thinking agencies, consultancies, and systems integrators who want to elevate their client offerings, working with our team and platform rather than reinventing the reporting stack from scratch.
            </p>
          </div>
        </Reveal>
      </Section>

      {/* Why partner */}
      <Section className="section-blend">
        <SectionHead title="Why partner with ESGen" center />
        <div className="mx-auto mt-12 grid max-w-4xl gap-5 sm:grid-cols-2">
          {BENEFITS.map((b, i) => (
            <Reveal key={b.title}>
              <div className="card h-full p-7" style={{ transitionDelay: `${i * 40}ms` }}>
                <span className="grid h-11 w-11 place-items-center rounded-xl border border-accent/25 bg-accent/10 text-accent-3">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" className="h-5 w-5">{b.icon}</svg>
                </span>
                <h3 className="mt-5 font-display text-lg font-semibold">{b.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-text-muted">{b.desc}</p>
              </div>
            </Reveal>
          ))}
        </div>
      </Section>

      {/* Trusted partners */}
      <Section>
        <SectionHead title="Our trusted partners" intro="We work alongside organisations who share our belief that sustainability should be practical and within reach of every business." center />
        <div className="mx-auto mt-12 grid max-w-3xl gap-6 sm:grid-cols-2">
          {PARTNERS.map((p) => (
            <Reveal key={p.name}>
              <div className="group flex h-44 items-center justify-center rounded-2xl border border-border px-10 transition-all duration-300 hover:-translate-y-1.5 hover:border-accent/50 hover:shadow-[0_24px_60px_-28px_rgba(77,139,245,0.55)]" style={{ background: "#000" }}>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={p.img} alt={`${p.name} logo`} className="max-h-24 w-auto max-w-full object-contain transition-transform duration-300 group-hover:scale-110" />
              </div>
            </Reveal>
          ))}
        </div>
      </Section>

      <CTASection title="Ready to grow with ESGen?" intro="Join our partner ecosystem and deliver scalable, audit-ready ESG solutions to your clients." primary={{ label: "Become a partner", href: "/contact" }} secondary={{ label: "Book a demo", href: "/demo" }} />
    </>
  );
}
