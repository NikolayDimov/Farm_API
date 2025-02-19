import { MigrationInterface, QueryRunner, TableForeignKey } from "typeorm";

export class NewMigrations1739909999920 implements MigrationInterface {
    name = 'Connections1739909999921'

    public async up(queryRunner: QueryRunner): Promise<void> {
        // Create foreign keys for the "field" table
        await queryRunner.createForeignKey(
            "field",
            new TableForeignKey({
                columnNames: ["farm_id"],
                referencedColumnNames: ["id"],
                referencedTableName: "farm",
                onDelete: "CASCADE",
                name: "FK_field_farm_id"
            })
        );

        await queryRunner.createForeignKey(
            "field",
            new TableForeignKey({
                columnNames: ["soil_id"],
                referencedColumnNames: ["id"],
                referencedTableName: "soil",
                onDelete: "CASCADE",
                name: "FK_field_soil_id"
            })
        );

        // Create foreign key for "machine" table
        await queryRunner.createForeignKey(
            "machine",
            new TableForeignKey({
                columnNames: ["farm_id"],
                referencedColumnNames: ["id"],
                referencedTableName: "farm",
                onDelete: "CASCADE",
                name: "FK_machine_farm_id"
            })
        );

        // Create foreign keys for the "growing_crop_period" table
        await queryRunner.createForeignKey(
            "growing_crop_period",
            new TableForeignKey({
                columnNames: ["field_id"],
                referencedColumnNames: ["id"],
                referencedTableName: "field",
                onDelete: "CASCADE",
                name: "FK_growing_crop_period_field_id"
            })
        );

        await queryRunner.createForeignKey(
            "growing_crop_period",
            new TableForeignKey({
                columnNames: ["crop_id"],
                referencedColumnNames: ["id"],
                referencedTableName: "crop",
                onDelete: "CASCADE",
                name: "FK_growing_crop_period_crop_id"
            })
        );

        // Create foreign keys for the "processing" table
        await queryRunner.createForeignKey(
            "processing",
            new TableForeignKey({
                columnNames: ["growing_crop_period_id"],
                referencedColumnNames: ["id"],
                referencedTableName: "growing_crop_period",
                onDelete: "CASCADE",
                name: "FK_processing_growing_crop_period_id"
            })
        );

        await queryRunner.createForeignKey(
            "processing",
            new TableForeignKey({
                columnNames: ["processing_type_id"],
                referencedColumnNames: ["id"],
                referencedTableName: "processing_type",
                onDelete: "CASCADE",
                name: "FK_processing_processing_type_id"
            })
        );

        await queryRunner.createForeignKey(
            "processing",
            new TableForeignKey({
                columnNames: ["machine_id"],
                referencedColumnNames: ["id"],
                referencedTableName: "machine",
                onDelete: "CASCADE",
                name: "FK_processing_machine_id"
            })
        );
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        // Drop foreign keys for the "field" table
        await queryRunner.dropForeignKey("field", "FK_field_farm_id");
        await queryRunner.dropForeignKey("field", "FK_field_soil_id");

        // Drop foreign key for "machine" table
        await queryRunner.dropForeignKey("machine", "FK_machine_farm_id");

        // Drop foreign keys for the "growing_crop_period" table
        await queryRunner.dropForeignKey("growing_crop_period", "FK_growing_crop_period_field_id");
        await queryRunner.dropForeignKey("growing_crop_period", "FK_growing_crop_period_crop_id");

        // Drop foreign keys for the "processing" table
        await queryRunner.dropForeignKey("processing", "FK_processing_growing_crop_period_id");
        await queryRunner.dropForeignKey("processing", "FK_processing_processing_type_id");
        await queryRunner.dropForeignKey("processing", "FK_processing_machine_id");
    }
}
