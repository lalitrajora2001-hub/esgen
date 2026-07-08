"use client";

import { useState } from "react";
import { Button } from "@/components/ui/Button";
import { Field, isEmail } from "@/components/forms/fields";

/** Demo booking UI. Client-side validation only. No calendar or backend is wired. */
export function DemoForm() {
  const [v, setV] = useState({ name: "", email: "", company: "", size: "1 to 50", slot: "" });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [sent, setSent] = useState(false);
  const set = (k: keyof typeof v) => (val: string) => setV((s) => ({ ...s, [k]: val }));

  const slots = ["Mon 10:00", "Mon 14:00", "Tue 11:00", "Wed 09:30", "Thu 15:00", "Fri 13:00"];

  const submit = (ev: React.FormEvent) => {
    ev.preventDefault();
    const e: Record<string, string> = {};
    if (!v.name.trim()) e.name = "Please enter your name.";
    if (!isEmail(v.email)) e.email = "Please enter a valid email address.";
    if (!v.company.trim()) e.company = "Please enter your company.";
    if (!v.slot) e.slot = "Please choose a time.";
    setErrors(e);
    if (Object.keys(e).length === 0) setSent(true);
  };

  if (sent) {
    return (
      <div className="rounded-2xl border border-[#3fb6a8]/40 bg-[rgba(63,182,168,0.1)] p-8" role="status" aria-live="polite">
        <p className="font-display text-lg font-semibold text-[#b8f0ea]">Your demo is booked.</p>
        <p className="mt-2 text-text-muted">We will send a calendar invite to {v.email || "your email"}. This is a demo form, so nothing was actually scheduled.</p>
      </div>
    );
  }

  return (
    <form onSubmit={submit} noValidate aria-label="Book a demo" className="space-y-5">
      <Field id="name" label="Full name" required autoComplete="name" value={v.name} onChange={set("name")} error={errors.name} />
      <Field id="email" label="Work email" type="email" inputMode="email" required autoComplete="email" value={v.email} onChange={set("email")} error={errors.email} />
      <div className="grid gap-5 sm:grid-cols-2">
        <Field id="company" label="Company" required autoComplete="organization" value={v.company} onChange={set("company")} error={errors.company} />
        <Field id="size" label="Company size" as="select" value={v.size} onChange={set("size")} options={["1 to 50", "51 to 250", "251 to 1000", "1000+"]} />
      </div>
      <div>
        <p className="mb-2 font-display text-sm font-medium">Pick a time <span className="text-accent-3">*</span></p>
        <div className="grid grid-cols-2 gap-2 sm:grid-cols-3">
          {slots.map((s) => (
            <button key={s} type="button" onClick={() => set("slot")(s)} className={`rounded-xl border px-3 py-2.5 text-sm transition ${v.slot === s ? "border-accent bg-accent/15 text-text" : "border-border text-text-muted hover:border-accent/50"}`}>
              {s}
            </button>
          ))}
        </div>
        {errors.slot && <p className="mt-2 text-sm text-[#ff7a7a]" role="alert">{errors.slot}</p>}
        <p className="mt-2 font-mono text-xs text-text-muted/60">Illustrative slots. Integration point: connect a real scheduling tool.</p>
      </div>
      <Button type="submit" size="lg" className="w-full">Confirm demo</Button>
    </form>
  );
}
