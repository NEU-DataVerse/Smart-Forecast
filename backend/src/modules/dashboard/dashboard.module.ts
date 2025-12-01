import { Module, forwardRef } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DashboardController } from './dashboard.controller';
import { DashboardService } from './dashboard.service';
import { StationsModule } from '../stations/stations.module';
import { AlertModule } from '../alert/alert.module';
import { IncidentModule } from '../incident/incident.module';
import { IngestionModule } from '../ingestion/ingestion.module';
import { AlertEntity } from '../alert/entities/alert.entity';
import { IncidentEntity } from '../incident/entities/incident.entity';

/**
 * Dashboard Module
 * Aggregates statistics from multiple modules for dashboard display
 */
@Module({
  imports: [
    TypeOrmModule.forFeature([AlertEntity, IncidentEntity]),
    StationsModule,
    forwardRef(() => AlertModule),
    IncidentModule,
    IngestionModule,
  ],
  controllers: [DashboardController],
  providers: [DashboardService],
  exports: [DashboardService],
})
export class DashboardModule {}
