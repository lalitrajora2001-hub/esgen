/* Finance-relevant standards wall, white cards, monochrome black wordmarks.
   Original vector wordmark renderings (acronym set in black), not pixel copies
   of trademarked artwork; drop official SVGs into /public/brand to swap 1:1. */

const INK = "#111827";

const TILES: { k: string; text: string; small?: boolean }[] = [
  { k: "paii", text: "PAII" },
  { k: "nfrd", text: "NFRD" },
  { k: "tcfd", text: "TCFD" },
  { k: "cdp", text: "CDP" },
  { k: "sdr", text: "SDR" },
  { k: "fca", text: "FCA" },
  { k: "sfdr", text: "SFDR" },
  { k: "sbti", text: "SBTi" },
  { k: "secr", text: "SECR" },
  { k: "sasb", text: "SASB" },
  { k: "gri", text: "GRI" },
  { k: "csrd", text: "CSRD" },
  { k: "ifrs", text: "IFRS" },
  { k: "ghg", text: "GHG Protocol", small: true },
  { k: "esos", text: "ESOS" },
  { k: "wri", text: "WRI" },
];

export function FinanceFrameworks() {
  return (
    <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 sm:gap-4 lg:grid-cols-6">
      {TILES.map((t) => (
        <div key={t.k} className="flex min-h-[96px] items-center justify-center rounded-2xl border border-[#e6e8ee] bg-white px-4 py-6 transition-shadow hover:shadow-[0_12px_28px_-18px_rgba(15,23,42,0.5)]">
          <span className={`font-display font-extrabold tracking-tight ${t.small ? "text-base" : "text-xl"}`} style={{ color: INK }}>{t.text}</span>
        </div>
      ))}
    </div>
  );
}
