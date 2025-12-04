/**
 * EPA US AQI Utilities
 * Chuyển đổi và xử lý chỉ số AQI theo tiêu chuẩn EPA US (0-500)
 */

import type { ForecastStatus } from '@/components/HourlyForecastCard';

/**
 * EPA US AQI Breakpoints và Status Color mapping
 * 0-50: Good (Tốt) -> good
 * 51-100: Moderate (Trung bình) -> moderate
 * 101-150: Unhealthy for Sensitive Groups (Không tốt cho nhóm nhạy cảm) -> unhealthy
 * 151-200: Unhealthy (Có hại) -> unhealthy
 * 201-300: Very Unhealthy (Rất có hại) -> hazardous
 * 301-500: Hazardous (Nguy hiểm) -> hazardous
 */

export type AQIStatus = 'good' | 'moderate' | 'unhealthy' | 'hazardous';

/**
 * Get AQI status from EPA US index value (0-500)
 * Maps 6 EPA levels to 4 UI status colors
 */
export function getEPAAQIStatus(aqiIndex: number): AQIStatus {
  if (aqiIndex <= 50) return 'good';
  if (aqiIndex <= 100) return 'moderate';
  if (aqiIndex <= 200) return 'unhealthy'; // USG (101-150) + Unhealthy (151-200)
  return 'hazardous'; // Very Unhealthy (201-300) + Hazardous (301+)
}

/**
 * Get AQI status compatible with ForecastStatus type
 */
export function getEPAAQIForecastStatus(aqiIndex: number): ForecastStatus {
  return getEPAAQIStatus(aqiIndex);
}

/**
 * EPA US AQI Labels in Vietnamese
 */
const EPA_AQI_LABELS_VI: Record<string, string> = {
  Good: 'Tốt',
  Moderate: 'Trung bình',
  'Unhealthy for Sensitive Groups': 'Không tốt cho nhóm nhạy cảm',
  Unhealthy: 'Có hại',
  'Very Unhealthy': 'Rất có hại',
  Hazardous: 'Nguy hiểm',
};

/**
 * Get AQI label in Vietnamese from EPA US index
 * @param aqiIndex - EPA US AQI index (0-500)
 * @param englishLevel - Optional English level string from API
 */
export function getEPAAQILabelVi(aqiIndex: number, englishLevel?: string): string {
  // If API provides English level, translate it
  if (englishLevel && EPA_AQI_LABELS_VI[englishLevel]) {
    return EPA_AQI_LABELS_VI[englishLevel];
  }

  // Otherwise derive from index
  if (aqiIndex <= 50) return 'Tốt';
  if (aqiIndex <= 100) return 'Trung bình';
  if (aqiIndex <= 150) return 'Không tốt cho nhóm nhạy cảm';
  if (aqiIndex <= 200) return 'Có hại';
  if (aqiIndex <= 300) return 'Rất có hại';
  return 'Nguy hiểm';
}

/**
 * Get short AQI label in Vietnamese (for compact display)
 */
export function getEPAAQILabelViShort(aqiIndex: number): string {
  if (aqiIndex <= 50) return 'Tốt';
  if (aqiIndex <= 100) return 'TB';
  if (aqiIndex <= 150) return 'Nhạy cảm';
  if (aqiIndex <= 200) return 'Có hại';
  if (aqiIndex <= 300) return 'Rất có hại';
  return 'Nguy hiểm';
}

/**
 * Format AQI display string with index and label
 * Example: "207 - Rất có hại"
 */
export function formatAQIDisplay(aqiIndex: number, englishLevel?: string): string {
  const label = getEPAAQILabelVi(aqiIndex, englishLevel);
  return `${aqiIndex} - ${label}`;
}

/**
 * Format AQI for compact display (card value)
 * Returns just the index as string
 */
export function formatAQIValue(aqiIndex: number): string {
  return aqiIndex.toString();
}
