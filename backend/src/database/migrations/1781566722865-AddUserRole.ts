import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddUserRole1781566722865 implements MigrationInterface {
  name = 'AddUserRole1781566722865';

  public async up(queryRunner: QueryRunner): Promise<void> {
    // Agrega la columna role. Los usuarios existentes quedan en 'User' por el default.
    await queryRunner.query(
      `ALTER TABLE \`users\` ADD \`role\` enum ('User', 'Admin') NOT NULL DEFAULT 'User'`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE \`users\` DROP COLUMN \`role\``);
  }
}
