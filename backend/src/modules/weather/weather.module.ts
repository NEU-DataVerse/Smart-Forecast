import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { WeatherController } from './weather.controller';
import { WeatherService } from './weather.service';
import { WeatherObservedEntity } from '../persistence/entities/weather-observed.entity';
import { IngestionModule } from '../ingestion/ingestion.module';
import { StationsModule } from '../stations/stations.module';

/**
 * Weather Module
 * Provides REST API for weather data (current, forecast, historical)
 */
@Module({
  imports: [
    TypeOrmModule.forFeature([WeatherObservedEntity]),
    IngestionModule, // For OrionClientProvider
    StationsModule, // For StationService (GPS-based queries)
  ],
  controllers: [WeatherController],
  providers: [WeatherService],
  exports: [WeatherService],
})
export class WeatherModule {}
