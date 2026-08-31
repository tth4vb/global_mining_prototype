# Water-Risk Glass Box

An interactive, transparent water-risk screening model for critical-minerals mine sites, built for WRI leadership review. It shows how the model screens the water risk of a mine from the data available today, watch the rules fire in real time, and see exactly where the read stops because the data stops.

It is a self-contained static web app. One file, no build step, no server dependencies, no external data calls (fonts load from Google Fonts).

## What is in it

- **The model** — pick an example site or edit any input, and watch the rules decide in real time. The read on the right is tiered by source and certainty (T1 measured to T4 unknown) and ends in the one gap that remains.
- **Decision flow** — the same rules drawn as branching charts (regime classifier, water-use tier ladder, watchlist router), with the path your inputs follow lit up.
- **Methodology and rules** — the full method: provenance tiers, the causal ladder, all eight rule groups, the data-coverage reality, the Aqueduct 5.0 forward look, and the banned constructions.
- An **Aqueduct 5.0** toggle: a hypothetical future data layer that shows how the same model sharpens as water data improves.

## Run it locally

It is a single static file. Any of these work:

```bash
# Python (no install)
python3 -m http.server 8000
# then open http://localhost:8000/

# or Node
npx serve .

# or just open index.html in a browser
```

## Deploy it

Static hosting, no build:

- **Vercel:** `vercel --prod` from this folder (or drag the folder into the Vercel dashboard).
- **Netlify:** drag the folder onto the Netlify drop zone.
- **GitHub Pages / S3 / any static host:** upload `index.html`.

## The model behind it

The logic encodes the read-spine ruleset (`../research/methodology/water-risk-ruleset-v0.1.md`): 69 source-cited rules in eight groups, plus eight forward-looking Aqueduct 5.0 rules. The ruleset is derived from the project methodology (X1 attribution stance, M1 quality screen, M2 quantity and stress, the strawman parameters, and the data coverage funnel).

## Honesty notes (for anyone presenting this)

- Basin values (baseline water stress, riverine flood risk, groundwater trend, seasonal variability) are read live from Aqueduct 4.0 for the site location (Esri Living Atlas mirror, HydroBASINS L6). They are read-only in the UI, not editable. The preset values shipped in the file act only as an offline fallback and match the live Aqueduct reads for the three named sites.
- Three rules rest on authored bridges, not settled doctrine: the gap-line priority order, the provisional-disruption label, and whether to show the HPAL water-use magnitude before it is primary-sourced. These are flagged in the ruleset for SME sign-off.
- The ARD contaminant rows for the copper-cobalt case are shown generically on purpose. The exact list is Phase-3 authoring work.

It is a screening model, not a verdict. It never claims that one mine caused a change.
