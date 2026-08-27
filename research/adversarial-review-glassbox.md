# Adversarial review — Water-Risk Glass Box prototype

**Reviewed:** `water-risk-glassbox/index.html` (1,346 lines, engine + copy) against `research/methodology/water-risk-ruleset-v0.1.md` (incl. Appendix C R-SUMMARY).
**Date:** 2026-08-27. **Stance:** hostile reviewer. No praise below; only what breaks, and how to fix it.

The pitch this prototype makes to leadership is: *we are the people who refuse to overclaim, and here is the machinery that makes overclaiming impossible.* Every finding below is scored against that pitch. The most damaging findings are the places where the prototype itself does the thing the ruleset bans — because a reviewer who finds one of those stops believing the other twelve green checkmarks.

---

## Priority table (all findings, ranked)

| # | Finding | Severity | Lens |
|---|---------|----------|------|
| F1 | Edited basin values keep the real-site Aqueduct citation — fabricated numbers rendered over a named sub-basin with "Kuzma et al. 2023" attached | **HIGH** | red team |
| F2 | T3 renders a point, not a band — violating the model's own loudest rule on the same screen that states the rule | **HIGH** | expert |
| F3 | T4 fallback gives a false reason ("no coefficient set exists") when the real reason is capacity-unknown or process-unknown; the D4 kill-switch story is never shown | **HIGH** | red team |
| F4 | The ±10pp buffer makes the stress meter read "Uncertain" for the entire 10–50% range; three of five meter segments are unreachable; class names disagree across the same screen | **HIGH** | expert + leader |
| F5 | Aq5 mode fabricates inputs for custom sites (dry-season = bws × a *flood-risk* multiplier; groundwater no-data silently becomes "Low"; the "downscaled" map is seeded noise) | **HIGH** | expert + red team |
| F6 | The reveal choreography spoils itself: verdict visible at t=0 in the summary bar, result panel at 1.1s, flow still animating until ~4.2s; animation is a stagger, not a decision replay | **HIGH** | UX |
| F7 | "12 / 12 checks passed" is hardcoded — no check executes | MED-HIGH | red team |
| F8 | Payload copy carries internal jargon into the leadership read: "route to M5", "pfaf", "AWARE worst-month CF (Route B)", "demand vintage", "no dominant regime asserted", "C0", "1.0 x 10^8" | MED-HIGH | leader |
| F9 | A *proposed* mine renders "change since operations began in 2024" and "the operator could give this number today" — `status` is never consumed | MED | red team |
| F10 | The quality-hazard level is computed but never rendered; the readnote promises it "below" and the full read doesn't contain it | MED | UX |
| F11 | Real named operating sites (Obi, IMIP, Tenke Fungurume) are bound to verdicts; methodology footer still claims presets are "illustrative, not measurements of named sites" — now false | MED | expert / legal |
| F12 | "The dry-season screen is clear" asserted from one of two routes (AWARE only, driest-quarter unrun) | MED | expert |
| F13 | "Cluster demand known" toggle declares vintage "reliable" without running any comparison; the *unreliable* state (the interesting one) is unreachable; trace text contradicts the emitted state | MED | red team |
| F14 | Process-unconfirmed watchlist claims to be "the union of candidate processes" but omits the RKEF coal rows (Hg/As/Se) — not the union | MED | red team |
| F15 | Flow order ≠ trace order ≠ ruleset order (three different orderings of the same four gates in one "glass box") | MED | UX |
| F16 | Presets never demonstrate scarcity-dominant, seasonal-flag, T1/T1p, or the benchmark guard; the demo's most persuasive states are reachable only by hand | MED | UX |
| F17 | T1/T1p paths show the words "Metered"/"Licensed" where the why-card promises a quantity; grade band renders the spec phrase "printed under the band" as UI copy | MED-LOW | leader |
| F18 | Gap line's attribution fallback fires for any complete site, not only scarcity-dominant (diverges from R-GAP-02) | LOW | expert |
| F19 | Trace meta says "~20 rules evaluated"; methodology says 69 — leaders will ask where the other 49 are | LOW | leader |
| F20 | DRC preset flood label mismatch (`rfr:"Medium"` vs `rfrLabel:"Medium-High"`) — flow and summary bar disagree | LOW | red team |

