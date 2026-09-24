import { MigrationInterface, QueryRunner } from "typeorm";

export class AddPublicIdToClientsAndStaff1790253077702 implements MigrationInterface {
    name = 'AddPublicIdToClientsAndStaff1790253077702'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "clients" ADD "publicId" uuid`);
        await queryRunner.query(`UPDATE "clients" SET "publicId" = gen_random_uuid() WHERE "publicId" IS NULL`);
        await queryRunner.query(`ALTER TABLE "clients" ALTER COLUMN "publicId" SET NOT NULL`);
        await queryRunner.query(`ALTER TABLE "clients" ADD CONSTRAINT "UQ_e7a62246a66cb991545262394e2" UNIQUE ("publicId")`);
        await queryRunner.query(`ALTER TABLE "staff_users" ADD "publicId" uuid`);
        await queryRunner.query(`UPDATE "staff_users" SET "publicId" = gen_random_uuid() WHERE "publicId" IS NULL`);
        await queryRunner.query(`ALTER TABLE "staff_users" ALTER COLUMN "publicId" SET NOT NULL`);
        await queryRunner.query(`ALTER TABLE "staff_users" ADD CONSTRAINT "UQ_cf220956b06796a4ddabbc42ba5" UNIQUE ("publicId")`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "staff_users" DROP CONSTRAINT "UQ_cf220956b06796a4ddabbc42ba5"`);
        await queryRunner.query(`ALTER TABLE "staff_users" DROP COLUMN "publicId"`);
        await queryRunner.query(`ALTER TABLE "clients" DROP CONSTRAINT "UQ_e7a62246a66cb991545262394e2"`);
        await queryRunner.query(`ALTER TABLE "clients" DROP COLUMN "publicId"`);
    }

}
