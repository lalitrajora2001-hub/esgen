"use client";

import { useCompany } from "@/components/tool/CompanyProvider";
import { useEntries } from "@/components/tool/useEntries";
import { Button } from "@/components/ui/Button";
import { FACTORS_SOURCE_LABEL } from "@/lib/emissions/factors";
import {
  totalsByScope, totalKg, toTonnes, fmtTonnes,
} from "@/lib/emissions/calc";

const GENERATED = "17 July 2026";

export default function ReportPage() {
  const { company } = useCompany();
  const { computed, loading } = useEntries(company?.id);

  const scopes = totalsByScope(computed);
  const totalT = toTonnes(totalKg(computed));

  const kwh = computed.filter((e) => e.unit === "kWh");
  const electricityKwh = kwh.filter((e) => e.factor_id === "s2-electricity-kwh").reduce((s, e) => s + e.quantity, 0);
  const gasKwh = kwh.filter((e) => e.factor_id === "s1-natural-gas-kwh").reduce((s, e) => s + e.quantity, 0);
  const meteredKwh = electricityKwh + gasKwh;
  const hasFuel = computed.some((e) => e.unit === "litre");

  const intensity = company?.employees && company.employees > 0 ? totalT / company.employees : null;

  if (loading) return <p className="text-sm text-text-muted">Preparing report...</p>;

  return (
    <div>
      <header className="no-print flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold sm:text-3xl">SECR summary</h1>
          <p className="mt-1 text-sm text-text-muted">
            A Streamlined Energy and Carbon Reporting style summary, generated from your data.
          </p>
        </div>
        <Button onClick={() => window.print()} variant="ghost">Print / save as PDF</Button>
      </header>

      {computed.length === 0 && (
        <p className="no-print mt-6 rounded-xl border border-border bg-surface-2/60 p-4 text-sm text-text-muted">
          There is no activity data yet, so the figures below are zero. Add data first to produce a meaningful summary.
        </p>
      )}

      {/* White document sheet */}
      <article className="print-sheet mx-auto mt-6 max-w-3xl rounded-2xl bg-white p-8 text-slate-800 shadow-float sm:p-12">
        <div className="flex items-start justify-between gap-4 border-b border-slate-200 pb-6">
          <div>
            <p className="text-xs font-semibold uppercase tracking-widest text-blue-600">Energy &amp; carbon summary</p>
            <h2 className="mt-1 font-display text-2xl font-semibold text-slate-900">{company?.name}</h2>
            <p className="mt-1 text-sm text-slate-500">Reporting year {company?.reporting_year} &middot; {company?.sector}</p>
          </div>
          <div className="text-right text-xs text-slate-400">
            <p>Generated {GENERATED}</p>
            <p>via ESGen</p>
          </div>
        </div>

        {/* Illustrative banner */}
        <div className="mt-6 rounded-lg border border-amber-300 bg-amber-50 p-4 text-sm text-amber-900">
          <strong>Illustrative summary, not a filed report.</strong> Figures are indicative and depend on the data
          entered and the reference conversion factors used. They are not audited and do not, on their own, make an
          organisation compliant. Confirm the current official factors and your reporting boundary with your advisers
          before any disclosure.
        </div>

        {/* Emissions */}
        <section className="mt-8">
          <h3 className="font-display text-base font-semibold text-slate-900">Greenhouse gas emissions</h3>
          <table className="mt-3 w-full text-sm">
            <tbody>
              {scopes.map((s) => (
                <tr key={s.scope} className="border-b border-slate-100">
                  <td className="py-2.5 text-slate-600">{s.label}</td>
                  <td className="py-2.5 text-right font-mono text-slate-900">{fmtTonnes(s.tco2e)} tCO2e</td>
                </tr>
              ))}
              <tr className="border-t-2 border-slate-300">
                <td className="py-2.5 font-semibold text-slate-900">Total</td>
                <td className="py-2.5 text-right font-mono font-semibold text-slate-900">{fmtTonnes(totalT)} tCO2e</td>
              </tr>
            </tbody>
          </table>
        </section>

        {/* Energy */}
        <section className="mt-8">
          <h3 className="font-display text-base font-semibold text-slate-900">Energy use</h3>
          <table className="mt-3 w-full text-sm">
            <tbody>
              <tr className="border-b border-slate-100">
                <td className="py-2.5 text-slate-600">Purchased electricity</td>
                <td className="py-2.5 text-right font-mono text-slate-900">{fmtNum(electricityKwh)} kWh</td>
              </tr>
              <tr className="border-b border-slate-100">
                <td className="py-2.5 text-slate-600">Natural gas</td>
                <td className="py-2.5 text-right font-mono text-slate-900">{fmtNum(gasKwh)} kWh</td>
              </tr>
              <tr className="border-t-2 border-slate-300">
                <td className="py-2.5 font-semibold text-slate-900">Metered energy total</td>
                <td className="py-2.5 text-right font-mono font-semibold text-slate-900">{fmtNum(meteredKwh)} kWh</td>
              </tr>
            </tbody>
          </table>
          {hasFuel && (
            <p className="mt-3 text-xs text-slate-500">
              Transport fuel is recorded by volume and is included in the emissions total above. To state total energy
              use in kWh, fuel volumes must be converted using calorific values, which this summary does not assume.
            </p>
          )}
        </section>

        {/* Intensity */}
        <section className="mt-8">
          <h3 className="font-display text-base font-semibold text-slate-900">Intensity ratio</h3>
          {intensity !== null ? (
            <p className="mt-2 text-sm text-slate-700">
              <span className="font-mono text-slate-900">{fmtTonnes(intensity)} tCO2e per employee</span>{" "}
              (based on {company?.employees} employees).
            </p>
          ) : (
            <p className="mt-2 text-sm text-slate-500">
              Add an employee count to your organisation profile to calculate an intensity ratio.
            </p>
          )}
        </section>

        {/* Methodology */}
        <section className="mt-8">
          <h3 className="font-display text-base font-semibold text-slate-900">Methodology</h3>
          <ul className="mt-2 space-y-1.5 text-sm text-slate-600">
            <li>Emissions estimated by multiplying recorded activity data by published conversion factors.</li>
            <li>Reference factors: {FACTORS_SOURCE_LABEL}. Location-based method used for electricity.</li>
            <li>Scope 3 covers business travel only in this summary; it is not a complete value-chain inventory.</li>
            <li>Prior-year comparison is not available where only one reporting year has been recorded.</li>
          </ul>
        </section>

        <footer className="mt-10 border-t border-slate-200 pt-4 text-xs text-slate-400">
          Prepared with ESGen. Supports preparation of energy and carbon reporting evidence; it does not constitute
          assurance or professional advice.
        </footer>
      </article>
    </div>
  );
}

function fmtNum(n: number): string {
  return Math.round(n).toLocaleString("en-GB");
}
