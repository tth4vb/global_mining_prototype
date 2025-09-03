import React, { useEffect, useState, useMemo } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap, ZoomControl } from 'react-leaflet';
import MarkerClusterGroup from 'react-leaflet-cluster';
import L, { divIcon, point } from 'leaflet';
import 'leaflet/dist/leaflet.css';
import 'leaflet.markercluster/dist/MarkerCluster.css';
import 'leaflet.markercluster/dist/MarkerCluster.Default.css';
import { MineGeoJsonFeature, MineGeoJson } from '../../types/mine';

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

// Custom cluster icon creator
const createClusterCustomIcon = function (cluster: any) {
  const count = cluster.getChildCount();
  let size = 'small';
  let className = 'bg-cyan-500/80';
  
  if (count > 100) {
    size = 'large';
    className = 'bg-cyan-600/90';
  } else if (count > 50) {
    size = 'medium';
    className = 'bg-cyan-500/85';
  }

  const sizeMap = {
    small: 40,
    medium: 50,
    large: 60,
  };

  return divIcon({
    html: `<div class="${className} text-white font-bold rounded-full flex items-center justify-center border-2 border-white/50" style="width: ${sizeMap[size as keyof typeof sizeMap]}px; height: ${sizeMap[size as keyof typeof sizeMap]}px;">
      <span class="text-sm">${count}</span>
    </div>`,
    className: 'custom-marker-cluster',
    iconSize: point(sizeMap[size as keyof typeof sizeMap], sizeMap[size as keyof typeof sizeMap], true),
  });
};

// Custom mine icon - created once and reused
const mineIcon = divIcon({
  html: `<div class="bg-cyan-400 rounded-full border-2 border-white/80" style="width: 12px; height: 12px;"></div>`,
  className: 'custom-mine-marker',
  iconSize: point(12, 12, true),
  iconAnchor: [6, 6],
});

// Individual mine marker component
const MineMarker = React.memo(({ position, properties }: { position: [number, number], properties: any }) => {
  return (
    <Marker position={position} icon={mineIcon}>
      <Popup>
        <div className="font-sans">
          <strong className="text-lg">{properties.name || 'Unknown Mine'}</strong>
          <div className="mt-2 space-y-1 text-sm">
            <div><span className="font-semibold">Country:</span> {properties.country || 'Unknown'}</div>
            <div><span className="font-semibold">Commodity:</span> {properties.primaryCommodity || 'Unknown'}</div>
            {properties.secondaryCommodity && (
              <div><span className="font-semibold">Secondary:</span> {properties.secondaryCommodity}</div>
            )}
            <div><span className="font-semibold">Type:</span> {properties.assetType || 'Mine'}</div>
            <div><span className="font-semibold">Confidence:</span> {properties.confidenceFactor || 'Unknown'}</div>
            {properties.groupNames && (
              <div className="text-xs mt-1"><span className="font-semibold">Group:</span> {properties.groupNames}</div>
            )}
          </div>
        </div>
      </Popup>
    </Marker>
  );
});

MineMarker.displayName = 'MineMarker';

interface MapLeafletClusteredProps {
  className?: string;
}

const MapLeafletClustered: React.FC<MapLeafletClusteredProps> = ({ className = '' }) => {
  const [minesData, setMinesData] = useState<MineGeoJson | null>(null);
  const [loading, setLoading] = useState(true);

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
    
    return features.map((feature: MineGeoJsonFeature, index: number) => ({
      id: `mine-${index}`,
      position: [feature.geometry.coordinates[1], feature.geometry.coordinates[0]] as [number, number],
      properties: feature.properties,
    }));
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
        
        {/* Clustered markers with optimizations */}
        {markers.length > 0 && (
          <MarkerClusterGroup
            chunkedLoading
            chunkInterval={200}
            chunkDelay={50}
            iconCreateFunction={createClusterCustomIcon}
            maxClusterRadius={60}
            spiderfyOnMaxZoom={true}
            showCoverageOnHover={false}
            zoomToBoundsOnClick={true}
            removeOutsideVisibleBounds={true}
            animate={true}
            animateAddingMarkers={false}
            disableClusteringAtZoom={10}
            singleMarkerMode={false}
          >
            {markers.map((marker) => (
              <MineMarker
                key={marker.id}
                position={marker.position}
                properties={marker.properties}
              />
            ))}
          </MarkerClusterGroup>
        )}
      </MapContainer>
      
      {/* Custom styles for clusters */}
      <style>{`
        .custom-marker-cluster {
          background: transparent !important;
        }
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
        .marker-cluster-small {
          background-color: rgba(6, 182, 212, 0.8);
        }
        .marker-cluster-medium {
          background-color: rgba(6, 182, 212, 0.85);
        }
        .marker-cluster-large {
          background-color: rgba(6, 182, 212, 0.9);
        }
        .leaflet-popup-content {
          min-width: 200px;
        }
      `}</style>
    </div>
  );
};

export default MapLeafletClustered;