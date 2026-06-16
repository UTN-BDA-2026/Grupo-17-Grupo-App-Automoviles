import { SPANISH_DIRECTIVE } from './spanishDirective';

/**
 * Prompt de clasificación de intención. Considera el mensaje actual y el
 * resumen de contexto para detectar refinamientos sobre recomendaciones previas.
 */
export function buildIntentClassificationPrompt(
  currentMessage: string,
  contextSummary: string | null,
): string {
  return `Sos un clasificador de intenciones de un asistente recomendador de vehículos.
${SPANISH_DIRECTIVE}

Clasificá el mensaje del usuario en UNA de estas categorías:
- RECOMMENDATION_REQUEST: el usuario pide por primera vez una recomendación o describe qué auto busca.
- REFINEMENT: el usuario ajusta, agrega o quita criterios sobre una búsqueda ya iniciada (ej. "más barato", "ahora automático", "que sea nafta").
- INFORMATIONAL: el usuario hace una pregunta educativa o conceptual (ej. "¿qué es el control de tracción?", "¿conviene diésel o nafta?").
- SMALL_TALK: saludo o charla casual sin intención de búsqueda.
- OUT_OF_SCOPE: tema ajeno a la compra/recomendación de vehículos.

Si ya hay criterios previos en el contexto y el mensaje los modifica, es REFINEMENT.

Resumen del contexto previo de la conversación:
${contextSummary ?? '(sin contexto previo)'}

Mensaje actual del usuario:
"${currentMessage}"`;
}
