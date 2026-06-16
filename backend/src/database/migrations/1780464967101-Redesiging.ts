import { MigrationInterface, QueryRunner } from 'typeorm';

export class Redesiging1780464967101 implements MigrationInterface {
  name = 'Redesiging1780464967101';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE \`links\` (\`id\` varchar(36) NOT NULL, \`store_id\` varchar(255) NOT NULL, \`status\` enum ('Pendiente', 'Procensando', 'Completado') NOT NULL, \`url\` varchar(255) NOT NULL, \`created_at\` timestamp(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), \`updated_at\` timestamp(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6), UNIQUE INDEX \`IDX_ff2e76673883ad4ea9f92fe32b\` (\`url\`), PRIMARY KEY (\`id\`)) ENGINE=InnoDB`,
    );
    await queryRunner.query(
      `ALTER TABLE \`vehicles\` DROP COLUMN \`fuel_type\``,
    );
    await queryRunner.query(
      `ALTER TABLE \`vehicles\` DROP COLUMN \`transmission\``,
    );
    await queryRunner.query(
      `ALTER TABLE \`vehicles\` DROP COLUMN \`engine_specs\``,
    );
    await queryRunner.query(
      `ALTER TABLE \`vehicles\` DROP COLUMN \`raw_specs\``,
    );
    await queryRunner.query(
      `ALTER TABLE \`listings\` DROP COLUMN \`store_id\``,
    );
    await queryRunner.query(
      `ALTER TABLE \`listings\` DROP COLUMN \`external_id\``,
    );
    await queryRunner.query(
      `ALTER TABLE \`listings\` DROP COLUMN \`external_url\``,
    );
    await queryRunner.query(
      `ALTER TABLE \`vehicles\` ADD \`version\` varchar(255) NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE \`vehicles\` ADD UNIQUE INDEX \`IDX_e03388b295cc1eff74d43c2440\` (\`version\`)`,
    );
    await queryRunner.query(
      `ALTER TABLE \`listings\` ADD \`color\` varchar(30) NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE \`listings\` ADD \`fuel_type\` varchar(60) NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE \`listings\` ADD \`doors\` int NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE \`listings\` ADD \`people_capacity\` int NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE \`listings\` ADD \`condition\` varchar(20) NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE \`listings\` ADD \`direction\` varchar(30) NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE \`listings\` ADD \`transmission\` varchar(40) NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE \`listings\` ADD \`traction_control\` varchar(35) NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE \`listings\` ADD \`engine\` varchar(30) NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE \`listings\` ADD \`body_type\` varchar(30) NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE \`listings\` ADD \`sole_owner\` tinyint NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE \`listings\` ADD \`equipment\` json NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE \`listings\` ADD \`linkId\` varchar(36) NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE \`listings\` ADD UNIQUE INDEX \`IDX_ffdeb5537230f0bec9098b889a\` (\`linkId\`)`,
    );
    await queryRunner.query(
      `ALTER TABLE \`brands\` ADD UNIQUE INDEX \`IDX_96db6bbbaa6f23cad26871339b\` (\`name\`)`,
    );
    await queryRunner.query(
      `ALTER TABLE \`models\` ADD UNIQUE INDEX \`IDX_3492c71396207453cf17c0928f\` (\`name\`)`,
    );
    await queryRunner.query(
      `ALTER TABLE \`vehicles\` CHANGE \`year\` \`year\` int NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE \`listings\` DROP COLUMN \`currency\``,
    );
    await queryRunner.query(
      `ALTER TABLE \`listings\` ADD \`currency\` enum ('ARS', 'USD') NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE \`listings\` CHANGE \`mileage\` \`mileage\` int NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE \`listings\` CHANGE \`last_scraped\` \`last_scraped\` timestamp(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6)`,
    );
    await queryRunner.query(
      `ALTER TABLE \`stores\` ADD UNIQUE INDEX \`IDX_82649835f674efeccf7b80f8b8\` (\`base_url\`)`,
    );
    await queryRunner.query(
      `CREATE UNIQUE INDEX \`REL_ffdeb5537230f0bec9098b889a\` ON \`listings\` (\`linkId\`)`,
    );
    await queryRunner.query(
      `ALTER TABLE \`listings\` ADD CONSTRAINT \`FK_ffdeb5537230f0bec9098b889ae\` FOREIGN KEY (\`linkId\`) REFERENCES \`links\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE \`links\` ADD CONSTRAINT \`FK_8818a3eb956a325e9d5296d0743\` FOREIGN KEY (\`store_id\`) REFERENCES \`stores\`(\`id\`) ON DELETE CASCADE ON UPDATE CASCADE`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE \`links\` DROP FOREIGN KEY \`FK_8818a3eb956a325e9d5296d0743\``,
    );
    await queryRunner.query(
      `ALTER TABLE \`listings\` DROP FOREIGN KEY \`FK_ffdeb5537230f0bec9098b889ae\``,
    );
    await queryRunner.query(
      `DROP INDEX \`REL_ffdeb5537230f0bec9098b889a\` ON \`listings\``,
    );
    await queryRunner.query(
      `ALTER TABLE \`stores\` DROP INDEX \`IDX_82649835f674efeccf7b80f8b8\``,
    );
    await queryRunner.query(
      `ALTER TABLE \`listings\` CHANGE \`last_scraped\` \`last_scraped\` timestamp(0) NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE \`listings\` CHANGE \`mileage\` \`mileage\` int NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE \`listings\` DROP COLUMN \`currency\``,
    );
    await queryRunner.query(
      `ALTER TABLE \`listings\` ADD \`currency\` varchar(10) NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE \`vehicles\` CHANGE \`year\` \`year\` int NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE \`models\` DROP INDEX \`IDX_3492c71396207453cf17c0928f\``,
    );
    await queryRunner.query(
      `ALTER TABLE \`brands\` DROP INDEX \`IDX_96db6bbbaa6f23cad26871339b\``,
    );
    await queryRunner.query(
      `ALTER TABLE \`listings\` DROP INDEX \`IDX_ffdeb5537230f0bec9098b889a\``,
    );
    await queryRunner.query(`ALTER TABLE \`listings\` DROP COLUMN \`linkId\``);
    await queryRunner.query(
      `ALTER TABLE \`listings\` DROP COLUMN \`equipment\``,
    );
    await queryRunner.query(
      `ALTER TABLE \`listings\` DROP COLUMN \`sole_owner\``,
    );
    await queryRunner.query(
      `ALTER TABLE \`listings\` DROP COLUMN \`body_type\``,
    );
    await queryRunner.query(`ALTER TABLE \`listings\` DROP COLUMN \`engine\``);
    await queryRunner.query(
      `ALTER TABLE \`listings\` DROP COLUMN \`traction_control\``,
    );
    await queryRunner.query(
      `ALTER TABLE \`listings\` DROP COLUMN \`transmission\``,
    );
    await queryRunner.query(
      `ALTER TABLE \`listings\` DROP COLUMN \`direction\``,
    );
    await queryRunner.query(
      `ALTER TABLE \`listings\` DROP COLUMN \`condition\``,
    );
    await queryRunner.query(
      `ALTER TABLE \`listings\` DROP COLUMN \`people_capacity\``,
    );
    await queryRunner.query(`ALTER TABLE \`listings\` DROP COLUMN \`doors\``);
    await queryRunner.query(
      `ALTER TABLE \`listings\` DROP COLUMN \`fuel_type\``,
    );
    await queryRunner.query(`ALTER TABLE \`listings\` DROP COLUMN \`color\``);
    await queryRunner.query(
      `ALTER TABLE \`vehicles\` DROP INDEX \`IDX_e03388b295cc1eff74d43c2440\``,
    );
    await queryRunner.query(`ALTER TABLE \`vehicles\` DROP COLUMN \`version\``);
    await queryRunner.query(
      `ALTER TABLE \`listings\` ADD \`external_url\` text NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE \`listings\` ADD \`external_id\` varchar(255) NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE \`listings\` ADD \`store_id\` varchar(255) NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE \`vehicles\` ADD \`raw_specs\` json NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE \`vehicles\` ADD \`engine_specs\` varchar(255) NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE \`vehicles\` ADD \`transmission\` enum ('Manual', 'Automática') NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE \`vehicles\` ADD \`fuel_type\` enum ('Nafta', 'Diésel', 'Híbrido', 'Eléctrico') NULL`,
    );
    await queryRunner.query(
      `DROP INDEX \`IDX_ff2e76673883ad4ea9f92fe32b\` ON \`links\``,
    );
    await queryRunner.query(`DROP TABLE \`links\``);
  }
}
