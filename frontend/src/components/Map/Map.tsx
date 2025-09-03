import React, { useRef, useEffect, useState } from 'react';
import mapboxgl from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';
import minesData from '../../data/mines.geojson';

// Set Mapbox token from environment variable
const MAPBOX_TOKEN = process.env.REACT_APP_MAPBOX_TOKEN || '';

if (MAPBOX_TOKEN) {
  mapboxgl.accessToken = MAPBOX_TOKEN;
}

interface MapProps {
  className?: string;
}

const Map: React.FC<MapProps> = ({ className = '' }) => {
  const mapContainer = useRef<HTMLDivElement>(null);
  const map = useRef<mapboxgl.Map | null>(null);
  const [lng, setLng] = useState(0);
  const [lat, setLat] = useState(20);
  const [zoom, setZoom] = useState(2);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    if (!mapContainer.current || !MAPBOX_TOKEN) return;

    // Initialize map
    map.current = new mapboxgl.Map({
      container: mapContainer.current,
      style: 'mapbox://styles/mapbox/dark-v11', // Clean dark style like Electricity Maps
      center: [lng, lat],
      zoom: zoom,
      projection: 'globe' as any, // Globe projection for better world view
    });

    // Add navigation controls
    map.current.addControl(new mapboxgl.NavigationControl(), 'top-right');

    // Add scale control
    map.current.addControl(new mapboxgl.ScaleControl(), 'bottom-left');

    // Update state on map move
    map.current.on('move', () => {
      if (!map.current) return;
      setLng(Number(map.current.getCenter().lng.toFixed(4)));
      setLat(Number(map.current.getCenter().lat.toFixed(4)));
      setZoom(Number(map.current.getZoom().toFixed(2)));
    });

    // Load mines data when map is ready
    map.current.on('load', () => {
      if (!map.current) return;

      // Add fog effect for atmosphere
      map.current.setFog({
        color: 'rgb(10, 10, 10)',
        'high-color': 'rgb(20, 20, 20)',
        'horizon-blend': 0.02,
        'space-color': 'rgb(5, 5, 15)',
        'star-intensity': 0.6
      } as any);

      // Add mines data source
      map.current.addSource('mines', {
        type: 'geojson',
        data: minesData as any,
      });

      // Add mines layer with circle visualization
      map.current.addLayer({
        id: 'mines-layer',
        type: 'circle',
        source: 'mines',
        paint: {
          // Circle size based on zoom level
          'circle-radius': [
            'interpolate',
            ['linear'],
            ['zoom'],
            2, 2,  // At zoom 2, circles are 2px
            5, 3,  // At zoom 5, circles are 3px
            8, 5,  // At zoom 8, circles are 5px
            12, 8  // At zoom 12, circles are 8px
          ],
          // Circle color by commodity type (initial simple coloring)
          'circle-color': '#00D9FF', // Cyan blue similar to Electricity Maps
          'circle-stroke-color': '#ffffff',
          'circle-stroke-width': [
            'interpolate',
            ['linear'],
            ['zoom'],
            2, 0,     // No stroke at low zoom
            8, 0.5,   // Thin stroke at medium zoom
            12, 1     // Full stroke at high zoom
          ],
          'circle-opacity': [
            'interpolate',
            ['linear'],
            ['zoom'],
            2, 0.6,   // More transparent at low zoom
            8, 0.8,   // More opaque at high zoom
            12, 1     // Fully opaque at very high zoom
          ],
        },
      });

      setIsLoaded(true);
    });

    // Clean up on unmount
    return () => {
      if (map.current) {
        map.current.remove();
      }
    };
  }, []); // Run only once on mount

  if (!MAPBOX_TOKEN) {
    return (
      <div className={`flex items-center justify-center h-full bg-gray-900 text-white ${className}`}>
        <div className="text-center p-8">
          <h2 className="text-2xl font-bold mb-4">Mapbox Token Required</h2>
          <p className="mb-2">Please add your Mapbox access token to the .env.local file:</p>
          <code className="bg-gray-800 p-2 rounded">REACT_APP_MAPBOX_TOKEN=your_token_here</code>
          <p className="mt-4 text-sm text-gray-400">
            Get a free token at{' '}
            <a 
              href="https://account.mapbox.com/" 
              target="_blank" 
              rel="noopener noreferrer"
              className="text-blue-400 underline"
            >
              account.mapbox.com
            </a>
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className={`relative h-full ${className}`}>
      <div ref={mapContainer} className="h-full w-full" />
      
      {/* Coordinates display */}
      <div className="absolute top-4 left-4 bg-black/80 text-white px-3 py-2 rounded-lg backdrop-blur-sm">
        <div className="text-xs font-mono">
          <div>Longitude: {lng} | Latitude: {lat}</div>
          <div>Zoom: {zoom}</div>
          {isLoaded && <div className="text-green-400 mt-1">✓ {minesData.features.length} mines loaded</div>}
        </div>
      </div>
    </div>
  );
};

export default Map;