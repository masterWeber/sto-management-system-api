import { MigrationInterface, QueryRunner } from "typeorm";

export class CreateExpenses1790259129503 implements MigrationInterface {
    name = 'CreateExpenses1790259129503'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "expenses" ("id" SERIAL NOT NULL, "publicId" uuid NOT NULL, "date" date NOT NULL, "amountKopecks" integer NOT NULL, "description" character varying NOT NULL, "category" character varying, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "UQ_9603d2d707d0c81e9fb1ce6e3e8" UNIQUE ("publicId"), CONSTRAINT "PK_94c3ceb17e3140abc9282c20610" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE INDEX "IDX_280137355ed0f561f9aee0ac2c" ON "expenses"  ("date") `);
        await queryRunner.query(`CREATE INDEX "IDX_e069bf5f4d4aaab62a84f24ca4" ON "expenses"  ("category") `);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP INDEX "public"."IDX_e069bf5f4d4aaab62a84f24ca4"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_280137355ed0f561f9aee0ac2c"`);
        await queryRunner.query(`DROP TABLE "expenses"`);
    }

}
