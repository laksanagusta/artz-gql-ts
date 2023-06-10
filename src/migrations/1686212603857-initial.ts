import { MigrationInterface, QueryRunner } from "typeorm";

export class Initial1686212603857 implements MigrationInterface {
    name = 'Initial1686212603857'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "user" ("id" SERIAL NOT NULL, "name" character varying NOT NULL, "email" character varying NOT NULL, "phone_number" character varying NOT NULL, "password" character varying NOT NULL, "token" character varying DEFAULT '', CONSTRAINT "UQ_e12875dfb3b1d92d7d7c5377e22" UNIQUE ("email"), CONSTRAINT "UQ_01eea41349b6c9275aec646eee0" UNIQUE ("phone_number"), CONSTRAINT "PK_cace4a159ff9f2512dd42373760" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "member" ("id" SERIAL NOT NULL, "firstName" character varying NOT NULL, "lastName" character varying NOT NULL, "age" integer NOT NULL, "phone_number" character varying NOT NULL, "address" character varying NOT NULL, CONSTRAINT "PK_97cbbe986ce9d14ca5894fdc072" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "transaction" ("id" SERIAL NOT NULL, "complaint" text NOT NULL, "symptom" text NOT NULL, "diagnosis" text NOT NULL, "actions" text NOT NULL, "recipe" text NOT NULL, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "PK_89eadb93a89810556e1cbcd6ab9" PRIMARY KEY ("id"))`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP TABLE "transaction"`);
        await queryRunner.query(`DROP TABLE "member"`);
        await queryRunner.query(`DROP TABLE "user"`);
    }

}
