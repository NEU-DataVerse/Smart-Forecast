import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ReportsController } from './reports.controller';
import { ReportsService } from './reports.service';
import { WeatherObservedEntity } from '../persistence/entities/weather-observed.entity';
import { AirQualityObservedEntity } from '../persistence/entities/air-quality-observed.entity';
import { IncidentEntity } from '../incident/entities/incident.entity';
import { StationEntity } from '../stations/entities/station.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      WeatherObservedEntity,
      AirQualityObservedEntity,
      IncidentEntity,
      StationEntity,
    ]),
  ],
  controllers: [ReportsController],
  providers: [ReportsService],
  exports: [ReportsService],
})
export class ReportsModule {}
