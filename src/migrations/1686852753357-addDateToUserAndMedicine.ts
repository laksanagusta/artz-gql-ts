import { MigrationInterface, QueryRunner } from "typeorm";

export class AddDateToUserAndMedicine1686852753357 implements MigrationInterface {
    name = 'AddDateToUserAndMedicine1686852753357'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "medicine" ADD "createdAt" TIMESTAMP NOT NULL DEFAULT now()`);
        await queryRunner.query(`ALTER TABLE "medicine" ADD "updatedAt" TIMESTAMP NOT NULL DEFAULT now()`);
        await queryRunner.query(`ALTER TABLE "member" ADD "createdAt" TIMESTAMP NOT NULL DEFAULT now()`);
        await queryRunner.query(`ALTER TABLE "member" ADD "updatedAt" TIMESTAMP NOT NULL DEFAULT now()`);
        await queryRunner.query(`ALTER TABLE "user" ADD "createdAt" TIMESTAMP NOT NULL DEFAULT now()`);
        await queryRunner.query(`ALTER TABLE "user" ADD "updatedAt" TIMESTAMP NOT NULL DEFAULT now()`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "user" DROP COLUMN "updatedAt"`);
        await queryRunner.query(`ALTER TABLE "user" DROP COLUMN "createdAt"`);
        await queryRunner.query(`ALTER TABLE "member" DROP COLUMN "updatedAt"`);
        await queryRunner.query(`ALTER TABLE "member" DROP COLUMN "createdAt"`);
        await queryRunner.query(`ALTER TABLE "medicine" DROP COLUMN "updatedAt"`);
        await queryRunner.query(`ALTER TABLE "medicine" DROP COLUMN "createdAt"`);
    }

}
