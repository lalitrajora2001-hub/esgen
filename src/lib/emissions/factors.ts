/**
 * Emission factors for the ESGen BRSR tool — INDIA.
 *
 * IMPORTANT (honesty): these are INDICATIVE reference values aligned to Indian
 * sources (CEA CO2 Baseline Database for the power sector; IPCC 2006 fuel
 * combustion factors as used by the India GHG Program). They let the tool
 * convert raw activity data to tCO2e. They are NOT a substitute for the current
 * official factor for the entity's circumstances (state/DISCOM grid factor,
 * fuel calorific value, supplier-specific data). The UI must always say so.
 *
 * Value is always "kg CO2e per <unit>".
 */

export type Scope = 1 | 2 | 3;

export interface EmissionFactor {
  id: string;
  scope: Scope;
  category: string;
  activity: string;
  unit: string;
  kgco2ePerUnit: number;
  source: string;
  year: number;
  note?: string;
}

const CEA = "CEA CO2 Baseline Database v21.0 (weighted avg, FY2024-25)";
const IPCC = "IPCC 2006 Guidelines (cross-checked DEFRA 2024)";
const YEAR = 2024;

/** IPCC AR5 100-year global warming potentials, for Scope 1 gas break-up (kg CO2e per kg of gas). */
export const GWP_AR5: Record<string, number> = {
  CO2: 1,
  CH4: 28,
  N2O: 265,
  SF6: 23500,
  NF3: 16100,
  "HFC-134a": 1300,
};

export const EMISSION_FACTORS: EmissionFactor[] = [
  // ---- Scope 1: direct emissions (fuel combustion) -------------------------
  {
    id: "s1-diesel-litre",
    scope: 1,
    category: "Mobile / stationary combustion",
    activity: "Diesel",
    unit: "litre",
    kgco2ePerUnit: 2.68,
    source: IPCC,
    year: YEAR,
  },
  {
    id: "s1-petrol-litre",
    scope: 1,
    category: "Mobile combustion",
    activity: "Petrol / gasoline",
    unit: "litre",
    kgco2ePerUnit: 2.31,
    source: IPCC,
    year: YEAR,
  },
  {
    id: "s1-natural-gas-kwh",
    scope: 1,
    category: "Stationary combustion",
    activity: "Natural gas (energy basis)",
    unit: "kWh",
    kgco2ePerUnit: 0.1823,
    source: IPCC,
    year: YEAR,
    note: "Energy basis (GCV) is the robust option. If you only have standard cubic metres, ~1 scm ≈ 10.5 kWh (composition-dependent).",
  },
  {
    id: "s1-lpg-kg",
    scope: 1,
    category: "Stationary combustion",
    activity: "LPG",
    unit: "kg",
    kgco2ePerUnit: 2.98,
    source: IPCC,
    year: YEAR,
  },
  {
    id: "s1-furnace-oil-litre",
    scope: 1,
    category: "Stationary combustion",
    activity: "Furnace oil / fuel oil",
    unit: "litre",
    kgco2ePerUnit: 3.10,
    source: IPCC,
    year: YEAR,
  },
  {
    id: "s1-coal-kg",
    scope: 1,
    category: "Stationary combustion",
    activity: "Coal, Indian non-coking (indicative)",
    unit: "kg",
    kgco2ePerUnit: 1.6,
    source: IPCC,
    year: YEAR,
    note: "Indicative only. Indian non-coking coal is high-ash: CO2 ranges ~1.4-1.8 kg/kg by grade (G1-G17). Use your coal's actual grade / calorific value.",
  },

  // ---- Scope 2: purchased electricity --------------------------------------
  {
    id: "s2-electricity-kwh",
    scope: 2,
    category: "Purchased electricity",
    activity: "India grid electricity",
    unit: "kWh",
    kgco2ePerUnit: 0.7117,
    source: CEA,
    year: YEAR,
    note: "CEA national weighted-average grid factor (FY2024-25). Use your state / DISCOM or a supplier-specific (market-based) factor where available. CEA revises this yearly.",
  },

  // ---- Scope 3: business travel (subset) -----------------------------------
  {
    id: "s3-car-km",
    scope: 3,
    category: "Business travel",
    activity: "Car (average)",
    unit: "km",
    kgco2ePerUnit: 0.18,
    source: IPCC,
    year: YEAR,
    note: "Indicative per vehicle-km.",
  },
  {
    id: "s3-rail-km",
    scope: 3,
    category: "Business travel",
    activity: "Rail",
    unit: "passenger-km",
    kgco2ePerUnit: 0.008,
    source: IPCC,
    year: YEAR,
    note: "Indian electrified rail is low-carbon; indicative.",
  },
  {
    id: "s3-flight-domestic-km",
    scope: 3,
    category: "Business travel",
    activity: "Flight, domestic",
    unit: "passenger-km",
    kgco2ePerUnit: 0.158,
    source: IPCC,
    year: YEAR,
  },
];

export const FACTORS_SOURCE_LABEL = `${CEA} + ${IPCC}, ${YEAR} (indicative)`;

export function getFactor(id: string): EmissionFactor | undefined {
  return EMISSION_FACTORS.find((f) => f.id === id);
}

export const SCOPE_LABELS: Record<Scope, string> = {
  1: "Scope 1 (direct)",
  2: "Scope 2 (purchased energy)",
  3: "Scope 3 (value chain)",
};