---

## Lens 1 — Skeptical non-expert leader

### Can a leader follow HOW it decides in one sitting?

Mostly yes for Branch 2 (the water-use ladder is genuinely legible: meter? license? estimate? unknown). Partially for Branch 3 (a switch is easy). **No for Branch 1**, for two reasons: the questions use classifier taxonomy as answers ("Mixed / indeterminate", "Disruption-dominant (provisional)"), and the top-line verdict slot is filled with that same taxonomy. A leader who reads "**No dominant regime asserted (MED)**" in the summary bar has learned nothing and will not repeat that sentence to anyone. Same for "Seasonal scarcity (secondary)" as a *primary* verdict — "secondary" in the headline slot reads as a contradiction.

### Jargon audit of rendered copy, with the fix for each

Every fix below is an inline gloss or substitution — none dumbs down the rigor; the technical term can stay in parentheses or the full read.

| Rendered copy | Problem | Fix (exact replacement) |
|---|---|---|
| "route to M5" / "route to M4" (the gap line — the emotional payload of the whole read) | Internal doc IDs shipped to leadership | "→ commission a ground sample (protocol M5)" / "→ send the operator a disclosure request (template M4)" |
| "pfaf 533000" (map caption) | Raw HydroBASINS key | Drop from the caption; keep in the source line as "basin id 533000 (Pfafstetter code)" |
| "HydroBASINS level 6" | Unglossed | "one sub-basin (HydroBASINS level 6 — typically a few tens of km across)" |
| "AWARE worst-month CF known — Route B for the seasonal screen" (a *control label*) | Three unglossed terms in nine words | "Dry-season water index available <small>AWARE: how much scarcer water is in the worst month vs the world average</small>" |
| "The tool has not assessed the demand vintage." | "Demand vintage" is opaque | "The basin model's demand data may be older than the industrial build-out here. The tool has not checked." |
| "No dominant regime asserted" (headline verdict) | Taxonomy where a sentence should be | "No single water risk dominates here — the readings are shown side by side" |
| "Disruption-dominant (provisional)" | Leaders read "disruption" as supply-chain disruption | "Flood- and sediment-driven (main risk: disruption, not shortage) — provisional until the dry season is screened" |
| "C0 not established" badge | C0 defined on the other tab | Badge tooltip + first use: "C0 = timing only: we can say *when* things changed, never *who caused it*" |
| "magnitude pending primary sourcing" | Sourcing-workflow jargon | "the per-tonne figure comes from literature we have not yet verified against the original studies" |
| "T1p Permitted" | The "p" is never explained inline; tier definitions live in hover tooltips (invisible on touch, undiscoverable) | Make every tier badge click-to-open a one-line popover; first occurrence: "T1p = a permit figure: what it *may* take, not what it takes" |
| "1.0 x 10^8 m3/yr" | Leadership does not read scientific notation | "about 100 million m³ a year" (keep the notation in the full read) |
| "ore-grade assumption 1.0 to 1.8% Ni, printed under the band" | Spec instruction leaked verbatim into UI (`A.grade` renders the phrase "printed under the band") | Render the assumption itself: "assumes ore grade 1.0–1.8% Ni" |
| "captive coal" | Unglossed | "its own on-site coal power plant ('captive coal')" |
| "Cr(VI)" in rows vs "chromium-6" in notes | Two names, one substance | Use "Chromium-6 (Cr VI)" in row labels once, then Cr(VI) |

### Is the three-panel / tier / ladder framing over-engineered for this audience?

The *layering* is right (meter → map → comparison → gap; panels behind a disclosure). Two things are over-engineered:

1. **Five tiers plus a "Screening" pseudo-badge plus four evidence badges (REG/PEER/FIELD/PREPRINT) plus C0–C3** is four parallel grading systems on one screen. A leader cannot hold four. Keep all four in the full read, but in the top-level result use only the tier badge, and gloss it in words every time ("estimated — always a range", "no public figure").
2. **The regime taxonomy in the verdict slot** (see above). The taxonomy is for the hydrologist; the verdict slot is for the leader.

### The ONE thing that would most improve leadership comprehension

