import { create } from 'zustand';
import { MineGeoJsonFeature } from '../types/mine';
import { ColorScheme } from '../utils/colorMappings';

export interface MineFilters {
  searchQuery: string;
  selectedCommodities: string[];
  selectedCountries: string[];
  selectedAssetTypes: string[];
}

interface MineStore {
  selectedMine: MineGeoJsonFeature | null;
  hoveredMine: MineGeoJsonFeature | null;
  colorScheme: ColorScheme;
  showLegend: boolean;
  showFilters: boolean;
  showStats: boolean;
  filters: MineFilters;
  setSelectedMine: (mine: MineGeoJsonFeature | null) => void;
  setHoveredMine: (mine: MineGeoJsonFeature | null) => void;
  setColorScheme: (scheme: ColorScheme) => void;
  setShowLegend: (show: boolean) => void;
  setShowFilters: (show: boolean) => void;
  setShowStats: (show: boolean) => void;
  setFilters: (filters: Partial<MineFilters>) => void;
  resetFilters: () => void;
  clearSelection: () => void;
}

const initialFilters: MineFilters = {
  searchQuery: '',
  selectedCommodities: [],
  selectedCountries: [],
  selectedAssetTypes: [],
};

export const useMineStore = create<MineStore>((set) => ({
  selectedMine: null,
  hoveredMine: null,
  colorScheme: 'commodity',
  showLegend: true,
  showFilters: false,
  showStats: false,
  filters: initialFilters,
  setSelectedMine: (mine) => set({ selectedMine: mine }),
  setHoveredMine: (mine) => set({ hoveredMine: mine }),
  setColorScheme: (scheme) => set({ colorScheme: scheme }),
  setShowLegend: (show) => set({ showLegend: show }),
  setShowFilters: (show) => set({ showFilters: show }),
  setShowStats: (show) => set({ showStats: show }),
  setFilters: (filters) => set((state) => ({ 
    filters: { ...state.filters, ...filters } 
  })),
  resetFilters: () => set({ filters: initialFilters }),
  clearSelection: () => set({ selectedMine: null, hoveredMine: null }),
}));