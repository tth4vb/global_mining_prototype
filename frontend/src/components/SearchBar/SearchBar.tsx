import React, { useState, useEffect } from 'react';
import { useMineStore } from '../../store/mineStore';
import { motion } from 'framer-motion';
import { useResponsive } from '../../hooks/useResponsive';

const SearchBar: React.FC = () => {
  const { filters, setFilters, showFilters, setShowFilters } = useMineStore();
  const [localSearch, setLocalSearch] = useState(filters.searchQuery);
  const { isMobile } = useResponsive();

  useEffect(() => {
    const debounceTimer = setTimeout(() => {
      setFilters({ searchQuery: localSearch });
    }, 300);

    return () => clearTimeout(debounceTimer);
  }, [localSearch, setFilters]);

  return (
    <motion.div 
      className={`fixed z-[900] ${
        isMobile 
          ? 'top-16 left-2 right-2' 
          : 'top-20 left-4'
      }`}
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
    >
      <div className={`flex items-center gap-2 ${isMobile ? 'flex-col w-full' : ''}`}>
        {/* Search Input */}
        <div className={`relative ${isMobile ? 'w-full' : ''}`}>
          <input
            type="text"
            placeholder={isMobile ? "Search..." : "Search mines by name or location..."}
            value={localSearch}
            onChange={(e) => setLocalSearch(e.target.value)}
            className={`${
              isMobile ? 'w-full' : 'w-80'
            } px-4 py-2 pl-10 bg-gray-900/95 text-white rounded-lg border border-gray-700 
                     focus:outline-none focus:border-cyan-500 placeholder-gray-400`}
          />
          <svg 
            className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400"
            fill="none" 
            stroke="currentColor" 
            viewBox="0 0 24 24"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} 
                  d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
          {localSearch && (
            <button
              onClick={() => setLocalSearch('')}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          )}
        </div>

        {/* Filter Toggle Button */}
        <button
          onClick={() => setShowFilters(!showFilters)}
          className={`px-4 py-2 rounded-lg border transition-colors ${
            isMobile ? 'w-full' : ''
          } ${
            showFilters 
              ? 'bg-cyan-600 text-white border-cyan-600' 
              : 'bg-gray-900/95 text-white border-gray-700 hover:border-cyan-500'
          }`}
        >
          <div className="flex items-center gap-2">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} 
                    d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4" />
            </svg>
            <span>Filters</span>
            {(filters.selectedCommodities.length > 0 || 
              filters.selectedCountries.length > 0 || 
              filters.selectedAssetTypes.length > 0) && (
              <span className="bg-cyan-500 text-white text-xs px-1.5 py-0.5 rounded-full">
                {filters.selectedCommodities.length + 
                 filters.selectedCountries.length + 
                 filters.selectedAssetTypes.length}
              </span>
            )}
          </div>
        </button>
      </div>
    </motion.div>
  );
};

export default SearchBar;