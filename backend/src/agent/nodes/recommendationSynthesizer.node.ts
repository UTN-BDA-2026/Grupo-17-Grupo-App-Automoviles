import { Logger } from '@nestjs/common';
import { NodeFactory } from './types';
import { buildRecommendationSynthesisPrompt } from '../prompts/recommendationSynthesis.prompt';
import {
  candidatesToCompactJson,
  rulesToText,
  messageContentToString,
} from './helpers';

const logger = new Logger('recommendationSynthesizer');

/**
 * Sintetiza la recomendación final usando el modelo principal: combina
 * candidatos (JSON compacto con link), reglas expertas y contexto.
 */
export const recommendationSynthesizerNode: NodeFactory =
  (deps) => async (state) => {
    const candidatesJson = candidatesToCompactJson(state.candidateVehicles);
    const rulesText = rulesToText(state.recommendationRules);

    const model = deps.llm.getModel();
    const prompt = buildRecommendationSynthesisPrompt(
      candidatesJson,
      rulesText,
      state.contextSummary,
      state.currentUserMessage,
    );

    const res = await model.invoke(prompt);
    logger.debug(
      `Recomendación sintetizada sobre ${state.candidateVehicles.length} candidatos`,
    );

    return { finalResponse: messageContentToString(res.content).trim() };
  };
