import { Module } from '@nestjs/common';
import { HttpModule } from '@nestjs/axios';
import { AirQualityService } from './services/airquality.service';
import { OpenAQService } from './services/openaq.service';
import { OrionService } from './services/orion.service';

@Module({
  imports: [HttpModule],
  providers: [AirQualityService, OpenAQService, OrionService],
  exports: [AirQualityService, OpenAQService, OrionService],
})
export class AirQualityModule {}
