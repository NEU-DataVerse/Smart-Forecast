import { Injectable, Logger } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import { ConfigService } from '@nestjs/config';
import { AlertService } from './alert.service';
import { AlertThresholdService } from './alert-threshold.service';
import { WeatherService } from '../weather/weather.service';
import { AirQualityService } from '../air-quality/air-quality.service';
import {
  AlertType,
  AlertMetric,
  ThresholdOperator,
} from '@smart-forecast/shared';

interface MetricData {
  stationId: string;
  stationName?: string;
  value: number;
  metric: AlertMetric;
  location?: { lat: number; lon: number };
}

@Injectable()
export class AlertScheduler {
  private readonly logger = new Logger(AlertScheduler.name);

  constructor(
    private readonly alertService: AlertService,
    private readonly thresholdService: AlertThresholdService,
    private readonly weatherService: WeatherService,
    private readonly airQualityService: AirQualityService,
    private readonly configService: ConfigService,
  ) {}

  /**
   * Check thresholds every 15 minutes and create auto alerts if needed
   */
  @Cron(CronExpression.EVERY_10_MINUTES)
  async checkThresholds(): Promise<void> {
    this.logger.log('Starting threshold check...');

    try {
      const activeThresholds =
        await this.thresholdService.findActiveThresholds();

      if (activeThresholds.length === 0) {
        this.logger.debug('No active thresholds configured');
        return;
      }

      // Group thresholds by type
      const airQualityThresholds = activeThresholds.filter(
        (t) => t.type === AlertType.AIR_QUALITY,
      );
      const weatherThresholds = activeThresholds.filter(
        (t) => t.type === AlertType.WEATHER,
      );

      // Check air quality thresholds
      if (airQualityThresholds.length > 0) {
        await this.checkAirQualityThresholds(airQualityThresholds);
      }

      // Check weather thresholds
      if (weatherThresholds.length > 0) {
        await this.checkWeatherThresholds(weatherThresholds);
      }

      this.logger.log('Threshold check completed');
    } catch (error) {
      this.logger.error('Error during threshold check:', error);
    }
  }

  /**
   * Check air quality data against thresholds
   */
  private async checkAirQualityThresholds(
    thresholds: Awaited<
      ReturnType<AlertThresholdService['findActiveThresholds']>
    >,
  ): Promise<void> {
    try {
      const currentData = await this.airQualityService.getCurrentAirQuality();

      for (const station of currentData.data) {
        const metricsData = this.extractAirQualityMetrics(station);

        for (const threshold of thresholds) {
          const metricData = metricsData.find(
            (m) => m.metric === threshold.metric,
          );

          if (!metricData || metricData.value === null) continue;

          if (
            this.isThresholdExceeded(
              metricData.value,
              threshold.operator,
              threshold.value,
            )
          ) {
            await this.createAutoAlertIfNotDuplicate({
              type: threshold.type,
              level: threshold.level,
              metric: threshold.metric,
              metricValue: metricData.value,
              thresholdValue: threshold.value,
              operator: threshold.operator,
              advice: threshold.adviceTemplate,
              stationId: station.stationId,
              location: station.location,
            });
          }
        }
      }
    } catch (error) {
      this.logger.error('Error checking air quality thresholds:', error);
    }
  }

  /**
   * Check weather data against thresholds
   */
  private async checkWeatherThresholds(
    thresholds: Awaited<
      ReturnType<AlertThresholdService['findActiveThresholds']>
    >,
  ): Promise<void> {
    try {
      const currentData = await this.weatherService.getCurrentWeather();

      for (const station of currentData.data) {
        const metricsData = this.extractWeatherMetrics(station);

        for (const threshold of thresholds) {
          const metricData = metricsData.find(
            (m) => m.metric === threshold.metric,
          );

          if (!metricData || metricData.value === null) continue;

          if (
            this.isThresholdExceeded(
              metricData.value,
              threshold.operator,
              threshold.value,
            )
          ) {
            await this.createAutoAlertIfNotDuplicate({
              type: threshold.type,
              level: threshold.level,
              metric: threshold.metric,
              metricValue: metricData.value,
              thresholdValue: threshold.value,
              operator: threshold.operator,
              advice: threshold.adviceTemplate,
              stationId: station.stationId,
              location: station.location,
            });
          }
        }
      }
    } catch (error) {
      this.logger.error('Error checking weather thresholds:', error);
    }
  }

