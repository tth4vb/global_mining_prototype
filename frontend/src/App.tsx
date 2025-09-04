import React, { useState, useEffect } from 'react';
import Map from './components/Map';
import MineDetailPanel from './components/MineDetailPanel';
import MapLegend from './components/MapLegend';
import SearchBar from './components/SearchBar';
import FilterPanel from './components/FilterPanel';
import StatsDashboard from './components/StatsDashboard';
import { MineGeoJson } from './types/mine';
import { useKeyboardShortcuts } from './hooks/useKeyboardShortcuts';

function App() {
  const [minesData, setMinesData] = useState<MineGeoJson | null>(null);
  useKeyboardShortcuts();

  useEffect(() => {
    // Load the GeoJSON data
    fetch('/mines.geojson')
      .then(response => response.json())
      .then(data => {
        setMinesData(data);
        console.log(`Loaded ${data.features.length} mines for App`);
      })
      .catch(error => {
        console.error('Error loading mines data:', error);
      });
  }, []);

  return (
    <>
      {/* Map takes up full viewport */}
      <Map />
      
      {/* Header - solid overlay */}
      <header className="fixed top-0 left-0 right-0 z-[1000] bg-black/90 border-b border-gray-800">
        <div className="px-3 sm:px-6 py-3 sm:py-4">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
            <div className="flex flex-col sm:flex-row sm:items-center sm:space-x-4">
              <h1 className="text-lg sm:text-2xl font-bold text-white">
                Global Mining Visualization
              </h1>
              <span className="text-xs sm:text-sm text-gray-400">
                8,508 mines across 129 countries
              </span>
            </div>
            <div className="hidden sm:flex items-center space-x-4">
              <span className="text-xs text-gray-500">
                Data: ICMM Global Mining Dataset - September 2025
              </span>
            </div>
          </div>
        </div>
      </header>
      
      {/* Search and Filter Controls */}
      <SearchBar />
      
      {/* Filter Panel */}
      <FilterPanel minesData={minesData} />
      
      {/* Statistics Dashboard */}
      <StatsDashboard minesData={minesData} />
      
      {/* Map Legend */}
      <MapLegend />
      
      {/* Mine Detail Panel - overlays the map */}
      <MineDetailPanel />
    </>
  );
}

export default App;