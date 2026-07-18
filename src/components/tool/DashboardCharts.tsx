"use client";

import {
  PieChart, Pie, Cell, ResponsiveContainer, Tooltip,
  BarChart, Bar, XAxis, YAxis, CartesianGrid,
  AreaChart, Area,
} from "recharts";
import type { CategoryTotal, MonthTotal, ScopeTotal } from "@/lib/emissions/calc";
import { fmtTonnes } from "@/lib/emissions/calc";

const SCOPE_COLORS: Record<number, string> = { 1: "#4d8bf5", 2: "#43c6b7", 3: "#8fbaff" };
const GRID = "#212533";
const AXIS = "#94a0b5";

const tooltipStyle = {
  background: "#13161f",
  border: "1px solid #212533",
  borderRadius: 12,
  color: "#eef1f7",
  fontSize: 12,
} as const;

export function ScopeDonut({ totals }: { totals: ScopeTotal[] }) {
  const data = totals.filter((t) => t.kgco2e > 0).map((t) => ({
    name: t.label,
    value: t.tco2e,
    scope: t.scope,
  }));

  if (data.length === 0) return <EmptyChart label="No emissions recorded yet" />;

  return (
    <div className="h-64 w-full">
      <ResponsiveContainer width="100%" height="100%">
        <PieChart>
          <Pie
            data={data}
            dataKey="value"
            nameKey="name"
            innerRadius="58%"
            outerRadius="86%"
            paddingAngle={2}
            stroke="none"
            isAnimationActive={false}
          >
            {data.map((d) => (
              <Cell key={d.scope} fill={SCOPE_COLORS[d.scope]} />
            ))}
          </Pie>
          <Tooltip
            contentStyle={tooltipStyle}
            formatter={(val) => [`${fmtTonnes(Number(val) || 0)} tCO2e`, ""]}
          />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
}

export function CategoryBars({ categories }: { categories: CategoryTotal[] }) {
  const data = categories.map((c) => ({ name: c.category, value: c.tco2e, scope: c.scope }));
  if (data.length === 0) return <EmptyChart label="No categories yet" />;

  return (
    <div className="h-64 w-full">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={data} layout="vertical" margin={{ left: 8, right: 16, top: 4, bottom: 4 }}>
          <CartesianGrid horizontal={false} stroke={GRID} />
          <XAxis type="number" stroke={AXIS} tick={{ fontSize: 11 }} tickLine={false} axisLine={{ stroke: GRID }} />
          <YAxis
            type="category"
            dataKey="name"
            stroke={AXIS}
            tick={{ fontSize: 11 }}
            width={140}
            tickLine={false}
            axisLine={false}
          />
          <Tooltip
            cursor={{ fill: "rgba(77,139,245,0.08)" }}
            contentStyle={tooltipStyle}
            formatter={(val) => [`${fmtTonnes(Number(val) || 0)} tCO2e`, ""]}
          />
          <Bar dataKey="value" radius={[0, 4, 4, 0]} isAnimationActive={false}>
            {data.map((d, i) => (
              <Cell key={i} fill={SCOPE_COLORS[d.scope]} />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}

export function MonthTrend({ months }: { months: MonthTotal[] }) {
  const data = months.map((m) => ({ name: m.label, value: m.tco2e }));
  if (data.length === 0) return <EmptyChart label="No dated activity yet" />;

  return (
    <div className="h-56 w-full">
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart data={data} margin={{ left: 4, right: 12, top: 8, bottom: 4 }}>
          <defs>
            <linearGradient id="trendFill" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#4d8bf5" stopOpacity={0.35} />
              <stop offset="100%" stopColor="#4d8bf5" stopOpacity={0} />
            </linearGradient>
          </defs>
          <CartesianGrid vertical={false} stroke={GRID} />
          <XAxis dataKey="name" stroke={AXIS} tick={{ fontSize: 11 }} tickLine={false} axisLine={{ stroke: GRID }} />
          <YAxis stroke={AXIS} tick={{ fontSize: 11 }} tickLine={false} axisLine={false} width={40} />
          <Tooltip
            contentStyle={tooltipStyle}
            formatter={(val) => [`${fmtTonnes(Number(val) || 0)} tCO2e`, ""]}
          />
          <Area
            type="monotone"
            dataKey="value"
            stroke="#4d8bf5"
            strokeWidth={2}
            fill="url(#trendFill)"
            isAnimationActive={false}
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}

export function ScopeLegend({ totals }: { totals: ScopeTotal[] }) {
  return (
    <ul className="mt-4 space-y-2">
      {totals.map((t) => (
        <li key={t.scope} className="flex items-center justify-between text-sm">
          <span className="flex items-center gap-2 text-text-muted">
            <span className="h-2.5 w-2.5 rounded-full" style={{ background: SCOPE_COLORS[t.scope] }} />
            {t.label}
          </span>
          <span className="font-mono text-text">{fmtTonnes(t.tco2e)} t</span>
        </li>
      ))}
    </ul>
  );
}

function EmptyChart({ label }: { label: string }) {
  return (
    <div className="grid h-64 w-full place-items-center rounded-xl border border-dashed border-border">
      <p className="text-sm text-text-muted">{label}</p>
    </div>
  );
}
