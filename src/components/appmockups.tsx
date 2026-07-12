"use client";


/* ============================================================
   Realistic ESGen product-interface mockups (light UI on the
   dark page, so they read as a real tool). Original ESGen design.
   ============================================================ */

const C = {
  bg: "#f6f7f9", card: "#ffffff", line: "#e7e9ee", ink: "#0f1720", muted: "#6b7480",
  side: "#0b0d12", sideMuted: "#8a93a3",
  blue: "#2f6fe0", blue2: "#4d8bf5", blue3: "#a9c8f7", blue1: "#1c47a0",
  coral: "#fb7351", green: "#16a34a", teal: "#0d9488",
};

/** The real ESGen "E" symbol, in white, matching the website logo. */
function ToolMark() {
  return (
    <span
      className="block h-9 w-11 shrink-0"
      style={{
        background: "#ffffff",
        WebkitMaskImage: "url(/brand/esgen-symbol.svg)",
        maskImage: "url(/brand/esgen-symbol.svg)",
        WebkitMaskRepeat: "no-repeat",
        maskRepeat: "no-repeat",
        WebkitMaskSize: "contain",
        maskSize: "contain",
        WebkitMaskPosition: "center",
        maskPosition: "center",
      }}
      aria-label="ESGen"
      role="img"
    />
  );
}

function SideIcon({ active, path }: { active?: boolean; path: string }) {
  return (
    <span className={`grid h-9 w-9 place-items-center rounded-lg ${active ? "bg-white/12 text-white" : "text-[#8a93a3]"}`}>
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" className="h-[18px] w-[18px]"><path d={path} /></svg>
    </span>
  );
}

function AppShell({ title, children, foot }: { title: string; children: React.ReactNode; foot?: React.ReactNode }) {
  return (
    <div className="overflow-hidden rounded-2xl border border-[#1c2230] shadow-[0_40px_80px_-30px_rgba(0,0,0,0.85)]">
      <div className="flex" style={{ background: C.bg }}>
        <aside className="flex w-14 shrink-0 flex-col items-center gap-1.5 py-4" style={{ background: C.side }}>
          <ToolMark />
          <div className="mt-3 flex flex-col gap-1">
            <SideIcon active path="M3 12l9-8 9 8M5 10v10h14V10" />
            <SideIcon path="M4 4h16v6H4zM4 14h16v6H4z" />
            <SideIcon path="M12 21s7-6 7-11a7 7 0 10-14 0c0 5 7 11 7 11z M12 10a2 2 0 100-4 2 2 0 000 4z" />
            <SideIcon path="M4 19V5m0 14h16M8 15l3-4 3 3 4-6" />
            <SideIcon path="M12 3l7 3v6c0 4.5-3 7.5-7 9-4-1.5-7-4.5-7-9V6z" />
          </div>
        </aside>
        <div className="min-w-0 flex-1">
          <div className="flex items-center justify-between border-b px-4 py-2.5" style={{ background: C.card, borderColor: C.line }}>
            <span className="rounded-md border px-2.5 py-1 text-[0.68rem] font-medium" style={{ borderColor: C.line, color: C.ink }}>{title} ▾</span>
            <div className="flex items-center gap-3 text-[0.62rem]" style={{ color: C.muted }}>
              <span>Inbox</span><span>Support</span><span className="flex items-center gap-1"><span className="grid h-4 w-4 place-items-center rounded-full text-[0.5rem] text-white" style={{ background: C.blue }}>E</span>Profile</span>
            </div>
          </div>
          <div className="p-4">{children}</div>
          {foot && <div className="border-t px-4 py-2.5" style={{ borderColor: C.line }}>{foot}</div>}
        </div>
      </div>
    </div>
  );
}

function Spark({ up, color }: { up: number[]; color: string }) {
  const max = Math.max(...up), min = Math.min(...up);
  const pts = up.map((v, i) => `${(i / (up.length - 1)) * 100},${28 - ((v - min) / (max - min || 1)) * 24 - 2}`).join(" ");
  return (
    <svg viewBox="0 0 100 30" preserveAspectRatio="none" className="h-8 w-full">
      <polyline points={pts} fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" vectorEffect="non-scaling-stroke" />
    </svg>
  );
}

function Delta({ v, bad }: { v: string; bad?: boolean }) {
  return <span className="text-[0.62rem] font-semibold" style={{ color: bad ? C.coral : C.green }}>{v}</span>;
}

