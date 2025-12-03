import { Module } from '@nestjs/common';
import { PublicApiController } from './public-api.controller';
import { IngestionModule } from '../ingestion/ingestion.module';

/**
 * Public API Module
 * Provides public read-only access to NGSI-LD entities from Orion-LD
 * No authentication required - designed for external consumers
 */
@Module({
  imports: [IngestionModule], // Import to use OrionClientProvider
  controllers: [PublicApiController],
})
export class PublicApiModule {}
