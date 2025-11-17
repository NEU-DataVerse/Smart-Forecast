import { Module } from '@nestjs/common';
import { HttpModule } from '@nestjs/axios';
import { AirQualityService } from './services/airquality.service';
import { AirPollutionService } from './services/openaq.service';
import { OrionService } from './services/orion.service';

@Module({
  imports: [HttpModule],
  providers: [AirQualityService, AirPollutionService, OrionService],
  exports: [AirQualityService, AirPollutionService, OrionService],
})
export class AirQualityModule {}
