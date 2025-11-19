import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ScheduleModule } from '@nestjs/schedule';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './modules/auth/auth.module';
import { UserModule } from './modules/user/user.module';
import { AirQualityModule } from './modules/airquality/airquality.module';
import { WeatherModule } from './modules/weather/weather.module';
import { IngestionModule } from './modules/ingestion/ingestion.module';
import { PersistenceModule } from './modules/persistence/persistence.module';
import { appConfig, databaseConfig, jwtConfig, orionConfig } from './config';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      load: [appConfig, databaseConfig, jwtConfig, orionConfig],
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
    AuthModule,
    UserModule,
    AirQualityModule,
    WeatherModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
