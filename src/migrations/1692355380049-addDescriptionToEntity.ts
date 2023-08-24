import { MigrationInterface, QueryRunner } from "typeorm";

export class AddDescriptionToEntity1692355380049 implements MigrationInterface {
    name = 'AddDescriptionToEntity1692355380049'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "medicine" ADD "description" character varying NOT NULL DEFAULT 'description'`);
        await queryRunner.query(`ALTER TABLE "case" ADD "description" character varying NOT NULL DEFAULT 'description'`);
        await queryRunner.query(`ALTER TABLE "symptom" ADD "description" character varying NOT NULL DEFAULT 'description'`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "symptom" DROP COLUMN "description"`);
        await queryRunner.query(`ALTER TABLE "case" DROP COLUMN "description"`);
        await queryRunner.query(`ALTER TABLE "medicine" DROP COLUMN "description"`);
    }

}
