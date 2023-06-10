import { MigrationInterface, QueryRunner } from "typeorm";

export class AddMemberAndTransactionRelation1686413358199 implements MigrationInterface {
    name = 'AddMemberAndTransactionRelation1686413358199'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "transaction" ADD "memberId" integer`);
        await queryRunner.query(`ALTER TABLE "transaction" ADD CONSTRAINT "FK_766ddd676f52dbc7ad256828fd1" FOREIGN KEY ("memberId") REFERENCES "member"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "transaction" DROP CONSTRAINT "FK_766ddd676f52dbc7ad256828fd1"`);
        await queryRunner.query(`ALTER TABLE "transaction" DROP COLUMN "memberId"`);
    }

}
