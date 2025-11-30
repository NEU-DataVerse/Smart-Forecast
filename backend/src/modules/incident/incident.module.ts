import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { IncidentController } from './incident.controller';
import { IncidentService } from './incident.service';
import { IncidentEntity } from './entities/incident.entity';
import { FileModule } from '../file/file.module';

@Module({
  imports: [TypeOrmModule.forFeature([IncidentEntity]), FileModule],
  controllers: [IncidentController],
  providers: [IncidentService],
  exports: [IncidentService],
})
export class IncidentModule {}
