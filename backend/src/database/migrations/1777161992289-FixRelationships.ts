import { MigrationInterface, QueryRunner } from 'typeorm';

export class FixRelationships1777161992289 implements MigrationInterface {
  name = 'FixRelationships1777161992289';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE \`messages\` DROP FOREIGN KEY \`FK_066163c46cda7e8187f96bc87a0\``,
    );
    await queryRunner.query(
      `ALTER TABLE \`models\` DROP FOREIGN KEY \`FK_1f36b4eb435f410c6749378cf8c\``,
    );
    await queryRunner.query(
      `CREATE TABLE \`users\` (\`id\` varchar(36) NOT NULL, \`email\` varchar(50) NOT NULL, \`preferences\` json NULL, \`created_at\` timestamp(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), UNIQUE INDEX \`IDX_97672ac88f789774dd47f7c8be\` (\`email\`), PRIMARY KEY (\`id\`)) ENGINE=InnoDB`,
    );
    await queryRunner.query(
      `CREATE TABLE \`stores\` (\`id\` varchar(36) NOT NULL, \`name\` varchar(100) NOT NULL, \`base_url\` varchar(255) NOT NULL, \`created_at\` timestamp(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), \`updated_at\` timestamp(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6), PRIMARY KEY (\`id\`)) ENGINE=InnoDB`,
    );
    await queryRunner.query(
      `CREATE TABLE \`listings\` (\`id\` varchar(36) NOT NULL, \`vehicle_id\` varchar(255) NOT NULL, \`store_id\` varchar(255) NOT NULL, \`external_id\` varchar(255) NOT NULL, \`price\` decimal(15,2) NOT NULL, \`currency\` varchar(10) NOT NULL, \`mileage\` int NULL, \`external_url\` text NOT NULL, \`is_available\` tinyint NOT NULL DEFAULT 1, \`created_at\` timestamp(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), \`last_scraped\` timestamp NOT NULL, UNIQUE INDEX \`IDX_524c74c41e7ebe6cfa884394b5\` (\`external_id\`), PRIMARY KEY (\`id\`)) ENGINE=InnoDB`,
    );
    await queryRunner.query(
      `CREATE TABLE \`vehicles\` (\`id\` varchar(36) NOT NULL, \`model_id\` varchar(255) NOT NULL, \`year\` int NULL, \`fuel_type\` enum ('Nafta', 'Diésel', 'Híbrido', 'Eléctrico') NULL, \`transmission\` enum ('Manual', 'Automática') NULL, \`engine_specs\` varchar(255) NULL, \`raw_specs\` json NULL, \`created_at\` timestamp(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), \`updated_at\` timestamp(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6), PRIMARY KEY (\`id\`)) ENGINE=InnoDB`,
    );
    await queryRunner.query(
      `ALTER TABLE \`messages\` DROP COLUMN \`sessionId\``,
    );
    await queryRunner.query(`ALTER TABLE \`models\` DROP COLUMN \`brandId\``);
    await queryRunner.query(
      `ALTER TABLE \`messages\` ADD CONSTRAINT \`FK_ff71b7760071ed9caba7f02beb4\` FOREIGN KEY (\`session_id\`) REFERENCES \`chat_sessions\`(\`id\`) ON DELETE CASCADE ON UPDATE CASCADE`,
    );
    await queryRunner.query(
      `ALTER TABLE \`chat_sessions\` ADD CONSTRAINT \`FK_1fa209cf48ae975a109366542a5\` FOREIGN KEY (\`user_id\`) REFERENCES \`users\`(\`id\`) ON DELETE CASCADE ON UPDATE CASCADE`,
    );
    await queryRunner.query(
      `ALTER TABLE \`models\` ADD CONSTRAINT \`FK_f2b1673c6665816ff753e81d1a0\` FOREIGN KEY (\`brand_id\`) REFERENCES \`brands\`(\`id\`) ON DELETE RESTRICT ON UPDATE CASCADE`,
    );
    await queryRunner.query(
      `ALTER TABLE \`listings\` ADD CONSTRAINT \`FK_5f659e4dd4f4def501d21e6157c\` FOREIGN KEY (\`vehicle_id\`) REFERENCES \`vehicles\`(\`id\`) ON DELETE RESTRICT ON UPDATE CASCADE`,
    );
    await queryRunner.query(
      `ALTER TABLE \`listings\` ADD CONSTRAINT \`FK_6c1606ce6a8364f699a85f8b485\` FOREIGN KEY (\`store_id\`) REFERENCES \`stores\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE \`vehicles\` ADD CONSTRAINT \`FK_c4fe98a2147b08df1ab56df5313\` FOREIGN KEY (\`model_id\`) REFERENCES \`models\`(\`id\`) ON DELETE RESTRICT ON UPDATE CASCADE`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE \`vehicles\` DROP FOREIGN KEY \`FK_c4fe98a2147b08df1ab56df5313\``,
    );
    await queryRunner.query(
      `ALTER TABLE \`listings\` DROP FOREIGN KEY \`FK_6c1606ce6a8364f699a85f8b485\``,
    );
    await queryRunner.query(
      `ALTER TABLE \`listings\` DROP FOREIGN KEY \`FK_5f659e4dd4f4def501d21e6157c\``,
    );
    await queryRunner.query(
      `ALTER TABLE \`models\` DROP FOREIGN KEY \`FK_f2b1673c6665816ff753e81d1a0\``,
    );
    await queryRunner.query(
      `ALTER TABLE \`chat_sessions\` DROP FOREIGN KEY \`FK_1fa209cf48ae975a109366542a5\``,
    );
    await queryRunner.query(
      `ALTER TABLE \`messages\` DROP FOREIGN KEY \`FK_ff71b7760071ed9caba7f02beb4\``,
    );
    await queryRunner.query(
      `ALTER TABLE \`models\` ADD \`brandId\` varchar(36) NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE \`messages\` ADD \`sessionId\` varchar(36) NULL`,
    );
    await queryRunner.query(`DROP TABLE \`vehicles\``);
    await queryRunner.query(
      `DROP INDEX \`IDX_524c74c41e7ebe6cfa884394b5\` ON \`listings\``,
    );
    await queryRunner.query(`DROP TABLE \`listings\``);
    await queryRunner.query(`DROP TABLE \`stores\``);
    await queryRunner.query(
      `DROP INDEX \`IDX_97672ac88f789774dd47f7c8be\` ON \`users\``,
    );
    await queryRunner.query(`DROP TABLE \`users\``);
    await queryRunner.query(
      `ALTER TABLE \`models\` ADD CONSTRAINT \`FK_1f36b4eb435f410c6749378cf8c\` FOREIGN KEY (\`brandId\`) REFERENCES \`brands\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE \`messages\` ADD CONSTRAINT \`FK_066163c46cda7e8187f96bc87a0\` FOREIGN KEY (\`sessionId\`) REFERENCES \`chat_sessions\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
  }
}
