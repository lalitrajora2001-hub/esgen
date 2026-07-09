"use client";

import { motion, useReducedMotion } from "framer-motion";

/* ---- primitives ---- */

function Win({ title, children, className }: { title: string; children: React.ReactNode; className?: string }) {
  return (
    <div className={`window ${className ?? ""}`}>
      <div className="window__bar">
        <span className="window__dot" /><span className="window__dot" /><span className="window__dot" />
        <span className="ml-2 font-mono text-[0.68rem] text-text-muted">{title}</span>
      </div>
      <div className="p-4 sm:p-5">{children}</div>
    </div>
  );
}

function Bars({ data, unit = "" }: { data: number[]; unit?: string }) {
  const reduce = useReducedMotion();
  const max = Math.max(...data);
  return (
    <div className="flex h-28 items-end gap-2" aria-hidden>
      {data.map((v, i) => (
        <motion.div
          key={i}
          className="flex-1 rounded-t-md bg-gradient-to-t from-accent-2 to-accent-3"
          style={{ height: `${(v / max) * 100}%`, transformOrigin: "bottom" }}
          initial={reduce ? false : { scaleY: 0 }}
          whileInView={reduce ? undefined : { scaleY: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.05 * i, ease: [0.16, 1, 0.3, 1] }}
        />
      ))}
      <span className="sr-only">{unit}</span>
    </div>
  );
}

function Progress({ value, tone = "blue" }: { value: number; tone?: "blue" | "teal" | "amber" }) {
  const reduce = useReducedMotion();
  const color = tone === "teal" ? "var(--color-teal)" : tone === "amber" ? "#e0a94a" : "var(--color-accent)";
  return (
    <div className="h-1.5 w-full overflow-hidden rounded-full bg-white/[0.06]">
      <motion.div className="h-full rounded-full" style={{ background: color }} initial={reduce ? false : { width: 0 }} whileInView={reduce ? undefined : { width: `${value}%` }} viewport={{ once: true }} transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1] }} />
    </div>
  );
}

function Chip({ children, tone = "muted" }: { children: React.ReactNode; tone?: "muted" | "blue" | "teal" | "amber" }) {
  const cls =
    tone === "blue" ? "border-accent/30 text-accent-3 bg-accent/10"
    : tone === "teal" ? "border-teal/30 text-teal bg-[rgba(67,198,183,0.1)]"
    : tone === "amber" ? "border-[#e0a94a]/30 text-[#e0a94a] bg-[rgba(224,169,74,0.1)]"
    : "border-border text-text-muted bg-white/[0.02]";
  return <span className={`inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-[0.7rem] font-medium ${cls}`}>{children}</span>;
}

function Panel({ children, className }: { children: React.ReactNode; className?: string }) {
  return <div className={`panel p-3.5 ${className ?? ""}`}>{children}</div>;
}

/* ---- mockups ---- */

export function PlatformDashboard() {
  return (
    <Win title="app.esgen.co.uk / overview">
      <div className="grid grid-cols-3 gap-3">
        {[["Scope 1", "1,180", "blue"], ["Scope 2", "2,240", "teal"], ["Scope 3", "9,860", "amber"]].map(([s, v, t]) => (
          <Panel key={s as string}>
            <p className="font-mono text-[0.62rem] uppercase tracking-wider text-text-muted">{s}</p>
            <p className="mt-1 font-display text-lg font-semibold">{v}</p>
            <p className="text-[0.6rem] text-text-muted">tCO₂e</p>
            <div className="mt-2"><Progress value={s === "Scope 3" ? 78 : s === "Scope 2" ? 42 : 22} tone={t as "blue" | "teal" | "amber"} /></div>
          </Panel>
        ))}
      </div>
      <div className="mt-3 grid grid-cols-[1.5fr_1fr] gap-3">
        <Panel>
          <div className="flex items-center justify-between">
            <p className="font-mono text-[0.62rem] uppercase tracking-wider text-text-muted">Emissions by month</p>
            <Chip tone="blue">tCO₂e</Chip>
          </div>
          <div className="mt-3"><Bars data={[42, 55, 38, 66, 49, 72, 61, 80]} /></div>
        </Panel>
        <Panel>
          <p className="font-mono text-[0.62rem] uppercase tracking-wider text-text-muted">Reporting readiness</p>
          <div className="mx-auto mt-2 grid h-16 w-16 place-items-center rounded-full" style={{ background: "conic-gradient(var(--color-accent) 0 74%, rgba(255,255,255,0.08) 74% 100%)" }}>
            <div className="grid h-11 w-11 place-items-center rounded-full bg-surface font-display text-sm font-semibold">74%</div>
          </div>
          <div className="mt-3 space-y-1.5 text-[0.68rem] text-text-muted">
            <div className="flex items-center justify-between"><span>Supplier requests</span><span className="text-white">18 / 24</span></div>
            <div className="flex items-center justify-between"><span>Action plan</span><span className="text-teal">On track</span></div>
          </div>
        </Panel>
      </div>
      <div className="mt-3 flex flex-wrap gap-1.5">
        {["GHG Protocol", "CSRD", "SECR", "ISSB", "CDP"].map((f) => <Chip key={f}>{f}</Chip>)}
      </div>
    </Win>
  );
}

