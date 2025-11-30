import { Module, forwardRef } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ScheduleModule } from '@nestjs/schedule';
import { ConfigModule } from '@nestjs/config';
import { AlertController } from './alert.controller';
import { AlertThresholdController } from './alert-threshold.controller';
import { AlertService } from './alert.service';
import { AlertThresholdService } from './alert-threshold.service';
import { AlertScheduler } from './alert.scheduler';
import { FcmCleanupScheduler } from './fcm-cleanup.scheduler';
import { AlertEntity } from './entities/alert.entity';
import { AlertThresholdEntity } from './entities/alert-threshold.entity';
import { FirebaseService } from './services/firebase.service';
import { FcmService } from './services/fcm.service';
import { User } from '../user/entities/user.entity';
import { UserModule } from '../user/user.module';
import { WeatherModule } from '../weather/weather.module';
import { AirQualityModule } from '../air-quality/air-quality.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([AlertEntity, AlertThresholdEntity, User]),
    ScheduleModule.forRoot(),
    ConfigModule,
    forwardRef(() => UserModule),
    forwardRef(() => WeatherModule),
    forwardRef(() => AirQualityModule),
  ],
  controllers: [AlertController, AlertThresholdController],
  providers: [
    AlertService,
    AlertThresholdService,
    AlertScheduler,
    FcmCleanupScheduler,
    FirebaseService,
    FcmService,
  ],
  exports: [AlertService, AlertThresholdService, FcmService],
})
export class AlertModule {}
