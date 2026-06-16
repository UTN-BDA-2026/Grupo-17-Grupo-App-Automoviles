import { Logger } from '@nestjs/common';
import { NodeFactory } from './types';
import { messageContentToString } from './helpers';
import { SPANISH_DIRECTIVE } from '../prompts/spanishDirective';

const logger = new Logger('smallTalkResponder');

/**
 * Maneja SMALL_TALK y OUT_OF_SCOPE: respuesta breve y reencauce hacia la tarea
 * de recomendación de vehículos.
 */
export const smallTalkResponderNode: NodeFactory = (deps) => async (state) => {
  const prompt = `Sos un asistente recomendador de vehículos. El usuario dijo algo casual o fuera de tema.
${SPANISH_DIRECTIVE}
Respondé de forma breve y amable, y reencauzá ofreciendo ayudar a encontrar un vehículo.

Mensaje del usuario: "${state.currentUserMessage}"`;

  const model = deps.llm.getFastModel();
  const res = await model.invoke(prompt);
  logger.debug('Respuesta de small talk generada');

  return { finalResponse: messageContentToString(res.content).trim() };
};
