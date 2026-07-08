"use client";

import { useState } from "react";
import { Button } from "@/components/ui/Button";
import { Field, isEmail } from "@/components/forms/fields";

type Errors = Partial<Record<"firstName" | "lastName" | "email" | "company" | "message", string>>;

/** Contact form UI. Client-side validation only. No real submission endpoint is wired. */
export function ContactForm() {
  const [v, setV] = useState({ firstName: "", lastName: "", email: "", company: "", interest: "A platform demo", message: "" });
  const [errors, setErrors] = useState<Errors>({});
  const [sent, setSent] = useState(false);
  const set = (k: keyof typeof v) => (val: string) => setV((s) => ({ ...s, [k]: val }));

  const validate = (): Errors => {
    const e: Errors = {};
    if (!v.firstName.trim()) e.firstName = "Please enter your first name.";
    if (!v.lastName.trim()) e.lastName = "Please enter your last name.";
    if (!v.email.trim()) e.email = "Please enter your email.";
    else if (!isEmail(v.email)) e.email = "Please enter a valid email address.";
    if (!v.company.trim()) e.company = "Please enter your company.";
    if (!v.message.trim()) e.message = "Please add a short message.";
    return e;
  };

  const submit = (ev: React.FormEvent) => {
    ev.preventDefault();
    const e = validate();
    setErrors(e);
    if (Object.keys(e).length === 0) setSent(true);
  };

  if (sent) {
    return (
      <div className="rounded-2xl border border-[#3fb6a8]/40 bg-[rgba(63,182,168,0.1)] p-8" role="status" aria-live="polite">
        <p className="font-display text-lg font-semibold text-[#b8f0ea]">Thanks, your message is on its way.</p>
        <p className="mt-2 text-text-muted">We will be in touch within one business day. This is a demo form, so no message was actually sent.</p>
      </div>
    );
  }

  return (
    <form onSubmit={submit} noValidate aria-label="Contact form" className="space-y-5">
      <div className="grid gap-5 sm:grid-cols-2">
        <Field id="firstName" label="First name" required autoComplete="given-name" value={v.firstName} onChange={set("firstName")} error={errors.firstName} />
        <Field id="lastName" label="Last name" required autoComplete="family-name" value={v.lastName} onChange={set("lastName")} error={errors.lastName} />
      </div>
      <Field id="email" label="Work email" type="email" inputMode="email" required autoComplete="email" value={v.email} onChange={set("email")} error={errors.email} />
      <div className="grid gap-5 sm:grid-cols-2">
        <Field id="company" label="Company" required autoComplete="organization" value={v.company} onChange={set("company")} error={errors.company} />
        <Field id="interest" label="I am interested in" as="select" value={v.interest} onChange={set("interest")} options={["A platform demo", "Asking a question", "CSRD readiness", "SECR help", "Partnerships", "Something else"]} />
      </div>
      <Field id="message" label="How can we help?" as="textarea" required value={v.message} onChange={set("message")} error={errors.message} placeholder="A sentence or two about where you are is plenty to get started." />
      <Button type="submit" size="lg" className="w-full">Send message</Button>
      <p className="font-mono text-xs text-text-muted/60">Demo only. Integration point: wire to your email provider or CRM.</p>
    </form>
  );
}
