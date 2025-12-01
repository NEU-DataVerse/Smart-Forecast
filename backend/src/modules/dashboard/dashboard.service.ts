import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { StationService } from '../stations/station.service';
import { AlertService } from '../alert/alert.service';
import { IncidentService } from '../incident/incident.service';
import { IngestionService } from '../ingestion/ingestion.service';
import { AlertEntity } from '../alert/entities/alert.entity';
import { IncidentEntity } from '../incident/entities/incident.entity';
import {
  DashboardSummaryDto,
  StationStatsDto,
  AlertStatsDto,
  IncidentStatsDto,
  IngestionHealthDto,
} from './dto/dashboard-summary.dto';
import { IncidentStatus } from '@smart-forecast/shared';

@Injectable()
export class DashboardService {
  private readonly logger = new Logger(DashboardService.name);

  constructor(
    private readonly stationService: StationService,
    private readonly alertService: AlertService,
    private readonly incidentService: IncidentService,
    private readonly ingestionService: IngestionService,
    @InjectRepository(AlertEntity)
    private readonly alertRepository: Repository<AlertEntity>,
    @InjectRepository(IncidentEntity)
    private readonly incidentRepository: Repository<IncidentEntity>,
  ) {}

  /**
   * Get dashboard summary with all statistics
   */
  async getSummary(): Promise<DashboardSummaryDto> {
    this.logger.debug('Generating dashboard summary...');

    const [stations, alerts, incidents, ingestion] = await Promise.all([
      this.getStationStats(),
      this.getAlertStats(),
      this.getIncidentStats(),
      this.getIngestionHealth(),
    ]);

    return {
      stations,
      alerts,
      incidents,
      ingestion,
      timestamp: new Date().toISOString(),
    };
  }

  /**
   * Get station statistics
   */
  private async getStationStats(): Promise<StationStatsDto> {
    return this.stationService.getStatistics();
  }

  /**
   * Get alert statistics
   */
  async getAlertStats(): Promise<AlertStatsDto> {
    // Get total alerts count
    const total = await this.alertRepository.count();

    // Get active alerts count
    const activeAlerts = await this.alertService.getActiveAlerts();
    const activeCount = activeAlerts.length;

    // Get alerts by level
    const byLevelRaw = await this.alertRepository
      .createQueryBuilder('alert')
      .select('alert.level', 'level')
      .addSelect('COUNT(*)', 'count')
      .groupBy('alert.level')
      .getRawMany();

    const byLevel = {
      LOW: 0,
      MEDIUM: 0,
      HIGH: 0,
      CRITICAL: 0,
    };

    byLevelRaw.forEach((item) => {
      if (item.level in byLevel) {
        byLevel[item.level as keyof typeof byLevel] = parseInt(item.count, 10);
      }
    });

    return {
      total,
      activeCount,
      byLevel,
    };
  }

  /**
   * Get incident statistics
   */
  private async getIncidentStats(): Promise<IncidentStatsDto> {
    // Get total incidents count
    const total = await this.incidentRepository.count();

    // Get incidents by status
    const byStatusRaw = await this.incidentRepository
      .createQueryBuilder('incident')
      .select('incident.status', 'status')
      .addSelect('COUNT(*)', 'count')
      .groupBy('incident.status')
      .getRawMany();

    const statusCounts = {
      pending: 0,
      verified: 0,
      inProgress: 0,
      resolved: 0,
    };

    byStatusRaw.forEach((item) => {
      const count = parseInt(item.count, 10);
      switch (item.status) {
        case IncidentStatus.PENDING:
          statusCounts.pending = count;
          break;
        case IncidentStatus.VERIFIED:
          statusCounts.verified = count;
          break;
        case IncidentStatus.IN_PROGRESS:
          statusCounts.inProgress = count;
          break;
        case IncidentStatus.RESOLVED:
          statusCounts.resolved = count;
          break;
      }
    });

    return {
      total,
      ...statusCounts,
    };
  }

  /**
   * Get ingestion service health
   */
  private async getIngestionHealth(): Promise<IngestionHealthDto> {
    return this.ingestionService.healthCheck();
  }
}
