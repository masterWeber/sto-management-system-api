import { MigrationInterface, QueryRunner } from "typeorm";

export class InitClientsAndStaff1790248849968 implements MigrationInterface {
    name = 'InitClientsAndStaff1790248849968'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "clients" ("id" SERIAL NOT NULL, "firstName" character varying NOT NULL, "lastName" character varying NOT NULL, "phone" character varying NOT NULL, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "PK_f1ab7cf3a5714dbc6bb4e1c28a4" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE INDEX "IDX_aa22377d7d3e794ae4cd39cd9e" ON "clients"  ("phone") `);
        await queryRunner.query(`CREATE TYPE "public"."staff_users_role_enum" AS ENUM('ADMIN', 'MANAGER', 'MASTER')`);
        await queryRunner.query(`CREATE TABLE "staff_users" ("id" SERIAL NOT NULL, "fullName" character varying NOT NULL, "login" character varying NOT NULL, "passwordHash" character varying NOT NULL, "role" "public"."staff_users_role_enum" NOT NULL, "isActive" boolean NOT NULL DEFAULT true, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "UQ_d9f65422d3dc7f2797a4fb16719" UNIQUE ("login"), CONSTRAINT "PK_c6b167335377df69f7910c2c75e" PRIMARY KEY ("id"))`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP TABLE "staff_users"`);
        await queryRunner.query(`DROP TYPE "public"."staff_users_role_enum"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_aa22377d7d3e794ae4cd39cd9e"`);
        await queryRunner.query(`DROP TABLE "clients"`);
    }

}
