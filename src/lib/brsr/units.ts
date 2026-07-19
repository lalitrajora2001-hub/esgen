/**
 * Unit normalisation for the quantitative P6 tables. Clients pick a unit per
 * row (the SEBI format allows it); everything downstream (dashboard, XBRL)
 * works in one base unit per question family, so values are converted on read:
 *   energy -> GJ · water -> kL · GHG -> tCO2e · mass -> MT
 * Unknown or blank units convert with factor 1 (assumed already in base).
 */

type Family = "energy" | "water" | "ghg" | "mass";

const FAMILY_BY_QUESTION: Record<string, Family> = {
  "C.P6.EI.1": "energy",
  "C.P6.EI.3": "water",
  "C.P6.EI.4": "water",
  "C.P6.EI.6": "mass",
  "C.P6.EI.7": "ghg",
  "C.P6.EI.9": "mass",
  "C.P6.LI.2": "ghg",
};

/** Factor to multiply a value by to reach the family's base unit. */
const FACTORS: Record<Family, Record<string, number>> = {
  energy: { GJ: 1, MJ: 0.001, kWh: 0.0036, MWh: 3.6, GWh: 3600, Joules: 1e-9 },
  water: { kL: 1, ML: 1000, m3: 1 },
  ghg: { "MT CO2e": 1, tCO2e: 1, "kg CO2e": 0.001 },
  mass: { MT: 1, tonnes: 1, kg: 0.001 },
};

/** Convert a raw cell value to the question's base unit using the row's unit cell. */
export function toBaseUnit(questionKey: string, unit: unknown, value: number): number {
  const family = FAMILY_BY_QUESTION[questionKey];
  if (!family) return value;
  const u = typeof unit === "string" ? unit.trim() : "";
  const factor = FACTORS[family][u];
  return factor == null ? value : value * factor;
}

export const BASE_UNIT_LABEL: Record<Family, string> = {
  energy: "GJ",
  water: "kL",
  ghg: "tCO2e",
  mass: "MT",
};