function Chip({ children }: { children: React.ReactNode }) {
  return <span className="rounded-md border px-2 py-1 text-[0.6rem]" style={{ borderColor: C.line, color: C.muted }}>{children}</span>;
}

/* ---- 1. Insights dashboard (hero + Advanced Dashboards tab) ---- */
export function InsightsDashboard() {
  const scopes = [
    { t: "Scope 1", d: "Direct combustion & fugitive", spark: [4, 5, 4, 7, 6, 9], delta: "↑ 6%", bad: true, c: C.blue1 },
    { t: "Scope 2", d: "Purchased energy", spark: [8, 6, 5, 5, 4, 3], delta: "↓ 12%", bad: false, c: C.blue2 },
    { t: "Scope 3", d: "Value chain", spark: [3, 4, 5, 6, 8, 11], delta: "↑ 22%", bad: true, c: C.blue },
  ];
  // [S1, S2, S3] in px, kept within the h-24 (96px) plot so bars never overlap.
  const stacks = [[12, 20, 50], [12, 19, 47], [11, 17, 42], [10, 15, 36], [9, 13, 31]];
  return (
    <AppShell title="Corporate carbon footprint">
      <div className="flex items-center justify-between">
        <h4 className="font-display text-[0.95rem] font-semibold" style={{ color: C.ink }}>Insights overview</h4>
        <div className="flex gap-1.5"><Chip>Category</Chip><Chip>Country</Chip><Chip>2024</Chip></div>
      </div>
      <div className="mt-3 grid grid-cols-3 gap-2.5">
        {scopes.map((s) => (
          <div key={s.t} className="rounded-lg border p-2.5" style={{ background: C.card, borderColor: C.line }}>
            <div className="flex items-center justify-between">
              <span className="text-[0.72rem] font-semibold" style={{ color: C.ink }}>{s.t}</span>
              <Delta v={s.delta} bad={s.bad} />
            </div>
            <p className="mt-0.5 text-[0.56rem] leading-tight" style={{ color: C.muted }}>{s.d}</p>
            <div className="mt-1.5"><Spark up={s.spark} color={s.c} /></div>
          </div>
        ))}
      </div>
      <div className="mt-2.5 rounded-lg border p-3" style={{ background: C.card, borderColor: C.line }}>
        <div className="flex items-center justify-between">
          <span className="text-[0.68rem] font-medium" style={{ color: C.ink }}>Emissions over time (tCO₂e)</span>
          <div className="flex items-center gap-2 text-[0.55rem]" style={{ color: C.muted }}>
            <span className="flex items-center gap-1"><i className="h-2 w-2 rounded-sm" style={{ background: C.blue1 }} />S1</span>
            <span className="flex items-center gap-1"><i className="h-2 w-2 rounded-sm" style={{ background: C.blue2 }} />S2</span>
            <span className="flex items-center gap-1"><i className="h-2 w-2 rounded-sm" style={{ background: C.blue3 }} />S3</span>
          </div>
        </div>
        <div className="mt-3 flex h-24 items-end justify-between gap-3">
          {stacks.map((col, i) => {
            const tot = col[0] + col[1] + col[2];
            return (
              <div key={i} className="flex flex-1 flex-col items-center">
                <div className="flex w-full max-w-9 flex-col overflow-hidden rounded-t-[3px]" style={{ height: `${tot}px` }}>
                  <div style={{ height: `${col[2]}px`, background: C.blue3 }} />
                  <div style={{ height: `${col[1]}px`, background: C.blue2 }} />
                  <div style={{ height: `${col[0]}px`, background: C.blue1 }} />
                </div>
                <span className="mt-1 text-[0.5rem]" style={{ color: C.muted }}>{2020 + i}</span>
              </div>
            );
          })}
        </div>
      </div>
      <div className="mt-2.5 grid grid-cols-4 gap-2">
        {[["Data quality", "94%", false], ["Suppliers", "18 / 24", false], ["Readiness", "74%", false], ["YoY", "↑ 4%", true]].map(([l, v, bad]) => (
          <div key={l as string} className="rounded-lg border px-2 py-1.5 text-center" style={{ background: C.card, borderColor: C.line }}>
            <p className="text-[0.52rem] uppercase tracking-wide" style={{ color: C.muted }}>{l}</p>
            <p className="text-[0.8rem] font-semibold" style={{ color: bad ? C.coral : C.ink }}>{v}</p>
          </div>
        ))}
      </div>
    </AppShell>
  );
}

