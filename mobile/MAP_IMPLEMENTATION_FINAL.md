# Map Implementation - Final Solution

## Overview

Map display on Android now uses **OpenStreetMap raster tiles** via MapLibre React Native.

## Map Styles

The system provides 4 map styles with free, open-source tile providers:

### 1. STANDARD (Default)

- Provider: OpenStreetMap
- Tile URL: `https://tile.openstreetmap.org/{z}/{x}/{y}.png`
- Best for: General maps, global coverage

### 2. SATELLITE

- Provider: USGS (U.S. Geological Survey)
- Tile URL: `https://basemap.nationalmap.gov/...`
- Best for: Satellite/aerial imagery

### 3. HIGHLIGHT (Light)

- Provider: OpenStreetMap DE (Deutschland)
- Tile URL: `https://tile.openstreetmap.de/tiles/osmde/{z}/{x}/{y}.png`
- Best for: Detailed road/POI information

### 4. DARK

- Provider: OpenStreetMap with brightness filter
- Tile URL: `https://tile.openstreetmap.org/{z}/{x}/{y}.png` with `raster-brightness-max: 0.5`
- Best for: Night mode / low light

## Technical Implementation

### Configuration File

**Location:** `mobile/constants/openstreetmap.ts`

```typescript
MAP_STYLES: {
  STANDARD: () => ({
    version: 8,
    sources: {
      osm: {
        type: 'raster',
        tiles: ['https://tile.openstreetmap.org/{z}/{x}/{y}.png'],
        tileSize: 256,
      },
    },
    layers: [
      {
        id: 'osm',
        type: 'raster',
        source: 'osm',
      },
    ],
  }),
  // ... more styles
}
```

### How getMapStyleUrl() Works

```typescript
export function getMapStyleUrl(styleType = 'STANDARD'): string {
  const styleObject = OpenStreetMapConstants.MAP_STYLES[styleType]();
  return JSON.stringify(styleObject); // Convert to JSON string for MapLibreGL
}
```

### Map Component Integration

**Location:** `mobile/app/(tabs)/map.tsx`

```typescript
const mapStyle = getMapStyleUrl('STANDARD');

<MapLibreGL.MapView
  styleURL={mapStyle}  // Passes JSON string directly
  style={styles.map}
  zoomEnabled={true}
  // ... other props
>
  {/* Sensor markers with color coding */}
</MapLibreGL.MapView>
```

## Sensor Markers

- **Color Based On:** AQI (Air Quality Index) value
- **Fallback:** Sensor status (active/inactive/unknown)
- **Colors:**
  - Green: AQI 0-50 (Good)
  - Yellow: AQI 51-100 (Fair)
  - Orange: AQI 101-150 (Unhealthy for Sensitive Groups)
  - Red: AQI 151-200 (Unhealthy)
  - Dark Red: AQI 201-300 (Very Unhealthy)
  - Indigo: AQI 301+ (Hazardous)

## Usage

### Start Development Server

```bash
cd mobile
pnpm install    # Install dependencies
pnpm start      # Start Expo dev server
```

### Using Different Map Styles

```typescript
// In map.tsx, change the style parameter:
const mapStyle = getMapStyleUrl('SATELLITE'); // Use satellite tiles
const mapStyle = getMapStyleUrl('DARK'); // Use dark mode
```

### Building for Android

```bash
cd mobile
pnpm install
pnpm run android  # Or use Expo build service
```

## No API Key Required

Unlike Mapbox or commercial providers, this solution uses **completely free, open-source tile sources**:

- OpenStreetMap (worldwide coverage)
- USGS (United States imagery)
- OpenStreetMap DE (European detail)

## File Locations

- **Configuration:** `mobile/constants/openstreetmap.ts`
- **Component:** `mobile/app/(tabs)/map.tsx`
- **Hooks:** `mobile/hooks/useSensorMarkers.ts`
- **Utilities:** `mobile/utils/mapLayerOptimization.ts`

## Troubleshooting

### Map Not Loading

1. Check internet connection
2. Verify tile URLs are accessible (try in browser: `https://tile.openstreetmap.org/6/21/25.png`)
3. Check MapLibreGL console for errors

### Markers Not Showing

1. Verify sensors data in store: `useAppStore().sensors`
2. Check sensor coordinates are valid (lon/lat format)
3. Confirm marker colors in `useSensorMarkers` hook

### Performance Issues

- Use STANDARD style (most optimized)
- Reduce zoom levels if sluggish
- Check device storage/RAM
- Clear app cache and restart

## Notes

- Map centers on Hanoi, Vietnam (105.84°E, 21.03°N)
- Zoom level: 6 (regional view)
- All interactions enabled: zoom, rotate, pitch, scroll
- Logo/attribution handled by MapLibre automatically
