import React, { useMemo } from 'react';
import { useMineStore } from '../../store/mineStore';
import { motion } from 'framer-motion';
import { MineGeoJson, MineGeoJsonFeature } from '../../types/mine';

interface StatsDashboardProps {
  minesData: MineGeoJson | null;
  filteredCount?: number;
}

const StatsDashboard: React.FC<StatsDashboardProps> = ({ minesData, filteredCount }) => {
  const { showStats, setShowStats, filters } = useMineStore();

  // Apply the same filtering logic as in the map
  const filteredMines = useMemo(() => {
    if (!minesData || !minesData.features) return [];
    
    let filtered = minesData.features;
    
    // Apply search filter
    if (filters.searchQuery) {
      const query = filters.searchQuery.toLowerCase();
      filtered = filtered.filter(mine => {
        const name = mine.properties.name?.toLowerCase() || '';
        const country = mine.properties.country?.toLowerCase() || '';
        const commodity = mine.properties.primaryCommodity?.toLowerCase() || '';
        return name.includes(query) || country.includes(query) || commodity.includes(query);
      });
    }
    
    // Apply commodity filter
    if (filters.selectedCommodities.length > 0) {
      filtered = filtered.filter(mine => {
        const primary = mine.properties.primaryCommodity;
        const secondary = mine.properties.secondaryCommodity;
        return (primary && filters.selectedCommodities.includes(primary)) || 
               (secondary && filters.selectedCommodities.includes(secondary));
      });
    }
    
    // Apply country filter
    if (filters.selectedCountries.length > 0) {
      filtered = filtered.filter(mine => 
        mine.properties.country && filters.selectedCountries.includes(mine.properties.country)
      );
    }
    
    // Apply asset type filter
    if (filters.selectedAssetTypes.length > 0) {
      filtered = filtered.filter(mine => 
        mine.properties.assetType && filters.selectedAssetTypes.includes(mine.properties.assetType)
      );
    }
    
    return filtered;
  }, [minesData, filters]);

  const isFiltered = filters.searchQuery || 
                    filters.selectedCommodities.length > 0 || 
                    filters.selectedCountries.length > 0 || 
                    filters.selectedAssetTypes.length > 0;

  const stats = useMemo(() => {
    const dataToAnalyze = isFiltered ? filteredMines : (minesData?.features || []);
    
    if (dataToAnalyze.length === 0) {
      return {
        totalMines: 0,
        countries: 0,
        commodities: new Map<string, number>(),
        assetTypes: new Map<string, number>(),
        topCommodities: [],
        topCountries: [],
      };
    }

    const countrySet = new Set<string>();
    const commodityCount = new Map<string, number>();
    const assetTypeCount = new Map<string, number>();
    const countryCount = new Map<string, number>();

    dataToAnalyze.forEach(mine => {
      // Count countries
      if (mine.properties.country) {
        countrySet.add(mine.properties.country);
        countryCount.set(mine.properties.country, 
          (countryCount.get(mine.properties.country) || 0) + 1
        );
      }

      // Count commodities
      if (mine.properties.primaryCommodity) {
        const commodity = mine.properties.primaryCommodity.toLowerCase();
        commodityCount.set(commodity, (commodityCount.get(commodity) || 0) + 1);
      }

      // Count asset types
      if (mine.properties.assetType) {
        assetTypeCount.set(mine.properties.assetType, 
          (assetTypeCount.get(mine.properties.assetType) || 0) + 1
        );
      }
    });

    // Get top 5 commodities
    const topCommodities = Array.from(commodityCount.entries())
      .sort((a, b) => b[1] - a[1])
      .slice(0, 5);

    // Get top 5 countries
    const topCountries = Array.from(countryCount.entries())
      .sort((a, b) => b[1] - a[1])
      .slice(0, 5);

    return {
      totalMines: dataToAnalyze.length,
      countries: countrySet.size,
      commodities: commodityCount,
      assetTypes: assetTypeCount,
      topCommodities,
      topCountries,
    };
  }, [filteredMines, minesData, isFiltered]);

  // Export functions - now export filtered data when filters are active
  const exportAsJSON = () => {
    const dataToExport = isFiltered ? filteredMines : (minesData?.features || []);
    if (dataToExport.length === 0) return;
    
    const exportData = {
      type: "FeatureCollection",
      features: dataToExport,
      metadata: {
        exported: new Date().toISOString(),
        filtered: isFiltered,
        totalRecords: dataToExport.length,
        filters: isFiltered ? {
          searchQuery: filters.searchQuery,
          selectedCommodities: filters.selectedCommodities,
          selectedCountries: filters.selectedCountries,
          selectedAssetTypes: filters.selectedAssetTypes
        } : null
      }
    };
    
    const dataStr = JSON.stringify(exportData, null, 2);
    const dataUri = 'data:application/json;charset=utf-8,'+ encodeURIComponent(dataStr);
    const exportFileDefaultName = isFiltered ? 'mines_data_filtered.json' : 'mines_data.json';
    const linkElement = document.createElement('a');
    linkElement.setAttribute('href', dataUri);
    linkElement.setAttribute('download', exportFileDefaultName);
    linkElement.click();
  };

  const exportAsCSV = () => {
    const dataToExport = isFiltered ? filteredMines : (minesData?.features || []);
    if (dataToExport.length === 0) return;
    
    const headers = ['Name', 'Country', 'Primary Commodity', 'Secondary Commodity', 'Asset Type', 'Confidence', 'Latitude', 'Longitude'];
    const rows = dataToExport.map(mine => [
      mine.properties.name || '',
      mine.properties.country || '',
      mine.properties.primaryCommodity || '',
      mine.properties.secondaryCommodity || '',
      mine.properties.assetType || '',
      mine.properties.confidenceFactor || '',
      mine.geometry.coordinates[1],
      mine.geometry.coordinates[0],
    ]);

    const csvContent = [
      headers.join(','),
      ...rows.map(row => row.map(cell => `"${cell}"`).join(','))
    ].join('\n');

    const dataUri = 'data:text/csv;charset=utf-8,'+ encodeURIComponent(csvContent);
    const exportFileDefaultName = isFiltered ? 'mines_data_filtered.csv' : 'mines_data.csv';
    const linkElement = document.createElement('a');
    linkElement.setAttribute('href', dataUri);
    linkElement.setAttribute('download', exportFileDefaultName);
    linkElement.click();
  };

  return (
    <div className="fixed top-20 right-4 z-[900]">
      {/* Stats Toggle Button */}
      <button
        onClick={() => setShowStats(!showStats)}
        className={`px-4 py-2 rounded-lg border transition-colors ${
          showStats 
            ? 'bg-cyan-600 text-white border-cyan-600' 
            : 'bg-gray-900/95 text-white border-gray-700 hover:border-cyan-500'
        }`}
      >
        <div className="flex items-center gap-2">
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} 
                  d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
          </svg>
          <span>Statistics</span>
        </div>
      </button>

      {/* Stats Panel */}
      {showStats && (
        <motion.div
          className="absolute top-12 right-0 bg-gray-900/95 backdrop-blur-sm rounded-lg shadow-2xl border border-gray-700 w-80"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <div className="p-4">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-white">Statistics</h3>
              {isFiltered && (
                <span className="text-xs bg-cyan-600/30 text-cyan-400 px-2 py-1 rounded">
                  Filtered
                </span>
              )}
            </div>
            
            {/* Overview Stats */}
            <div className="grid grid-cols-2 gap-3 mb-4">
              <div className="bg-gray-800 rounded p-3">
                <div className="text-2xl font-bold text-cyan-400">
                  {stats.totalMines}
                </div>
                <div className="text-xs text-gray-400">
                  {isFiltered ? 'Filtered Mines' : 'Total Mines'}
                </div>
              </div>
              <div className="bg-gray-800 rounded p-3">
                <div className="text-2xl font-bold text-cyan-400">{stats.countries}</div>
                <div className="text-xs text-gray-400">Countries</div>
              </div>
            </div>

            {/* Top Commodities */}
            <div className="mb-4">
              <h4 className="text-sm font-medium text-gray-300 mb-2">Top Commodities</h4>
              <div className="space-y-1">
                {stats.topCommodities.map(([commodity, count]) => (
                  <div key={commodity} className="flex items-center justify-between">
                    <span className="text-xs text-gray-300 capitalize">{commodity}</span>
                    <div className="flex items-center gap-2">
                      <div className="w-20 bg-gray-700 rounded-full h-2">
                        <div 
                          className="bg-cyan-500 h-2 rounded-full"
                          style={{ width: `${(count / stats.totalMines) * 100}%` }}
                        />
                      </div>
                      <span className="text-xs text-gray-400 w-10 text-right">{count}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Top Countries */}
            <div className="mb-4">
              <h4 className="text-sm font-medium text-gray-300 mb-2">Top Countries</h4>
              <div className="space-y-1">
                {stats.topCountries.map(([country, count]) => (
                  <div key={country} className="flex items-center justify-between">
                    <span className="text-xs text-gray-300">{country}</span>
                    <div className="flex items-center gap-2">
                      <div className="w-20 bg-gray-700 rounded-full h-2">
                        <div 
                          className="bg-green-500 h-2 rounded-full"
                          style={{ width: `${(count / stats.totalMines) * 100}%` }}
                        />
                      </div>
                      <span className="text-xs text-gray-400 w-10 text-right">{count}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Export Buttons */}
            <div className="pt-3 border-t border-gray-700">
              {isFiltered && (
                <div className="text-xs text-cyan-400 mb-2 text-center">
                  Export {stats.totalMines} filtered mines
                </div>
              )}
              <div className="flex gap-2">
                <button
                  onClick={exportAsJSON}
                  className="flex-1 px-3 py-2 bg-gray-800 text-white text-xs rounded hover:bg-gray-700 transition-colors"
                >
                  Export JSON
                </button>
                <button
                  onClick={exportAsCSV}
                  className="flex-1 px-3 py-2 bg-gray-800 text-white text-xs rounded hover:bg-gray-700 transition-colors"
                >
                  Export CSV
                </button>
              </div>
            </div>
          </div>
        </motion.div>
      )}
    </div>
  );
};

export default StatsDashboard;