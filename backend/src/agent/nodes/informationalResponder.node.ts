import { Logger } from '@nestjs/common';
import { NodeFactory } from './types';
import { buildInformationalPrompt } from '../prompts/informational.prompt';
import { rulesToText, messageContentToString } from './helpers';

const logger = new Logger('informationalResponder');

/**
 * Rama informativa: responde preguntas educativas usando solo las reglas
 * recuperadas de la base vectorial, sin tocar la base relacional.
 */
export const informationalResponderNode: NodeFactory =
  (deps) => async (state) => {
    const rulesText = rulesToText(state.recommendationRules);
    const model = deps.llm.getModel();
    const res = await model.invoke(
      buildInformationalPrompt(rulesText, state.currentUserMessage),
    );

    logger.debug('Respuesta informativa generada');
    return { finalResponse: messageContentToString(res.content).trim() };
  };