export function ScopesDashboard() {
  return (
    <Win title="app.esgen.co.uk / ghg-accounting">
      <div className="grid grid-cols-3 gap-3">
        {[["Scope 1", "Direct", "1,180"], ["Scope 2", "Energy", "2,240"], ["Scope 3", "Value chain", "9,860"]].map(([s, d, v]) => (
          <Panel key={s as string}>
            <p className="text-[0.68rem] font-medium text-white">{s}</p>
            <p className="text-[0.6rem] text-text-muted">{d}</p>
            <p className="mt-1.5 font-display text-base font-semibold text-accent-3">{v} <span className="text-[0.55rem] text-text-muted">tCO₂e</span></p>
          </Panel>
        ))}
      </div>
      <Panel className="mt-3">
        <div className="flex items-center justify-between"><p className="font-mono text-[0.62rem] uppercase tracking-wider text-text-muted">Category breakdown</p><Chip tone="blue">Emission factors applied</Chip></div>
        <div className="mt-3 space-y-2">
          {[["Purchased goods", 82], ["Business travel", 46], ["Electricity", 38], ["Fuel", 24]].map(([c, v]) => (
            <div key={c as string} className="grid grid-cols-[1fr_2fr] items-center gap-3">
              <span className="text-[0.7rem] text-text-muted">{c}</span>
              <Progress value={v as number} />
            </div>
          ))}
        </div>
      </Panel>
      <p className="mt-2 font-mono text-[0.58rem] text-text-muted/60">Illustrative sample data</p>
    </Win>
  );
}

export function WorkflowMockup() {
  const steps = ["Collect", "Calculate", "Validate", "Report", "Reduce"];
  return (
    <Win title="app.esgen.co.uk / workflow">
      <div className="flex flex-col gap-2">
        {steps.map((s, i) => (
          <Panel key={s} className="flex items-center gap-3">
            <span className="grid h-7 w-7 shrink-0 place-items-center rounded-lg bg-accent/12 font-mono text-[0.7rem] text-accent-3">{i + 1}</span>
            <div className="flex-1">
              <p className="text-[0.8rem] font-medium text-white">{s}</p>
              <div className="mt-1.5"><Progress value={[100, 100, 74, 40, 12][i]} tone={i < 3 ? "teal" : "blue"} /></div>
            </div>
            <Chip tone={i < 2 ? "teal" : i < 4 ? "blue" : "muted"}>{["Done", "Done", "In review", "Drafting", "Planned"][i]}</Chip>
          </Panel>
        ))}
      </div>
    </Win>
  );
}

export function DataHubMockup() {
  return (
    <Win title="app.esgen.co.uk / data">
      <div className="grid grid-cols-2 gap-3">
        {[["Facilities", "Owner: Ops", 92, "teal"], ["Fleet & travel", "Owner: Finance", 68, "blue"], ["Procurement", "Owner: Supply", 44, "amber"], ["HR & commuting", "Owner: People", 20, "amber"]].map(([t, o, v, tone]) => (
          <Panel key={t as string}>
            <p className="text-[0.78rem] font-medium text-white">{t}</p>
            <p className="text-[0.62rem] text-text-muted">{o}</p>
            <div className="mt-2"><Progress value={v as number} tone={tone as "teal" | "blue" | "amber"} /></div>
            <p className="mt-1 text-[0.6rem] text-text-muted">{v as number}% complete</p>
          </Panel>
        ))}
      </div>
      <Panel className="mt-3 flex items-center justify-between">
        <span className="text-[0.72rem] text-text-muted">Missing input: HR commuting survey</span>
        <Chip tone="amber">Action needed</Chip>
      </Panel>
    </Win>
  );
}

