import React, { useEffect, useState, useMemo } from 'react';
import { MapContainer, TileLayer, Marker, useMap, ZoomControl } from 'react-leaflet';
import MarkerClusterGroup from 'react-leaflet-cluster';
import { divIcon, point } from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { MineGeoJsonFeature, MineGeoJson } from '../../types/mine';
import { useMineStore } from '../../store/mineStore';
import { getMineColor } from '../../utils/colorMappings';

// Component to handle map events and display coordinates
function MapInfo({ minesCount }: { minesCount: number }) {
  const map = useMap();
  const [position, setPosition] = useState({ lat: 0, lng: 0, zoom: 2 });

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
      <div className="bg-black/90 text-white px-3 py-2 rounded-lg ml-2">
        <div className="text-xs font-mono">
          <div>Longitude: {position.lng} | Latitude: {position.lat}</div>
          <div>Zoom: {position.zoom}</div>
          <div className="text-green-400 mt-1">✓ {minesCount} mines loaded</div>
        </div>
      </div>
    </div>
  );
}

// Custom cluster icon - NEUTRAL COLOR (not based on commodities)
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

  // Use neutral cyan color for all clusters
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


// Create icon cache to prevent recreation
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

// Individual mine marker component - ultra simplified
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

interface MapLeafletClusteredProps {
  className?: string;
}

const MapLeafletClustered: React.FC<MapLeafletClusteredProps> = ({ className = '' }) => {
  const [minesData, setMinesData] = useState<MineGeoJson | null>(null);
  const [loading, setLoading] = useState(true);
  const [renderMines, setRenderMines] = useState(false);

  useEffect(() => {
    // Load the GeoJSON data
    fetch('/mines.geojson')
      .then(response => response.json())
      .then(data => {
        setMinesData(data);
        setLoading(false);
        console.log(`Loaded ${data.features.length} mines`);
        // Delay rendering mines to allow map to load first
        setTimeout(() => setRenderMines(true), 100);
      })
      .catch(error => {
        console.error('Error loading mines data:', error);
        setLoading(false);
      });
  }, []);

  const mines = useMemo(() => {
    if (!minesData || !minesData.features || !renderMines) return [];
    return minesData.features;
  }, [minesData, renderMines]);

  if (loading) {
    return (
      <div className="h-full w-full flex items-center justify-center bg-gray-900">
        <div className="text-white text-xl">Loading mine data...</div>
      </div>
    );
  }

  return (
    <div className={`fixed inset-0 ${className}`}>
      <MapContainer
        center={[20, 0]}
        zoom={2}
        className="h-full w-full"
        style={{ height: '100vh', width: '100vw' }}
        zoomControl={false}
        minZoom={2}
        maxZoom={18}
        maxBounds={[[-90, -180], [90, 180]]}
        maxBoundsViscosity={1.0}
        worldCopyJump={true}
      >
        {/* CartoDB Dark (similar to Electricity Maps) */}
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>'
          url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
        />
        
        <ZoomControl position="topright" />
        <MapInfo minesCount={mines.length} />
        
        {/* Marker Clustering with neutral colors */}
        {mines.length > 0 && (
          <MarkerClusterGroup
            chunkedLoading
            chunkInterval={500}
            chunkDelay={100}
            iconCreateFunction={createClusterCustomIcon}
            maxClusterRadius={80}
            spiderfyOnMaxZoom={false}
            showCoverageOnHover={false}
            zoomToBoundsOnClick={true}
            disableClusteringAtZoom={15}
            animate={false}
            removeOutsideVisibleBounds={true}
          >
            {mines.map((mine, index) => (
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
        /* Cluster animation */
        .marker-cluster-small,
        .marker-cluster-medium,
        .marker-cluster-large {
          background: transparent !important;
        }
        /* Ensure map stays below overlays */
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

export default MapLeafletClustered;