/* ---- 2. Data collection app ---- */
export function DataCollectionApp() {
  const rows = [
    ["Facilities energy", "Operations", "Complete", C.green], ["Fleet & travel", "Finance", "In review", C.blue],
    ["Procurement spend", "Supply chain", "Missing 3", C.coral], ["Employee commuting", "People", "Requested", C.muted],
  ];
  return (
    <AppShell title="Data collection">
      <h4 className="font-display text-[0.9rem] font-semibold" style={{ color: C.ink }}>Activity data</h4>
      <div className="mt-3 overflow-hidden rounded-lg border" style={{ borderColor: C.line, background: C.card }}>
        <div className="grid grid-cols-[1.4fr_1fr_0.9fr] border-b px-3 py-2 text-[0.56rem] uppercase tracking-wide" style={{ borderColor: C.line, color: C.muted }}><span>Source</span><span>Owner</span><span>Status</span></div>
        {rows.map(([s, o, st, c]) => (
          <div key={s as string} className="grid grid-cols-[1.4fr_1fr_0.9fr] items-center border-b px-3 py-2.5 last:border-0" style={{ borderColor: C.line }}>
            <span className="text-[0.72rem]" style={{ color: C.ink }}>{s}</span>
            <span className="text-[0.66rem]" style={{ color: C.muted }}>{o}</span>
            <span className="text-[0.62rem] font-medium" style={{ color: c as string }}>{st}</span>
          </div>
        ))}
      </div>
      <div className="mt-2.5 flex items-center justify-between rounded-lg border px-3 py-2" style={{ background: "#fff6f2", borderColor: "#fbd9cd" }}>
        <span className="text-[0.66rem]" style={{ color: C.ink }}>3 inputs need attention before calculation</span>
        <span className="rounded-md px-2 py-1 text-[0.6rem] font-semibold text-white" style={{ background: C.coral }}>Review</span>
      </div>
    </AppShell>
  );
}

/* ---- 3. Reporting app ---- */
export function ReportingApp() {
  const fws = [["CSRD / ESRS", 86, C.blue], ["SECR", 64, C.teal], ["ISSB", 48, C.blue], ["CDP", 92, C.teal]];
  return (
    <AppShell title="Reporting">
      <h4 className="font-display text-[0.9rem] font-semibold" style={{ color: C.ink }}>Framework readiness</h4>
      <div className="mt-3 grid grid-cols-2 gap-2.5">
        {fws.map(([n, v, c]) => (
          <div key={n as string} className="rounded-lg border p-3" style={{ background: C.card, borderColor: C.line }}>
            <div className="flex items-center justify-between">
              <span className="text-[0.72rem] font-semibold" style={{ color: C.ink }}>{n}</span>
              <span className="text-[0.62rem] font-medium" style={{ color: c as string }}>{v}%</span>
            </div>
            <div className="mt-2 h-1.5 overflow-hidden rounded-full" style={{ background: "#eef1f5" }}><div style={{ width: `${v}%`, height: "100%", background: c as string }} /></div>
          </div>
        ))}
      </div>
      <div className="mt-2.5 flex items-center justify-between rounded-lg border px-3 py-2.5" style={{ background: C.card, borderColor: C.line }}>
        <span className="text-[0.66rem]" style={{ color: C.muted }}>Evidence connected to every figure</span>
        <span className="rounded-md px-2.5 py-1 text-[0.62rem] font-semibold text-white" style={{ background: C.blue }}>Export</span>
      </div>
    </AppShell>
  );
}

/* ---- 4. Audit trail app ---- */
export function AuditApp() {
  const items = [["Evidence pack created", "v1.0 · Operations", C.teal], ["Emission factors reviewed", "DEFRA 2024", C.blue], ["Supplier data linked", "12 sources", C.blue], ["Calculation approved", "Reviewer sign-off", C.teal], ["Report locked", "v1.3", C.muted]];
  return (
    <AppShell title="Audit trail">
      <h4 className="font-display text-[0.9rem] font-semibold" style={{ color: C.ink }}>Evidence & versions</h4>
      <ol className="mt-3 ml-1 border-l pl-4" style={{ borderColor: C.line }}>
        {items.map(([t, d, c], i) => (
          <li key={i} className="relative mb-3 last:mb-0">
            <span className="absolute -left-[21px] mt-0.5 h-3 w-3 rounded-full border-2 border-white" style={{ background: c as string }} />
            <p className="text-[0.72rem] font-medium" style={{ color: C.ink }}>{t}</p>
            <p className="text-[0.6rem]" style={{ color: C.muted }}>{d}</p>
          </li>
        ))}
      </ol>
    </AppShell>
  );
}
