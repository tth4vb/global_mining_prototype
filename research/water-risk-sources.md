# Water-Risk Glass Box: primary sources

Citations behind the figures shown in the prototype. Researched Aug 2026. Confidence: HIGH = peer-reviewed or regulatory; MED = credible report or field investigation; LOW = indirect or process-analogy.

## Water-use coefficients (Panel A "a mine like this would draw")

Best primary source, route-specific, per tonne of nickel:
- **Northey, S.A. and Haque, N. (2013). Life cycle based water footprint of selected metal production. CSIRO, Australia.** Blue-water consumption (direct on-site + indirect embodied):
  - HPAL (hydrometallurgy): direct 303 + indirect 1,409 = **~1,712 m3/t Ni**.
  - RKEF (pyrometallurgy / ferronickel): direct 68 + indirect 34 = **~102 m3/t Ni**.
- Carried forward and peer-reviewed in: Northey et al. (2014), Minerals Engineering 69:65-80, DOI 10.1016/j.mineng.2014.07.006; Northey et al. (2018), J. Cleaner Production 184:788-797, DOI 10.1016/j.jclepro.2018.02.307. Restated in Frontiers in Chem. Eng. (2022), DOI 10.3389/fceng.2022.978842.
- Corroborates direction only: Khoo et al. (2017), J. Cleaner Production 142:1765-1777; Mudd (2010), Minerals Engineering 23:1235-1244.

**Verdict:** the tool's bands (HPAL 1,200-2,200; RKEF 60-150 m3/t Ni) are defensible; central estimates 1,712 and 102 sit inside. Confidence HIGH.

**Boundary note (must be shown):** these are blue-water CONSUMPTION footprints (direct + supply chain), not total withdrawal. They exclude once-through cooling and seawater, which are site-specific and can be higher. On direct/site water only the HPAL-RKEF gap is ~4.5x (303 vs 68); on total footprint it is ~17x (because ~96% of HPAL's footprint is embodied in sulphuric acid).

## Watchlist contaminants

### A. Nickel laterite, HPAL (Obi Island / Halmahera)
- **Cr(VI)** — Delina et al. (2025), Environmental Science & Technology 59(11):5683-5694, DOI 10.1021/acs.est.4c05383 (Cr in laterite tailings, redox-dependent mobility; study site Palawan, process-analogy). Field case: Gecko Project / OCCRP / Guardian (2023-24), "Clean Cars, Poisoned Water," Cr-6 in the Kawasi spring, Obi, 155-240% over the Indonesian limit. [MED]
- **Ni, Co, Mn** — process metals; regulatory anchor US EPA 40 CFR Part 440 Subpart G (nickel ore). Site link via the Obi field investigation. No peer-reviewed Indonesian HPAL effluent assay found. [MED]
- **Sulfate/TDS, Mg** — process-inherent (acid leach + neutralisation; Mg from the laterite matrix). No site-specific source. Label "process chemistry, not site-measured." [LOW]
- **Turbidity/TSS, pH** — EPA 440 Subpart G (TSS, pH); MDMER; PP 22/2021. Land-disturbance / process-inherent. [HIGH regulatory]

### B. Nickel laterite, RKEF with captive coal (Morowali / IMIP)
- **Hg, As** — Nexus3 Foundation + Tadulako University (2025) blood study: 47% of residents over the Hg threshold, 32% over As; fish As up to 20x baseline. Reported via Mongabay (Jul 2025). NOTE: study is at Weda Bay / IWIP (Halmahera), same RKEF + captive-coal process, so a process-analogy for Morowali specifically. [MED]
- **Se** — coal-ash pathway, general literature (Se partitions to fly ash, highly leachable). Not measured at the Indonesian site. [LOW / process-analogy]

### C. Copper-cobalt sulfide, ARD (Tenke Fungurume / Kolwezi, DRC)
- **ARD mechanism (low pH, sulfate, low-pH-mobilised Cu/Co)** — GARD Guide (INAP); Verburg et al. (2009), Mine Water and the Environment 28:305-310, DOI 10.1007/s10230-009-0078-4. [HIGH mechanism]
- **DRC site metal contamination/exposure** — Banza et al. (2009), Environmental Research 109(6):745-752; Banza Lubaba Nkulu et al. (2018), Nature Sustainability 1:495-504; Muimba-Kankolongo et al. (2022), J. Environmental and Public Health 2022:4515115. [HIGH]. Cite GARD (mechanism) + these (site contamination) as a pair, not interchangeably.

## Standards / regulatory anchors
- US EPA 40 CFR Part 440 (Ore Mining and Dressing). Subpart G = nickel; Subpart J = copper/lead/zinc/gold/silver/molybdenum. Use J for the DRC copper context.
- Canada MDMER, SOR/2002-222 (Metal and Diamond Mining Effluent Regulations).
- WHO Guidelines for Drinking-water Quality, 4th ed. incorporating addenda (2022).
- Indonesia PP No. 22 Tahun 2021 (water-quality standards, Ch. III).
- Aqueduct 4.0: Kuzma et al. (2023), WRI Technical Note, DOI 10.46830/writn.23.00061. Sub-basin values read live from the Esri Living Atlas mirror (HydroBASINS L6, pfaf_id).

## Honest gaps (flagged in the UI as "process, not site-measured")
- Sulfate/TDS/Mg (HPAL): no site source; process chemistry only.
- Se (RKEF): coal-ash pathway general; not site-measured.
- Ni/Co/Mn effluent loads: regulatory listing + field case, no peer-reviewed Indonesian HPAL effluent assay.
- Hg/As: strong evidence, but at IWIP not Morowali (same process).
