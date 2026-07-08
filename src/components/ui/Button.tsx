import Link from "next/link";
import { cn } from "@/lib/cn";

type Variant = "primary" | "ghost" | "subtle";
type Size = "md" | "lg";

const base =
  "inline-flex items-center justify-center gap-2 rounded-full font-display font-semibold transition-all duration-300 will-change-transform focus-visible:outline-accent-3";

const variants: Record<Variant, string> = {
  primary:
    "bg-accent text-white shadow-[0_10px_30px_-12px_rgba(77,139,245,0.9)] hover:bg-accent-2 hover:-translate-y-0.5 hover:shadow-[0_16px_36px_-12px_rgba(77,139,245,1)]",
  ghost:
    "border border-border text-text hover:border-accent hover:-translate-y-0.5 hover:bg-[rgba(77,139,245,0.08)]",
  subtle: "text-text-muted hover:text-text",
};

const sizes: Record<Size, string> = {
  md: "h-11 px-5 text-sm",
  lg: "h-13 px-7 text-[0.95rem] min-h-[52px]",
};

export function Button({
  href,
  children,
  variant = "primary",
  size = "md",
  className,
  type,
  ...rest
}: {
  href?: string;
  children: React.ReactNode;
  variant?: Variant;
  size?: Size;
  className?: string;
  type?: "button" | "submit";
} & React.ButtonHTMLAttributes<HTMLButtonElement>) {
  const cls = cn(base, variants[variant], sizes[size], className);
  if (href) {
    const external = href.startsWith("http");
    if (external) {
      return (
        <a href={href} className={cls} target="_blank" rel="noreferrer">
          {children}
        </a>
      );
    }
    return (
      <Link href={href} className={cls}>
        {children}
      </Link>
    );
  }
  return (
    <button type={type ?? "button"} className={cls} {...rest}>
      {children}
    </button>
  );
}

export function ArrowRight({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" className={cn("h-4 w-4", className)}>
      <path d="M5 12h14M13 6l6 6-6 6" />
    </svg>
  );
}
