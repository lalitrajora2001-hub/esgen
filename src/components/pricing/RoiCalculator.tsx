"use client";

import { useMemo, useState } from "react";

/** ROI calculator UI. All figures are illustrative estimates, not a quote or promise. */
export function RoiCalculator() {
  const [employees, setEmployees] = useState(120);
  const [hoursPerMonth, setHoursPerMonth] = useState(40);
  const [hourlyCost, setHourlyCost] = useState(35);
  const [reduction, setReduction] = useState(60);

  const result = useMemo(() => {
    const savedHours = (hoursPerMonth * reduction) / 100;
    const monthly = savedHours * hourlyCost;
    const yearly = monthly * 12;
    return { savedHours: Math.round(savedHours), monthly: Math.round(monthly), yearly: Math.round(yearly) };
  }, [hoursPerMonth, hourlyCost, reduction]);

  const gbp = (n: number) => "£" + n.toLocaleString("en-GB");

  const Row = ({ label, value, min, max, step, onChange, suffix }: { label: string; value: number; min: number; max: number; step: number; onChange: (n: number) => void; suffix?: string }) => (
    <div>
      <div className="mb-2 flex items-center justify-between">
        <label className="text-sm text-text-muted">{label}</label>
        <span className="font-mono text-sm text-text">{value}{suffix}</span>
      </div>
      <input type="range" min={min} max={max} step={step} value={value} onChange={(e) => onChange(Number(e.target.value))} className="w-full accent-[#4d8bf5]" aria-label={label} />
    </div>
  );

  return (
    <div className="grid gap-8 rounded-2xl border border-border bg-gradient-to-b from-surface to-canvas p-6 sm:p-8 lg:grid-cols-2">
      <div className="space-y-6">
        <Row label="Employees" value={employees} min={5} max={2000} step={5} onChange={setEmployees} />
        <Row label="Hours spent on reporting each month" value={hoursPerMonth} min={5} max={160} step={5} onChange={setHoursPerMonth} suffix="h" />
        <Row label="Blended hourly cost" value={hourlyCost} min={15} max={120} step={5} onChange={setHourlyCost} suffix=" £" />
        <Row label="Time saved with ESGen" value={reduction} min={10} max={80} step={5} onChange={setReduction} suffix="%" />
      </div>
      <div className="flex flex-col justify-center rounded-2xl border border-accent/25 bg-[rgba(77,139,245,0.06)] p-6">
        <p className="mono-label">Estimated saving</p>
        <p className="mt-3 font-display text-5xl font-semibold text-accent-3">{gbp(result.yearly)}</p>
        <p className="mt-1 text-text-muted">per year, illustrative</p>
        <div className="mt-6 space-y-2 text-sm text-text-muted">
          <div className="flex justify-between"><span>Hours saved each month</span><span className="font-mono text-text">{result.savedHours}h</span></div>
          <div className="flex justify-between"><span>Saving each month</span><span className="font-mono text-text">{gbp(result.monthly)}</span></div>
        </div>
        <p className="mt-6 font-mono text-xs text-text-muted/60">Illustrative estimate only. Not a quote or a guarantee of savings.</p>
      </div>
    </div>
  );
}
