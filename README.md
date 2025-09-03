# Global Mining Visualization

An interactive map visualization of 8,508 global mining locations, inspired by Electricity Maps.

## Features

- 🗺️ Interactive world map with 8,508 mining locations
- 🌍 Globe projection for better world view
- 🎨 Clean, minimal dark theme similar to Electricity Maps
- 📍 Zoom-based circle sizing and opacity
- 📊 Data from ICMM Global Mining Dataset (September 2025)

## Quick Start

### Prerequisites

1. Node.js 16+ installed
2. A Mapbox account and API token (free at [mapbox.com](https://account.mapbox.com/))

### Setup

1. Clone the repository:
```bash
git clone https://github.com/tth4vb/global_mining_prototype.git
cd global_mining_prototype
```

2. Install dependencies:
```bash
cd frontend
npm install
```

3. Add your Mapbox token:
   - Copy `.env.example` to `.env.local`
   - Add your Mapbox token to `.env.local`:
   ```
   REACT_APP_MAPBOX_TOKEN=your_actual_mapbox_token_here
   ```

4. Start the development server:
```bash
npm start
```

5. Open [http://localhost:3000](http://localhost:3000) in your browser

## Project Structure

```
global_mining_prototype/
├── frontend/               # React TypeScript application
│   ├── src/
│   │   ├── components/    # React components
│   │   │   └── Map/      # Mapbox GL map component
│   │   ├── data/         # GeoJSON data file
│   │   └── types/        # TypeScript interfaces
│   └── public/
├── scripts/               # Data processing scripts
│   └── parse-data.py     # Converts KML/Excel to GeoJSON
└── data files/           # Original data files
    ├── doc.kml
    └── global-mining-dataset.xlsx
```

## Data

The visualization displays mining data including:
- **Location**: 129 countries worldwide
- **Commodities**: Coal, copper, gold, iron ore, and 46 others
- **Asset Types**: Mines, smelters, refineries, plants
- **Confidence Levels**: High, moderate, very low

Top countries by mine count:
1. China (1,839)
2. United States (1,627)
3. Australia (588)

## Next Steps

This is Phase 2.1 of the implementation. Next phases include:
- **Phase 2.2**: Clustering for performance
- **Phase 3**: Interactivity, filters, and color coding
- **Phase 4**: Heat maps and statistics dashboard

## Technologies Used

- React 18 with TypeScript
- Mapbox GL JS
- Tailwind CSS
- Python for data processing

## License

Data source: ICMM Global Mining Dataset - September 2025