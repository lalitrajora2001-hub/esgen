"use client";

import { useState } from "react";
import { Button } from "@/components/ui/Button";
import { Field, isEmail } from "@/components/forms/fields";
import { site } from "@/lib/nav";

const AREAS = ["Carbon accounting", "ESG reporting", "Supplier assessment", "Compliance support", "Advisory support", "Partnership", "Something else"];

export function ContactForm() {
  const [v, setV] = useState({ name: "", email: "", company: "", interest: AREAS[0], message: "" });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [sent, setSent] = useState(false);
  const set = (k: keyof typeof v) => (val: string) => setV((s) => ({ ...s, [k]: val }));

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    const err: Record<string, string> = {};
    if (!v.name.trim()) err.name = "Please enter your name.";
    if (!isEmail(v.email)) err.email = "Please enter a valid email address.";
    if (!v.company.trim()) err.company = "Please enter your company.";
    if (!v.message.trim()) err.message = "Please add a short message.";
    setErrors(err);
    if (Object.keys(err).length === 0) setSent(true);
  };

  if (sent) {
    return (
      <div className="rounded-2xl border border-teal/40 bg-[rgba(67,198,183,0.1)] p-8" role="status" aria-live="polite">
        <p className="font-display text-lg font-semibold text-white">Thank you for getting in touch.</p>
        <p className="mt-2 text-text-muted">We will reply as soon as we can. You can also email us directly at <a href={`mailto:${site.email}`} className="text-accent-3">{site.email}</a>.</p>
      </div>
    );
  }

  return (
    <form onSubmit={submit} noValidate aria-label="Contact form" className="space-y-5">
      <div className="grid gap-5 sm:grid-cols-2">
        <Field id="name" label="Name" required autoComplete="name" value={v.name} onChange={set("name")} error={errors.name} />
        <Field id="email" label="Work email" type="email" inputMode="email" required autoComplete="email" value={v.email} onChange={set("email")} error={errors.email} />
      </div>
      <div className="grid gap-5 sm:grid-cols-2">
        <Field id="company" label="Company" required autoComplete="organization" value={v.company} onChange={set("company")} error={errors.company} />
        <Field id="interest" label="Area of interest" as="select" value={v.interest} onChange={set("interest")} options={AREAS} />
      </div>
      <Field id="message" label="Message" as="textarea" required value={v.message} onChange={set("message")} error={errors.message} placeholder="How can we help?" />
      <Button type="submit" size="lg" className="w-full">Send message</Button>
      <p className="text-sm text-text-muted">Or email us at <a href={`mailto:${site.email}`} className="text-accent-3 hover:underline">{site.email}</a>.</p>
    </form>
  );
}
