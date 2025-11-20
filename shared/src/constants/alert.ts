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
