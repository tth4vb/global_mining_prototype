#!/usr/bin/env python3
"""
Script to parse KML and Excel data into unified GeoJSON format
"""

import json
import pandas as pd
import xml.etree.ElementTree as ET
import re
from typing import Dict, List, Any

def parse_kml_to_dict(kml_path: str) -> Dict[str, Dict]:
    """Parse KML file and extract mine data into a dictionary keyed by ICMMID"""
    tree = ET.parse(kml_path)
    root = tree.getroot()
    
    # Define namespace
    ns = {'kml': 'http://www.opengis.net/kml/2.2'}
    
    mines_dict = {}
    
    # Find all Placemark elements
    for placemark in root.findall('.//kml:Placemark', ns):
        mine_data = {}
        
        # Get name
        name_elem = placemark.find('kml:name', ns)
        if name_elem is not None:
            mine_data['name'] = name_elem.text
        
        # Get coordinates
        coordinates_elem = placemark.find('.//kml:coordinates', ns)
        if coordinates_elem is not None and coordinates_elem.text:
            coords = coordinates_elem.text.strip().split(',')
            if len(coords) >= 2:
                mine_data['longitude'] = float(coords[0])
                mine_data['latitude'] = float(coords[1])
        
        # Get extended data
        schema_data = placemark.find('.//kml:SchemaData', ns)
        if schema_data is not None:
            for simple_data in schema_data.findall('kml:SimpleData', ns):
                field_name = simple_data.get('name')
                field_value = simple_data.text
                if field_name and field_value:
                    # Map KML field names to our standardized names
                    field_mapping = {
                        'ICMMID': 'id',
                        'Mine_Name_': 'name',
                        'Group_Names': 'groupNames',
                        'Latitude': 'latitude',
                        'Longitude': 'longitude',
                        'Asset_Type': 'assetType',
                        'Country': 'country',
                        'Primary_Commodity': 'primaryCommodity',
                        'Secondary_Commodity': 'secondaryCommodity',
                        'Other_Commodities': 'otherCommodities',
                        'Confidence_Factor': 'confidenceFactor'
                    }
                    
                    if field_name in field_mapping:
                        mapped_name = field_mapping[field_name]
                        # Handle numeric fields
                        if mapped_name in ['latitude', 'longitude']:
                            try:
                                field_value = float(field_value)
                            except (ValueError, TypeError):
                                pass
                        mine_data[mapped_name] = field_value
        
        # Add to dictionary if we have an ID
        if 'id' in mine_data:
            mines_dict[mine_data['id']] = mine_data
    
    return mines_dict

def parse_excel_to_dict(excel_path: str) -> Dict[str, Dict]:
    """Parse Excel file and extract mine data into a dictionary keyed by ICMMID"""
    df = pd.read_excel(excel_path, sheet_name='External')
    
    mines_dict = {}
    
    for _, row in df.iterrows():
        # Helper function to clean and convert coordinates
        def clean_float(val):
            if pd.isna(val):
                return None
            # Convert to string and replace non-standard minus signs
            val_str = str(val).replace('−', '-').replace('–', '-')
            try:
                return float(val_str)
            except (ValueError, TypeError):
                return None
        
        mine_data = {
            'id': str(row['ICMMID']),
            'name': str(row['Mine Name ']).strip() if pd.notna(row['Mine Name ']) else None,
            'groupNames': str(row['Group Names']) if pd.notna(row['Group Names']) else None,
            'latitude': clean_float(row['Latitude']),
            'longitude': clean_float(row['Longitude']),
            'assetType': str(row['Asset Type']) if pd.notna(row['Asset Type']) else None,
            'country': str(row['Country']) if pd.notna(row['Country']) else None,
            'primaryCommodity': str(row['Primary Commodity']) if pd.notna(row['Primary Commodity']) else None,
            'secondaryCommodity': str(row['Secondary Commodity']) if pd.notna(row['Secondary Commodity']) else None,
            'otherCommodities': str(row['Other Commodities']) if pd.notna(row['Other Commodities']) else None,
            'confidenceFactor': str(row['Confidence Factor']) if pd.notna(row['Confidence Factor']) else None
        }
        
        # Remove None values
        mine_data = {k: v for k, v in mine_data.items() if v is not None and v != 'nan'}
        
        if 'id' in mine_data:
            mines_dict[mine_data['id']] = mine_data
    
    return mines_dict

def merge_data(kml_dict: Dict, excel_dict: Dict) -> List[Dict]:
    """Merge data from KML and Excel, preferring Excel data when available"""
    all_ids = set(kml_dict.keys()) | set(excel_dict.keys())
    
    merged_mines = []
    for mine_id in all_ids:
        # Start with KML data if available
        if mine_id in kml_dict:
            mine_data = kml_dict[mine_id].copy()
        else:
            mine_data = {'id': mine_id}
        
        # Override/add Excel data if available
        if mine_id in excel_dict:
            mine_data.update(excel_dict[mine_id])
        
        # Only include if we have coordinates
        if 'latitude' in mine_data and 'longitude' in mine_data:
            merged_mines.append(mine_data)
    
    return merged_mines

def create_geojson(mines: List[Dict]) -> Dict:
    """Convert mines data to GeoJSON format"""
    features = []
    
    for mine in mines:
        # Extract coordinates
        longitude = mine.pop('longitude', 0)
        latitude = mine.pop('latitude', 0)
        
        feature = {
            'type': 'Feature',
            'geometry': {
                'type': 'Point',
                'coordinates': [longitude, latitude]
            },
            'properties': mine
        }
        features.append(feature)
    
    return {
        'type': 'FeatureCollection',
        'features': features
    }

def main():
    print("Parsing KML data...")
    kml_dict = parse_kml_to_dict('doc.kml')
    print(f"Found {len(kml_dict)} mines in KML")
    
    print("Parsing Excel data...")
    excel_dict = parse_excel_to_dict('global-mining-dataset.xlsx')
    print(f"Found {len(excel_dict)} mines in Excel")
    
    print("Merging data...")
    merged_mines = merge_data(kml_dict, excel_dict)
    print(f"Merged into {len(merged_mines)} total mines with coordinates")
    
    print("Creating GeoJSON...")
    geojson = create_geojson(merged_mines)
    
    # Save to file
    output_path = 'frontend/src/data/mines.geojson'
    with open(output_path, 'w') as f:
        json.dump(geojson, f, indent=2)
    
    print(f"GeoJSON saved to {output_path}")
    
    # Print statistics
    commodities = {}
    countries = {}
    asset_types = {}
    
    for feature in geojson['features']:
        props = feature['properties']
        
        # Count commodities
        if 'primaryCommodity' in props:
            commodity = props['primaryCommodity']
            commodities[commodity] = commodities.get(commodity, 0) + 1
        
        # Count countries
        if 'country' in props:
            country = props['country']
            countries[country] = countries.get(country, 0) + 1
        
        # Count asset types
        if 'assetType' in props:
            asset_type = props['assetType']
            asset_types[asset_type] = asset_types.get(asset_type, 0) + 1
    
    print("\nTop 10 commodities:")
    for commodity, count in sorted(commodities.items(), key=lambda x: x[1], reverse=True)[:10]:
        print(f"  {commodity}: {count}")
    
    print("\nTop 10 countries:")
    for country, count in sorted(countries.items(), key=lambda x: x[1], reverse=True)[:10]:
        print(f"  {country}: {count}")
    
    print("\nAsset types:")
    for asset_type, count in sorted(asset_types.items(), key=lambda x: x[1], reverse=True)[:5]:
        print(f"  {asset_type}: {count}")

if __name__ == "__main__":
    main()