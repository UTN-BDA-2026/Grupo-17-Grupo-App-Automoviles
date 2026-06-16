import { Logger } from '@nestjs/common';
import { NodeFactory } from './types';
import { extractionOutputSchema } from '../schemas/extractionOutput.schema';
import { buildParameterExtractionPrompt } from '../prompts/parameterExtraction.prompt';

const logger = new Logger('parameterExtractor');

/**
 * Extrae filtros duros y criterios blandos del mensaje actual, haciendo merge
 * acumulativo sobre los previos. El LLM devuelve el objeto completo ya mergeado;
 * los reducers del estado lo integran.
 */
export const parameterExtractorNode: NodeFactory = (deps) => async (state) => {
  const model = deps.llm
    .getFastModel()
    .withStructuredOutput(extractionOutputSchema, {
      name: 'extract_parameters',
    });

  const prompt = buildParameterExtractionPrompt(
    state.currentUserMessage,
    state.contextSummary,
    state.hardFilters,
    state.softCriteria,
  );

  const result = await model.invoke(prompt);

  logger.debug(
    `Filtros extraídos (retiro=${result.userExplicitlyRetiredCriterion})`,
  );
  return {
    hardFilters: result.hardFilters,
    softCriteria: result.softCriteria,
  };
};
