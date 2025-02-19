
import { UserRole } from "../../src/auth/dtos/role.enum";
import { MigrationInterface, QueryRunner, Table, TableForeignKey, TableIndex } from "typeorm";

export class CreateDbMigration1705907770572 implements MigrationInterface {
    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.createTable(
            new Table({
                name: "user",
                columns: [
                    {
                        name: "id",
                        type: "uuid",
                        isPrimary: true,
                        isGenerated: true,
                        generationStrategy: "uuid",
                    },
                    {
                        name: "email",
                        type: "varchar",
                        length: "120",
                        isUnique: true,
                        isNullable: false,
                    },
                    {
                        name: "password",
                        type: "varchar",
                        isNullable: false,
                    },
                    {
                        name: "role",
                        type: "enum",
                        enum: [UserRole.OWNER, UserRole.OPERATOR, UserRole.VIEWER],
                        default: `'VIEWER'`,
                        enumName: "user_role",
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

        await queryRunner.createTable(
            new Table({
                name: "farm",
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
                        isUnique: true,
                        isNullable: false,
                    },
                    {
                        name: "location",
                        type: "jsonb",
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

        await queryRunner.createTable(
            new Table({
                name: "field",
                foreignKeys: [
                    {
                        columnNames: ["farm_id"],
                        referencedColumnNames: ["id"],
                        referencedTableName: "farm",
                        name: "farm_id",
                    },
                    {
                        columnNames: ["soil_id"],
                        referencedColumnNames: ["id"],
                        referencedTableName: "soil",
                        name: "soil_id",
                    },
                ],
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

        await queryRunner.createTable(
            new Table({
                name: "machine",
                foreignKeys: [
                    {
                        columnNames: ["farm_id"],
                        referencedColumnNames: ["id"],
                        referencedTableName: "farm",
                        name: "farm_id",
                    },
                ],
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

        await queryRunner.createTable(
            new Table({
                name: "growing_crop_period",
                foreignKeys: [
                    {
                        columnNames: ["field_id"],
                        referencedColumnNames: ["id"],
                        referencedTableName: "field",
                        name: "field_id",
                    },
                    {
                        columnNames: ["crop_id"],
                        referencedColumnNames: ["id"],
                        referencedTableName: "crop",
                        name: "crop_id",
                    },
                ],
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

        await queryRunner.createTable(
            new Table({
                name: "processing",
                foreignKeys: [
                    {
                        columnNames: ["growing_crop_period_id"],
                        referencedColumnNames: ["id"],
                        referencedTableName: "growing_crop_period",
                        name: "growing_crop_period_id",
                    },
                    {
                        columnNames: ["processing_type_id"],
                        referencedColumnNames: ["id"],
                        referencedTableName: "processing_type",
                        name: "processing_type_id",
                    },
                    {
                        columnNames: ["machine_id"],
                        referencedColumnNames: ["id"],
                        referencedTableName: "machine",
                        name: "machine_id",
                    },
                ],
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
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.dropTable("user");
        await queryRunner.dropTable("farm");
        await queryRunner.dropTable("field");
        await queryRunner.dropTable("soil");
        await queryRunner.dropTable("crop");
        await queryRunner.dropTable("machine");
        await queryRunner.dropTable("processing_type");
        await queryRunner.dropTable("growing_crop_period");
        await queryRunner.dropTable("processing");
    }
}
