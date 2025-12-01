/**
 * Database Seed Entry Point
 *
 * This script bootstraps a standalone NestJS application to run database seeding.
 *
 * Usage:
 *   npm run seed              - Run the seed (insert data if DB is empty)
 *   npm run seed:force        - Force reseed (clear + seed)
 *   npm run seed:clear        - Clear all seeded data
 *   npm run seed:reseed       - Alias for seed:force
 *   npm run seed:base         - Seed without fake weather/air-quality data
 *   npm run seed:base:force   - Force reseed without fake weather/air-quality data
 *
 * Or directly with ts-node:
 *   npx ts-node src/database/seeds/seed.ts [command] [options]
 *
 * Commands:
 *   (none)    - Seed if database is empty
 *   force     - Clear all data and reseed
 *   clear     - Clear all data
 *   reseed    - Alias for force
 *
 * Options:
 *   --skip-env  - Skip seeding fake weather and air-quality data
 *                 (use historical ingestion via UI for real data)
 */

import { NestFactory } from '@nestjs/core';
import { SeedModule } from './seed.module';
import { SeedService } from './seed.service';

async function bootstrap() {
  const startTime = Date.now();

  try {
    console.log('');
    console.log('╔════════════════════════════════════════════╗');
    console.log('║     🌱 Smart Forecast Database Seeder      ║');
    console.log('╚════════════════════════════════════════════╝');
    console.log('');

    // Create a standalone NestJS application context
    const app = await NestFactory.createApplicationContext(SeedModule, {
      logger: ['error', 'warn', 'log'],
    });

    // Get the SeedService from the application context
    const seedService = app.get(SeedService);

    // Parse command line arguments
    const args = process.argv.slice(2);
    const command = args[0]?.toLowerCase();
    const skipEnvData = args.includes('--skip-env') || args.includes('skipenv');

    if (skipEnvData) {
      console.log('⚠️  Option: --skip-env');
      console.log('   Skipping fake weather and air-quality data.');
      console.log('   Use "Historical Ingestion" in Dashboard for real data.');
      console.log('');
    }

    switch (command) {
      case 'clear':
        console.log('📋 Command: CLEAR');
        console.log('   Removing all data from database...');
        console.log('');
        await seedService.clear();
        break;

      case 'force':
      case 'reseed':
        console.log('📋 Command: RESEED (force)');
        console.log('   Clearing and reseeding all data...');
        console.log('');
        await seedService.reseed(skipEnvData);
        break;

      default:
        console.log('📋 Command: SEED');
        console.log('   Seeding data if database is empty...');
        console.log('');
        await seedService.run(false, skipEnvData);
        break;
    }

    // Close the application context
    await app.close();

    const elapsed = ((Date.now() - startTime) / 1000).toFixed(2);
    console.log('');
    console.log('════════════════════════════════════════════');
    console.log(`✅ Completed in ${elapsed}s`);
    console.log('════════════════════════════════════════════');
    console.log('');

    process.exit(0);
  } catch (error) {
    console.error('');
    console.error('════════════════════════════════════════════');
    console.error('❌ Seed process failed!');
    console.error('════════════════════════════════════════════');
    console.error('');
    console.error(error);
    process.exit(1);
  }
}

// Execute the bootstrap function
void bootstrap();
