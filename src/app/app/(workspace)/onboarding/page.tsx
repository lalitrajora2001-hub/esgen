"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useCompany } from "@/components/tool/CompanyProvider";
import { createCompany } from "@/lib/tool/db";
import { Button } from "@/components/ui/Button";
import { Field } from "@/components/forms/fields";
import { Logo } from "@/components/logo/Logo";
import { SECTORS } from "@/lib/tool/types";

const THIS_YEAR = 2026;
const YEARS = [THIS_YEAR, THIS_YEAR - 1, THIS_YEAR - 2].map(String);

export default function OnboardingPage() {
  const { company, setCompany } = useCompany();
  const router = useRouter();
  const [v, setV] = useState({
    name: "",
    sector: SECTORS[0] as string,
    reporting_year: String(THIS_YEAR),
    employees: "",
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [formError, setFormError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);
  const set = (k: keyof typeof v) => (val: string) => setV((s) => ({ ...s, [k]: val }));

  // If a company already exists, this page is not needed.
  useEffect(() => {
    if (company) router.replace("/app");
  }, [company, router]);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError(null);
    const err: Record<string, string> = {};
    if (v.name.trim().length < 2) err.name = "Enter your organisation name.";
    if (v.employees && Number(v.employees) < 0) err.employees = "Enter a positive number.";
    setErrors(err);
    if (Object.keys(err).length) return;

    setBusy(true);
    try {
      const created = await createCompany({
        name: v.name.trim(),
        sector: v.sector,
        reporting_year: Number(v.reporting_year),
        employees: v.employees ? Number(v.employees) : null,
      });
      setCompany(created);
      router.replace("/app");
    } catch (e) {
      setFormError(e instanceof Error ? e.message : "Could not create your workspace.");
      setBusy(false);
    }
  };

  return (
    <section className="app-light grid min-h-screen place-items-center bg-canvas px-5 py-16 text-text">
      <div className="w-full max-w-lg">
        <div className="mb-6">
          <Logo className="mb-6 h-11 text-[#101828]" />
          <p className="eyebrow eyebrow--plain">Step 1 of 1</p>
          <h1 className="mt-3 text-2xl font-semibold sm:text-3xl">Set up your organisation</h1>
          <p className="mt-2 text-sm text-text-muted">
            This defines the reporting entity for your BRSR report. You can start entering disclosures next.
          </p>
        </div>

        <form onSubmit={submit} noValidate className="card space-y-5 p-6 sm:p-8">
          <Field id="name" label="Organisation name" required value={v.name} onChange={set("name")} error={errors.name} placeholder="e.g. Acme Manufacturing Ltd" />
          <Field id="sector" label="Sector" as="select" options={[...SECTORS]} value={v.sector} onChange={set("sector")} />
          <div className="grid gap-5 sm:grid-cols-2">
            <Field id="reporting_year" label="Reporting year" as="select" options={YEARS} value={v.reporting_year} onChange={set("reporting_year")} />
            <Field id="employees" label="Employees (optional)" type="text" inputMode="numeric" value={v.employees} onChange={set("employees")} error={errors.employees} placeholder="e.g. 48" />
          </div>
          {formError && (
            <p className="rounded-xl border border-[#ff7a7a]/30 bg-[#ff7a7a]/8 p-3 text-sm text-[#ffb4b4]" role="alert">
              {formError}
            </p>
          )}
          <Button type="submit" size="lg" className="w-full" disabled={busy}>
            {busy ? "Creating workspace..." : "Create workspace"}
          </Button>
        </form>
      </div>
    </section>
  );
}
