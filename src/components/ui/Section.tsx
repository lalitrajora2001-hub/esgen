import { cn } from "@/lib/cn";

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
  const pad = size === "sm" ? "py-12 sm:py-16" : size === "lg" ? "py-20 sm:py-28" : "py-16 sm:py-24";
  return (
    <section id={id} className={cn("relative", pad, className)}>
      <div className={cn("mx-auto w-full max-w-6xl px-5 sm:px-6", containerClassName)}>{children}</div>
    </section>
  );
}

export function SectionHead({
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
      <h2 className="text-balance text-3xl font-semibold sm:text-4xl">{title}</h2>
      {intro && <p className="mt-4 text-lg text-text-muted">{intro}</p>}
    </div>
  );
}
