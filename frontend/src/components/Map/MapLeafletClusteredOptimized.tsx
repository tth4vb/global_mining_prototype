import React, { useEffect, useState, useMemo } from 'react';
import { MapContainer, TileLayer, Marker, useMap, ZoomControl, useMapEvents } from 'react-leaflet';
import MarkerClusterGroup from 'react-leaflet-cluster';
import { divIcon, point } from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { MineGeoJsonFeature, MineGeoJson } from '../../types/mine';
import { useMineStore } from '../../store/mineStore';
import { getMineColor } from '../../utils/colorMappings';
import LoadingSpinner from '../LoadingSpinner';

// Component to handle map info and zoom tracking
function MapController({ minesCount, onZoomChange }: { minesCount: number, onZoomChange: (zoom: number) => void }) {
  const map = useMap();
  const [position, setPosition] = useState({ lat: 0, lng: 0, zoom: 2 });

  useMapEvents({
    zoomend: () => {
      onZoomChange(map.getZoom());
    }
  });

  useEffect(() => {
    const updatePosition = () => {
      const center = map.getCenter();
      const zoom = map.getZoom();
      setPosition({
        lat: Math.round(center.lat * 10000) / 10000,
        lng: Math.round(center.lng * 10000) / 10000,
        zoom: Math.round(zoom * 100) / 100,
      });
    };

    updatePosition();
    map.on('move', updatePosition);
    map.on('zoom', updatePosition);

    return () => {
      map.off('move', updatePosition);
      map.off('zoom', updatePosition);
    };
  }, [map]);

  return (
    <div className="leaflet-top leaflet-left" style={{ marginTop: '80px' }}>
      <div className="bg-black/90 text-white px-3 py-2 rounded-lg ml-2 transition-all duration-300 hover:bg-black/95">
        <div className="text-xs font-mono">
          <div>Longitude: {position.lng} | Latitude: {position.lat}</div>
          <div>Zoom: {position.zoom}</div>
          <div className="text-green-400 mt-1 transition-colors">✓ {minesCount} mines loaded</div>
        </div>
      </div>
    </div>
  );
}

// Custom cluster icon - NEUTRAL COLOR
const createClusterCustomIcon = (cluster: any) => {
  const count = cluster.getChildCount();
  let size = 30;
  let className = 'text-xs';
  
  if (count > 100) {
    size = 40;
    className = 'text-sm font-bold';
  } else if (count > 500) {
    size = 50;
    className = 'text-base font-bold';
  }

  const color = '#06B6D4'; // Cyan-500
  
  return divIcon({
    html: `<div style="
      width: ${size}px; 
      height: ${size}px;
      background: ${color};
      border: 2px solid rgba(255, 255, 255, 0.8);
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
      color: white;
      font-weight: 600;
      box-shadow: 0 2px 6px rgba(0,0,0,0.3);
    ">
      <span class="${className}">${count}</span>
    </div>`,
    className: 'custom-cluster-marker',
    iconSize: point(size, size, true),
  });
};

// Icon cache
const iconCache = new Map<string, any>();

const getCachedIcon = (color: string, size: number) => {
  const key = `${color}-${size}`;
  if (!iconCache.has(key)) {
    iconCache.set(key, divIcon({
      html: `<div style="
        width: ${size}px; 
        height: ${size}px;
        background-color: ${color};
        border: 2px solid #ffffff;
        border-radius: 50%;
        opacity: 0.85;
        box-shadow: 0 2px 4px rgba(0,0,0,0.3);
      "></div>`,
      className: 'custom-mine-marker',
      iconSize: point(size, size, true),
      iconAnchor: [size/2, size/2],
    }));
  }
  return iconCache.get(key);
};

