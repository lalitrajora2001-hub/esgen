/* ------------------------------------------------------------------
   Standards & frameworks "logo wall", white cards on a light panel,
   matching the reference composition. Each tile is a clean, brand-
   coloured logo lockup (official acronym + brand colour + a simple
   geometric mark), representing standards ESGen's platform supports.
   These are original wordmark renderings, not pixel reproductions of
   trademarked artwork; swap in official SVGs from /public/brand when
   available for 1:1 fidelity.
   ------------------------------------------------------------------ */

const STAR = (() => {
  const pts: string[] = [];
  for (let k = 0; k < 10; k++) {
    const r = k % 2 === 0 ? 1 : 0.382;
    const a = ((-90 + k * 36) * Math.PI) / 180;
    pts.push(`${(r * Math.cos(a)).toFixed(3)},${(r * Math.sin(a)).toFixed(3)}`);
  }
  return pts.join(" ");
})();

function EUCsrd() {
  return (
    <svg viewBox="0 0 48 48" className="h-11 w-11">
      <circle cx="24" cy="24" r="23" fill="#0b3aa0" />
      {Array.from({ length: 12 }).map((_, i) => {
        const a = ((-90 + i * 30) * Math.PI) / 180;
        return <polygon key={i} points={STAR} fill="#ffcc00" transform={`translate(${(24 + 16 * Math.cos(a)).toFixed(2)} ${(24 + 16 * Math.sin(a)).toFixed(2)}) scale(2.3)`} />;
      })}
      <text x="24" y="25" textAnchor="middle" dominantBaseline="central" fontSize="10.5" fontWeight={800} fill="#ffcc00">CSRD</text>
    </svg>
  );
}

function Badge({ text, bg, fg = "#ffffff", fs = 15 }: { text: string; bg: string; fg?: string; fs?: number }) {
  return (
    <span className="grid h-11 w-11 shrink-0 place-items-center rounded-full font-display font-extrabold" style={{ background: bg, color: fg, fontSize: fs }}>
      {text}
    </span>
  );
}

function Word({ text, color, className = "" }: { text: string; color: string; className?: string }) {
  return <span className={`font-display text-2xl font-extrabold tracking-tight ${className}`} style={{ color }}>{text}</span>;
}

