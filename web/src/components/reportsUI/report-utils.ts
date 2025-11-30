import type { IIncidentUser } from '@smart-forecast/shared';

export const formatDate = (date: Date): string => {
  return new Date(date).toLocaleString('vi-VN', {
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
  });
};

export const getLocationString = (coordinates: number[]): string => {
  return `${coordinates[1].toFixed(4)}, ${coordinates[0].toFixed(4)}`;
};

/**
 * Get reporter/verifier display name
 * Handles IIncidentUser object from API response
 */
export const getReporterName = (reporter: IIncidentUser | null | undefined): string => {
  if (!reporter) return 'Không xác định';

  if (reporter.fullName) {
    return reporter.fullName;
  }

  if (reporter.email) {
    return reporter.email;
  }

  return `ID: ${reporter.id.slice(0, 8)}...`;
};
