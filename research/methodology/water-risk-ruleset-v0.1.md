# Water-Risk Screening Ruleset v0.1 — the READ SPINE, machine-encodable

**Status:** first-pass rules-based methodology for the interactive glass-box prototype · Aug 2026 · Fable.
**Derives from (sources of truth):** [X1-attribution-stance.md](X1-attribution-stance.md) (v0.2) · [M2-quantity-stress.md](M2-quantity-stress.md) (v0.2) · [M1-quality-screen.md](M1-quality-screen.md) (v0.2) · [strawman-parameters.md](strawman-parameters.md) (v0.1, IDs A1–A6, B7, D1–D4) · [../coverage-funnel.md](../coverage-funnel.md) (Aug 2026).

**Scope:** the water-risk read spine only — basin-regime classification, Panel A (demand), Panel B (basin condition), the M1 quality watchlist, tier/ladder governance, and the mandatory `[gap]` line. **This ruleset never computes causal attribution.** M3 / causal-ladder rungs C1+ are represented as the honest boundary: the rules emit C0 (or "not established"), state the evidence that would be needed to climb, and stop (X1 §3; M2 §3.5 hand-off).

**Fidelity rule:** every rule cites a source section or strawman ID. Where the sources left a genuine gap, the bridge is a stated assumption, marked `[BRIDGE-n]` and listed in Appendix A. Numeric thresholds are the strawman values **verbatim** — "nothing here is a default to trust; everything here is a proposal to attack" (strawman-parameters, preamble).

---

## 1. INPUT SCHEMA

Every field the model consumes. `Req` = required for the spine to run at all (missing optional fields degrade to T4 paths, never crash). `Default tier` = the provenance tier the value carries when supplied from its normal source. `Availability` per coverage-funnel (Table B/C): **HAVE** (global, on the registry today) · **PARTIAL** (subset only) · **CURATION-NEEDED** (0% today, achievable by manual curation) · **REQUEST-NEEDED** (exists but must be obtained, e.g. via WRI Indonesia) · **UNKNOWN** (~0% obtainable remotely).

### 1.1 Site identity & typology

| Field | Type / enum | Req | Default tier | Availability | Source |
|---|---|---|---|---|---|
| `site_id` | string | ✔ | — | HAVE (registry, 100%) | funnel B "Mine location" |
| `location` | point (lat/lon) + HydroBASINS-L6 id | ✔ | T2 | HAVE (100%, definitional) | funnel B |
| `commodity` | enum {Ni, Cu, Co, Cu-Co, Li, …47 ICMM commodities} | ✔ | T2 | HAVE (100%, definitional) | funnel B; M1 §2 |
| `ore_type` | enum {laterite, sulfide, brine, spodumene, oxide, unknown} | ✔ | T2/T4 | CURATION-NEEDED | M1 §2, §3.1 |
| `process` | enum {HPAL, RKEF, ore_export, sulfide_flotation, brine_evaporation, unknown} | ✔ | T2 (2-source) / T4 | CURATION-NEEDED (0% today · ~24% achievable) | funnel B "Process route"; M1 §2; D3 |
| `process_confirmed` | bool (2 independent sources per D3) | ✔ | — | CURATION-NEEDED | D3 |
| `captive_coal` | bool ∪ unknown (RKEF power source) `[BRIDGE-6]` | – | T2/T4 | CURATION-NEEDED | M1 §3.1 "RKEF (captive coal)" |
| `status` | enum {proposed, operating} | ✔ | T2 | CURATION-NEEDED (X3 site table) | M1 §2 |
| `vintage` | year operations began | – | T2/T4 | CURATION-NEEDED | M1 §2; X1 §6 [C] |
| `waste_mgmt` | enum {dry_stack, dam, DSTP, co_disposal, unknown} | – | T2/T4 | CURATION-NEEDED (from AMDAL / disclosures) | M1 §9.3 [G-4] |
| `receptor` | enum {freshwater, marine, groundwater} | ✔ | T2/T4 | CURATION-NEEDED | M1 §9.2 [G-3] |
| `pathway` | enum {geogenic_ARD, process_acidity, stored_mineral_acidity, none_known} — defaulted by ore_type, **T4-flagged until waste characterization sighted** | ✔ | T4 (default) → T2 | CURATION-NEEDED | M1 §9.4 [G-5] |
| `neutralization_polish` | bool ∪ unknown | – | T2/T4 | CURATION-NEEDED | M1 §9.5 [G-14] |
| `footprint` | enum {polygon, point_within_5km, point_5_10km, none} | – | T2 | PARTIAL (31% polygon · 60% usable ≤5 km · 30% none) | funnel B "Footprint" |
| `landmark_overlap` | enum {on_land, within_5km, none_documented} — lower bound, documented lands only | – | T2 | HAVE (computed: 4.1% on-land · 9.9% ≤5 km; Cu/Ni/Li/Co 7%/14%) | funnel C LandMark |

### 1.2 Demand-side inputs (Panel A)

| Field | Type / enum | Req | Default tier | Availability | Source |
|---|---|---|---|---|---|
| `metered_withdrawal_m3yr` | number (actual observation: gauge/meter) | – | **T1** | UNKNOWN (~0% public) | X1 §11.1; M2 §3.2 |
| `licensed_abstraction_m3yr` | number (GR 30/2024 license or AMDAL water balance), WAF-shaped where document supports | – | **T1p** ("reflects the permit, not measured withdrawal") | REQUEST-NEEDED (Amdalnet BLOCKED; via WRI Indonesia) | M2 §2, §9.6; X1 §11.1 |
| `demand_source_split` | {surface, ground, sea} shares per permit structure | – | T1p/T4 | REQUEST-NEEDED | M2 §9.6 |
| `non_licensed_interactions` | list ⊆ {seawater, rain_capture, dewatering} | – | **T4 line items** | UNKNOWN | M2 §9.6 |
| `production_capacity` | number + unit (t Ni/yr, t ore/yr) | – | T2/T4 | CURATION-NEEDED (X3 table) | M2 §2 |
| `ore_grade_pct` | number ∪ band; **default band 1.0–1.8% Ni** (Indonesian limonite–saprolite), printed under any T3 band | – | T3 (band) | CURATION-NEEDED | D4 |
| `coefficient_band` | per-process [min, max] m³/t (per tonne **ore processed**; metal basis only with stated grade). Pilot anchors: **RKEF ~100 · HPAL ~1,700 m³/t Ni** — direction citable; magnitudes UNVERIFIED-primary | – | T3 (always a band) | PARTIAL (direction robust; magnitudes gated on primary sourcing: Northey 2018 SI, Khoo 2017) | M2 §2, §3.2, §9.6, §8a; D4 |

### 1.3 Basin-condition inputs (Panel B / classifier)

| Field | Type / enum | Req | Default tier | Availability | Source |
|---|---|---|---|---|---|
| `bws` | Aqueduct 4.0 baseline water stress: % + class {Low <10, Low-Med 10–20, Med-High 20–40, High 40–80, Extremely High >80} | ✔ | T2 (modeled) | HAVE (~100%; **modeled sub-basin category, not a site measurement**) | M2 §2; funnel B; A1 |
| `bwd` | baseline water depletion (class) | – | T2 | HAVE | M2 §2 |
| `sev` | seasonal variability (class) | – | T2 | HAVE | M2 §2; M2 §9.3 |
| `iav` | interannual variability (class) | – | T2 | HAVE | M2 §2 |
| `rfr` | riverine flood risk (class) | ✔ | T2 | HAVE | M2 §2; A3 |
| `gtd` | groundwater table decline (class ∪ no_data) | – | T2/T4 | HAVE (Aqueduct indicator; gaps render "no data") | M2 §9.2 [H-3] |
| `driest_quarter_ratio` | demand/availability over driest 3 consecutive months (Aqueduct monthly-aggregable) | – | T2 | HAVE-in-principle (aggregation is a compute task; **unrun in v0.1 presets → unassessed**) | A2(a); M2 §9.2 |
| `aware_monthly_cf[12]` | WULCA-AWARE monthly CFs, sub-watershed (range 0.1–100, world avg 1) | – | T2 | HAVE (CC BY) | M2 §2; A2(b) |
| `scenario_layers` | Aqueduct 2030/2050/2080 (opt/pess) | – | T2 (screening context only) | HAVE | M2 §2, §3.3 |
| `basin_modeled_withdrawal_m3yr` | PCR-GLOBWB modeled basin total (A5 denominator) | – | T2 | HAVE | A5 |
| `cluster_demand_estimate_m3yr` | estimated mine-cluster demand in basin | – | T3/T4 | CURATION-NEEDED | A5 |
| `local_flow_gauge` | BWS gauge series, if any (overrides A2) | – | T1 | REQUEST-NEEDED / region pack | A2 🔧 |
| `regime_override` | local hydrology study (region pack) | – | T2 | optional | M2 §2 |

### 1.4 Quality-side inputs (M1)

| Field | Type / enum | Req | Default tier | Availability | Source |
|---|---|---|---|---|---|
| `watchlist_table` | WRI-authored rows (contaminant, evidence_tier ∈ {regulatory, peer-reviewed, NGO-field, preprint}, evidence_cite, compartment) | ✔ | per-row | HAVE (evidence compiled; authoring = Phase-3 build) | M1 §2, §3.2 |
| `benchmark_standards` | WHO GDWQ (always) · PP 22/2021 L.VI (freshwater ambient) · L.VIII (marine ambient, region pack) · IFC EHS 2007 (effluent) · Permen LH 09/2006 (status UNVERIFIED) | ✔ | — | HAVE/GETTABLE (omit a column rather than guess) | M1 §2, §9.2 |
| `measured_values[]` | {parameter, value, unit, fraction ∈ {dissolved, total_recoverable, total, unstated}, lab, date} | – | T1 | UNKNOWN (~0% remote — "chemistry is invisible from space") | M1 §2; funnel B; M1 §9.1 [G-1] |

