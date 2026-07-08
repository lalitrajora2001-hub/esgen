import { cn } from "@/lib/cn";

/**
 * ESGen logo. Renders the real vector artwork from /public/brand via a CSS mask,
 * so the mark takes the current text colour (white on the dark canvas) and stays sharp
 * at any size. Height comes from the caller's className; width derives from the aspect ratio.
 */
function maskStyle(url: string, ratio: string): React.CSSProperties {
  return {
    WebkitMaskImage: `url(${url})`,
    maskImage: `url(${url})`,
    WebkitMaskRepeat: "no-repeat",
    maskRepeat: "no-repeat",
    WebkitMaskSize: "contain",
    maskSize: "contain",
    WebkitMaskPosition: "left center",
    maskPosition: "left center",
    aspectRatio: ratio,
  };
}

/** Full ESGEN wordmark. */
export function Wordmark({ className }: { className?: string }) {
  return (
    <span
      role="img"
      aria-label="ESGEN"
      className={cn("inline-block shrink-0 bg-current align-middle", className)}
      style={maskStyle("/brand/esgen-logo.svg", "2826 / 810")}
    />
  );
}

/** The E symbol, the collapsed state of the wordmark. */
export function Symbol({ className }: { className?: string }) {
  return (
    <span
      role="img"
      aria-label="ESGen"
      className={cn("inline-block shrink-0 bg-current align-middle", className)}
      style={maskStyle("/brand/esgen-symbol.svg", "529 / 375")}
    />
  );
}
