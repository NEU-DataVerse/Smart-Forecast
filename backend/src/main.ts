import { NestFactory, Reflector } from '@nestjs/core';
import { ValidationPipe, ClassSerializerInterceptor } from '@nestjs/common';
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

  // Enable class serializer to exclude sensitive fields
  app.useGlobalInterceptors(new ClassSerializerInterceptor(app.get(Reflector)));

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
    .addTag('Public NGSI-LD', 'Public read-only NGSI-LD API (no auth required)')
    .addBearerAuth()
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document, {
    swaggerOptions: {
      persistAuthorization: true,
    },
  });

  // Enable CORS
  // Public API routes: allow all origins
  // Protected API routes: restrict to specific origins
  app.enableCors({
    origin: (origin, callback) => {
      // Allow requests with no origin (mobile apps, Postman, curl, etc.)
      if (!origin) {
        return callback(null, true);
      }
      // Allow all origins for now (demo mode)
      // In production, you may want to restrict this
      return callback(null, true);
    },
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