/* small geometric marks */
function CdpMark() {
  return (
    <svg viewBox="0 0 24 24" className="h-9 w-9">
      {[0, 1, 2].map((r) => [0, 1, 2].map((c) => <rect key={`${r}${c}`} x={2 + c * 7} y={2 + r * 7} width="5.5" height="5.5" rx="1" fill="#c8102e" opacity={(r + c) % 2 === 0 ? 1 : 0.55} transform={`skewX(-12)`} />))}
    </svg>
  );
}
function WaveMark() {
  return (
    <svg viewBox="0 0 40 28" className="h-9 w-12">
      <path d="M2 20 Q10 6 20 14 T38 8" fill="none" stroke="#e0533d" strokeWidth="2.4" strokeLinecap="round" />
      <path d="M2 24 Q10 12 20 19 T38 14" fill="none" stroke="#3a86c8" strokeWidth="2.4" strokeLinecap="round" />
      <path d="M2 16 Q10 2 20 10 T38 3" fill="none" stroke="#4ca772" strokeWidth="2.4" strokeLinecap="round" />
    </svg>
  );
}
function GlobeMark({ color }: { color: string }) {
  return (
    <svg viewBox="0 0 32 32" className="h-9 w-9">
      <circle cx="14" cy="16" r="11" fill="none" stroke={color} strokeWidth="2" />
      <ellipse cx="14" cy="16" rx="5" ry="11" fill="none" stroke={color} strokeWidth="1.4" />
      <path d="M4 12h20M4 20h20" stroke={color} strokeWidth="1.4" />
      <path d="M25 11l4 5-4 5M29 11l4 5-4 5" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}
function FlowerMark() {
  return (
    <svg viewBox="0 0 32 32" className="h-9 w-9">
      {[0, 60, 120, 180, 240, 300].map((d) => (
        <ellipse key={d} cx="16" cy="9" rx="3.4" ry="6" fill="#2f9e44" transform={`rotate(${d} 16 16)`} opacity="0.9" />
      ))}
      <circle cx="16" cy="16" r="3.2" fill="#8bc34a" />
    </svg>
  );
}
function CheckMark() {
  return (
    <svg viewBox="0 0 32 24" className="h-8 w-10">
      <path d="M2 14l7 7 8-14" fill="none" stroke="#b98b2e" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M13 12l8-9" fill="none" stroke="#6b7480" strokeWidth="3" strokeLinecap="round" />
    </svg>
  );
}

type Tile = { k: string; node: React.ReactNode };
const TILES: Tile[] = [
  { k: "gri", node: <Badge text="GRI" bg="#12559c" fs={13} /> },
  { k: "tcfd", node: <Word text="TCFD" color="#38a7db" /> },
  { k: "cdp", node: <span className="flex items-center gap-1.5"><CdpMark /><Word text="CDP" color="#c8102e" /></span> },
  {
    k: "brsr",
    node: (
      <span className="grid h-11 w-11 place-items-center rounded-full border-2 border-[#1b2a5b] font-display text-[0.72rem] font-extrabold text-[#1b2a5b]">BRSR</span>
    ),
  },
  { k: "csrd", node: <EUCsrd /> },
  { k: "efrag", node: <span className="flex items-center gap-2"><span className="grid h-8 w-8 place-items-center rounded bg-[#2a7d8c]"><span className="h-3 w-3 rounded-sm border-2 border-white" /></span><Word text="EFRAG" color="#1b2a5b" className="text-xl" /></span> },
  {
    k: "sbt",
    node: (
      <span className="flex items-center gap-2">
        <WaveMark />
        <span className="text-left font-display text-[0.6rem] font-bold uppercase leading-[1.15] tracking-wide text-[#3f4a57]">Science<br />Based<br />Targets</span>
      </span>
    ),
  },
  {
    k: "equator",
    node: (
      <span className="flex items-center gap-1.5">
        <GlobeMark color="#4a7d2c" />
        <span className="text-left font-display text-[0.62rem] font-extrabold uppercase leading-[1.15] tracking-wide text-[#4a7d2c]">Equator<br />Principles</span>
      </span>
    ),
  },
  { k: "wbcsd", node: <span className="flex items-center gap-1.5"><FlowerMark /><Word text="wbcsd" color="#2f9e44" className="text-xl lowercase" /></span> },
  { k: "fasb", node: <Word text="FASB" color="#0a2f5e" className="italic" /> },
  { k: "oecd", node: <span className="flex items-center gap-1.5"><GlobeMark color="#2b3a67" /><Word text="OECD" color="#2b3a67" className="text-xl" /></span> },
  {
    k: "pri",
    node: (
      <span className="flex items-center gap-2">
        <Word text="PRI" color="#1f6fb8" />
        <span className="text-left font-display text-[0.52rem] font-semibold leading-tight text-[#6b7480]">Principles for<br />Responsible<br />Investment</span>
      </span>
    ),
  },
  { k: "issb", node: <Badge text="ISSB" bg="#1b2a5b" fs={11.5} /> },
  {
    k: "unep",
    node: (
      <span className="flex items-center gap-2">
        <Word text="UN" color="#4a9fd8" />
        <span className="text-left font-display text-[0.55rem] font-semibold leading-tight text-[#4a9fd8]">environment<br />programme</span>
      </span>
    ),
  },
  { k: "pcaf", node: <span className="flex items-center gap-1"><CheckMark /><Word text="PCAF" color="#3f4a57" className="text-xl" /></span> },
];

/** Compact row of selected framework marks, for use inside feature cards. */
export function FrameworkRow({ keys }: { keys: string[] }) {
  const picked = keys.map((k) => TILES.find((t) => t.k === k)).filter(Boolean) as Tile[];
  return (
    <div className="flex flex-wrap items-center justify-center gap-3">
      {picked.map((t) => (
        <div key={t.k} className="flex h-[74px] min-w-[104px] items-center justify-center rounded-2xl border border-[#e6e8ec] bg-white px-4 shadow-[0_10px_24px_-18px_rgba(15,23,42,0.45)]">
          {t.node}
        </div>
      ))}
    </div>
  );
}

export function FrameworkLogos() {
  return (
    <div className="rounded-3xl border border-white/10 bg-[#eef1f5] p-3 sm:p-5">
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 sm:gap-4 lg:grid-cols-5">
        {TILES.map((t) => (
          <div key={t.k} className="flex min-h-[104px] items-center justify-center rounded-2xl bg-white px-4 py-6 shadow-[0_10px_24px_-16px_rgba(15,23,42,0.4)]">
            {t.node}
          </div>
        ))}
      </div>
    </div>
  );
}
