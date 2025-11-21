import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { ScheduleModule } from '@nestjs/schedule';
import { IngestionService } from './ingestion.service';
import { IngestionController } from './ingestion.controller';
import { StationController } from './station.controller';
import { OpenWeatherMapProvider } from './providers/openweathermap.provider';
import { OrionClientProvider } from './providers/orion-client.provider';
import { StationManagerService } from './providers/station-manager.provider';
import { IngestionScheduler } from './schedulers/ingestion.scheduler';

@Module({
  imports: [ConfigModule, ScheduleModule.forRoot()],
  controllers: [IngestionController, StationController],
  providers: [
    IngestionService,
    OpenWeatherMapProvider,
    OrionClientProvider,
    StationManagerService,
    IngestionScheduler,
  ],
  exports: [IngestionService, OrionClientProvider, StationManagerService],
})
export class IngestionModule {}
