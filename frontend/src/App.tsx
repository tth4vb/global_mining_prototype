import React from 'react';
import Map from './components/Map';

function App() {
  return (
    <div className="h-screen w-screen overflow-hidden bg-gray-900">
      {/* Header */}
      <header className="absolute top-0 left-0 right-0 z-10 bg-black/50 backdrop-blur-md border-b border-gray-800">
        <div className="px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <h1 className="text-2xl font-bold text-white">
                Global Mining Visualization
              </h1>
              <span className="text-sm text-gray-400">
                8,508 mines across 129 countries
              </span>
            </div>
            <div className="flex items-center space-x-4">
              <span className="text-xs text-gray-500">
                Data: ICMM Global Mining Dataset - September 2025
              </span>
            </div>
          </div>
        </div>
      </header>

      {/* Map Container */}
      <main className="h-full w-full">
        <Map className="h-full w-full" />
      </main>
    </div>
  );
}

export default App;