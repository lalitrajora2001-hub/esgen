import type { Metadata } from "next";
import { Section } from "@/components/ui/Section";
import { RBreadcrumb, RCta } from "@/components/resources/light";

export const metadata: Metadata = {
  title: "Carbon Accounting Basics",
  description: "What carbon accounting is, how Scope 1, 2, and 3 work, and why activity data, emission factors, and evidence matter.",
};

const SCOPES = [
  { tag: "Scope 1", shade: "#101318", title: "Direct emissions", body: "Sources you own or control, such as company vehicles and on-site fuel combustion." },
  { tag: "Scope 2", shade: "#565d68", title: "Purchased energy", body: "Indirect emissions from the electricity, steam, heating, and cooling you buy." },
  { tag: "Scope 3", shade: "#9aa1ab", title: "Value chain", body: "All other indirect emissions across 15 categories, upstream and downstream. Usually the largest." },
];

const sections = [
  { h: "What is carbon accounting?", p: "Carbon accounting is the process of measuring the greenhouse gas emissions linked to an organisation's activities, expressed in tonnes of carbon dioxide equivalent (tCO₂e). It gives you a baseline to understand your footprint and act on it." },
  { h: "Activity data", p: "Activity data is the underlying information about activities that generate emissions, such as energy use, fuel, business travel, and purchased goods. Good carbon accounting starts with collecting this data reliably and knowing where it came from." },
  { h: "Emission factors", p: "Emission factors convert activity data into emissions. For example, a factor turns litres of fuel or kilowatt hours of electricity into tCO₂e. Using recognised, up-to-date factors keeps your figures credible." },
  { h: "tCO₂e", p: "Different greenhouse gases have different warming effects, so emissions are expressed in a common unit: tonnes of carbon dioxide equivalent. This lets you add up and compare emissions across sources." },
  { h: "Why evidence matters", p: "Reporting only helps if people believe the figures. Keeping evidence connected to each number, with a clear method and owner, means you can answer questions from auditors, customers, and investors with confidence." },
  { h: "Why data quality matters", p: "The quality of your footprint depends on the quality of your data. Validation, clear ownership, and consistent methods reduce errors and make reporting repeatable year after year." },
];

export default function BasicsPage() {
  return (
    <div className="bg-white">
      <section className="relative overflow-hidden pt-28 pb-6 sm:pt-36">
        <div aria-hidden className="pointer-events-none absolute inset-0" style={{ background: "radial-gradient(900px 460px at 50% -10%, rgba(16,19,24,0.05), transparent 60%)" }} />
        <div className="relative mx-auto max-w-6xl px-5 sm:px-6">
          <RBreadcrumb trail={[{ label: "Home", href: "/" }, { label: "Resources", href: "/resources" }, { label: "Carbon Accounting Basics" }]} />
          <div className="max-w-2xl">
            <h1 className="text-balance text-4xl font-semibold leading-[1.05] text-[#101318] sm:text-5xl">Carbon accounting, from the ground up</h1>
            <p className="mt-5 max-w-xl text-lg text-[#565d68]">A plain-English introduction to how emissions are measured, and why the quality of your data and evidence decides everything downstream.</p>
          </div>
        </div>
      </section>

      <Section className="bg-[#f6f7f9]">
        <div className="mx-auto max-w-3xl">
          <h2 className="text-2xl font-semibold text-[#101318] sm:text-3xl">The three scopes</h2>
          <p className="mt-3 text-[#565d68]">Under the GHG Protocol, emissions are grouped into three scopes. Scope 1 covers direct emissions from sources you own or control. Scope 2 covers purchased energy. Scope 3 covers all other indirect emissions across your value chain, and is usually the largest.</p>
          <div className="mt-8 grid gap-4 sm:grid-cols-3">
            {SCOPES.map((s) => (
              <div key={s.tag} className="rounded-2xl border border-[#e6e8ec] bg-white p-5">
                <div className="flex items-center gap-2">
                  <span className="h-3 w-3 rounded-full" style={{ background: s.shade }} />
                  <span className="font-mono text-xs uppercase tracking-wider" style={{ color: s.shade }}>{s.tag}</span>
                </div>
                <h3 className="mt-3 font-display text-lg font-semibold text-[#101318]">{s.title}</h3>
                <p className="mt-2 text-sm text-[#565d68]">{s.body}</p>
              </div>
            ))}
          </div>
          <div className="mt-12 space-y-10">
            {sections.map((s) => (
              <div key={s.h}>
                <h2 className="text-2xl font-semibold text-[#101318] sm:text-3xl">{s.h}</h2>
                <p className="mt-3 text-[#565d68]">{s.p}</p>
              </div>
            ))}
          </div>
        </div>
      </Section>

      <RCta title="Ready to measure your footprint?" />
    </div>
  );
}
