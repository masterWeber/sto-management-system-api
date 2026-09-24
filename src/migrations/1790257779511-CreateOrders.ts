import { MigrationInterface, QueryRunner } from "typeorm";

export class CreateOrders1790257779511 implements MigrationInterface {
    name = 'CreateOrders1790257779511'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TYPE "public"."orders_status_enum" AS ENUM('RECEIVED', 'IN_PROGRESS', 'COMPLETED', 'PAID')`);
        await queryRunner.query(`CREATE TABLE "orders" ("id" SERIAL NOT NULL, "publicId" uuid NOT NULL, "clientId" integer NOT NULL, "carId" integer NOT NULL, "scheduledAt" TIMESTAMP WITH TIME ZONE NOT NULL, "status" "public"."orders_status_enum" NOT NULL DEFAULT 'RECEIVED', "comment" text, "assignedMasterId" integer, "completedAt" TIMESTAMP WITH TIME ZONE, "paidAt" TIMESTAMP WITH TIME ZONE, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "UQ_ee4682d7151398b24ac2a8e4554" UNIQUE ("publicId"), CONSTRAINT "PK_710e2d4957aa5878dfe94e4ac2f" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE INDEX "IDX_1457f286d91f271313fded23e5" ON "orders"  ("clientId") `);
        await queryRunner.query(`CREATE INDEX "IDX_85e28015ae789392a28f75883a" ON "orders"  ("carId") `);
        await queryRunner.query(`CREATE INDEX "IDX_775c9f06fc27ae3ff8fb26f2c4" ON "orders"  ("status") `);
        await queryRunner.query(`CREATE INDEX "IDX_ed56e87e73c65f9601ff4eb6ba" ON "orders"  ("assignedMasterId") `);
        await queryRunner.query(`CREATE TABLE "order_items" ("id" SERIAL NOT NULL, "publicId" uuid NOT NULL, "orderId" integer NOT NULL, "serviceId" integer, "name" character varying NOT NULL, "priceKopecks" integer NOT NULL, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "UQ_9c4ffffaed1945dbe195781f848" UNIQUE ("publicId"), CONSTRAINT "PK_005269d8574e6fac0493715c308" PRIMARY KEY ("id"))`);
        await queryRunner.query(`ALTER TABLE "orders" ADD CONSTRAINT "FK_1457f286d91f271313fded23e53" FOREIGN KEY ("clientId") REFERENCES "clients"("id") ON DELETE RESTRICT ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "orders" ADD CONSTRAINT "FK_85e28015ae789392a28f75883a4" FOREIGN KEY ("carId") REFERENCES "cars"("id") ON DELETE RESTRICT ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "orders" ADD CONSTRAINT "FK_ed56e87e73c65f9601ff4eb6bab" FOREIGN KEY ("assignedMasterId") REFERENCES "staff_users"("id") ON DELETE SET NULL ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "order_items" ADD CONSTRAINT "FK_f1d359a55923bb45b057fbdab0d" FOREIGN KEY ("orderId") REFERENCES "orders"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "order_items" ADD CONSTRAINT "FK_2a8ce0dd0205df008b9e2f09206" FOREIGN KEY ("serviceId") REFERENCES "services"("id") ON DELETE SET NULL ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "order_items" DROP CONSTRAINT "FK_2a8ce0dd0205df008b9e2f09206"`);
        await queryRunner.query(`ALTER TABLE "order_items" DROP CONSTRAINT "FK_f1d359a55923bb45b057fbdab0d"`);
        await queryRunner.query(`ALTER TABLE "orders" DROP CONSTRAINT "FK_ed56e87e73c65f9601ff4eb6bab"`);
        await queryRunner.query(`ALTER TABLE "orders" DROP CONSTRAINT "FK_85e28015ae789392a28f75883a4"`);
        await queryRunner.query(`ALTER TABLE "orders" DROP CONSTRAINT "FK_1457f286d91f271313fded23e53"`);
        await queryRunner.query(`DROP TABLE "order_items"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_ed56e87e73c65f9601ff4eb6ba"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_775c9f06fc27ae3ff8fb26f2c4"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_85e28015ae789392a28f75883a"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_1457f286d91f271313fded23e5"`);
        await queryRunner.query(`DROP TABLE "orders"`);
        await queryRunner.query(`DROP TYPE "public"."orders_status_enum"`);
    }

}