  /**
   * Extract air quality metric values from station data
   */
  private extractAirQualityMetrics(station: any): MetricData[] {
    return [
      {
        stationId: station.stationId,
        metric: AlertMetric.AQI,
        value: station.aqi?.openWeather?.index ?? station.aqi?.epaUS?.index,
        location: station.location,
      },
      {
        stationId: station.stationId,
        metric: AlertMetric.PM25,
        value: station.pollutants?.pm25,
        location: station.location,
      },
      {
        stationId: station.stationId,
        metric: AlertMetric.PM10,
        value: station.pollutants?.pm10,
        location: station.location,
      },
      {
        stationId: station.stationId,
        metric: AlertMetric.CO,
        value: station.pollutants?.co,
        location: station.location,
      },
      {
        stationId: station.stationId,
        metric: AlertMetric.NO2,
        value: station.pollutants?.no2,
        location: station.location,
      },
      {
        stationId: station.stationId,
        metric: AlertMetric.O3,
        value: station.pollutants?.o3,
        location: station.location,
      },
      {
        stationId: station.stationId,
        metric: AlertMetric.SO2,
        value: station.pollutants?.so2,
        location: station.location,
      },
    ];
  }

  /**
   * Extract weather metric values from station data
   */
  private extractWeatherMetrics(station: any): MetricData[] {
    return [
      {
        stationId: station.stationId,
        metric: AlertMetric.TEMPERATURE,
        value: station.temperature?.current,
        location: station.location,
      },
      {
        stationId: station.stationId,
        metric: AlertMetric.HUMIDITY,
        value: station.atmospheric?.humidity,
        location: station.location,
      },
      {
        stationId: station.stationId,
        metric: AlertMetric.WIND_SPEED,
        value: station.wind?.speed,
        location: station.location,
      },
      {
        stationId: station.stationId,
        metric: AlertMetric.PRECIPITATION,
        value: station.precipitation,
        location: station.location,
      },
      {
        stationId: station.stationId,
        metric: AlertMetric.UV_INDEX,
        value: station.uvIndex,
        location: station.location,
      },
    ];
  }

  /**
   * Check if a metric value exceeds threshold
   */
  private isThresholdExceeded(
    value: number,
    operator: ThresholdOperator,
    threshold: number,
  ): boolean {
    switch (operator) {
      case ThresholdOperator.GT:
        return value > threshold;
      case ThresholdOperator.GTE:
        return value >= threshold;
      case ThresholdOperator.LT:
        return value < threshold;
      case ThresholdOperator.LTE:
        return value <= threshold;
      default:
        return false;
    }
  }

  /**
   * Create auto alert if no duplicate exists
   */
  private async createAutoAlertIfNotDuplicate(params: {
    type: AlertType;
    level: any;
    metric: AlertMetric;
    metricValue: number;
    thresholdValue: number;
    operator: ThresholdOperator;
    advice: string;
    stationId: string;
    location?: { lat: number; lon: number };
  }): Promise<void> {
    const {
      type,
      level,
      metric,
      metricValue,
      thresholdValue,
      operator,
      advice,
      stationId,
      location,
    } = params;

    // Check for duplicate
    const isDuplicate = await this.alertService.checkDuplicateAlert(
      type,
      level,
      stationId,
      2, // within 2 hours
    );

    if (isDuplicate) {
      this.logger.debug(
        `Skipping duplicate alert for ${metric} at station ${stationId}`,
      );
      return;
    }

    // Generate title and message
    const { title, message } = this.generateAlertContent(
      type,
      level,
      metric,
      metricValue,
      thresholdValue,
      operator,
    );

    // Create area polygon if location available (approximate 10km radius)
    let area: { type: 'Polygon'; coordinates: number[][][] } | null = null;
    if (location) {
      area = this.createApproximateArea(location.lat, location.lon);
    }

    await this.alertService.createAutoAlert({
      type,
      level,
      title,
      message,
      advice,
      stationId,
      sourceData: {
        metric,
        value: metricValue,
        threshold: thresholdValue,
        operator,
        timestamp: new Date().toISOString(),
      },
      area,
    });

    this.logger.log(
      `Created auto alert: ${type} - ${level} for ${metric}=${metricValue} at station ${stationId}`,
    );
  }

