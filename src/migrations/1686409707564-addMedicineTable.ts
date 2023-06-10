import { MigrationInterface, QueryRunner } from "typeorm";

export class AddMedicineTable1686409707564 implements MigrationInterface {
    name = 'AddMedicineTable1686409707564'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "medicine" ("id" SERIAL NOT NULL, "name" character varying NOT NULL, CONSTRAINT "PK_b9e0e6f37b7cadb5f402390928b" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "transaction_medicines_medicine" ("transactionId" integer NOT NULL, "medicineId" integer NOT NULL, CONSTRAINT "PK_19ac85be0e28c6011a7fee861a9" PRIMARY KEY ("transactionId", "medicineId"))`);
        await queryRunner.query(`CREATE INDEX "IDX_e780ae717ab0da5acd69bdd5d2" ON "transaction_medicines_medicine" ("transactionId") `);
        await queryRunner.query(`CREATE INDEX "IDX_8edfe26f4d7d8a17204cb2513d" ON "transaction_medicines_medicine" ("medicineId") `);
        await queryRunner.query(`ALTER TABLE "transaction" DROP COLUMN "recipe"`);
        await queryRunner.query(`ALTER TABLE "transaction_medicines_medicine" ADD CONSTRAINT "FK_e780ae717ab0da5acd69bdd5d21" FOREIGN KEY ("transactionId") REFERENCES "transaction"("id") ON DELETE CASCADE ON UPDATE CASCADE`);
        await queryRunner.query(`ALTER TABLE "transaction_medicines_medicine" ADD CONSTRAINT "FK_8edfe26f4d7d8a17204cb2513d1" FOREIGN KEY ("medicineId") REFERENCES "medicine"("id") ON DELETE CASCADE ON UPDATE CASCADE`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "transaction_medicines_medicine" DROP CONSTRAINT "FK_8edfe26f4d7d8a17204cb2513d1"`);
        await queryRunner.query(`ALTER TABLE "transaction_medicines_medicine" DROP CONSTRAINT "FK_e780ae717ab0da5acd69bdd5d21"`);
        await queryRunner.query(`ALTER TABLE "transaction" ADD "recipe" text NOT NULL`);
        await queryRunner.query(`DROP INDEX "public"."IDX_8edfe26f4d7d8a17204cb2513d"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_e780ae717ab0da5acd69bdd5d2"`);
        await queryRunner.query(`DROP TABLE "transaction_medicines_medicine"`);
        await queryRunner.query(`DROP TABLE "medicine"`);
    }

}
