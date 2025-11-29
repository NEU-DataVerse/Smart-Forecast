import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ScheduleModule } from '@nestjs/schedule';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './modules/auth/auth.module';
import { UserModule } from './modules/user/user.module';
import { StationsModule } from './modules/stations/stations.module';
import { IngestionModule } from './modules/ingestion/ingestion.module';
import { PersistenceModule } from './modules/persistence/persistence.module';
import { AirQualityModule } from './modules/air-quality/air-quality.module';
import { WeatherModule } from './modules/weather/weather.module';
import { FileModule } from './modules/file/file.module';
import { IncidentModule } from './modules/incident/incident.module';
import { AlertModule } from './modules/alert/alert.module';
import { ReportsModule } from './modules/reports/reports.module';
import {
  appConfig,
  databaseConfig,
  jwtConfig,
  orionConfig,
  minioConfig,
  firebaseConfig,
  googleConfig,
  openweathermapConfig,
} from './config';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      load: [
        appConfig,
        databaseConfig,
        jwtConfig,
        orionConfig,
        minioConfig,
        firebaseConfig,
        googleConfig,
        openweathermapConfig,
      ],
      envFilePath: '.env',
    }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: (configService: ConfigService) =>
        configService.get('database') || {},
      inject: [ConfigService],
    }),
    ScheduleModule.forRoot(),
    IngestionModule,
    PersistenceModule,
    StationsModule,
    AuthModule,
    UserModule,
    AirQualityModule,
    WeatherModule,
    FileModule,
    IncidentModule,
    AlertModule,
    ReportsModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