  /**
   * Generate alert title and message based on metric
   */
  private generateAlertContent(
    type: AlertType,
    level: any,
    metric: AlertMetric,
    value: number,
    threshold: number,
    _operator: ThresholdOperator,
  ): { title: string; message: string } {
    const metricLabels: Record<AlertMetric, string> = {
      [AlertMetric.AQI]: 'Chỉ số AQI',
      [AlertMetric.PM25]: 'Nồng độ PM2.5',
      [AlertMetric.PM10]: 'Nồng độ PM10',
      [AlertMetric.CO]: 'Nồng độ CO',
      [AlertMetric.NO2]: 'Nồng độ NO₂',
      [AlertMetric.O3]: 'Nồng độ O₃',
      [AlertMetric.SO2]: 'Nồng độ SO₂',
      [AlertMetric.TEMPERATURE]: 'Nhiệt độ',
      [AlertMetric.HUMIDITY]: 'Độ ẩm',
      [AlertMetric.WIND_SPEED]: 'Tốc độ gió',
      [AlertMetric.PRECIPITATION]: 'Lượng mưa',
      [AlertMetric.UV_INDEX]: 'Chỉ số UV',
    };

    const levelLabels: Record<string, string> = {
      LOW: 'thấp',
      MEDIUM: 'trung bình',
      HIGH: 'cao',
      CRITICAL: 'khẩn cấp',
    };

    const typeLabels: Record<AlertType, string> = {
      [AlertType.AIR_QUALITY]: 'Chất lượng không khí',
      [AlertType.WEATHER]: 'Thời tiết',
      [AlertType.DISASTER]: 'Thiên tai',
      [AlertType.ENVIRONMENTAL]: 'Môi trường',
    };

    const metricLabel = metricLabels[metric] || metric;
    const levelLabel = levelLabels[level] || level;
    const typeLabel = typeLabels[type] || type;

    const title = `⚠️ Cảnh báo ${typeLabel} - Mức ${levelLabel}`;
    const message = `${metricLabel} đã đạt mức ${value.toFixed(1)}, vượt ngưỡng cho phép (${threshold}). Vui lòng thực hiện các biện pháp phòng ngừa cần thiết.`;

    return { title, message };
  }

  /**
   * Create approximate polygon area around a point (10km radius approximation)
   */
  private createApproximateArea(
    lat: number,
    lon: number,
    radiusKm: number = 10,
  ): { type: 'Polygon'; coordinates: number[][][] } {
    // Approximate degrees per km at given latitude
    const latDegPerKm = 1 / 111;
    const lonDegPerKm = 1 / (111 * Math.cos((lat * Math.PI) / 180));

    const deltaLat = radiusKm * latDegPerKm;
    const deltaLon = radiusKm * lonDegPerKm;

    // Create a simple rectangular polygon
    return {
      type: 'Polygon',
      coordinates: [
        [
          [lon - deltaLon, lat - deltaLat],
          [lon + deltaLon, lat - deltaLat],
          [lon + deltaLon, lat + deltaLat],
          [lon - deltaLon, lat + deltaLat],
          [lon - deltaLon, lat - deltaLat], // Close the polygon
        ],
      ],
    };
  }

  /**
   * Manual trigger for testing (called via endpoint)
   */
  async triggerCheck(): Promise<{ message: string }> {
    await this.checkThresholds();
    return { message: 'Threshold check triggered successfully' };
  }
}