export function MaterialityMatrix() {
  const dots = [
    { x: 78, y: 82, t: "Climate" }, { x: 64, y: 70, t: "Supply chain" }, { x: 40, y: 58, t: "Water" },
    { x: 55, y: 38, t: "Workforce" }, { x: 30, y: 34, t: "Governance" }, { x: 22, y: 66, t: "Waste" },
  ];
  return (
    <Win title="app.esgen.co.uk / double-materiality">
      <div className="relative aspect-[4/3] rounded-lg border border-border bg-surface-2">
        <span className="absolute left-2 top-2 font-mono text-[0.58rem] text-text-muted">Impact materiality ↑</span>
        <span className="absolute bottom-2 right-2 font-mono text-[0.58rem] text-text-muted">Financial materiality →</span>
        <div className="absolute inset-0" style={{ backgroundImage: "linear-gradient(rgba(255,255,255,0.05) 1px,transparent 1px),linear-gradient(90deg,rgba(255,255,255,0.05) 1px,transparent 1px)", backgroundSize: "25% 25%" }} />
        {dots.map((d) => (
          <div key={d.t} className="absolute -translate-x-1/2 translate-y-1/2" style={{ left: `${d.x}%`, bottom: `${d.y}%` }}>
            <span className="block h-2.5 w-2.5 rounded-full bg-accent shadow-[0_0_0_4px_rgba(77,139,245,0.18)]" />
            <span className="mt-1 block whitespace-nowrap text-[0.56rem] text-text-muted">{d.t}</span>
          </div>
        ))}
      </div>
      <p className="mt-2 font-mono text-[0.58rem] text-text-muted/60">Illustrative topic prioritisation</p>
    </Win>
  );
}

export function SupplierTracker() {
  const rows = [["Northbound Ltd", "Low", 100, "teal"], ["Vector Components", "Medium", 72, "blue"], ["Meridian Freight", "Medium", 48, "amber"], ["Atlas Materials", "High", 20, "amber"]];
  return (
    <Win title="app.esgen.co.uk / suppliers">
      <div className="space-y-2">
        <div className="grid grid-cols-[1.4fr_0.8fr_1fr] px-1 font-mono text-[0.58rem] uppercase tracking-wider text-text-muted/70"><span>Supplier</span><span>ESG risk</span><span>Response</span></div>
        {rows.map(([n, r, v, tone]) => (
          <Panel key={n as string} className="grid grid-cols-[1.4fr_0.8fr_1fr] items-center gap-2 py-2.5">
            <span className="text-[0.74rem] text-white">{n}</span>
            <Chip tone={r === "Low" ? "teal" : r === "High" ? "amber" : "blue"}>{r}</Chip>
            <div><Progress value={v as number} tone={tone as "teal" | "blue" | "amber"} /></div>
          </Panel>
        ))}
      </div>
      <p className="mt-2 text-[0.66rem] text-text-muted">18 of 24 supplier responses received · Scope 3 coverage improving</p>
    </Win>
  );
}

export function ComplianceGrid({ frameworks }: { frameworks?: string[] }) {
  const fw = frameworks ?? ["CSRD / ESRS", "SECR", "ISSB", "UK SRS", "BRSR", "CBAM", "CDP", "GHG Protocol"];
  const states = ["Ready", "In review", "Drafting", "Mapped", "In review", "Ready", "Drafting", "Ready"];
  return (
    <Win title="app.esgen.co.uk / compliance">
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
        {fw.map((f, i) => (
          <Panel key={f} className="flex flex-col gap-2">
            <p className="text-[0.72rem] font-medium leading-tight text-white">{f}</p>
            <Chip tone={states[i % states.length] === "Ready" ? "teal" : states[i % states.length] === "Drafting" ? "amber" : "blue"}>{states[i % states.length]}</Chip>
            <Progress value={[92, 66, 40, 78, 60, 88, 34, 96][i % 8]} tone={i % 3 === 0 ? "teal" : "blue"} />
          </Panel>
        ))}
      </div>
    </Win>
  );
}

export function AuditTrail() {
  const items = [
    ["Evidence pack created", "v1.0 · Ops", "teal"], ["Emission factors reviewed", "Method: DEFRA 2024", "blue"],
    ["Scope 3 supplier data added", "12 sources linked", "blue"], ["Calculation approved", "Reviewer sign-off", "teal"],
    ["Report exported", "v1.3 · locked", "muted"],
  ];
  return (
    <Win title="app.esgen.co.uk / audit-trail">
      <ol className="relative ml-2 border-l border-border pl-5">
        {items.map(([t, d, tone], i) => (
          <li key={i} className="mb-3.5 last:mb-0">
            <span className="absolute -left-[7px] mt-1 h-3 w-3 rounded-full border-2 border-canvas" style={{ background: tone === "teal" ? "var(--color-teal)" : tone === "muted" ? "#3a4152" : "var(--color-accent)" }} />
            <p className="text-[0.78rem] font-medium text-white">{t}</p>
            <p className="text-[0.64rem] text-text-muted">{d}</p>
          </li>
        ))}
      </ol>
    </Win>
  );
}

