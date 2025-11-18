import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import axios, { AxiosInstance } from 'axios';

/**
 * OpenWeatherMap API Provider
 * Fetches weather and air quality data from OpenWeatherMap API
 */
@Injectable()
export class OpenWeatherMapProvider {
  private readonly logger = new Logger(OpenWeatherMapProvider.name);
  private readonly httpClient: AxiosInstance;
  private readonly apiKey: string;
  private readonly baseUrl = 'https://api.openweathermap.org/data/2.5';

  constructor(private configService: ConfigService) {
    this.apiKey = this.configService.get<string>('OWM_API_KEY') || '';

    if (!this.apiKey) {
      this.logger.warn(
        'OWM_API_KEY is not configured. OpenWeatherMap provider will not work.',
      );
    }

    this.httpClient = axios.create({
      baseURL: this.baseUrl,
      timeout: 10000,
      headers: {
        'Content-Type': 'application/json',
      },
    });
  }

  /**
   * Fetch current air pollution data from OpenWeatherMap
   * API: GET http://api.openweathermap.org/data/2.5/air_pollution
   *
   * @param lat Latitude
   * @param lon Longitude
   * @returns Air pollution data
   */
  async getCurrentAirPollution(lat: number, lon: number): Promise<any> {
    try {
      this.logger.debug(
        `Fetching air pollution data for lat=${lat}, lon=${lon}`,
      );

      const response = await this.httpClient.get('/air_pollution', {
        params: {
          lat,
          lon,
          appid: this.apiKey,
        },
      });

      this.logger.debug(
        `Successfully fetched air pollution data for lat=${lat}, lon=${lon}`,
      );
      return response.data;
    } catch (error) {
      this.logger.error(
        `Failed to fetch air pollution data for lat=${lat}, lon=${lon}`,
        error.message,
      );
      throw error;
    }
  }

  /**
   * Fetch air pollution forecast (4 days hourly)
   * API: GET http://api.openweathermap.org/data/2.5/air_pollution/forecast
   *
   * @param lat Latitude
   * @param lon Longitude
   * @returns Air pollution forecast data
   */
  async getAirPollutionForecast(lat: number, lon: number): Promise<any> {
    try {
      this.logger.debug(
        `Fetching air pollution forecast for lat=${lat}, lon=${lon}`,
      );

      const response = await this.httpClient.get('/air_pollution/forecast', {
        params: {
          lat,
          lon,
          appid: this.apiKey,
        },
      });

      this.logger.debug(
        `Successfully fetched air pollution forecast for lat=${lat}, lon=${lon}`,
      );
      return response.data;
    } catch (error) {
      this.logger.error(
        `Failed to fetch air pollution forecast for lat=${lat}, lon=${lon}`,
        error.message,
      );
      throw error;
    }
  }

  /**
   * Fetch historical air pollution data
   * API: GET http://api.openweathermap.org/data/2.5/air_pollution/history
   *
   * @param lat Latitude
   * @param lon Longitude
   * @param start Unix timestamp (UTC) start time
   * @param end Unix timestamp (UTC) end time
   * @returns Historical air pollution data
   */
  async getHistoricalAirPollution(
    lat: number,
    lon: number,
    start: number,
    end: number,
  ): Promise<any> {
    try {
      this.logger.debug(
        `Fetching historical air pollution data for lat=${lat}, lon=${lon}, start=${start}, end=${end}`,
      );

      const response = await this.httpClient.get('/air_pollution/history', {
        params: {
          lat,
          lon,
          start,
          end,
          appid: this.apiKey,
        },
      });

      this.logger.debug(
        `Successfully fetched historical air pollution data for lat=${lat}, lon=${lon}`,
      );
      return response.data;
    } catch (error) {
      this.logger.error(
        `Failed to fetch historical air pollution data for lat=${lat}, lon=${lon}`,
        error.message,
      );
      throw error;
    }
  }

  /**
   * Fetch current weather data from OpenWeatherMap
   * API: GET https://api.openweathermap.org/data/2.5/weather
   *
   * @param lat Latitude
   * @param lon Longitude
   * @param units Units of measurement (standard, metric, imperial)
   * @param lang Language code
   * @returns Current weather data
   */
  async getCurrentWeather(
    lat: number,
    lon: number,
    units: 'standard' | 'metric' | 'imperial' = 'metric',
    lang: string = 'vi',
  ): Promise<any> {
    try {
      this.logger.debug(`Fetching current weather for lat=${lat}, lon=${lon}`);

      const response = await this.httpClient.get('/weather', {
        params: {
          lat,
          lon,
          appid: this.apiKey,
          units,
          lang,
        },
      });

      this.logger.debug(
        `Successfully fetched current weather for lat=${lat}, lon=${lon}`,
      );
      return response.data;
    } catch (error) {
      this.logger.error(
        `Failed to fetch current weather for lat=${lat}, lon=${lon}`,
        error.message,
      );
      throw error;
    }
  }

  /**
   * Validate if the provider is properly configured
   */
  isConfigured(): boolean {
    return !!this.apiKey;
  }
}
