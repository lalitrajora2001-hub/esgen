import type { ModuleDef } from "@/lib/brsr/types";

export const modulesP6: ModuleDef[] = [
  {
    key: "C.P6",
    navLabel: "Principle 6: Environment",
    section: "C",
    principle: 6,
    title:
      "Businesses should respect and make efforts to protect and restore the environment",
    intro:
      "Principle 6 covers the entity's environmental performance: energy, water, air emissions, greenhouse gases, waste, ecologically sensitive areas, environmental compliance and value-chain impacts. Most quantitative disclosures require both the current and previous financial year, and several fall within the assured BRSR Core.",
    subsections: [
      {
        key: "C.P6.EI",
        title: "Essential Indicators",
        questions: [
          // EI-1 — Energy consumption & intensity (Core)
          {
            key: "C.P6.EI.1",
            code: "P6 - Essential Indicator 1",
            section: "C",
            principle: 6,
            indicator: "essential",
            title:
              "Details of total energy consumption (in Joules or multiples) and energy intensity",
            isCore: true,
            kind: "table",
            evidence: true,
            evidenceHint:
              "Utility/electricity bills, fuel purchase records, meter logs, renewable energy certificates (RECs), energy audit report",
            assuranceNote: true,
            table: {
              perPeriod: true,
              columns: [
                { key: "param", label: "Parameter", type: "text" },
                { key: "unit", label: "Unit", type: "enum", options: ["GJ","MJ","kWh","MWh","GWh","Joules"] },
                { key: "value", label: "Value", type: "number" },
              ],
              rows: [
                {
                  key: "renew_electricity",
                  label:
                    "Total electricity consumption from renewable sources (A)",
                  group: "From renewable sources",
                },
                {
                  key: "renew_fuel",
                  label: "Total fuel consumption from renewable sources (B)",
                  group: "From renewable sources",
                },
                {
                  key: "renew_other",
                  label:
                    "Energy consumption through other sources - renewable (C)",
                  group: "From renewable sources",
                },
                {
                  key: "renew_total",
                  label:
                    "Total energy consumed from renewable sources (A+B+C)",
                  group: "From renewable sources",
                  check: { op: "sum", keys: ["renew_electricity", "renew_fuel", "renew_other"], col: "value" },
                },
                {
                  key: "nonrenew_electricity",
                  label:
                    "Total electricity consumption from non-renewable sources (D)",
                  group: "From non-renewable sources",
                },
                {
                  key: "nonrenew_fuel",
                  label:
                    "Total fuel consumption from non-renewable sources (E)",
                  group: "From non-renewable sources",
                },
                {
                  key: "nonrenew_other",
                  label:
                    "Energy consumption through other sources - non-renewable (F)",
                  group: "From non-renewable sources",
                },
                {
                  key: "nonrenew_total",
                  label:
                    "Total energy consumed from non-renewable sources (D+E+F)",
                  group: "From non-renewable sources",
                  check: { op: "sum", keys: ["nonrenew_electricity", "nonrenew_fuel", "nonrenew_other"], col: "value" },
                },
                {
                  key: "total_energy",
                  label: "Total energy consumed (A+B+C+D+E+F)",
                  group: "Total",
                  check: { op: "sum", keys: ["renew_total", "nonrenew_total"], col: "value" },
                },
                {
                  key: "intensity_turnover",
                  label:
                    "Energy intensity per rupee of turnover (Total energy consumed / Revenue from operations)",
                  group: "Energy intensity",
                },
                {
                  key: "intensity_ppp",
                  label:
                    "Energy intensity per rupee of turnover adjusted for Purchasing Power Parity (PPP) (Total energy consumed / Revenue from operations adjusted for PPP)",
                  group: "Energy intensity",
                },
                {
                  key: "intensity_output",
                  label:
                    "Energy intensity in terms of physical output",
                  group: "Energy intensity",
                },
                {
                  key: "intensity_optional",
                  label:
                    "Energy intensity (optional) - the relevant metric may be selected by the entity",
                  group: "Energy intensity",
                },
              ],
            },
          },

          // EI-2 — Designated Consumer / PAT
          {
            key: "C.P6.EI.2",
            code: "P6 - Essential Indicator 2",
            section: "C",
            principle: 6,
            indicator: "essential",
            title:
              "Whether the entity has any sites/facilities identified as designated consumers (DCs) under the Performance, Achieve and Trade (PAT) Scheme of the Government of India",
            kind: "boolean",
            booleanDetail:
              "If yes, disclose whether the targets set under the PAT scheme have been achieved. In case targets have not been achieved, provide the remedial action taken, if any.",
          },

          // EI-3 — Water withdrawal, consumption & intensity (Core)
          {
            key: "C.P6.EI.3",
            code: "P6 - Essential Indicator 3",
            section: "C",
            principle: 6,
            indicator: "essential",
            title: "Details of water withdrawal, consumption and intensity",
            isCore: true,
            kind: "table",
            evidence: true,
            evidenceHint:
              "Water meter logs, water bills, consent-to-operate, water audit report, third-party water supply invoices",
            assuranceNote: true,
            table: {
              perPeriod: true,
              columns: [
                { key: "param", label: "Parameter", type: "text" },
                { key: "unit", label: "Unit", type: "enum", options: ["kL","ML","m3"] },
                { key: "value", label: "Value", type: "number" },
              ],
              rows: [
                {
                  key: "wd_surface",
                  label: "Water withdrawal by source: (i) Surface water",
                  group: "Water withdrawal by source (in kilolitres)",
                },
                {
                  key: "wd_ground",
                  label: "(ii) Groundwater",
                  group: "Water withdrawal by source (in kilolitres)",
                },
                {
                  key: "wd_thirdparty",
                  label: "(iii) Third party water",
                  group: "Water withdrawal by source (in kilolitres)",
                },
                {
                  key: "wd_seawater",
                  label: "(iv) Seawater / desalinated water",
                  group: "Water withdrawal by source (in kilolitres)",
                },
                {
                  key: "wd_others",
                  label: "(v) Others",
                  group: "Water withdrawal by source (in kilolitres)",
                },
                {
                  key: "wd_total",
                  label:
                    "Total volume of water withdrawal (in kilolitres) (i + ii + iii + iv + v)",
                  group: "Water withdrawal by source (in kilolitres)",
                },
                {
                  key: "consumption_total",
                  label: "Total volume of water consumption (in kilolitres)",
                  group: "Water consumption",
                },
                {
                  key: "intensity_turnover",
                  label:
                    "Water intensity per rupee of turnover (Total water consumption / Revenue from operations)",
                  group: "Water intensity",
                },
                {
                  key: "intensity_ppp",
                  label:
                    "Water intensity per rupee of turnover adjusted for Purchasing Power Parity (PPP) (Total water consumption / Revenue from operations adjusted for PPP)",
                  group: "Water intensity",
                },
                {
                  key: "intensity_output",
                  label: "Water intensity in terms of physical output",
                  group: "Water intensity",
                },
                {
                  key: "intensity_optional",
                  label:
                    "Water intensity (optional) - the relevant metric may be selected by the entity",
                  group: "Water intensity",
                },
              ],
            },
          },

          // EI-4 — Water discharge by destination & treatment
          {
            key: "C.P6.EI.4",
            code: "P6 - Essential Indicator 4",
            section: "C",
            principle: 6,
            indicator: "essential",
            title:
              "Provide the following details related to water discharged (in kilolitres)",
            kind: "table",
            evidence: true,
            evidenceHint:
              "Effluent discharge meter logs, consent-to-operate, ETP/STP treatment records, pollution control board returns",
            assuranceNote: true,
            table: {
              perPeriod: true,
              columns: [
                { key: "param", label: "Parameter", type: "text" },
                { key: "unit", label: "Unit", type: "enum", options: ["kL","ML","m3"] },
                { key: "value", label: "Value", type: "number" },
              ],
              rows: [
                {
                  key: "surface_none",
                  label:
                    "Water discharge to Surface water - No treatment",
                  group: "(i) To Surface water",
                },
                {
                  key: "surface_treated",
                  label:
                    "Water discharge to Surface water - With treatment (specify level of treatment)",
                  group: "(i) To Surface water",
                },
                {
                  key: "ground_none",
                  label: "Water discharge to Groundwater - No treatment",
                  group: "(ii) To Groundwater",
                },
                {
                  key: "ground_treated",
                  label:
                    "Water discharge to Groundwater - With treatment (specify level of treatment)",
                  group: "(ii) To Groundwater",
                },
                {
                  key: "seawater_none",
                  label: "Water discharge to Seawater - No treatment",
                  group: "(iii) To Seawater",
                },
                {
                  key: "seawater_treated",
                  label:
                    "Water discharge to Seawater - With treatment (specify level of treatment)",
                  group: "(iii) To Seawater",
                },
                {
                  key: "thirdparty_none",
                  label: "Water sent to third-parties - No treatment",
                  group: "(iv) Sent to third-parties",
                },
                {
                  key: "thirdparty_treated",
                  label:
                    "Water sent to third-parties - With treatment (specify level of treatment)",
                  group: "(iv) Sent to third-parties",
                },
                {
                  key: "others_none",
                  label: "Water discharge to Others - No treatment",
                  group: "(v) Others",
                },
                {
                  key: "others_treated",
                  label:
                    "Water discharge to Others - With treatment (specify level of treatment)",
                  group: "(v) Others",
                },
                {
                  key: "total_discharged",
                  label:
                    "Total water discharged (in kilolitres)",
                  group: "Total",
                },
              ],
            },
          },

          // EI-5 — Zero Liquid Discharge
          {
            key: "C.P6.EI.5",
            code: "P6 - Essential Indicator 5",
            section: "C",
            principle: 6,
            indicator: "essential",
            title:
              "Has the entity implemented a mechanism for Zero Liquid Discharge?",
            kind: "boolean",
            booleanDetail:
              "If yes, provide details of its coverage and implementation.",
          },

          // EI-6 — Air emissions other than GHG
          {
            key: "C.P6.EI.6",
            code: "P6 - Essential Indicator 6",
            section: "C",
            principle: 6,
            indicator: "essential",
            title:
              "Please provide details of air emissions (other than GHG emissions) by the entity",
            kind: "table",
            evidence: true,
            evidenceHint:
              "Stack/ambient emission monitoring reports, CPCB/SPCB analyser calibration records, emission-factor sources, consent-to-operate",
            assuranceNote: true,
            table: {
              perPeriod: true,
              columns: [
                { key: "param", label: "Parameter", type: "text" },
                { key: "unit", label: "Unit", type: "enum", options: ["MT","tonnes","kg"] },
                { key: "value", label: "Value", type: "number" },
              ],
              rows: [
                { key: "nox", label: "NOx" },
                { key: "sox", label: "SOx" },
                { key: "pm", label: "Particulate matter (PM)" },
                {
                  key: "pop",
                  label: "Persistent organic pollutants (POP)",
                },
                { key: "voc", label: "Volatile organic compounds (VOC)" },
                { key: "hap", label: "Hazardous air pollutants (HAP)" },
                { key: "others", label: "Others - please specify" },
              ],
            },
          },

          // EI-7 — GHG Scope 1 & 2 & intensity (Core)
          {
            key: "C.P6.EI.7",
            code: "P6 - Essential Indicator 7",
            section: "C",
            principle: 6,
            indicator: "essential",
            title:
              "Details of greenhouse gas (GHG) emissions (Scope 1 and Scope 2 emissions) and their intensity",
            isCore: true,
            kind: "table",
            evidence: true,
            evidenceHint:
              "GHG inventory, emission-factor sources (IPCC/CEA grid factor), fuel/energy consumption records, assurance statement",
            assuranceNote: true,
            table: {
              perPeriod: true,
              columns: [
                { key: "param", label: "Parameter", type: "text" },
                { key: "unit", label: "Unit", type: "enum", options: ["MT CO2e","tCO2e","kg CO2e"] },
                { key: "value", label: "Value", type: "number" },
              ],
              rows: [
                {
                  key: "scope1",
                  label:
                    "Total Scope 1 emissions (Break-up of the GHG into CO2, CH4, N2O, HFCs, PFCs, SF6, NF3, if available) (Metric tonnes of CO2 equivalent)",
                },
                {
                  key: "scope2",
                  label:
                    "Total Scope 2 emissions (Break-up of the GHG into CO2, CH4, N2O, HFCs, PFCs, SF6, NF3, if available) (Metric tonnes of CO2 equivalent)",
                },
                {
                  key: "intensity_turnover",
                  label:
                    "Total Scope 1 and Scope 2 emissions per rupee of turnover",
                },
                {
                  key: "intensity_ppp",
                  label:
                    "Total Scope 1 and Scope 2 emission intensity per rupee of turnover adjusted for Purchasing Power Parity (PPP)",
                },
                {
                  key: "intensity_output",
                  label:
                    "Total Scope 1 and Scope 2 emission intensity in terms of physical output",
                },
                {
                  key: "intensity_optional",
                  label:
                    "Total Scope 1 and Scope 2 emission intensity (optional) - the relevant metric may be selected by the entity",
                },
              ],
            },
          },

          // EI-8 — GHG reduction projects
          {
            key: "C.P6.EI.8",
            code: "P6 - Essential Indicator 8",
            section: "C",
            principle: 6,
            indicator: "essential",
            title:
              "Does the entity have any project related to reducing Green House Gas emission?",
            kind: "boolean",
            booleanDetail:
              "If yes, then provide details.",
          },

          // EI-9 — Waste management (Core)
          {
            key: "C.P6.EI.9",
            code: "P6 - Essential Indicator 9",
            section: "C",
            principle: 6,
            indicator: "essential",
            title: "Provide details related to waste management by the entity",
            isCore: true,
            kind: "table",
            evidence: true,
            evidenceHint:
              "Waste manifests, Form-10/annual returns to SPCB, authorized recycler/TSDF certificates, weighbridge records",
            assuranceNote: true,
            table: {
              perPeriod: true,
              columns: [
                { key: "param", label: "Parameter", type: "text" },
                { key: "unit", label: "Unit", type: "enum", options: ["MT","tonnes","kg"] },
                { key: "value", label: "Value", type: "number" },
              ],
              rows: [
                {
                  key: "gen_plastic",
                  label: "Plastic waste (A)",
                  group: "Total waste generated (in metric tonnes)",
                },
                {
                  key: "gen_ewaste",
                  label: "E-waste (B)",
                  group: "Total waste generated (in metric tonnes)",
                },
                {
                  key: "gen_biomedical",
                  label: "Bio-medical waste (C)",
                  group: "Total waste generated (in metric tonnes)",
                },
                {
                  key: "gen_construction",
                  label: "Construction and demolition waste (D)",
                  group: "Total waste generated (in metric tonnes)",
                },
                {
                  key: "gen_battery",
                  label: "Battery waste (E)",
                  group: "Total waste generated (in metric tonnes)",
                },
                {
                  key: "gen_radioactive",
                  label: "Radioactive waste (F)",
                  group: "Total waste generated (in metric tonnes)",
                },
                {
                  key: "gen_other_hazardous",
                  label: "Other Hazardous waste. Please specify, if any. (G)",
                  group: "Total waste generated (in metric tonnes)",
                },
                {
                  key: "gen_other_nonhazardous",
                  label:
                    "Other Non-hazardous waste generated (H). Please specify, if any. (Break-up by composition i.e. by materials relevant to the sector)",
                  group: "Total waste generated (in metric tonnes)",
                },
                {
                  key: "gen_total",
                  label:
                    "Total (A+B+C+D+E+F+G+H)",
                  group: "Total waste generated (in metric tonnes)",
                },
                {
                  key: "intensity_turnover",
                  label: "Waste intensity per rupee of turnover",
                  group: "Waste intensity",
                },
                {
                  key: "intensity_ppp",
                  label:
                    "Waste intensity per rupee of turnover adjusted for Purchasing Power Parity (PPP)",
                  group: "Waste intensity",
                },
                {
                  key: "intensity_output",
                  label: "Waste intensity in terms of physical output",
                  group: "Waste intensity",
                },
                {
                  key: "intensity_optional",
                  label:
                    "Waste intensity (optional) - the relevant metric may be selected by the entity",
                  group: "Waste intensity",
                },
                {
                  key: "recovered_recycled",
                  label: "(i) Recycled",
                  group:
                    "For each category of waste generated, total waste recovered through recycling, re-using or other recovery operations (in metric tonnes)",
                },
                {
                  key: "recovered_reused",
                  label: "(ii) Re-used",
                  group:
                    "For each category of waste generated, total waste recovered through recycling, re-using or other recovery operations (in metric tonnes)",
                },
                {
                  key: "recovered_other",
                  label: "(iii) Other recovery operations",
                  group:
                    "For each category of waste generated, total waste recovered through recycling, re-using or other recovery operations (in metric tonnes)",
                },
                {
                  key: "recovered_total",
                  label: "Total recovered (i + ii + iii)",
                  group:
                    "For each category of waste generated, total waste recovered through recycling, re-using or other recovery operations (in metric tonnes)",
                },
                {
                  key: "disposed_incineration",
                  label: "(i) Incineration",
                  group:
                    "For each category of waste generated, total waste disposed by nature of disposal method (in metric tonnes)",
                },
                {
                  key: "disposed_landfilling",
                  label: "(ii) Landfilling",
                  group:
                    "For each category of waste generated, total waste disposed by nature of disposal method (in metric tonnes)",
                },
                {
                  key: "disposed_other",
                  label: "(iii) Other disposal operations",
                  group:
                    "For each category of waste generated, total waste disposed by nature of disposal method (in metric tonnes)",
                },
                {
                  key: "disposed_total",
                  label: "Total disposed (i + ii + iii)",
                  group:
                    "For each category of waste generated, total waste disposed by nature of disposal method (in metric tonnes)",
                },
              ],
            },
          },

          // EI-10 — Waste management practices narrative
          {
            key: "C.P6.EI.10",
            code: "P6 - Essential Indicator 10",
            section: "C",
            principle: 6,
            indicator: "essential",
            title:
              "Briefly describe the waste management practices adopted in your establishments. Describe the strategy adopted by your company to reduce usage of hazardous and toxic chemicals in your products and processes and the practices adopted to manage such wastes",
            kind: "narrative",
          },

          // EI-11 — Ecologically sensitive areas
          {
            key: "C.P6.EI.11",
            code: "P6 - Essential Indicator 11",
            section: "C",
            principle: 6,
            indicator: "essential",
            title:
              "If the entity has operations/offices in/around ecologically sensitive areas (such as national parks, wildlife sanctuaries, biosphere reserves, wetlands, biodiversity hotspots, forests, coastal regulation zones etc.) where environmental approvals / clearances are required, please specify details",
            kind: "table",
            evidence: true,
            evidenceHint:
              "Environmental clearances, forest/wildlife/CRZ approvals, pollution-board consents, compliance certificates",
            table: {
              dynamic: true,
              addLabel: "Add location",
              columns: [
                {
                  key: "location",
                  label: "Location of operations / offices",
                  type: "text",
                },
                {
                  key: "type",
                  label: "Type of operations",
                  type: "text",
                },
                {
                  key: "compliance",
                  label:
                    "Whether the conditions of environmental approval / clearance are being complied with? (Y/N) If no, the reasons thereof and corrective action taken, if any",
                  type: "text",
                },
              ],
            },
          },

          // EI-12 — EIA of projects in current FY
          {
            key: "C.P6.EI.12",
            code: "P6 - Essential Indicator 12",
            section: "C",
            principle: 6,
            indicator: "essential",
            title:
              "Details of environmental impact assessments of projects undertaken by the entity based on applicable laws, in the current financial year",
            kind: "table",
            evidence: true,
            evidenceHint:
              "EIA reports, EIA notification/clearance letters, public-domain disclosure links, independent agency accreditation",
            table: {
              dynamic: true,
              addLabel: "Add EIA",
              columns: [
                {
                  key: "project",
                  label: "Name and brief details of project",
                  type: "text",
                },
                {
                  key: "eia_notification",
                  label: "EIA Notification No.",
                  type: "text",
                },
                { key: "date", label: "Date", type: "date" },
                {
                  key: "external_agency",
                  label:
                    "Whether conducted by independent external agency (Yes / No)",
                  type: "boolean",
                },
                {
                  key: "public_domain",
                  label:
                    "Results communicated in public domain (Yes / No)",
                  type: "boolean",
                },
                { key: "weblink", label: "Relevant Web link", type: "url" },
              ],
            },
          },

          // EI-13 — Environmental law compliance
          {
            key: "C.P6.EI.13",
            code: "P6 - Essential Indicator 13",
            section: "C",
            principle: 6,
            indicator: "essential",
            title:
              "Is the entity compliant with the applicable environmental law/ regulations/ guidelines in India, such as the Water (Prevention and Control of Pollution) Act, Air (Prevention and Control of Pollution) Act, Environment protection act and rules thereunder?",
            kind: "boolean",
            booleanDetail:
              "If not, the details of all such non-compliances are captured in the next question.",
            evidence: true,
            evidenceHint:
              "Consents/authorisations, compliance certificates, show-cause notices, orders of regulatory agencies or courts",
          },
          {
            key: "C.P6.EI.13b",
            code: "P6 - Essential Indicator 13 (details)",
            section: "C",
            principle: 6,
            indicator: "essential",
            title:
              "If not compliant (Essential Indicator 13), provide details of all such non-compliances",
            kind: "table",
            table: {
              dynamic: true,
              addLabel: "Add non-compliance",
              columns: [
                { key: "law", label: "Specify the law / regulation / guidelines which was not complied with", type: "text" },
                { key: "noncompliance", label: "Provide details of the non-compliance", type: "text" },
                { key: "action", label: "Any fines / penalties / action taken by regulatory agencies such as pollution control boards or by courts", type: "text" },
                { key: "corrective", label: "Corrective action taken, if any", type: "text" },
              ],
            },
          },
        ],
      },
      {
        key: "C.P6.LI",
        title: "Leadership Indicators",
        questions: [
          // LI-1 — Water in stress areas
          {
            key: "C.P6.LI.1",
            code: "P6 - Leadership Indicator 1",
            section: "C",
            principle: 6,
            indicator: "leadership",
            title:
              "Water withdrawal, consumption and discharge in areas of water stress (in kilolitres): For each facility / plant located in areas of water stress, provide the following information",
            help:
              "For all facilities located in areas of water stress, provide the total volume of water withdrawal by source, total water consumption, and water discharge by destination and level of treatment, along with the water intensity per rupee of turnover.",
            kind: "table",
            evidence: true,
            evidenceHint:
              "Facility water meter logs, water stress assessment (e.g. WRI Aqueduct/CGWB), consent-to-operate, discharge treatment records",
            assuranceNote: true,
            table: {
              perPeriod: true,
              dynamic: true,
              addLabel: "Add water-stress facility",
              columns: [
                { key: "area", label: "Name of the area", type: "text" },
                { key: "nature", label: "Nature of operations", type: "text" },
                { key: "withdrawal_total", label: "Total water withdrawal (kL)", type: "number", unit: "kL" },
                { key: "consumption_total", label: "Total water consumption (kL)", type: "number", unit: "kL" },
                { key: "intensity_turnover", label: "Water intensity per rupee of turnover", type: "number" },
                { key: "discharge_untreated", label: "Water discharged - no treatment (kL)", type: "number", unit: "kL" },
                { key: "discharge_treated", label: "Water discharged - with treatment (kL)", type: "number", unit: "kL" },
                { key: "discharge_total", label: "Total water discharged (kL)", type: "number", unit: "kL" },
              ],
            },
          },

          // LI-2 — Scope 3 emissions
          {
            key: "C.P6.LI.2",
            code: "P6 - Leadership Indicator 2",
            section: "C",
            principle: 6,
            indicator: "leadership",
            title:
              "Please provide details of total Scope 3 emissions and its intensity",
            isCore: false,
            kind: "table",
            evidence: true,
            evidenceHint:
              "Value-chain GHG data, supplier emissions data, Scope 3 category calculations, emission-factor sources, assurance statement",
            assuranceNote: true,
            table: {
              perPeriod: true,
              columns: [
                { key: "param", label: "Parameter", type: "text" },
                { key: "unit", label: "Unit", type: "enum", options: ["MT CO2e","tCO2e","kg CO2e"] },
                { key: "value", label: "Value", type: "number" },
              ],
              rows: [
                {
                  key: "scope3",
                  label:
                    "Total Scope 3 emissions (Break-up of the GHG into CO2, CH4, N2O, HFCs, PFCs, SF6, NF3, if available) (Metric tonnes of CO2 equivalent)",
                },
                {
                  key: "intensity_turnover",
                  label: "Total Scope 3 emissions per rupee of turnover",
                },
                {
                  key: "intensity_optional",
                  label:
                    "Total Scope 3 emission intensity (optional) - the relevant metric may be selected by the entity",
                },
              ],
            },
          },

          // LI-3 — Biodiversity impact & remediation
          {
            key: "C.P6.LI.3",
            code: "P6 - Leadership Indicator 3",
            section: "C",
            principle: 6,
            indicator: "leadership",
            title:
              "With respect to the ecologically sensitive areas reported at Question 11 of Essential Indicators above, provide details of significant direct and indirect impact of the entity on biodiversity in such areas along-with prevention and remediation activities",
            kind: "narrative",
          },

          // LI-4 — Resource efficiency initiatives
          {
            key: "C.P6.LI.4",
            code: "P6 - Leadership Indicator 4",
            section: "C",
            principle: 6,
            indicator: "leadership",
            title:
              "If the entity has undertaken any specific initiatives or used innovative technology or solutions to improve resource efficiency, or reduce impact due to emissions / effluent discharge / waste generated, please provide details of the same as well as outcome of such initiatives",
            kind: "table",
            table: {
              dynamic: true,
              addLabel: "Add initiative",
              columns: [
                {
                  key: "initiative",
                  label: "Initiative undertaken",
                  type: "text",
                },
                {
                  key: "details",
                  label:
                    "Details of the initiative (Web-link, if any, may be provided along-with summary)",
                  type: "text",
                },
                {
                  key: "outcome",
                  label: "Outcome of the initiative",
                  type: "text",
                },
              ],
            },
          },

          // LI-5 — Business continuity / disaster management plan
          {
            key: "C.P6.LI.5",
            code: "P6 - Leadership Indicator 5",
            section: "C",
            principle: 6,
            indicator: "leadership",
            title:
              "Does the entity have a business continuity and disaster management plan?",
            kind: "boolean",
            booleanDetail:
              "Give details in 100 words / web link.",
          },

          // LI-6 — Adverse environmental impact from value chain
          {
            key: "C.P6.LI.6",
            code: "P6 - Leadership Indicator 6",
            section: "C",
            principle: 6,
            indicator: "leadership",
            title:
              "Disclose any significant adverse impact to the environment, arising from the value chain of the entity. What mitigation or adaptation measures have been taken by the entity in this regard",
            kind: "narrative",
          },

          // LI-7 — % value chain partners assessed
          {
            key: "C.P6.LI.7",
            code: "P6 - Leadership Indicator 7",
            section: "C",
            principle: 6,
            indicator: "leadership",
            title:
              "Percentage of value chain partners (by value of business done with such partners) that were assessed for environmental impacts",
            kind: "fields",
            fields: [
              {
                key: "pct_assessed",
                label:
                  "Percentage of value chain partners (by value of business done with such partners) assessed for environmental impacts",
                type: "percentage",
                unit: "%",
              },
            ],
          },

          // LI-8 — Green Credits (Dec 2024 amendment)
          {
            key: "C.P6.LI.8",
            code: "P6 - Leadership Indicator 8",
            section: "C",
            principle: 6,
            indicator: "leadership",
            title:
              "Provide details of the scope and coverage of any Total Green Credits generated or procured by the entity and by its top ten (in terms of value of purchases and sales, respectively) value chain partners",
            kind: "table",
            evidence: true,
            evidenceHint:
              "Green Credit certificates issued under the Green Credit Programme (GCP), registry records, value-chain partner declarations",
            table: {
              columns: [
                { key: "generated", label: "Green Credits generated", type: "number" },
                { key: "procured", label: "Green Credits procured", type: "number" },
              ],
              rows: [
                { key: "entity", label: "By the listed entity" },
                { key: "partners", label: "By the top ten value chain partners (by value of purchases and sales, respectively)" },
              ],
            },
          },
        ],
      },
    ],
  },
];
