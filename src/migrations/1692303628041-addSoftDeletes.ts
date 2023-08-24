import { MigrationInterface, QueryRunner } from "typeorm";

export class AddSoftDeletes1692303628041 implements MigrationInterface {
    name = 'AddSoftDeletes1692303628041'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "medicine" ADD "deletedDate" TIMESTAMP`);
        await queryRunner.query(`ALTER TABLE "case" ADD "deletedDate" TIMESTAMP`);
        await queryRunner.query(`ALTER TABLE "symptom" ADD "deletedDate" TIMESTAMP`);
        await queryRunner.query(`ALTER TABLE "member" ADD "deletedDate" TIMESTAMP`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "member" DROP COLUMN "deletedDate"`);
        await queryRunner.query(`ALTER TABLE "symptom" DROP COLUMN "deletedDate"`);
        await queryRunner.query(`ALTER TABLE "case" DROP COLUMN "deletedDate"`);
        await queryRunner.query(`ALTER TABLE "medicine" DROP COLUMN "deletedDate"`);
    }

}
