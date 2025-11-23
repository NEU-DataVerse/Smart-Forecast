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
 * Remove Vietnamese diacritics and convert to ASCII
 * @param str String with Vietnamese characters
 * @returns String without diacritics
 */
function removeVietnameseDiacritics(str: string): string {
  const diacriticsMap: { [key: string]: string } = {
    // Lowercase
    à: 'a',
    á: 'a',
    ả: 'a',
    ã: 'a',
    ạ: 'a',
    ă: 'a',
    ằ: 'a',
    ắ: 'a',
    ẳ: 'a',
    ẵ: 'a',
    ặ: 'a',
    â: 'a',
    ầ: 'a',
    ấ: 'a',
    ẩ: 'a',
    ẫ: 'a',
    ậ: 'a',
    đ: 'd',
    è: 'e',
    é: 'e',
    ẻ: 'e',
    ẽ: 'e',
    ẹ: 'e',
    ê: 'e',
    ề: 'e',
    ế: 'e',
    ể: 'e',
    ễ: 'e',
    ệ: 'e',
    ì: 'i',
    í: 'i',
    ỉ: 'i',
    ĩ: 'i',
    ị: 'i',
    ò: 'o',
    ó: 'o',
    ỏ: 'o',
    õ: 'o',
    ọ: 'o',
    ô: 'o',
    ồ: 'o',
    ố: 'o',
    ổ: 'o',
    ỗ: 'o',
    ộ: 'o',
    ơ: 'o',
    ờ: 'o',
    ớ: 'o',
    ở: 'o',
    ỡ: 'o',
    ợ: 'o',
    ù: 'u',
    ú: 'u',
    ủ: 'u',
    ũ: 'u',
    ụ: 'u',
    ư: 'u',
    ừ: 'u',
    ứ: 'u',
    ử: 'u',
    ữ: 'u',
    ự: 'u',
    ỳ: 'y',
    ý: 'y',
    ỷ: 'y',
    ỹ: 'y',
    ỵ: 'y',
    // Uppercase
    À: 'A',
    Á: 'A',
    Ả: 'A',
    Ã: 'A',
    Ạ: 'A',
    Ă: 'A',
    Ằ: 'A',
    Ắ: 'A',
    Ẳ: 'A',
    Ẵ: 'A',
    Ặ: 'A',
    Â: 'A',
    Ầ: 'A',
    Ấ: 'A',
    Ẩ: 'A',
    Ẫ: 'A',
    Ậ: 'A',
    Đ: 'D',
    È: 'E',
    É: 'E',
    Ẻ: 'E',
    Ẽ: 'E',
    Ẹ: 'E',
    Ê: 'E',
    Ề: 'E',
    Ế: 'E',
    Ể: 'E',
    Ễ: 'E',
    Ệ: 'E',
    Ì: 'I',
    Í: 'I',
    Ỉ: 'I',
    Ĩ: 'I',
    Ị: 'I',
    Ò: 'O',
    Ó: 'O',
    Ỏ: 'O',
    Õ: 'O',
    Ọ: 'O',
    Ô: 'O',
    Ồ: 'O',
    Ố: 'O',
    Ổ: 'O',
    Ỗ: 'O',
    Ộ: 'O',
    Ơ: 'O',
    Ờ: 'O',
    Ớ: 'O',
    Ở: 'O',
    Ỡ: 'O',
    Ợ: 'O',
    Ù: 'U',
    Ú: 'U',
    Ủ: 'U',
    Ũ: 'U',
    Ụ: 'U',
    Ư: 'U',
    Ừ: 'U',
    Ứ: 'U',
    Ử: 'U',
    Ữ: 'U',
    Ự: 'U',
    Ỳ: 'Y',
    Ý: 'Y',
    Ỷ: 'Y',
    Ỹ: 'Y',
    Ỵ: 'Y',
  };

  return str
    .split('')
    .map((char) => diacriticsMap[char] || char)
    .join('');
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
  // Remove Vietnamese diacritics first
  const withoutDiacritics = removeVietnameseDiacritics(identifier);
  // Clean identifier (remove special characters, spaces, replace with hyphens)
  const cleanId = withoutDiacritics
    .replace(/[^a-zA-Z0-9-_]/g, '-')
    .replace(/-+/g, '-') // Replace multiple hyphens with single hyphen
    .replace(/^-|-$/g, ''); // Remove leading/trailing hyphens
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
 * @param stationCode Station code from WeatherStation entity
 * @param stationId Station ID for relationship (URN format)
 * @param cityName City name for entity identification
 * @param districtName District name (optional)
 * @returns NGSI-LD AirQualityObserved entity
 */
export function transformOWMAirPollutionToNGSILD(
  owmAirData: any,
  stationCode: string,
  stationId: string,
  cityName: string,
  districtName?: string,
): any {
  if (!owmAirData.list || owmAirData.list.length === 0) {
    throw new Error('No air pollution data available in response');
  }

  // Get the first measurement (current data)
  const measurement = owmAirData.list[0];
  const components = measurement.components;

  // Generate entity ID using station code
  const entityId = generateEntityId('AirQualityObserved', stationCode);

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
    locationId: createRelationship(stationId),
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
    entity.address = createAddressProperty(districtName || cityName, 'VN');
  }

  // Add pollutant measurements (all in μg/m³)
  if (components) {
    // Carbon monoxide (CO)
    if (components.co !== undefined) {
      entity.co = createProperty(components.co, observedAt);
    }

    // Nitrogen monoxide (NO)
    if (components.no !== undefined) {
      entity.no = createProperty(components.no, observedAt);
    }

    // Nitrogen dioxide (NO2)
    if (components.no2 !== undefined) {
      entity.no2 = createProperty(components.no2, observedAt);
    }

    // Ozone (O3)
    if (components.o3 !== undefined) {
      entity.o3 = createProperty(components.o3, observedAt);
    }

    // Sulphur dioxide (SO2)
    if (components.so2 !== undefined) {
      entity.so2 = createProperty(components.so2, observedAt);
    }

    // Fine particulate matter (PM2.5)
    if (components.pm2_5 !== undefined) {
      entity.pm25 = createProperty(components.pm2_5, observedAt);
    }

    // Coarse particulate matter (PM10)
    if (components.pm10 !== undefined) {
      entity.pm10 = createProperty(components.pm10, observedAt);
    }

    // Ammonia (NH3)
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
  if (components?.pm2_5 !== undefined) {
    const usAQI = calculateAQI(components.pm2_5);
    entity.airQualityIndexUS = createProperty(usAQI, observedAt);
    entity.airQualityLevelUS = createProperty(
      getAQICategory(usAQI),
      observedAt,
    );
  }

  return entity;
}

/**
 * Transform OpenWeatherMap data to NGSI-LD WeatherObserved entity
 * @param owmData Raw data from OpenWeatherMap current weather API
 * @param stationCode Station code from WeatherStation entity
 * @param stationId Station ID for relationship (URN format)
 * @param cityName City name for entity identification (optional, will use owmData.name if not provided)
 * @param districtName District name (optional)
 * @returns NGSI-LD WeatherObserved entity
 */
export function transformOWMToNGSILD(
  owmData: any,
  stationCode: string,
  stationId: string,
  cityName?: string,
  districtName?: string,
): any {
  if (!owmData || !owmData.coord) {
    throw new Error('Invalid weather data: missing coordinates');
  }

  const locationName = cityName || owmData.name || 'Unknown';
  // Generate entity ID using station code
  const entityId = generateEntityId('WeatherObserved', stationCode);

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
    locationId: createRelationship(stationId),
  };

  // Add location (GeoProperty)
  if (owmData.coord?.lat !== undefined && owmData.coord?.lon !== undefined) {
    entity.location = createGeoProperty(owmData.coord.lon, owmData.coord.lat);
  }

  // Add address information
  const addressLocality = districtName || locationName;
  const addressCountry = owmData.sys?.country || 'VN';
  entity.address = createAddressProperty(addressLocality, addressCountry);

  // Temperature (convert from Kelvin to Celsius if units=standard)
  // OWM returns Celsius when units=metric is specified
  if (owmData.main?.temp !== undefined) {
    entity.temperature = createProperty(owmData.main.temp, observedAt);
  }

  // Feels like temperature
  if (owmData.main?.feels_like !== undefined) {
    entity.feelsLikeTemperature = createProperty(
      owmData.main.feels_like,
      observedAt,
    );
  }

  // Min/Max temperature (current observation range)
  if (owmData.main?.temp_min !== undefined) {
    entity.temperatureMin = createProperty(owmData.main.temp_min, observedAt);
  }
  if (owmData.main?.temp_max !== undefined) {
    entity.temperatureMax = createProperty(owmData.main.temp_max, observedAt);
  }

  // Atmospheric pressure (hPa)
  if (owmData.main?.pressure !== undefined) {
    entity.atmosphericPressure = createProperty(
      owmData.main.pressure,
      observedAt,
    );
  }

  // Sea level and ground level pressure
  if (owmData.main?.sea_level !== undefined) {
    entity.pressureSeaLevel = createProperty(
      owmData.main.sea_level,
      observedAt,
    );
  }
  if (owmData.main?.grnd_level !== undefined) {
    entity.pressureGroundLevel = createProperty(
      owmData.main.grnd_level,
      observedAt,
    );
  }

  // Relative humidity (convert from % to 0-1 range)
  if (owmData.main?.humidity !== undefined) {
    entity.relativeHumidity = createProperty(
      owmData.main.humidity / 100,
      observedAt,
    );
  }

  // Visibility (meters, max 10km)
  if (owmData.visibility !== undefined) {
    entity.visibility = createProperty(owmData.visibility, observedAt);
  }

  // Wind speed (m/s by default, mph if imperial)
  if (owmData.wind?.speed !== undefined) {
    entity.windSpeed = createProperty(owmData.wind.speed, observedAt);
  }

  // Wind direction (degrees)
  if (owmData.wind?.deg !== undefined) {
    entity.windDirection = createProperty(owmData.wind.deg, observedAt);
  }

  // Wind gust
  if (owmData.wind?.gust !== undefined) {
    entity.windGust = createProperty(owmData.wind.gust, observedAt);
  }

  // Cloudiness (%)
  if (owmData.clouds?.all !== undefined) {
    entity.cloudiness = createProperty(owmData.clouds.all, observedAt);
  }

  // Precipitation (rain)
  if (owmData.rain) {
    if (owmData.rain['1h'] !== undefined) {
      entity.precipitation = createProperty(owmData.rain['1h'], observedAt);
    } else if (owmData.rain['3h'] !== undefined) {
      // If only 3h available, use it
      entity.precipitation = createProperty(owmData.rain['3h'], observedAt);
    }
  }

  // Snow
  if (owmData.snow) {
    if (owmData.snow['1h'] !== undefined) {
      entity.snowHeight = createProperty(owmData.snow['1h'], observedAt);
    } else if (owmData.snow['3h'] !== undefined) {
      entity.snowHeight = createProperty(owmData.snow['3h'], observedAt);
    }
  }

  // Weather condition
  if (owmData.weather && owmData.weather.length > 0) {
    const weather = owmData.weather[0];

    // Main weather group (Rain, Snow, Clouds, etc.)
    if (weather.main) {
      entity.weatherType = createProperty(weather.main, observedAt);
    }

    // Detailed description
    if (weather.description) {
      entity.weatherDescription = createProperty(
        weather.description,
        observedAt,
      );
    }

    // Icon code for display
    if (weather.icon) {
      entity.weatherIconCode = createProperty(weather.icon, observedAt);
    }
  }

  // Sunrise and sunset (Unix timestamp -> ISO string)
  if (owmData.sys?.sunrise !== undefined) {
    entity.sunrise = createProperty(
      new Date(owmData.sys.sunrise * 1000).toISOString(),
      observedAt,
    );
  }
  if (owmData.sys?.sunset !== undefined) {
    entity.sunset = createProperty(
      new Date(owmData.sys.sunset * 1000).toISOString(),
      observedAt,
    );
  }

  // Timezone offset (seconds from UTC)
  if (owmData.timezone !== undefined) {
    entity.timezone = createProperty(owmData.timezone, observedAt);
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

/**
 * Transform OpenWeather Air Pollution Forecast to NGSI-LD AirQualityForecast entities
 * @param owmForecastData Raw forecast data from OpenWeather Air Pollution Forecast API
 * @param stationCode Station code from WeatherStation entity
 * @param stationId Station ID for relationship (URN format)
 * @param cityName City name for entity identification
 * @param districtName District name (optional)
 * @returns Array of NGSI-LD AirQualityForecast entities
 */
export function transformOWMAirPollutionForecastToNGSILD(
  owmForecastData: any,
  stationCode: string,
  stationId: string,
  cityName: string,
  districtName?: string,
): any[] {
  if (!owmForecastData.list || owmForecastData.list.length === 0) {
    throw new Error('No air pollution forecast data available in response');
  }

  const entities: any[] = [];

  for (const forecast of owmForecastData.list) {
    const components = forecast.components;
    const forecastTime = new Date(forecast.dt * 1000).toISOString();

    // Generate entity ID using station code with timestamp
    const entityId = generateEntityId(
      'AirQualityForecast',
      `${stationCode}-${forecast.dt}`,
    );

    const entity: any = {
      id: entityId,
      type: 'AirQualityForecast',
      '@context': [
        'https://uri.etsi.org/ngsi-ld/v1/ngsi-ld-core-context.jsonld',
        'https://raw.githubusercontent.com/smart-data-models/dataModel.Environment/master/context.jsonld',
      ],
      dataProvider: createProperty('OpenWeatherMap'),
      validFrom: createProperty(forecastTime),
      validTo: createProperty(
        new Date(forecast.dt * 1000 + 3600000).toISOString(),
      ), // +1 hour
      locationId: createRelationship(stationId),
    };

    // Add location
    if (
      owmForecastData.coord?.lat !== undefined &&
      owmForecastData.coord?.lon !== undefined
    ) {
      entity.location = createGeoProperty(
        owmForecastData.coord.lon,
        owmForecastData.coord.lat,
      );
    }

    // Add address
    if (cityName) {
      entity.address = createAddressProperty(districtName || cityName, 'VN');
    }

    // Add pollutant forecasts
    if (components) {
      if (components.co !== undefined) {
        entity.co = createProperty(components.co);
      }
      if (components.no !== undefined) {
        entity.no = createProperty(components.no);
      }
      if (components.no2 !== undefined) {
        entity.no2 = createProperty(components.no2);
      }
      if (components.o3 !== undefined) {
        entity.o3 = createProperty(components.o3);
      }
      if (components.so2 !== undefined) {
        entity.so2 = createProperty(components.so2);
      }
      if (components.pm2_5 !== undefined) {
        entity.pm25 = createProperty(components.pm2_5);
      }
      if (components.pm10 !== undefined) {
        entity.pm10 = createProperty(components.pm10);
      }
      if (components.nh3 !== undefined) {
        entity.nh3 = createProperty(components.nh3);
      }
    }

    // Add AQI
    if (forecast.main?.aqi !== undefined) {
      entity.airQualityIndex = createProperty(forecast.main.aqi);
      entity.airQualityLevel = createProperty(
        getOpenWeatherAQICategory(forecast.main.aqi),
      );
    }

    // Calculate US EPA AQI if PM2.5 is available
    if (components?.pm2_5 !== undefined) {
      const usAQI = calculateAQI(components.pm2_5);
      entity.airQualityIndexUS = createProperty(usAQI);
      entity.airQualityLevelUS = createProperty(getAQICategory(usAQI));
    }

    entities.push(entity);
  }

  return entities;
}

/**
 * Transform OpenWeather Daily Forecast to NGSI-LD WeatherForecast entities
 * @param owmDailyData Raw data from OpenWeather Daily Forecast API
 * @param stationCode Station code from WeatherStation entity
 * @param stationId Station ID for relationship (URN format)
 * @param cityName City name for entity identification
 * @param districtName District name (optional)
 * @returns Array of NGSI-LD WeatherForecast entities
 */
export function transformOWMDailyForecastToNGSILD(
  owmDailyData: any,
  stationCode: string,
  stationId: string,
  cityName: string,
  districtName?: string,
): any[] {
  if (!owmDailyData.list || owmDailyData.list.length === 0) {
    throw new Error('No daily forecast data available in response');
  }

  const entities: any[] = [];
  const coord = owmDailyData.city?.coord || { lat: 0, lon: 0 };

  for (const dailyForecast of owmDailyData.list) {
    const forecastDate = new Date(dailyForecast.dt * 1000);
    const validFrom = new Date(forecastDate);
    validFrom.setHours(0, 0, 0, 0);
    const validTo = new Date(forecastDate);
    validTo.setHours(23, 59, 59, 999);

    // Generate entity ID using station code with timestamp
    const entityId = generateEntityId(
      'WeatherForecast',
      `${stationCode}-${dailyForecast.dt}`,
    );

    const entity: any = {
      id: entityId,
      type: 'WeatherForecast',
      '@context': [
        'https://uri.etsi.org/ngsi-ld/v1/ngsi-ld-core-context.jsonld',
        'https://raw.githubusercontent.com/smart-data-models/dataModel.Weather/master/context.jsonld',
      ],
      dataProvider: createProperty('OpenWeatherMap'),
      dateIssued: createProperty(getCurrentTimestamp()),
      validFrom: createProperty(validFrom.toISOString()),
      validTo: createProperty(validTo.toISOString()),
      locationId: createRelationship(stationId),
    };

    // Location
    if (coord.lat !== undefined && coord.lon !== undefined) {
      entity.location = createGeoProperty(coord.lon, coord.lat);
    }

    // Address
    if (cityName) {
      entity.address = createAddressProperty(districtName || cityName, 'VN');
    }

    // Temperature (day average)
    if (dailyForecast.temp?.day !== undefined) {
      entity.temperature = createProperty(dailyForecast.temp.day);
    }

    // Feels like temperature
    if (dailyForecast.feels_like?.day !== undefined) {
      entity.feelsLikeTemperature = createProperty(
        dailyForecast.feels_like.day,
      );
    }

    // Day maximum
    if (dailyForecast.temp?.max !== undefined) {
      entity.dayMaximum = createProperty({
        temperature: dailyForecast.temp.max,
        feelsLikeTemperature: dailyForecast.feels_like?.eve,
        relativeHumidity: dailyForecast.humidity
          ? dailyForecast.humidity / 100
          : undefined,
      });
    }

    // Day minimum
    if (dailyForecast.temp?.min !== undefined) {
      entity.dayMinimum = createProperty({
        temperature: dailyForecast.temp.min,
        feelsLikeTemperature: dailyForecast.feels_like?.morn,
        relativeHumidity: dailyForecast.humidity
          ? dailyForecast.humidity / 100
          : undefined,
      });
    }

    // Humidity
    if (dailyForecast.humidity !== undefined) {
      entity.relativeHumidity = createProperty(dailyForecast.humidity / 100);
    }

    // Pressure
    if (dailyForecast.pressure !== undefined) {
      entity.atmosphericPressure = createProperty(dailyForecast.pressure);
    }

    // Wind
    if (dailyForecast.speed !== undefined) {
      entity.windSpeed = createProperty(dailyForecast.speed);
    }
    if (dailyForecast.deg !== undefined) {
      entity.windDirection = createProperty(dailyForecast.deg);
    }
    if (dailyForecast.gust !== undefined) {
      entity.windGust = createProperty(dailyForecast.gust);
    }

    // Cloudiness
    if (dailyForecast.clouds !== undefined) {
      entity.cloudiness = createProperty(dailyForecast.clouds);
    }

    // Precipitation
    if (dailyForecast.rain !== undefined) {
      entity.precipitation = createProperty(dailyForecast.rain);
    }

    // Precipitation probability
    if (dailyForecast.pop !== undefined) {
      entity.precipitationProbability = createProperty(dailyForecast.pop);
    }

    // Weather condition
    if (dailyForecast.weather && dailyForecast.weather.length > 0) {
      const weather = dailyForecast.weather[0];
      if (weather.main) {
        entity.weatherType = createProperty(weather.main);
      }
      if (weather.description) {
        entity.weatherDescription = createProperty(weather.description);
      }
      if (weather.icon) {
        entity.weatherIcon = createProperty(weather.icon);
      }
    }

    // Sunrise and Sunset
    if (dailyForecast.sunrise !== undefined) {
      const sunriseDate = new Date(dailyForecast.sunrise * 1000);
      entity.sunrise = createProperty(sunriseDate.toISOString());
    }
    if (dailyForecast.sunset !== undefined) {
      const sunsetDate = new Date(dailyForecast.sunset * 1000);
      entity.sunset = createProperty(sunsetDate.toISOString());
    }

    entities.push(entity);
  }

  return entities;
}
