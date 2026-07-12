import Link from "next/link";
import { INK, BODY, GREEN, GREENDK } from "@/components/platform/greenParts";

/* Shared chrome for the ESG-compliance pages. Each page supplies its own
   signature visual; only the breadcrumb, eyebrow, and standards wall are
   common. Marks below are simplified, monochrome representations of the
   frameworks ESGen supports reporting to, not accreditation badges. */

export function CEyebrow({ children }: { children: React.ReactNode }) {
  return (
    <p className="flex items-center gap-1.5 text-[0.72rem] font-bold uppercase tracking-[0.14em]" style={{ color: GREENDK }}>
      <svg viewBox="0 0 24 24" className="h-3.5 w-3.5" fill="none" stroke={GREENDK} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 3l7 3v6c0 4.4-3 7.6-7 9-4-1.4-7-4.6-7-9V6z" /><path d="M9 12l2 2 4-4" /></svg>
      {children}
    </p>
  );
}

/* ---------------- Framework marks (monochrome) ---------------- */
const STAR = "M0,-2.6 L0.79,-0.8 L2.47,-0.8 L1.09,0.31 L1.62,2.1 L0,1.05 L-1.62,2.1 L-1.09,0.31 L-2.47,-0.8 L-0.79,-0.8 Z";

function EuRing({ c }: { c: string }) {
  return <>{Array.from({ length: 12 }).map((_, i) => {
    const a = (i / 12) * Math.PI * 2 - Math.PI / 2;
    return <polygon key={i} points={STAR} fill={c} transform={`translate(${(20 + 13 * Math.cos(a)).toFixed(2)} ${(20 + 13 * Math.sin(a)).toFixed(2)})`} />;
  })}</>;
}
function EuMark({ label, c }: { label: string; c: string }) {
  return (
    <svg viewBox="0 0 40 40" className="h-9 w-9 shrink-0" aria-hidden>
      <circle cx="20" cy="20" r="19" fill="none" stroke={c} strokeWidth="1.2" opacity="0.35" />
      <EuRing c={c} />
      <text x="20" y="21.5" textAnchor="middle" dominantBaseline="middle" fontSize={label.length > 4 ? 6.5 : 8} fontWeight="800" fill={c}>{label}</text>
    </svg>
  );
}
function UkMark({ label, c }: { label: string; c: string }) {
  return (
    <svg viewBox="0 0 40 40" className="h-9 w-9 shrink-0" aria-hidden>
      <circle cx="20" cy="20" r="19" fill="none" stroke={c} strokeWidth="1.2" opacity="0.35" />
      <g stroke={c} strokeWidth="1.6" opacity="0.55"><path d="M6 6 L34 34M34 6 L6 34M20 3v34M3 20h34" /></g>
      <circle cx="20" cy="20" r="11" fill="#fff" />
      <text x="20" y="21" textAnchor="middle" dominantBaseline="middle" fontSize={label.length > 4 ? 6 : 7.5} fontWeight="800" fill={c}>{label}</text>
    </svg>
  );
}
function SbtiMark({ c }: { c: string }) {
  return <svg viewBox="0 0 40 40" className="h-9 w-9 shrink-0" aria-hidden><path d="M4 31 L15 13 L21 22 L26 15 L36 31 Z" fill="none" stroke={c} strokeWidth="2" strokeLinejoin="round" /><circle cx="30" cy="10" r="3.4" fill={c} /></svg>;
}
function GhgMark({ c }: { c: string }) {
  return <svg viewBox="0 0 40 40" className="h-9 w-9 shrink-0" aria-hidden><circle cx="20" cy="20" r="14" fill="none" stroke={c} strokeWidth="1.8" /><ellipse cx="20" cy="20" rx="6" ry="14" fill="none" stroke={c} strokeWidth="1.4" /><path d="M6 20h28M9 12h22M9 28h22" stroke={c} strokeWidth="1.2" /></svg>;
}
function IsoMark({ label, c }: { label: string; c: string }) {
  return <svg viewBox="0 0 40 40" className="h-9 w-9 shrink-0" aria-hidden><rect x="3" y="9" width="34" height="22" rx="4" fill="none" stroke={c} strokeWidth="1.6" /><text x="20" y="21" textAnchor="middle" dominantBaseline="middle" fontSize="7" fontWeight="800" fill={c}>{label}</text></svg>;
}
function WordMark({ label, c }: { label: string; c: string }) {
  return <span className="font-display text-[0.9rem] font-extrabold tracking-tight" style={{ color: c }}>{label}</span>;
}

