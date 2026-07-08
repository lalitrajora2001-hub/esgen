"use client";

import { cn } from "@/lib/cn";

export const fieldBase =
  "h-12 w-full rounded-xl border border-border bg-surface px-4 text-text placeholder:text-text-muted/50 focus:border-accent focus:outline-none focus:ring-4 focus:ring-accent/15 transition";

export function Field({
  id,
  label,
  type = "text",
  required,
  autoComplete,
  inputMode,
  error,
  value,
  onChange,
  onBlur,
  placeholder,
  as,
  options,
}: {
  id: string;
  label: string;
  type?: string;
  required?: boolean;
  autoComplete?: string;
  inputMode?: "text" | "email" | "tel" | "numeric";
  error?: string;
  value: string;
  onChange: (v: string) => void;
  onBlur?: () => void;
  placeholder?: string;
  as?: "input" | "textarea" | "select";
  options?: string[];
}) {
  return (
    <div className="flex flex-col gap-2">
      <label htmlFor={id} className="font-display text-sm font-medium">
        {label} {required && <span className="text-accent-3">*</span>}
      </label>
      {as === "textarea" ? (
        <textarea id={id} required={required} value={value} onChange={(e) => onChange(e.target.value)} onBlur={onBlur} placeholder={placeholder} className={cn(fieldBase, "min-h-32 py-3", error && "border-[#ff7a7a]")} rows={5} />
      ) : as === "select" ? (
        <select id={id} value={value} onChange={(e) => onChange(e.target.value)} onBlur={onBlur} className={cn(fieldBase, error && "border-[#ff7a7a]")}>
          {options?.map((o) => <option key={o}>{o}</option>)}
        </select>
      ) : (
        <input id={id} type={type} required={required} autoComplete={autoComplete} inputMode={inputMode} value={value} onChange={(e) => onChange(e.target.value)} onBlur={onBlur} placeholder={placeholder} className={cn(fieldBase, error && "border-[#ff7a7a]")} />
      )}
      {error && <p className="text-sm text-[#ff7a7a]" role="alert">{error}</p>}
    </div>
  );
}

export const isEmail = (v: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v);
