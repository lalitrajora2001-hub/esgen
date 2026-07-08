import { cn } from "@/lib/cn";

/** Section wrapper with consistent vertical rhythm and a centred container. */
export function Section({
  children,
  id,
  className,
  containerClassName,
  size = "md",
}: {
  children: React.ReactNode;
  id?: string;
  className?: string;
  containerClassName?: string;
  size?: "sm" | "md" | "lg";
}) {
  const pad = size === "sm" ? "py-14 sm:py-16" : size === "lg" ? "py-24 sm:py-32" : "py-20 sm:py-24";
  return (
    <section id={id} className={cn("relative", pad, className)}>
      <div className={cn("mx-auto w-full max-w-6xl px-5 sm:px-6", containerClassName)}>{children}</div>
    </section>
  );
}

/** Centred or left-aligned section heading block. */
export function SectionHead({
  eyebrow,
  title,
  intro,
  center,
  className,
}: {
  eyebrow?: string;
  title: React.ReactNode;
  intro?: React.ReactNode;
  center?: boolean;
  className?: string;
}) {
  return (
    <div className={cn("max-w-2xl", center && "mx-auto text-center", className)}>
      {eyebrow && <p className="mono-label mb-4">{eyebrow}</p>}
      <h2 className="text-balance text-3xl font-semibold sm:text-4xl">{title}</h2>
      {intro && <p className="mt-4 text-lg text-text-muted">{intro}</p>}
    </div>
  );
}
