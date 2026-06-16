import { SPANISH_DIRECTIVE } from './spanishDirective';

/**
 * Prompt de resumen de contexto. Comprime conversaciones largas enfocándose en
 * la información útil para refinar la recomendación.
 */
export function buildContextSummarizationPrompt(conversation: string): string {
  return `Resumí la siguiente conversación entre un usuario y un asistente recomendador de vehículos.
${SPANISH_DIRECTIVE}

El resumen debe ser breve y enfocarse en:
- Preferencias y criterios mencionados (presupuesto, marca, uso, etc.).
- Presupuesto declarado.
- Vehículos o características rechazadas por el usuario.
- Perfil del usuario (familia, uso, etc.).

No incluyas saludos ni relleno. Devolvé solo el resumen en texto plano.

CONVERSACIÓN:
${conversation}`;
}
