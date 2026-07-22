import type { Metadata } from "next";
import Link from "next/link";
import { Reveal } from "@/components/ui/Reveal";
import { LightHead, LightCta } from "@/components/sections/HomeFeatures";
import { ArrowRight } from "@/components/ui/Button";

export const metadata: Metadata = {
  title: "Partner Program",
  description: "Join the ESGen partner ecosystem. Combine your client relationships with our ESG expertise and reporting software to deliver audit-ready sustainability outcomes.",
};

const INK = "#101318";
const MUTED = "#565d68";

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
    <div className="bg-white">
      {/* Hero: copy left, photo right, matching the homepage treatment. */}
      <section className="relative overflow-hidden pt-28 pb-16 sm:pt-36">
        <div className="mx-auto grid max-w-6xl items-center gap-12 px-5 sm:px-6 lg:grid-cols-[1.05fr_1fr]">
          <div>
            <Reveal>
              <p className="font-mono text-[0.72rem] uppercase tracking-[0.2em]" style={{ color: MUTED }}>Partner ecosystem</p>
            </Reveal>
            <Reveal>
              <h1 className="mt-4 text-balance font-display text-4xl font-bold leading-[1.05] tracking-tight sm:text-5xl lg:text-[3.4rem]" style={{ color: INK }}>
                The ESGen Partner Ecosystem
              </h1>
            </Reveal>
            <Reveal>
              <p className="mt-5 text-xl" style={{ color: INK }}>Powering the next generation of ESG execution.</p>
            </Reveal>
            <Reveal>
              <p className="mt-4 max-w-lg text-base leading-relaxed" style={{ color: MUTED }}>
                Combine your trusted client relationships with our ESG expertise and reporting software, and deliver audit-ready, financial-grade sustainability outcomes without building the infrastructure yourself.
              </p>
            </Reveal>
            <Reveal>
              <div className="mt-9 flex flex-wrap gap-3">
                <Link href="/contact" className="inline-flex items-center gap-2 bg-[#0b0d11] px-6 py-3.5 text-sm font-bold text-white transition-transform hover:-translate-y-0.5">
                  Join our partner network <ArrowRight className="h-4 w-4" />
                </Link>
                <Link href="/demo" className="inline-flex items-center border border-[#d5d9e0] px-6 py-3.5 text-sm font-bold transition-colors hover:bg-[#f2f4f7]" style={{ color: INK }}>
                  See the platform
                </Link>
              </div>
            </Reveal>
          </div>

          <Reveal>
            <div className="relative overflow-hidden rounded-3xl border border-[#e6e8ec] shadow-[0_36px_80px_-52px_rgba(15,23,42,0.55)]">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src="/images/partnership.jpg" alt="Two professionals shaking hands to mark a new partnership" className="h-[420px] w-full object-cover" />
            </div>
          </Reveal>
        </div>
      </section>

      {/* Intro */}
      <section className="px-5 py-16 sm:px-6">
        <Reveal>
          <div className="mx-auto max-w-3xl text-center">
            <h2 className="text-balance font-display text-3xl font-bold tracking-tight sm:text-4xl" style={{ color: INK }}>One ecosystem for scalable ESG delivery</h2>
            <p className="mt-5 text-lg leading-relaxed" style={{ color: MUTED }}>
              The transition to sustainable business is too complex for any single firm to tackle alone. The ESGen Partner Ecosystem is built for forward-thinking agencies, consultancies, and systems integrators who want to elevate their client offerings, working with our team and platform rather than reinventing the reporting stack from scratch.
            </p>
          </div>
        </Reveal>
      </section>

      {/* Why partner */}
      <section className="bg-[#f6f7f9] px-5 py-20 sm:px-6">
        <LightHead title="Why partner with ESGen" />
        <div className="mx-auto mt-12 grid max-w-4xl gap-5 sm:grid-cols-2">
          {BENEFITS.map((b) => (
            <Reveal key={b.title}>
              <div className="h-full rounded-3xl border border-[#e6e8ec] bg-white p-7">
                <span className="grid h-11 w-11 place-items-center rounded-xl border border-[#e6e8ec] bg-[#f6f7f9]" style={{ color: INK }}>
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" className="h-5 w-5">{b.icon}</svg>
                </span>
                <h3 className="mt-5 font-display text-lg font-semibold" style={{ color: INK }}>{b.title}</h3>
                <p className="mt-2 text-sm leading-relaxed" style={{ color: MUTED }}>{b.desc}</p>
              </div>
            </Reveal>
          ))}
        </div>
      </section>

      {/* Trusted partners. The supplied artwork is light-on-dark, so it keeps its
          own dark chip rather than being recoloured. */}
      <section className="px-5 py-20 sm:px-6">
        <LightHead title="Our trusted partners" intro="We work alongside organisations who share our belief that sustainability should be practical and within reach of every business." />
        <div className="mx-auto mt-12 grid max-w-3xl gap-6 sm:grid-cols-2">
          {PARTNERS.map((p) => (
            <Reveal key={p.name}>
              <div className="group flex h-44 items-center justify-center rounded-3xl bg-[#0b0d11] px-10 transition-all duration-300 hover:-translate-y-1.5 hover:shadow-[0_28px_60px_-30px_rgba(15,23,42,0.6)]">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={p.img} alt={`${p.name} logo`} className="max-h-24 w-auto max-w-full object-contain transition-transform duration-300 group-hover:scale-110" />
              </div>
            </Reveal>
          ))}
        </div>
      </section>

      <LightCta
        title="Ready to grow with ESGen?"
        intro="Join our partner ecosystem and deliver scalable, audit-ready ESG solutions to your clients."
      />
    </div>
  );
}
