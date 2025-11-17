/**
 * NGSI-LD Transformer Utilities
 * Converts data from external APIs to NGSI-LD format
 */

export interface NGSILDProperty {
  type: 'Property';
  value: any;
  observedAt?: string;
}

export interface NGSILDGeoProperty {
  type: 'GeoProperty';
  value: {
    type: 'Point';
    coordinates: [number, number]; // [longitude, latitude]
  };
}

export interface NGSILDRelationship {
  type: 'Relationship';
  object: string;
}

/**
 * Create an NGSI-LD Property
 * @param value Property value
 * @param observedAt Observation timestamp (ISO string)
 * @returns NGSI-LD Property object
 */
export function createProperty(
  value: any,
  observedAt?: string,
): NGSILDProperty {
  const property: NGSILDProperty = {
    type: 'Property',
    value,
  };

  if (observedAt) {
    property.observedAt = observedAt;
  }

  return property;
}

/**
 * Create an NGSI-LD GeoProperty for location
 * @param longitude Longitude coordinate
 * @param latitude Latitude coordinate
 * @returns NGSI-LD GeoProperty object
 */
export function createGeoProperty(
  longitude: number,
  latitude: number,
): NGSILDGeoProperty {
  return {
    type: 'GeoProperty',
    value: {
      type: 'Point',
      coordinates: [longitude, latitude],
    },
  };
}

/**
 * Create an NGSI-LD Relationship
 * @param objectId ID of the related entity
 * @returns NGSI-LD Relationship object
 */
export function createRelationship(objectId: string): NGSILDRelationship {
  return {
    type: 'Relationship',
    object: objectId,
  };
}

/**
 * Create an NGSI-LD Address property
 * @param addressLocality City name
 * @param addressCountry Country name
 * @param streetAddress Street address (optional)
 * @returns NGSI-LD Property with address structure
 */
export function createAddressProperty(
  addressLocality?: string,
  addressCountry?: string,
  streetAddress?: string,
): NGSILDProperty {
  return createProperty({
    addressLocality,
    addressCountry,
    streetAddress,
  });
}

/**
 * Generate a unique entity ID for NGSI-LD
 * @param entityType Entity type (e.g., 'AirQualityObserved')
 * @param identifier Unique identifier (e.g., city name, station ID)
 * @returns URN-formatted entity ID
 */
export function generateEntityId(
  entityType: string,
  identifier: string,
): string {
  // Clean identifier (remove special characters, spaces)
  const cleanId = identifier.replace(/[^a-zA-Z0-9-_]/g, '-');
  return `urn:ngsi-ld:${entityType}:${cleanId}`;
}

/**
 * Get current timestamp in ISO 8601 format for NGSI-LD
 * @returns ISO timestamp string
 */
export function getCurrentTimestamp(): string {
  return new Date().toISOString();
}

/**
 * Transform OpenWeather Air Pollution data to NGSI-LD AirQualityObserved entity
 * @param owmAirData Raw data from OpenWeather Air Pollution API
 * @param cityName City name for entity identification
 * @returns NGSI-LD AirQualityObserved entity
 */
export function transformOWMAirPollutionToNGSILD(
  owmAirData: any,
  cityName: string,
): any {
  if (!owmAirData.list || owmAirData.list.length === 0) {
    throw new Error('No air pollution data available');
  }

  // Get the first measurement (current data)
  const measurement = owmAirData.list[0];
  const components = measurement.components;

  const entityId = generateEntityId(
    'AirQualityObserved',
    `${cityName}-${owmAirData.coord.lat}-${owmAirData.coord.lon}`,
  );

  const observedAt = measurement.dt
    ? new Date(measurement.dt * 1000).toISOString()
    : getCurrentTimestamp();

  const entity: any = {
    id: entityId,
    type: 'AirQualityObserved',
    '@context': [
      'https://uri.etsi.org/ngsi-ld/v1/ngsi-ld-core-context.jsonld',
      'https://raw.githubusercontent.com/smart-data-models/dataModel.Environment/master/context.jsonld',
    ],
    dateObserved: createProperty(observedAt, observedAt),
    source: createProperty('OpenWeatherMap'),
  };

  // Add location
  if (
    owmAirData.coord?.lat !== undefined &&
    owmAirData.coord?.lon !== undefined
  ) {
    entity.location = createGeoProperty(
      owmAirData.coord.lon,
      owmAirData.coord.lat,
    );
  }

  // Add address information
  if (cityName) {
    entity.address = createAddressProperty(cityName);
  }

  // Add pollutant measurements (all in μg/m³)
  if (components) {
    if (components.co !== undefined) {
      entity.co = createProperty(components.co, observedAt);
    }
    if (components.no !== undefined) {
      entity.no = createProperty(components.no, observedAt);
    }
    if (components.no2 !== undefined) {
      entity.no2 = createProperty(components.no2, observedAt);
    }
    if (components.o3 !== undefined) {
      entity.o3 = createProperty(components.o3, observedAt);
    }
    if (components.so2 !== undefined) {
      entity.so2 = createProperty(components.so2, observedAt);
    }
    if (components.pm2_5 !== undefined) {
      entity.pm25 = createProperty(components.pm2_5, observedAt);
    }
    if (components.pm10 !== undefined) {
      entity.pm10 = createProperty(components.pm10, observedAt);
    }
    if (components.nh3 !== undefined) {
      entity.nh3 = createProperty(components.nh3, observedAt);
    }
  }

  // Add OpenWeather AQI (1-5 scale)
  if (measurement.main?.aqi !== undefined) {
    entity.airQualityIndex = createProperty(measurement.main.aqi, observedAt);
    entity.airQualityLevel = createProperty(
      getOpenWeatherAQICategory(measurement.main.aqi),
      observedAt,
    );
  }

  // Calculate US EPA AQI if PM2.5 is available
  if (entity.pm25) {
    const usAqi = calculateAQI(entity.pm25.value);
    entity.aqi = createProperty(usAqi, observedAt);
    entity.aqiCategory = createProperty(getAQICategory(usAqi), observedAt);
  }

  return entity;
}