export function RoadmapMockup() {
  return (
    <Win title="app.esgen.co.uk / roadmap">
      <Panel>
        <p className="font-mono text-[0.62rem] uppercase tracking-wider text-text-muted">Net-zero pathway</p>
        <div className="mt-3"><Bars data={[92, 84, 72, 58, 44, 30, 18]} /></div>
        <div className="mt-1 flex justify-between font-mono text-[0.55rem] text-text-muted"><span>2024</span><span>2030</span><span>2040</span></div>
      </Panel>
      <div className="mt-3 grid grid-cols-2 gap-3">
        <Panel>
          <p className="text-[0.68rem] font-medium text-white">Material topics</p>
          <div className="mt-2 flex flex-wrap gap-1.5">{["Energy", "Supply chain", "Waste", "Water"].map((t) => <Chip key={t} tone="blue">{t}</Chip>)}</div>
        </Panel>
        <Panel>
          <p className="text-[0.68rem] font-medium text-white">Reduction actions</p>
          <div className="mt-2 space-y-1 text-[0.66rem] text-text-muted"><p>Renewable tariff · Q2</p><p>Fleet transition · Q4</p><p>Supplier engagement · ongoing</p></div>
        </Panel>
      </div>
    </Win>
  );
}

export function PartnerPortal() {
  return (
    <Win title="app.esgen.co.uk / partners">
      <div className="grid grid-cols-3 gap-3">
        {[["Prospects", "6"], ["In delivery", "9"], ["Reporting", "4"]].map(([s, v]) => (
          <Panel key={s as string}><p className="font-mono text-[0.6rem] uppercase tracking-wider text-text-muted">{s}</p><p className="mt-1 font-display text-lg font-semibold text-accent-3">{v}</p></Panel>
        ))}
      </div>
      <Panel className="mt-3">
        <p className="font-mono text-[0.62rem] uppercase tracking-wider text-text-muted">Client workspaces</p>
        <div className="mt-2 space-y-2">
          {[["Workspace A", 82, "teal"], ["Workspace B", 54, "blue"], ["Workspace C", 30, "amber"]].map(([n, v, t]) => (
            <div key={n as string} className="grid grid-cols-[1fr_2fr] items-center gap-3"><span className="text-[0.7rem] text-text-muted">{n}</span><Progress value={v as number} tone={t as "teal" | "blue" | "amber"} /></div>
          ))}
        </div>
      </Panel>
    </Win>
  );
}

export function IndustryDashboard({ categories, title = "footprint" }: { categories?: [string, number][]; title?: string }) {
  const cats = categories ?? [["Energy", 74], ["Process", 58], ["Materials", 82], ["Logistics", 46], ["Waste", 28]];
  return (
    <Win title={`app.esgen.co.uk / ${title}`}>
      <Panel>
        <div className="flex items-center justify-between"><p className="font-mono text-[0.62rem] uppercase tracking-wider text-text-muted">Emissions by activity</p><Chip tone="blue">tCO₂e</Chip></div>
        <div className="mt-3 space-y-2">
          {cats.map(([c, v]) => (
            <div key={c} className="grid grid-cols-[1fr_2fr] items-center gap-3"><span className="text-[0.7rem] text-text-muted">{c}</span><Progress value={v} /></div>
          ))}
        </div>
      </Panel>
      <div className="mt-3 grid grid-cols-2 gap-3">
        <Panel><p className="text-[0.66rem] text-text-muted">Supplier data</p><p className="mt-1 font-display text-base font-semibold text-white">Scope 3 tracked</p></Panel>
        <Panel><p className="text-[0.66rem] text-text-muted">Reporting</p><p className="mt-1 font-display text-base font-semibold text-teal">Tender-ready</p></Panel>
      </div>
    </Win>
  );
}

export function ResourcesLibrary() {
  return (
    <Win title="app.esgen.co.uk / resources">
      <div className="grid grid-cols-2 gap-3">
        {["Knowledge Hub", "Guides", "ESG Glossary", "Regulations"].map((t, i) => (
          <Panel key={t}><p className="text-[0.78rem] font-medium text-white">{t}</p><div className="mt-2"><Progress value={[90, 70, 84, 60][i]} tone={i % 2 ? "blue" : "teal"} /></div></Panel>
        ))}
      </div>
      <Panel className="mt-3"><p className="text-[0.68rem] text-text-muted">Learning pathway: ESG reporting basics → carbon accounting → frameworks</p></Panel>
    </Win>
  );
}
