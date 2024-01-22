import { MigrationInterface, QueryRunner, Table, TableIndex } from "typeorm";

export class Crop1705954233943 implements MigrationInterface {
    public async up(queryRunner: QueryRunner): Promise<void> {
        // Crop table
        await queryRunner.createTable(
            new Table({
                name: "crop",
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

        // Crop index
        await queryRunner.createIndex(
            "crop",
            new TableIndex({
                name: "IDX_CROP_ID",
                columnNames: ["id"],
            })
        );
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.dropTable("crop");
    }
}
