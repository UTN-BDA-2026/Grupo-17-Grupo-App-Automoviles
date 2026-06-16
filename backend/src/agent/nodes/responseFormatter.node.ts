import { Logger } from '@nestjs/common';
import { NodeFactory } from './types';

const logger = new Logger('responseFormatter');

const DISCLAIMER =
  'Recordá verificar el estado real del vehículo, la documentación y un chequeo mecánico antes de comprar.';

/**
 * Última capa de garantía (sin LLM): asegura que haya respuesta y agrega un
 * disclaimer de verificación si la síntesis no lo incluyó. El idioma ya está
 * garantizado por los prompts y el languageGuard inicial.
 */
export const responseFormatterNode: NodeFactory = () => (state) => {
  let response = state.finalResponse?.trim() ?? '';

  if (!response) {
    response =
      'No pude generar una recomendación en este momento. ¿Podés darme más detalles sobre lo que buscás?';
  }

  const mentionsCheck = /verific|chequeo|revis/i.test(response);
  if (!mentionsCheck) {
    response = `${response}\n\n${DISCLAIMER}`;
  }

  logger.debug('Respuesta formateada');
  return { finalResponse: response };
};
