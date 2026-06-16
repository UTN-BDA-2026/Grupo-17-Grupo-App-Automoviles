import { Logger } from '@nestjs/common';
import { NodeFactory } from './types';
import { buildClarificationPrompt } from '../prompts/clarification.prompt';
import { messageContentToString } from './helpers';

const logger = new Logger('clarificationAsker');

/**
 * Genera 2-3 preguntas breves cuando los criterios son insuficientes. Corta el
 * flujo: la respuesta queda a la espera de que el usuario responda.
 */
export const clarificationAskerNode: NodeFactory = (deps) => async (state) => {
  const model = deps.llm.getFastModel();
  const prompt = buildClarificationPrompt(
    state.currentUserMessage,
    state.hardFilters,
    state.softCriteria,
  );
  const res = await model.invoke(prompt);
  const text = messageContentToString(res.content).trim();

  logger.debug('Preguntas de clarificación generadas');
  const questions = text
    .split('\n')
    .map((q) => q.trim())
    .filter((q) => q.length > 0);

  return {
    finalResponse: text,
    clarificationQuestions: questions.length > 0 ? questions : [text],
    needsClarification: true,
  };
};
