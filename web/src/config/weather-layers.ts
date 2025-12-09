/*
 * SPDX-License-Identifier: MIT
 * Copyright (c) 2025 NEU-DataVerse
 */

/**
 * OpenWeatherMap Tile Layer Configuration
 * Documentation: http://maps.openweathermap.org/maps/2.0/weather/{op}/{z}/{x}/{y}?appid={API_KEY}
 *
 * Custom Palette Format: {value}:{HEX};{value}:{HEX};...
 * Example: "0:#0000ff;10:#00ff00;20:#ffff00;30:#ff0000"
 */

export interface WeatherLayerConfig {
  code: string; // Layer operation code (e.g., 'TA2')
  name: string; // Vietnamese display name
  unit: string; // Unit of measurement
  description: string; // Description for tooltip
  category: 'temperature' | 'precipitation' | 'wind-pressure' | 'clouds-humidity';
  palette?: string; // Custom color palette optimized for Vietnam climate
  icon: string; // Lucide icon name
}

/**
 * Weather Layer Categories for UI grouping
 */
export const LAYER_CATEGORIES = {
  temperature: {
    label: 'Nhiệt độ',
    description: 'Các lớp liên quan đến nhiệt độ không khí và đất',
  },
  precipitation: {
    label: 'Lượng mưa',
    description: 'Các lớp hiển thị lượng mưa và tuyết',
  },
  'wind-pressure': {
    label: 'Gió & Áp suất',
    description: 'Tốc độ gió và áp suất khí quyển',
  },
  'clouds-humidity': {
    label: 'Mây & Độ ẩm',
    description: 'Độ che phủ mây và độ ẩm tương đối',
  },
} as const;

/**
 * All available weather map layers with Vietnamese-optimized palettes
 *
 * Palette Color Scale Guidelines:
 * - Temperature (TA2): Optimized for 15-38°C range (Vietnam climate)
 * - Precipitation: Blue gradient for rain intensity
 * - Wind: Green to red for speed intensity
 * - Pressure: Purple to orange for pressure systems
 * - Clouds: White to dark gray for coverage
 * - Humidity: Cyan to blue for moisture levels
 */
export const WEATHER_LAYERS: WeatherLayerConfig[] = [
  // ============ TEMPERATURE LAYERS ============
  {
    code: 'TA2',
    name: 'Nhiệt độ không khí (2m)',
    unit: '°C',
    description: 'Nhiệt độ không khí tại độ cao 2 mét so với mặt đất',
    category: 'temperature',
    // Palette optimized for Vietnam: 15°C (cool) to 38°C (hot)
    palette: '15:#3b82f6;20:#06b6d4;25:#22c55e;28:#84cc16;31:#eab308;34:#f97316;38:#ef4444',
    icon: 'Thermometer',
  },
  {
    code: 'TD2',
    name: 'Điểm sương',
    unit: '°C',
    description: 'Nhiệt độ điểm sương - nhiệt độ mà không khí bắt đầu ngưng tụ',
    category: 'temperature',
    palette: '10:#06b6d4;15:#22c55e;20:#84cc16;25:#eab308;28:#f97316',
    icon: 'Droplet',
  },
  {
    code: 'TS0',
    name: 'Nhiệt độ đất (0-10cm)',
    unit: 'K',
    description: 'Nhiệt độ lớp đất bề mặt từ 0-10cm',
    category: 'temperature',
    palette: '283:#3b82f6;288:#22c55e;293:#eab308;298:#f97316;303:#ef4444', // 10-30°C in Kelvin
    icon: 'Mountain',
  },
  {
    code: 'TS10',
    name: 'Nhiệt độ đất (>10cm)',
    unit: 'K',
    description: 'Nhiệt độ lớp đất sâu hơn 10cm',
    category: 'temperature',
    palette: '283:#3b82f6;288:#22c55e;293:#eab308;298:#f97316;303:#ef4444',
    icon: 'Mountain',
  },

  // ============ PRECIPITATION LAYERS ============
  {
    code: 'PAC0',
    name: 'Mưa đối lưu',
    unit: 'mm',
    description: 'Lượng mưa từ mây đối lưu (mưa dông)',
    category: 'precipitation',
    palette: '0:#e0f2fe;5:#7dd3fc;10:#0ea5e9;20:#0284c7;40:#0369a1;80:#075985',
    icon: 'CloudRain',
  },
  {
    code: 'PR0',
    name: 'Cường độ mưa',
    unit: 'mm/s',
    description: 'Cường độ lượng mưa tức thời',
    category: 'precipitation',
    palette: '0:#e0f2fe;0.0001:#7dd3fc;0.001:#0ea5e9;0.01:#0284c7;0.1:#075985',
    icon: 'CloudRain',
  },
  {
    code: 'PA0',
    name: 'Tổng lượng mưa',
    unit: 'mm',
    description: 'Tổng lượng mưa tích lũy',
    category: 'precipitation',
    palette: '0:#e0f2fe;10:#7dd3fc;25:#0ea5e9;50:#0284c7;100:#0369a1;200:#075985',
    icon: 'CloudRain',
  },
  {
    code: 'PAR0',
    name: 'Lượng mưa (Rain)',
    unit: 'mm',
    description: 'Lượng mưa tích lũy - chỉ tính mưa',
    category: 'precipitation',
    palette: '0:#e0f2fe;10:#7dd3fc;25:#0ea5e9;50:#0284c7;100:#075985',
    icon: 'CloudRain',
  },
  {
    code: 'PAS0',
    name: 'Lượng tuyết',
    unit: 'mm',
    description: 'Lượng tuyết tích lũy',
    category: 'precipitation',
    palette: '0:#f0f9ff;10:#dbeafe;25:#93c5fd;50:#60a5fa;100:#3b82f6',
    icon: 'Snowflake',
  },
  {
    code: 'SD0',
    name: 'Độ sâu tuyết',
    unit: 'm',
    description: 'Độ sâu lớp tuyết phủ',
    category: 'precipitation',
    palette: '0:#f0f9ff;0.1:#dbeafe;0.3:#93c5fd;0.5:#60a5fa;1:#3b82f6',
    icon: 'Snowflake',
  },

  // ============ WIND & PRESSURE LAYERS ============
  {
    code: 'WS10',
    name: 'Tốc độ gió (10m)',
    unit: 'm/s',
    description: 'Tốc độ gió tại độ cao 10 mét',
    category: 'wind-pressure',
    palette: '0:#22c55e;3:#84cc16;6:#eab308;10:#f97316;15:#ef4444;20:#dc2626',
    icon: 'Wind',
  },
  {
    code: 'WND',
    name: 'Gió (Tốc độ & Hướng)',
    unit: 'm/s',
    description: 'Hiển thị đồng thời tốc độ gió (màu) và hướng gió (mũi tên)',
    category: 'wind-pressure',
    // Uses arrow_step and use_norm parameters
    palette: '0:#22c55e;3:#84cc16;6:#eab308;10:#f97316;15:#ef4444',
    icon: 'Navigation',
  },
  {
    code: 'APM',
    name: 'Áp suất khí quyển',
    unit: 'hPa',
    description: 'Áp suất khí quyển tại mực nước biển trung bình',
    category: 'wind-pressure',
    palette: '980:#a855f7;1000:#8b5cf6;1013:#6366f1;1020:#3b82f6;1040:#06b6d4',
    icon: 'Gauge',
  },

  // ============ CLOUDS & HUMIDITY LAYERS ============
  {
    code: 'CL',
    name: 'Độ che phủ mây',
    unit: '%',
    description: 'Tỷ lệ phần trăm bầu trời bị mây che phủ',
    category: 'clouds-humidity',
    palette: '0:#ffffff00;20:#e2e8f066;40:#cbd5e199;60:#94a3b8cc;80:#64748bff;100:#475569ff',
    icon: 'Cloud',
  },
  {
    code: 'HRD0',
    name: 'Độ ẩm tương đối',
    unit: '%',
    description: 'Độ ẩm không khí tương đối',
    category: 'clouds-humidity',
    palette: '0:#fef3c7;20:#fde047;40:#84cc16;60:#22c55e;80:#06b6d4;100:#0284c7',
    icon: 'Droplets',
  },
];