**Compose one plain-English verdict sentence and put it at the top of Step 3, above the meter** — subject, verb, object, no taxonomy, built from `regime + gap`:

> "Main water risk near this mine: **flooding and sediment, not shortage** — and **no one has ever measured this coast's water**. That measurement is the missing link."

Leaders repeat sentences, not meters, and this sentence carries both halves of the pitch (what the model found; what it refuses to claim). Everything currently in the verdict slot becomes secondary chips under it. This is a one-function change (`composeVerdictSentence(o)`), and it is the highest-leverage edit in the file.

---

## Lens 2 — Water-risk / hydrology expert

### Where an expert reviewer embarrasses the team

**E1. T3 is a point, not a band (F2).** The Methodology tab states, in a card: "T3 Estimated. Always a range, never a point." The result then shows "Estimated on the order of 1.0 x 10^8 m3/yr" — a single coefficient (`coeff()` returns `{v:1700}`) times capacity. "On the order of" is a hedge, not a range. R-TIER-04 and R-BANNED-06 are violated by the app's own hero case, on the same screen that lists them as banned. This is the single fastest way for a reviewer to dismiss the whole apparatus. *Fix:* make `coeff()` return `[lo,hi]` (even a placeholder ±40% labeled as such) and render "roughly 0.6–1.4 × 10⁸ m³/yr (T3 band)". If no defensible edges exist yet, that is exactly what R-DEMAND-04 flags — render the band with the UNVERIFIED flag, never a point.

**E2. The buffer devours the middle of the scale (F4).** Buffer = ±10pp around the 20 and 40 edges → every bws from 10 to 50 is `mixed/indeterminate` → the meter renders "Uncertain" across a 40-point range covering the most common stress values on Earth. "Medium" and "Low-Medium" are unreachable; "High" only above 50. Slide the bws slider and watch the plain-language meter go Low → Uncertain (for half the scale) → High. An expert will also note the deeper error: **the Aqueduct class is a published T2 fact even near an edge.** Boundary proximity should qualify the *regime call*, not blank the *class read*. *Fix:* meter always shows the Aqueduct class; add a "near class edge" chip when in buffer; reserve "Uncertain"/mixed for the regime line. (Appendix C R-SUMMARY-01 as written causes this — fix the spec too.)

**E3. Class names disagree with Aqueduct and with themselves.** `classOfBws` says "Medium to High" / "Extremely High"; the meter says "Medium" / "Very High"; Aqueduct 4.0's real names are Low, Low-Medium, Medium-High, High, Extremely High. The reviewer note claims the stress level "is Aqueduct's own class surfaced as a word" — it is not; it is renamed twice, differently, on one screen. *Fix:* one naming, Aqueduct's own, everywhere.

**E4. The disruption gate rests on the wrong indicator, alone.** `regime=disruption-dominant` fires on riverine flood risk class — a flood *hazard* layer (exposure of people/assets to inundation), not a sediment/turbidity/altered-runoff indicator. The ruleset excluded land disturbance for a good reason (H-5 circularity), but that leaves rfr carrying the entire disruption diagnosis by itself, and the copy then promises "sediment, turbidity, altered runoff" — none of which was tested. A hydrologist will ask: "you diagnosed sediment risk from a flood map?" *Fix:* the copy must downgrade to what was actually tested: "flood variability is high (T2); sediment and turbidity are the *expected* co-risks of this regime, not separately assessed." One sentence, honest.

**E5. Aq5 fabrications (F5).** For custom sites with Aq5 on: `driest = bws × sevMult[rfr]` — a dry-season scarcity ratio synthesized from annual stress times a multiplier *indexed by flood-risk class*. There is no hydrological world in which riverine flood class is the seasonal-amplification factor. This fabricated number then drives the real seasonal gate (≥40 sets a real flag; regime flips). Also `gtd: no_data → "Low"` — the tool invents a reassuring groundwater class from no data, which is precisely the "asserting a negative from absence" sin the model exists to ban. And the "downscaled" Aq5 map is a sin/cos noise field seeded from the mean, captioned "the variation is representative" — it is not representative of anything; it is decorative. *Fix:* under Aq5, custom sites render "no 5.0 preset exists for a custom site — seasonal screen stays unassessed"; gtd no_data stays no_data; the noise raster gets the caption "illustrative texture only — not data" or is removed.

