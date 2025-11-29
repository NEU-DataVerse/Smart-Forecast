/**
 * Air Quality Observed Seed Data
 *
 * Generates sample air quality observations for the past 7 days.
 * Creates hourly data points for each station.
 */

import {
  STATION_HOAN_KIEM_ID,
  STATION_HA_DONG_ID,
  STATION_CAU_GIAY_ID,
  STATION_LONG_BIEN_ID,
} from './stations.seed';

export interface AirQualitySeedData {
  entityId: string;
  entityType: string;
  recvTime: Date;
  locationId: string;
  location: {
    type: 'Point';
    coordinates: [number, number];
  };
  address: string;
  dateObserved: Date;
  co: number;
  no: number;
  no2: number;
  o3: number;
  so2: number;
  pm25: number;
  pm10: number;
  nh3: number;
  airQualityIndex: number;
  airQualityLevel: string;
  airQualityIndexUS: number;
  airQualityLevelUS: string;
  rawEntity: any;
}

// Station locations for reference
const STATION_LOCATIONS: Record<
  string,
  { lat: number; lon: number; address: string }
> = {
  [STATION_HOAN_KIEM_ID]: {
    lat: 21.028511,
    lon: 105.804817,
    address: 'Hoàn Kiếm, Hà Nội',
  },
  [STATION_HA_DONG_ID]: {
    lat: 20.959001,
    lon: 105.765226,
    address: 'Hà Đông, Hà Nội',
  },
  [STATION_CAU_GIAY_ID]: {
    lat: 21.0313,
    lon: 105.7883,
    address: 'Cầu Giấy, Hà Nội',
  },
  [STATION_LONG_BIEN_ID]: {
    lat: 21.0453,
    lon: 105.8725,
    address: 'Long Biên, Hà Nội',
  },
};

// AQI levels mapping (OpenWeather 1-5 scale)
const AQI_LEVELS = ['Good', 'Fair', 'Moderate', 'Poor', 'Very Poor'];

// US AQI breakpoints and levels
const US_AQI_LEVELS = [
  { max: 50, level: 'Good' },
  { max: 100, level: 'Moderate' },
  { max: 150, level: 'Unhealthy for Sensitive Groups' },
  { max: 200, level: 'Unhealthy' },
  { max: 300, level: 'Very Unhealthy' },
  { max: 500, level: 'Hazardous' },
];

/**
 * Generate random number within range
 */
function randomInRange(min: number, max: number): number {
  return Math.round((Math.random() * (max - min) + min) * 100) / 100;
}

/**
 * Calculate US AQI from PM2.5 (simplified)
 */
function calculateUSAQI(pm25: number): { aqi: number; level: string } {
  // Simplified US AQI calculation based on PM2.5
  let aqi: number;
  if (pm25 <= 12) {
    aqi = Math.round((50 / 12) * pm25);
  } else if (pm25 <= 35.4) {
    aqi = Math.round(50 + ((100 - 50) / (35.4 - 12)) * (pm25 - 12));
  } else if (pm25 <= 55.4) {
    aqi = Math.round(100 + ((150 - 100) / (55.4 - 35.4)) * (pm25 - 35.4));
  } else if (pm25 <= 150.4) {
    aqi = Math.round(150 + ((200 - 150) / (150.4 - 55.4)) * (pm25 - 55.4));
  } else if (pm25 <= 250.4) {
    aqi = Math.round(200 + ((300 - 200) / (250.4 - 150.4)) * (pm25 - 150.4));
  } else {
    aqi = Math.round(300 + ((500 - 300) / (500.4 - 250.4)) * (pm25 - 250.4));
  }

  const level = US_AQI_LEVELS.find((l) => aqi <= l.max)?.level || 'Hazardous';
  return { aqi: Math.min(aqi, 500), level };
}

/**
 * Generate air quality data for a specific station and time
 */
function generateAirQualityRecord(
  stationId: string,
  dateObserved: Date,
  pollutionLevel: 'low' | 'medium' | 'high',
): AirQualitySeedData {
  const location = STATION_LOCATIONS[stationId];
  const hour = dateObserved.getHours();

  // Pollution varies by hour (higher during rush hours)
  const rushHourFactor = [7, 8, 9, 17, 18, 19].includes(hour) ? 1.5 : 1;

  // Base pollution levels
  const basePM25: Record<string, number> = {
    low: 15,
    medium: 45,
    high: 120,
  };

  const pm25 = Math.round(
    basePM25[pollutionLevel] * rushHourFactor * randomInRange(0.8, 1.2),
  );
  const pm10 = Math.round(pm25 * randomInRange(1.3, 1.8));

  // OpenWeather AQI (1-5)
  let owAqi: number;
  if (pm25 <= 10) owAqi = 1;
  else if (pm25 <= 25) owAqi = 2;
  else if (pm25 <= 50) owAqi = 3;
  else if (pm25 <= 75) owAqi = 4;
  else owAqi = 5;

  const usAqi = calculateUSAQI(pm25);

  return {
    entityId: `urn:ngsi-ld:AirQualityObserved:${stationId.split(':').pop()}-${dateObserved.getTime()}`,
    entityType: 'AirQualityObserved',
    recvTime: dateObserved,
    locationId: stationId,
    location: {
      type: 'Point',
      coordinates: [location.lon, location.lat],
    },
    address: location.address,
    dateObserved,
    co: randomInRange(200, 800) * rushHourFactor,
    no: randomInRange(0.5, 20) * rushHourFactor,
    no2: randomInRange(10, 60) * rushHourFactor,
    o3: randomInRange(20, 80),
    so2: randomInRange(2, 15),
    pm25,
    pm10,
    nh3: randomInRange(1, 10),
    airQualityIndex: owAqi,
    airQualityLevel: AQI_LEVELS[owAqi - 1],
    airQualityIndexUS: usAqi.aqi,
    airQualityLevelUS: usAqi.level,
    rawEntity: {
      id: `urn:ngsi-ld:AirQualityObserved:${stationId.split(':').pop()}-${dateObserved.getTime()}`,
      type: 'AirQualityObserved',
      '@context': 'https://smartdatamodels.org/context.jsonld',
    },
  };
}

/**
 * Generate air quality seed data for all stations
 * Creates data for the past 7 days, every 3 hours
 */
export function generateAirQualitySeedData(): AirQualitySeedData[] {
  const data: AirQualitySeedData[] = [];
  const stations = [
    STATION_HOAN_KIEM_ID,
    STATION_HA_DONG_ID,
    STATION_CAU_GIAY_ID,
    STATION_LONG_BIEN_ID,
  ];

  // Pollution levels vary by station
  const pollutionLevels: Record<string, 'low' | 'medium' | 'high'> = {
    [STATION_HOAN_KIEM_ID]: 'medium', // Urban center
    [STATION_HA_DONG_ID]: 'high', // Industrial area
    [STATION_CAU_GIAY_ID]: 'medium', // Business area
    [STATION_LONG_BIEN_ID]: 'low', // Riverside
  };

  const now = new Date();
  const daysToGenerate = 7;
  const hoursInterval = 3; // Every 3 hours

  for (const stationId of stations) {
    for (let day = daysToGenerate; day >= 0; day--) {
      for (let hour = 0; hour < 24; hour += hoursInterval) {
        const dateObserved = new Date(now);
        dateObserved.setDate(dateObserved.getDate() - day);
        dateObserved.setHours(hour, 0, 0, 0);

        data.push(
          generateAirQualityRecord(
            stationId,
            dateObserved,
            pollutionLevels[stationId],
          ),
        );
      }
    }
  }

  return data;
}
