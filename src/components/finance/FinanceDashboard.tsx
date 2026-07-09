"use client";

import { useEffect, useRef, useState } from "react";
import { motion, useInView, useReducedMotion } from "framer-motion";

/* Illustrative financed-emissions dashboard for the Finance page. Light UI,
   ESGen mark top-left, all figures are illustrative mockup data. Elements
   assemble on scroll-in: numbers count up, the donut and gauges sweep, the
   scope bar grows, and the detail panel slides in. */

const C = {
  navy: "#12224f", blue: "#2f6fe0", blue3: "#a9c4f7",
  pale: "#e6eeff", line: "#e7ebf3", muted: "#6b7480",
};

function useReveal() {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "0px 0px -15% 0px" });
  return { ref, inView };
}

function Count({ to, play, decimals = 0, prefix = "", suffix = "" }: { to: number; play: boolean; decimals?: number; prefix?: string; suffix?: string }) {
  const [v, setV] = useState(0);
  useEffect(() => {
    if (!play) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) { setV(to); return; }
    let raf = 0; const t0 = performance.now(); const dur = 1500;
    const tick = (now: number) => { const p = Math.min(1, (now - t0) / dur); setV(to * (1 - Math.pow(1 - p, 3))); if (p < 1) raf = requestAnimationFrame(tick); };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [play, to]);
  return <>{prefix}{v.toLocaleString("en-GB", { minimumFractionDigits: decimals, maximumFractionDigits: decimals })}{suffix}</>;
}

function EsgenMark() {
  return (
    <span
      className="block h-6 w-8 shrink-0"
      style={{ background: "#111827", WebkitMaskImage: "url(/brand/esgen-symbol.svg)", maskImage: "url(/brand/esgen-symbol.svg)", WebkitMaskRepeat: "no-repeat", maskRepeat: "no-repeat", WebkitMaskSize: "contain", maskSize: "contain", WebkitMaskPosition: "center", maskPosition: "center" }}
      aria-label="ESGen"
      role="img"
    />
  );
}

function Metric({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="rounded-lg border p-3" style={{ borderColor: C.line }}>
      <div className="font-display text-lg font-bold tabular-nums sm:text-xl" style={{ color: C.navy }}>{children}</div>
      <div className="mt-1 text-[0.58rem] font-medium uppercase tracking-wide" style={{ color: C.blue }}>{label}</div>
    </div>
  );
}

function Donut({ play }: { play: boolean }) {
  const segs = [[35, C.blue3], [41, "#7aa0ef"], [24, C.navy]] as const;
  let acc = 0;
  return (
    <svg viewBox="0 0 80 80" className="h-[86px] w-[86px]">
      <circle cx="40" cy="40" r="30" fill="none" stroke="#eef2fb" strokeWidth="12" />
      {segs.map(([val, col], i) => {
        const off = -acc; acc += val as number;
        return (
          <motion.circle key={i} cx="40" cy="40" r="30" fill="none" stroke={col as string} strokeWidth="12" pathLength={100}
            strokeDasharray={`${val} 100`} transform="rotate(-90 40 40)"
            initial={{ strokeDashoffset: 100 - off - (val as number) }}
            animate={play ? { strokeDashoffset: off } : {}}
            transition={{ duration: 0.9, delay: 0.2 + i * 0.15, ease: [0.16, 1, 0.3, 1] }} />
        );
      })}
    </svg>
  );
}

function Gauge({ label, pct, play, delay }: { label: string; pct: number; play: boolean; delay: number }) {
  return (
    <div className="text-center">
      <div className="text-[0.55rem] font-semibold uppercase tracking-wide" style={{ color: C.blue }}>{label}</div>
      <svg viewBox="0 0 60 40" className="mx-auto mt-1 h-10 w-16">
        <path d="M6 34 A24 24 0 0 1 54 34" fill="none" stroke="#eef2fb" strokeWidth="7" strokeLinecap="round" />
        <motion.path d="M6 34 A24 24 0 0 1 54 34" fill="none" stroke={C.navy} strokeWidth="7" strokeLinecap="round" pathLength={100}
          strokeDasharray="100" initial={{ strokeDashoffset: 100 }} animate={play ? { strokeDashoffset: 100 - pct } : {}}
          transition={{ duration: 1, delay, ease: [0.16, 1, 0.3, 1] }} />
      </svg>
      <div className="text-[0.6rem] font-bold tabular-nums" style={{ color: C.navy }}><Count to={pct} play={play} suffix="%" /></div>
    </div>
  );
}