**E6. "The dry-season screen is clear" from half a screen (F12).** With only the AWARE route present (CF < 10) and the driest-quarter ratio unrun, the engine renders "The dry-season screen is clear." One of two OR'd routes returning quiet does not clear the screen; the other route could still fire. *Fix:* "one of the two seasonal checks is quiet; the driest-quarter check has not been run." (The ruleset itself under-specifies this; tighten R-CLASS-02.)

**E7. The vintage check never actually checks (F13).** R-CLASS-05's entire point is a *comparison* (cluster demand ≥ 20% of basin modeled withdrawal → "unreliable"). The toggle "Cluster demand known" simply declares the vintage "reliable" — the diagnostic can only ever return the comfortable answer, and the trace's `because` text still says "cluster demand is not known" while emitting "reliable". *Fix:* toggle exposes a cluster-share slider; ≥20% renders the *unreliable* flag — which is the demo-worthy state ("the published stress class may understate reality here").

**E8. Marine sites: pressure juxtaposed against the wrong water.** For a coastal HPAL plant the why-card puts ~100M m³/yr next to *freshwater basin* stress. If a material share is seawater intake, the juxtaposition overstates freshwater pressure. The ruleset handles this via the T4 source split; the why-card drops that caveat. *Fix:* one line in the pressure card: "how much is freshwater vs seawater is not public (T4) — the comparison assumes the worst case."

**E9. "No method can do this. Question any figure that claims to."** Defensible for *share of stress caused* (the denominator argument holds), but as written it invites a footprinting expert to reply "share of basin withdrawals is routinely computed where withdrawal and basin totals are gauged." *Fix:* tighten to "no method can say what share of this basin's *stress* a mine causes; even a share of *withdrawals* needs a metered figure and a trustworthy basin total, and neither exists here." Stronger, and it names the exact missing inputs.

**E10. Honesty caveats: over/underclaims.** Correctly claimed: the C0 ceiling, the empty-state-not-all-clear, permitted≠enforced, omit-don't-guess national columns, area-around-mine phrasing — all sound and well-worded. Overclaims found: "screen is clear" (E6), "variation is representative" (E5), the map caption after edits (F1), "12/12 checks passed" (F7), "This list is the union of candidate processes" (F14 — it omits Hg/As/Se, so it silently *under*-warns, the bad direction for a watchlist). Underclaim found: the RKEF-without-capacity case throws away the known ~100 m³/t intensity entirely (see feature review) — the tool knows something decision-relevant and says "no public figure exists," which is more ignorant than the model actually is.

