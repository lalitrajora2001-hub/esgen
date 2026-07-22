import Link from "next/link";
import { Reveal } from "@/components/ui/Reveal";
import { ArrowRight } from "@/components/ui/Button";
import { InsightsDashboard } from "@/components/appmockups";
import { ScopesDashboard } from "@/components/mockups";

/* ============================================================
   1) Two feature cards: neutral visual panel on top, then a
   heading, three bullets and an action button.
   ============================================================ */

function Bullet({ children }: { children: React.ReactNode }) {
  return (
    <li className="flex items-start gap-3 text-[0.95rem] leading-relaxed text-text-muted">
      <span aria-hidden className="mt-[0.55rem] h-1.5 w-1.5 shrink-0 rounded-full bg-white/40" />
      <span>{children}</span>
    </li>
  );
}

function FeaturePanelCard({
  panel, title, bullets, href,
}: { panel: React.ReactNode; title: string; bullets: string[]; href: string }) {
  return (
    <Reveal className="h-full">
      <div className="flex h-full flex-col overflow-hidden rounded-2xl border border-border bg-surface">
        {/* neutral visual panel (no blue tint) */}
        <div className="flex min-h-[168px] items-center justify-center px-6 py-8" style={{ background: "linear-gradient(160deg, rgba(255,255,255,0.07), rgba(255,255,255,0.02))" }}>
          {panel}
        </div>
        <div className="flex flex-1 flex-col p-7">
          <h3 className="font-display text-xl font-bold">{title}</h3>
          <ul className="mt-5 space-y-3">
            {bullets.map((b) => <Bullet key={b}>{b}</Bullet>)}
          </ul>
          <Link href={href} className="mt-7 inline-flex w-fit items-center gap-2 rounded-xl bg-accent px-5 py-2.5 text-sm font-bold text-white transition-all duration-300 hover:-translate-y-0.5 hover:bg-accent-2">
            Find out more <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </div>
    </Reveal>
  );
}

/* Framework name chips (text only, we do not reproduce third-party logos). */
function FrameworkChips() {
  return (
    <div className="flex flex-wrap items-center justify-center gap-2.5">
      {["CSRD", "UK SRS", "BRSR", "CBAM", "SECR"].map((f) => (
        <span key={f} className="rounded-xl border border-border bg-canvas px-3.5 py-2.5 font-display text-sm font-bold text-white">{f}</span>
      ))}
    </div>
  );
}

/* Segmented control mock, last item shown as the active view. */
function WorkflowChips() {
  const items = ["Scopes", "Suppliers", "Evidence", "Report"];
  return (
    <div className="flex w-full max-w-md items-center gap-1 rounded-xl border border-border bg-canvas p-1.5">
      {items.map((it, i) => (
        <span key={it} className={`flex-1 rounded-lg px-2 py-2 text-center text-[0.8rem] font-semibold ${i === items.length - 1 ? "bg-white/10 text-white" : "text-text-muted"}`}>{it}</span>
      ))}
    </div>
  );
}

export function ComplianceCards() {
  return (
    <div className="grid gap-6 lg:grid-cols-2">
      <FeaturePanelCard
        panel={<FrameworkChips />}
        title="Stay compliant"
        href="/solutions/reporting"
        bullets={[
          "Collect your data once and reuse it across reporting frameworks",
          "Replace manual spreadsheets and the re-keying errors they cause",
          "Validation, ownership and evidence built into the workflow",
        ]}
      />
      <FeaturePanelCard
        panel={<WorkflowChips />}
        title="Cut reporting effort"
        href="/platform/carbon-assessment"
        bullets={[
          "See where your emissions and your effort actually concentrate",
          "Prioritise the gaps that make the biggest difference to your footprint",
          "Turn one dataset into every disclosure you are asked for",
        ]}
      />
    </div>
  );
}

/* ============================================================
   2) Platform showcase: three points on the left, layered
   product mockups on the right.
   ============================================================ */

const POINTS: [string, string][] = [
  ["Centralise your data", "ESGen brings activity data, supplier responses and evidence together across your organisation and value chain."],
  ["Report with confidence", "Prepare disclosures from a single, traceable source, with evidence connected to every figure."],
  ["Unlock value for everyone", "Share the same numbers across finance, procurement and operations so decisions line up."],
];

export function PlatformShowcase() {
  return (
    <div className="grid items-center gap-10 lg:grid-cols-[0.85fr_1.15fr]">
      <Reveal>
        <div className="rounded-2xl border border-border bg-surface p-8">
          <div className="space-y-7">
            {POINTS.map(([t, d]) => (
              <div key={t}>
                <h3 className="font-display text-xl font-bold">{t}</h3>
                <p className="mt-2 text-sm leading-relaxed text-text-muted">{d}</p>
              </div>
            ))}
          </div>
        </div>
      </Reveal>

      <Reveal className="min-w-0">
        <div className="relative pb-10 sm:pb-16">
          <div className="rounded-2xl shadow-float"><InsightsDashboard /></div>
          {/* overlapping secondary panel, desktop only */}
          <div className="pointer-events-none absolute -bottom-2 right-0 hidden w-[54%] rounded-2xl shadow-float lg:block">
            <ScopesDashboard />
          </div>
        </div>
      </Reveal>
    </div>
  );
}
