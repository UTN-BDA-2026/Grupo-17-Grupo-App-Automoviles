import { SPANISH_DIRECTIVE } from './spanishDirective';
import { HardFilters } from '../schemas/hardFilters.schema';
import { SoftCriteria } from '../schemas/softCriteria.schema';

/**
 * Prompt de extracción de parámetros. Instruye el merge acumulativo: mantener
 * los criterios previos salvo que el usuario los retire o reemplace, y no
 * inventar valores no mencionados (deben quedar en null).
 */
export function buildParameterExtractionPrompt(
  currentMessage: string,
  contextSummary: string | null,
  previousHardFilters: HardFilters,
  previousSoftCriteria: SoftCriteria,
): string {
  return `Sos un extractor de criterios de búsqueda de vehículos. Tu salida es estructurada.
${SPANISH_DIRECTIVE}

REGLAS DE EXTRACCIÓN:
1. No inventes valores. Cualquier campo que el usuario NO mencione (ni ahora ni antes) debe quedar en null.
2. Hacé MERGE ACUMULATIVO: partí de los criterios previos y aplicá los cambios del mensaje actual.
3. Mantené los criterios previos salvo que el usuario los retire o reemplace explícitamente.
4. Si el usuario retira o cambia un criterio previo (ej. "ya no me importa la marca", "mejor automático"), poné userExplicitlyRetiredCriterion en true y ajustá el campo.
5. Separá filtros duros (mapeables a la base de datos) de criterios blandos (uso, perfil, prioridades de equipamiento en lenguaje natural).
6. Los rangos de precio/kilometraje/año van en minX/maxX. Si dice "hasta 20 millones", es maxPrice. Si dice "modelo 2018 o más nuevo", minYear=2018.

CRITERIOS DUROS PREVIOS (JSON):
${JSON.stringify(previousHardFilters, null, 2)}

CRITERIOS BLANDOS PREVIOS (JSON):
${JSON.stringify(previousSoftCriteria, null, 2)}

RESUMEN DEL CONTEXTO:
${contextSummary ?? '(sin contexto previo)'}

MENSAJE ACTUAL DEL USUARIO:
"${currentMessage}"

Devolvé el objeto completo de criterios duros y blandos ya mergeados.`;
}
