import {
  IsOptional,
  IsDateString,
  IsEnum,
  IsString,
  IsInt,
  Min,
  Max,
  ValidateIf,
} from 'class-validator';
import { ApiPropertyOptional } from '@nestjs/swagger';
import { Type, Transform } from 'class-transformer';
import { BadRequestException } from '@nestjs/common';

export enum ExportFormat {
  PDF = 'pdf',
  CSV = 'csv',
}

export enum ReportType {
  WEATHER = 'weather',
  AIR_QUALITY = 'air-quality',
  INCIDENTS = 'incidents',
  STATIONS = 'stations',
}

/**
 * Default and maximum limits for report exports
 */
export const REPORT_LIMITS = {
  DEFAULT: 1000,
  MAX: 10000,
  PDF_MAX_DISPLAY: 50,
  PDF_INCIDENTS_MAX_DISPLAY: 30,
} as const;

/**
 * Base export query DTO with common fields
 */
export class BaseExportQueryDto {
  @ApiPropertyOptional({
    enum: ExportFormat,
    example: ExportFormat.PDF,
    description: 'Export format (pdf or csv)',
    default: ExportFormat.PDF,
  })
  @IsEnum(ExportFormat, { message: 'Format must be either "pdf" or "csv"' })
  @IsOptional()
  format?: ExportFormat = ExportFormat.PDF;

  @ApiPropertyOptional({
    example: 1000,
    description: `Maximum number of records to export (default: ${REPORT_LIMITS.DEFAULT}, max: ${REPORT_LIMITS.MAX})`,
    default: REPORT_LIMITS.DEFAULT,
    minimum: 1,
    maximum: REPORT_LIMITS.MAX,
  })
  @Type(() => Number)
  @IsInt({ message: 'limit must be an integer' })
  @Min(1, { message: 'limit must be at least 1' })
  @Max(REPORT_LIMITS.MAX, {
    message: `limit cannot exceed ${REPORT_LIMITS.MAX}`,
  })
  @IsOptional()
  limit?: number = REPORT_LIMITS.DEFAULT;
}

/**
 * Export query DTO for Weather and Air Quality reports
 * Supports date range filtering and station filtering
 */
export class ExportQueryDto extends BaseExportQueryDto {
  @ApiPropertyOptional({
    example: '2024-01-01T00:00:00Z',
    description: 'Start date for data range (ISO 8601 format)',
  })
  @IsDateString(
    {},
    { message: 'startDate must be a valid ISO 8601 date string' },
  )
  @IsOptional()
  startDate?: string;

  @ApiPropertyOptional({
    example: '2024-12-31T23:59:59Z',
    description: 'End date for data range (ISO 8601 format)',
  })
  @IsDateString({}, { message: 'endDate must be a valid ISO 8601 date string' })
  @IsOptional()
  @ValidateIf((o) => o.startDate !== undefined)
  @Transform(({ value, obj }) => {
    if (obj.startDate && value) {
      const start = new Date(obj.startDate);
      const end = new Date(value);
      if (end < start) {
        throw new BadRequestException('endDate must be after startDate');
      }
    }
    return value;
  })
  endDate?: string;

  @ApiPropertyOptional({
    example: 'station123',
    description: 'Filter by station ID (only for weather/air-quality reports)',
  })
  @IsString()
  @IsOptional()
  stationId?: string;

  /**
   * Validate date range logic
   */
  validateDateRange(): void {
    if (this.startDate && this.endDate) {
      const start = new Date(this.startDate);
      const end = new Date(this.endDate);

      if (isNaN(start.getTime())) {
        throw new BadRequestException('Invalid startDate format');
      }
      if (isNaN(end.getTime())) {
        throw new BadRequestException('Invalid endDate format');
      }
      if (end < start) {
        throw new BadRequestException('endDate must be after startDate');
      }
    }
  }

  /**
   * Check if only one of startDate or endDate is provided
   */
  hasPartialDateRange(): boolean {
    return (
      (this.startDate !== undefined && this.endDate === undefined) ||
      (this.startDate === undefined && this.endDate !== undefined)
    );
  }
}

/**
 * Export query DTO for Incidents reports
 * Supports date range filtering only (no stationId)
 */
export class IncidentExportQueryDto extends BaseExportQueryDto {
  @ApiPropertyOptional({
    example: '2024-01-01T00:00:00Z',
    description: 'Start date for data range (ISO 8601 format)',
  })
  @IsDateString(
    {},
    { message: 'startDate must be a valid ISO 8601 date string' },
  )
  @IsOptional()
  startDate?: string;

  @ApiPropertyOptional({
    example: '2024-12-31T23:59:59Z',
    description: 'End date for data range (ISO 8601 format)',
  })
  @IsDateString({}, { message: 'endDate must be a valid ISO 8601 date string' })
  @IsOptional()
  @ValidateIf((o) => o.startDate !== undefined)
  @Transform(({ value, obj }) => {
    if (obj.startDate && value) {
      const start = new Date(obj.startDate);
      const end = new Date(value);
      if (end < start) {
        throw new BadRequestException('endDate must be after startDate');
      }
    }
    return value;
  })
  endDate?: string;

  /**
   * Validate date range logic
   */
  validateDateRange(): void {
    if (this.startDate && this.endDate) {
      const start = new Date(this.startDate);
      const end = new Date(this.endDate);

      if (isNaN(start.getTime())) {
        throw new BadRequestException('Invalid startDate format');
      }
      if (isNaN(end.getTime())) {
        throw new BadRequestException('Invalid endDate format');
      }
      if (end < start) {
        throw new BadRequestException('endDate must be after startDate');
      }
    }
  }

  /**
   * Check if only one of startDate or endDate is provided
   */
  hasPartialDateRange(): boolean {
    return (
      (this.startDate !== undefined && this.endDate === undefined) ||
      (this.startDate === undefined && this.endDate !== undefined)
    );
  }
}

/**
 * Export query DTO for Stations reports
 * Only supports format selection (no date range, no stationId)
 */
export class StationExportQueryDto extends BaseExportQueryDto {
  // Only format and limit from base class
}
