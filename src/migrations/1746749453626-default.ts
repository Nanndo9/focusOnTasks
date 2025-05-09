import { MigrationInterface, QueryRunner } from "typeorm";

export class Default1746749453626 implements MigrationInterface {
    name = 'Default1746749453626'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "password_reset_token" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "token" character varying NOT NULL, "expiresAt" TIMESTAMP NOT NULL, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "userId" uuid, CONSTRAINT "PK_838af121380dfe3a6330e04f5bb" PRIMARY KEY ("id"))`);
        await queryRunner.query(`ALTER TABLE "password_reset_token" ADD CONSTRAINT "FK_a4e53583f7a8ab7d01cded46a41" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "password_reset_token" DROP CONSTRAINT "FK_a4e53583f7a8ab7d01cded46a41"`);
        await queryRunner.query(`DROP TABLE "password_reset_token"`);
    }

}