export function FinanceDashboard() {
  const { ref, inView } = useReveal();
  const reduce = useReducedMotion();
  const scope = [["Scope 1", 3540, C.navy], ["Scope 2", 31900, "#7aa0ef"], ["Scope 3", 1169440, C.blue]] as const;
  const total = scope.reduce((s, x) => s + (x[1] as number), 0);

  return (
    <div ref={ref} className="relative">
      {/* faint decorative arcs, slowly rotating */}
      <motion.svg
        viewBox="0 0 400 400" className="pointer-events-none absolute -right-8 -top-10 h-64 w-64 origin-center opacity-[0.12]" aria-hidden
        animate={reduce ? undefined : { rotate: 360 }} transition={{ duration: 90, repeat: Infinity, ease: "linear" }}
      >
        {[60, 110, 160, 200].map((r) => <circle key={r} cx="200" cy="200" r={r} fill="none" stroke={C.blue} strokeWidth="2" />)}
      </motion.svg>

      <div className="relative grid gap-4 lg:grid-cols-[1.6fr_1fr]">
        {/* main dashboard */}
        <motion.div
          className="overflow-hidden rounded-2xl border bg-white p-4 shadow-[0_30px_60px_-30px_rgba(11,26,74,0.35)]"
          style={{ borderColor: C.line }}
          initial={{ opacity: 0, y: 16 }} animate={inView ? { opacity: 1, y: 0 } : {}} transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
        >
          <div className="flex items-center gap-2">
            <EsgenMark />
            <span className="font-display text-lg font-bold" style={{ color: C.navy }}>Dashboard</span>
            <span className="ml-auto flex items-center gap-1.5 text-[0.55rem] font-semibold uppercase tracking-wide" style={{ color: C.muted }}>
              <motion.span className="h-1.5 w-1.5 rounded-full" style={{ background: "#22c55e" }} animate={reduce ? undefined : { opacity: [1, 0.25, 1], scale: [1, 0.8, 1] }} transition={{ duration: 1.7, repeat: Infinity, ease: "easeInOut" }} />
              Live
            </span>
          </div>

          <div className="mt-3 flex items-center justify-between">
            <span className="text-[0.62rem] font-semibold uppercase tracking-wide" style={{ color: C.muted }}>Metrics</span>
            <span className="text-[0.62rem] font-semibold uppercase tracking-wide" style={{ color: C.muted }}>Financed emissions by company</span>
          </div>
          <div className="mt-2 grid grid-cols-[1fr_1fr_0.9fr] gap-2">
            <div className="grid grid-rows-2 gap-2">
              <Metric label="Financed emissions"><Count to={1204880} play={inView} suffix=" tCO₂e" /></Metric>
              <Metric label="Emissions intensity"><Count to={158} play={inView} /> tCO₂e / £1M</Metric>
            </div>
            <div className="grid grid-rows-2 gap-2">
              <Metric label="Total emissions"><Count to={9640120} play={inView} suffix=" tCO₂e" /></Metric>
              <Metric label="Implied temp. rise">2.4–3 °C</Metric>
            </div>
            {/* treemap */}
            <div className="grid grid-cols-3 grid-rows-4 gap-1">
              {[6, 4, 3, 3, 5, 2, 4, 2, 3, 2, 3, 2].map((n, i) => (
                <motion.div key={i} className="rounded-[3px]" style={{ background: i % 3 === 0 ? C.pale : i % 3 === 1 ? "#cfe0ff" : "#eaf1ff", gridColumn: n > 4 ? "span 2" : undefined }}
                  initial={{ opacity: 0, scale: 0.6 }} animate={inView ? { opacity: 1, scale: 1 } : {}} transition={{ duration: 0.4, delay: 0.3 + i * 0.03 }} />
              ))}
            </div>
          </div>

          <div className="mt-3 grid grid-cols-2 gap-4">
            <div>
              <div className="text-[0.66rem] font-semibold" style={{ color: C.navy }}>Emissions intensity</div>
              <div className="mt-1 flex items-center gap-3">
                <Donut play={inView} />
                <div className="space-y-1">
                  {[["24.2%", C.navy], ["40.6%", "#7aa0ef"], ["35.2%", C.blue3]].map(([t, c]) => (
                    <div key={t} className="flex items-center gap-1.5 text-[0.6rem]" style={{ color: C.navy }}><i className="h-1.5 w-1.5 rounded-full" style={{ background: c as string }} />{t}</div>
                  ))}
                </div>
              </div>
            </div>
            <div>
              <div className="text-[0.66rem] font-semibold" style={{ color: C.navy }}>Emissions under commitments</div>
              <div className="mt-2 flex justify-between">
                <Gauge label="SBT" pct={7} play={inView} delay={0.4} />
                <Gauge label="Net Zero" pct={12} play={inView} delay={0.55} />
                <Gauge label="Clean Power" pct={20} play={inView} delay={0.7} />
              </div>
            </div>
          </div>

          <div className="mt-3">
            <div className="text-[0.66rem] font-semibold" style={{ color: C.navy }}>Financed emissions by GHG scope</div>
            <div className="relative mt-2 flex h-3 overflow-hidden rounded-full" style={{ background: "#eef2fb" }}>
              {scope.map(([, v, c], i) => (
                <motion.div key={i} style={{ background: c as string }} initial={{ width: 0 }} animate={inView ? { width: `${((v as number) / total) * 100}%` } : {}} transition={{ duration: 0.9, delay: 0.3 + i * 0.1, ease: [0.16, 1, 0.3, 1] }} />
              ))}
              {!reduce && (
                <motion.div className="pointer-events-none absolute inset-y-0 w-1/4" style={{ background: "linear-gradient(90deg, transparent, rgba(255,255,255,0.55), transparent)" }} animate={{ x: ["-120%", "440%"] }} transition={{ duration: 2.8, repeat: Infinity, ease: "easeInOut", delay: 1.4 }} />
              )}
            </div>
            <div className="mt-2 flex justify-between">
              {scope.map(([n, v, c]) => (
                <div key={n as string} className="text-[0.58rem]">
                  <span className="flex items-center gap-1 font-medium" style={{ color: C.navy }}><i className="h-1.5 w-1.5 rounded-full" style={{ background: c as string }} />{n}</span>
                  <span style={{ color: C.blue }}>{(v as number).toLocaleString("en-GB")} tCO₂e</span>
                </div>
              ))}
            </div>
          </div>
        </motion.div>

        {/* detail panel */}
        <motion.div
          className="hidden overflow-hidden rounded-2xl border bg-white p-4 shadow-[0_30px_60px_-30px_rgba(11,26,74,0.35)] lg:block"
          style={{ borderColor: C.line }}
          initial={{ opacity: 0, x: 24 }} animate={inView ? { opacity: 1, x: 0 } : {}} transition={{ duration: 0.55, delay: 0.25, ease: [0.16, 1, 0.3, 1] }}
        >
          <div className="flex items-center justify-between">
            <span className="font-display text-base font-bold" style={{ color: C.navy }}>Portfolio company</span>
            <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke={C.blue} strokeWidth="2" strokeLinecap="round"><path d="M5 12h14M13 6l6 6-6 6" /></svg>
          </div>
          <div className="text-[0.55rem] font-semibold uppercase tracking-wide" style={{ color: C.muted }}>Logistics · Illustrative</div>

          <div className="mt-3 space-y-1.5 text-[0.64rem]">
            {[["Financed emissions", "472,300 tCO₂e"], ["Total emissions", "2,480,100 tCO₂e"], ["Emission intensity", "158 tCO₂e / £1M"], ["Ownership", "19.0%"], ["Year", "2024"]].map(([k, v]) => (
              <div key={k} className="flex justify-between"><span style={{ color: C.muted }}>{k}</span><span className="font-medium" style={{ color: C.blue }}>{v}</span></div>
            ))}
            <div className="flex justify-between"><span style={{ color: C.muted }}>Data source</span><span className="rounded px-1.5 py-0.5 text-[0.55rem] font-semibold" style={{ background: C.pale, color: C.navy }}>Measured</span></div>
          </div>

          <div className="mt-4 font-display text-sm font-bold" style={{ color: C.navy }}>Measurement</div>
          <div className="mt-2 space-y-1.5 text-[0.64rem]">
            {[["Measurement status", "Complete"], ["PCAF score (Scope 1 & 2)", "2"], ["PCAF score (Scope 3)", "4"]].map(([k, v]) => (
              <div key={k} className="flex justify-between"><span style={{ color: C.muted }}>{k}</span><span className="font-medium" style={{ color: C.blue }}>{v}</span></div>
            ))}
          </div>
        </motion.div>
      </div>
    </div>
  );
}
