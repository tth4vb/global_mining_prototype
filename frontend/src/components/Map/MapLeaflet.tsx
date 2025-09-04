import React, { useEffect, useState, useMemo, useCallback } from 'react';
import { MapContainer, TileLayer, Marker, useMap, ZoomControl } from 'react-leaflet';
import { divIcon, point } from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { MineGeoJsonFeature, MineGeoJson } from '../../types/mine';
import { useMineStore } from '../../store/mineStore';
import { getMineColor } from '../../utils/colorMappings';

// Component to track zoom level changes
function ZoomTracker({ setZoom }: { setZoom: (zoom: number) => void }) {
  const map = useMap();
  
  useEffect(() => {
    const handleZoom = () => {
      setZoom(map.getZoom());
    };
    
    handleZoom(); // Set initial zoom
    map.on('zoomend', handleZoom);
    
    return () => {
      map.off('zoomend', handleZoom);
    };
  }, [map, setZoom]);
  
  return null;
}

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
    <div className="leaflet-top leaflet-left">
      <div className="bg-black/80 text-white px-3 py-2 rounded-lg backdrop-blur-sm ml-2 mt-2">
        <div className="text-xs font-mono">
          <div>Longitude: {position.lng} | Latitude: {position.lat}</div>
          <div>Zoom: {position.zoom}</div>
          <div className="text-green-400 mt-1">✓ {minesCount} mines loaded</div>
        </div>
      </div>
    </div>
  );
}


// Custom mine icons with dynamic colors - smaller for better performance
const createMineIcon = (color: string, isSelected: boolean = false, isHovered: boolean = false) => {
  const size = isSelected ? 12 : isHovered ? 8 : 6;
  const borderWidth = isSelected ? 2 : 1;
  const borderColor = isSelected ? '#FFD700' : '#ffffff';
  const opacity = isSelected ? 1 : isHovered ? 0.95 : 0.85;
  
  return divIcon({
    html: `<div style="
      width: ${size}px; 
      height: ${size}px;
      background-color: ${color};
      border: ${borderWidth}px solid ${borderColor};
      border-radius: 50%;
      opacity: ${opacity};
      box-shadow: 0 2px 4px rgba(0,0,0,0.3);
      transition: all 0.2s ease;
    "></div>`,
    className: 'custom-mine-marker',
    iconSize: point(size, size, true),
    iconAnchor: [size/2, size/2],
  });
};

// Individual mine marker component - optimized to prevent re-renders
const MineMarker = React.memo(({ mineId, mine, position, properties }: { mineId: string, mine: MineGeoJsonFeature, position: [number, number], properties: any }) => {
  const setSelectedMine = useMineStore((state) => state.setSelectedMine);
  const colorScheme = useMineStore((state) => state.colorScheme);
  const selectedMineId = useMineStore((state) => state.selectedMine ? 
    `${state.selectedMine.properties.name}-${state.selectedMine.geometry.coordinates.join(',')}` : null);
  
  const isSelected = selectedMineId === mineId;
  const [isHovered, setIsHovered] = useState(false);
  
  const icon = useMemo(() => {
    const color = getMineColor(properties, colorScheme);
    return createMineIcon(color, isSelected, isHovered);
  }, [properties, colorScheme, isSelected, isHovered]);
  
  const handleClick = useCallback(() => {
    setSelectedMine(mine);
  }, [mine, setSelectedMine]);
  
  return (
    <Marker 
      position={position} 
      icon={icon}
      eventHandlers={{
        click: handleClick,
        mouseover: () => setIsHovered(true),
        mouseout: () => setIsHovered(false),
      }}
    />
  );
}, (prevProps, nextProps) => {
  // Custom comparison function to prevent unnecessary re-renders
  return prevProps.mineId === nextProps.mineId &&
         prevProps.position[0] === nextProps.position[0] &&
         prevProps.position[1] === nextProps.position[1];
});

MineMarker.displayName = 'MineMarker';

interface MapLeafletProps {
  className?: string;
}

const MapLeaflet: React.FC<MapLeafletProps> = ({ className = '' }) => {
  const [minesData, setMinesData] = useState<MineGeoJson | null>(null);
  const [loading, setLoading] = useState(true);
  const [currentZoom, setCurrentZoom] = useState(2);

  useEffect(() => {
    // Load the GeoJSON data
    fetch('/mines.geojson')
      .then(response => response.json())
      .then(data => {
        setMinesData(data);
        setLoading(false);
        console.log(`Loaded ${data.features.length} mines`);
      })
      .catch(error => {
        console.error('Error loading mines data:', error);
        setLoading(false);
      });
  }, []);

  // Prepare markers data - memoized to prevent recreation
  const markers = useMemo(() => {
    if (!minesData || !minesData.features) return [];
    
    // Limit markers for initial testing to prevent stack overflow
    const features = minesData.features;
    
    return features.map((feature: MineGeoJsonFeature, index: number) => {
      const uniqueId = `${feature.properties.name}-${feature.geometry.coordinates.join(',')}`;
      return {
        id: uniqueId,
        feature: feature,
        position: [feature.geometry.coordinates[1], feature.geometry.coordinates[0]] as [number, number],
        properties: feature.properties,
      };
    });
  }, [minesData]);

  if (loading) {
    return (
      <div className="h-full w-full flex items-center justify-center bg-gray-900">
        <div className="text-white text-xl">Loading mine data...</div>
      </div>
    );
  }

  return (
    <div className={`relative h-full ${className}`}>
      <MapContainer
        center={[20, 0]}
        zoom={2}
        className="h-full w-full"
        zoomControl={false}
        minZoom={2}
        maxZoom={18}
        worldCopyJump={true}
        preferCanvas={true} // Use canvas renderer for better performance
      >
        {/* CartoDB Dark (similar to Electricity Maps) */}
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>'
          url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
        />
        
        <ZoomControl position="topright" />
        <MapInfo minesCount={markers.length} />
        <ZoomTracker setZoom={setCurrentZoom} />
        
        {/* Show message at low zoom */}
        {currentZoom < 4 && (
          <div className="leaflet-top leaflet-center" style={{ left: '50%', transform: 'translateX(-50%)' }}>
            <div className="bg-yellow-600/90 text-white px-4 py-2 rounded-lg mt-2 text-sm">
              Zoom in to see all {markers.length} mines (currently showing 500)
            </div>
          </div>
        )}
        
        {/* Individual markers without clustering - limit rendering at low zoom */}
        {markers.length > 0 && (
          currentZoom >= 4 ? (
            // Show all markers at zoom 4+
            markers.map((marker) => (
              <MineMarker
                key={marker.id}
                mineId={marker.id}
                mine={marker.feature}
                position={marker.position}
                properties={marker.properties}
              />
            ))
          ) : (
            // Show limited markers at low zoom for performance
            markers.slice(0, 500).map((marker) => (
              <MineMarker
                key={marker.id}
                mineId={marker.id}
                mine={marker.feature}
                position={marker.position}
                properties={marker.properties}
              />
            ))
          )
        )}
      </MapContainer>
      
      {/* Custom styles for markers */}
      <style>{`
        .custom-mine-marker {
          background: transparent !important;
          border: none !important;
        }
        .leaflet-marker-icon {
          transition: all 0.3s ease;
        }
        .leaflet-marker-icon:hover {
          transform: scale(1.2);
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

export default MapLeaflet;