/**
 * Transform OpenWeatherMap data to NGSI-LD WeatherObserved entity
 * @param owmData Raw data from OpenWeatherMap API
 * @returns NGSI-LD WeatherObserved entity
 */
export function transformOWMToNGSILD(owmData: any): any {
  const entityId = generateEntityId(
    'WeatherObserved',
    `${owmData.name || 'unknown'}-${owmData.id || 'station'}`,
  );

  const observedAt = owmData.dt
    ? new Date(owmData.dt * 1000).toISOString()
    : getCurrentTimestamp();

  const entity: any = {
    id: entityId,
    type: 'WeatherObserved',
    '@context': [
      'https://uri.etsi.org/ngsi-ld/v1/ngsi-ld-core-context.jsonld',
      'https://raw.githubusercontent.com/smart-data-models/dataModel.Weather/master/context.jsonld',
    ],
    dateObserved: createProperty(observedAt, observedAt),
    source: createProperty('OpenWeatherMap'),
  };

  // Add location
  if (owmData.coord?.lon !== undefined && owmData.coord?.lat !== undefined) {
    entity.location = createGeoProperty(owmData.coord.lon, owmData.coord.lat);
  }

  // Add address information
  if (owmData.name || owmData.sys?.country) {
    entity.address = createAddressProperty(owmData.name, owmData.sys?.country);
  }

  // Add weather measurements
  if (owmData.main) {
    if (owmData.main.temp !== undefined) {
      entity.temperature = createProperty(owmData.main.temp, observedAt);
    }
    if (owmData.main.feels_like !== undefined) {
      entity.feelsLikeTemperature = createProperty(
        owmData.main.feels_like,
        observedAt,
      );
    }
    if (owmData.main.humidity !== undefined) {
      entity.relativeHumidity = createProperty(
        owmData.main.humidity,
        observedAt,
      );
    }
    if (owmData.main.pressure !== undefined) {
      entity.atmosphericPressure = createProperty(
        owmData.main.pressure,
        observedAt,
      );
    }
  }

  // Add wind information
  if (owmData.wind) {
    if (owmData.wind.speed !== undefined) {
      entity.windSpeed = createProperty(owmData.wind.speed, observedAt);
    }
    if (owmData.wind.deg !== undefined) {
      entity.windDirection = createProperty(owmData.wind.deg, observedAt);
    }
  }

  // Add precipitation (rain/snow)
  if (owmData.rain?.['1h'] !== undefined) {
    entity.precipitation = createProperty(owmData.rain['1h'], observedAt);
  } else if (owmData.snow?.['1h'] !== undefined) {
    entity.precipitation = createProperty(owmData.snow['1h'], observedAt);
  }

  // Add weather condition
  if (owmData.weather && owmData.weather.length > 0) {
    const weather = owmData.weather[0];
    if (weather.main) {
      entity.weatherType = createProperty(weather.main, observedAt);
    }
    if (weather.description) {
      entity.weatherDescription = createProperty(
        weather.description,
        observedAt,
      );
    }
  }

  // Add visibility
  if (owmData.visibility !== undefined) {
    entity.visibility = createProperty(owmData.visibility, observedAt);
  }

  return entity;
}

/**
 * Calculate AQI from PM2.5 value (US EPA standard)
 * @param pm25 PM2.5 concentration in µg/m³
 * @returns AQI value
 */
function calculateAQI(pm25: number): number {
  const breakpoints = [
    { cLow: 0, cHigh: 12.0, iLow: 0, iHigh: 50 },
    { cLow: 12.1, cHigh: 35.4, iLow: 51, iHigh: 100 },
    { cLow: 35.5, cHigh: 55.4, iLow: 101, iHigh: 150 },
    { cLow: 55.5, cHigh: 150.4, iLow: 151, iHigh: 200 },
    { cLow: 150.5, cHigh: 250.4, iLow: 201, iHigh: 300 },
    { cLow: 250.5, cHigh: 500.4, iLow: 301, iHigh: 500 },
  ];

  for (const bp of breakpoints) {
    if (pm25 >= bp.cLow && pm25 <= bp.cHigh) {
      return Math.round(
        ((bp.iHigh - bp.iLow) / (bp.cHigh - bp.cLow)) * (pm25 - bp.cLow) +
          bp.iLow,
      );
    }
  }

  // If PM2.5 is beyond the scale
  return pm25 > 500.4 ? 500 : 0;
}

/**
 * Get AQI category from AQI value
 * @param aqi AQI value
 * @returns AQI category string
 */
function getAQICategory(aqi: number): string {
  if (aqi <= 50) return 'Good';
  if (aqi <= 100) return 'Moderate';
  if (aqi <= 150) return 'Unhealthy for Sensitive Groups';
  if (aqi <= 200) return 'Unhealthy';
  if (aqi <= 300) return 'Very Unhealthy';
  return 'Hazardous';
}

/**
 * Get OpenWeather AQI category (1-5 scale)
 * @param aqi OpenWeather AQI value (1-5)
 * @returns AQI category string
 */
function getOpenWeatherAQICategory(aqi: number): string {
  switch (aqi) {
    case 1:
      return 'Good';
    case 2:
      return 'Fair';
    case 3:
      return 'Moderate';
    case 4:
      return 'Poor';
    case 5:
      return 'Very Poor';
    default:
      return 'Unknown';
  }
}
