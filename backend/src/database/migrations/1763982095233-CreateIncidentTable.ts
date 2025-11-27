import {
  MigrationInterface,
  QueryRunner,
  Table,
  TableForeignKey,
} from 'typeorm';

export class CreateIncidentTable1763982095233 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(
      new Table({
        name: 'incidents',
        columns: [
          {
            name: 'id',
            type: 'uuid',
            isPrimary: true,
            generationStrategy: 'uuid',
            default: 'uuid_generate_v4()',
          },
          {
            name: 'type',
            type: 'varchar',
            length: '50',
          },
          {
            name: 'description',
            type: 'text',
          },
          {
            name: 'location',
            type: 'jsonb',
          },
          {
            name: 'imageUrls',
            type: 'text',
          },
          {
            name: 'status',
            type: 'varchar',
            length: '50',
            default: "'PENDING'",
          },
          {
            name: 'reportedBy',
            type: 'uuid',
          },
          {
            name: 'verifiedBy',
            type: 'uuid',
            isNullable: true,
          },
          {
            name: 'adminNotes',
            type: 'text',
            isNullable: true,
          },
          {
            name: 'createdAt',
            type: 'timestamp',
            default: 'CURRENT_TIMESTAMP',
          },
          {
            name: 'updatedAt',
            type: 'timestamp',
            default: 'CURRENT_TIMESTAMP',
          },
        ],
      }),
      true,
    );

    // Add foreign key for reportedBy
    await queryRunner.createForeignKey(
      'incidents',
      new TableForeignKey({
        columnNames: ['reportedBy'],
        referencedTableName: 'users',
        referencedColumnNames: ['id'],
        onDelete: 'CASCADE',
      }),
    );

    // Add foreign key for verifiedBy
    await queryRunner.createForeignKey(
      'incidents',
      new TableForeignKey({
        columnNames: ['verifiedBy'],
        referencedTableName: 'users',
        referencedColumnNames: ['id'],
        onDelete: 'SET NULL',
      }),
    );

    // Create indexes
    await queryRunner.query(
      `CREATE INDEX "IDX_incidents_type" ON "incidents" ("type")`,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_incidents_status" ON "incidents" ("status")`,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_incidents_reportedBy" ON "incidents" ("reportedBy")`,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_incidents_createdAt" ON "incidents" ("createdAt")`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropTable('incidents');
  }
}
