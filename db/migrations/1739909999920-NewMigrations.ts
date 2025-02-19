import { MigrationInterface, QueryRunner } from "typeorm";

export class NewMigrations1739909999920 implements MigrationInterface {
    name = 'NewMigrations1739909999920'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "soil" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "name" character varying NOT NULL, "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "deleted_at" TIMESTAMP, CONSTRAINT "UQ_e294698b65d0a5d4dcf15396314" UNIQUE ("name"), CONSTRAINT "PK_bc7efbd307095fd17ebeec730de" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TYPE "public"."user_role" AS ENUM('OWNER', 'OPERATOR', 'VIEWER')`);
        await queryRunner.query(`CREATE TABLE "user" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "email" character varying NOT NULL, "password" character varying NOT NULL, "role" "public"."user_role" NOT NULL DEFAULT 'VIEWER', "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "deleted_at" TIMESTAMP, CONSTRAINT "UQ_e12875dfb3b1d92d7d7c5377e22" UNIQUE ("email"), CONSTRAINT "PK_cace4a159ff9f2512dd42373760" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "growing_crop_period" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "field_id" uuid NOT NULL, "crop_id" uuid NOT NULL, "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "deleted_at" TIMESTAMP, CONSTRAINT "PK_87b84671c17e2f4838dbada357c" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "machine" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "brand" character varying NOT NULL, "model" character varying NOT NULL, "register_number" character varying NOT NULL, "farm_id" uuid NOT NULL, "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "deleted_at" TIMESTAMP, CONSTRAINT "UQ_b7b2daec7a94918daf77d86e3ca" UNIQUE ("register_number"), CONSTRAINT "PK_acc588900ffa841d96eb5fd566c" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "crop" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "name" character varying NOT NULL, "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "deleted_at" TIMESTAMP, CONSTRAINT "PK_f306910b05e2d54ed972a536a12" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "processing" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "date" date NOT NULL, "growing_crop_period_id" uuid NOT NULL, "processing_type_id" uuid NOT NULL, "machine_id" uuid NOT NULL, "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "deleted_at" TIMESTAMP, CONSTRAINT "PK_5a0081d66941dd8a7067aaf4f6c" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "processing_type" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "name" character varying NOT NULL, "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "deleted_at" TIMESTAMP, CONSTRAINT "UQ_bb3452271acf60ec5e9c2c66111" UNIQUE ("name"), CONSTRAINT "PK_9119f5a5ccb261ddaad15d88756" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "farm" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "name" character varying NOT NULL, "location" jsonb NOT NULL, "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "deleted_at" TIMESTAMP, CONSTRAINT "UQ_11527b5b142bb3e07f87d459802" UNIQUE ("name"), CONSTRAINT "PK_3bf246b27a3b6678dfc0b7a3f64" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "field" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "name" character varying(120) NOT NULL, "boundary" jsonb NOT NULL, "farm_id" uuid NOT NULL, "soil_id" uuid NOT NULL, "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "deleted_at" TIMESTAMP, CONSTRAINT "PK_39379bba786d7a75226b358f81e" PRIMARY KEY ("id"))`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP TABLE "field"`);
        await queryRunner.query(`DROP TABLE "farm"`);
        await queryRunner.query(`DROP TABLE "processing_type"`);
        await queryRunner.query(`DROP TABLE "processing"`);
        await queryRunner.query(`DROP TABLE "crop"`);
        await queryRunner.query(`DROP TABLE "machine"`);
        await queryRunner.query(`DROP TABLE "growing_crop_period"`);
        await queryRunner.query(`DROP TABLE "user"`);
        await queryRunner.query(`DROP TYPE "public"."user_role"`);
        await queryRunner.query(`DROP TABLE "soil"`);
    }

}
