import { z } from 'zod';

/**
 * Intención del usuario detectada por el clasificador.
 * - RECOMMENDATION_REQUEST: pide una recomendación de vehículo.
 * - REFINEMENT: ajusta criterios sobre una recomendación previa.
 * - INFORMATIONAL: pregunta educativa (qué es X, cómo funciona Y).
 * - SMALL_TALK: charla casual no relacionada con la tarea.
 * - OUT_OF_SCOPE: fuera del dominio de recomendación de vehículos.
 */
export const intentValues = [
  'RECOMMENDATION_REQUEST',
  'REFINEMENT',
  'INFORMATIONAL',
  'SMALL_TALK',
  'OUT_OF_SCOPE',
] as const;

export const intentSchema = z.object({
  intent: z
    .enum(intentValues)
    .describe('La intención principal del mensaje del usuario'),
});

export type Intent = (typeof intentValues)[number];
export type IntentOutput = z.infer<typeof intentSchema>;
