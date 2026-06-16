import { SPANISH_DIRECTIVE } from './spanishDirective';
import { HardFilters } from '../schemas/hardFilters.schema';

/**
 * Prompt de "sin resultados". Explica que no hubo coincidencias y sugiere
 * relajar el filtro identificado como más restrictivo.
 */
export function buildNoResultsPrompt(
  hardFilters: HardFilters,
  mostRestrictiveHint: string,
): string {
  return `Sos un asistente recomendador de vehículos. La búsqueda no devolvió ningún vehículo disponible.
${SPANISH_DIRECTIVE}

Explicá brevemente y con empatía que no se encontraron coincidencias con los criterios actuales, y sugerí concretamente qué criterio relajar para ampliar la búsqueda. No inventes vehículos.

FILTROS APLICADOS (JSON):
${JSON.stringify(hardFilters, null, 2)}

FILTRO PROBABLEMENTE MÁS RESTRICTIVO: ${mostRestrictiveHint}

Proponé al usuario relajar ese criterio (u otro razonable) y ofrecé continuar la búsqueda.`;
}
