"use client";

import {
  PieChart, Pie, Cell, ResponsiveContainer, Tooltip,
  AreaChart, Area, XAxis, YAxis, CartesianGrid,
  BarChart, Bar, LineChart, Line, Legend,
} from "recharts";

const BLUE = "#4d8bf5";
const BLUE_DEEP = "#2f6fe0";
const BLUE_LIGHT = "#8fbaff";
const TEAL = "#3fb6a8";
const GRID = "#262629";
const AXIS = "#93a1b5";

export function ChartCard({
  title,
  children,
  note = "Illustrative sample data",
  table,
}: {
  title: string;
  children: React.ReactNode;
  note?: string;
  table?: React.ReactNode;
}) {
  return (
    <figure className="card-surface p-5">
      <figcaption className="mb-4 flex items-center justify-between">
        <span className="font-display text-sm font-medium text-text">{title}</span>
        <span className="font-mono text-[0.65rem] uppercase tracking-wider text-text-muted/70">{note}</span>
      </figcaption>
      <div className="h-[260px] w-full">{children}</div>
      {table && <div className="sr-only">{table}</div>}
    </figure>
  );
}

const tooltipStyle = {
  background: "#101012",
  border: "1px solid #262629",
  borderRadius: 12,
  color: "#f4f6fb",
  fontSize: 13,
};

/* ---- Scope 1/2/3 donut ---- */
export function ScopeDonut() {
  const data = [
    { name: "Scope 1", value: 18 },
    { name: "Scope 2", value: 24 },
    { name: "Scope 3", value: 58 },
  ];
  const colors = [BLUE_LIGHT, TEAL, BLUE];
  return (
    <ResponsiveContainer width="100%" height="100%">
      <PieChart>
        <Pie data={data} dataKey="value" nameKey="name" innerRadius={64} outerRadius={100} paddingAngle={2} stroke="none">
          {data.map((_, i) => (
            <Cell key={i} fill={colors[i]} />
          ))}
        </Pie>
        <Tooltip contentStyle={tooltipStyle} formatter={(v, n) => [`${v}% (illustrative)`, n]} />
        <Legend verticalAlign="bottom" iconType="circle" wrapperStyle={{ fontSize: 12, color: AXIS }} />
      </PieChart>
    </ResponsiveContainer>
  );
}

/* ---- Emissions trend with target overlay ---- */
export function EmissionsTrend() {
  const data = [
    { year: "2022", actual: 1200, target: 1200 },
    { year: "2023", actual: 1120, target: 1080 },
    { year: "2024", actual: 1010, target: 960 },
    { year: "2025", actual: 900, target: 840 },
    { year: "2026", actual: 815, target: 720 },
  ];
  return (
    <ResponsiveContainer width="100%" height="100%">
      <AreaChart data={data} margin={{ top: 8, right: 8, left: -12, bottom: 0 }}>
        <defs>
          <linearGradient id="area" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor={BLUE} stopOpacity={0.4} />
            <stop offset="100%" stopColor={BLUE} stopOpacity={0} />
          </linearGradient>
        </defs>
        <CartesianGrid stroke={GRID} vertical={false} />
        <XAxis dataKey="year" stroke={AXIS} tickLine={false} axisLine={{ stroke: GRID }} fontSize={12} />
        <YAxis stroke={AXIS} tickLine={false} axisLine={false} fontSize={12} unit="t" />
        <Tooltip contentStyle={tooltipStyle} />
        <Area type="monotone" dataKey="actual" name="Actual (tCO2e)" stroke={BLUE} strokeWidth={2.5} fill="url(#area)" />
        <Line type="monotone" dataKey="target" name="Target pathway" stroke={BLUE_LIGHT} strokeWidth={2} strokeDasharray="5 5" dot={false} />
        <Legend verticalAlign="top" iconType="plainline" wrapperStyle={{ fontSize: 12, color: AXIS }} />
      </AreaChart>
    </ResponsiveContainer>
  );
}

/* ---- Emissions hotspots by category ---- */
export function HotspotBar() {
  const data = [
    { name: "Purchased goods", value: 420 },
    { name: "Business travel", value: 210 },
    { name: "Electricity", value: 180 },
    { name: "Logistics", value: 140 },
    { name: "Fuel", value: 90 },
  ];
  return (
    <ResponsiveContainer width="100%" height="100%">
      <BarChart data={data} layout="vertical" margin={{ top: 4, right: 12, left: 20, bottom: 0 }}>
        <CartesianGrid stroke={GRID} horizontal={false} />
        <XAxis type="number" stroke={AXIS} tickLine={false} axisLine={{ stroke: GRID }} fontSize={12} unit="t" />
        <YAxis type="category" dataKey="name" stroke={AXIS} tickLine={false} axisLine={false} width={110} fontSize={12} />
        <Tooltip contentStyle={tooltipStyle} cursor={{ fill: "rgba(77,139,245,0.08)" }} formatter={(v) => [`${v} tCO2e (illustrative)`, "Emissions"]} />
        <Bar dataKey="value" fill={BLUE} radius={[0, 6, 6, 0]} />
      </BarChart>
    </ResponsiveContainer>
  );
}

/* ---- Reduction scenario vs business as usual ---- */
export function ScenarioLine() {
  const data = [
    { year: "2026", bau: 900, plan: 900 },
    { year: "2028", bau: 940, plan: 760 },
    { year: "2030", bau: 980, plan: 560 },
    { year: "2035", bau: 1050, plan: 300 },
    { year: "2040", bau: 1120, plan: 120 },
  ];
  return (
    <ResponsiveContainer width="100%" height="100%">
      <LineChart data={data} margin={{ top: 8, right: 8, left: -12, bottom: 0 }}>
        <CartesianGrid stroke={GRID} vertical={false} />
        <XAxis dataKey="year" stroke={AXIS} tickLine={false} axisLine={{ stroke: GRID }} fontSize={12} />
        <YAxis stroke={AXIS} tickLine={false} axisLine={false} fontSize={12} unit="t" />
        <Tooltip contentStyle={tooltipStyle} />
        <Legend verticalAlign="top" iconType="plainline" wrapperStyle={{ fontSize: 12, color: AXIS }} />
        <Line type="monotone" dataKey="bau" name="Business as usual" stroke={AXIS} strokeWidth={2} dot={false} />
        <Line type="monotone" dataKey="plan" name="Reduction plan" stroke={BLUE} strokeWidth={2.5} dot={false} />
      </LineChart>
    </ResponsiveContainer>
  );
}
