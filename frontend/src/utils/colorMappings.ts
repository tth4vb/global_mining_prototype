export type ColorScheme = 'commodity' | 'assetType' | 'confidence';

// Commodity colors - using distinct colors for major commodities
export const commodityColors: { [key: string]: string } = {
  // Precious metals
  'gold': '#FFD700',
  'silver': '#C0C0C0',
  'platinum': '#E5E4E2',
  'diamond': '#B9F2FF',
  
  // Base metals
  'copper': '#B87333',
  'iron ore': '#8B4513',
  'zinc': '#7F8C8D',
  'lead': '#5D6D7E',
  'nickel': '#A8E6CF',
  'tin': '#AAB7B8',
  'aluminium': '#BDC3C7',
  'bauxite': '#E67E22',
  
  // Energy
  'coal': '#2C3E50',
  'thermal coal': '#34495E',
  'metallurgical coal': '#1C2833',
  'uranium': '#7FFF00',
  'oil sands': '#8B4513',
  
  // Industrial minerals
  'lithium': '#9B59B6',
  'cobalt': '#3498DB',
  'rare earths': '#E74C3C',
  'phosphate': '#16A085',
  'potash': '#F39C12',
  
  // Other
  'molybdenum': '#884EA0',
  'manganese': '#784212',
  'chromium': '#85929E',
  'vanadium': '#641E16',
  'tungsten': '#4A235A',
  
  // Default
  'unknown': '#95A5A6',
  'other': '#7F8C8D'
};

// Asset type colors
export const assetTypeColors: { [key: string]: string } = {
  'Mine': '#00D9FF',
  'Smelter': '#FF6B6B',
  'Refinery': '#4ECDC4',
  'Plant': '#45B7D1',
  'Steel Plant': '#96CEB4',
  'Processing': '#FFEAA7',
  'Mill': '#DDA0DD',
  'unknown': '#95A5A6'
};

// Confidence colors
export const confidenceColors: { [key: string]: string } = {
  'High': '#27AE60',
  'Moderate': '#F39C12',
  'Very Low': '#E74C3C',
  'unknown': '#95A5A6'
};

export function getCommodityColor(commodity: string | undefined | null): string {
  if (!commodity) return commodityColors.unknown;
  
  const normalizedCommodity = commodity.toLowerCase().trim();
  
  // Check for exact match first
  if (commodityColors[normalizedCommodity]) {
    return commodityColors[normalizedCommodity];
  }
  
  // Check for partial matches
  for (const [key, color] of Object.entries(commodityColors)) {
    if (normalizedCommodity.includes(key) || key.includes(normalizedCommodity)) {
      return color;
    }
  }
  
  return commodityColors.other;
}

export function getAssetTypeColor(assetType: string | undefined | null): string {
  if (!assetType) return assetTypeColors.unknown;
  
  // Handle combined types (e.g., "Mine;Smelter")
  const types = assetType.split(/[;,\/]/);
  const primaryType = types[0].trim();
  
  // Check for exact match
  if (assetTypeColors[primaryType]) {
    return assetTypeColors[primaryType];
  }
  
  // Check for partial match
  for (const [key, color] of Object.entries(assetTypeColors)) {
    if (primaryType.toLowerCase().includes(key.toLowerCase())) {
      return color;
    }
  }
  
  return assetTypeColors.unknown;
}

export function getConfidenceColor(confidence: string | undefined | null): string {
  if (!confidence) return confidenceColors.unknown;
  return confidenceColors[confidence] || confidenceColors.unknown;
}

// Get color based on selected scheme
export function getMineColor(
  properties: any,
  colorScheme: ColorScheme = 'commodity'
): string {
  switch (colorScheme) {
    case 'commodity':
      return getCommodityColor(properties.primaryCommodity);
    case 'assetType':
      return getAssetTypeColor(properties.assetType);
    case 'confidence':
      return getConfidenceColor(properties.confidenceFactor);
    default:
      return '#00D9FF';
  }
}

// Convert hex color to RGB
export function hexToRgb(hex: string): { r: number; g: number; b: number } | null {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  return result ? {
    r: parseInt(result[1], 16),
    g: parseInt(result[2], 16),
    b: parseInt(result[3], 16)
  } : null;
}

// Get lighter or darker shade of a color
export function adjustColor(hex: string, percent: number): string {
  const rgb = hexToRgb(hex);
  if (!rgb) return hex;
  
  const factor = percent / 100;
  const r = Math.round(Math.min(255, rgb.r + (255 - rgb.r) * factor));
  const g = Math.round(Math.min(255, rgb.g + (255 - rgb.g) * factor));
  const b = Math.round(Math.min(255, rgb.b + (255 - rgb.b) * factor));
  
  return `#${((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1)}`;
}