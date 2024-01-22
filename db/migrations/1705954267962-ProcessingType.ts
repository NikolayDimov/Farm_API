import { MigrationInterface, QueryRunner, Table, TableIndex } from "typeorm";

export class ProcessingType1705954267962 implements MigrationInterface {
    public async up(queryRunner: QueryRunner): Promise<void> {
        // ProcessingType
        await queryRunner.createTable(
            new Table({
                name: "processing_type",
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

        await queryRunner.createIndex(
            "processing_type",
            new TableIndex({
                name: "IDX_PROCESSING_TYPE_ID",
                columnNames: ["id"],
            })
        );
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.dropTable("processing_type");
    }
}
