import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AlertController } from './alert.controller';
import { AlertService } from './alert.service';
import { AlertEntity } from './entities/alert.entity';
import { FirebaseService } from './services/firebase.service';
import { FcmService } from './services/fcm.service';
import { User } from '../user/entities/user.entity';

@Module({
  imports: [TypeOrmModule.forFeature([AlertEntity, User])],
  controllers: [AlertController],
  providers: [AlertService, FirebaseService, FcmService],
  exports: [AlertService, FcmService],
})
export class AlertModule {}
