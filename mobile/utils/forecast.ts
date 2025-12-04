import type { ForecastStatus } from '@/components/HourlyForecastCard';

/**
 * Format forecast time from ISO string to display label
 * @param isoString - ISO date string (e.g., "2025-12-04T09:00:00Z")
 * @param type - 'daily' for day names (T2, T3...), 'hourly' for time (09:00, 12:00...)
 */
export function formatForecastTime(
  isoString: string | undefined,
  type: 'daily' | 'hourly' = 'hourly',
): string {
  if (!isoString) return '--';

  try {
    const date = new Date(isoString);

    if (type === 'daily') {
      // Check if today
      const today = new Date();
      if (date.toDateString() === today.toDateString()) {
        return 'Hôm nay';
      }

      // Check if tomorrow
      const tomorrow = new Date(today);
      tomorrow.setDate(tomorrow.getDate() + 1);
      if (date.toDateString() === tomorrow.toDateString()) {
        return 'Mai';
      }

      // Vietnamese day names: CN, T2, T3, T4, T5, T6, T7
      const dayNames = ['CN', 'T2', 'T3', 'T4', 'T5', 'T6', 'T7'];
      const dayIndex = date.getDay();
      const dayOfMonth = date.getDate();
      return `${dayNames[dayIndex]} ${dayOfMonth}`;
    }

    // Hourly format: HH:MM
    const hours = date.getHours().toString().padStart(2, '0');
    const minutes = date.getMinutes().toString().padStart(2, '0');
    return `${hours}:${minutes}`;
  } catch {
    return '--';
  }
}

/**
 * Get AQI status from index value
 * OpenWeather AQI: 1=Good, 2=Fair, 3=Moderate, 4=Poor, 5=Very Poor
 * EPA US AQI: 0-50=Good, 51-100=Moderate, 101-150=Unhealthy for Sensitive, 151-200=Unhealthy, 201-300=Very Unhealthy, 301+=Hazardous
 */
export function getAQIStatus(aqiIndex: number): ForecastStatus {
  if (aqiIndex <= 1) return 'good';
  if (aqiIndex <= 2) return 'moderate';
  if (aqiIndex <= 3) return 'unhealthy';
  return 'hazardous';
}

/**
 * Get AQI label from index
 */
export function getAQILabel(aqiIndex: number, level?: string): string {
  if (level) return level;

  const statusLabels: Record<ForecastStatus, string> = {
    good: 'Tốt',
    moderate: 'Trung bình',
    unhealthy: 'Kém',
    hazardous: 'Nguy hại',
  };

  return statusLabels[getAQIStatus(aqiIndex)];
}

/**
 * Get temperature status based on value (for color coding)
 */
export function getTemperatureStatus(temp: number): ForecastStatus {
  if (temp <= 15) return 'good'; // Cool - blue
  if (temp <= 25) return 'moderate'; // Comfortable - yellow
  if (temp <= 35) return 'unhealthy'; // Hot - orange
  return 'hazardous'; // Very hot - red
}

/**
 * Group hourly forecast by day for daily view
 * Takes the forecast at noon (12:00) or closest time for each day
 */
export function groupForecastByDay<
  T extends { validFrom?: string; validTo?: string; dateObserved?: string },
>(forecasts: T[]): T[] {
  if (!forecasts || forecasts.length === 0) return [];

  const byDay = new Map<string, T[]>();

  forecasts.forEach((item) => {
    const dateStr = item.validFrom || item.dateObserved;
    if (!dateStr) return;

    const date = new Date(dateStr);
    const dayKey = date.toDateString();

    if (!byDay.has(dayKey)) {
      byDay.set(dayKey, []);
    }
    byDay.get(dayKey)!.push(item);
  });

  // Get representative item for each day (prefer noon, fallback to first)
  const dailyForecasts: T[] = [];

  byDay.forEach((items) => {
    // Sort by time and pick the one closest to noon
    const sorted = items.sort((a, b) => {
      const timeA = new Date(a.validFrom || a.dateObserved || '').getTime();
      const timeB = new Date(b.validFrom || b.dateObserved || '').getTime();
      return timeA - timeB;
    });

    // Find noon entry or use middle entry
    const noonEntry = sorted.find((item) => {
      const hour = new Date(item.validFrom || item.dateObserved || '').getHours();
      return hour >= 11 && hour <= 14;
    });

    dailyForecasts.push(noonEntry || sorted[Math.floor(sorted.length / 2)]);
  });

  // Sort by date
  return dailyForecasts.sort((a, b) => {
    const timeA = new Date(a.validFrom || a.dateObserved || '').getTime();
    const timeB = new Date(b.validFrom || b.dateObserved || '').getTime();
    return timeA - timeB;
  });
}

/**
 * Limit array to first N items
 */
export function limitArray<T>(arr: T[] | undefined, limit: number): T[] {
  if (!arr) return [];
  return arr.slice(0, limit);
}
