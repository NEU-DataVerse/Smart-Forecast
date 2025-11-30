/**
 * Alert levels for environmental alerts
 */
export enum AlertLevel {
  /**
   * Low priority alert
   */
  LOW = 'LOW',

  /**
   * Medium priority alert
   */
  MEDIUM = 'MEDIUM',

  /**
   * High priority alert
   */
  HIGH = 'HIGH',

  /**
   * Critical/Emergency alert
   */
  CRITICAL = 'CRITICAL',
}

/**
 * Alert types
 */
export enum AlertType {
  /**
   * Weather-related alert
   */
  WEATHER = 'WEATHER',

  /**
   * Air quality alert
   */
  AIR_QUALITY = 'AIR_QUALITY',

  /**
   * Natural disaster alert
   */
  DISASTER = 'DISASTER',

  /**
   * General environmental alert
   */
  ENVIRONMENTAL = 'ENVIRONMENTAL',
}

/**
 * Human-readable labels for alert levels
 */
export const AlertLevelLabels: Record<AlertLevel, string> = {
  [AlertLevel.LOW]: 'Thấp',
  [AlertLevel.MEDIUM]: 'Trung bình',
  [AlertLevel.HIGH]: 'Cao',
  [AlertLevel.CRITICAL]: 'Khẩn cấp',
};

/**
 * Colors for alert levels (for UI)
 */
export const AlertLevelColors: Record<AlertLevel, string> = {
  [AlertLevel.LOW]: '#10B981', // green
  [AlertLevel.MEDIUM]: '#F59E0B', // yellow
  [AlertLevel.HIGH]: '#F97316', // orange
  [AlertLevel.CRITICAL]: '#EF4444', // red
};

/**
 * Threshold comparison operators
 */
export enum ThresholdOperator {
  /**
   * Greater than
   */
  GT = 'GT',

  /**
   * Greater than or equal
   */
  GTE = 'GTE',

  /**
   * Less than
   */
  LT = 'LT',

  /**
   * Less than or equal
   */
  LTE = 'LTE',
}

/**
 * Alert metrics for thresholds
 */
export enum AlertMetric {
  // Air Quality metrics
  AQI = 'aqi',
  PM25 = 'pm2_5',
  PM10 = 'pm10',
  CO = 'co',
  NO2 = 'no2',
  O3 = 'o3',
  SO2 = 'so2',

  // Weather metrics
  TEMPERATURE = 'temperature',
  HUMIDITY = 'humidity',
  WIND_SPEED = 'wind_speed',
  PRECIPITATION = 'precipitation',
  UV_INDEX = 'uv_index',
}

/**
 * Human-readable labels for metrics
 */
export const AlertMetricLabels: Record<AlertMetric, string> = {
  [AlertMetric.AQI]: 'Chỉ số AQI',
  [AlertMetric.PM25]: 'PM2.5',
  [AlertMetric.PM10]: 'PM10',
  [AlertMetric.CO]: 'CO',
  [AlertMetric.NO2]: 'NO₂',
  [AlertMetric.O3]: 'O₃',
  [AlertMetric.SO2]: 'SO₂',
  [AlertMetric.TEMPERATURE]: 'Nhiệt độ',
  [AlertMetric.HUMIDITY]: 'Độ ẩm',
  [AlertMetric.WIND_SPEED]: 'Tốc độ gió',
  [AlertMetric.PRECIPITATION]: 'Lượng mưa',
  [AlertMetric.UV_INDEX]: 'Chỉ số UV',
};

/**
 * Units for metrics
 */
export const AlertMetricUnits: Record<AlertMetric, string> = {
  [AlertMetric.AQI]: '',
  [AlertMetric.PM25]: 'µg/m³',
  [AlertMetric.PM10]: 'µg/m³',
  [AlertMetric.CO]: 'µg/m³',
  [AlertMetric.NO2]: 'µg/m³',
  [AlertMetric.O3]: 'µg/m³',
  [AlertMetric.SO2]: 'µg/m³',
  [AlertMetric.TEMPERATURE]: '°C',
  [AlertMetric.HUMIDITY]: '%',
  [AlertMetric.WIND_SPEED]: 'm/s',
  [AlertMetric.PRECIPITATION]: 'mm',
  [AlertMetric.UV_INDEX]: '',
};