// Simple mine marker
const MineMarker = React.memo(({ mine }: { mine: MineGeoJsonFeature }) => {
  const colorScheme = useMineStore((state) => state.colorScheme);
  const setSelectedMine = useMineStore((state) => state.setSelectedMine);
  
  const color = getMineColor(mine.properties, colorScheme);
  const icon = getCachedIcon(color, 16);
  
  const position: [number, number] = [
    mine.geometry.coordinates[1], 
    mine.geometry.coordinates[0]
  ];
  
  return (
    <Marker 
      position={position} 
      icon={icon}
      eventHandlers={{
        click: () => setSelectedMine(mine)
      }}
    />
  );
});

MineMarker.displayName = 'MineMarker';

interface MapLeafletClusteredOptimizedProps {
  className?: string;
}

const MapLeafletClusteredOptimized: React.FC<MapLeafletClusteredOptimizedProps> = ({ className = '' }) => {
  const [minesData, setMinesData] = useState<MineGeoJson | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentZoom, setCurrentZoom] = useState(3);
  const [isMapReady, setIsMapReady] = useState(false);
  const { filters } = useMineStore();

  useEffect(() => {
    // Load the GeoJSON data
    fetch('/mines.geojson')
      .then(response => {
        if (!response.ok) {
          throw new Error(`Failed to load mines data: ${response.statusText}`);
        }
        return response.json();
      })
      .then(data => {
        if (!data.features || !Array.isArray(data.features)) {
          throw new Error('Invalid mines data format');
        }
        setMinesData(data);
        setLoading(false);
        console.log(`Loaded ${data.features.length} mines`);
        // Delay map readiness to prevent initial render issues
        setTimeout(() => setIsMapReady(true), 500);
      })
      .catch(error => {
        console.error('Error loading mines data:', error);
        setError(error.message || 'Failed to load mines data');
        setLoading(false);
      });
  }, []);

  // Apply filters and progressive loading based on zoom level
  const visibleMines = useMemo(() => {
    if (!minesData || !minesData.features || !isMapReady) return [];
    
    let filteredMines = minesData.features;
    
    // Apply search filter
    if (filters.searchQuery) {
      const query = filters.searchQuery.toLowerCase();
      filteredMines = filteredMines.filter(mine => {
        const name = mine.properties.name?.toLowerCase() || '';
        const country = mine.properties.country?.toLowerCase() || '';
        const commodity = mine.properties.primaryCommodity?.toLowerCase() || '';
        return name.includes(query) || country.includes(query) || commodity.includes(query);
      });
    }
    
    // Apply commodity filter
    if (filters.selectedCommodities.length > 0) {
      filteredMines = filteredMines.filter(mine => {
        const primary = mine.properties.primaryCommodity;
        const secondary = mine.properties.secondaryCommodity;
        return (primary && filters.selectedCommodities.includes(primary)) || 
               (secondary && filters.selectedCommodities.includes(secondary));
      });
    }
    
    // Apply country filter
    if (filters.selectedCountries.length > 0) {
      filteredMines = filteredMines.filter(mine => 
        mine.properties.country && filters.selectedCountries.includes(mine.properties.country)
      );
    }
    
    // Apply asset type filter
    if (filters.selectedAssetTypes.length > 0) {
      filteredMines = filteredMines.filter(mine => 
        mine.properties.assetType && filters.selectedAssetTypes.includes(mine.properties.assetType)
      );
    }
    
    // Limit number of mines based on zoom level
    if (currentZoom < 4) {
      // Show only 1000 mines at low zoom
      return filteredMines.slice(0, 1000);
    } else if (currentZoom < 6) {
      // Show 2500 mines at medium zoom
      return filteredMines.slice(0, 2500);
    } else if (currentZoom < 8) {
      // Show 5000 mines at higher zoom
      return filteredMines.slice(0, 5000);
    }
    // Show all filtered mines at high zoom
    return filteredMines;
  }, [minesData, currentZoom, isMapReady, filters]);

  if (loading) {
    return (
      <div className="h-full w-full flex items-center justify-center bg-gray-900">
        <LoadingSpinner message="Loading mine data..." size="large" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="h-full w-full flex items-center justify-center bg-gray-900">
        <div className="bg-gray-800 rounded-lg p-6 max-w-md">
          <div className="flex items-center mb-4">
            <div className="w-12 h-12 bg-red-500/20 rounded-full flex items-center justify-center mr-3">
              <svg className="w-6 h-6 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} 
                      d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <div>
              <h3 className="text-lg font-semibold text-white">Failed to Load Map Data</h3>
              <p className="text-gray-400 text-sm">{error}</p>
            </div>
          </div>
          <button
            onClick={() => window.location.reload()}
            className="w-full px-4 py-2 bg-cyan-600 text-white rounded hover:bg-cyan-500 transition-colors"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className={`fixed inset-0 w-screen h-screen ${className}`} style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0 }}>
      <MapContainer
        center={[0, 0]}
        zoom={3}
        className="absolute inset-0"
        style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, width: '100%', height: '100%', backgroundColor: '#181818' }}
        zoomControl={false}
        minZoom={2.8}
        maxZoom={18}
        worldCopyJump={false}
        preferCanvas={true}
        attributionControl={false}
        maxBounds={[[-85, -Infinity], [85, Infinity]]}
        maxBoundsViscosity={1.0}
      >
        {/* CartoDB Dark tile layer */}
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>'
          url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
          noWrap={false}
          bounds={[[-90, -180], [90, 180]]}
        />
        
        <ZoomControl position="topright" />
        <MapController 
          minesCount={visibleMines.length} 
          onZoomChange={setCurrentZoom}
        />
        
        {/* Show filter/zoom status message */}
        {visibleMines.length > 0 && (
          <div className="leaflet-top leaflet-center" style={{ left: '50%', transform: 'translateX(-50%)', marginTop: '80px' }}>
            {(filters.searchQuery || filters.selectedCommodities.length > 0 || 
              filters.selectedCountries.length > 0 || filters.selectedAssetTypes.length > 0) ? (
              <div className="bg-cyan-600/90 text-white px-4 py-2 rounded-lg mt-2 text-sm">
                Showing {visibleMines.length} of {minesData?.features.length} mines (filtered)
              </div>
            ) : visibleMines.length < (minesData?.features.length || 0) ? (
              <div className="bg-yellow-600/90 text-white px-4 py-2 rounded-lg mt-2 text-sm">
                Showing {visibleMines.length} of {minesData?.features.length} mines (zoom in for more)
              </div>
            ) : null}
          </div>
        )}
        
        {/* Marker Clustering */}
        {isMapReady && visibleMines.length > 0 && (
          <MarkerClusterGroup
            chunkedLoading
            chunkInterval={200}
            chunkDelay={50}
            iconCreateFunction={createClusterCustomIcon}
            maxClusterRadius={80}
            spiderfyOnMaxZoom={false}
            showCoverageOnHover={false}
            zoomToBoundsOnClick={true}
            disableClusteringAtZoom={16}
            animate={false}
            removeOutsideVisibleBounds={true}
          >
            {visibleMines.map((mine, index) => (
              <MineMarker key={`${mine.properties.name}-${index}`} mine={mine} />
            ))}
          </MarkerClusterGroup>
        )}
      </MapContainer>
      
      {/* Custom styles */}
      <style>{`
        .custom-cluster-marker,
        .custom-mine-marker {
          background: transparent !important;
          border: none !important;
        }
        .leaflet-marker-icon {
          transition: all 0.3s ease;
        }
        .leaflet-marker-icon:hover {
          transform: scale(1.2);
          z-index: 10000 !important;
        }
        .marker-cluster-small,
        .marker-cluster-medium,
        .marker-cluster-large {
          background: transparent !important;
        }
        .leaflet-pane {
          z-index: auto !important;
        }
        .leaflet-top, .leaflet-bottom {
          z-index: 999 !important;
        }
      `}</style>
    </div>
  );
};

export default MapLeafletClusteredOptimized;