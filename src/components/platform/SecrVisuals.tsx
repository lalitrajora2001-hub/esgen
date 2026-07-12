"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { GK } from "@/components/platform/CarbonVisuals";

const INK = "#0f1720", MUTED = "#6b7280";

/* ============================================================
   ELIGIBILITY CHECKER
   Large unquoted companies and LLPs meet SECR's size test if they
   satisfy at least two of three criteria. Quoted companies are in
   scope regardless of size. Indicative only.
   ============================================================ */
const TURNOVER = 36_000_000;
const BALANCE = 18_000_000;
const EMPLOYEES = 250;

/* Hoisted: defining this inside EligibilityChecker would make it a new
   component type on every render, remounting the slider mid-drag. */
function Field({ label, value, set, min, max, step, fmt }: { label: string; value: number; set: (n: number) => void; min: number; max: number; step: number; fmt: (n: number) => string }) {
  return (
    <div>
      <div className="flex items-baseline justify-between">
        <label className="text-[0.76rem] font-semibold" style={{ color: INK }}>{label}</label>
        <span className="font-mono text-[0.8rem] font-bold tabular-nums" style={{ color: GK.greenDk }}>{fmt(value)}</span>
      </div>
      <input type="range" min={min} max={max} step={step} value={value} onChange={(e) => set(+e.target.value)} aria-label={label}
        className="mt-2 h-1.5 w-full cursor-ew-resize appearance-none rounded-full bg-[#e6ece7]
          [&::-webkit-slider-thumb]:h-4 [&::-webkit-slider-thumb]:w-4 [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:border-2 [&::-webkit-slider-thumb]:border-white [&::-webkit-slider-thumb]:bg-[#15803d] [&::-webkit-slider-thumb]:shadow
          [&::-moz-range-thumb]:h-4 [&::-moz-range-thumb]:w-4 [&::-moz-range-thumb]:rounded-full [&::-moz-range-thumb]:border-2 [&::-moz-range-thumb]:border-white [&::-moz-range-thumb]:bg-[#15803d]" />
    </div>
  );
}

export function EligibilityChecker() {
  const [quoted, setQuoted] = useState(false);
  const [turnover, setTurnover] = useState(42);
  const [balance, setBalance] = useState(14);
  const [staff, setStaff] = useState(310);
  const [lowEnergy, setLowEnergy] = useState(false);

  const tests = [
    { k: "Turnover", pass: turnover * 1_000_000 >= TURNOVER, shown: `£${turnover}m`, need: "£36m or more" },
    { k: "Balance sheet total", pass: balance * 1_000_000 >= BALANCE, shown: `£${balance}m`, need: "£18m or more" },
    { k: "Employees", pass: staff >= EMPLOYEES, shown: `${staff}`, need: "250 or more" },
  ];
  const met = tests.filter((t) => t.pass).length;
  const inScope = quoted || met >= 2;
  const exempt = inScope && !quoted && lowEnergy;

  const verdict = exempt
    ? { t: "In scope, but likely a low energy user", d: "Organisations consuming 40,000 kWh or less over the reporting period may state that, rather than making the full disclosures.", tone: "amber" as const }
    : inScope
      ? { t: quoted ? "In scope, quoted company" : "In scope, meets the size test", d: quoted ? "Quoted companies report regardless of size, including global energy use and emissions." : `You meet ${met} of the three criteria. Two or more brings a large unquoted company or LLP into scope.`, tone: "green" as const }
      : { t: "Likely out of scope", d: `You meet ${met} of the three criteria. A large unquoted company or LLP needs at least two.`, tone: "grey" as const };

  const TONE = {
    green: { bg: "#f1f7f3", fg: GK.greenDk, bar: GK.green },
    amber: { bg: "#f5f2e8", fg: "#6b6242", bar: "#b3a86a" },
    grey: { bg: "#f4f6f5", fg: MUTED, bar: "#cfd8d3" },
  }[verdict.tone];

  return (
    <div className="overflow-hidden rounded-2xl border border-[#e6ece7] bg-white shadow-[0_40px_80px_-40px_rgba(16,80,50,0.4)]">
      <div className="border-b border-[#eef1ef] px-5 py-3">
        <span className="text-[0.66rem] font-bold uppercase tracking-[0.12em]" style={{ color: MUTED }}>Am I in scope for SECR?</span>
      </div>

      <div className="grid lg:grid-cols-[1fr_0.9fr]">
        <div className="space-y-5 p-5">
          <label className="flex cursor-pointer items-center justify-between rounded-xl border border-[#e6ece7] px-3.5 py-3">
            <span className="text-[0.8rem] font-semibold" style={{ color: INK }}>Quoted company</span>
            <button role="switch" aria-checked={quoted} onClick={() => setQuoted(!quoted)} aria-label="Quoted company"
              className="relative h-5 w-9 rounded-full transition-colors" style={{ background: quoted ? GK.greenDk : "#cfd8d3" }}>
              <motion.span className="absolute top-0.5 h-4 w-4 rounded-full bg-white shadow" animate={{ left: quoted ? 18 : 2 }} transition={{ type: "spring", stiffness: 500, damping: 34 }} />
            </button>
          </label>

          <div className={quoted ? "pointer-events-none space-y-5 opacity-40" : "space-y-5"}>
            <Field label="Annual turnover" value={turnover} set={setTurnover} min={0} max={120} step={1} fmt={(n) => `£${n}m`} />
            <Field label="Balance sheet total" value={balance} set={setBalance} min={0} max={60} step={1} fmt={(n) => `£${n}m`} />
            <Field label="Employees" value={staff} set={setStaff} min={0} max={800} step={10} fmt={(n) => `${n}`} />
          </div>

          <label className="flex cursor-pointer items-center justify-between rounded-xl border border-[#e6ece7] px-3.5 py-3">
            <span className="min-w-0 pr-3 text-[0.8rem] font-semibold" style={{ color: INK }}>Energy use of 40,000 kWh or less</span>
            <button role="switch" aria-checked={lowEnergy} onClick={() => setLowEnergy(!lowEnergy)} aria-label="Low energy user"
              className="relative h-5 w-9 shrink-0 rounded-full transition-colors" style={{ background: lowEnergy ? GK.greenDk : "#cfd8d3" }}>
              <motion.span className="absolute top-0.5 h-4 w-4 rounded-full bg-white shadow" animate={{ left: lowEnergy ? 18 : 2 }} transition={{ type: "spring", stiffness: 500, damping: 34 }} />
            </button>
          </label>
        </div>

        <div className="border-t border-[#eef1ef] p-5 lg:border-l lg:border-t-0">
          {!quoted && (
            <div className="space-y-2.5">
              {tests.map((t) => (
                <div key={t.k} className="flex items-center gap-2.5">
                  <span className="grid h-5 w-5 shrink-0 place-items-center rounded-full" style={{ background: t.pass ? GK.greenDk : "#e6ece7" }}>
                    {t.pass
                      ? <svg viewBox="0 0 24 24" className="h-3 w-3" fill="none" stroke="#fff" strokeWidth="3.4" strokeLinecap="round"><path d="M5 13l4 4L19 7" /></svg>
                      : <svg viewBox="0 0 24 24" className="h-3 w-3" fill="none" stroke="#9aa5a0" strokeWidth="3" strokeLinecap="round"><path d="M6 6l12 12M18 6L6 18" /></svg>}
                  </span>
                  <span className="min-w-0 flex-1 truncate text-[0.74rem]" style={{ color: INK }}>{t.k}</span>
                  <span className="shrink-0 text-[0.62rem]" style={{ color: MUTED }}>needs {t.need}</span>
                </div>
              ))}
              <div className="flex items-center gap-2 pt-1">
                <div className="h-1.5 flex-1 overflow-hidden rounded-full bg-[#eef1ef]">
                  <div className="h-full rounded-full motion-safe:transition-[width] motion-safe:duration-400" style={{ width: `${(met / 3) * 100}%`, background: met >= 2 ? GK.green : "#cfd8d3" }} />
                </div>
                <span className="font-mono text-[0.62rem] font-bold tabular-nums" style={{ color: met >= 2 ? GK.greenDk : MUTED }}>{met}/3</span>
              </div>
            </div>
          )}

          <motion.div key={verdict.t} initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.2 }}
            className="mt-4 rounded-xl p-4" style={{ background: TONE.bg }}>
            <div className="h-1 w-10 rounded-full" style={{ background: TONE.bar }} />
            <h4 className="mt-3 font-display text-[0.95rem] font-bold leading-tight" style={{ color: INK }}>{verdict.t}</h4>
            <p className="mt-2 text-[0.76rem] leading-relaxed" style={{ color: MUTED }}>{verdict.d}</p>
          </motion.div>
          <p className="mt-3 text-[0.6rem] leading-relaxed" style={{ color: MUTED }}>Indicative only, based on the published size criteria. It is not legal advice, confirm your position with your advisers.</p>
        </div>
      </div>
    </div>
  );
}

/* ============================================================
   REPORT COMPOSER, toggle the required disclosures and watch
   the report page assemble.
   ============================================================ */
const PARTS: { k: string; label: string; required: boolean; line: string }[] = [
  { k: "energy", label: "UK energy use in kWh", required: true, line: "Total energy consumed: 4,182,600 kWh" },
  { k: "s12", label: "Scope 1 and Scope 2 emissions", required: true, line: "Scope 1: 512 tCO₂e · Scope 2: 388 tCO₂e" },
  { k: "intensity", label: "At least one intensity ratio", required: true, line: "Intensity: 21.4 tCO₂e per £m turnover" },
  { k: "method", label: "Methodology used", required: true, line: "Method: GHG Protocol, location-based Scope 2" },
  { k: "actions", label: "Energy efficiency actions taken", required: true, line: "Actions: LED retrofit, HVAC controls, driver training" },
  { k: "prior", label: "Prior year comparatives", required: false, line: "Prior year: 968 tCO₂e (Scope 1 and 2)" },
];

export function ReportComposer() {
  const [on, setOn] = useState<Record<string, boolean>>(() => Object.fromEntries(PARTS.map((p) => [p.k, p.required])));
  const required = PARTS.filter((p) => p.required);
  const doneReq = required.filter((p) => on[p.k]).length;
  const complete = doneReq === required.length;

  return (
    <div className="grid gap-5 lg:grid-cols-2">
      <div className="rounded-2xl border border-[#e6ece7] bg-white p-5">
        <div className="flex items-center justify-between gap-2">
          <h3 className="font-display text-[0.95rem] font-bold" style={{ color: INK }}>Required disclosures</h3>
          <span className="shrink-0 rounded-full px-2 py-0.5 text-[0.58rem] font-bold tabular-nums" style={{ background: complete ? "#f1f7f3" : "#f4f6f5", color: complete ? GK.greenDk : MUTED }}>{doneReq}/{required.length}</span>
        </div>
        <div className="mt-3 space-y-1">
          {PARTS.map((p) => (
            <button key={p.k} onClick={() => setOn((s) => ({ ...s, [p.k]: !s[p.k] }))} aria-pressed={!!on[p.k]}
              className="flex w-full items-center gap-2.5 rounded-lg px-2 py-2 text-left transition-colors hover:bg-[#f7faf8] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-1 focus-visible:outline-[#16a34a]">
              <span className="grid h-4 w-4 shrink-0 place-items-center rounded border" style={{ background: on[p.k] ? GK.greenDk : "#fff", borderColor: on[p.k] ? GK.greenDk : "#cfd8d3" }}>
                {on[p.k] && <svg viewBox="0 0 24 24" className="h-2.5 w-2.5" fill="none" stroke="#fff" strokeWidth="4" strokeLinecap="round"><path d="M5 13l4 4L19 7" /></svg>}
              </span>
              <span className="min-w-0 flex-1 text-[0.78rem]" style={{ color: on[p.k] ? INK : "#9aa5a0" }}>{p.label}</span>
              {!p.required && <span className="shrink-0 rounded bg-[#f4f6f5] px-1.5 py-0.5 text-[0.5rem] font-bold" style={{ color: MUTED }}>optional</span>}
            </button>
          ))}
        </div>
      </div>

      <div className="overflow-hidden rounded-2xl bg-[#0d1411] p-5">
        <div className="flex items-center justify-between">
          <span className="text-[0.6rem] font-bold uppercase tracking-[0.12em] text-white/40">Directors&rsquo; report extract</span>
          <span className="rounded-full px-2 py-0.5 text-[0.55rem] font-bold" style={{ background: complete ? GK.green : "rgba(255,255,255,0.1)", color: complete ? "#0d1411" : "rgba(255,255,255,0.5)" }}>{complete ? "all required parts present" : "incomplete"}</span>
        </div>
        <div className="mt-4 space-y-2">
          {PARTS.filter((p) => on[p.k]).map((p) => (
            <motion.div key={p.k} initial={{ opacity: 0, x: -6 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.22 }}
              className="rounded-lg bg-white/[0.05] px-3 py-2 font-mono text-[0.68rem] text-white/85 ring-1 ring-white/10">{p.line}</motion.div>
          ))}
          {PARTS.filter((p) => on[p.k]).length === 0 && <p className="py-6 text-center text-[0.72rem] text-white/35">Select a disclosure to build the extract.</p>}
        </div>
        <p className="mt-4 text-[0.58rem] text-white/35">Figures are illustrative.</p>
      </div>
    </div>
  );
}
