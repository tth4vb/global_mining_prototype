# Global Mining Visualization - Implementation Prompts

Copy and run these prompts sequentially in Claude Code to build your mining visualization.

---

## Phase 1: Data Processing & Project Setup

### Prompt 1.1 - Initial Setup
```
Create a React TypeScript project for a global mining visualization app similar to Electricity Maps. Set up the project with Mapbox GL JS, Tailwind CSS, and necessary dependencies. Create the basic folder structure with components for Map, Panel, Search, and Legend.
```

### Prompt 1.2 - Data Conversion
```
Parse the KML file (doc.kml) and Excel file (global-mining-dataset.xlsx sheet "External") and convert them into a unified GeoJSON format. Create a script that:
1. Extracts all 8,508 mine locations with their attributes
2. Combines data from both sources using ICMMID as the key
3. Outputs a clean mines.geojson file with all properties
4. Creates a TypeScript interface for the mine data structure
```

---

## Phase 2: Basic Map Implementation

### Prompt 2.1 - Map Component
```
Create a Mapbox GL JS map component that:
1. Displays a world map with a clean, minimal style
2. Loads the mines.geojson data as a source
3. Renders all 8,508 mine points as circles
4. Implements basic zoom and pan controls
5. Uses the Mapbox Dark or Light theme similar to Electricity Maps
```

### Prompt 2.2 - Clustering
```
Implement clustering for the mine markers to improve performance:
1. Add Mapbox clustering to group nearby mines at different zoom levels
2. Show cluster counts in circles that expand on zoom
3. Style clusters based on the number of points they contain
4. Ensure individual mines appear at zoom level 8+
```

---

## Phase 3: Interactivity & Filters

### Prompt 3.1 - Hover and Click Interactions
```
Add interactive features to the map:
1. Create hover tooltips showing mine name, primary commodity, and country
2. Implement click handler that opens a side panel with full mine details
3. Add smooth transitions and highlighting for selected mines
4. Create a close button and click-outside-to-close for the detail panel
```

### Prompt 3.2 - Color Coding System
```
Implement a color coding system similar to Electricity Maps:
1. Create a commodity color scheme (e.g., gold=yellow, copper=orange, coal=gray, iron=red)
2. Add a toggle to switch between coloring by: commodity, asset type, or confidence level
3. Create a dynamic legend component that updates based on the active color mode
4. Use gradients and opacity to show data confidence levels
```

### Prompt 3.3 - Search and Filter
```
Build a search and filter system:
1. Create a search bar that filters mines by name, country, or commodity
2. Add dropdown filters for: commodity type, asset type, confidence level, and country
3. Implement multi-select capability for filters
4. Update map in real-time as filters change
5. Show count of visible mines
```

---

## Phase 4: Data Visualization Layers

### Prompt 4.1 - Heat Map Mode
```
Create a heat map visualization mode:
1. Add a toggle to switch between point markers and heat map
2. Generate heat map based on mine density
3. Allow intensity adjustment with a slider
4. Make heat map responsive to active filters
```

### Prompt 4.2 - Statistics Dashboard
```
Build a statistics panel similar to Electricity Maps' data display:
1. Show total mine count and breakdown by commodity
2. Display top 10 countries by mine count
3. Create pie charts for commodity distribution
4. Add bar charts for mines by asset type
5. Make all statistics responsive to active filters
```

---

## Phase 5: Backend API (Optional but Recommended)

### Prompt 5.1 - Node.js API Setup
```
Create a Node.js Express API with TypeScript that:
1. Serves the GeoJSON data with pagination
2. Implements spatial queries for viewport-based loading
3. Provides endpoints for filtering and searching
4. Adds response caching with appropriate headers
```

### Prompt 5.2 - Database Integration
```
Set up PostgreSQL with PostGIS:
1. Create a schema for the mining data
2. Import all mine data with spatial indexing
3. Implement efficient spatial queries for clustering
4. Add endpoints for aggregate statistics
```

---

## Phase 6: Performance & Polish

### Prompt 6.1 - Performance Optimization
```
Optimize the application for performance:
1. Implement viewport-based data loading to only show visible mines
2. Add lazy loading for the detail panel content
3. Optimize bundle size with code splitting
4. Add loading states and skeleton screens
5. Implement service worker for offline caching
```

### Prompt 6.2 - Mobile Responsiveness
```
Make the application fully responsive:
1. Create mobile-friendly layouts for all components
2. Implement touch gestures for mobile map interaction
3. Create a bottom sheet pattern for mobile detail view
4. Optimize filter UI for mobile screens
5. Test and fix any mobile-specific issues
```

### Prompt 6.3 - Final Polish
```
Add final touches similar to Electricity Maps:
1. Implement smooth animations and transitions
2. Add keyboard navigation support
3. Include loading animations and error states
4. Create an about/info modal explaining the data
5. Add social sharing functionality for specific mine views
6. Implement dark/light theme toggle
```

---

## Bonus Features

### Prompt 7.1 - Advanced Visualizations
```
Add advanced visualization features:
1. Create a 3D mode showing mine depths or production volumes
2. Add time animation for historical data (if available)
3. Implement commodity flow lines between mines and processing facilities
4. Add satellite imagery toggle for map background
```

### Prompt 7.2 - Export Functionality
```
Add data export capabilities:
1. Allow users to export filtered data as CSV
2. Create KML export for use in Google Earth
3. Add screenshot/image export of current map view
4. Implement shareable URL states for specific views/filters
```

---

## Quick Start - Single Combined Prompt

### All-in-One MVP Prompt (if you want everything at once)
```
Create a React TypeScript application that visualizes 8,508 global mining locations from the provided KML and Excel data files. Build an interactive map similar to app.electricitymaps.com with:

1. Mapbox GL JS map with clustered mine markers
2. Color coding by commodity type (gold, copper, coal, etc.)
3. Hover tooltips and click-to-view details panel
4. Search bar and filters for commodity, country, and asset type
5. Responsive design with smooth animations
6. Legend showing active color scheme
7. Statistics panel with mine counts and distributions

Use the data from doc.kml and global-mining-dataset.xlsx (External sheet), combining them by ICMMID. Style it with a clean, minimal design using Tailwind CSS.
```

---

## Notes

- Run prompts sequentially for best results
- Each prompt builds on the previous one
- You can skip the backend section (Phase 5) if you want a frontend-only solution
- Adjust prompts based on your specific needs or preferences
- Add "Write tests for [component]" after any prompt to include testing