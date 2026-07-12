import Link from "next/link";
import { Reveal } from "@/components/ui/Reveal";
import { ArrowRight } from "@/components/ui/Button";

/* Solution cards with distinct, realistic light "product screens" on top,
   in the style of Sweep / Greenly solution grids. */

const C = { card: "#ffffff", line: "#e7e9ee", ink: "#0f1720", muted: "#6b7480", blue1: "#1c47a0", blue2: "#4d8bf5", blue3: "#a9c8f7", blue: "#2f6fe0", teal: "#0d9488", green: "#16a34a", coral: "#fb7351" };

function Screen({ children }: { children: React.ReactNode }) {
  return (
    <div className="overflow-hidden rounded-xl border p-3" style={{ background: C.card, borderColor: C.line }}>
      {children}
    </div>
  );
}

/* 1. Data management, status table */
function DataPreview() {
  const rows = [["Facilities energy", "Complete", C.green], ["Procurement spend", "In review", C.blue], ["Supplier data", "Missing 3", C.coral]];
  return (
    <Screen>
      <div className="flex items-center justify-between">
        <span className="text-[0.7rem] font-semibold" style={{ color: C.ink }}>Activity data</span>
        <span className="rounded border px-1.5 py-0.5 text-[0.55rem]" style={{ borderColor: C.line, color: C.muted }}>24 sources</span>
      </div>
      <div className="mt-2 space-y-1.5">
        {rows.map(([n, s, c]) => (
          <div key={n} className="flex items-center justify-between rounded-md border px-2 py-1.5" style={{ borderColor: C.line }}>
            <span className="text-[0.62rem]" style={{ color: C.ink }}>{n}</span>
            <span className="flex items-center gap-1 text-[0.55rem] font-medium" style={{ color: c }}><i className="h-1.5 w-1.5 rounded-full" style={{ background: c }} />{s}</span>
          </div>
        ))}
      </div>
    </Screen>
  );
}

/* 2. GHG accounting, scope donut */
function GhgPreview() {
  const segs = [[55, C.blue3], [25, C.blue2], [20, C.blue1]];
  let acc = 0;
  return (
    <Screen>
      <div className="flex items-center gap-3">
        <svg viewBox="0 0 80 80" className="h-[70px] w-[70px] shrink-0">
          <circle cx="40" cy="40" r="30" fill="none" stroke="#eef1f5" strokeWidth="11" />
          {segs.map(([v, col], i) => {
            const off = -acc; acc += v as number;
            return <circle key={i} cx="40" cy="40" r="30" fill="none" stroke={col as string} strokeWidth="11" pathLength={100} strokeDasharray={`${v} 100`} strokeDashoffset={off} transform="rotate(-90 40 40)" strokeLinecap="butt" />;
          })}
          <text x="40" y="38" textAnchor="middle" fontSize="12" fontWeight={800} fill={C.ink}>1.2k</text>
          <text x="40" y="50" textAnchor="middle" fontSize="7" fill={C.muted}>tCO₂e</text>
        </svg>
        <div className="space-y-1.5">
          {[["Scope 1", "20%", C.blue1], ["Scope 2", "25%", C.blue2], ["Scope 3", "55%", C.blue3]].map(([n, p, c]) => (
            <div key={n} className="flex items-center gap-2 text-[0.6rem]" style={{ color: C.ink }}>
              <i className="h-2 w-2 rounded-sm" style={{ background: c }} /><span className="w-12">{n}</span><span style={{ color: C.muted }}>{p}</span>
            </div>
          ))}
        </div>
      </div>
    </Screen>
  );
}

/* 3. Supplier assessment, supplier progress rows */
function SupplierPreview() {
  const rows = [["Acme Components", 82, C.green], ["Northgate Logistics", 54, C.blue], ["Vertex Materials", 28, C.coral]];
  return (
    <Screen>
      <div className="flex items-center justify-between">
        <span className="text-[0.7rem] font-semibold" style={{ color: C.ink }}>Supplier responses</span>
        <span className="text-[0.55rem]" style={{ color: C.muted }}>18 / 24</span>
      </div>
      <div className="mt-2 space-y-2">
        {rows.map(([n, v, c]) => (
          <div key={n as string}>
            <div className="flex items-center justify-between text-[0.6rem]"><span style={{ color: C.ink }}>{n}</span><span style={{ color: c as string }}>{v}%</span></div>
            <div className="mt-1 h-1.5 overflow-hidden rounded-full" style={{ background: "#eef1f5" }}><div style={{ width: `${v}%`, height: "100%", background: c as string }} /></div>
          </div>
        ))}
      </div>
    </Screen>
  );
}

