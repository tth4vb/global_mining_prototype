# Global Mining Visualization Plan
## Interactive Map Similar to Electricity Maps

### Dataset Overview
- **8,508 mining locations** across 129 countries
- Key attributes per location:
  - Geographic coordinates (lat/lon)
  - Mine name and group affiliations
  - Asset type (Mine, Smelter, Refinery, Plant, etc.)
  - Primary, secondary, and other commodities
  - Confidence factor (High, Moderate, Very Low)
  - Unique ICMM ID

### Core Features (MVP)

#### 1. Interactive World Map
- **Base Map**: Use Mapbox GL JS or Leaflet with vector tiles
- **Clustering**: Group nearby mines at zoom levels for performance
- **Color Coding**: 
  - By commodity type (similar to Electricity Maps' carbon intensity)
  - By asset type 
  - By confidence factor
- **Zoom Levels**:
  - World view: Country-level aggregations
  - Regional view: Clustered mine markers
  - Local view: Individual mine markers

#### 2. Real-time Interactions
- **Hover Effects**: Quick info tooltip showing mine name, commodity, country
- **Click Actions**: Detailed panel with all mine attributes
- **Search/Filter Bar**: Find mines by name, country, or commodity
- **Legend**: Dynamic legend showing active color scheme

#### 3. Data Visualization Layers
- **Heat Map Mode**: Density of mining operations
- **Commodity View**: Filter by specific commodities (gold, copper, coal, etc.)
- **Asset Type View**: Show only specific asset types
- **Confidence Filter**: Show/hide based on data confidence

### Technical Architecture

#### Frontend Stack
```
- React 18+ with TypeScript
- Mapbox GL JS or Deck.gl for mapping
- Tailwind CSS for styling
- Framer Motion for animations
- React Query for data fetching
- Zustand for state management
```

#### Backend Stack
```
- Node.js with Express or Fastify
- PostgreSQL with PostGIS extension
- Redis for caching
- WebSocket for real-time updates (future)
```

#### Data Pipeline
```
1. Parse KML/Excel data → JSON format
2. Load into PostgreSQL with PostGIS
3. Create spatial indexes for fast queries
4. Generate pre-computed clusters for zoom levels
5. Cache frequently accessed data in Redis
```

### Implementation Phases

#### Phase 1: Foundation (Week 1-2)
- [ ] Set up React + TypeScript project
- [ ] Integrate Mapbox/Deck.gl
- [ ] Parse and convert data to GeoJSON
- [ ] Basic map with all mine points
- [ ] Simple hover tooltips

#### Phase 2: Interactivity (Week 3-4)
- [ ] Implement clustering algorithm
- [ ] Add click-to-select functionality
- [ ] Create detail panel component
- [ ] Add search/filter capabilities
- [ ] Implement zoom-based visibility

#### Phase 3: Visualization Modes (Week 5-6)
- [ ] Color coding by commodity
- [ ] Heat map visualization
- [ ] Asset type filtering
- [ ] Confidence level toggles
- [ ] Statistics dashboard

#### Phase 4: Performance & Polish (Week 7-8)
- [ ] Backend API development
- [ ] Database optimization
- [ ] Caching layer
- [ ] Loading states & animations
- [ ] Mobile responsiveness
- [ ] Performance optimization

### Advanced Features (Future)
- **Time Series**: Historical mine openings/closures
- **Supply Chain**: Connect mines to processing facilities
- **Environmental Data**: Overlay with environmental impact zones
- **Economic Indicators**: Production volumes, commodity prices
- **3D Terrain**: Elevation data for mine locations
- **Export Tools**: Download filtered data as CSV/KML

### Performance Considerations
- Use vector tiles for base map (lighter than raster)
- Implement viewport-based data loading
- Pre-compute clusters server-side
- Use WebGL rendering for large datasets
- Implement progressive loading
- Cache static assets with service workers

### Design Inspiration from Electricity Maps
- Clean, minimalist interface
- Smooth transitions between views
- Clear data hierarchy
- Intuitive color gradients
- Responsive layout
- Accessible design patterns

### Project Structure
```
global-mining-viz/
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   │   ├── Map/
│   │   │   ├── Panel/
│   │   │   ├── Search/
│   │   │   └── Legend/
│   │   ├── hooks/
│   │   ├── utils/
│   │   ├── store/
│   │   └── types/
│   └── public/
├── backend/
│   ├── src/
│   │   ├── routes/
│   │   ├── services/
│   │   ├── models/
│   │   └── utils/
│   └── data/
└── scripts/
    ├── data-parser/
    └── db-seed/
```

### Initial Setup Commands
```bash
# Frontend setup
npx create-react-app frontend --template typescript
cd frontend
npm install mapbox-gl @types/mapbox-gl
npm install tailwindcss framer-motion
npm install @tanstack/react-query zustand

# Backend setup
mkdir backend && cd backend
npm init -y
npm install express cors dotenv
npm install pg redis
npm install @types/node typescript ts-node

# Data processing
npm install @mapbox/geojson-extent
npm install @turf/turf
```

### Next Steps
1. Create project repository
2. Set up development environment
3. Parse data into usable format
4. Build MVP with basic map functionality
5. Iterate based on user feedback