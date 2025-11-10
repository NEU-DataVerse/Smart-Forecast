/**
 * User Roles in Smart Forecast Platform
 */
export enum UserRole {
    /**
     * Administrator - Can manage alerts, view all incidents, access dashboard
     */
    ADMIN = "ADMIN",

    /**
     * Citizen - Can receive alerts, report incidents, view own reports
     */
    CITIZEN = "CITIZEN",
}

/**
 * System roles for internal operations
 */
export enum SystemRole {
    /**
     * System/Cron jobs for data ingestion
     */
    SYSTEM = "SYSTEM",
}

/**
 * All possible roles including system roles
 */
export type AllRoles = UserRole | SystemRole;
