import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { WeatherController } from './weather.controller';
import { WeatherService } from './weather.service';
import { WeatherObservedEntity } from '../persistence/entities/weather-observed.entity';
import { WeatherForecastEntity } from '../persistence/entities/weather-forecast.entity';
import { IngestionModule } from '../ingestion/ingestion.module';
import { StationsModule } from '../stations/stations.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([WeatherObservedEntity, WeatherForecastEntity]),
    IngestionModule,
    StationsModule,
  ],
  controllers: [WeatherController],
  providers: [WeatherService],
  exports: [WeatherService],
})
export class WeatherModule {}
