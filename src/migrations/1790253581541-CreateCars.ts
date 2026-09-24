import { MigrationInterface, QueryRunner } from "typeorm";

export class CreateCars1790253581541 implements MigrationInterface {
    name = 'CreateCars1790253581541'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "cars" ("id" SERIAL NOT NULL, "publicId" uuid NOT NULL, "make" character varying NOT NULL, "year" smallint NOT NULL, "licensePlate" character varying NOT NULL, "vin" character varying, "clientId" integer NOT NULL, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "UQ_4e69655ad3d613ec78e45599227" UNIQUE ("publicId"), CONSTRAINT "PK_fc218aa84e79b477d55322271b6" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE INDEX "IDX_1df40c87717e8631a39fd42920" ON "cars"  ("licensePlate") `);
        await queryRunner.query(`CREATE INDEX "IDX_a3bd377c1beb7a30919cc6c523" ON "cars"  ("clientId") `);
        await queryRunner.query(`ALTER TABLE "cars" ADD CONSTRAINT "FK_a3bd377c1beb7a30919cc6c523d" FOREIGN KEY ("clientId") REFERENCES "clients"("id") ON DELETE RESTRICT ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "cars" DROP CONSTRAINT "FK_a3bd377c1beb7a30919cc6c523d"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_a3bd377c1beb7a30919cc6c523"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_1df40c87717e8631a39fd42920"`);
        await queryRunner.query(`DROP TABLE "cars"`);
    }

}
