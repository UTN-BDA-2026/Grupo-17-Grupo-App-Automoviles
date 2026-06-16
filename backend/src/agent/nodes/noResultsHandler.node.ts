import { Logger } from '@nestjs/common';
import { NodeFactory } from './types';
import { HardFilters } from '../schemas/hardFilters.schema';
import { buildNoResultsPrompt } from '../prompts/noResults.prompt';
import { messageContentToString } from './helpers';

const logger = new Logger('noResultsHandler');

/**
 * Heurística para identificar el filtro probablemente más restrictivo cuando no
 * hubo candidatos. Prioriza precio bajo, año muy nuevo y marca/modelo específicos.
 */
function mostRestrictiveHint(f: HardFilters): string {
  if (f.maxPrice != null) return 'el precio máximo (probá subirlo)';
  if (f.minYear != null)
    return 'el año mínimo (probá aceptar modelos algo más antiguos)';
  if (f.brand != null) return `la marca "${f.brand}" (probá marcas similares)`;
  if (f.model != null)
    return `el modelo "${f.model}" (probá modelos equivalentes)`;
  if (f.maxMileage != null) return 'el kilometraje máximo';
  if (f.bodyType != null) return `el tipo de carrocería "${f.bodyType}"`;
  if (f.fuelType != null) return `el tipo de combustible "${f.fuelType}"`;
  return 'alguno de los criterios aplicados';
}

/**
 * Genera una respuesta sugiriendo relajar el filtro más restrictivo cuando la
 * búsqueda relacional no devolvió candidatos.
 */
export const noResultsHandlerNode: NodeFactory = (deps) => async (state) => {
  const hint = mostRestrictiveHint(state.hardFilters);
  logger.debug(`Sin resultados. Sugerencia de relajación: ${hint}`);

  const model = deps.llm.getModel();
  const res = await model.invoke(buildNoResultsPrompt(state.hardFilters, hint));

  return { finalResponse: messageContentToString(res.content).trim() };
};
