import { MigrationInterface, QueryRunner, Table, TableForeignKey, TableIndex } from "typeorm";

export class GrowingCropPeriod1705954256653 implements MigrationInterface {
    public async up(queryRunner: QueryRunner): Promise<void> {
        // GrowingCropperiod table
        await queryRunner.createTable(
            new Table({
                name: "growing_crop_period",
                columns: [
                    {
                        name: "id",
                        type: "uuid",
                        isPrimary: true,
                        isGenerated: true,
                        generationStrategy: "uuid",
                    },
                    {
                        name: "field_id",
                        type: "uuid",
                        isNullable: false,
                    },
                    {
                        name: "crop_id",
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

        // GrowingCropperiod index
        await queryRunner.createIndex(
            "growing_crop_period",
            new TableIndex({
                name: "IDX_GROWING_CROP_PERIOD_ID",
                columnNames: ["id"],
            })
        );

        await queryRunner.createForeignKey(
            "growing_crop_period",
            new TableForeignKey({
                columnNames: ["crop_id"],
                referencedColumnNames: ["id"],
                referencedTableName: "crop",
            })
        );
        await queryRunner.createForeignKey(
            "growing_crop_period",
            new TableForeignKey({
                columnNames: ["field_id"],
                referencedColumnNames: ["id"],
                referencedTableName: "field",
            })
        );
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        const tableGrowingCropPeriodCrop = await queryRunner.getTable("growing_crop_period");
        const foreignKeyGrowingCropPeriodCrop = tableGrowingCropPeriodCrop.foreignKeys.find((fk) => fk.columnNames.indexOf("crop_id") !== -1);
        await queryRunner.dropForeignKey("growing_crop_period", foreignKeyGrowingCropPeriodCrop);

        const tableGrowingCropPeriodField = await queryRunner.getTable("growing_crop_period");
        const foreignKeyGrowingCropPeriodField = tableGrowingCropPeriodField.foreignKeys.find((fk) => fk.columnNames.indexOf("field_id") !== -1);
        await queryRunner.dropForeignKey("growing_crop_period", foreignKeyGrowingCropPeriodField);

        await queryRunner.dropTable("growing_crop_period");
    }
}