**E11. Threshold provenance is fine — say so louder.** bws ≥ 40 (Aqueduct's own High edge), AWARE ≥ 10 (order of magnitude above world average), 10× kill switch: all are stated strawman values with attack instructions. This is the defensible part. The vulnerability is not the numbers; it is the places above where the implementation contradicts the spec.

---

## Lens 3 — Product / UX on the flowchart

### The choreography defeats its own theater (F6)

Three timing facts, from the code:

1. `renderSummaryBar(o)` runs first — **the verdict ("Disruption-dominant · MED") is on screen at t=0**, above the flow.
2. The output panel animates in at a **hardcoded 1100ms** (`out.style.animation="frise .5s ease 1100ms both"`).
3. The flow's stagger (`step:150`, one shared counter across all three branches, ~28 items) finishes at **~4.2s**. The `renderFlow` return value (total duration) is computed and then never used.

So the audience reads the answer before the "thinking" starts, the result card lands while branch 1 is mid-reveal, and branches 2–3 fade in after everyone has stopped watching. The animation is also the wrong kind: a top-to-bottom stagger reveals taken and untaken boxes with the same rhythm — nothing *travels the path*, so nothing reads as a decision.

**Fix (pick one, the first is better):**
- **Step-through, narrated.** A "Next decision" button (with auto-advance ~700ms as default). Each step: highlight the question, flash the input value, then light the YES or NO edge, then the landing node — and simultaneously highlight the corresponding row in the rule log (this fuses the flow and the trace into one glass box instead of two parallel ones). Verdict slot in the summary bar stays masked ("deciding…") until the last branch lands. Result panel enters after it.
- **Minimum fix:** chain the timings — result delay = `renderFlow`'s returned total + 300ms; mask the summary-bar verdict until then; run the three branches in parallel (each ~1.5s) rather than sequentially, since they are independent in the engine anyway.

### Is showing all three branches at once too much?

Three branches at once is fine *spatially* (they answer three different questions and the labels say so). It is too much *temporally* — one sequential 4s reveal across all three implies a dependency that does not exist. Reveal them in parallel or step through them one at a time; don't serialize the stagger.

### Branch-level critiques

- **Branch 1 order is not the engine's order (F15).** Flow shows buffer → scarcity → disruption → seasonal; the trace logs 01, 02, 04, 03; the ruleset lists 01–04. Three orderings of the same gates in a transparency tool. Fix: pick the ruleset order everywhere, or annotate the flow "checked in this order: edge-proximity first" and make the trace match.
- **Branch 1's third question hides a conjunction.** "Is it flood-driven?" is actually `rfr high AND bws<20 AND no seasonal flag`. The val line lists all three, good — but when it fails, the leader can't see *which* condition failed. Fix: bold the failing clause in the val line.
- **Branch 2's start node** "No water-use figure yet" is a conclusion stated before the first question. Rename "What do we know about its water use?"
- **Branch 3** is honest as a switch, but the active chip does not say *why* it matched. Add the matched condition to the chip ("laterite + HPAL").
- **The "single change" for "watch the model think":** the step-through with synchronized trace-row highlighting. It converts the flow from an illustration *of* the decision into a replay *of* it, which is the demo's entire promise.

### Other product findings

- **F16 — the presets never show the model's best states.** All five land in disruption / none / mixed; scarcity-dominant, the seasonal flag, T1/T1p, and the benchmark guard are only reachable by hand-editing. Add a sixth preset ("Andean copper, high-stress basin, license figure available") that lights up scarcity + T1p + (with a sample toggled) the guard. Right now the sales demo cannot show the model at its most informative without live slider fiddling.
- **F10 — the missing second meter.** `out.summary.quality` (High/Very High hazard potential, with the good "Screening, not a measurement" badge) is computed and never rendered; the readnote promises "the chemical hazard ... is in the full technical read below," which contains the watchlist but not the promised plain level. Either render the two meters side by side (the code supports it — `meters` is a 2-col grid) or delete the dead computation and fix the readnote.
- **F17 —** T1/T1p why-card shows the words "Metered"/"Licensed" as the big figure with no number anywhere (there is no value input for these toggles). Either add a value field or render "a metered figure exists (value withheld in this demo)".

---

## Lens 4 — Missing-data red team

Traced through `runEngine` per gap:

| Gap fed in | What actually happens | Verdict |
|---|---|---|
| `process: "unknown"` (prospect preset) | `coeff()` → null → T4. Statement: "**Version 0.1 has no water-use coefficient set for this commodity and process.**" | **Wrong reason.** For Ni, coefficient sets exist for *both* candidate processes; the honest reason is "process unconfirmed; the candidate range spans ~17×, wider than the 10× limit (D4)." The ruleset's own best story (R-DEMAND-08 union → R-DEMAND-05 collapse) is specified but never implemented — the app skips the union and prints a false excuse. (F3) |
| `capacity: 0`, process known ("partial" preset — a *designed showcase* of degradation) | Same T4 statement claiming "no coefficient set exists" — false for Ni/RKEF — while the trace log for the same run correctly says "capacity unknown." **The statement and the trace contradict each other on screen.** Also discards the known ~100 m³/t intensity entirely. | **Misleading + self-contradictory.** (F3) |
| `ore_type: "unknown"` | Near-empty watchlist with an honest message; regulatory floor only; gap falls through to demand. | Correct. Best degradation path in the app. |
| No license, no meter | Clean descent of the ladder; T4 with disclosure route. | Correct. |
| `national_std: false` | "The tool has not transcribed the national standards… It omits the national column. It does not guess." | Correct, and well-worded. |
| `gtd: "no_data"` | Rendered as displayed T4 — until Aq5 is toggled, when it silently becomes "Low" for custom sites. | Correct in 4.0 mode; **fabricated in Aq5 mode** (F5). |
| `status: "proposed"` | **Ignored entirely** — engine never reads `s.status`. Panel C: "The tool has not analyzed the change since operations began in 2024" for a mine that has not begun operating. Gap line: "how much water this operation really uses… the operator could give this number today" — there is no operation and no operator ledger. | **Contradictory read.** (F9) Fix: `status==="proposed"` → Panel C: "This site is proposed; there is no operating period to analyze. The pre-operation baseline window starts now — the cheapest time to secure it." Gap: "the planned process route and water balance are not yet public; the EIA/AMDAL would contain both → disclosure." (Turns the gap into the *right* ask, and the baseline line is a genuinely valuable leadership beat.) |
| `process_confirmed` semantics | The app has no confirmed flag; "laterite + process unknown" routes to the union banner — but the rendered rows are LATERITE_BASE only. The banner says "**union of candidate processes**"; the union per R-WATCH-13 includes the RKEF-coal candidate rows (Hg, As, Se) and ore-export sediment emphasis. A union that omits rows **under-warns** — the one direction a watchlist must never fail. | **Wrong content under an honest banner.** (F14) |
| Basin fields edited by hand | `markCustom()` clears the preset highlight but **not** `aqsrc/pfaf/lat/lon/real`. Slide bws to 90% on the Obi preset → the map paints the real Obi Island sub-basin dark red and the caption asserts "**Real Aqueduct 4.0 value for the Obi Island sub-basin, pfaf 533000… Kuzma et al. 2023**", with the summary bar naming the site. | **The worst failure in the app**: a fabricated value attributed to a real dataset, a real citation, and a real place — the exact fabrication pattern (R-BANNED-08's "45%→62%") the ruleset was written to kill. (F1) Fix: any edit to `bws/rfr/gtd/aware*` nulls `aqsrc/pfaf/real/y2030r/y2050r` (keep lat/lon but retitle "edited scenario near Obi Island — not an Aqueduct value"), and the map caption switches to the "representative value" branch. |
| "12/12 checks passed" | `out.banned=true` unconditionally; nothing scans anything. | **Theater.** (F7) If a funder asks "show me a check firing," there is no answer. Fix: implement the checks as literal post-render assertions on the output HTML (regex for "caused", "% of", "safe", "guarantee", a point-figure adjacent to a T3 badge…) and add a dev toggle that *injects* a banned sentence to show a check actually blocking. A visibly-fireable check is worth more to the pitch than twelve green pills. |

**Is T4 "no public figure" the right fallback everywhere?** No — it is right when the model truly knows nothing (Cu-Co: no coefficient set — the current copy is exactly correct there), and wrong in the two cases where the model knows the process family (see F3 and the feature review below): there it should show what it knows (the per-process intensities) and state precisely which input is missing. A T4 that hides known, decision-relevant structure is a different failure from overclaiming, but it is still a failure of the "show your work" promise.

---

## Feature review — baseline proxy figures when withdrawal is unknown

**The question:** when there's no measured/permitted/estimable figure, should the tool show a "typical water use" proxy?

**Verdict: a single "typical" figure is a trap. Conditional (per-process) proxies are not only safe — they are the fix for finding F3, and they make the existing kill-switch visible instead of silent. Recommend building them.**

### Why the single figure is a trap

- The machinery already rules on this. A "typical nickel mine" number is the midpoint of HPAL∪RKEF ≈ 100–1,700 m³/t — a ~17× span. R-DEMAND-05 (D4) exists precisely to refuse bands wider than 10×, and R-DEMAND-08 explicitly walks this case into that refusal. Overriding D4 with a headline proxy would mean the model's most quotable number is the one its own rules call uninformative — and the first expert reviewer will compute the span and say so.
- The midpoint of a 17× span (~900 m³/t) is within 2× of neither real process. It would be wrong by ~9× for an RKEF site and ~2× for HPAL — and it is the number journalists and funders would quote.
- The whole pitch is "we refuse to print numbers we can't defend." One indefensible convenience figure converts every T4 in the product from a principled refusal into an apparent oversight.

### Why conditional proxies are the right move

The refusal is currently *mute* (and worse, mis-explained — F3). The honest, high-information rendering shows the fork instead of a blend, which:
- surfaces the D4 kill-switch as a visible, narrated event ("watch the model refuse") — a leadership beat, not a gap;
- converts the unknown into the *decision variable it actually is* (process choice is the largest single determinant of the site's water demand);
- sharpens the disclosure ask from "tell us your water use" to "tell us the process route" — a smaller, more answerable request.

### Exact spec, by case

**Case 1 — process unknown, Ni (prospect preset).** Panel A stays **T4** for the site. Render beneath it:

> **Water use: depends on a decision that is not yet public.**
> The tool will not print one "typical" figure here. The two candidate processes differ by roughly **17×** — wider than the 10× limit an estimate band may span (rule R-DEMAND-05), so a single number would inform nobody. What is known:
> - **If built as HPAL:** roughly **1,700 m³ per tonne of nickel** — T3 band · figure not yet verified against primary studies
> - **If built as RKEF:** roughly **100 m³ per tonne of nickel** — T3 band · figure not yet verified against primary studies
>
> These are figures for the *process type*, not this site. Which process is chosen is the single largest water decision for this project — and the EIA would settle it. → send the operator a disclosure request (template M4).

Rules: each branch carries its own T3 badge + UNVERIFIED flag; the site-level tier stays T4; **never** a merged number, never a midpoint, never an annual total (capacity unknown here too). In the decision flow, add one visible node to Branch 2: "Candidate band 100–1,700 m³/t spans ~17× → **wider than 10× → refused (D4)**" with the kill-switch drawn in the taken path. This is the single best "the model degrades correctly" demo available, and today it is invisible.

**Case 2 — process known, capacity unknown ("partial" preset).** The model knows real, citable structure and currently discards it. Render:

> **No annual figure can be computed: the plant's capacity is not public.**
> What is known: RKEF plants use roughly **100 m³ per tonne of nickel produced** (T3 band · not yet verified against primary studies) — about **17× less per tonne than HPAL**, the citable direction. The missing input is one number the operator publishes in any annual report → disclosure request (M4).

Optionally one *labeled* conditional: "at a typical RKEF scale of 30,000 t/yr this would be ~3 million m³/yr — an illustration of scale, not a figure for this site." If that sentence feels risky, drop it; the per-tonne intensity alone already carries the information. Site tier stays T4; the intensity line is T3.

**Case 3 — no coefficient set exists (Cu-Co).** Current behavior is already correct: T4, "no water-use coefficient set has been established for this commodity in v0.1 (a new commodity costs ~3–5 days of coefficient research — M2 §7)". Do not add commodity-typical figures here — there is no sourced band to condition on, and inventing one would be the trap version of the feature.

**Guard rails that must ship with the feature (all already in the ruleset — cite them in the popover):** T3 always-a-band (R-TIER-04) applies to each branch; the UNVERIFIED-primary flag (R-DEMAND-04) renders until the Northey/Khoo pull closes; the D4 threshold stays authoritative (if a future union spans <10×, a genuine union *band* may render instead of the fork); the site-level tier remains T4 in cases 1–2 so the gap line and disclosure route still fire.

**Net effect on credibility:** strengthens it, precisely because the feature is built *as* an application of the existing kill switch rather than an exception to it. The tool goes from "we don't know" (currently: with a false reason attached) to "here is exactly what we know, exactly why we refuse the single number you want, and exactly which one fact would resolve it." That is the glass box doing its job.

---

## What is genuinely defensible (one paragraph, for calibration, not praise)

The architecture holds where it is implemented faithfully: juxtaposition-not-division, the C0 ceiling, empty-state-as-product, permitted≠enforced, omit-don't-guess, and the tier ladder in Branch 2 are all correctly encoded and mostly well-worded. The failures above are almost all *implementation drift from the spec* (point-not-band, fake union, hardcoded checks, ignored status, fabricated Aq5 inputs, stale citations after edits) plus *presentation-layer choices the spec never reviewed* (verdict taxonomy, Uncertain-swallows-the-scale, spoiled choreography). That is good news: nothing here requires rethinking the methodology — it requires making the prototype obey it.
