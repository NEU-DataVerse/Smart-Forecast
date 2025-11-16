import { Injectable, Logger } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import { OpenWeatherMapService } from './openweathermap.service';

/**
 * Service for managing weather data collection and processing
 */
@Injectable()
export class WeatherService {
  private readonly logger = new Logger(WeatherService.name);

  constructor(private readonly openWeatherMapService: OpenWeatherMapService) {}

  /**
   * Scheduled job to ingest weather data every 30 minutes
   */
  @Cron(CronExpression.EVERY_30_MINUTES)
  async scheduledIngestion(): Promise<void> {
    this.logger.log('Starting scheduled weather data ingestion...');
    try {
      await this.openWeatherMapService.ingestWeatherData();
      this.logger.log('Scheduled weather data ingestion completed');
    } catch (error) {
      this.logger.error(
        `Scheduled weather data ingestion failed: ${error.message}`,
        error.stack,
      );
    }
  }

  /**
   * Manually trigger weather data ingestion
   * @param cities Optional array of cities with coordinates
   */
  async triggerIngestion(
    cities?: Array<{ name: string; lat: number; lon: number }>,
  ): Promise<void> {
    this.logger.log('Manual weather data ingestion triggered');
    await this.openWeatherMapService.ingestWeatherData(cities);
  }

  /**
   * Get weather forecast for a location
   * @param lat Latitude
   * @param lon Longitude
   * @param days Number of days
   */
  async getForecast(lat: number, lon: number, days = 5): Promise<any> {
    return this.openWeatherMapService.fetchWeatherForecast(lat, lon, days);
  }

  /**
   * Get current weather for a city
   * @param cityName City name
   */
  async getCurrentWeather(cityName: string): Promise<any> {
    return this.openWeatherMapService.fetchCurrentWeatherByCity(cityName);
  }
}