---

## 2. THE RULESET

Rule form: `[RULE-ID] WHEN <condition> THEN <action> · EMITS <panel / tier / causal tier> · CONFIDENCE <LOW/MED/HIGH> · SOURCE <ref>`. Confidence is the strawman's own "survives SME review" rating where one exists. Rules are evaluated in listed order within each group; groups run CLASS → DEMAND → COND → WATCH → GAP, with TIER/LADDER/BANNED as governance constraints over every emission.

### 2.1 R-CLASS — basin-regime classifier

The classifier output is a **prior, not a switch** (M2 §9.2): it orders and weights panels, never deletes evidence.

- **[R-CLASS-01] Annual scarcity gate.** WHEN `bws` ≥ 40% THEN mark `scarcity_dominant_candidate = true` · EMITS regime candidate (Panel B framing), T2 · CONFIDENCE HIGH (it's Aqueduct's own High-class edge) · SOURCE A1; M2 §3.1.
- **[R-CLASS-02] Seasonal-scarcity screen (mandatory secondary regime).** WHEN `driest_quarter_ratio` ≥ 40% **OR** max(`aware_monthly_cf`) ≥ 10 THEN set secondary flag `seasonal_scarcity` · WHEN both inputs are absent/unrun THEN set `seasonal_status = "unassessed"` (this state must be rendered — see R-COND-03) · WHEN `local_flow_gauge` exists it overrides both routes · EMITS Panel B secondary flag, T2 (or T4 "unassessed") · CONFIDENCE MED (structure survives; the 10 may move to 5 or 20) · SOURCE A2; M2 §9.2–9.3 [H-1].
- **[R-CLASS-03] Disruption gate.** WHEN `rfr` ∈ {High, Extremely High} AND `bws` < 20% AND `seasonal_scarcity` flag is NOT set THEN `regime = disruption-dominant`. WHEN the seasonal screen is **unassessed** (not cleared), the label renders as **"disruption-dominant (provisional — seasonal screen pending)"** `[BRIDGE-4]` — this is exactly A6's posture for the pilot. Land-disturbance evidence routes M3's signal choice but does NOT enter basin classification (H-5 circularity fix) · EMITS regime label, T2 · CONFIDENCE MED-HIGH · SOURCE A3; A6; M2 §9.2.
- **[R-CLASS-04] Boundary buffer → mixed/indeterminate.** WHEN `bws` falls within ±10 percentage points of any class boundary used in a gate (30–50% around the 40 edge; 10–30% around the 20 edge) THEN `regime = mixed/indeterminate` and downstream consumers (M3) run **both** signal paths · EMITS regime label "mixed/indeterminate", T2 with uncertainty note · CONFIDENCE LOW-MED (mechanism survives; width is guesswork — replacement path: derive per-basin spread from the scenario ensemble) · SOURCE A4 [S-9].
- **[R-CLASS-05] Demand-vintage validity check.** WHEN `cluster_demand_estimate` ≥ 20% of `basin_modeled_withdrawal` THEN attach flag `"unreliable: basin model predates local industrial development"` to the stress class · WHEN cluster demand is unknown THEN render `vintage_check = "unassessed"` (T4) — the comparison itself is the point: an invisible bias becomes a displayed diagnostic · EMITS Panel B flag, T2+flag or T4 · CONFIDENCE MED (mechanism HIGH, number LOW; sensitivity analysis on pilot basin can move 20% to wherever the class actually flips) · SOURCE A5 [H-2].
- **[R-CLASS-06] Fallback.** WHEN no gate fires and no buffer applies THEN `regime = "no dominant regime asserted — juxtaposition only"` `[BRIDGE-2]` · EMITS regime label, T2 · CONFIDENCE MED · SOURCE M2 §3.1 (extension; the sources define gates, not the residual class).
- **[R-CLASS-07] Regime = emphasis, never suppression.** ALWAYS: the regime label orders and weights panels; it never deletes one. The stress line always renders (with its seasonal caveat) even in disruption basins; Panel A always renders in every regime ("HPAL is water-hungry even in a wet basin") · EMITS rendering constraint · CONFIDENCE HIGH · SOURCE M2 §9.1 [H-5]; M2 §3.5.
- **[R-CLASS-08] Quality-dominance is site-side.** NEVER assign quality-dominance from Aqueduct quality indicators (they measure sewage/nutrient pressure, not mining pathways). WHEN the M1 watchlist is non-trivial (any commodity row set beyond the floor) THEN attach secondary flag `quality_watch` from the **site side** (watchlist + land disturbance). The classifier is documented as a scarcity-switch + site-side hazard typology, not a three-way basin-condition determination · EMITS secondary flag · CONFIDENCE MED-HIGH · SOURCE M2 §9.4 [H-4].
- **[R-CLASS-09] Pre-registered pilot call (Sulawesi).** WHEN site ∈ Bahodopi-area sub-basins THEN the pre-registered expected output is: **disruption-dominant, with a seasonal-scarcity flag pending the A2 screen, and the A5 vintage flag rendered.** The classifier still runs on live inputs; any divergence from this pre-registration is displayed, never silently reconciled (no post-hoc classification) · EMITS pre-registration comparison · CONFIDENCE MED (this is exactly the call the hydrologist SME signs or overturns) · SOURCE A6.
- **[R-CLASS-10] Confidence emission.** ALWAYS: the regime label carries a confidence derived from its path — HIGH only when all gate inputs present, no buffer, seasonal screen actually run; MED when provisional/pending; LOW when mixed/indeterminate or vintage-flagged · EMITS classifier confidence · CONFIDENCE HIGH (bookkeeping) · SOURCE M2 §9.2 ("prior, not a switch") `[BRIDGE-2]`.

### 2.2 R-DEMAND — Panel A demand tiering

- **[R-DEMAND-01] Measured (T1).** WHEN `metered_withdrawal_m3yr` exists (actual observation: meter/gauge/lab-grade figure) THEN Panel A = "uses **N m³/yr**" · EMITS Panel A, **T1** · CONFIDENCE HIGH · SOURCE X1 §5, §11.1; M2 §3.2.1.
- **[R-DEMAND-02] Permitted (T1p).** WHEN no T1 AND `licensed_abstraction_m3yr` exists THEN Panel A = "is licensed to withdraw **N m³/yr**" with badge text "what the operator is allowed to take, not what it takes", WAF-shaped (withdrawal/consumption/discharge/diversion) where the document supports it, labeled "external reading of operator/permit figures, not the operator's ledger", enforcement caveat attached ("permitted ≠ enforced") · EMITS Panel A, **T1p** · CONFIDENCE HIGH · SOURCE X1 §11.1 [H-7]; M2 §3.2.1, §9.6 [I-6].
- **[R-DEMAND-03] Coefficient band (T3).** WHEN no T1/T1p AND `process` confirmed AND `production_capacity` known THEN Panel A = coefficient band × capacity, **always a range, never a point**; band widens with coefficient confidence; ore-grade span **1.0–1.8% Ni** printed under the band; coefficients defined per tonne of **ore processed** (metal basis only with the stated grade carried in the band). Pilot anchors: **RKEF ~100 vs HPAL ~1,700 m³/t Ni** — the direction (HPAL ≫ RKEF) is citable now · EMITS Panel A, **T3 band** · CONFIDENCE MED · SOURCE M2 §3.2.2, §9.6 [H-8]; D4.
- **[R-DEMAND-04] Primary-sourcing gate on magnitudes.** WHEN the T3 band's edges are not yet primary-sourced (Northey 2018 SI / Khoo 2017 pull incomplete; scope-reconciliation table direct-vs-indirect-vs-LCA-blue-water not closed) THEN the magnitude renders with an explicit **"UNVERIFIED-primary — magnitude pending sourcing"** flag; the direction statement (HPAL ≫ RKEF) renders unflagged; no share-card carries the magnitude · EMITS Panel A flag · CONFIDENCE HIGH (it is M2's own shipping gate) · SOURCE M2 §2, §8a, §9.7 [H-8, I-7].
- **[R-DEMAND-05] Band-width kill switch (D4).** WHEN the constructed band exceeds **10× end-to-end** THEN render Panel A as **T4 "not established"**, band relegated to the methods popover — a band that wide informs nobody · EMITS Panel A, T4 · CONFIDENCE MED · SOURCE D4.
- **[R-DEMAND-06] Unknown (T4).** WHEN no T1/T1p and the coefficient path cannot run (process unknown, capacity unknown, or no coefficient set exists for this commodity/process) THEN Panel A = "**No public figure exists for this operation's water use**" — displayed, with the M4 route (disclosure request) attached; band width is framed as a disclosure ask ("a number the operator could provide today") · EMITS Panel A, **T4** · CONFIDENCE HIGH · SOURCE M2 §3.2.3; M2 §9.7 [I-7]; X1 §5 T4.
- **[R-DEMAND-07] Direct/on-site only; source split.** ALWAYS: Panel A shows direct/on-site water only — indirect/embodied water renders, if at all, as a separate explicitly non-local line; demand splits by source (surface/ground/sea) per the permit structure; non-licensed interactions (seawater, rain capture, dewatering) enumerate as **T4 line items** · EMITS Panel A structure · CONFIDENCE HIGH · SOURCE M2 §9.6 [H-8, H-7].
- **[R-DEMAND-08] Process unconfirmed → union.** WHEN `process_confirmed = false` (fewer than 2 independent sources: company disclosure + industry tracker, or AMDAL + satellite morphology) THEN the site renders "process unconfirmed" and Panel A / watchlist show the **union of candidate processes, flagged**; the widened union band is then tested by R-DEMAND-05 (a HPAL∪RKEF union spans ~17×, so it collapses to T4 by D4) · EMITS Panel A T3-union or T4, watchlist union · CONFIDENCE HIGH · SOURCE D3; M1 §9.10 [I-8].

