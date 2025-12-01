import {
  MigrationInterface,
  QueryRunner,
  TableColumn,
  TableForeignKey,
} from 'typeorm';

export class AddIncidentIdToAlert1733072400000 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    // Add missing columns from entity that were not in original migration
    // Check if columns exist before adding
    const table = await queryRunner.getTable('alerts');

    if (!table?.findColumnByName('advice')) {
      await queryRunner.addColumn(
        'alerts',
        new TableColumn({
          name: 'advice',
          type: 'text',
          isNullable: true,
        }),
      );
    }

    if (!table?.findColumnByName('isAutomatic')) {
      await queryRunner.addColumn(
        'alerts',
        new TableColumn({
          name: 'isAutomatic',
          type: 'boolean',
          default: false,
        }),
      );
    }

    if (!table?.findColumnByName('sourceData')) {
      await queryRunner.addColumn(
        'alerts',
        new TableColumn({
          name: 'sourceData',
          type: 'jsonb',
          isNullable: true,
        }),
      );
    }

    if (!table?.findColumnByName('stationId')) {
      await queryRunner.addColumn(
        'alerts',
        new TableColumn({
          name: 'stationId',
          type: 'varchar',
          isNullable: true,
        }),
      );
    }

    // Add incidentId column
    await queryRunner.addColumn(
      'alerts',
      new TableColumn({
        name: 'incidentId',
        type: 'uuid',
        isNullable: true,
      }),
    );

    // Add foreign key to incidents table
    await queryRunner.createForeignKey(
      'alerts',
      new TableForeignKey({
        name: 'FK_alerts_incidentId',
        columnNames: ['incidentId'],
        referencedTableName: 'incidents',
        referencedColumnNames: ['id'],
        onDelete: 'SET NULL',
      }),
    );

    // Create index for incidentId
    await queryRunner.query(
      `CREATE INDEX "IDX_alerts_incidentId" ON "alerts" ("incidentId")`,
    );

    // Make createdBy nullable (for auto-generated alerts)
    await queryRunner.changeColumn(
      'alerts',
      'createdBy',
      new TableColumn({
        name: 'createdBy',
        type: 'uuid',
        isNullable: true,
      }),
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    // Drop index
    await queryRunner.query(`DROP INDEX IF EXISTS "IDX_alerts_incidentId"`);

    // Drop foreign key
    await queryRunner.dropForeignKey('alerts', 'FK_alerts_incidentId');

    // Drop columns
    await queryRunner.dropColumn('alerts', 'incidentId');

    const table = await queryRunner.getTable('alerts');
    if (table?.findColumnByName('advice')) {
      await queryRunner.dropColumn('alerts', 'advice');
    }
    if (table?.findColumnByName('isAutomatic')) {
      await queryRunner.dropColumn('alerts', 'isAutomatic');
    }
    if (table?.findColumnByName('sourceData')) {
      await queryRunner.dropColumn('alerts', 'sourceData');
    }
    if (table?.findColumnByName('stationId')) {
      await queryRunner.dropColumn('alerts', 'stationId');
    }

    // Revert createdBy to non-nullable
    await queryRunner.changeColumn(
      'alerts',
      'createdBy',
      new TableColumn({
        name: 'createdBy',
        type: 'uuid',
        isNullable: false,
      }),
    );
  }
}
