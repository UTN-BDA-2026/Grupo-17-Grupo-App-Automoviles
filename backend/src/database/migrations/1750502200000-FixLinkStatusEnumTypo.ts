import { MigrationInterface, QueryRunner } from 'typeorm';

export class FixLinkStatusEnumTypo1750502200000 implements MigrationInterface {
  name = 'FixLinkStatusEnumTypo1750502200000';

  public async up(queryRunner: QueryRunner): Promise<void> {
    // Paso 1: Cambiar temporalmente la columna a VARCHAR para poder renombrar los valores existentes
    await queryRunner.query(
      `ALTER TABLE \`links\` MODIFY COLUMN \`status\` VARCHAR(20) NOT NULL`,
    );

    // Paso 2: Corregir los registros que tienen el valor con el typo 'Procensando' -> 'Procesando'
    await queryRunner.query(
      `UPDATE \`links\` SET \`status\` = 'Procesando' WHERE \`status\` = 'Procensando'`,
    );

    // Paso 3: Volver a definir la columna como ENUM con los valores correctos (sin typo)
    await queryRunner.query(
      `ALTER TABLE \`links\` MODIFY COLUMN \`status\` ENUM('Pendiente', 'Procesando', 'Completado') NOT NULL`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    // Revertir: volver al ENUM con el typo original y revertir los datos
    await queryRunner.query(
      `ALTER TABLE \`links\` MODIFY COLUMN \`status\` VARCHAR(20) NOT NULL`,
    );

    await queryRunner.query(
      `UPDATE \`links\` SET \`status\` = 'Procensando' WHERE \`status\` = 'Procesando'`,
    );

    await queryRunner.query(
      `ALTER TABLE \`links\` MODIFY COLUMN \`status\` ENUM('Pendiente', 'Procensando', 'Completado') NOT NULL`,
    );
  }
}
