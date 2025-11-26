import {
  MigrationInterface,
  QueryRunner,
  Table,
  TableForeignKey,
} from 'typeorm';

export class CreateAlertTable1763982104845 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(
      new Table({
        name: 'alerts',
        columns: [
          {
            name: 'id',
            type: 'uuid',
            isPrimary: true,
            generationStrategy: 'uuid',
            default: 'uuid_generate_v4()',
          },
          {
            name: 'level',
            type: 'varchar',
            length: '50',
          },
          {
            name: 'type',
            type: 'varchar',
            length: '50',
          },
          {
            name: 'title',
            type: 'text',
          },
          {
            name: 'message',
            type: 'text',
          },
          {
            name: 'area',
            type: 'jsonb',
            isNullable: true,
          },
          {
            name: 'sentAt',
            type: 'timestamp',
          },
          {
            name: 'expiresAt',
            type: 'timestamp',
            isNullable: true,
          },
          {
            name: 'sentCount',
            type: 'int',
            default: 0,
          },
          {
            name: 'createdBy',
            type: 'uuid',
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

    // Add foreign key for createdBy
    await queryRunner.createForeignKey(
      'alerts',
      new TableForeignKey({
        columnNames: ['createdBy'],
        referencedTableName: 'users',
        referencedColumnNames: ['id'],
        onDelete: 'CASCADE',
      }),
    );

    // Create indexes
    await queryRunner.query(
      `CREATE INDEX "IDX_alerts_level" ON "alerts" ("level")`,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_alerts_type" ON "alerts" ("type")`,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_alerts_sentAt" ON "alerts" ("sentAt")`,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_alerts_expiresAt" ON "alerts" ("expiresAt")`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropTable('alerts');
  }
}
