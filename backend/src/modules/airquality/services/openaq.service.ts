import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { HttpService } from '@nestjs/axios';
import { firstValueFrom } from 'rxjs';
import { transformOWMAirPollutionToNGSILD } from '../../../common/transformers/ngsi-ld.transformer';
import { OrionService } from './orion.service';

/**
 * Service for fetching air quality data from OpenWeatherMap Air Pollution API
 */
@Injectable()
export class AirPollutionService {
  private readonly logger = new Logger(AirPollutionService.name);
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
        'OWM_API_KEY not configured. Air pollution data fetching will fail.',
      );
    }
  }

  /**
   * Fetch current air pollution data for a specific location
   * @param lat Latitude
   * @param lon Longitude
   * @returns Raw OpenWeatherMap Air Pollution API response
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

  /**
   * Ingest air quality data from OpenWeatherMap and push to Orion-LD
   * @param cities Array of city objects with coordinates (optional, uses defaults if not provided)
   */
  async ingestAirQualityData(
    cities?: Array<{ name: string; lat: number; lon: number }>,
  ): Promise<void> {
    const citiesToMonitor = cities || this.defaultCities;

    this.logger.log(
      `Starting air quality data ingestion for ${citiesToMonitor.length} cities`,
    );

    for (const city of citiesToMonitor) {
      try {
        this.logger.log(`Fetching air quality data for ${city.name}...`);
        const airPollutionData = await this.fetchAirPollution(
          city.lat,
          city.lon,
        );

        // Transform to NGSI-LD format
        const ngsiLDEntity = transformOWMAirPollutionToNGSILD(
          airPollutionData,
          city.name,
        );

        // Push to Orion-LD
        await this.orionService.upsertEntity(ngsiLDEntity);

        this.logger.log(
          `Successfully pushed air quality data for ${city.name}`,
        );
      } catch (error) {
        this.logger.error(
          `Failed to ingest air quality data for ${city.name}: ${error.message}`,
          error.stack,
        );
      }
    }

    this.logger.log('Air quality data ingestion completed');
  }

  /**
   * Fetch air pollution forecast for a location (available for 5 days)
   * @param lat Latitude
   * @param lon Longitude
   * @returns Air pollution forecast data
   */
  async fetchAirPollutionForecast(lat: number, lon: number): Promise<any> {
    try {
      const url = `${this.apiBaseUrl}/air_pollution/forecast`;
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
        `Failed to fetch air pollution forecast for location (${lat}, ${lon}): ${error.message}`,
        error.stack,
      );
      throw error;
    }
  }

  /**
   * Fetch historical air pollution data (available from 2020-11-27)
   * @param lat Latitude
   * @param lon Longitude
   * @param start Unix timestamp (UTC)
   * @param end Unix timestamp (UTC)
   * @returns Historical air pollution data
   */
  async fetchAirPollutionHistory(
    lat: number,
    lon: number,
    start: number,
    end: number,
  ): Promise<any> {
    try {
      const url = `${this.apiBaseUrl}/air_pollution/history`;
      const params = {
        lat: lat.toString(),
        lon: lon.toString(),
        start: start.toString(),
        end: end.toString(),
        appid: this.apiKey,
      };

      const response = await firstValueFrom(
        this.httpService.get(url, { params }),
      );

      return response.data;
    } catch (error) {
      this.logger.error(
        `Failed to fetch air pollution history for location (${lat}, ${lon}): ${error.message}`,
        error.stack,
      );
      throw error;
    }
  }
}
