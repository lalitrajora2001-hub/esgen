"use client";

import { useRef, useState } from "react";
import { deleteEvidence, evidenceUrl, uploadEvidence, type EvidenceFile } from "@/lib/brsr/db";

/** Per-question evidence upload + list, backed by Supabase Storage. */
export function EvidenceUploader({
  reportId,
  questionKey,
  hint,
  files,
  onChange,
}: {
  reportId: string;
  questionKey: string;
  hint?: string;
  files: EvidenceFile[];
  onChange: (files: EvidenceFile[]) => void;
}) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const onPick = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setBusy(true);
    setError(null);
    try {
      const created = await uploadEvidence(reportId, questionKey, file);
      onChange([created, ...files]);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Upload failed.");
    } finally {
      setBusy(false);
      if (inputRef.current) inputRef.current.value = "";
    }
  };

  const onOpen = async (f: EvidenceFile) => {
    const url = await evidenceUrl(f.file_path);
    if (url) window.open(url, "_blank", "noopener");
  };

  const onRemove = async (f: EvidenceFile) => {
    setBusy(true);
    try {
      await deleteEvidence(f);
      onChange(files.filter((x) => x.id !== f.id));
    } catch (err) {
      setError(err instanceof Error ? err.message : "Delete failed.");
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="mt-3 rounded-lg border border-dashed border-border bg-surface-2/40 p-3">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <p className="text-xs text-text-muted">
          <span className="font-medium text-text">Evidence</span>
          {hint ? `: ${hint}` : ""}
        </p>
        <button
          type="button"
          onClick={() => inputRef.current?.click()}
          disabled={busy}
          className="rounded-lg border border-border px-3 py-1.5 text-xs text-text transition hover:border-accent hover:bg-accent/8 disabled:opacity-50"
        >
          {busy ? "Working..." : "Upload file"}
        </button>
        <input ref={inputRef} type="file" className="hidden" onChange={onPick} />
      </div>
      {error && <p className="mt-2 text-xs text-[#b42318]">{error}</p>}
      {files.length > 0 && (
        <ul className="mt-2 space-y-1">
          {files.map((f) => (
            <li key={f.id} className="flex items-center justify-between gap-2 text-xs">
              <button onClick={() => onOpen(f)} className="truncate text-accent-3 hover:underline">{f.file_name}</button>
              <button onClick={() => onRemove(f)} className="shrink-0 text-text-muted hover:text-[#e5484d]">Remove</button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
