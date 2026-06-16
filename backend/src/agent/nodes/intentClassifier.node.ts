import { Logger } from '@nestjs/common';
import { NodeFactory } from './types';
import { intentSchema } from '../schemas/intent.schema';
import { buildIntentClassificationPrompt } from '../prompts/intentClassification.prompt';

const logger = new Logger('intentClassifier');

/**
 * Clasifica la intención del mensaje con structured output. Considera el
 * resumen de contexto para detectar refinamientos sobre búsquedas previas.
 */
export const intentClassifierNode: NodeFactory = (deps) => async (state) => {
  const model = deps.llm
    .getFastModel()
    .withStructuredOutput(intentSchema, { name: 'classify_intent' });
  const prompt = buildIntentClassificationPrompt(
    state.currentUserMessage,
    state.contextSummary,
  );
  const result = await model.invoke(prompt);

  logger.debug(`Intent: ${result.intent}`);
  return { intent: result.intent };
};
