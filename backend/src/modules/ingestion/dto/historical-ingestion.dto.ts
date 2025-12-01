import {
  IsDateString,
  IsArray,
  ArrayNotEmpty,
  IsIn,
  Validate,
  ValidatorConstraint,
  ValidatorConstraintInterface,
  ValidationArguments,
} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

/**
 * Custom validator to ensure date range is valid
 * - startDate must be before endDate
 * - Maximum 7 days range
 * - startDate cannot be more than 1 year in the past
 */
@ValidatorConstraint({ name: 'dateRangeValidator', async: false })
export class DateRangeValidator implements ValidatorConstraintInterface {
  validate(endDate: string, args: ValidationArguments): boolean {
    const dto = args.object as HistoricalIngestionDto;
    if (!dto.startDate || !endDate) return false;

    const start = new Date(dto.startDate);
    const end = new Date(endDate);
    const now = new Date();
    const oneYearAgo = new Date();
    oneYearAgo.setFullYear(oneYearAgo.getFullYear() - 1);

    // startDate must be before endDate
    if (start >= end) return false;

    // Maximum 7 days range
    const diffDays = (end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24);
    if (diffDays > 7) return false;

    // startDate cannot be more than 1 year in the past
    if (start < oneYearAgo) return false;

    // endDate cannot be in the future
    if (end > now) return false;

    return true;
  }

  defaultMessage(args: ValidationArguments): string {
    const dto = args.object as HistoricalIngestionDto;
    const start = new Date(dto.startDate);
    const end = new Date(dto.endDate);
    const now = new Date();
    const oneYearAgo = new Date();
    oneYearAgo.setFullYear(oneYearAgo.getFullYear() - 1);

    if (start >= end) {
      return 'startDate must be before endDate';
    }

    const diffDays = (end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24);
    if (diffDays > 7) {
      return 'Date range cannot exceed 7 days';
    }

    if (start < oneYearAgo) {
      return 'startDate cannot be more than 1 year in the past';
    }

    if (end > now) {
      return 'endDate cannot be in the future';
    }

    return 'Invalid date range';
  }
}

export type HistoricalIngestionType = 'weather' | 'air-quality';

/**
 * DTO for historical data ingestion request
 */
export class HistoricalIngestionDto {
  @ApiProperty({
    description: 'Start date for historical data (ISO 8601 format)',
    example: '2024-11-25T00:00:00.000Z',
  })
  @IsDateString()
  startDate: string;

  @ApiProperty({
    description: 'End date for historical data (ISO 8601 format)',
    example: '2024-12-02T00:00:00.000Z',
  })
  @IsDateString()
  @Validate(DateRangeValidator)
  endDate: string;

  @ApiProperty({
    description: 'Types of data to ingest',
    example: ['weather', 'air-quality'],
    enum: ['weather', 'air-quality'],
    isArray: true,
  })
  @IsArray()
  @ArrayNotEmpty()
  @IsIn(['weather', 'air-quality'], { each: true })
  types: HistoricalIngestionType[];
}

/**
 * Response DTO for historical ingestion
 */
export class HistoricalIngestionResponseDto {
  @ApiProperty({ description: 'Status message' })
  message: string;

  @ApiProperty({ description: 'Number of weather records ingested' })
  weatherRecords: number;

  @ApiProperty({ description: 'Number of air quality records ingested' })
  airQualityRecords: number;

  @ApiProperty({ description: 'Start date of ingestion range' })
  startDate: string;

  @ApiProperty({ description: 'End date of ingestion range' })
  endDate: string;

  @ApiProperty({ description: 'Types of data ingested' })
  types: HistoricalIngestionType[];

  @ApiProperty({
    description: 'Errors encountered during ingestion',
    required: false,
  })
  errors?: Array<{
    station: string;
    type: string;
    error: string;
  }>;
}
