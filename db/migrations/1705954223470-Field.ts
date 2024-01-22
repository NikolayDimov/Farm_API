import { MigrationInterface, QueryRunner, Table, TableForeignKey, TableIndex } from "typeorm";

export class Field1705954223470 implements MigrationInterface {
    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.createTable(
            new Table({
                name: "field",
                columns: [
                    {
                        name: "id",
                        type: "uuid",
                        isPrimary: true,
                        isGenerated: true,
                        generationStrategy: "uuid",
                    },
                    {
                        name: "name",
                        type: "varchar",
                        length: "120",
                        isNullable: false,
                    },
                    {
                        name: "boundary",
                        type: "jsonb",
                        isNullable: false,
                    },
                    {
                        name: "farm_id",
                        type: "uuid",
                        isNullable: false,
                    },
                    {
                        name: "soil_id",
                        type: "uuid",
                        isNullable: false,
                    },
                    {
                        name: "created_at",
                        type: "timestamp",
                        default: "now()",
                        isNullable: false,
                    },
                    {
                        name: "updated_at",
                        type: "timestamp",
                        default: "now()",
                        isNullable: false,
                    },
                    {
                        name: "deleted_at",
                        type: "timestamp",
                        isNullable: true,
                    },
                ],
            })
        );

        await queryRunner.createIndex(
            "field",
            new TableIndex({
                name: "IDX_FIELD_ID",
                columnNames: ["id"],
            })
        );

        await queryRunner.createForeignKey(
            "field",
            new TableForeignKey({
                columnNames: ["farm_id"],
                referencedColumnNames: ["id"],
                referencedTableName: "farm",
            })
        );
        await queryRunner.createForeignKey(
            "field",
            new TableForeignKey({
                columnNames: ["soil_id"],
                referencedColumnNames: ["id"],
                referencedTableName: "soil",
            })
        );
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        const tableFieldFarm = await queryRunner.getTable("field");
        const foreignKeyFieldFarm = tableFieldFarm.foreignKeys.find((fk) => fk.columnNames.indexOf("farm_id") !== -1);
        await queryRunner.dropForeignKey("field", foreignKeyFieldFarm);

        const tableFieldSoil = await queryRunner.getTable("field");
        const foreignKeyFieldSoil = tableFieldSoil.foreignKeys.find((fk) => fk.columnNames.indexOf("soil_id") !== -1);
        await queryRunner.dropForeignKey("soil", foreignKeyFieldSoil);

        await queryRunner.dropTable("field");
    }
}
