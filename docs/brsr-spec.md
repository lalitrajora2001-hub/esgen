# BRSR — Build-Ready Data Specification (reference)

Authoritative spec compiled from SEBI's official BRSR format (Annexure II), the
BRSR Core circular (Annexure I, 12 July 2023), the NGRBC 9 principles, and the
Dec 2024 / Mar 2025 amendments. Cross-checked against SEBI circulars, KPMG First
Notes, and taxguru. Used to design the tool's sections, formulas, and evidence
slots. See the build for how these map to tables and forms.

Key framework facts:
- Legal basis: SEBI LODR Reg. 34(2)(f). Format updated by SEBI/HO/CFD/CFD-SEC-2/P/CIR/2023/122 (12 Jul 2023).
- Structure: Section A (General Disclosures), Section B (Management & Process, mapped to 9 principles), Section C (Principle-wise Performance: Essential + Leadership indicators).
- BRSR Core = 9 assured attributes (GHG/energy/water/waste intensities, LTIFR, wage/gender KPIs, job creation, openness of business, etc.).
- ~1,100+ atomic data points; most quantitative tables have Current-FY + Previous-FY columns.
- Recommended model: definition-driven (versioned framework template) + typed response store with a `period` (current/previous) discriminator, normalized tables for the heavy quantitative Core domains, polymorphic evidence attachments, and a materialized derived_kpi table.

Full spec text is tracked in git history / the research task output. Core formulas:
- GHG intensity = (Scope1 + Scope2) / Revenue (and / (Revenue ÷ PPP)).
- Energy intensity = Total energy / Revenue (and PPP-adjusted).
- Water consumption intensity = Total water consumption / Revenue (and PPP).
- Waste intensity = Total waste generated / Revenue (and PPP).
- LTIFR = (Lost-time injuries × 1,000,000) / Total hours worked (Employees and Workers separately).
- % renewable energy = renewable energy / total energy.
- Days of accounts payable = (Accounts payable × 365) / Cost of goods/services procured.
- Female wage share, POSH %, MSME sourcing %, job creation by RBI location class, data-breach ratio, etc.

PPP factor: per-report input (World Bank/IMF USD/INR), not a constant.
Amendment flags: value-chain threshold changed from 75% (cumulative) to individually ≥2% and deferred; "assurance" softened to "assessment or assurance"; Green Credits leadership indicator added under Principle 6. Store an applicable framework_version per report.
