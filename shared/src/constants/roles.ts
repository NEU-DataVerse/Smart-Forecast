/**
 * User Roles in Smart Forecast Platform
 */
export enum UserRole {
  /**
   * Administrator - Can manage alerts, stations, ingestion, view all data
   */
  ADMIN = 'ADMIN',

  /**
   * User - Can receive alerts, report incidents, view public data
   */
  USER = 'USER',
}

/**
 * System roles for internal operations
 */
export enum SystemRole {
  /**
   * System/Cron jobs for data ingestion
   */
  SYSTEM = 'SYSTEM',
}

/**
 * All possible roles including system roles
 */
export type AllRoles = UserRole | SystemRole;
