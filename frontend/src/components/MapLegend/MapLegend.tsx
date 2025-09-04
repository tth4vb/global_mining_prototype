import React, { useState } from 'react';
import { useMineStore } from '../../store/mineStore';
import { commodityColors, assetTypeColors, confidenceColors, ColorScheme } from '../../utils/colorMappings';
import { motion, AnimatePresence } from 'framer-motion';

const MapLegend: React.FC = () => {
  const { colorScheme, setColorScheme, showLegend, setShowLegend } = useMineStore();
  const [isExpanded, setIsExpanded] = useState(false);

  if (!showLegend) return null;

  // Get the relevant color mapping based on scheme
  const getColorMap = () => {
    switch (colorScheme) {
      case 'commodity':
        // Show only the most common commodities to keep legend manageable
        return {
          'Gold': commodityColors.gold,
          'Copper': commodityColors.copper,
          'Iron Ore': commodityColors['iron ore'],
          'Coal': commodityColors.coal,
          'Silver': commodityColors.silver,
          'Zinc': commodityColors.zinc,
          'Nickel': commodityColors.nickel,
          'Lithium': commodityColors.lithium,
          'Other': commodityColors.other,
        };
      case 'assetType':
        return {
          'Mine': assetTypeColors.Mine,
          'Smelter': assetTypeColors.Smelter,
          'Refinery': assetTypeColors.Refinery,
          'Plant': assetTypeColors.Plant,
          'Other': assetTypeColors.unknown,
        };
      case 'confidence':
        return {
          'High': confidenceColors.High,
          'Moderate': confidenceColors.Moderate,
          'Very Low': confidenceColors['Very Low'],
        };
      default:
        return {};
    }
  };

  const colorMap = getColorMap();
  const displayedItems = isExpanded ? Object.entries(colorMap) : Object.entries(colorMap).slice(0, 5);

  return (
    <div className="absolute bottom-8 left-4 z-[500]">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-gray-900/95 backdrop-blur-sm rounded-lg shadow-2xl border border-gray-700"
      >
        {/* Header with controls */}
        <div className="px-4 py-3 border-b border-gray-700">
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-sm font-semibold text-white">Map Legend</h3>
            <button
              onClick={() => setShowLegend(false)}
              className="text-gray-400 hover:text-white transition-colors"
              aria-label="Close legend"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
          
          {/* Color scheme selector */}
          <div className="flex gap-1">
            <button
              onClick={() => setColorScheme('commodity')}
              className={`px-2 py-1 text-xs rounded transition-colors ${
                colorScheme === 'commodity'
                  ? 'bg-cyan-600 text-white'
                  : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
              }`}
            >
              Commodity
            </button>
            <button
              onClick={() => setColorScheme('assetType')}
              className={`px-2 py-1 text-xs rounded transition-colors ${
                colorScheme === 'assetType'
                  ? 'bg-cyan-600 text-white'
                  : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
              }`}
            >
              Asset Type
            </button>
            <button
              onClick={() => setColorScheme('confidence')}
              className={`px-2 py-1 text-xs rounded transition-colors ${
                colorScheme === 'confidence'
                  ? 'bg-cyan-600 text-white'
                  : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
              }`}
            >
              Confidence
            </button>
          </div>
        </div>

        {/* Legend items */}
        <div className="px-4 py-3">
          <AnimatePresence mode="wait">
            <motion.div
              key={colorScheme}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="space-y-2"
            >
              {displayedItems.map(([label, color]) => (
                <div key={label} className="flex items-center gap-2">
                  <div
                    className="w-4 h-4 rounded-full border border-white/50 shadow-sm"
                    style={{ backgroundColor: color }}
                  />
                  <span className="text-xs text-gray-300">{label}</span>
                </div>
              ))}
            </motion.div>
          </AnimatePresence>

          {/* Expand/collapse for commodity view */}
          {colorScheme === 'commodity' && Object.keys(colorMap).length > 5 && (
            <button
              onClick={() => setIsExpanded(!isExpanded)}
              className="mt-2 text-xs text-cyan-400 hover:text-cyan-300 transition-colors"
            >
              {isExpanded ? '↑ Show less' : `↓ Show ${Object.keys(colorMap).length - 5} more`}
            </button>
          )}
        </div>

        {/* Footer info */}
        <div className="px-4 py-2 border-t border-gray-700 bg-gray-800/50">
          <p className="text-xs text-gray-400">
            {colorScheme === 'commodity' && 'Colored by primary commodity'}
            {colorScheme === 'assetType' && 'Colored by asset type'}
            {colorScheme === 'confidence' && 'Colored by data confidence level'}
          </p>
        </div>
      </motion.div>
    </div>
  );
};

export default MapLegend;