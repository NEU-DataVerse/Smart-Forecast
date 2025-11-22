import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { StationController } from './station.controller';
import { StationService } from './station.service';
import { StationEntity } from './entities/station.entity';
import { StationRepository } from './repositories/station.repository';

/**
 * Stations Module
 * Manages weather station data and CRUD operations
 */
@Module({
  imports: [TypeOrmModule.forFeature([StationEntity])],
  controllers: [StationController],
  providers: [StationService, StationRepository],
  exports: [StationService],
})
export class StationsModule {}
