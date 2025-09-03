import React, { useEffect, useState } from 'react';
import { MapContainer, TileLayer, CircleMarker, useMap, ZoomControl } from 'react-leaflet';
import L from 'leaflet';
import icon from 'leaflet/dist/images/marker-icon.png';
import iconShadow from 'leaflet/dist/images/marker-shadow.png';
import 'leaflet/dist/leaflet.css';
import { MineGeoJsonFeature } from '../../types/mine';

// Import the JSON data directly
const minesData = require('../../data/mines.geojson');

let DefaultIcon = L.icon({
  iconUrl: icon,
  shadowUrl: iconShadow,
  iconAnchor: [12, 41],
});

L.Marker.prototype.options.icon = DefaultIcon;

// Component to handle map events and display coordinates
function MapInfo() {
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
          <div className="text-green-400 mt-1">✓ {minesData?.features?.length || 0} mines loaded</div>
        </div>
      </div>
    </div>
  );
}

// Component to render all mines
function MinesLayer() {
  const map = useMap();
  const [zoom, setZoom] = useState(map.getZoom());

  useEffect(() => {
    const updateZoom = () => setZoom(map.getZoom());
    map.on('zoomend', updateZoom);
    return () => {
      map.off('zoomend', updateZoom);
    };
  }, [map]);

  // Calculate radius based on zoom level
  const getRadius = (zoom: number) => {
    if (zoom <= 2) return 2;
    if (zoom <= 5) return 3;
    if (zoom <= 8) return 5;
    return 8;
  };

  // Calculate opacity based on zoom level
  const getOpacity = (zoom: number) => {
    if (zoom <= 2) return 0.6;
    if (zoom <= 8) return 0.8;
    return 1;
  };

  const radius = getRadius(zoom);
  const opacity = getOpacity(zoom);

  if (!minesData || !minesData.features) {
    return null;
  }

  return (
    <>
      {minesData.features.map((feature: MineGeoJsonFeature, index: number) => {
        const [lng, lat] = feature.geometry.coordinates;
        const props = feature.properties;
        
        return (
          <CircleMarker
            key={index}
            center={[lat, lng]}
            radius={radius}
            pathOptions={{
              fillColor: '#00D9FF',
              color: zoom > 8 ? '#ffffff' : 'transparent',
              weight: zoom > 8 ? 1 : 0,
              opacity: opacity,
              fillOpacity: opacity * 0.8,
            }}
            eventHandlers={{
              mouseover: (e: any) => {
                const layer = e.target;
                layer.bindPopup(`
                  <div class="font-sans">
                    <strong>${props.name || 'Unknown Mine'}</strong><br/>
                    <span class="text-gray-600">Country:</span> ${props.country || 'Unknown'}<br/>
                    <span class="text-gray-600">Commodity:</span> ${props.primaryCommodity || 'Unknown'}<br/>
                    <span class="text-gray-600">Type:</span> ${props.assetType || 'Mine'}
                  </div>
                `).openPopup();
              },
            }}
          />
        );
      })}
    </>
  );
}

interface MapLeafletProps {
  className?: string;
}

const MapLeaflet: React.FC<MapLeafletProps> = ({ className = '' }) => {
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
      >
        {/* Free tile providers - no API key needed! */}
        
        {/* Option 1: CartoDB Dark (similar to Electricity Maps) */}
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>'
          url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
        />
        
        {/* Option 2: CartoDB Voyager (light theme) - uncomment to use */}
        {/* <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>'
          url="https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png"
        /> */}
        
        {/* Option 3: OpenStreetMap (standard) - uncomment to use */}
        {/* <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        /> */}
        
        {/* Option 4: Stadia Dark (requires free account but no payment) - uncomment to use */}
        {/* <TileLayer
          attribution='&copy; <a href="https://stadiamaps.com/">Stadia Maps</a>, &copy; <a href="https://openmaptiles.org/">OpenMapTiles</a> &copy; <a href="http://openstreetmap.org">OpenStreetMap</a> contributors'
          url="https://tiles.stadiamaps.com/tiles/alidade_smooth_dark/{z}/{x}/{y}{r}.png"
        /> */}

        <ZoomControl position="topright" />
        <MapInfo />
        <MinesLayer />
      </MapContainer>
    </div>
  );
};

export default MapLeaflet;