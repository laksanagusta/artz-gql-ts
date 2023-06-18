import { MigrationInterface, QueryRunner } from "typeorm";

export class AddAppointmentSymptomCaseTable1687100959102 implements MigrationInterface {
    name = 'AddAppointmentSymptomCaseTable1687100959102'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "case" ("id" SERIAL NOT NULL, "name" character varying NOT NULL, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "PK_a1b20a2aef6fc438389d2c4aca0" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "appointment" ("id" SERIAL NOT NULL, "title" character varying NOT NULL, "scheduled_at" character varying NOT NULL, "day_text" character varying NOT NULL, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "memberId" integer, CONSTRAINT "PK_e8be1a53027415e709ce8a2db74" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "symptom" ("id" SERIAL NOT NULL, "name" character varying NOT NULL, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "PK_e6bf8581852864d312308633007" PRIMARY KEY ("id"))`);
        await queryRunner.query(`ALTER TABLE "appointment" ADD CONSTRAINT "FK_56e98e3fe9f0d198fcb5316fbe0" FOREIGN KEY ("memberId") REFERENCES "member"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "appointment" DROP CONSTRAINT "FK_56e98e3fe9f0d198fcb5316fbe0"`);
        await queryRunner.query(`DROP TABLE "symptom"`);
        await queryRunner.query(`DROP TABLE "appointment"`);
        await queryRunner.query(`DROP TABLE "case"`);
    }

}
