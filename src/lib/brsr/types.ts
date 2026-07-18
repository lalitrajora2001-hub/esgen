/**
 * BRSR framework definition types.
 *
 * The entire BRSR framework is encoded as DATA using these types (see
 * framework/*.ts). Generic renderers turn that data into forms, so adding or
 * amending disclosures is a data change, not new UI. This keeps "all ~1,100
 * data points" maintainable and resilient to SEBI amendments.
 */

export type SectionId = "A" | "B" | "C";
export type Principle = 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9;
export type Indicator = "essential" | "leadership";
export type Period = "current" | "previous";

/** Atomic value types a field/column can hold. */
export type FieldType =
  | "text"
  | "longtext"
  | "number"
  | "percentage"
  | "currency" // INR
  | "date"
  | "year"
  | "boolean"
  | "enum"
  | "url";

/**
 * A derived value is computed, never entered. `ratioPct` and `sum` resolve
 * against sibling keys (columns in the same table row, or fields in the same
 * question). `kpi` defers to the global KPI registry (see calc.ts) which can
 * read across the whole report.
 */
export type Derived =
  | { op: "ratioPct"; num: string; den: string } // 100 * num / den
  | { op: "ratio"; num: string; den: string } // num / den
  | { op: "sum"; keys: string[] }
  | { op: "kpi"; id: string };

export interface FieldDef {
  key: string;
  label: string;
  type: FieldType;
  unit?: string;
  options?: string[]; // enum
  help?: string;
  optional?: boolean;
  derived?: Derived;
}

export interface ColumnDef {
  key: string;
  label: string;
  type: FieldType;
  unit?: string;
  options?: string[];
  derived?: Derived; // computed from sibling columns in the same row
}

export interface RowDef {
  key: string;
  label: string;
  group?: string; // optional heading grouping consecutive rows
  /**
   * Consistency metadata for validation only (not auto-computed): e.g. a total
   * row is `{op:"sum", keys:[partRowKeys]}` so the validator can flag when the
   * entered total does not equal the sum of its parts (in the numeric column).
   */
  check?: { op: "sum"; keys: string[]; col: string };
}

export interface TableDef {
  columns: ColumnDef[];
  /** Fixed, labelled rows (e.g. GHG breakdown). Omit for dynamic tables. */
  rows?: RowDef[];
  /** User adds/removes rows (e.g. subsidiaries list). */
  dynamic?: boolean;
  addLabel?: string;
  /** Table is duplicated for Current FY and Previous FY. */
  perPeriod?: boolean;
}

/** How a question collects its answer. */
export type ResponseKind =
  | "fields" // one or more scalar fields
  | "table" // a table (fixed or dynamic rows)
  | "narrative" // a single long-text answer
  | "boolean" // yes/no (optionally with a details note)
  | "principleGrid"; // Section B: answered per principle P1..P9

export interface QuestionDef {
  /** Globally unique key, also used for storage, e.g. "C.P6.EI.7". */
  key: string;
  /** Human display code, e.g. "P6 - Essential Indicator 7". */
  code?: string;
  section: SectionId;
  principle?: Principle;
  indicator?: Indicator;
  title: string;
  help?: string;
  kind: ResponseKind;
  fields?: FieldDef[]; // kind = "fields"
  table?: TableDef; // kind = "table"
  /** For kind = "boolean": also collect a free-text detail. */
  booleanDetail?: string;
  /** For kind = "principleGrid": the per-principle cell type. */
  gridCell?: { type: FieldType; options?: string[] };
  /** Part of the assured BRSR Core subset. */
  isCore?: boolean;
  /** Question wants both current and previous FY (non-table cases). */
  requiresPrevYear?: boolean;
  /** Show an evidence upload slot. */
  evidence?: boolean;
  evidenceHint?: string;
  /**
   * SEBI prints under each P6 quantitative table: "Indicate if any independent
   * assessment / evaluation / assurance has been carried out by an external
   * agency? (Y/N) If yes, name of the agency." Setting this renders that field.
   */
  assuranceNote?: boolean;
}

/** A logical group of questions shown together in the UI. */
export interface SubsectionDef {
  key: string;
  title: string;
  description?: string;
  questions: QuestionDef[];
}

/** A navigable unit: Section A/B, or one principle within Section C. */
export interface ModuleDef {
  key: string; // e.g. "A", "B", "C.P6"
  navLabel: string; // e.g. "Principle 6: Environment"
  section: SectionId;
  principle?: Principle;
  title: string;
  intro?: string;
  subsections: SubsectionDef[];
}

/** The complete framework for one version. */
export interface FrameworkDef {
  version: string; // e.g. "BRSR-2024"
  label: string;
  modules: ModuleDef[];
}
