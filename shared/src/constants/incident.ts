/**
 * Types of incidents that can be reported by citizens
 */
export enum IncidentType {
  /**
   * Flooding incident
   */
  FLOODING = 'FLOODING',

  /**
   * Fallen tree incident
   */
  FALLEN_TREE = 'FALLEN_TREE',

  /**
   * Landslide incident
   */
  LANDSLIDE = 'LANDSLIDE',

  /**
   * Air pollution incident
   */
  AIR_POLLUTION = 'AIR_POLLUTION',

  /**
   * Road damage incident
   */
  ROAD_DAMAGE = 'ROAD_DAMAGE',

  /**
   * Other types of incidents
   */
  OTHER = 'OTHER',
}

/**
 * Status of an incident report
 */
export enum IncidentStatus {
  /**
   * Pending review by admin
   */
  PENDING = 'PENDING',

  /**
   * Verified by admin
   */
  VERIFIED = 'VERIFIED',

  /**
   * Rejected by admin
   */
  REJECTED = 'REJECTED',

  /**
   * In progress (being handled)
   */
  IN_PROGRESS = 'IN_PROGRESS',

  /**
   * Resolved
   */
  RESOLVED = 'RESOLVED',
}

/**
 * Human-readable labels for incident types
 */
export const IncidentTypeLabels: Record<IncidentType, string> = {
  [IncidentType.FLOODING]: 'Ngập lụt',
  [IncidentType.FALLEN_TREE]: 'Cây đổ',
  [IncidentType.LANDSLIDE]: 'Sạt lở',
  [IncidentType.AIR_POLLUTION]: 'Ô nhiễm không khí',
  [IncidentType.ROAD_DAMAGE]: 'Đường hư hỏng',
  [IncidentType.OTHER]: 'Khác',
};

/**
 * Human-readable labels for incident status
 */
export const IncidentStatusLabels: Record<IncidentStatus, string> = {
  [IncidentStatus.PENDING]: 'Chờ xử lý',
  [IncidentStatus.VERIFIED]: 'Đã xác nhận',
  [IncidentStatus.REJECTED]: 'Đã từ chối',
  [IncidentStatus.IN_PROGRESS]: 'Đang xử lý',
  [IncidentStatus.RESOLVED]: 'Đã giải quyết',
};
