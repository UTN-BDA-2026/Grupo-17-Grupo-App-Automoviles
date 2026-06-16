import { z } from 'zod';
import { hardFiltersSchema } from './hardFilters.schema';
import { softCriteriaSchema } from './softCriteria.schema';

/**
 * Salida estructurada del parameterExtractor. Combina filtros duros y blandos
 * ya mergeados con los previos, más una bandera que indica si el usuario retiró
 * explícitamente algún criterio (para distinguir "no lo mencionó" de "lo quitó").
 */
export const extractionOutputSchema = z.object({
  hardFilters: hardFiltersSchema,
  softCriteria: softCriteriaSchema,
  userExplicitlyRetiredCriterion: z
    .boolean()
    .describe(
      'true si el usuario pidió quitar o reemplazar un criterio previo',
    ),
});

export type ExtractionOutput = z.infer<typeof extractionOutputSchema>;
