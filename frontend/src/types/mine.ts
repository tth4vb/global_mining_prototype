export interface Mine {
  id: string; // ICMMID
  name: string;
  groupNames?: string;
  latitude: number;
  longitude: number;
  assetType: string;
  country: string;
  primaryCommodity: string;
  secondaryCommodity?: string;
  otherCommodities?: string;
  confidenceFactor: 'High' | 'Moderate' | 'Very Low';
}

export interface MineGeoJsonProperties extends Mine {}

export interface MineGeoJsonFeature {
  type: 'Feature';
  geometry: {
    type: 'Point';
    coordinates: [number, number]; // [longitude, latitude]
  };
  properties: MineGeoJsonProperties;
}

export interface MineGeoJson {
  type: 'FeatureCollection';
  features: MineGeoJsonFeature[];
}

export type CommodityType = 
  | 'thermal coal'
  | 'coal'
  | 'copper'
  | 'metallurgical coal'
  | 'gold'
  | 'iron ore'
  | 'tin'
  | 'zinc'
  | 'silver'
  | 'nickel'
  | string; // Allow other commodity types

export type AssetType = 
  | 'Mine'
  | 'Smelter'
  | 'Refinery'
  | 'Plant'
  | 'Steel Plant'
  | string; // Allow combinations like "Mine;Smelter"

export interface FilterOptions {
  countries?: string[];
  commodities?: CommodityType[];
  assetTypes?: AssetType[];
  confidenceLevels?: ('High' | 'Moderate' | 'Very Low')[];
}

export interface MapViewState {
  longitude: number;
  latitude: number;
  zoom: number;
  bearing?: number;
  pitch?: number;
}