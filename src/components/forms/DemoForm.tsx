"use client";

import { useState } from "react";
import { Button } from "@/components/ui/Button";
import { Field, isEmail } from "@/components/forms/fields";
import { site } from "@/lib/nav";

const AREAS = [
  "ESG Data Management", "GHG Accounting", "CSRD Automation", "Supplier Assessment",
  "BRSR Automation", "CBAM Automation", "Advisory Services", "Audit Services",
  "Compliance Services", "Partner Program",
];

export function DemoForm() {
  const [v, setV] = useState({ name: "", email: "", company: "", role: "", size: "1 to 50", interest: AREAS[0], message: "" });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [sent, setSent] = useState(false);
  const set = (k: keyof typeof v) => (val: string) => setV((s) => ({ ...s, [k]: val }));

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    const err: Record<string, string> = {};
    if (!v.name.trim()) err.name = "Please enter your name.";
    if (!isEmail(v.email)) err.email = "Please enter a valid email address.";
    if (!v.company.trim()) err.company = "Please enter your company.";
    setErrors(err);
    if (Object.keys(err).length === 0) setSent(true);
  };

  if (sent) {
    return (
      <div className="rounded-2xl border border-teal/40 bg-[rgba(67,198,183,0.1)] p-8" role="status" aria-live="polite">
        <p className="font-display text-lg font-semibold text-white">Thank you. Your request has been received.</p>
        <p className="mt-2 text-text-muted">A member of the ESGen team will be in touch to arrange your demo. You can also reach us at <a href={`mailto:${site.email}`} className="text-accent-3">{site.email}</a>.</p>
      </div>
    );
  }

  return (
    <form onSubmit={submit} noValidate aria-label="Request a demo" className="space-y-5">
      <div className="grid gap-5 sm:grid-cols-2">
        <Field id="name" label="Full name" required autoComplete="name" value={v.name} onChange={set("name")} error={errors.name} />
        <Field id="email" label="Work email" type="email" inputMode="email" required autoComplete="email" value={v.email} onChange={set("email")} error={errors.email} />
      </div>
      <div className="grid gap-5 sm:grid-cols-2">
        <Field id="company" label="Company" required autoComplete="organization" value={v.company} onChange={set("company")} error={errors.company} />
        <Field id="role" label="Role" autoComplete="organization-title" value={v.role} onChange={set("role")} />
      </div>
      <div className="grid gap-5 sm:grid-cols-2">
        <Field id="size" label="Company size" as="select" value={v.size} onChange={set("size")} options={["1 to 50", "51 to 250", "251 to 1000", "1000+"]} />
        <Field id="interest" label="Area of interest" as="select" value={v.interest} onChange={set("interest")} options={AREAS} />
      </div>
      <Field id="message" label="How can we help?" as="textarea" value={v.message} onChange={set("message")} placeholder="Tell us a little about your reporting needs." />
      <Button type="submit" size="lg" className="w-full">Request a demo</Button>
      <p className="text-sm text-text-muted">Prefer email? Reach us at <a href={`mailto:${site.email}`} className="text-accent-3 hover:underline">{site.email}</a>.</p>
    </form>
  );
}