/* 4. Reporting automation, framework readiness */
function ReportPreview() {
  const rows = [["CSRD / ESRS", 86, C.blue], ["SECR", 64, C.teal], ["ISSB", 48, C.blue]];
  return (
    <Screen>
      <span className="text-[0.7rem] font-semibold" style={{ color: C.ink }}>Framework readiness</span>
      <div className="mt-2 space-y-2">
        {rows.map(([n, v, c]) => (
          <div key={n as string} className="flex items-center gap-2">
            <span className="w-16 text-[0.58rem]" style={{ color: C.ink }}>{n}</span>
            <div className="h-1.5 flex-1 overflow-hidden rounded-full" style={{ background: "#eef1f5" }}><div style={{ width: `${v}%`, height: "100%", background: c as string }} /></div>
            <span className="text-[0.55rem] font-medium" style={{ color: c as string }}>{v}%</span>
          </div>
        ))}
      </div>
    </Screen>
  );
}

/* 5. Advisory & compliance, readiness roadmap */
function AdvisoryPreview() {
  const steps = [["Materiality assessment", "Done", C.green], ["Reduction planning", "In progress", C.blue], ["Assurance readiness", "Upcoming", C.muted]];
  return (
    <Screen>
      <span className="text-[0.7rem] font-semibold" style={{ color: C.ink }}>Readiness roadmap</span>
      <ol className="mt-2 ml-1 border-l pl-3" style={{ borderColor: C.line }}>
        {steps.map(([n, s, c], i) => (
          <li key={i} className="relative mb-2 last:mb-0">
            <span className="absolute -left-[15px] mt-0.5 h-2.5 w-2.5 rounded-full border-2 border-white" style={{ background: c }} />
            <p className="text-[0.62rem] font-medium leading-tight" style={{ color: C.ink }}>{n}</p>
            <p className="text-[0.52rem]" style={{ color: c }}>{s}</p>
          </li>
        ))}
      </ol>
    </Screen>
  );
}

const CARDS = [
  { title: "Carbon Assessment", href: "/platform/carbon-assessment", desc: "Measure Scope 1, 2, and 3 with transparent calculations and factors.", preview: <GhgPreview /> },
  { title: "Suppliers Engagement", href: "/platform/suppliers-engagement", desc: "Onboard suppliers and collect primary Scope 3 data.", preview: <SupplierPreview /> },
  { title: "Emissions Factors", href: "/platform/emissions-factors", desc: "A transparent, up-to-date emissions factor database.", preview: <DataPreview /> },
  { title: "CSRD", href: "/platform/csrd", desc: "Map ESRS datapoints and prepare structured disclosures.", preview: <ReportPreview /> },
  { title: "Decarbonization Strategy", href: "/platform/decarbonization-strategy", desc: "Model reduction levers and build a concrete action plan.", preview: <AdvisoryPreview /> },
];

export function SolutionCards() {
  return (
    <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
      {CARDS.map((c) => (
        <Reveal key={c.title}>
          <Link href={c.href} className="card card-hover group flex h-full flex-col overflow-hidden">
            <div className="border-b border-border bg-gradient-to-b from-surface-2 to-surface p-4">{c.preview}</div>
            <div className="flex flex-1 flex-col p-6">
              <h3 className="font-display text-lg font-semibold">{c.title}</h3>
              <p className="mt-2 flex-1 text-sm text-text-muted">{c.desc}</p>
              <span className="mt-4 inline-flex items-center gap-2 text-sm font-medium text-accent-3">Learn more <ArrowRight className="h-4 w-4" /></span>
            </div>
          </Link>
        </Reveal>
      ))}
    </div>
  );
}
