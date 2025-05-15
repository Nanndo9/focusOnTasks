import { MigrationInterface, QueryRunner } from "typeorm";

export class Default1747302704882 implements MigrationInterface {
    name = 'Default1747302704882'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "task" ADD "deleted_at" TIMESTAMP`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "task" DROP COLUMN "deleted_at"`);
    }

}
