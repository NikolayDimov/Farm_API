import { MigrationInterface, QueryRunner, Table, TableIndex } from "typeorm";

export class Soil1705954229281 implements MigrationInterface {
    public async up(queryRunner: QueryRunner): Promise<void> {
        // Soil table
        await queryRunner.createTable(
            new Table({
                name: "soil",
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

        // Soil index
        await queryRunner.createIndex(
            "soil",
            new TableIndex({
                name: "IDX_SOIL_ID",
                columnNames: ["id"],
            })
        );
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.dropTable("soil");
    }
}
