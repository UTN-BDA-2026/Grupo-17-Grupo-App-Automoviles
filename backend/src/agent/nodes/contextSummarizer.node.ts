import { Logger } from '@nestjs/common';
import { NodeFactory } from './types';
import { messagesToTranscript, messageContentToString } from './helpers';
import { buildContextSummarizationPrompt } from '../prompts/contextSummarization.prompt';

const logger = new Logger('contextSummarizer');

/**
 * Lee el historial completo. Si es corto, lo pasa tal cual como contexto.
 * Si supera el umbral (AGENT_CONTEXT_SUMMARY_THRESHOLD), lo comprime con el
 * modelo rápido enfocándose en preferencias, presupuesto y rechazos.
 */
export const contextSummarizerNode: NodeFactory = (deps) => async (state) => {
  const threshold = parseInt(
    deps.config.get<string>('AGENT_CONTEXT_SUMMARY_THRESHOLD') ?? '12',
    10,
  );
  const transcript = messagesToTranscript(state.messages);

  if (state.messages.length <= threshold) {
    return { contextSummary: transcript || null };
  }

  logger.debug(`Resumiendo historial de ${state.messages.length} mensajes`);
  const model = deps.llm.getFastModel();
  const res = await model.invoke(buildContextSummarizationPrompt(transcript));
  return { contextSummary: messageContentToString(res.content) };
};