### 2.3 R-COND — Panel B basin-condition rendering

- **[R-COND-01] True resolution, never smoothed.** ALWAYS render indicators at HydroBASINS-L6 sub-basin resolution; no spatial smoothing or basin-averaging across sub-basins · EMITS Panel B, T2 · CONFIDENCE HIGH · SOURCE M2 §3.3.
- **[R-COND-02] Scenario layers = screening context.** WHEN 2030/2050 scenario layers render THEN label them screening-level context; note that optimistic scenarios can show *higher* local stress (crop extent frozen 2050; livestock post-2014 constant) · EMITS Panel B context, T2 · CONFIDENCE MED · SOURCE M2 §3.3, §6.6.
- **[R-COND-03] NEVER assert a negative from an annual composite.** WHEN `bws` is low/annual THEN the maximum permissible sentence is: "On an **annual basis** this basin is not scarcity-constrained (T2: low baseline stress) — but annual averages can hide dry-season shortage: dry-season conditions **[have not been assessed / are flagged — see seasonal screen]**." The unqualified "this basin has plenty of water" is banned output · EMITS Panel B sentence template, T2 + seasonal caveat · CONFIDENCE HIGH · SOURCE M2 §4 (disruption template) [H-1, H-5].
- **[R-COND-04] Groundwater is a separate line.** ALWAYS render `gtd` as its own sentence: "groundwater drawdown is a separate question (T2: groundwater trend [class])" or, when absent, "…(no data)" as displayed T4 · EMITS Panel B line, T2 or T4 · CONFIDENCE HIGH · SOURCE M2 §4; M2 §9.2 [H-3].
- **[R-COND-05] No AWARE-weighted footprint.** NEVER compute demand × CF (dropped in v0.2: it embedded the unknowable denominator, mis-scoped consumption factors, and communicated in uninterrogable units). AWARE monthly CFs are used **diagnostically only** (R-CLASS-02). v0.2 is pure juxtaposition · EMITS prohibition · CONFIDENCE HIGH · SOURCE M2 §9.5 [H-6].
- **[R-COND-06] Spatial-precision language.** ALWAYS phrase basin-resolution findings as "risk **in the area around** this mine," never "this mine's own impact" · EMITS phrasing constraint · CONFIDENCE HIGH · SOURCE M2 §4 "Never" list; X1 §4.
- **[R-COND-07] Regime orders the panel.** WHEN `regime = disruption-dominant` THEN lead with disruption indicators (sediment, turbidity, altered runoff, flood variability via `rfr`), then the annual-stress line with its R-COND-03 caveat, then groundwater; WHEN scarcity-dominant THEN lead with `bws`/`bwd` and the seasonal picture; WHEN mixed/indeterminate THEN render both orderings' content with the buffer note first · EMITS Panel B ordering · CONFIDENCE MED-HIGH · SOURCE M2 §4, §9.1 [H-5].

### 2.4 R-WATCH — the M1 watchlist routing tree

All watchlist output is a **process-type panel**: attached visually (and in any share-card) to the *process*, not the named operator. Nothing renders without a citation; rows render in evidence-tier order.

- **[R-WATCH-01] Regulatory monitoring baseline (the floor, always present).** WHEN commodity is any metal THEN render the floor rows: **As, Cu, Pb, Ni, Zn, TSS, pH + nitrate/ammonia (blasting)** — presented as "what regulators require monitoring for" (EPA 440 Subpart G + MDMER), **visually subordinate** to commodity rows, with per-parameter applicability flags (CN = flotation/gold only; Ra-226 = U-bearing only; Cd per EPA 440.72) · EMITS watchlist floor rows, evidence_tier = regulatory · CONFIDENCE HIGH · SOURCE M1 §3.1, §9.5 [G-8], §9.7 [G-11].
- **[R-WATCH-02] Laterite Ni + HPAL.** WHEN `ore_type = laterite` AND `process = HPAL` THEN headline rows: **Cr(VI), Ni, Co, Mn, sulfate/TDS, Mg, turbidity/TSS, pH (process acidity)**; **Cd renders in the expandable lower-evidence section** (single cite, visible — D1); `pathway` defaults to `process_acidity` + post-closure `stored_mineral_acidity` (jarosite), **T4-flagged until waste characterization sighted**; `neutralization_polish` (when curated true) modulates Mn/Ni row confidence downward · EMITS watchlist rows + tier badges + compartments · CONFIDENCE HIGH (routing), MED (row completeness — unfalsifiable ceiling stated) · SOURCE M1 §3.1, §9.4 [G-5], §9.5 [G-6..G-8, G-14]; D1.
- **[R-WATCH-03] Laterite Ni + RKEF (captive coal).** WHEN `ore_type = laterite` AND `process = RKEF` AND `captive_coal = true` THEN base laterite rows **plus Hg, As** (coal-combustion pathway — distinct fingerprint) **plus Se** (coal-ash pathway) **with B in the lower-evidence tier**; slag noted in rationale. WHEN `captive_coal = unknown` THEN the coal rows render in the flagged union per R-WATCH-09 logic ("power source unconfirmed") · EMITS watchlist rows · CONFIDENCE HIGH · SOURCE M1 §3.1, §9.5 [G-6]; backtest §5 (Morowali RKEF should flag Hg/As; Nexus3 blood-Hg corroborates).
- **[R-WATCH-04] Laterite Ni ore-export only.** WHEN `process = ore_export` THEN **sediment-dominant** rows **plus Cr(VI)/Ni/Mn at field evidence tier** (ultramafic sediment *is* the chemistry — geogenic oxidation needs no autoclave); minimal process-chemical leachate. Backtest pass criterion = "sediment-dominant," not "sediment only" · EMITS watchlist rows · CONFIDENCE HIGH · SOURCE M1 §3.1, §9.5 [G-9], §9.9.
- **[R-WATCH-05] Sulfide / ARD switch.** WHEN `pathway = geogenic_ARD` (sulfide ore, e.g. DRC Cu-Co) THEN switch the commodity rows to the **ARD logic row set (GARD-backed)** — acid-generation indicators (pH/acidity, sulfate) plus low-pH-mobilized ore-suite metals; **exact row enumeration is authored in the Phase-3 watchlist table, not invented here** `[BRIDGE-1]` — plus the R-WATCH-01 floor · EMITS watchlist rows (ARD set) · CONFIDENCE HIGH (switch), row set pending authoring · SOURCE M1 §3.1, §9.4 [G-5].
- **[R-WATCH-06] Sparse-watchlist commodities.** WHEN commodity ∈ {Li brine, …} with a sparse evidence base THEN render near-empty **honestly**: "primary risk here is water balance → see M2 (Panel A/B)" · EMITS watchlist near-empty state · CONFIDENCE HIGH · SOURCE M1 §3.1.
- **[R-WATCH-07] Receptor routing.** WHEN `receptor = marine` THEN benchmark columns switch to marine ambient (region pack: PP 22/2021 Lampiran VIII); fish-tissue exposure is **out of scope for v1** and routes to Learn content. WHEN `receptor = freshwater` THEN ambient columns = WHO GDWQ + PP 22/2021 L.VI (class-applicability flags: PP22 Fe/Mn = Class I only). WHEN `receptor = groundwater` THEN WHO column with ambient caveat. WHO column **always** renders — including the explicit state "WHO sets no guideline value for this parameter" (Co, turbidity) · EMITS benchmark column set · CONFIDENCE HIGH · SOURCE M1 §9.2 [G-3], §9.8 [G-12], §3.3.
- **[R-WATCH-08] Waste-management routing.** WHEN `waste_mgmt` known THEN it determines receptor default, failure mode, and M5 sampling points: `DSTP` forces `receptor = marine`; `dam` adds the dam compartment (residue porewater, spillway/discharge) to row rationale; `dry_stack` emphasizes runoff/seepage; `co_disposal` flags combined failure modes. WHEN unknown THEN compartments render unresolved, T4 · EMITS compartment labels · CONFIDENCE MED-HIGH · SOURCE M1 §9.3 [G-4].
- **[R-WATCH-09] Rendering threshold (D1).** WHEN a contaminant row has **≥ 2 independent sources OR 1 regulatory source** THEN it renders in the **headline** set; WHEN single-study THEN it renders in an **expandable "lower-evidence" section** with its single cite visible (pilot instance: Cd) · EMITS row placement · CONFIDENCE HIGH · SOURCE D1; M1 §9.5 [G-8].
- **[R-WATCH-10] Phrasing lock (verb-hardening ban).** ALWAYS: the watchlist headline reads "**Mines using this process ([type]) have been documented elsewhere to release: […]**" and carries the closing line "**This is a list of what to watch for, not a measurement of this site's water.**" Type-level claims ("typically risks releasing") may NEVER harden into "is known to release" on a named-site surface · EMITS phrasing constraint · CONFIDENCE HIGH · SOURCE M1 §4; X1 §11.4 [I-1, L-10].
- **[R-WATCH-11] Empty benchmark state = anti-reassurance.** WHEN no `measured_values` exist THEN render: "**No measured value exists for this site. That is a data gap, not an all-clear.** → How to get a credible measurement (M5)." The empty state IS the product · EMITS benchmark empty state, T4 · CONFIDENCE HIGH · SOURCE M1 §2, §4.
- **[R-WATCH-12] Benchmark guard (fires only on a real value).** WHEN a T1 measured value exists for a listed parameter THEN compare against each applicable standard **with its metadata**: speciation (WHO total-Cr vs PP22/IFC Cr(VI)); measurement type (TSS mg/L ≠ NTU); ambient-vs-effluent applicability (river sample vs PP22/WHO, never vs effluent limits except "shown for context only"); class applicability; and **fraction** (dissolved/total-recoverable/total) — the guard **refuses comparison when fraction is unstated** ("not comparable — fraction unknown"; total metals in turbid laterite rivers run 10–100× dissolved; M5 supplies the field-filtration protocol). Output per standard: exceeds / does not exceed / not-applicable-because — never "safe/unsafe". Any does-not-exceed renders with the compliance caveat: "Being below these values means compliance with the named standard — not a guarantee the water is free of risk." · EMITS benchmark verdicts, T1 · CONFIDENCE HIGH · SOURCE M1 §3.3, §4, §9.1 [G-1]; X1 §4.
- **[R-WATCH-13] Unconfirmed process → union watchlist.** WHEN `process_confirmed = false` THEN watchlist = **union of candidate processes' rows, flagged** "process unconfirmed"; intake-form sites render **nothing publicly** until curator review (the intake is a queue, not a publish path) · EMITS union watchlist / suppression · CONFIDENCE HIGH · SOURCE D3; M1 §9.10 [I-8].
- **[R-WATCH-14] Cr(VI) compartment resolution.** ALWAYS: the Cr(VI) row rationale states **where** Cr(VI) arises (residue porewater · discharge/neutralization upsets · regolith/stockpile runoff); Delina 2025 cites to the residue compartment; Gecko to discharge. No "both sides" balancing act · EMITS row rationale structure · CONFIDENCE HIGH · SOURCE M1 §9.6 [G-10].
- **[R-WATCH-15] Operator-disclosure panel.** ALWAYS render "What the operator reports" (treatment, recycling, certifications), T-tiered; **T4 "operator has published nothing" is rendered** · EMITS disclosure panel, T1p/T2/T4 · CONFIDENCE MED-HIGH · SOURCE M1 §9.11 [I-6].

