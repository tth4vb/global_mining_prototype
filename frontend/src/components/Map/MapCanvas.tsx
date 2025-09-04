import React, { useEffect, useRef, useState, useMemo } from 'react';
import { MapContainer, TileLayer, useMap, ZoomControl, useMapEvents } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { MineGeoJsonFeature, MineGeoJson } from '../../types/mine';
import { useMineStore } from '../../store/mineStore';
import { getMineColor } from '../../utils/colorMappings';

// Canvas layer for rendering mines efficiently
function MineCanvasLayer({ mines }: { mines: MineGeoJsonFeature[] }) {
  const map = useMap();
  const canvasRef = useRef<L.Canvas | null>(null);
  const { colorScheme, selectedMine, setSelectedMine } = useMineStore();

  useMapEvents({
    click(e) {
      // Find clicked mine
      const clickPoint = e.latlng;
      const zoom = map.getZoom();
      const radius = zoom < 5 ? 3 : zoom < 8 ? 4 : 5;
      
      for (const mine of mines) {
        const mineLat = mine.geometry.coordinates[1];
        const mineLng = mine.geometry.coordinates[0];
        const minePoint = L.latLng(mineLat, mineLng);
        
        if (clickPoint.distanceTo(minePoint) < radius * 100) {
          setSelectedMine(mine);
          break;
        }
      }
    }
  });

  useEffect(() => {
    if (!map) return;

    // Create custom canvas layer
    const CanvasLayer = L.Layer.extend({
      onAdd: function(map: L.Map) {
        this._map = map;
        this._canvas = document.createElement('canvas');
        this._canvas.className = 'leaflet-canvas-layer';
        this._ctx = this._canvas.getContext('2d');
        
        map.getPanes().overlayPane.appendChild(this._canvas);
        
        map.on('moveend zoomend', this._reset, this);
        this._reset();
        
        return this;
      },

      onRemove: function(map: L.Map) {
        map.getPanes().overlayPane.removeChild(this._canvas);
        map.off('moveend zoomend', this._reset, this);
        return this;
      },

      _reset: function() {
        const bounds = this._map.getBounds();
        const topLeft = this._map.latLngToLayerPoint(bounds.getNorthWest());
        const size = this._map.latLngToLayerPoint(bounds.getSouthEast()).subtract(topLeft);
        
        this._canvas.width = size.x;
        this._canvas.height = size.y;
        this._canvas.style.transform = `translate(${topLeft.x}px, ${topLeft.y}px)`;
        this._canvas.style.position = 'absolute';
        this._canvas.style.zIndex = '200';
        
        this._redraw();
      },

      _redraw: function() {
        if (!this._ctx) return;
        
        const ctx = this._ctx;
        const map = this._map;
        const zoom = map.getZoom();
        const bounds = map.getBounds();
        
        ctx.clearRect(0, 0, this._canvas.width, this._canvas.height);
        
        // Adjust radius based on zoom
        const radius = zoom < 5 ? 2 : zoom < 8 ? 3 : zoom < 12 ? 4 : 5;
        
        // Draw mines
        mines.forEach(mine => {
          const lat = mine.geometry.coordinates[1];
          const lng = mine.geometry.coordinates[0];
          
          // Skip if outside bounds
          if (!bounds.contains([lat, lng])) return;
          
          const point = map.latLngToLayerPoint([lat, lng]);
          const canvasPoint = point.subtract(map.latLngToLayerPoint(bounds.getNorthWest()));
          
          // Get color based on scheme
          const color = getMineColor(mine.properties, colorScheme);
          
          // Draw circle
          ctx.beginPath();
          ctx.arc(canvasPoint.x, canvasPoint.y, radius, 0, 2 * Math.PI);
          ctx.fillStyle = color;
          ctx.globalAlpha = 0.8;
          ctx.fill();
          
          // Add border
          if (selectedMine && selectedMine.properties.name === mine.properties.name) {
            ctx.strokeStyle = '#FFD700';
            ctx.lineWidth = 2;
            ctx.stroke();
          } else {
            ctx.strokeStyle = '#ffffff';
            ctx.lineWidth = 0.5;
            ctx.stroke();
          }
        });
      }
    });

    const layer = new CanvasLayer();
    layer.addTo(map);
    canvasRef.current = layer;

    return () => {
      if (canvasRef.current) {
        map.removeLayer(canvasRef.current);
      }
    };
  }, [map, mines, colorScheme, selectedMine]);

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

interface MapCanvasProps {
  className?: string;
}

const MapCanvas: React.FC<MapCanvasProps> = ({ className = '' }) => {
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

  const mines = useMemo(() => {
    if (!minesData || !minesData.features) return [];
    return minesData.features;
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
        preferCanvas={true}
      >
        {/* CartoDB Dark (similar to Electricity Maps) */}
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>'
          url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
        />
        
        <ZoomControl position="topright" />
        <MapInfo minesCount={mines.length} />
        
        {/* Canvas layer for efficient mine rendering */}
        <MineCanvasLayer mines={mines} />
      </MapContainer>
      
      {/* Custom styles */}
      <style>{`
        .leaflet-canvas-layer {
          pointer-events: all !important;
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

export default MapCanvas;