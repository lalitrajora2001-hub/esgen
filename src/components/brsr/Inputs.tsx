"use client";

import type { FieldType } from "@/lib/brsr/types";
import type { Scalar } from "@/lib/brsr/calc";
import { cn } from "@/lib/cn";

const base =
  "w-full rounded-lg border border-border bg-surface px-3 py-2 text-sm text-text placeholder:text-text-muted/50 focus:border-accent focus:outline-none focus:ring-2 focus:ring-accent/20 transition";

/** A single typed input for one FieldType. Controlled; emits Scalar values. */
export function ScalarInput({
  type,
  value,
  onChange,
  options,
  unit,
  placeholder,
  readOnly,
  ariaLabel,
}: {
  type: FieldType;
  value: Scalar;
  onChange: (v: Scalar) => void;
  options?: string[];
  unit?: string;
  placeholder?: string;
  readOnly?: boolean;
  ariaLabel?: string;
}) {
  if (type === "boolean") {
    return (
      <select
        aria-label={ariaLabel}
        className={base}
        value={value === true ? "Yes" : value === false ? "No" : ""}
        onChange={(e) => onChange(e.target.value === "" ? null : e.target.value === "Yes")}
      >
        <option value="">—</option>
        <option value="Yes">Yes</option>
        <option value="No">No</option>
      </select>
    );
  }

  if (type === "enum") {
    return (
      <select aria-label={ariaLabel} className={base} value={(value as string) ?? ""} onChange={(e) => onChange(e.target.value || null)}>
        <option value="">—</option>
        {options?.map((o) => (
          <option key={o} value={o}>{o}</option>
        ))}
      </select>
    );
  }

  if (type === "longtext") {
    return (
      <textarea
        aria-label={ariaLabel}
        className={cn(base, "min-h-20")}
        rows={3}
        value={(value as string) ?? ""}
        placeholder={placeholder}
        readOnly={readOnly}
        onChange={(e) => onChange(e.target.value)}
      />
    );
  }

  const isNumeric = type === "number" || type === "percentage" || type === "currency" || type === "year";
  const inputType = type === "date" ? "date" : "text";

  return (
    <div className="flex items-center gap-1.5">
      <input
        aria-label={ariaLabel}
        type={inputType}
        inputMode={isNumeric ? "decimal" : undefined}
        className={cn(base, readOnly && "opacity-70")}
        value={value == null ? "" : String(value)}
        placeholder={placeholder ?? (type === "percentage" ? "%" : undefined)}
        readOnly={readOnly}
        onChange={(e) => {
          const raw = e.target.value;
          if (isNumeric) onChange(raw === "" ? null : raw);
          else onChange(raw);
        }}
      />
      {unit && <span className="shrink-0 text-xs text-text-muted">{unit}</span>}
      {type === "percentage" && !unit && <span className="shrink-0 text-xs text-text-muted">%</span>}
    </div>
  );
}
