import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { HttpService } from '@nestjs/axios';
import { firstValueFrom } from 'rxjs';
import { transformOpenAQToNGSILD } from '../../common/transformers/ngsi-ld.transformer';
import { OrionService } from './orion.service';

/**
 * Service for fetching air quality data from OpenAQ API
 */
@Injectable()
export class OpenAQService {
  private readonly logger = new Logger(OpenAQService.name);
  private readonly apiBaseUrl = 'https://api.openaq.org/v3';
  private readonly apiKey: string;

  // Default cities to monitor
  private readonly defaultCities = [
    'Ho Chi Minh City',
    'Hanoi',
    'Da Nang',
    'Can Tho',
    'Hai Phong',
  ];

  constructor(
    private readonly httpService: HttpService,
    private readonly configService: ConfigService,
    private readonly orionService: OrionService,
  ) {
    this.apiKey = this.configService.get<string>('OPENAQ_API_KEY') || '';
    if (!this.apiKey) {
      this.logger.warn(
        'OPENAQ_API_KEY not configured. API calls may be rate-limited.',
      );
    }
  }

  /**
   * Fetch latest air quality measurements for a specific city
   * @param city City name
   * @returns Raw OpenAQ API response
   */
  async fetchLatestMeasurements(city: string): Promise<any[]> {
    try {
      const url = `${this.apiBaseUrl}/latest`;
      const headers: any = {
        'Content-Type': 'application/json',
      };

      if (this.apiKey) {
        headers['X-API-Key'] = this.apiKey;
      }

      const params = {
        city,
        limit: 100,
        sort: 'desc',
        order_by: 'lastUpdated',
      };

      const response = await firstValueFrom(
        this.httpService.get(url, { headers, params }),
      );

      return response.data.results || [];
    } catch (error) {
      this.logger.error(
        `Failed to fetch OpenAQ data for ${city}: ${error.message}`,
        error.stack,
      );
      throw error;
    }
  }

  /**
   * Ingest air quality data from OpenAQ and push to Orion-LD
   * @param cities Array of city names (optional, uses defaults if not provided)
   */
  async ingestAirQualityData(cities?: string[]): Promise<void> {
    const citiesToMonitor = cities || this.defaultCities;

    this.logger.log(
      `Starting air quality data ingestion for ${citiesToMonitor.length} cities`,
    );

    for (const city of citiesToMonitor) {
      try {
        this.logger.log(`Fetching air quality data for ${city}...`);
        const measurements = await this.fetchLatestMeasurements(city);

        if (measurements.length === 0) {
          this.logger.warn(`No measurements found for ${city}`);
          continue;
        }

        // Group measurements by location
        const locationMap = new Map<string, any>();

        measurements.forEach((measurement) => {
          const locationKey = measurement.location || 'unknown';
          if (!locationMap.has(locationKey)) {
            locationMap.set(locationKey, {
              city: measurement.city,
              location: measurement.location,
              country: measurement.country,
              coordinates: measurement.coordinates,
              date: measurement.date,
              measurements: [],
            });
          }
          locationMap.get(locationKey)!.measurements.push(measurement);
        });

        // Transform and push each location's data to Orion-LD
        for (const [location, data] of locationMap) {
          try {
            const ngsiLDEntity = transformOpenAQToNGSILD(data);
            await this.orionService.upsertEntity(ngsiLDEntity);
            this.logger.log(
              `Successfully pushed air quality data for ${city} - ${location}`,
            );
          } catch (error) {
            this.logger.error(
              `Failed to push data for ${city} - ${location}: ${error.message}`,
            );
          }
        }
      } catch (error) {
        this.logger.error(
          `Failed to ingest air quality data for ${city}: ${error.message}`,
          error.stack,
        );
      }
    }

    this.logger.log('Air quality data ingestion completed');
  }

  /**
   * Fetch air quality data for a specific location
   * @param locationId OpenAQ location ID
   * @returns Air quality measurements
   */
  async fetchLocationData(locationId: number): Promise<any> {
    try {
      const url = `${this.apiBaseUrl}/locations/${locationId}`;
      const headers: any = {
        'Content-Type': 'application/json',
      };

      if (this.apiKey) {
        headers['X-API-Key'] = this.apiKey;
      }

      const response = await firstValueFrom(
        this.httpService.get(url, { headers }),
      );

      return response.data.results?.[0];
    } catch (error) {
      this.logger.error(
        `Failed to fetch location data for ${locationId}: ${error.message}`,
        error.stack,
      );
      throw error;
    }
  }

  /**
   * Get list of available cities from OpenAQ
   * @returns Array of city names
   */
  async getAvailableCities(): Promise<string[]> {
    try {
      const url = `${this.apiBaseUrl}/cities`;
      const headers: any = {
        'Content-Type': 'application/json',
      };

      if (this.apiKey) {
        headers['X-API-Key'] = this.apiKey;
      }

      const params = {
        limit: 100,
        country: 'VN', // Vietnam
      };

      const response = await firstValueFrom(
        this.httpService.get(url, { headers, params }),
      );

      return response.data.results?.map((city: any) => city.city) || [];
    } catch (error) {
      this.logger.error(
        `Failed to fetch available cities: ${error.message}`,
        error.stack,
      );
      return [];
    }
  }
}
