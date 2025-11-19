import { Injectable, Logger } from '@nestjs/common';
import { Cron } from '@nestjs/schedule';
import { InjectDataSource } from '@nestjs/typeorm';
import { DataSource } from 'typeorm';

/**
 * Partition Management Scheduler
 * Manages PostgreSQL table partitions for Cygnus historical data
 * - Creates monthly partitions for Cygnus tables
 * - Drops partitions older than 24 months
 * Runs on the 1st day of each month at 1:00 AM
 */
@Injectable()
export class PartitionManagementScheduler {
  private readonly logger = new Logger(PartitionManagementScheduler.name);

  // Cygnus table names (URL-encoded entity types)
  private readonly cygnusTables = [
    'x002furn_x003angsi_x002dld_x003aairqualityobserved',
    'x002furn_x003angsi_x002dld_x003aweatherobserved',
  ];

  // Retention period in months
  private readonly retentionMonths = 24;

  constructor(
    @InjectDataSource()
    private readonly dataSource: DataSource,
  ) {}

  /**
   * Scheduled task - Runs on 1st day of month at 1:00 AM
   */
  @Cron('0 1 1 * *', {
    name: 'partition-management',
    timeZone: 'Asia/Ho_Chi_Minh',
  })
  async managePartitions() {
    this.logger.log('Starting partition management...');

    try {
      // Check if partitioning is initialized
      const initialized = await this.checkPartitioningInitialized();

      if (!initialized) {
        this.logger.log('Partitioning not initialized, setting up...');
        await this.initializePartitioning();
      }

      // Create future partitions (next 3 months)
      await this.createFuturePartitions(3);

      // Drop old partitions (older than retention period)
      await this.dropOldPartitions();

      this.logger.log('Partition management completed successfully');
    } catch (error) {
      this.logger.error(
        'Partition management failed',
        error.message,
        error.stack,
      );
    }
  }

  /**
   * Check if Cygnus tables exist and are partitioned
   */
  private async checkPartitioningInitialized(): Promise<boolean> {
    try {
      for (const tableName of this.cygnusTables) {
        const result = await this.dataSource.query(
          `
          SELECT EXISTS (
            SELECT FROM pg_tables 
            WHERE schemaname = 'public' 
            AND tablename = $1
          ) as exists
          `,
          [tableName],
        );

        if (!result[0]?.exists) {
          this.logger.debug(`Table ${tableName} does not exist yet`);
          return false;
        }

        // Check if table is partitioned
        const partitionCheck = await this.dataSource.query(
          `
          SELECT partstrat 
          FROM pg_partitioned_table pt
          JOIN pg_class c ON pt.partrelid = c.oid
          WHERE c.relname = $1
          `,
          [tableName],
        );

        if (partitionCheck.length === 0) {
          this.logger.debug(`Table ${tableName} is not partitioned`);
          return false;
        }
      }

      this.logger.debug('All Cygnus tables are partitioned');
      return true;
    } catch (error) {
      this.logger.error('Error checking partitioning status', error.message);
      return false;
    }
  }

  /**
   * Initialize partitioning for Cygnus tables
   * Note: This requires tables to be created by Cygnus first
   */
  private async initializePartitioning(): Promise<void> {
    this.logger.log('Initializing partitioning for Cygnus tables...');

    for (const tableName of this.cygnusTables) {
      try {
        // Check if table exists
        const tableExists = await this.dataSource.query(
          `
          SELECT EXISTS (
            SELECT FROM pg_tables 
            WHERE schemaname = 'public' 
            AND tablename = $1
          ) as exists
          `,
          [tableName],
        );

        if (!tableExists[0]?.exists) {
          this.logger.warn(
            `Table ${tableName} does not exist yet, skipping partitioning`,
          );
          continue;
        }

        this.logger.log(`Converting ${tableName} to partitioned table...`);

        // Rename original table
        const tempTableName = `${tableName}_temp`;
        await this.dataSource.query(
          `ALTER TABLE "${tableName}" RENAME TO "${tempTableName}"`,
        );

        // Create partitioned table with same structure
        await this.dataSource.query(`
          CREATE TABLE "${tableName}" (LIKE "${tempTableName}" INCLUDING ALL)
          PARTITION BY RANGE (recvtime)
        `);

        // Create partitions for current month and next 2 months
        await this.createPartitionsForTable(tableName, 0, 3);

        // Copy data from temp table to partitioned table
        this.logger.log(
          `Copying data from ${tempTableName} to ${tableName}...`,
        );
        await this.dataSource.query(
          `INSERT INTO "${tableName}" SELECT * FROM "${tempTableName}"`,
        );

        // Drop temp table
        await this.dataSource.query(`DROP TABLE "${tempTableName}"`);

        this.logger.log(`✓ Successfully partitioned ${tableName}`);
      } catch (error) {
        this.logger.error(
          `Failed to initialize partitioning for ${tableName}`,
          error.message,
        );
        // Continue with other tables
      }
    }
  }