type Fw = { k: string; node: (c: string) => React.ReactNode; caption: string };
const WALL: Fw[] = [
  { k: "UK SRS", node: (c) => <UkMark label="SRS" c={c} />, caption: "UK SRS" },
  { k: "SECR", node: (c) => <UkMark label="SECR" c={c} />, caption: "SECR" },
  { k: "CSRD", node: (c) => <EuMark label="CSRD" c={c} />, caption: "CSRD / ESRS" },
  { k: "CBAM", node: (c) => <EuMark label="CBAM" c={c} />, caption: "CBAM" },
  { k: "EUDR", node: (c) => <EuMark label="EUDR" c={c} />, caption: "EUDR" },
  { k: "DPP", node: (c) => <EuMark label="DPP" c={c} />, caption: "Digital Product Passport" },
  { k: "VSME", node: (c) => <EuMark label="VSME" c={c} />, caption: "VSME" },
  { k: "IFRS", node: (c) => <WordMark label="IFRS S1/S2" c={c} />, caption: "IFRS / ISSB" },
  { k: "TCFD", node: (c) => <WordMark label="TCFD" c={c} />, caption: "TCFD" },
  { k: "SBTi", node: (c) => <SbtiMark c={c} />, caption: "Science Based Targets" },
  { k: "GHG", node: (c) => <GhgMark c={c} />, caption: "GHG Protocol" },
  { k: "ISO", node: (c) => <IsoMark label="14064" c={c} />, caption: "ISO 14064 / 14067" },
];

/** Standards wall. `highlight` picks out the framework this page is about. */
export function FrameworkWall({ highlight }: { highlight?: string }) {
  return (
    <div className="grid grid-cols-2 gap-px overflow-hidden rounded-2xl border border-[#e6ece7] bg-[#e6ece7] sm:grid-cols-3 lg:grid-cols-4">
      {WALL.map((f) => {
        const on = f.k === highlight;
        const c = on ? GREENDK : INK;
        return (
          <div key={f.k} className="group flex h-[104px] flex-col items-center justify-center gap-2 px-3 text-center transition-colors"
            style={{ background: on ? "#f1f7f3" : "#ffffff" }}>
            {f.node(c)}
            <span className="text-[0.62rem] font-semibold leading-tight" style={{ color: on ? GREENDK : BODY }}>{f.caption}</span>
          </div>
        );
      })}
    </div>
  );
}

/** Compact stat strip used where a page needs plain, factual framing. */
export function FactStrip({ items }: { items: [string, string][] }) {
  return (
    <div className="grid gap-px overflow-hidden rounded-2xl border border-[#e6ece7] bg-[#e6ece7] sm:grid-cols-3">
      {items.map(([k, v]) => (
        <div key={k} className="bg-white p-5">
          <div className="font-display text-lg font-bold" style={{ color: INK }}>{k}</div>
          <p className="mt-1.5 text-[0.82rem] leading-relaxed" style={{ color: BODY }}>{v}</p>
        </div>
      ))}
    </div>
  );
}

/** Neutral "who this applies to" note. Never states legal advice. */
export function ScopeNote({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex gap-3 rounded-xl border border-[#e6ece7] bg-[#f8faf9] p-4">
      <svg viewBox="0 0 24 24" className="mt-0.5 h-4 w-4 shrink-0" fill="none" stroke={GREEN} strokeWidth="2" strokeLinecap="round"><circle cx="12" cy="12" r="9" /><path d="M12 8h.01M11 12h1v4h1" /></svg>
      <p className="text-[0.82rem] leading-relaxed" style={{ color: BODY }}>{children}</p>
    </div>
  );
}

export function CLink({ href, children }: { href: string; children: React.ReactNode }) {
  return <Link href={href} className="inline-flex items-center gap-1.5 text-sm font-semibold hover:underline" style={{ color: GREENDK }}>{children} →</Link>;
}
