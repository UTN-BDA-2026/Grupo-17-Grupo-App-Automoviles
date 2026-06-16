import { Logger } from '@nestjs/common';
import { NodeFactory } from './types';
import { buildSemanticQuery, flattenRules } from './helpers';

const logger = new Logger('vectorDBQuery');

/**
 * Consulta la base vectorial de reglas expertas reutilizando
 * RecommendationManualService.query. Construye la query priorizando criterios
 * blandos + un resumen de los duros. Devuelve top AGENT_VECTOR_TOP_K reglas.
 */
export const vectorDBQueryNode: NodeFactory = (deps) => async (state) => {
  const k = parseInt(deps.config.get<string>('AGENT_VECTOR_TOP_K') ?? '6', 10);
  const query = buildSemanticQuery(state.softCriteria, state.hardFilters);

  const result = await deps.recommendationService.query(query, k);
  const rules = flattenRules(result);
  logger.debug(`Reglas vectoriales recuperadas: ${rules.length}`);

  return { recommendationRules: rules };
};
