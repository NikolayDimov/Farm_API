import { MigrationInterface, QueryRunner, Table, TableForeignKey } from "typeorm";

export class Processing1705954278732 implements MigrationInterface {
    public async up(queryRunner: QueryRunner): Promise<void> {
        // Processing table
        await queryRunner.createTable(
            new Table({
                name: "processing",
                columns: [
                    {
                        name: "id",
                        type: "uuid",
                        isPrimary: true,
                        isGenerated: true,
                        generationStrategy: "uuid",
                    },
                    {
                        name: "date",
                        type: "date",
                        isNullable: false,
                    },
                    {
                        name: "growing_crop_period_id",
                        type: "uuid",
                        isNullable: false,
                    },
                    {
                        name: "processing_type_id",
                        type: "uuid",
                        isNullable: false,
                    },
                    {
                        name: "machine_id",
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

        await queryRunner.createForeignKey(
            "processing",
            new TableForeignKey({
                columnNames: ["growing_crop_period_id"],
                referencedColumnNames: ["id"],
                referencedTableName: "growing_crop_period",
            })
        );
        await queryRunner.createForeignKey(
            "processing",
            new TableForeignKey({
                columnNames: ["processing_type_id"],
                referencedColumnNames: ["id"],
                referencedTableName: "processing_type",
            })
        );
        await queryRunner.createForeignKey(
            "processing",
            new TableForeignKey({
                columnNames: ["machine_id"],
                referencedColumnNames: ["id"],
                referencedTableName: "machine",
            })
        );
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        const tableProcessingGrowingCrop = await queryRunner.getTable("processing");
        const foreignKeyProcessingGrowingCrop = tableProcessingGrowingCrop.foreignKeys.find((fk) => fk.columnNames.indexOf("growing_cro_period_id") !== -1);
        await queryRunner.dropForeignKey("processing", foreignKeyProcessingGrowingCrop);

        const tableProcessingProcessingType = await queryRunner.getTable("processing");
        const foreignKeyProcessingGrowingProcessingType = tableProcessingProcessingType.foreignKeys.find((fk) => fk.columnNames.indexOf("processing_type_id") !== -1);
        await queryRunner.dropForeignKey("processing", foreignKeyProcessingGrowingProcessingType);

        const tableProcessingMachine = await queryRunner.getTable("processing");
        const foreignKeyProcessingGrowingMachine = tableProcessingMachine.foreignKeys.find((fk) => fk.columnNames.indexOf("machine_id") !== -1);
        await queryRunner.dropForeignKey("processing", foreignKeyProcessingGrowingMachine);

        await queryRunner.dropTable("processing");
    }
}