### 2.5 R-TIER — provenance-tier governance

- **[R-TIER-01] T1 Measured** — a real measurement of this site/water (lab result, gauge, metered figure). Reserved for actual observations · SOURCE X1 §5, §11.1.
- **[R-TIER-02] T1p Permitted** — a documentary fact about an *entitlement*, not a measurement. Badge: "what the operator is allowed to take, not what it takes" · SOURCE X1 §11.1 [H-7].
- **[R-TIER-03] T2 Modeled-published** — a published dataset's value for this location (Aqueduct sub-basin class, GSWE extent, AWARE CF) · SOURCE X1 §5.
- **[R-TIER-04] T3 Estimated — ALWAYS a band, never a point.** Derived by us from coefficients/analogy. An unlabeled point where the source is a coefficient band is banned output (see R-BANNED-06) · SOURCE X1 §5, §4; M2 §3.2.2.
- **[R-TIER-05] T4 Unknown-stated — absence is displayed, not hidden.** Template: "No public measurement of [X] exists for this area. Here is how one could be obtained →" (route to M5/M4) · SOURCE X1 §5.
- **[R-TIER-06] Orthogonality + badge rule.** Tier and panel are orthogonal; **every displayed value carries a tier badge and popover**; the T3 always-a-band rule extends to Panel C magnitudes (credible intervals mandatory; withheld if the interval includes zero) · SOURCE X1 §5, §11.6 [S-12].

### 2.6 R-LADDER — causal-ladder governance (gates language; never computes causation)

