import { Module } from '@nestjs/common';
import { HttpModule } from '@nestjs/axios';
import { WeatherService } from './services/weather.service';
import { OpenWeatherMapService } from './services/openweathermap.service';
import { OrionService } from '../airquality/services/orion.service';

@Module({
  imports: [HttpModule],
  providers: [WeatherService, OpenWeatherMapService, OrionService],
  exports: [WeatherService, OpenWeatherMapService],
})
export class WeatherModule {}
