import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { WeatherController } from './weather.controller';
import { WeatherService } from './weather.service';
import { WeatherObservedEntity } from '../persistence/entities/weather-observed.entity';
import { IngestionModule } from '../ingestion/ingestion.module';

/**
 * Weather Module
 * Provides REST API for weather data (current, forecast, historical)
 */
@Module({
  imports: [
    TypeOrmModule.forFeature([WeatherObservedEntity]),
    IngestionModule, // For OrionClientProvider
  ],
  controllers: [WeatherController],
  providers: [WeatherService],
  exports: [WeatherService],
})
export class WeatherModule {}
