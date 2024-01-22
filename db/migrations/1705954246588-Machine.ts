import { MigrationInterface, QueryRunner, Table, TableForeignKey, TableIndex } from "typeorm";

export class Machine1705954246588 implements MigrationInterface {
    public async up(queryRunner: QueryRunner): Promise<void> {
        // Machine table
        await queryRunner.createTable(
            new Table({
                name: "machine",
                columns: [
                    {
                        name: "id",
                        type: "uuid",
                        isPrimary: true,
                        isGenerated: true,
                        generationStrategy: "uuid",
                    },
                    {
                        name: "brand",
                        type: "varchar",
                        length: "120",
                        isNullable: false,
                    },
                    {
                        name: "model",
                        type: "varchar",
                        length: "120",
                        isNullable: false,
                    },
                    {
                        name: "register_number",
                        type: "varchar",
                        length: "120",
                        isNullable: false,
                    },
                    {
                        name: "farm_id",
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

        // Mchine index
        await queryRunner.createIndex(
            "crop",
            new TableIndex({
                name: "IDX_MACHINE_ID",
                columnNames: ["id"],
            })
        );

        await queryRunner.createForeignKey(
            "machine",
            new TableForeignKey({
                columnNames: ["farm_id"],
                referencedColumnNames: ["id"],
                referencedTableName: "farm",
            })
        );
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        const tableMachine = await queryRunner.getTable("machine");
        const foreignKeyMachineFarm = tableMachine.foreignKeys.find((fk) => fk.columnNames.indexOf("farm_id") !== -1);
        await queryRunner.dropForeignKey("machine", foreignKeyMachineFarm);

        await queryRunner.dropTable("machine");
    }
}
