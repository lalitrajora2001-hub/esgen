"use client";

import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Check } from "@/components/sections/blocks";
import { DataCollectionApp, InsightsDashboard, ReportingApp, AuditApp } from "@/components/appmockups";

const TABS = [
  {
    key: "collect",
    label: "Smart Data Collection",
    p: "Bring sustainability data together from across your business and suppliers, with owners and missing inputs tracked from the start.",
    bullets: ["Upload utility, travel, procurement and supplier data", "Use standardised templates", "Track owners and missing inputs", "Validate data before calculation"],
    visual: <DataCollectionApp />,
  },
  {
    key: "dashboards",
    label: "Advanced Dashboards",
    p: "See your footprint clearly by scope and category, spot hotspots, and track progress against your targets.",
    bullets: ["View emissions by scope and category", "Identify hotspots", "Track trends", "Monitor targets and progress"],
    visual: <InsightsDashboard />,
  },
  {
    key: "reporting",
    label: "Easy Reporting",
    p: "Prepare structured outputs mapped to the frameworks you need, keeping evidence connected to every figure.",
    bullets: ["Prepare structured outputs", "Map figures to frameworks", "Export summaries", "Keep evidence connected to each figure"],
    visual: <ReportingApp />,
  },
  {
    key: "audit",
    label: "Audit Evidence",
    p: "Trace every figure back to its source, review the method, and keep a clear record of changes and approvals.",
    bullets: ["Trace figures back to source data", "Review calculation methods", "Track changes and approvals", "Maintain version history"],
    visual: <AuditApp />,
  },
];

export function ProductTabs() {
  const [active, setActive] = useState(0);
  const tab = TABS[active];

  const onKey = (e: React.KeyboardEvent) => {
    if (e.key === "ArrowRight") setActive((a) => (a + 1) % TABS.length);
    if (e.key === "ArrowLeft") setActive((a) => (a - 1 + TABS.length) % TABS.length);
  };

  return (
    <div>
      <div role="tablist" aria-label="Product capabilities" onKeyDown={onKey} className="flex flex-wrap gap-2 border-b border-border pb-4">
        {TABS.map((t, i) => (
          <button
            key={t.key}
            role="tab"
            id={`tab-${t.key}`}
            aria-selected={active === i}
            aria-controls={`panel-${t.key}`}
            tabIndex={active === i ? 0 : -1}
            onClick={() => setActive(i)}
            className={`rounded-full px-4 py-2 text-sm font-medium transition-colors ${active === i ? "bg-white/10 text-white" : "text-text-muted hover:text-white"}`}
          >
            {t.label}
          </button>
        ))}
      </div>

      <div className="mt-10 grid items-center gap-10 lg:grid-cols-2">
        <div id={`panel-${tab.key}`} role="tabpanel" aria-labelledby={`tab-${tab.key}`}>
          <h3 className="font-display text-2xl font-semibold">{tab.label}</h3>
          <p className="mt-3 text-text-muted">{tab.p}</p>
          <ul className="mt-6 space-y-3">
            {tab.bullets.map((b) => (
              <li key={b} className="flex items-start gap-3 text-sm text-text"><Check /> {b}</li>
            ))}
          </ul>
        </div>
        <AnimatePresence mode="wait">
          <motion.div
            key={tab.key}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -12 }}
            transition={{ duration: 0.28, ease: [0.16, 1, 0.3, 1] }}
          >
            {tab.visual}
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
}
