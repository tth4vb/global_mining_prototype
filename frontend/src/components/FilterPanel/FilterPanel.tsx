import React, { useMemo } from 'react';
import { useMineStore } from '../../store/mineStore';
import { motion, AnimatePresence } from 'framer-motion';
import { MineGeoJson } from '../../types/mine';

interface FilterPanelProps {
  minesData: MineGeoJson | null;
}

const FilterPanel: React.FC<FilterPanelProps> = ({ minesData }) => {
  const { filters, setFilters, showFilters, resetFilters } = useMineStore();

  // Extract unique values from mines data
  const { commodities, countries, assetTypes } = useMemo(() => {
    if (!minesData || !minesData.features) {
      return { commodities: [], countries: [], assetTypes: [] };
    }

    const commoditySet = new Set<string>();
    const countrySet = new Set<string>();
    const assetTypeSet = new Set<string>();

    minesData.features.forEach(mine => {
      if (mine.properties.primaryCommodity) {
        commoditySet.add(mine.properties.primaryCommodity);
      }
      if (mine.properties.secondaryCommodity) {
        commoditySet.add(mine.properties.secondaryCommodity);
      }
      if (mine.properties.country) {
        countrySet.add(mine.properties.country);
      }
      if (mine.properties.assetType) {
        assetTypeSet.add(mine.properties.assetType);
      }
    });

    return {
      commodities: Array.from(commoditySet).sort(),
      countries: Array.from(countrySet).sort(),
      assetTypes: Array.from(assetTypeSet).sort(),
    };
  }, [minesData]);

  const toggleFilter = (type: 'commodities' | 'countries' | 'assetTypes', value: string) => {
    const key = type === 'commodities' ? 'selectedCommodities' : 
                type === 'countries' ? 'selectedCountries' : 'selectedAssetTypes';
    
    const current = filters[key];
    const updated = current.includes(value)
      ? current.filter(v => v !== value)
      : [...current, value];
    
    setFilters({ [key]: updated });
  };

  if (!showFilters) return null;

  return (
    <AnimatePresence>
      <motion.div
        className="fixed top-32 left-4 z-[900] bg-gray-900/95 backdrop-blur-sm rounded-lg shadow-2xl border border-gray-700 w-80"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -20 }}
      >
        <div className="p-4">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-white">Filters</h3>
            <button
              onClick={resetFilters}
              className="text-xs text-cyan-400 hover:text-cyan-300"
            >
              Clear All
            </button>
          </div>

          {/* Commodities Filter */}
          <div className="mb-4">
            <h4 className="text-sm font-medium text-gray-300 mb-2">Commodities</h4>
            <div className="max-h-32 overflow-y-auto">
              {commodities.map(commodity => (
                <label key={commodity} className="flex items-center gap-2 py-1 cursor-pointer hover:bg-gray-800 px-1 rounded">
                  <input
                    type="checkbox"
                    checked={filters.selectedCommodities.includes(commodity)}
                    onChange={() => toggleFilter('commodities', commodity)}
                    className="w-3 h-3 text-cyan-500 bg-gray-700 border-gray-600 rounded focus:ring-cyan-500"
                  />
                  <span className="text-xs text-gray-300">{commodity}</span>
                </label>
              ))}
            </div>
          </div>

          {/* Countries Filter */}
          <div className="mb-4">
            <h4 className="text-sm font-medium text-gray-300 mb-2">Countries</h4>
            <div className="max-h-32 overflow-y-auto">
              {countries.map(country => (
                <label key={country} className="flex items-center gap-2 py-1 cursor-pointer hover:bg-gray-800 px-1 rounded">
                  <input
                    type="checkbox"
                    checked={filters.selectedCountries.includes(country)}
                    onChange={() => toggleFilter('countries', country)}
                    className="w-3 h-3 text-cyan-500 bg-gray-700 border-gray-600 rounded focus:ring-cyan-500"
                  />
                  <span className="text-xs text-gray-300">{country}</span>
                </label>
              ))}
            </div>
          </div>

          {/* Asset Types Filter */}
          <div className="mb-2">
            <h4 className="text-sm font-medium text-gray-300 mb-2">Asset Types</h4>
            <div className="max-h-32 overflow-y-auto">
              {assetTypes.map(assetType => (
                <label key={assetType} className="flex items-center gap-2 py-1 cursor-pointer hover:bg-gray-800 px-1 rounded">
                  <input
                    type="checkbox"
                    checked={filters.selectedAssetTypes.includes(assetType)}
                    onChange={() => toggleFilter('assetTypes', assetType)}
                    className="w-3 h-3 text-cyan-500 bg-gray-700 border-gray-600 rounded focus:ring-cyan-500"
                  />
                  <span className="text-xs text-gray-300">{assetType}</span>
                </label>
              ))}
            </div>
          </div>
        </div>
      </motion.div>
    </AnimatePresence>
  );
};

export default FilterPanel;