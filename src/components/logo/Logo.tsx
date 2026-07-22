import { cn } from "@/lib/cn";

/**
 * The real ESGEN wordmark, rendered in the current text colour via a CSS mask.
 * Height comes from the caller's className (defaults to h-6); width follows the
 * artwork aspect ratio.
 */
export function Logo({ className }: { className?: string }) {
  return (
    <span
      role="img"
      aria-label="ESGen"
      className={cn("inline-block h-6 w-auto shrink-0 bg-current align-middle text-[#101318]", className)}
      style={{
        WebkitMaskImage: "url(/brand/esgen-logo.svg)",
        maskImage: "url(/brand/esgen-logo.svg)",
        WebkitMaskRepeat: "no-repeat",
        maskRepeat: "no-repeat",
        WebkitMaskSize: "contain",
        maskSize: "contain",
        WebkitMaskPosition: "left center",
        maskPosition: "left center",
        aspectRatio: "2826 / 810",
      }}
    />
  );
}
