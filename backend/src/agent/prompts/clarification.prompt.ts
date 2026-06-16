import { SPANISH_DIRECTIVE } from './spanishDirective';
import { HardFilters } from '../schemas/hardFilters.schema';
import { SoftCriteria } from '../schemas/softCriteria.schema';

/**
 * Prompt de clarificación. Genera 2-3 preguntas breves apuntando a los datos
 * más informativos que faltan.
 */
export function buildClarificationPrompt(
  currentMessage: string,
  hardFilters: HardFilters,
  softCriteria: SoftCriteria,
): string {
  return `Sos un asistente recomendador de vehículos. El usuario fue demasiado vago y necesitás más datos.
${SPANISH_DIRECTIVE}

Generá 2 o 3 preguntas breves y concretas para entender qué busca. Priorizá los datos más informativos que falten: presupuesto, uso principal del vehículo, cantidad de personas, y preferencia nuevo/usado.

No repitas datos que el usuario ya dio. Devolvé solo las preguntas, en tono amable y directo.

CRITERIOS DUROS YA CONOCIDOS:
${JSON.stringify(hardFilters, null, 2)}

CRITERIOS BLANDOS YA CONOCIDOS:
${JSON.stringify(softCriteria, null, 2)}

MENSAJE DEL USUARIO:
"${currentMessage}"`;
}
