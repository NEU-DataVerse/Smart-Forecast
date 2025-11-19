import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { ScheduleModule } from '@nestjs/schedule';
import { IngestionService } from './ingestion.service';
import { IngestionController } from './ingestion.controller';
import { OpenWeatherMapProvider } from './providers/openweathermap.provider';
import { OrionClientProvider } from './providers/orion-client.provider';
import { IngestionScheduler } from './schedulers/ingestion.scheduler';

@Module({
  imports: [ConfigModule, ScheduleModule.forRoot()],
  controllers: [IngestionController],
  providers: [
    IngestionService,
    OpenWeatherMapProvider,
    OrionClientProvider,
    IngestionScheduler,
  ],
  exports: [IngestionService, OrionClientProvider],
})
export class IngestionModule {}
