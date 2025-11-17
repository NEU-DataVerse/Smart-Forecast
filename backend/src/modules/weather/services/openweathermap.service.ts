import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { HttpService } from '@nestjs/axios';
import { firstValueFrom } from 'rxjs';
import { transformOWMToNGSILD } from '../../../common/transformers/ngsi-ld.transformer';
import { OrionService } from '../../airquality/services/orion.service';

/**
 * Service for fetching weather data from OpenWeatherMap API
 */
@Injectable()
export class OpenWeatherMapService {
  private readonly logger = new Logger(OpenWeatherMapService.name);
  private readonly apiBaseUrl = 'https://api.openweathermap.org/data/2.5';
  private readonly apiKey: string;

  // Default cities to monitor (with coordinates)
  private readonly defaultCities = [
    { name: 'Ho Chi Minh City', lat: 10.8231, lon: 106.6297 },
    { name: 'Hanoi', lat: 21.0285, lon: 105.8542 },
    { name: 'Da Nang', lat: 16.0544, lon: 108.2022 },
    { name: 'Can Tho', lat: 10.0452, lon: 105.7469 },
    { name: 'Hai Phong', lat: 20.8449, lon: 106.6881 },
  ];

  constructor(
    private readonly httpService: HttpService,
    private readonly configService: ConfigService,
    private readonly orionService: OrionService,
  ) {
    this.apiKey = this.configService.get<string>('OWM_API_KEY') || '';
    if (!this.apiKey) {
      this.logger.warn(
        'OWM_API_KEY not configured. Weather data fetching will fail.',
      );
    }
  }

  /**
   * Fetch current weather data for a specific location
   * @param lat Latitude
   * @param lon Longitude
   * @returns Raw OpenWeatherMap API response
   */
  async fetchCurrentWeather(lat: number, lon: number): Promise<any> {
    try {
      const url = `${this.apiBaseUrl}/weather`;
      const params = {
        lat: lat.toString(),
        lon: lon.toString(),
        appid: this.apiKey,
        units: 'metric', // Celsius
      };

      const response = await firstValueFrom(
        this.httpService.get(url, { params }),
      );

      return response.data;
    } catch (error) {
      this.logger.error(
        `Failed to fetch weather data for location (${lat}, ${lon}): ${error.message}`,
        error.stack,
      );
      throw error;
    }
  }

  /**
   * Fetch current weather data by city name
   * @param cityName City name
   * @returns Raw OpenWeatherMap API response
   */
  async fetchCurrentWeatherByCity(cityName: string): Promise<any> {
    try {
      const url = `${this.apiBaseUrl}/weather`;
      const params = {
        q: cityName,
        appid: this.apiKey,
        units: 'metric', // Celsius
      };

      const response = await firstValueFrom(
        this.httpService.get(url, { params }),
      );

      return response.data;
    } catch (error) {
      this.logger.error(
        `Failed to fetch weather data for ${cityName}: ${error.message}`,
        error.stack,
      );
      throw error;
    }
  }

  /**
   * Ingest weather data from OpenWeatherMap and push to Orion-LD
   * @param cities Array of city objects with coordinates (optional)
   */
  async ingestWeatherData(
    cities?: Array<{ name: string; lat: number; lon: number }>,
  ): Promise<void> {
    const citiesToMonitor = cities || this.defaultCities;

    this.logger.log(
      `Starting weather data ingestion for ${citiesToMonitor.length} cities`,
    );

    for (const city of citiesToMonitor) {
      try {
        this.logger.log(`Fetching weather data for ${city.name}...`);
        const weatherData = await this.fetchCurrentWeather(city.lat, city.lon);

        // Transform to NGSI-LD format
        const ngsiLDEntity = transformOWMToNGSILD(weatherData);

        // Push to Orion-LD
        await this.orionService.upsertEntity(ngsiLDEntity);

        this.logger.log(`Successfully pushed weather data for ${city.name}`);
      } catch (error) {
        this.logger.error(
          `Failed to ingest weather data for ${city.name}: ${error.message}`,
          error.stack,
        );
      }
    }

    this.logger.log('Weather data ingestion completed');
  }

  /**
   * Fetch weather forecast for a location
   * @param lat Latitude
   * @param lon Longitude
   * @param days Number of days (max 5 for free tier)
   * @returns Weather forecast data
   */
  async fetchWeatherForecast(lat: number, lon: number, days = 5): Promise<any> {
    try {
      const url = `${this.apiBaseUrl}/forecast`;
      const params = {
        lat: lat.toString(),
        lon: lon.toString(),
        appid: this.apiKey,
        units: 'metric',
        cnt: (days * 8).toString(), // 8 forecasts per day (3-hour intervals)
      };

      const response = await firstValueFrom(
        this.httpService.get(url, { params }),
      );

      return response.data;
    } catch (error) {
      this.logger.error(
        `Failed to fetch weather forecast for location (${lat}, ${lon}): ${error.message}`,
        error.stack,
      );
      throw error;
    }
  }

  /**
   * Fetch Air Quality Index from OpenWeatherMap
   * @param lat Latitude
   * @param lon Longitude
   * @returns Air quality data
   */
  async fetchAirPollution(lat: number, lon: number): Promise<any> {
    try {
      const url = `${this.apiBaseUrl}/air_pollution`;
      const params = {
        lat: lat.toString(),
        lon: lon.toString(),
        appid: this.apiKey,
      };

      const response = await firstValueFrom(
        this.httpService.get(url, { params }),
      );

      return response.data;
    } catch (error) {
      this.logger.error(
        `Failed to fetch air pollution data for location (${lat}, ${lon}): ${error.message}`,
        error.stack,
      );
      throw error;
    }
  }
}
