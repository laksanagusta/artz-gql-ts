import { MigrationInterface, QueryRunner } from "typeorm";

export class AddCaseSypmtomRelation1688758263134 implements MigrationInterface {
    name = 'AddCaseSypmtomRelation1688758263134'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "transaction_cases_case" ("transactionId" integer NOT NULL, "caseId" integer NOT NULL, CONSTRAINT "PK_5d4f7f5f3ce10800cf9ea39c875" PRIMARY KEY ("transactionId", "caseId"))`);
        await queryRunner.query(`CREATE INDEX "IDX_c0342a850ac529141a23b53a12" ON "transaction_cases_case" ("transactionId") `);
        await queryRunner.query(`CREATE INDEX "IDX_9d78e3d2e2ffd1875f8d3eec66" ON "transaction_cases_case" ("caseId") `);
        await queryRunner.query(`CREATE TABLE "transaction_symptoms_symptom" ("transactionId" integer NOT NULL, "symptomId" integer NOT NULL, CONSTRAINT "PK_cd7db3aae66799b4df443f873e9" PRIMARY KEY ("transactionId", "symptomId"))`);
        await queryRunner.query(`CREATE INDEX "IDX_0cedb90ce03cc583f6a2fbfad6" ON "transaction_symptoms_symptom" ("transactionId") `);
        await queryRunner.query(`CREATE INDEX "IDX_2d6e8d8a134e70016c3abf3323" ON "transaction_symptoms_symptom" ("symptomId") `);
        await queryRunner.query(`ALTER TABLE "transaction_cases_case" ADD CONSTRAINT "FK_c0342a850ac529141a23b53a12e" FOREIGN KEY ("transactionId") REFERENCES "transaction"("id") ON DELETE CASCADE ON UPDATE CASCADE`);
        await queryRunner.query(`ALTER TABLE "transaction_cases_case" ADD CONSTRAINT "FK_9d78e3d2e2ffd1875f8d3eec661" FOREIGN KEY ("caseId") REFERENCES "case"("id") ON DELETE CASCADE ON UPDATE CASCADE`);
        await queryRunner.query(`ALTER TABLE "transaction_symptoms_symptom" ADD CONSTRAINT "FK_0cedb90ce03cc583f6a2fbfad60" FOREIGN KEY ("transactionId") REFERENCES "transaction"("id") ON DELETE CASCADE ON UPDATE CASCADE`);
        await queryRunner.query(`ALTER TABLE "transaction_symptoms_symptom" ADD CONSTRAINT "FK_2d6e8d8a134e70016c3abf33232" FOREIGN KEY ("symptomId") REFERENCES "symptom"("id") ON DELETE CASCADE ON UPDATE CASCADE`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "transaction_symptoms_symptom" DROP CONSTRAINT "FK_2d6e8d8a134e70016c3abf33232"`);
        await queryRunner.query(`ALTER TABLE "transaction_symptoms_symptom" DROP CONSTRAINT "FK_0cedb90ce03cc583f6a2fbfad60"`);
        await queryRunner.query(`ALTER TABLE "transaction_cases_case" DROP CONSTRAINT "FK_9d78e3d2e2ffd1875f8d3eec661"`);
        await queryRunner.query(`ALTER TABLE "transaction_cases_case" DROP CONSTRAINT "FK_c0342a850ac529141a23b53a12e"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_2d6e8d8a134e70016c3abf3323"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_0cedb90ce03cc583f6a2fbfad6"`);
        await queryRunner.query(`DROP TABLE "transaction_symptoms_symptom"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_9d78e3d2e2ffd1875f8d3eec66"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_c0342a850ac529141a23b53a12"`);
        await queryRunner.query(`DROP TABLE "transaction_cases_case"`);
    }

}
