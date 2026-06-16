import { Logger } from '@nestjs/common';
import { NodeFactory } from './types';

const logger = new Logger('languageGuard');

export const REJECTION_MESSAGE =
  'Lo siento, solo puedo atenderte en español. ¿En qué puedo ayudarte con tu búsqueda de un vehículo?';

/**
 * Primer nodo del grafo. Detecta el idioma del mensaje SIN usar LLM (franc-min).
 * Si no es español, corta el flujo con un mensaje de rechazo en español.
 * franc-min es ESM puro: se carga vía import dinámico (compatible con nodenext).
 */
export const languageGuardNode: NodeFactory = () => async (state) => {
  const text = state.currentUserMessage ?? '';

  const { franc } = await import('franc-min');
  const lang = franc(text, { minLength: 3 });

  // 'und' (indeterminado, típico en mensajes muy cortos) se trata como español
  // para no rechazar mensajes válidos por falta de muestra.
  const languageDetected: 'es' | 'other' =
    lang === 'spa' || lang === 'und' ? 'es' : 'other';

  logger.debug(`Idioma detectado: ${lang} -> ${languageDetected}`);

  if (languageDetected === 'other') {
    return {
      languageDetected,
      finalResponse: REJECTION_MESSAGE,
    };
  }

  return { languageDetected };
};
