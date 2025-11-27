import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const configService = app.get(ConfigService);

  // Enable validation
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
    }),
  );

  // Set global API prefix
  const apiPrefix = configService.get<string>('app.apiPrefix') || 'api/v1';
  app.setGlobalPrefix(apiPrefix);

  // Setup Swagger documentation
  const config = new DocumentBuilder()
    .setTitle('Smart Forecast API')
    .setDescription(
      'Smart Environmental Alert Platform - REST API Documentation',
    )
    .setVersion('1.0')
    .addTag('App', '')
    .addTag('Authentication', 'Authentication endpoints')
    .addTag('User', 'User management')
    .addTag('Stations', 'Weather station management')
    .addTag('Weather', 'Weather data endpoints')
    .addTag('Air Quality', 'Air quality data endpoints')
    .addTag('File', 'File upload (MinIO)')
    .addTag('Incident', 'Incident report management')
    .addTag('Alert', 'Emergency alert system')
    .addBearerAuth()
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document, {
    swaggerOptions: {
      persistAuthorization: true,
    },
  });

  // Enable CORS
  app.enableCors({
    origin: ['http://localhost:3000', 'http://localhost:3001'],
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
  });

  const port = configService.get<number>('app.port') || 8000;
  await app.listen(port);

  console.log(`Application is running on: http://localhost:${port}`);
  console.log(`API endpoints are prefixed with: /${apiPrefix}`);
  console.log(`Swagger documentation: http://localhost:${port}/api`);
}

void bootstrap();