  /**
   * Create future partitions for all tables
   */
  private async createFuturePartitions(monthsAhead: number): Promise<void> {
    this.logger.log(`Creating partitions for next ${monthsAhead} months...`);

    for (const tableName of this.cygnusTables) {
      try {
        await this.createPartitionsForTable(tableName, 0, monthsAhead);
      } catch (error) {
        this.logger.error(
          `Failed to create partitions for ${tableName}`,
          error.message,
        );
      }
    }
  }

  /**
   * Create partitions for a specific table
   */
  private async createPartitionsForTable(
    tableName: string,
    startMonth: number,
    endMonth: number,
  ): Promise<void> {
    const now = new Date();

    for (let i = startMonth; i < endMonth; i++) {
      const partitionDate = new Date(now.getFullYear(), now.getMonth() + i, 1);
      const nextPartitionDate = new Date(
        partitionDate.getFullYear(),
        partitionDate.getMonth() + 1,
        1,
      );

      const partitionName = `${tableName}_${partitionDate.getFullYear()}_${String(partitionDate.getMonth() + 1).padStart(2, '0')}`;

      try {
        // Check if partition already exists
        const exists = await this.dataSource.query(
          `
          SELECT EXISTS (
            SELECT FROM pg_tables 
            WHERE schemaname = 'public' 
            AND tablename = $1
          ) as exists
          `,
          [partitionName],
        );

        if (exists[0]?.exists) {
          this.logger.debug(`Partition ${partitionName} already exists`);
          continue;
        }

        // Create partition
        await this.dataSource.query(`
          CREATE TABLE "${partitionName}" 
          PARTITION OF "${tableName}"
          FOR VALUES FROM ('${this.formatTimestamp(partitionDate)}') 
          TO ('${this.formatTimestamp(nextPartitionDate)}')
        `);

        this.logger.log(`✓ Created partition: ${partitionName}`);
      } catch (error) {
        this.logger.warn(
          `Failed to create partition ${partitionName}: ${error.message}`,
        );
      }
    }
  }

  /**
   * Drop partitions older than retention period
   */
  private async dropOldPartitions(): Promise<void> {
    this.logger.log(
      `Dropping partitions older than ${this.retentionMonths} months...`,
    );

    const cutoffDate = new Date();
    cutoffDate.setMonth(cutoffDate.getMonth() - this.retentionMonths);

    for (const tableName of this.cygnusTables) {
      try {
        // Get all partitions for this table
        const partitions = await this.dataSource.query(
          `
          SELECT 
            child.relname as partition_name
          FROM pg_inherits
          JOIN pg_class parent ON pg_inherits.inhparent = parent.oid
          JOIN pg_class child ON pg_inherits.inhrelid = child.oid
          WHERE parent.relname = $1
          `,
          [tableName],
        );

        for (const partition of partitions) {
          const partitionName = partition.partition_name;

          // Extract date from partition name (format: tablename_YYYY_MM)
          const dateMatch = partitionName.match(/_(\d{4})_(\d{2})$/);
          if (!dateMatch) {
            continue;
          }

          const year = parseInt(dateMatch[1], 10);
          const month = parseInt(dateMatch[2], 10) - 1; // 0-indexed
          const partitionDate = new Date(year, month, 1);

          if (partitionDate < cutoffDate) {
            this.logger.log(`Dropping old partition: ${partitionName}`);
            await this.dataSource.query(`DROP TABLE "${partitionName}"`);
          }
        }
      } catch (error) {
        this.logger.error(
          `Failed to drop old partitions for ${tableName}`,
          error.message,
        );
      }
    }
  }

  /**
   * Format date for PostgreSQL timestamp
   */
  private formatTimestamp(date: Date): string {
    return date.toISOString().replace('T', ' ').substring(0, 19);
  }

  /**
   * Manual trigger for partition management (for admin operations)
   */
  async triggerPartitionManagement(): Promise<{
    success: boolean;
    message: string;
  }> {
    this.logger.log('Manual partition management triggered');

    try {
      await this.managePartitions();
      return {
        success: true,
        message: 'Partition management completed successfully',
      };
    } catch (error) {
      this.logger.error('Manual partition management failed', error.message);
      return {
        success: false,
        message: error.message,
      };
    }
  }

  /**
   * Get partition information for all Cygnus tables
   */
  async getPartitionInfo(): Promise<any> {
    const info = {};

    for (const tableName of this.cygnusTables) {
      try {
        const partitions = await this.dataSource.query(
          `
          SELECT 
            child.relname as partition_name,
            pg_size_pretty(pg_total_relation_size(child.oid)) as size
          FROM pg_inherits
          JOIN pg_class parent ON pg_inherits.inhparent = parent.oid
          JOIN pg_class child ON pg_inherits.inhrelid = child.oid
          WHERE parent.relname = $1
          ORDER BY child.relname
          `,
          [tableName],
        );

        info[tableName] = {
          partitions: partitions,
          count: partitions.length,
        };
      } catch (error) {
        info[tableName] = {
          error: error.message,
        };
      }
    }

    return info;
  }
}
