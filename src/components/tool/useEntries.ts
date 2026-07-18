"use client";

import { useCallback, useEffect, useState } from "react";
import { addEntry, deleteEntry, fetchEntries } from "@/lib/tool/db";
import { demoAddEntry, demoDeleteEntry, demoFetchEntries } from "@/lib/tool/demo";
import { useAuth } from "@/components/tool/AuthProvider";
import { computeAll } from "@/lib/emissions/calc";
import type { ActivityEntry, ActivityEntryDraft, ComputedEntry } from "@/lib/tool/types";

export function useEntries(companyId: string | undefined) {
  const { isDemo } = useAuth();
  const [entries, setEntries] = useState<ActivityEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const reload = useCallback(async () => {
    if (!companyId) return;
    setLoading(true);
    setError(null);
    try {
      setEntries(isDemo ? demoFetchEntries() : await fetchEntries(companyId));
    } catch (e) {
      setError(e instanceof Error ? e.message : "Could not load activity data.");
    } finally {
      setLoading(false);
    }
  }, [companyId, isDemo]);

  useEffect(() => {
    void reload();
  }, [reload]);

  const add = useCallback(
    async (draft: ActivityEntryDraft) => {
      if (!companyId) throw new Error("No workspace.");
      const created = isDemo ? demoAddEntry(draft) : await addEntry(companyId, draft);
      setEntries((prev) => [created, ...prev]);
      return created;
    },
    [companyId, isDemo],
  );

  const remove = useCallback(
    async (id: string) => {
      if (isDemo) demoDeleteEntry(id);
      else await deleteEntry(id);
      setEntries((prev) => prev.filter((e) => e.id !== id));
    },
    [isDemo],
  );

  const computed: ComputedEntry[] = computeAll(entries);

  return { entries, computed, loading, error, reload, add, remove };
}
