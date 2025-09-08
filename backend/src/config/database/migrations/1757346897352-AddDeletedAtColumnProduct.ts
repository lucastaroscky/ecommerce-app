import { MigrationInterface, QueryRunner } from "typeorm";

export class AddDeletedAtColumnProduct1757346897352 implements MigrationInterface {
    name = 'AddDeletedAtColumnProduct1757346897352'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "products" ADD "deleted_at" TIMESTAMP`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "products" DROP COLUMN "deleted_at"`);
    }

}
