import { ApiProperty } from '@nestjs/swagger';

export class StationStatsDto {
  @ApiProperty({ description: 'Total number of stations' })
  total: number;

  @ApiProperty({ description: 'Number of active stations' })
  active: number;

  @ApiProperty({ description: 'Number of inactive stations' })
  inactive: number;

  @ApiProperty({ description: 'Number of stations in maintenance' })
  maintenance: number;
}

export class AlertStatsByLevelDto {
  @ApiProperty({ description: 'Number of LOW level alerts' })
  LOW: number;

  @ApiProperty({ description: 'Number of MEDIUM level alerts' })
  MEDIUM: number;

  @ApiProperty({ description: 'Number of HIGH level alerts' })
  HIGH: number;

  @ApiProperty({ description: 'Number of CRITICAL level alerts' })
  CRITICAL: number;
}

export class AlertStatsDto {
  @ApiProperty({ description: 'Total number of alerts' })
  total: number;

  @ApiProperty({ description: 'Number of currently active alerts' })
  activeCount: number;

  @ApiProperty({
    description: 'Alert count by level',
    type: AlertStatsByLevelDto,
  })
  byLevel: AlertStatsByLevelDto;
}

export class IncidentStatsDto {
  @ApiProperty({ description: 'Total number of incidents' })
  total: number;

  @ApiProperty({ description: 'Number of pending incidents' })
  pending: number;

  @ApiProperty({ description: 'Number of verified incidents' })
  verified: number;

  @ApiProperty({ description: 'Number of in-progress incidents' })
  inProgress: number;

  @ApiProperty({ description: 'Number of resolved incidents' })
  resolved: number;
}

export class IngestionHealthDto {
  @ApiProperty({ description: 'OpenWeatherMap API status' })
  owm: boolean;

  @ApiProperty({ description: 'Orion-LD Context Broker status' })
  orion: boolean;
}

export class DashboardSummaryDto {
  @ApiProperty({ description: 'Station statistics', type: StationStatsDto })
  stations: StationStatsDto;

  @ApiProperty({ description: 'Alert statistics', type: AlertStatsDto })
  alerts: AlertStatsDto;

  @ApiProperty({ description: 'Incident statistics', type: IncidentStatsDto })
  incidents: IncidentStatsDto;

  @ApiProperty({
    description: 'Ingestion service health',
    type: IngestionHealthDto,
  })
  ingestion: IngestionHealthDto;

  @ApiProperty({ description: 'Timestamp of summary generation' })
  timestamp: string;
}
