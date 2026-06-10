import { MigrationInterface, QueryRunner } from "typeorm";

export class ChangesOnCurrentField1780870553344 implements MigrationInterface {
    name = 'ChangesOnCurrentField1780870553344'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP INDEX \`IDX_e03388b295cc1eff74d43c2440\` ON \`vehicles\``);
        await queryRunner.query(`DROP INDEX \`IDX_ffdeb5537230f0bec9098b889a\` ON \`listings\``);
        await queryRunner.query(`ALTER TABLE \`vehicles\` CHANGE \`version\` \`version\` varchar(255) NOT NULL`);
        await queryRunner.query(`ALTER TABLE \`listings\` DROP COLUMN \`currency\``);
        await queryRunner.query(`ALTER TABLE \`listings\` ADD \`currency\` varchar(15) NOT NULL`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`listings\` DROP COLUMN \`currency\``);
        await queryRunner.query(`ALTER TABLE \`listings\` ADD \`currency\` enum ('ARS', 'USD') NOT NULL`);
        await queryRunner.query(`ALTER TABLE \`vehicles\` CHANGE \`version\` \`version\` varchar(255) NULL`);
        await queryRunner.query(`CREATE UNIQUE INDEX \`IDX_ffdeb5537230f0bec9098b889a\` ON \`listings\` (\`linkId\`)`);
        await queryRunner.query(`CREATE UNIQUE INDEX \`IDX_e03388b295cc1eff74d43c2440\` ON \`vehicles\` (\`version\`)`);
    }

}
