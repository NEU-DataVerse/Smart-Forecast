/**
 * Alert Threshold Seed Data
 *
 * Contains default threshold configurations for automatic alerts.
 */

import {
  AlertLevel,
  AlertType,
  AlertMetric,
  ThresholdOperator,
} from '@smart-forecast/shared';

export interface AlertThresholdSeedData {
  type: AlertType;
  metric: AlertMetric;
  operator: ThresholdOperator;
  value: number;
  level: AlertLevel;
  adviceTemplate: string;
  isActive: boolean;
}

export const ALERT_THRESHOLD_SEED_DATA: AlertThresholdSeedData[] = [
  // ==================== Air Quality Thresholds ====================

  // AQI Thresholds
  {
    type: AlertType.AIR_QUALITY,
    metric: AlertMetric.AQI,
    operator: ThresholdOperator.GT,
    value: 180,
    level: AlertLevel.HIGH,
    adviceTemplate:
      'Chất lượng không khí ở mức kém. Hạn chế hoạt động ngoài trời, đeo khẩu trang N95 khi ra ngoài.',
    isActive: true,
  },
  {
    type: AlertType.AIR_QUALITY,
    metric: AlertMetric.AQI,
    operator: ThresholdOperator.GT,
    value: 240,
    level: AlertLevel.CRITICAL,
    adviceTemplate:
      'Chất lượng không khí rất xấu! Ở trong nhà, đóng cửa sổ, sử dụng máy lọc không khí nếu có. Không ra ngoài trừ trường hợp khẩn cấp.',
    isActive: true,
  },

  // PM2.5 Thresholds (µg/m³)
  {
    type: AlertType.AIR_QUALITY,
    metric: AlertMetric.PM25,
    operator: ThresholdOperator.GT,
    value: 150,
    level: AlertLevel.CRITICAL,
    adviceTemplate:
      'Nồng độ PM2.5 cực kỳ cao! Ở trong nhà với cửa đóng kín, sử dụng máy lọc không khí.',
    isActive: true,
  },

  // PM10 Thresholds (µg/m³)
  {
    type: AlertType.AIR_QUALITY,
    metric: AlertMetric.PM10,
    operator: ThresholdOperator.GT,
    value: 150,
    level: AlertLevel.HIGH,
    adviceTemplate:
      'Nồng độ PM10 cao. Hạn chế hoạt động ngoài trời kéo dài, đặc biệt với trẻ em và người già.',
    isActive: true,
  },

  // ==================== Weather Thresholds ====================

  // Temperature Thresholds (°C)
  {
    type: AlertType.WEATHER,
    metric: AlertMetric.TEMPERATURE,
    operator: ThresholdOperator.GT,
    value: 37,
    level: AlertLevel.MEDIUM,
    adviceTemplate:
      'Nhiệt độ cao. Hạn chế hoạt động ngoài trời từ 11h-15h, uống nhiều nước, mặc quần áo thoáng mát.',
    isActive: true,
  },
  {
    type: AlertType.WEATHER,
    metric: AlertMetric.TEMPERATURE,
    operator: ThresholdOperator.GT,
    value: 40,
    level: AlertLevel.HIGH,
    adviceTemplate:
      'Nắng nóng gay gắt! Tránh ra ngoài, uống đủ nước, chú ý dấu hiệu say nắng. Liên hệ y tế nếu cần: 115.',
    isActive: true,
  },
  {
    type: AlertType.WEATHER,
    metric: AlertMetric.TEMPERATURE,
    operator: ThresholdOperator.LT,
    value: 10,
    level: AlertLevel.MEDIUM,
    adviceTemplate:
      'Trời rét. Mặc ấm khi ra ngoài, chú ý giữ ấm cho trẻ em và người già.',
    isActive: true,
  },
  {
    type: AlertType.WEATHER,
    metric: AlertMetric.TEMPERATURE,
    operator: ThresholdOperator.LT,
    value: 5,
    level: AlertLevel.HIGH,
    adviceTemplate:
      'Rét đậm rét hại! Hạn chế ra ngoài, giữ ấm cơ thể, chú ý phòng chống cảm lạnh.',
    isActive: true,
  },

  // Wind Speed Thresholds (m/s)
  {
    type: AlertType.WEATHER,
    metric: AlertMetric.WIND_SPEED,
    operator: ThresholdOperator.GT,
    value: 15,
    level: AlertLevel.MEDIUM,
    adviceTemplate:
      'Gió mạnh. Cẩn thận khi di chuyển, tránh đứng gần cây to và biển quảng cáo.',
    isActive: true,
  },
  {
    type: AlertType.WEATHER,
    metric: AlertMetric.WIND_SPEED,
    operator: ThresholdOperator.GT,
    value: 20,
    level: AlertLevel.HIGH,
    adviceTemplate:
      'Gió rất mạnh! Hạn chế ra ngoài, gia cố cửa sổ và các vật dụng ngoài trời.',
    isActive: true,
  },
  {
    type: AlertType.WEATHER,
    metric: AlertMetric.WIND_SPEED,
    operator: ThresholdOperator.GT,
    value: 30,
    level: AlertLevel.CRITICAL,
    adviceTemplate:
      'Gió bão! Ở trong nhà, tránh xa cửa sổ, chuẩn bị đèn pin và nhu yếu phẩm.',
    isActive: true,
  },

  // Precipitation Thresholds (mm/h)
  {
    type: AlertType.WEATHER,
    metric: AlertMetric.PRECIPITATION,
    operator: ThresholdOperator.GT,
    value: 30,
    level: AlertLevel.MEDIUM,
    adviceTemplate:
      'Mưa to. Cẩn thận khi di chuyển, tránh các vùng trũng có nguy cơ ngập.',
    isActive: true,
  },
  {
    type: AlertType.WEATHER,
    metric: AlertMetric.PRECIPITATION,
    operator: ThresholdOperator.GT,
    value: 50,
    level: AlertLevel.HIGH,
    adviceTemplate:
      'Mưa rất to! Hạn chế di chuyển, cảnh giác ngập úng và sạt lở đất.',
    isActive: true,
  },
  {
    type: AlertType.WEATHER,
    metric: AlertMetric.PRECIPITATION,
    operator: ThresholdOperator.GT,
    value: 100,
    level: AlertLevel.CRITICAL,
    adviceTemplate:
      'Mưa đặc biệt to! Không ra ngoài, di chuyển đến nơi cao nếu ở vùng trũng. Liên hệ cứu hộ: 114.',
    isActive: true,
  },
];
