import {
  IAirQualityForecast,
  IAirQualityForecastResponse,
  IWeatherForecast,
  IWeatherForecastResponse,
  IStation,
} from '@smart-forecast/shared';

/**
 * OWM Response Transformer
 *
 * Utilities to transform NGSI-LD entities to OpenWeatherMap-compatible format
 */

/**
 * Extract value from NGSI-LD Property
 */
export function extractPropertyValue<T = any>(property: any): T | undefined {
  if (!property) return undefined;

  // Direct value
  if (property.value !== undefined) {
    return property.value;
  }

  // Already a plain value
  return property;
}

/**
 * Convert ISO 8601 timestamp to Unix timestamp (seconds)
 */
export function iso8601ToUnixTimestamp(isoString: string): number {
  return Math.floor(new Date(isoString).getTime() / 1000);
}

/**
 * Parse nested temperature object from NGSI-LD Property
 */
export function parseNestedTempObject(tempProperty: any): {
  day: number;
  min: number;
  max: number;
  night: number;
  eve: number;
  morn: number;
} | null {
  const tempObj = extractPropertyValue(tempProperty);
  if (!tempObj || typeof tempObj !== 'object') return null;

  return {
    day: tempObj.day || 0,
    min: tempObj.min || 0,
    max: tempObj.max || 0,
    night: tempObj.night || 0,
    eve: tempObj.eve || 0,
    morn: tempObj.morn || 0,
  };
}

/**
 * Parse nested feels-like object from NGSI-LD Property
 */
export function parseFeelsLikeObject(feelsLikeProperty: any): {
  day: number;
  night: number;
  eve: number;
  morn: number;
} | null {
  const feelsLikeObj = extractPropertyValue(feelsLikeProperty);
  if (!feelsLikeObj || typeof feelsLikeObj !== 'object') return null;

  return {
    day: feelsLikeObj.day || 0,
    night: feelsLikeObj.night || 0,
    eve: feelsLikeObj.eve || 0,
    morn: feelsLikeObj.morn || 0,
  };
}

/**
 * Parse weather array from NGSI-LD Property
 */
export function parseWeatherArray(weatherProperty: any): Array<{
  id: number;
  main: string;
  description: string;
  icon: string;
}> {
  const weatherData = extractPropertyValue(weatherProperty);

  if (Array.isArray(weatherData)) {
    return weatherData;
  }

  // Fallback: create single weather object from individual properties
  return [
    {
      id: 0,
      main: 'Unknown',
      description: 'Unknown',
      icon: '01d',
    },
  ];
}

/**
 * Transform NGSI-LD AirQualityForecast entities to OWM format
 */
export function transformNGSILDAirQualityForecastToOWM(
  entities: any[],
  station: IStation,
): IAirQualityForecastResponse {
  const list = entities
    .map((entity) => {
      try {
        // Extract timestamp
        const validFrom = extractPropertyValue(entity.validFrom);
        if (!validFrom) return null;

        const dt = iso8601ToUnixTimestamp(validFrom);

        // Extract AQI
        const aqi = extractPropertyValue<number>(entity.airQualityIndex) || 1;

        // Extract pollutant components (only include if present)
        const components: IAirQualityForecast['components'] = {};
        const co = extractPropertyValue<number>(entity.co);
        const no = extractPropertyValue<number>(entity.no);
        const no2 = extractPropertyValue<number>(entity.no2);
        const o3 = extractPropertyValue<number>(entity.o3);
        const so2 = extractPropertyValue<number>(entity.so2);
        const pm2_5 = extractPropertyValue<number>(entity.pm25);
        const pm10 = extractPropertyValue<number>(entity.pm10);
        const nh3 = extractPropertyValue<number>(entity.nh3);

        if (co !== undefined) components.co = co;
        if (no !== undefined) components.no = no;
        if (no2 !== undefined) components.no2 = no2;
        if (o3 !== undefined) components.o3 = o3;
        if (so2 !== undefined) components.so2 = so2;
        if (pm2_5 !== undefined) components.pm2_5 = pm2_5;
        if (pm10 !== undefined) components.pm10 = pm10;
        if (nh3 !== undefined) components.nh3 = nh3;

        const forecast: IAirQualityForecast = {
          dt,
          main: { aqi },
          components,
        };

        return forecast;
      } catch (error) {
        console.error('Error transforming air quality forecast entity:', error);
        return null;
      }
    })
    .filter((item): item is IAirQualityForecast => item !== null)
    .sort((a, b) => a.dt - b.dt); // Sort by timestamp ascending

  return {
    coord: {
      lat: station.location.lat,
      lon: station.location.lon,
    },
    list,
  };
}

/**
 * Transform NGSI-LD WeatherForecast entities to OWM format
 */
export function transformNGSILDWeatherForecastToOWM(
  entities: any[],
  station: IStation,
): IWeatherForecastResponse {
  const list: IWeatherForecast[] = entities
    .map((entity) => {
      try {
        // Extract timestamp
        const validFrom = extractPropertyValue(entity.validFrom);
        if (!validFrom) return null;

        const dt = iso8601ToUnixTimestamp(validFrom);

        // Parse temperature object
        const temp = parseNestedTempObject(entity.temp) || {
          day: extractPropertyValue<number>(entity.temperature) || 0,
          min: extractPropertyValue<number>(entity.temperature) || 0,
          max: extractPropertyValue<number>(entity.temperature) || 0,
          night: extractPropertyValue<number>(entity.temperature) || 0,
          eve: extractPropertyValue<number>(entity.temperature) || 0,
          morn: extractPropertyValue<number>(entity.temperature) || 0,
        };

        // Parse feels-like object
        const feels_like = parseFeelsLikeObject(entity.feels_like) || {
          day: extractPropertyValue<number>(entity.feelsLikeTemperature) || 0,
          night: extractPropertyValue<number>(entity.feelsLikeTemperature) || 0,
          eve: extractPropertyValue<number>(entity.feelsLikeTemperature) || 0,
          morn: extractPropertyValue<number>(entity.feelsLikeTemperature) || 0,
        };

        // Extract weather conditions
        const pressure =
          extractPropertyValue<number>(entity.atmosphericPressure) || 1013;
        const humidity =
          extractPropertyValue<number>(entity.relativeHumidity) || 0;

        // Parse weather array
        const weather = parseWeatherArray(entity.weather);

        // Extract wind data
        const speed = extractPropertyValue<number>(entity.windSpeed) || 0;
        const deg = extractPropertyValue<number>(entity.windDirection) || 0;
        const gust = extractPropertyValue<number>(entity.windGust);

        // Extract cloud and precipitation data
        const clouds = extractPropertyValue<number>(entity.cloudiness) || 0;
        const pop =
          extractPropertyValue<number>(entity.precipitationProbability) || 0;
        const rain = extractPropertyValue<number>(entity.precipitation);
        const snow = extractPropertyValue<number>(entity.snow);

        return {
          dt,
          temp,
          feels_like,
          pressure,
          humidity,
          weather,
          speed,
          deg,
          ...(gust !== undefined && { gust }),
          clouds,
          pop,
          ...(rain !== undefined && { rain }),
          ...(snow !== undefined && { snow }),
        };
      } catch (error) {
        console.error('Error transforming weather forecast entity:', error);
        return null;
      }
    })
    .filter((item): item is IWeatherForecast => item !== null)
    .sort((a, b) => a.dt - b.dt); // Sort by timestamp ascending

  return {
    city: {
      coord: {
        lat: station.location.lat,
        lon: station.location.lon,
      },
      name: station.city,
      country: station.address.addressCountry,
      timezone: station.timezone,
    },
    list,
  };
}
