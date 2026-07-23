"use client";

import { useState } from "react";
import { CompanyProfile } from "@/components/brsr/CompanyProfile";
import { FactorSettings } from "@/components/brsr/FactorSettings";
import { OrgUnitSettings } from "@/components/brsr/OrgUnitSettings";
import { ApprovalQueue } from "@/components/brsr/ApprovalQueue";
import { cn } from "@/lib/cn";

/**
 * Settings area with tabbed sections, mirroring the company / unit / categories
 * pattern of leading ESG tools. Tabs register here as their sections are built.
 */

type TabDef = { key: string; label: string; render: () => React.ReactNode };

export function SettingsView({ isAdmin = false }: { isAdmin?: boolean }) {
  const tabs: TabDef[] = [
    { key: "company", label: "Company settings", render: () => <CompanyProfile /> },
    { key: "factors", label: "Emission factors", render: () => <FactorSettings /> },
    { key: "units", label: "Organisation units", render: () => <OrgUnitSettings /> },
    ...(isAdmin ? [{ key: "approvals", label: "Sign-up approvals", render: () => <ApprovalQueue /> } as TabDef] : []),
  ];
  const [active, setActive] = useState(tabs[0].key);
  const tab = tabs.find((t) => t.key === active) ?? tabs[0];

  return (
    <div>
      <header className="mb-5">
        <h2 className="text-lg font-semibold">Settings</h2>
        <p className="mt-1 text-sm text-text-muted">Your reporting entity and workspace configuration.</p>
      </header>

      <div className="mb-6 inline-flex gap-1 rounded-full bg-surface-2 p-1">
        {tabs.map((t) => (
          <button
            key={t.key}
            onClick={() => setActive(t.key)}
            aria-pressed={t.key === active}
            className={cn(
              "rounded-full px-4 py-1.5 text-sm transition",
              t.key === active ? "bg-white font-semibold text-text shadow-sm" : "font-medium text-text-muted hover:text-text",
            )}
          >
            {t.label}
          </button>
        ))}
      </div>

      {tab.render()}
    </div>
  );
}
