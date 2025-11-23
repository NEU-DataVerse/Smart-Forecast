/**
 * Database Seed Entry Point
 *
 * This script bootstraps a standalone NestJS application to run database seeding.
 *
 * Usage:
 *   npm run seed              - Run the seed (insert data if DB is empty)
 *   npm run seed:clear        - Clear all seeded data
 *   npm run seed:reseed       - Clear and re-seed the database
 *
 * Or directly with ts-node:
 *   npx ts-node src/database/seeds/seed.ts
 */

import { NestFactory } from '@nestjs/core';
import { SeedModule } from './seed.module';
import { SeedService } from './seed.service';

async function bootstrap() {
  try {
    console.log('🌱 Starting database seed process...\n');

    // Create a standalone NestJS application context
    const app = await NestFactory.createApplicationContext(SeedModule, {
      logger: ['error', 'warn', 'log'],
    });

    // Get the SeedService from the application context
    const seedService = app.get(SeedService);

    // Parse command line arguments
    const args = process.argv.slice(2);
    const command = args[0];

    switch (command) {
      case 'clear':
        console.log('🗑️  Clearing database...\n');
        await seedService.clear();
        break;

      case 'reseed':
        console.log('🔄 Re-seeding database (clear + seed)...\n');
        await seedService.reseed();
        break;

      default:
        console.log('📦 Running seed...\n');
        await seedService.run();
        break;
    }

    // Close the application context
    await app.close();

    console.log('\n✅ Seed process completed successfully!');
    process.exit(0);
  } catch (error) {
    console.error('\n❌ Seed process failed:', error);
    process.exit(1);
  }
}

// Execute the bootstrap function
void bootstrap();
