import { FrameworkRow } from "@/components/frameworks";

/* Layered product composition for the hero: floating cards over a photo,
   in the editorial black-and-white language of the industries pages. */

const INK = "#101318";
const MUTED = "#565d68";
const LINE = "#e6e8ec";

function Card({ className = "", children }: { className?: string; children: React.ReactNode }) {
  return (
    <div className={`rounded-2xl bg-white shadow-[0_24px_60px_-28px_rgba(16,19,24,0.35)] ${className}`} style={{ border: `1px solid ${LINE}` }}>
      {children}
    </div>
  );
}

/* Donut: total footprint split by scope, greyscale ramp. */
function Donut() {
  const segs = [
    { v: 46, c: "#101318" },
    { v: 27, c: "#4a515c" },
    { v: 18, c: "#8a919c" },
    { v: 9, c: "#c8ccd2" },
  ];
  const R = 46, C = 2 * Math.PI * R;
  let acc = 0;
  return (
    <svg viewBox="0 0 120 120" className="h-[124px] w-[124px]">
      <g transform="rotate(-90 60 60)">
        {segs.map((s, i) => {
          const len = (s.v / 100) * C;
          const el = (
            <circle key={i} cx="60" cy="60" r={R} fill="none" stroke={s.c} strokeWidth="15"
              strokeDasharray={`${len} ${C - len}`} strokeDashoffset={-acc}>
              <animate attributeName="stroke-dasharray" from={`0 ${C}`} to={`${len} ${C - len}`} dur="1.1s" begin={`${0.15 + i * 0.12}s`} fill="freeze" />
            </circle>
          );
          acc += len;
          return el;
        })}
      </g>
      <text x="60" y="57" textAnchor="middle" fontSize="15" fontWeight="700" fill={INK}>12,480</text>
      <text x="60" y="72" textAnchor="middle" fontSize="8" fill={MUTED}>tCO₂e</text>
    </svg>
  );
}

/* Reduction trajectory: four declining target lines. */
function Trajectory() {
  const rows = [
    { c: "#101318", pts: "0,18 60,26 120,38 180,52" },
    { c: "#5b6472", pts: "0,34 60,40 120,50 180,62" },
    { c: "#8a919c", pts: "0,52 60,57 120,64 180,72" },
    { c: "#c1c6cd", pts: "0,68 60,72 120,77 180,83" },
  ];
  return (
    <svg viewBox="0 0 190 100" className="h-[104px] w-full">
      {[18, 38, 58, 78].map((y) => <line key={y} x1="0" y1={y} x2="190" y2={y} stroke={LINE} strokeWidth="1" />)}
      {rows.map((r, i) => (
        <g key={i}>
          <polyline points={r.pts} fill="none" stroke={r.c} strokeWidth="2" strokeLinecap="round" strokeDasharray="260"
            strokeDashoffset="260">
            <animate attributeName="stroke-dashoffset" from="260" to="0" dur="1.4s" begin={`${0.3 + i * 0.14}s`} fill="freeze" />
          </polyline>
          {r.pts.split(" ").map((p, k) => {
            const [x, y] = p.split(",");
            return <circle key={k} cx={x} cy={y} r="2.6" fill="#fff" stroke={r.c} strokeWidth="1.6" opacity="0">
              <animate attributeName="opacity" from="0" to="1" dur="0.3s" begin={`${0.9 + i * 0.14 + k * 0.05}s`} fill="freeze" />
            </circle>;
          })}
        </g>
      ))}
    </svg>
  );
}

export function HeroShowcase() {
  return (
    <div className="relative mx-auto w-full max-w-[560px]">
      {/* base photo panel */}
      <div className="overflow-hidden rounded-2xl" style={{ border: `1px solid ${LINE}` }}>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src="/images/manufacturing-welder.jpg" alt="Industrial site being measured" className="aspect-[4/3] w-full object-cover" />
      </div>

      {/* top-left: financial impact */}
      <Card className="absolute -left-4 top-6 w-[236px] p-4 sm:-left-10">
        <p className="font-display text-sm font-bold" style={{ color: INK }}>2026</p>
        <div className="mt-3 space-y-2">
          {[["Scope 1", "1,240"], ["Scope 2", "2,180"], ["Scope 3", "9,060"]].map(([k, v]) => (
            <div key={k} className="flex items-center justify-between text-[0.78rem]">
              <span style={{ color: MUTED }}>{k}</span>
              <span className="font-semibold tabular-nums" style={{ color: INK }}>{v}</span>
            </div>
          ))}
          <div className="flex items-center justify-between border-t pt-2 text-[0.8rem]" style={{ borderColor: LINE }}>
            <span className="font-semibold" style={{ color: INK }}>Total tCO₂e</span>
            <span className="font-bold tabular-nums" style={{ color: INK }}>12,480</span>
          </div>
        </div>
      </Card>

      {/* top-right: donut */}
      <Card className="absolute -right-4 -top-6 grid place-items-center p-3 sm:-right-10">
        <Donut />
      </Card>

      {/* bottom-right: trajectory */}
      <Card className="absolute -bottom-10 right-0 w-[290px] p-4 sm:-right-6">
        <div className="flex items-center justify-between">
          <p className="font-display text-[0.82rem] font-bold" style={{ color: INK }}>Reduction targets</p>
          <span className="font-mono text-[0.6rem]" style={{ color: MUTED }}>2021 → 2030</span>
        </div>
        <div className="mt-2"><Trajectory /></div>
      </Card>

      {/* bottom-left: framework marks */}
      <div className="absolute -bottom-6 -left-4 hidden sm:block sm:-left-8">
        <Card className="p-3">
          <div className="scale-[0.78] [transform-origin:left_center]">
            <FrameworkRow keys={["gri", "issb", "csrd"]} />
          </div>
        </Card>
      </div>
    </div>
  );
}
