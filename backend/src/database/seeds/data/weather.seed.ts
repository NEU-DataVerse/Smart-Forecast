/**
 * Weather Observed Seed Data
 *
 * Generates sample weather observations for the past 7 days.
 * Creates hourly data points for each station.
 */

import {
  STATION_HOAN_KIEM_ID,
  STATION_HA_DONG_ID,
  STATION_CAU_GIAY_ID,
  STATION_LONG_BIEN_ID,
} from './stations.seed';

export interface WeatherSeedData {
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
  temperature: number;
  feelsLikeTemperature: number;
  relativeHumidity: number;
  atmosphericPressure: number;
  windSpeed: number;
  windDirection: number;
  precipitation: number;
  visibility: number;
  weatherType: string;
  weatherDescription: string;
  weatherIconCode: string;
  cloudiness: number;
  temperatureMin: number;
  temperatureMax: number;
  pressureSeaLevel: number;
  pressureGroundLevel: number;
  windGust: number | null;
  sunrise: Date;
  sunset: Date;
  timezone: number;
  rawEntity: any;
}

// Weather types for variation
const WEATHER_TYPES = ['Clear', 'Clouds', 'Rain', 'Drizzle', 'Mist'];
const WEATHER_DESCRIPTIONS: Record<string, string[]> = {
  Clear: ['clear sky', 'sunny'],
  Clouds: [
    'few clouds',
    'scattered clouds',
    'broken clouds',
    'overcast clouds',
  ],
  Rain: ['light rain', 'moderate rain', 'heavy rain'],
  Drizzle: ['light drizzle', 'drizzle'],
  Mist: ['mist', 'fog'],
};
const WEATHER_ICONS: Record<string, string> = {
  Clear: '01d',
  Clouds: '03d',
  Rain: '10d',
  Drizzle: '09d',
  Mist: '50d',
};

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

/**
 * Generate random number within range
 */
function randomInRange(min: number, max: number): number {
  return Math.round((Math.random() * (max - min) + min) * 10) / 10;
}

/**
 * Generate random weather type
 */
function getRandomWeather(): {
  type: string;
  description: string;
  icon: string;
} {
  const type = WEATHER_TYPES[Math.floor(Math.random() * WEATHER_TYPES.length)];
  const descriptions = WEATHER_DESCRIPTIONS[type];
  const description =
    descriptions[Math.floor(Math.random() * descriptions.length)];
  return {
    type,
    description,
    icon: WEATHER_ICONS[type],
  };
}

/**
 * Generate weather data for a specific station and time
 */
function generateWeatherRecord(
  stationId: string,
  dateObserved: Date,
  baseTemp: number,
): WeatherSeedData {
  const location = STATION_LOCATIONS[stationId];
  const weather = getRandomWeather();
  const hour = dateObserved.getHours();

  // Temperature varies by hour (cooler at night)
  const hourFactor = Math.sin(((hour - 6) * Math.PI) / 12) * 5;
  const temperature =
    Math.round((baseTemp + hourFactor + randomInRange(-2, 2)) * 10) / 10;

  // Sunrise/sunset times for Hanoi
  const sunrise = new Date(dateObserved);
  sunrise.setHours(5, 45, 0, 0);
  const sunset = new Date(dateObserved);
  sunset.setHours(17, 30, 0, 0);

  return {
    entityId: `urn:ngsi-ld:WeatherObserved:${stationId.split(':').pop()}-${dateObserved.getTime()}`,
    entityType: 'WeatherObserved',
    recvTime: dateObserved,
    locationId: stationId,
    location: {
      type: 'Point',
      coordinates: [location.lon, location.lat],
    },
    address: location.address,
    dateObserved,
    temperature,
    feelsLikeTemperature: temperature + randomInRange(-3, 3),
    relativeHumidity: randomInRange(60, 95),
    atmosphericPressure: randomInRange(1008, 1020),
    windSpeed: randomInRange(0, 8),
    windDirection: randomInRange(0, 360),
    precipitation: weather.type === 'Rain' ? randomInRange(0, 10) : 0,
    visibility:
      weather.type === 'Mist'
        ? Math.round(randomInRange(1000, 5000))
        : Math.round(randomInRange(8000, 10000)),
    weatherType: weather.type,
    weatherDescription: weather.description,
    weatherIconCode: weather.icon,
    cloudiness:
      weather.type === 'Clear'
        ? Math.round(randomInRange(0, 20))
        : Math.round(randomInRange(40, 100)),
    temperatureMin: temperature - randomInRange(2, 5),
    temperatureMax: temperature + randomInRange(2, 5),
    pressureSeaLevel: randomInRange(1010, 1018),
    pressureGroundLevel: randomInRange(1005, 1015),
    windGust: Math.random() > 0.7 ? randomInRange(5, 15) : null,
    sunrise,
    sunset,
    timezone: 25200,
    rawEntity: {
      id: `urn:ngsi-ld:WeatherObserved:${stationId.split(':').pop()}-${dateObserved.getTime()}`,
      type: 'WeatherObserved',
      '@context': 'https://smartdatamodels.org/context.jsonld',
    },
  };
}

/**
 * Generate weather seed data for all stations
 * Creates data for the past 7 days, every 3 hours
 */
export function generateWeatherSeedData(): WeatherSeedData[] {
  const data: WeatherSeedData[] = [];
  const stations = [
    STATION_HOAN_KIEM_ID,
    STATION_HA_DONG_ID,
    STATION_CAU_GIAY_ID,
    STATION_LONG_BIEN_ID,
  ];

  // Base temperatures for variety between stations
  const baseTemps: Record<string, number> = {
    [STATION_HOAN_KIEM_ID]: 25,
    [STATION_HA_DONG_ID]: 24,
    [STATION_CAU_GIAY_ID]: 25,
    [STATION_LONG_BIEN_ID]: 26,
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
          generateWeatherRecord(stationId, dateObserved, baseTemps[stationId]),
        );
      }
    }
  }

  return data;
}
