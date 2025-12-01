/**
 * OpenStreetMap Configuration
 *
 * OpenStreetMap provides free, open-source map tile services
 * Supporting MapLibre integration for React Native
 * No API key required - completely open and free to use
 */

export const OpenStreetMapConstants = {
  // No API key needed for OpenStreetMap
  API_KEY: 'openstreetmap',

  // Map Style URLs - Direct links to free tile servers
  // These return proper MapLibre GL JSON style objects
  MAP_STYLES: {
    // Standard OSM map - from Stadia Maps (free tier, no key required for development)
    STANDARD: 'https://maps.stadiamaps.com/styles/osm_bright.json',

    // Stadia Outdoors style
    SATELLITE: 'https://maps.stadiamaps.com/styles/stamen_terrain.json',

    // Light background for overlays
    HIGHLIGHT: 'https://maps.stadiamaps.com/styles/stamen_toner_background.json',

    // Dark map for night mode
    DARK: 'https://maps.stadiamaps.com/styles/stamen_toner.json',
  },

  // Default map configuration
  DEFAULT_CONFIG: {
    ZOOM_LEVEL: 6,
    CENTER_COORDINATE: [105.83991, 21.028] as [number, number], // [lng, lat] - Hanoi
    ANIMATION_DURATION: 0, // milliseconds
    ANIMATION_MODE: 'flyTo' as const,
  },

  // Vietnam boundaries (approximate)
  VIETNAM_BOUNDS: {
    NORTH: 23.393,
    SOUTH: 8.562,
    EAST: 109.503,
    WEST: 102.144,
  },

  // Attribution for OpenStreetMap compliance
  ATTRIBUTION: {
    text: '© OpenStreetMap contributors',
    url: 'https://www.openstreetmap.org/copyright',
  },
};

/**
 * Get the appropriate map style URL
 * @param styleType - 'STANDARD' | 'SATELLITE' | 'HIGHLIGHT' | 'DARK'
 * @returns The map style URL string
 */
export function getMapStyleUrl(
  styleType: keyof typeof OpenStreetMapConstants.MAP_STYLES = 'STANDARD',
): string {
  try {
    const style = OpenStreetMapConstants.MAP_STYLES[styleType];
    // Return URL string directly - MapLibreGL will fetch and parse the JSON
    return style;
  } catch (error) {
    console.error(`Error loading map style: ${styleType}`, error);
    return OpenStreetMapConstants.MAP_STYLES.STANDARD;
  }
}
