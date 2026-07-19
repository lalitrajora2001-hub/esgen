"use client";

import { BRSR, allQuestions } from "@/lib/brsr/framework";
import { moduleCompletion } from "@/lib/brsr/calc";
import { dashboardData, fmtNum } from "@/lib/brsr/dashboard";
import type { BrsrReport, ResponseMap } from "@/lib/brsr/db";
import type { Company } from "@/lib/tool/types";
import { Button } from "@/components/ui/Button";
import { cn } from "@/lib/cn";

/**
 * The Frameworks hub. BRSR is the live framework today; the other cards are
 * roadmap only and say so plainly. Data collected for BRSR carries GRI / ISSB /
 * SDG tags, so future frameworks plug into the same responses.
 */

const ROADMAP = [
  {
    key: "gri",
    name: "GRI Standards",
    body: "The most widely used global sustainability reporting standards. Your BRSR KPIs already carry GRI tags.",
  },
  {
    key: "issb",
    name: "ISSB · IFRS S1 / S2",
    body: "Investor-focused sustainability and climate disclosure standards from the IFRS Foundation.",
  },
  {
    key: "csrd",
    name: "CSRD · ESRS",
    body: "The EU's Corporate Sustainability Reporting Directive, relevant for EU-linked value chains.",
  },
  {
    key: "tcfd",
    name: "TCFD",
    body: "Climate-related financial disclosure recommendations, now largely absorbed into ISSB S2.",
  },
];

export function FrameworksHub({
  report, company, responses, onNavigate,
}: {
  report: BrsrReport;
  company: Company | null;
  responses: ResponseMap;
  onNavigate: (key: string) => void;
}) {
  const questions = allQuestions();
  const { answered, total } = moduleCompletion(questions, responses);
  const pct = total > 0 ? Math.round((answered / total) * 100) : 0;
  const d = dashboardData(responses, report, company);

  const scopes = [
    { label: "Scope 1", sub: "Direct emissions · fuels, processes", value: d.scope1, collectedIn: "Principle 6 · EI.7" },
    { label: "Scope 2", sub: "Purchased energy · electricity, heat", value: d.scope2, collectedIn: "Principle 6 · EI.7" },
    { label: "Scope 3", sub: "Value chain · upstream and downstream", value: d.scope3, collectedIn: "Principle 6 · LI.2" },
  ];

  return (
    <div>
      <header className="mb-6">
        <h2 className="text-lg font-semibold">Frameworks</h2>
        <p className="mt-1 max-w-2xl text-sm text-text-muted">
          Reporting frameworks in your workspace. Every datapoint you collect is tagged against
          GRI, ISSB and the SDGs, so frameworks added later reuse the same data.
        </p>
      </header>

      {/* Active framework: BRSR */}
      <section className="card overflow-hidden">
        <div className="flex flex-wrap items-start justify-between gap-4 border-b border-border p-6">
          <div className="flex items-start gap-4">
            <span className="grid h-12 w-12 shrink-0 place-items-center rounded-xl bg-teal/10 text-teal">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" className="h-6 w-6">
                <path d="M9 11l3 3 8-8M21 12v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h11" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </span>
            <div>
              <div className="flex flex-wrap items-center gap-2">
                <h3 className="font-display text-base font-semibold">BRSR · SEBI</h3>
                <span className="rounded-full bg-teal/10 px-2.5 py-0.5 text-[11px] font-semibold text-teal">Active</span>
              </div>
              <p className="mt-1 max-w-xl text-sm text-text-muted">
                Business Responsibility and Sustainability Report, {BRSR.label.includes("2024") ? "2024 format" : BRSR.version}.
                Section A and B, all nine NGRBC principles, and the assured BRSR Core indicators.
              </p>
            </div>
          </div>
          <div className="flex gap-2">
            <Button size="md" onClick={() => onNavigate("__core__")}>Open Collect</Button>
            <Button size="md" variant="ghost" onClick={() => onNavigate("__dash__")}>Dashboard</Button>
          </div>
        </div>

        <div className="grid gap-6 p-6 lg:grid-cols-[1fr_1.4fr]">
          {/* Completion */}
          <div>
            <p className="text-xs font-semibold uppercase tracking-wide text-text-muted">Collection progress · FY {report.financial_year}</p>
            <div className="mt-3 flex items-baseline gap-2">
              <span className="font-display text-3xl font-semibold">{pct}%</span>
              <span className="text-sm text-text-muted">{answered} of {total} datapoints answered</span>
            </div>
            <div className="mt-3 h-2 overflow-hidden rounded-full bg-surface-2">
              <div className="h-full rounded-full bg-teal transition-all" style={{ width: `${pct}%` }} />
            </div>
            <ul className="mt-4 space-y-1.5 text-xs text-text-muted">
              <li className="flex items-center gap-2"><Dot className="bg-teal" /> BRSR Core: nine attributes under reasonable assurance</li>
              <li className="flex items-center gap-2"><Dot className="bg-[#2f6fe0]" /> Essential indicators: mandatory for listed entities</li>
              <li className="flex items-center gap-2"><Dot className="bg-[#98a2b3]" /> Leadership indicators: voluntary, best practice</li>
            </ul>
          </div>

          {/* Scope mapping */}
          <div>
            <p className="text-xs font-semibold uppercase tracking-wide text-text-muted">GHG scope coverage</p>
            <div className="mt-3 grid gap-3 sm:grid-cols-3">
              {scopes.map((s) => (
                <div key={s.label} className="rounded-xl border border-border bg-surface-2/50 p-4">
                  <p className="text-sm font-semibold">{s.label}</p>
                  <p className="mt-0.5 text-[11px] leading-snug text-text-muted">{s.sub}</p>
                  <p className="mt-3 flex items-baseline gap-1">
                    <span className="font-display text-xl font-semibold">{s.value > 0 ? fmtNum(s.value) : "—"}</span>
                    <span className="text-[11px] text-text-muted">tCO2e</span>
                  </p>
                  <p className="mt-2 border-t border-border pt-2 text-[11px] text-text-muted">Collected in {s.collectedIn}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Roadmap frameworks */}
      <h3 className="mb-3 mt-8 text-sm font-semibold uppercase tracking-wide text-text-muted">On the roadmap</h3>
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {ROADMAP.map((f) => (
          <div key={f.key} className="card p-5 opacity-80">
            <div className="flex items-center justify-between gap-2">
              <h4 className="font-display text-sm font-semibold">{f.name}</h4>
              <span className="shrink-0 rounded-full bg-surface-2 px-2.5 py-0.5 text-[11px] font-medium text-text-muted">Planned</span>
            </div>
            <p className="mt-2 text-xs leading-relaxed text-text-muted">{f.body}</p>
          </div>
        ))}
      </div>

      <p className="mt-6 rounded-xl border border-border bg-surface-2/60 p-3 text-xs leading-relaxed text-text-muted">
        ESGEN currently supports the SEBI BRSR framework. Roadmap items are planned work, not live
        features; timelines depend on client demand.
      </p>
    </div>
  );
}

function Dot({ className }: { className?: string }) {
  return <span className={cn("h-1.5 w-1.5 shrink-0 rounded-full", className)} />;
}
