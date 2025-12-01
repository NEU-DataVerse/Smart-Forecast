# Smart Forecast Mobile App - Map Implementation

## 📍 Map Provider: OpenStreetMap

The app uses **OpenStreetMap** via MapLibre for displaying environmental sensor data on an interactive map.

### Features

- **Color-Coded Sensors**: Markers display colors based on AQI values
  - 0-50: Green (Good)
  - 51-100: Yellow (Moderate)
  - 101-150: Orange (Unhealthy for sensitive groups)
  - 151-200: Red (Unhealthy)
  - 201-300: Dark Red (Very Unhealthy)
  - 301+: Indigo (Hazardous)

- **Interactive Info Panel**: Tap any sensor marker to view details including AQI, temperature, and humidity
- **Close Button**: Easy dismissal of sensor details
- **Responsive Map Controls**: Zoom, pan, pitch, and rotate the map

### Key Files

- `app/(tabs)/map.tsx` - Main map component
- `constants/openstreetmap.ts` - Map configuration
- `hooks/useSensorMarkers.ts` - Sensor marker management hook
- `utils/mapLayerOptimization.ts` - Color utilities and styling

### No API Keys Required

OpenStreetMap is completely free and doesn't require any API keys or authentication.

### Quick Start

```bash
# Run the app
npx expo start -c

# Build for Android
eas build --platform android

# Build for iOS
eas build --platform ios
```

### Map Styles

All map styles use the same open-source MapLibre demo tiles:

- STANDARD - Clean map view
- SATELLITE - Satellite view
- HIGHLIGHT - Light background for overlays
- DARK - Dark mode

All are free and require no authentication!
