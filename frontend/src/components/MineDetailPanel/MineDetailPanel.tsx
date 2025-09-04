import React, { useEffect } from 'react';
import { useMineStore } from '../../store/mineStore';
import { motion, AnimatePresence } from 'framer-motion';

const MineDetailPanel: React.FC = () => {
  const { selectedMine, clearSelection } = useMineStore();

  // Close on escape key
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        clearSelection();
      }
    };
    window.addEventListener('keydown', handleEscape);
    return () => window.removeEventListener('keydown', handleEscape);
  }, [clearSelection]);

  if (!selectedMine) return null;

  const props = selectedMine.properties;

  const detailItems = [
    { label: 'Mine Name', value: props.name || 'Unknown' },
    { label: 'Country', value: props.country || 'Unknown' },
    { label: 'Primary Commodity', value: props.primaryCommodity || 'Unknown' },
    { label: 'Secondary Commodity', value: props.secondaryCommodity || 'N/A' },
    { label: 'Asset Type', value: props.assetType || 'Mine' },
    { label: 'Confidence Factor', value: props.confidenceFactor || 'Unknown' },
    { label: 'Group', value: props.groupNames || 'N/A' },
    { label: 'Coordinates', value: `${selectedMine.geometry.coordinates[1].toFixed(4)}, ${selectedMine.geometry.coordinates[0].toFixed(4)}` },
  ];

  // Commodity color mapping
  const getCommodityColor = (commodity: string) => {
    if (!commodity) return 'bg-gray-500';
    
    const normalizedCommodity = commodity.toLowerCase();
    
    if (normalizedCommodity.includes('gold')) return 'bg-yellow-500';
    if (normalizedCommodity.includes('copper')) return 'bg-orange-500';
    if (normalizedCommodity.includes('iron')) return 'bg-red-500';
    if (normalizedCommodity.includes('coal')) return 'bg-gray-600';
    if (normalizedCommodity.includes('silver')) return 'bg-gray-400';
    if (normalizedCommodity.includes('zinc')) return 'bg-blue-500';
    if (normalizedCommodity.includes('lead')) return 'bg-purple-500';
    if (normalizedCommodity.includes('nickel')) return 'bg-green-500';
    if (normalizedCommodity.includes('uranium')) return 'bg-lime-500';
    if (normalizedCommodity.includes('diamond')) return 'bg-cyan-300';
    if (normalizedCommodity.includes('lithium')) return 'bg-violet-500';
    if (normalizedCommodity.includes('cobalt')) return 'bg-indigo-500';
    if (normalizedCommodity.includes('platinum')) return 'bg-slate-400';
    if (normalizedCommodity.includes('alumin')) return 'bg-gray-300';
    
    return 'bg-cyan-500';
  };

  return (
    <>
      {/* Backdrop */}
      <AnimatePresence>
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black/50 z-[9998] lg:hidden"
          onClick={clearSelection}
        />
      </AnimatePresence>

      {/* Panel */}
      <AnimatePresence>
        <motion.div
          initial={{ x: '100%' }}
          animate={{ x: 0 }}
          exit={{ x: '100%' }}
          transition={{ type: 'spring', damping: 20, stiffness: 300 }}
          className="fixed right-0 top-0 h-full w-full sm:w-96 bg-gray-900 shadow-2xl z-[9999] flex flex-col"
        >
          <div className="flex-shrink-0 bg-gray-900 border-b border-gray-700 px-6 py-4 flex items-center justify-between">
            <h2 className="text-xl font-bold text-white">Mine Details</h2>
            <button
              onClick={clearSelection}
              className="text-gray-400 hover:text-white transition-colors p-2 hover:bg-gray-800 rounded-lg"
              aria-label="Close panel"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          <div className="flex-1 overflow-y-auto">
            <div className="p-6 space-y-6 pb-20">
              {/* Commodity Badge */}
              <div className="flex flex-wrap items-center gap-2">
                <span className={`inline-block px-3 py-1 rounded-full text-white text-sm font-medium ${getCommodityColor(props.primaryCommodity)}`}>
                  {props.primaryCommodity || 'Unknown'}
                </span>
                {props.secondaryCommodity && props.secondaryCommodity !== 'N/A' && (
                  <span className={`inline-block px-3 py-1 rounded-full text-white text-sm font-medium ${getCommodityColor(props.secondaryCommodity)} opacity-70`}>
                    {props.secondaryCommodity}
                  </span>
                )}
              </div>

              {/* Main Details */}
              <div className="space-y-4">
                {detailItems.map(({ label, value }) => (
                  <div key={label} className="border-b border-gray-800 pb-3">
                    <div className="text-sm text-gray-400 mb-1">{label}</div>
                    <div className="text-white font-medium">{value}</div>
                  </div>
                ))}
              </div>

              {/* Confidence Indicator */}
              <div className="mt-6">
                <div className="text-sm text-gray-400 mb-2">Data Confidence</div>
                <div className="flex items-center gap-2">
                  <div className="flex-1 bg-gray-800 rounded-full h-2 overflow-hidden">
                    <div 
                      className={`h-full transition-all duration-500 ${
                        props.confidenceFactor === 'High' ? 'w-full bg-green-500' :
                        props.confidenceFactor === 'Moderate' ? 'w-2/3 bg-yellow-500' :
                        'w-1/3 bg-red-500'
                      }`}
                    />
                  </div>
                  <span className="text-xs text-gray-400">{props.confidenceFactor || 'Unknown'}</span>
                </div>
              </div>

              {/* Map Actions */}
              <div className="mt-6 space-y-2">
                <button
                  onClick={() => {
                    // Open in Google Maps
                    window.open(`https://www.google.com/maps?q=${selectedMine.geometry.coordinates[1]},${selectedMine.geometry.coordinates[0]}`, '_blank');
                  }}
                  className="w-full bg-cyan-600 hover:bg-cyan-700 text-white px-4 py-2 rounded-lg transition-colors flex items-center justify-center gap-2"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                  View in Google Maps
                </button>
              </div>
            </div>
          </div>
        </motion.div>
      </AnimatePresence>
    </>
  );
};

export default MineDetailPanel;