- **[R-LADDER-01] Default = C0; the read spine's ceiling = C0.** WHEN `vintage` and a before/after time series exist THEN the maximum Panel C sentence is: "**X changed after operations began in [year]. This timing alone does not establish cause.**" WHEN no time-series analysis exists THEN Panel C renders "change since operations has not been analyzed for this site" plus the evidence needed to climb (R-LADDER-05) · EMITS Panel C, **C0** or not-established · CONFIDENCE HIGH · SOURCE X1 §3 C0; scope decision (this document).
- **[R-LADDER-02] C1 gate (stated, never fired here).** Requires: before/after + a valid control that didn't change + seasonal handling; quantitative bar per strawman B3 (≥2× pre-period SD of impact-minus-control, sustained ≥6 consecutive months, ≥2 independent controls within 1× own SD). Max sentence (v0.2): "**the same-size change is absent in the N comparison areas we checked**" (N stated) · EMITS language gate only · SOURCE X1 §3 C1, §11.7 [S-8, I-9].
- **[R-LADDER-03] C2 gate (stated, never fired here).** Requires a published/replicated BACI/CausalImpact analysis with placebo checks. Max sentence: "A statistical analysis attributes [magnitude] of this change to local development rather than regional trends [cite]. It cannot distinguish the mine from other local development, nor identify specific substances." Magnitudes render with credible intervals ("~14% worse, 90% CrI 8–21%"); withheld if the interval includes zero · EMITS language gate only · SOURCE X1 §3 C2, §11.6 [S-12].
- **[R-LADDER-04] C3 gate (stated, never fired here).** Requires ground measurements tracing source→pathway→receptor, **≥2 sampling rounds spanning flow states, synchronous upstream/downstream pairs, flow-condition notes, and a lithology screen** (B7: upstream/downstream contributing areas differ ≤15pp in ultramafic-outcrop share, else "geology-confounded" flag and cap at C1). Max sentence: "Measured values downstream exceed [standard] while upstream values do not; the operator's permitted discharge includes [substance]." Even C3 states the chain and lets it speak · EMITS language gate only · SOURCE X1 §3 C3, §11.2 [H-14, H-10]; B7.
- **[R-LADDER-05] The honest boundary emission.** ALWAYS: when Panel C sits at C0/not-established, the spine states what would be needed to climb — e.g. "a screening comparison requires ≥60 pre-months of satellite record with ≥70% coverage and ≥2 valid comparison areas (M3); a measured chain requires paired up/downstream sampling across flow states with a lithology check (M5)" · EMITS Panel C evidence-needed list · CONFIDENCE HIGH · SOURCE X1 §3; strawman B1, B3, B7; task scope.
- **[R-LADDER-06] Multi-operator attribution rule.** WHEN multiple operators/smelters share the basin (the pilot's normal case) THEN any C1–C3 statement attributes to "**mining and industrial development in this area**". A named single mine appears ONLY when geometry isolates it — and "geometry isolates" **never auto-renders**: per-instance legal + hydrologist sign-off required · EMITS attribution phrasing constraint · CONFIDENCE HIGH · SOURCE X1 §3, §11.3 [L-16, L-9].
- **[R-LADDER-07] Frozen-rung rule.** ALWAYS: the evidence tier for a finding is fixed by pre-registered criteria **before** post-period data is examined; findings cannot be promoted after the fact · EMITS governance constraint · CONFIDENCE HIGH · SOURCE X1 §11.8 [S-1, S-8].
- **[R-LADDER-08] Headline parity.** ALWAYS: a headline carries the same causal tier as the finding — no causal verb in a headline that the body then caveats · EMITS constraint · CONFIDENCE HIGH · SOURCE X1 §4.

### 2.7 R-GAP — the mandatory site-specific [gap] line

- **[R-GAP-01] Mandatory and specific.** ALWAYS emit exactly one `[gap]` line per site read: **the actual missing link for this site, not a generic disclaimer** (X1's example: "whether the river you use is affected requires a ground sample; satellites cannot see it"), with a route (→ M5 sampling / → M4 disclosure) · EMITS [gap] line · CONFIDENCE HIGH · SOURCE X1 §6.
- **[R-GAP-02] Deterministic composition.** Select the highest-salience missing link in priority order `[BRIDGE-3]`: (1) **measurement gap** — watchlist non-empty AND no `measured_values` → "whether the water you use carries any of the listed contaminants requires a ground sample — satellites cannot see chemistry → M5"; (2) **demand gap** — Panel A = T4 → "this operation's actual water use is not publicly known → M4 disclosure request"; (3) **seasonal gap** — `seasonal_status = unassessed` in a low-annual-stress basin → "whether the dry season is water-short here has not been assessed"; (4) **attribution boundary** — scarcity-dominant regime → M2 §4's line: "what fraction of the basin's stress this mine causes — no method can [say], and figures that claim to should be questioned." Sub-priority gaps append as short clauses when space allows; the selected gap is named in the output object · EMITS [gap] text + selected_gap key · CONFIDENCE MED (priority order is a bridge; the mandatoriness and specificity are source requirements) · SOURCE X1 §6; M2 §4.
- **[R-GAP-03] The gap must cite this site's inputs.** VALIDATION: a [gap] line that would render identically for any site fails; it must reference at least one site-specific fact (receptor, missing field, regime, or flag) · EMITS validation check · CONFIDENCE HIGH · SOURCE X1 §6 ("not a generic disclaimer but the actual missing link for this site").

### 2.8 R-BANNED — the negative spec (hard assertions; every render passes these checks)

Each is a post-render assertion the prototype can display as a passed/blocked check.

- **[R-BANNED-01]** NEVER "the mine caused…" — except a C3-with-geometry finding after human sign-off, and even then prefer the chain statement · SOURCE X1 §4, §3.
- **[R-BANNED-02]** NEVER "X% of the basin's stress is due to this mine" (no caused-% sentence; no point-estimate share; no share-of-basin-demand division — the denominator has no source) · SOURCE X1 §4; M2 §3.4, §4.
- **[R-BANNED-03]** NEVER any single blended score combining pressure and condition; **no arithmetic crosses a panel boundary** (the sole former exception, AWARE weighting, was dropped in v0.2 — there are now zero cross-panel operations) · SOURCE X1 §2, §4; M2 §9.5 [H-6].
- **[R-BANNED-04]** NEVER "safe/unsafe" as a verdict — only "exceeds / does not exceed [named standard]" + the compliance caveat · SOURCE X1 §4; M1 §3.3, §4.
- **[R-BANNED-05]** NEVER predicted concentrations — M1 is a hazard screen, not a fate-transport model · SOURCE X1 §4; M1 §1.
- **[R-BANNED-06]** NEVER unlabeled point estimates where the source is a coefficient band (T3 = always a band) · SOURCE X1 §4, §5.
- **[R-BANNED-07]** NEVER a causal verb in a headline that the body then caveats — headline carries the finding's tier · SOURCE X1 §4.
- **[R-BANNED-08]** NEVER a scarcity sentence in a disruption basin (the prototype's fabricated "45%→62%" pattern must not be reproduced with real data in the wrong regime) — AND, symmetrically, never assert "not water-stressed" from an annual composite (R-COND-03) · SOURCE M2 §4 "Never"; M2 §9.1.
- **[R-BANNED-09]** NEVER site-precision claims from basin-resolution data — "risk in the area around this mine," never "this mine's own impact" · SOURCE M2 §4; X1 Annex-B cite ("Aqueduct too coarse for site-specific attribution").
- **[R-BANNED-10]** NEVER verb hardening: type-level "typically risks releasing" may not become "is known to release" on a named-site surface · SOURCE X1 §11.4 [I-1].
- **[R-BANNED-11]** NEVER warranty verbs / self-praise: "no one can dispute," "guarantees," "removes guesswork," and kin · SOURCE X1 §11.5 [I-12].
- **[R-BANNED-12]** NEVER name a single operator in a change statement without geometric isolation **plus** per-instance legal + hydrologist sign-off (never auto-rendered) · SOURCE X1 §3, §11.3.

---

## 3. THE AQUEDUCT 5.0 BRANCH — FORWARD-LOOKING / HYPOTHETICAL

> **Everything in this section is hypothetical.** Aqueduct 5.0 is not released; this layer is a *demo device* showing how the same deterministic ruleset sharpens as input data improves — no rule changes, only input availability changes. Nothing here may render without the label "hypothetical future data layer."

**Hypothetical "granular water data" input layer (`aq5.*`):**

| Field | What it hypothetically provides | Replaces / upgrades |
|---|---|---|
| `aq5.subcatchment_monthly_stress[12]` | Finer sub-catchment (finer than HydroBASINS-L6) monthly demand/availability ratios | `driest_quarter_ratio` (unrun aggregation → native product) |
| `aq5.per_basin_uncertainty` | Published per-basin error bands on indicator classes | the fixed ±10pp buffer (A4's own stated replacement path) |
| `aq5.demand_vintage` | Basin demand model re-based on current-decade sectoral withdrawals, industrial clusters included | the A5 vintage flag's premise |
| `aq5.gtd_hires` | Higher-resolution groundwater-trend product | `gtd` "no data" cells |
| `aq5.quality_prior` | Modeled ambient water-quality priors (screening-grade) | nothing today (local quality ≈ 0% remote) — context only |

**Rule-by-rule sharpening (same rules, better inputs):**

- **[R-AQ5-01 → R-CLASS-02]** WHEN `aq5.subcatchment_monthly_stress` present THEN the seasonal screen computes directly: `seasonal_status` resolves from "unassessed/flagged" (T4) to an actual **dry-season class (T2)** — the driest-quarter ≥40% test runs on native monthly data at sub-catchment scale. The A2 threshold itself does not move.
- **[R-AQ5-02 → R-CLASS-03]** A "disruption-dominant (provisional — seasonal screen pending)" label resolves to a clean **disruption-dominant (T2, screen cleared)** or flips to **seasonal-scarcity secondary regime** — whichever the data says. The pre-registered A6 call is then confirmed or overturned *in public view*.
- **[R-AQ5-03 → R-CLASS-04]** WHEN `aq5.per_basin_uncertainty` present THEN the ±10pp judgment buffer is **replaced by the published per-basin error band** (exactly the replacement A4's 🔧 clause anticipates: "if an SME endorses that, the fixed ±10pp dies happily"). Fewer basins land in mixed/indeterminate; those that do, do so for a stated statistical reason.
- **[R-AQ5-04 → R-CLASS-05]** WHEN `aq5.demand_vintage` includes the local industrial cluster THEN the "unreliable: model predates local industrial development" flag **clears** and the stress class renders as reliable T2; where cluster demand is still missing, the flag stays — the check runs identically, only its answer improves.
- **[R-AQ5-05 → R-COND-03/04]** The dry-season caveat sentence swaps its bracketed "[have not been assessed]" for a real class; `gtd` "no data" (T4) cells become classes (T2) where `aq5.gtd_hires` covers them.
- **[R-AQ5-06 → R-DEMAND-*]** **Honestly: almost nothing changes.** Aqueduct 5.0 is a basin-condition product; it does not know a mine's withdrawal. Panel A's tier ladder (T1 → T1p → T3 band → T4) is untouched; the only improvement is indirect — a better A5 denominator. The license/AMDAL request and the coefficient primary-sourcing gate remain the binding constraints. The demo should *say this out loud*: better basin data does not substitute for operator disclosure.
- **[R-AQ5-07 → R-WATCH-*]** WHEN `aq5.quality_prior` present THEN it may render as a **T2 screening context line** ("modeled ambient priors for this catchment suggest elevated background [X]") adjacent to the watchlist — but it is a model, not a measurement: R-BANNED-05 (no predicted concentrations presented as site values), R-WATCH-10 (phrasing lock), and R-WATCH-11 (a modeled prior is NOT a measured value; the empty benchmark state still renders) all still bind. The measurement gap does not close from orbit.
- **[R-AQ5-08 → R-GAP-02]** The [gap] line **shrinks but never vanishes**: the seasonal clause (priority 3) drops once the screen resolves; the vintage caveat drops where the flag clears; the **measurement gap and the demand gap survive** — and the attribution boundary (C0, R-LADDER) is untouched by any basin dataset. Expected demo beat: the gap line goes from three clauses to one, and the remaining one is the honest core.

---

## 4. WORKED TRACES — three preset cases, today (Aqueduct 4.0 era) and with the hypothetical 5.0 layer

> **Preset-data honesty:** basin indicator numbers below are **illustrative presets** for the prototype, chosen to be consistent with the documented qualitative calls (A6: pilot annual `bws` low, `rfr` high; M2 §5 backtest list names a DRC Katanga basin without classifying it) `[BRIDGE-5]`. They are labeled `preset` in the prototype and are not measurements or published Aqueduct reads of any named real site. Capacity figures are likewise demo presets. Everything else (thresholds, coefficients, row sets, phrasings) is verbatim from the sources.

### 4.1 Case (a) — Indonesian nickel-laterite **HPAL**, coastal, marine receptor (the hero case)

**Preset inputs:** commodity=Ni · ore_type=laterite · process=HPAL (process_confirmed=true, 2 sources) · status=operating · vintage=2021 · waste_mgmt=dam · receptor=marine · pathway=process_acidity (+stored_mineral_acidity post-closure, T4-flagged: waste characterization not sighted) · footprint=polygon · landmark_overlap=within_5km · bws=8% (Low, preset) · rfr=High (preset) · sev=High (preset) · gtd=no_data · driest_quarter_ratio=unrun · aware_monthly_cf=unrun-for-preset · basin_modeled_withdrawal known, cluster_demand_estimate=unknown · licensed_abstraction=absent (Amdalnet BLOCKED) · production_capacity=60,000 t Ni/yr (preset) · measured_values=none.

**Trace, today (4.0 era):**

| # | Rule | Fired | Because | Emitted |
|---|---|---|---|---|
| 1 | R-CLASS-01 | no | bws 8% < 40 | not scarcity candidate |
| 2 | R-CLASS-02 | partial | driest-quarter unrun; AWARE monthly unrun for preset | `seasonal_status = unassessed` (T4) |
| 3 | R-CLASS-04 | no | bws 8% outside both buffers (30–50, 10–30) | no mixed label |
| 4 | R-CLASS-03 | **yes** | rfr=High AND bws 8% < 20 AND seasonal not set (but unassessed) | regime = **disruption-dominant (provisional — seasonal screen pending)**, T2 |
| 5 | R-CLASS-05 | partial | cluster demand unknown | vintage_check = **unassessed → A5 flag rendered** (per A6) |
| 6 | R-CLASS-08 | yes | M1 watchlist non-trivial (HPAL rows) | secondary flag `quality_watch` (site-side) |
| 7 | R-CLASS-09 | yes | Bahodopi-area pilot | pre-registration **matches** live output (disruption + seasonal pending + vintage flag) |
| 8 | R-CLASS-10 | yes | provisional path | classifier confidence = **MED** |
| 9 | R-DEMAND-01/02 | no | no meter; no license (REQUEST-NEEDED, portal blocked) | — |
| 10 | R-DEMAND-03 | **yes** | process=HPAL confirmed, capacity known | T3: **HPAL ~1,700 m³/t Ni × 60,000 t Ni/yr ≈ 1.0×10⁸ m³/yr**, grade band 1.0–1.8% Ni printed |
| 11 | R-DEMAND-04 | **yes** | coefficient UNVERIFIED-primary | magnitude flagged "pending primary sourcing"; direction HPAL≫RKEF citable |
| 12 | R-DEMAND-05 | no | single-anchor band, not >10× | T3 stands (not demoted) |
| 13 | R-DEMAND-07 | yes | always | source split unknown → surface/ground/sea = T4 line items; direct water only |
| 14 | R-COND-01/07 | yes | regime=disruption | Panel B ordered: rfr/sediment first |
| 15 | R-COND-03 | **yes** | bws low + annual | "annual basis… not scarcity-constrained — but… dry-season conditions **have not been assessed**" |
| 16 | R-COND-04 | yes | gtd=no_data | groundwater trend: **no data (T4, displayed)** |
| 17 | R-WATCH-02 | **yes** | laterite+HPAL | headline: **Cr(VI), Ni, Co, Mn, sulfate/TDS, Mg, turbidity/TSS, pH**; **Cd → lower-evidence** (D1) |
| 18 | R-WATCH-08 | yes | waste_mgmt=dam | compartments: residue porewater / discharge / runoff (Cr(VI) per R-WATCH-14) |
| 19 | R-WATCH-07 | yes | receptor=marine | marine ambient columns (PP22 L.VIII region pack); WHO always ("no guideline: Co, turbidity" stated); fish tissue → Learn |
| 20 | R-WATCH-01 | yes | metal mine | regulatory monitoring baseline, subordinate |
| 21 | R-WATCH-11 | **yes** | no measured values | "**a data gap, not an all-clear**" + M5 route |
| 22 | R-LADDER-01 | yes | vintage known, no analysis run | Panel C = **C0-not-established** + evidence-needed list (B1 gates) |
| 23 | R-GAP-02 | **yes** | priority 1: watchlist non-empty, no measurement | [gap] = measurement gap (marine, this site) |
| 24 | R-BANNED-01..12 | pass | — | all checks green |

**Rendered read (today):**
> **[A]** This nickel mine (laterite, HPAL) is estimated to use on the order of **1.0×10⁸ m³/yr** (T3 band — HPAL ~1,700 m³/t Ni × 60 kt/yr capacity; ore-grade assumption 1.0–1.8% Ni; **magnitude pending primary sourcing** — the direction, HPAL ≫ RKEF, is citable now). Split by source (surface/ground/sea): not public (T4). No public abstraction license figure is available (T4 → disclosure request, M4).
> **[B]** This basin's leading water risks are **disruption** — sediment, turbidity, altered runoff, flood variability (T2: flood risk High). On an **annual basis** it is not scarcity-constrained (T2: baseline stress Low, preset 8%) — but annual averages can hide dry-season shortage: **dry-season conditions have not been assessed** (seasonal screen pending), and groundwater drawdown is a separate question (**no data**, T4). Basin class caveat: **demand-vintage unassessed** — the basin model may predate local industrial development (A5). Regime: **disruption-dominant (provisional)**, classifier confidence MED; pre-registered call matches (A6).
> **[watchlist]** Mines using this process (nickel laterite, HPAL) **have been documented elsewhere** to release: **Cr(VI) · Ni · Co · Mn · sulfate/TDS · Mg · turbidity/TSS · pH (process acidity)** [tier badges + compartment + cite slots]; lower-evidence: Cd (single study, cite visible). Regulatory monitoring baseline (subordinate): As, Cu, Pb, Ni, Zn, TSS, pH, nitrate/ammonia. **This is a list of what to watch for, not a measurement of this site's water.** No measured value exists for this site — **that is a data gap, not an all-clear** → M5.
> **[C]** Change since operations began (2021) has not been analyzed for this site (**C0 not established**). To climb: a screening comparison needs ≥60 pre-months of satellite record (≥70% coverage) and ≥2 valid comparison areas (M3/B1); a measured chain needs paired up/downstream sampling across flow states with a lithology check (M5/B7). In this multi-operator belt, any future change statement attributes to "mining and industrial development in this area."
> **[gap]** What this cannot tell you: whether the coastal water this community uses carries any of the listed contaminants — chemistry is invisible from space, and no public measurement exists for this coast; a ground sample (M5) is the missing link. (Also open: actual water use → M4; dry-season conditions → seasonal screen.)

**With the 5.0 layer (hypothetical):** R-AQ5-01 runs the seasonal screen natively — preset outcome: driest-quarter 22% < 40 and worst-month CF 3 < 10 → **no seasonal-scarcity flag; regime resolves to clean disruption-dominant (T2, screen cleared), classifier confidence HIGH**; R-AQ5-04: vintage flag clears (cluster included) → stress class renders reliable; R-AQ5-05: gtd gets a class (T2). Panel A unchanged (R-AQ5-06 — said out loud). **[gap] shrinks to one clause:** the measurement gap → M5. Panel C still C0.

### 4.2 Case (b) — Indonesian nickel-laterite **RKEF, captive coal**

**Preset inputs:** as case (a) except process=RKEF (confirmed) · captive_coal=true · production_capacity=30,000 t Ni/yr (preset) · receptor=marine (coastal park) · waste_mgmt=dry_stack (slag; preset).

**Trace deltas vs (a), today:**

| # | Rule | Fired | Because | Emitted |
|---|---|---|---|---|
| 1–8 | R-CLASS-* | same as (a) | same basin presets | **disruption-dominant (provisional)** + seasonal unassessed + vintage flag |
| 10 | R-DEMAND-03 | yes | process=RKEF | T3: **RKEF ~100 m³/t Ni × 30,000 t Ni/yr ≈ 3.0×10⁶ m³/yr**, grade band printed |
| 11 | R-DEMAND-04 | yes | UNVERIFIED-primary | magnitude flagged; direction citable |
| 17 | R-WATCH-03 | **yes** | laterite+RKEF+captive_coal | base laterite rows **+ Hg, As** (coal-combustion pathway, distinct fingerprint) **+ Se**; **B → lower-evidence**; slag noted |
| 18 | R-WATCH-08 | yes | dry_stack | runoff/seepage compartments emphasized |
| 21 | R-WATCH-11 | yes | no measurements | data-gap-not-all-clear |
| 23 | R-GAP-02 | yes | priority 1 | measurement gap, Hg/As named as the watch parameters |

**Rendered read (today), abbreviated to deltas:**
> **[A]** …estimated ≈ **3.0×10⁶ m³/yr** (T3 band, RKEF ~100 m³/t Ni; magnitude pending primary sourcing) — roughly **17× less water-intensive than HPAL per tonne**, the citable direction.
> **[watchlist]** RKEF (captive coal) adds **Hg, As** (coal-combustion pathway) and **Se** (coal-ash) to the laterite set; lower-evidence: Cd, B. Backtest anchor: a Morowali RKEF site should flag Hg/As (Nexus3 blood-Hg corroborates) — M1 §5.
> **[gap]** …no public measurement of **Hg or As** exists for this coast; a ground sample (M5) is the missing link…

**With 5.0:** identical classifier resolution to (a); Panel A unchanged; [gap] shrinks to the measurement clause.

### 4.3 Case (c) — DRC **copper-cobalt sulfide / ARD**, freshwater receptor (Katanga-basin preset)

**Preset inputs:** commodity=Cu-Co · ore_type=sulfide · process=sulfide_flotation (confirmed) · status=operating · vintage=2015 · waste_mgmt=dam · receptor=freshwater · **pathway=geogenic_ARD** (defaulted by ore type; T4-flagged until waste characterization sighted) · bws=25% (Med-High, preset) · rfr=Medium (preset) · worst-month AWARE CF=12 (preset — pronounced dry season) · gtd=Low decline (preset) · license=absent · production_capacity known · no Cu-Co coefficient set in v0.1 · measured_values=none · region pack: DRC national standards not yet transcribed → **WHO column only; national column omitted rather than guessed** (M1 §2).

**Trace, today:**

| # | Rule | Fired | Because | Emitted |
|---|---|---|---|---|
| 1 | R-CLASS-01 | no | bws 25% < 40 | not scarcity candidate |
| 2 | R-CLASS-02 | **yes** | worst-month AWARE CF 12 ≥ 10 (route b) | secondary flag **seasonal_scarcity** (T2) |
| 3 | R-CLASS-04 | **yes** | bws 25% ∈ 10–30 buffer of the 20 edge | regime = **mixed/indeterminate**; both signal paths run downstream |
| 4 | R-CLASS-03 | no | seasonal flag set (and bws not <20 cleanly) | no disruption label |
| 5 | R-CLASS-05 | partial | cluster demand unknown | vintage_check unassessed (T4) |
| 6 | R-CLASS-08 | yes | ARD watchlist non-trivial | secondary flag `quality_watch` |
| 7 | R-CLASS-10 | yes | mixed + flags | classifier confidence **LOW** |
| 8 | R-DEMAND-01/02/03 | no | no meter, no license, **no coefficient band exists for Cu-Co flotation in v0.1** (new commodity = new coefficient research, M2 §7) | — |
| 9 | R-DEMAND-06 | **yes** | coefficient path cannot run | Panel A = **T4 "No public figure exists for this operation's water use"** + M4 route |
| 10 | R-COND-01/07 | yes | mixed regime | Panel B renders both orderings' content, buffer note first |
| 11 | R-COND-03 | yes | annual class near boundary | annual class stated with buffer + seasonal flag (no negative asserted) |
| 12 | R-COND-04 | yes | gtd present | groundwater trend: Low decline (T2) |
| 13 | R-WATCH-05 | **yes** | pathway=geogenic_ARD | **ARD row set (GARD-backed)** — acid-generation indicators (pH/acidity, sulfate) + low-pH-mobilized ore-suite metals; exact rows from Phase-3 table `[BRIDGE-1]`; pathway badge **T4 until waste characterization sighted** |
| 14 | R-WATCH-01 | yes | metal mine | floor rows, subordinate (Cu, Co covered here too) |
| 15 | R-WATCH-07 | yes | receptor=freshwater; DRC pack absent | **WHO column only** (incl. "no guideline" states); national column omitted, stated |
| 16 | R-WATCH-08 | yes | waste_mgmt=dam | dam compartments (porewater/spillway) |
| 17 | R-WATCH-11 | yes | no measurements | data-gap-not-all-clear + M5 |
| 18 | R-LADDER-01 | yes | vintage known, no analysis | **C0 not established** + evidence-needed (incl. B7 lithology screen for any future C3) |
| 19 | R-GAP-02 | **yes** | priority 1 | measurement gap (freshwater, ARD parameters) |

**Rendered read (today):**
> **[A]** **No public figure exists for this operation's water use** (T4) — no license figure is available and no water-use coefficient set has been established for Cu-Co sulfide processing in v0.1. This is a number the operator could provide today → disclosure request (M4).
> **[B]** This sub-basin sits **near a class boundary** (T2: baseline stress Med-High, preset 25% — within the ±10pp buffer): regime is **mixed/indeterminate**, and both scarcity and disruption readings are carried. A **seasonal-scarcity flag is set** (worst-month AWARE CF 12 ≥ 10, preset): dry-season deprivation potential is an order of magnitude above world average in the worst month. Groundwater trend: Low decline (T2). Demand-vintage: unassessed (T4). Classifier confidence LOW — this is a prior, not a switch.
> **[watchlist]** Mines working **sulfide ore (acid-rock-drainage pathway)** have been documented elsewhere to generate acid drainage — watch: **pH/acidity, sulfate, and metals mobilized at low pH** (ARD row set, GARD-backed; exact rows from the authored watchlist table) + regulatory monitoring baseline (As, Cu, Pb, Ni, Zn, TSS, pH, nitrate/ammonia). Pathway badge: **T4 — waste characterization not sighted**. Benchmarks: WHO GDWQ only (DRC national standards not yet transcribed — column omitted rather than guessed). **A list of what to watch for, not a measurement.** No measured value exists — **a data gap, not an all-clear** → M5.
> **[C]** Change since 2015 not analyzed (**C0 not established**). Any future measured chain (C3) here additionally requires the lithology screen (B7). Multi-operator belt: attribution phrasing = "mining and industrial development in this area."
> **[gap]** What this cannot tell you: whether the river this community uses is acidified or carries dissolved metals — no public measurement exists downstream of this site; a paired upstream/downstream ground sample across flow states (M5) is the missing link. (Also open: the operation's water use → M4; the basin's true regime — near a class boundary, seasonal flag set.)

**With the 5.0 layer (hypothetical):** R-AQ5-03: the ±10pp buffer is replaced by the per-basin published error band — preset outcome: 25% sits **outside** the published band of the 20 edge → the mixed label resolves; R-AQ5-01: driest-quarter computes natively — preset 45% ≥ 40 → **seasonal-scarcity confirmed as a T2 class** (the CF-route flag graduates from screen to assessed condition); regime renders as **seasonal-scarcity secondary over a moderate annual base**, classifier confidence MED-HIGH; R-AQ5-04: vintage resolves. Panel A **still T4** — no basin product knows this mine's withdrawal (the demo's honesty beat). [gap] shrinks to: measurement gap + demand gap. Panel C still C0.

---

## 5. OUTPUT OBJECT SCHEMA

The structured result the prototype renders. JSON-shaped; enums reference §1.

```jsonc
{
  "site_id": "string",
  "preset_note": "string|null",            // labels illustrative preset values (BRIDGE-5)
  "regime": {
    "label": "scarcity-dominant | disruption-dominant | mixed-indeterminate | no-dominant-asserted",
    "provisional": "boolean",              // seasonal screen pending (R-CLASS-03)
    "secondary_flags": ["seasonal_scarcity" , "quality_watch", "vintage_unreliable", "vintage_unassessed"],
    "seasonal_status": "assessed_class | flagged | unassessed",
    "buffer_state": "clear | in_buffer",   // R-CLASS-04
    "confidence": "LOW | MED | HIGH",      // R-CLASS-10
    "preregistration": { "expected": "string|null", "matches": "boolean|null" }  // R-CLASS-09
  },
  "panels": {
    "A": {
      "statement": "string",
      "tier": "T1 | T1p | T3 | T4",
      "band": { "low": "number|null", "high": "number|null", "unit": "m3/yr",
                "grade_assumption": "1.0–1.8% Ni", "coefficient": "string" } ,   // null unless T3
      "flags": ["unverified_primary", "band_gt_10x_demoted", "process_union"],
      "source_split": { "surface": "number|T4", "ground": "number|T4", "sea": "number|T4" },
      "non_licensed_items": ["seawater", "rain_capture", "dewatering"],          // T4 line items
      "route": "M4|null"
    },
    "B": {
      "statement": "string",
      "indicators": [ { "key": "bws|bwd|sev|iav|rfr|gtd", "class": "string|no_data", "tier": "T2|T4" } ],
      "seasonal_caveat": "string",          // R-COND-03 sentence, mandatory when annual bws low
      "groundwater_line": "string",         // R-COND-04
      "vintage_flag": "string|null",        // R-CLASS-05
      "scenario_context": "string|null",    // R-COND-02, screening only
      "spatial_hedge": "area-around-mine"   // R-COND-06 constant
    },
    "C": {
      "statement": "string",
      "causal_tier": "C0 | not_established",   // read-spine ceiling (R-LADDER-01)
      "evidence_needed": ["string"],           // R-LADDER-05
      "attribution_phrase": "mining and industrial development in this area"  // R-LADDER-06
    }
  },
  "watchlist": {
    "phrasing_lock": "documented-elsewhere / watch-for-not-measurement",   // R-WATCH-10 constant
    "headline_rows": [ { "contaminant": "string", "tier_badge": "regulatory|peer-reviewed|NGO-field|preprint",
                         "compartment": "residue_porewater|discharge|runoff|dam|seepage|sediment",
                         "receptor": "freshwater|marine|groundwater", "cite_slot": "string" } ],
    "lower_evidence_rows": [ /* same shape; single-study, cite visible (D1) */ ],
    "floor_rows": [ /* regulatory baseline, subordinate, applicability flags (R-WATCH-01) */ ],
    "pathway_badge": { "value": "geogenic_ARD|process_acidity|stored_mineral_acidity|none_known", "tier": "T2|T4" },
    "benchmark_columns": ["WHO", "PP22_LVI", "PP22_LVIII", "IFC_context_only"],  // omit, never guess
    "empty_state": "string|null",          // R-WATCH-11 when no measured values
    "operator_disclosure": { "statement": "string", "tier": "T1p|T2|T4" }        // R-WATCH-15
  },
  "gap_line": {
    "text": "string",                      // one sentence, site-specific (R-GAP-01/03)
    "selected_gap": "measurement | demand | seasonal | attribution_boundary",    // R-GAP-02 priority
    "secondary_gaps": ["string"],
    "route": "M5 | M4"
  },
  "banned_checks": [ { "id": "R-BANNED-01..12", "passed": true } ],   // all must pass to render
  "reasoning_trace": [
    { "rule_id": "string", "fired": "boolean",
      "because": "string",                 // the input values that satisfied/failed the condition
      "emitted": "string|null" }           // what it stamped (panel, tier, flag, row set)
  ],
  "aq5_mode": { "enabled": "boolean", "label": "hypothetical future data layer", "deltas": ["string"] }
}
```

**Example instance — case (a), today (abridged):**

```json
{
  "site_id": "preset-hpal-coastal-a",
  "preset_note": "Basin values are illustrative presets consistent with A6; not measurements of a named site.",
  "regime": {
    "label": "disruption-dominant", "provisional": true,
    "secondary_flags": ["quality_watch", "vintage_unassessed"],
    "seasonal_status": "unassessed", "buffer_state": "clear", "confidence": "MED",
    "preregistration": { "expected": "disruption-dominant + seasonal pending + vintage flag (A6)", "matches": true }
  },
  "panels": {
    "A": { "statement": "Estimated ~1.0e8 m3/yr (T3 band: HPAL ~1,700 m3/t Ni x 60 kt/yr; grade 1.0-1.8% Ni; magnitude pending primary sourcing).",
           "tier": "T3",
           "band": { "low": null, "high": null, "unit": "m3/yr", "grade_assumption": "1.0–1.8% Ni", "coefficient": "HPAL ~1,700 m3/t Ni (UNVERIFIED-primary)" },
           "flags": ["unverified_primary"],
           "source_split": { "surface": "T4", "ground": "T4", "sea": "T4" },
           "non_licensed_items": ["seawater", "rain_capture", "dewatering"], "route": "M4" },
    "B": { "statement": "Leading risks: disruption (rfr High). Annually not scarcity-constrained (bws Low, preset 8%) — dry-season conditions have not been assessed.",
           "indicators": [ {"key":"bws","class":"Low (8%, preset)","tier":"T2"}, {"key":"rfr","class":"High (preset)","tier":"T2"}, {"key":"gtd","class":"no_data","tier":"T4"} ],
           "seasonal_caveat": "Annual averages can hide dry-season shortage: dry-season conditions have not been assessed.",
           "groundwater_line": "Groundwater drawdown is a separate question (no data).",
           "vintage_flag": "Demand-vintage unassessed: basin model may predate local industrial development (A5).",
           "scenario_context": null, "spatial_hedge": "area-around-mine" },
    "C": { "statement": "Change since operations began (2021) has not been analyzed for this site.",
           "causal_tier": "not_established",
           "evidence_needed": [">=60 pre-months satellite record, >=70% coverage (B1)", ">=2 valid comparison areas (B3)", "paired up/downstream sampling across flow states + lithology screen (B7, M5)"],
           "attribution_phrase": "mining and industrial development in this area" }
  },
  "watchlist": {
    "phrasing_lock": "documented-elsewhere / watch-for-not-measurement",
    "headline_rows": [
      { "contaminant": "Cr(VI)", "tier_badge": "peer-reviewed", "compartment": "residue_porewater|discharge|runoff", "receptor": "marine", "cite_slot": "Delina 2025 (residue); Gecko (discharge)" },
      { "contaminant": "Ni", "tier_badge": "regulatory", "compartment": "discharge", "receptor": "marine", "cite_slot": "EPA 440 G" },
      { "contaminant": "Co", "tier_badge": "peer-reviewed", "compartment": "discharge", "receptor": "marine", "cite_slot": "cluster-6" },
      { "contaminant": "Mn", "tier_badge": "peer-reviewed", "compartment": "discharge", "receptor": "marine", "cite_slot": "cluster-6" },
      { "contaminant": "sulfate/TDS", "tier_badge": "peer-reviewed", "compartment": "discharge", "receptor": "marine", "cite_slot": "cluster-6 (conductivity sentinel)" },
      { "contaminant": "Mg", "tier_badge": "peer-reviewed", "compartment": "discharge", "receptor": "marine", "cite_slot": "cluster-6" },
      { "contaminant": "turbidity/TSS", "tier_badge": "NGO-field", "compartment": "runoff", "receptor": "marine", "cite_slot": "cluster-6" },
      { "contaminant": "pH (process acidity)", "tier_badge": "regulatory", "compartment": "discharge", "receptor": "marine", "cite_slot": "EPA 440 G / Permen LH" }
    ],
    "lower_evidence_rows": [ { "contaminant": "Cd", "tier_badge": "peer-reviewed(single)", "compartment": "discharge", "receptor": "marine", "cite_slot": "single study, visible (D1)" } ],
    "floor_rows": [ { "contaminant": "As|Cu|Pb|Ni|Zn|TSS|pH|nitrate/ammonia", "tier_badge": "regulatory", "compartment": "monitoring-baseline", "receptor": "marine", "cite_slot": "EPA 440 Subpart G + MDMER" } ],
    "pathway_badge": { "value": "process_acidity", "tier": "T4" },
    "benchmark_columns": ["WHO", "PP22_LVIII", "IFC_context_only"],
    "empty_state": "No measured value exists for this site. That is a data gap, not an all-clear. -> M5",
    "operator_disclosure": { "statement": "Operator has published nothing on water treatment/recycling.", "tier": "T4" }
  },
  "gap_line": {
    "text": "Whether the coastal water this community uses carries any of the listed contaminants cannot be known from satellites or basin models — no public measurement exists for this coast; a ground sample is the missing link.",
    "selected_gap": "measurement",
    "secondary_gaps": ["actual water use -> M4", "dry-season conditions -> seasonal screen"],
    "route": "M5"
  },
  "banned_checks": [ { "id": "R-BANNED-03", "passed": true }, { "id": "R-BANNED-08", "passed": true } ],
  "reasoning_trace": [
    { "rule_id": "R-CLASS-01", "fired": false, "because": "bws 8% < 40%", "emitted": null },
    { "rule_id": "R-CLASS-02", "fired": false, "because": "driest-quarter unrun; AWARE monthly unrun", "emitted": "seasonal_status=unassessed (T4)" },
    { "rule_id": "R-CLASS-03", "fired": true, "because": "rfr=High AND bws 8% < 20% AND no seasonal flag (screen pending)", "emitted": "regime=disruption-dominant (provisional), T2" },
    { "rule_id": "R-CLASS-05", "fired": false, "because": "cluster demand unknown", "emitted": "vintage_check=unassessed (T4 flag rendered)" },
    { "rule_id": "R-DEMAND-02", "fired": false, "because": "no license figure (Amdalnet blocked; REQUEST-NEEDED)", "emitted": null },
    { "rule_id": "R-DEMAND-03", "fired": true, "because": "process=HPAL (2-source confirmed), capacity=60kt Ni/yr", "emitted": "Panel A T3 band ~1.0e8 m3/yr" },
    { "rule_id": "R-DEMAND-04", "fired": true, "because": "HPAL coefficient UNVERIFIED-primary", "emitted": "flag: magnitude pending primary sourcing" },
    { "rule_id": "R-WATCH-02", "fired": true, "because": "ore_type=laterite AND process=HPAL", "emitted": "headline rows Cr(VI),Ni,Co,Mn,sulfate/TDS,Mg,turbidity,pH; Cd->lower-evidence" },
    { "rule_id": "R-WATCH-07", "fired": true, "because": "receptor=marine", "emitted": "benchmark columns -> marine ambient (PP22 L.VIII); WHO always" },
    { "rule_id": "R-WATCH-11", "fired": true, "because": "measured_values empty", "emitted": "empty state: data gap, not an all-clear" },
    { "rule_id": "R-LADDER-01", "fired": true, "because": "no change analysis exists", "emitted": "Panel C: C0 not established + evidence-needed" },
    { "rule_id": "R-GAP-02", "fired": true, "because": "watchlist non-empty AND measured_values empty (priority 1)", "emitted": "gap=measurement -> M5" }
  ],
  "aq5_mode": { "enabled": false, "label": "hypothetical future data layer", "deltas": [] }
}
```

---

## Appendix A — Bridged assumptions (gaps the sources left open; each is a v0.2 question, not settled doctrine)

- **[BRIDGE-1]** M1 names the ARD *switch* ("GARD-backed row set") but does not enumerate its contaminant rows; this ruleset states the set generically (pH/acidity, sulfate, low-pH-mobilized metals) and defers exact rows to the Phase-3 authored table. **Do not present specific ARD contaminants as sourced.**
- **[BRIDGE-2]** The sources define gates, not the residual class: the fallback regime "no dominant regime asserted — juxtaposition only" (R-CLASS-06) and the confidence-derivation bookkeeping (R-CLASS-10) are extensions in the sources' spirit (M2: "prior, not a switch").
- **[BRIDGE-3]** X1 §6 mandates a specific [gap] line but no selection algorithm; the measurement > demand > seasonal > attribution priority order (R-GAP-02) is authored here for determinism.
- **[BRIDGE-4]** A3 requires "no seasonal-scarcity flag"; when the screen is *unassessed* (not cleared), this ruleset renders the disruption label as **provisional** — an interpolation between A3 and A6's own posture ("pending the A2 screen").
- **[BRIDGE-5]** All numeric basin values and capacities in §4 traces are **illustrative presets**, labeled as such, chosen only to satisfy documented qualitative calls (A6; M2 §5). They are prototype seed data, not claims about real sites.
- **[BRIDGE-6]** `captive_coal` is promoted to an explicit input field; M1 writes "RKEF (captive coal)" as a single route without a separate power-source key.
- **[BRIDGE-7]** No Cu-Co water-use coefficient exists in the sources (M2 §7: a new commodity costs ~3–5 days of coefficient research); case (c) therefore renders Panel A as T4 — this is fidelity, not a modeling choice.

## Appendix B — What a reviewer should attack first

1. The R-GAP-02 priority order (pure authoring; no source anchor).
2. The "provisional disruption" interpolation (BRIDGE-4) — the hydrologist SME who signs A6 should sign this too.
3. Whether rendering the HPAL magnitude at all (R-DEMAND-03/04, flagged) honors M2 §8a's "magnitudes ship only after primary-sourcing" — the alternative is suppressing the number entirely until the Northey/Khoo pull closes.

---

## Appendix C — R-SUMMARY: the screening-summary presentation layer (added for the leadership prototype)

**Purpose.** Leadership asked for a plain result a non-specialist can read fast: a Low-to-High level for water stress and for water-quality risk. This layer composes the existing panels into two qualitative levels. It adds no new claim and crosses no panel boundary. Two SEPARATE levels are shown side by side; they are never combined into one water-risk score, because a single blended score is exactly what R-BANNED-03 forbids.

- **[R-SUMMARY-01] Water-stress level.** Map the sub-basin Aqueduct baseline water-stress class to a level: Low (bws < 10%), Low-Medium (10 to 20), Medium (20 to 40), High (40 to 80), Very High (> 80). When the regime is mixed/indeterminate, render "Uncertain" instead. EMITS a T2 level (a published modeled class, not a new computation). SOURCE M2 §2 (Aqueduct classes); consistent with Aqueduct's own water-risk categories. The seasonal caveat (R-COND-03), the vintage flag (R-CLASS-05), and the disruption framing travel with the level as a note; the level never asserts "not stressed" from an annual composite (R-BANNED-08).

- **[R-SUMMARY-02] Water-quality hazard level.** Map the watchlist route to a hazard-potential level: acid-rock drainage and HPAL chromium-6 processes rank High; RKEF with captive coal (adds Hg, As) ranks Very High; sediment-dominant ore-export ranks Medium; a sparse-chemistry commodity (Li brine) ranks Low. This is the hazard POTENTIAL of the process type, a screening level, NOT a measurement of the site and NOT a predicted concentration (R-BANNED-05). The empty-state gap (R-WATCH-11) still stands and is shown next to the level.

- **[R-SUMMARY-03] No blend.** The two levels render side by side, each with its own provenance (stress = T2 modeled; quality = screening/hazard-potential). No arithmetic combines them. SOURCE X1 §2, R-BANNED-03.

**Reviewer note.** The stress mapping is defensible (it is Aqueduct's own class surfaced as a word). The quality mapping is authored judgment (a coarse ordering of process-type hazard) and should be reviewed by the geochemist alongside the M1 watchlist; it is labeled "hazard potential, not a measurement" in the UI to keep it honest.
