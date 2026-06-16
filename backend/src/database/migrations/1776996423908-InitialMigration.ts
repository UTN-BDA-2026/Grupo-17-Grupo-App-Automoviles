import { MigrationInterface, QueryRunner } from 'typeorm';

export class InitialMigration1776996423908 implements MigrationInterface {
  name = 'InitialMigration1776996423908';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE \`chat_sessions\` (\`id\` varchar(36) NOT NULL, \`user_id\` varchar(255) NOT NULL, \`title\` varchar(100) NOT NULL, \`created_at\` timestamp(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), \`updated_at\` timestamp(6) NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6), PRIMARY KEY (\`id\`)) ENGINE=InnoDB`,
    );
    await queryRunner.query(
      `CREATE TABLE \`messages\` (\`id\` varchar(36) NOT NULL, \`session_id\` varchar(255) NOT NULL, \`role\` varchar(50) NOT NULL, \`content\` text NOT NULL, \`created_at\` timestamp(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), \`sessionId\` varchar(36) NULL, PRIMARY KEY (\`id\`)) ENGINE=InnoDB`,
    );
    await queryRunner.query(
      `CREATE TABLE \`models\` (\`id\` varchar(36) NOT NULL, \`brand_id\` varchar(255) NOT NULL, \`name\` varchar(100) NOT NULL, \`created_at\` timestamp(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), \`brandId\` varchar(36) NULL, PRIMARY KEY (\`id\`)) ENGINE=InnoDB`,
    );
    await queryRunner.query(
      `CREATE TABLE \`brands\` (\`id\` varchar(36) NOT NULL, \`name\` varchar(50) NOT NULL, \`created_at\` timestamp(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), PRIMARY KEY (\`id\`)) ENGINE=InnoDB`,
    );
    await queryRunner.query(
      `ALTER TABLE \`messages\` ADD CONSTRAINT \`FK_066163c46cda7e8187f96bc87a0\` FOREIGN KEY (\`sessionId\`) REFERENCES \`chat_sessions\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE \`models\` ADD CONSTRAINT \`FK_1f36b4eb435f410c6749378cf8c\` FOREIGN KEY (\`brandId\`) REFERENCES \`brands\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE \`models\` DROP FOREIGN KEY \`FK_1f36b4eb435f410c6749378cf8c\``,
    );
    await queryRunner.query(
      `ALTER TABLE \`messages\` DROP FOREIGN KEY \`FK_066163c46cda7e8187f96bc87a0\``,
    );
    await queryRunner.query(`DROP TABLE \`brands\``);
    await queryRunner.query(`DROP TABLE \`models\``);
    await queryRunner.query(`DROP TABLE \`messages\``);
    await queryRunner.query(`DROP TABLE \`chat_sessions\``);
  }
}
