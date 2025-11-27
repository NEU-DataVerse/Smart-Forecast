import { IsOptional, IsDateString, IsEnum } from 'class-validator';
import { ApiPropertyOptional } from '@nestjs/swagger';

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

export class ExportQueryDto {
  @ApiPropertyOptional({
    enum: ExportFormat,
    example: ExportFormat.PDF,
    description: 'Export format (pdf or csv)',
  })
  @IsEnum(ExportFormat)
  @IsOptional()
  format?: ExportFormat = ExportFormat.PDF;

  @ApiPropertyOptional({
    example: '2024-01-01T00:00:00Z',
    description: 'Start date for data range',
  })
  @IsDateString()
  @IsOptional()
  startDate?: string;

  @ApiPropertyOptional({
    example: '2024-12-31T23:59:59Z',
    description: 'End date for data range',
  })
  @IsDateString()
  @IsOptional()
  endDate?: string;

  @ApiPropertyOptional({
    example: 'station123',
    description: 'Filter by station ID',
  })
  @IsOptional()
  stationId?: string;
}