/**
 * Get layer configuration by code
 */
export function getLayerByCode(code: string): WeatherLayerConfig | undefined {
  return WEATHER_LAYERS.find((layer) => layer.code === code);
}

/**
 * Get layers grouped by category
 */
export function getLayersByCategory() {
  return WEATHER_LAYERS.reduce(
    (acc, layer) => {
      if (!acc[layer.category]) {
        acc[layer.category] = [];
      }
      acc[layer.category].push(layer);
      return acc;
    },
    {} as Record<WeatherLayerConfig['category'], WeatherLayerConfig[]>,
  );
}

/**
 * Build tile layer URL with parameters
 */
export function buildTileLayerUrl(
  layerCode: string,
  apiKey: string,
  options?: {
    opacity?: number;
    palette?: string;
    date?: number; // Unix timestamp
    fillBound?: boolean;
    arrowStep?: number; // For wind layers
    useNorm?: boolean; // For wind layers
  },
): string {
  const baseUrl = 'https://maps.openweathermap.org/maps/2.0/weather';
  const params = new URLSearchParams({
    appid: apiKey,
  });

  if (options?.opacity !== undefined) {
    params.append('opacity', options.opacity.toString());
  }

  if (options?.palette) {
    // OWM requires palette colors without # symbol
    const cleanedPalette = options.palette.replace(/#/g, '');
    params.append('palette', cleanedPalette);
  }

  if (options?.date) {
    params.append('date', options.date.toString());
  }

  if (options?.fillBound !== undefined) {
    params.append('fill_bound', options.fillBound.toString());
  }

  if (options?.arrowStep !== undefined) {
    params.append('arrow_step', options.arrowStep.toString());
  }

  if (options?.useNorm !== undefined) {
    params.append('use_norm', options.useNorm.toString());
  }

  return `${baseUrl}/${layerCode}/{z}/{x}/{y}?${params.toString()}`;
}

/**
 * Maximum number of layers that can be active simultaneously
 * to maintain good performance
 */
export const MAX_ACTIVE_LAYERS = 3;

/**
 * Default opacity for weather layers
 */
export const DEFAULT_LAYER_OPACITY = 0.6;
