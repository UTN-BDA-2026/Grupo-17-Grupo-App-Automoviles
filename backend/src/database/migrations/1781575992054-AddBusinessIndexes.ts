import { MigrationInterface, QueryRunner } from 'typeorm';

/**
 * Índices derivados del análisis de la lógica de negocio (patrones de consulta
 * de los servicios). No incluye FKs ni columnas unique (ya indexadas por InnoDB).
 */
export class AddBusinessIndexes1781575992054 implements MigrationInterface {
  name = 'AddBusinessIndexes1781575992054';

  public async up(queryRunner: QueryRunner): Promise<void> {
    // links.status -> LinkService.getByStatus (flujo de scraping)
    await queryRunner.query(
      `CREATE INDEX \`idx_links_status\` ON \`links\` (\`status\`)`,
    );

    // vehicles: dedup en ingesta y búsqueda por versión
    await queryRunner.query(
      `CREATE INDEX \`idx_vehicles_model_year_version\` ON \`vehicles\` (\`model_id\`, \`year\`, \`version\`)`,
    );
    await queryRunner.query(
      `CREATE INDEX \`idx_vehicles_version\` ON \`vehicles\` (\`version\`)`,
    );

    // listings: filtros por disponibilidad + rangos de precio/kilometraje
    await queryRunner.query(
      `CREATE INDEX \`idx_listings_available_price\` ON \`listings\` (\`is_available\`, \`price\`)`,
    );
    await queryRunner.query(
      `CREATE INDEX \`idx_listings_available_mileage\` ON \`listings\` (\`is_available\`, \`mileage\`)`,
    );

    // chat_sessions: listado de conversaciones por usuario ordenadas por fecha
    await queryRunner.query(
      `CREATE INDEX \`idx_chat_sessions_user_updated\` ON \`chat_sessions\` (\`user_id\`, \`updated_at\`)`,
    );

    // messages: mensajes de una sesión en orden cronológico
    await queryRunner.query(
      `CREATE INDEX \`idx_messages_session_created\` ON \`messages\` (\`session_id\`, \`created_at\`)`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP INDEX \`idx_messages_session_created\` ON \`messages\``);
    await queryRunner.query(`DROP INDEX \`idx_chat_sessions_user_updated\` ON \`chat_sessions\``);
    await queryRunner.query(`DROP INDEX \`idx_listings_available_mileage\` ON \`listings\``);
    await queryRunner.query(`DROP INDEX \`idx_listings_available_price\` ON \`listings\``);
    await queryRunner.query(`DROP INDEX \`idx_vehicles_version\` ON \`vehicles\``);
    await queryRunner.query(`DROP INDEX \`idx_vehicles_model_year_version\` ON \`vehicles\``);
    await queryRunner.query(`DROP INDEX \`idx_links_status\` ON \`links\``);
  }
}
