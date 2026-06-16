import {
  StateGraph,
  START,
  END,
  BaseCheckpointSaver,
} from '@langchain/langgraph';
import { AgentState, AgentStateType } from '../state/agentState';
import { NodeDeps } from '../nodes/types';

import { languageGuardNode } from '../nodes/languageGuard.node';
import { contextSummarizerNode } from '../nodes/contextSummarizer.node';
import { intentClassifierNode } from '../nodes/intentClassifier.node';
import { parameterExtractorNode } from '../nodes/parameterExtractor.node';
import { filterValidatorNode } from '../nodes/filterValidator.node';
import { clarificationAskerNode } from '../nodes/clarificationAsker.node';
import { relationalDBQueryNode } from '../nodes/relationalDBQuery.node';
import { vectorDBQueryNode } from '../nodes/vectorDBQuery.node';
import { resultsJoinerNode } from '../nodes/resultsJoiner.node';
import { noResultsHandlerNode } from '../nodes/noResultsHandler.node';
import { recommendationSynthesizerNode } from '../nodes/recommendationSynthesizer.node';
import { responseFormatterNode } from '../nodes/responseFormatter.node';
import { informationalResponderNode } from '../nodes/informationalResponder.node';
import { smallTalkResponderNode } from '../nodes/smallTalkResponder.node';

const N = {
  languageGuard: 'languageGuard',
  contextSummarizer: 'contextSummarizer',
  intentClassifier: 'intentClassifier',
  parameterExtractor: 'parameterExtractor',
  filterValidator: 'filterValidator',
  clarificationAsker: 'clarificationAsker',
  relationalDBQuery: 'relationalDBQuery',
  vectorDBQuery: 'vectorDBQuery',
  resultsJoiner: 'resultsJoiner',
  noResultsHandler: 'noResultsHandler',
  recommendationSynthesizer: 'recommendationSynthesizer',
  responseFormatter: 'responseFormatter',
  informationalResponder: 'informationalResponder',
  smallTalkResponder: 'smallTalkResponder',
} as const;

/**
 * Construye y compila el grafo de recomendación. Cada nodo se instancia con las
 * dependencias inyectadas (servicios Nest) vía closure. Compila con el
 * checkpointer provisto para persistir estado por threadId.
 */
export function buildRecommendationGraph(
  deps: NodeDeps,
  checkpointer: BaseCheckpointSaver,
) {
  const workflow = new StateGraph(AgentState)
    .addNode(N.languageGuard, languageGuardNode(deps))
    .addNode(N.contextSummarizer, contextSummarizerNode(deps))
    .addNode(N.intentClassifier, intentClassifierNode(deps))
    .addNode(N.parameterExtractor, parameterExtractorNode(deps))
    .addNode(N.filterValidator, filterValidatorNode(deps))
    .addNode(N.clarificationAsker, clarificationAskerNode(deps))
    .addNode(N.relationalDBQuery, relationalDBQueryNode(deps))
    .addNode(N.vectorDBQuery, vectorDBQueryNode(deps))
    .addNode(N.resultsJoiner, resultsJoinerNode(deps))
    .addNode(N.noResultsHandler, noResultsHandlerNode(deps))
    .addNode(N.recommendationSynthesizer, recommendationSynthesizerNode(deps))
    .addNode(N.responseFormatter, responseFormatterNode(deps))
    .addNode(N.informationalResponder, informationalResponderNode(deps))
    .addNode(N.smallTalkResponder, smallTalkResponderNode(deps));

  workflow.addEdge(START, N.languageGuard);

  // Idioma: si no es español, cortar.
  workflow.addConditionalEdges(
    N.languageGuard,
    (state: AgentStateType) =>
      state.languageDetected === 'other' ? END : N.contextSummarizer,
    [N.contextSummarizer, END],
  );

  workflow.addEdge(N.contextSummarizer, N.intentClassifier);

  // Ruteo por intención.
  workflow.addConditionalEdges(
    N.intentClassifier,
    (state: AgentStateType) => {
      switch (state.intent) {
        case 'INFORMATIONAL':
          return N.vectorDBQuery;
        case 'RECOMMENDATION_REQUEST':
        case 'REFINEMENT':
          return N.parameterExtractor;
        case 'SMALL_TALK':
        case 'OUT_OF_SCOPE':
        default:
          return N.smallTalkResponder;
      }
    },
    [N.vectorDBQuery, N.parameterExtractor, N.smallTalkResponder],
  );

  workflow.addEdge(N.parameterExtractor, N.filterValidator);

  // Validación: clarificar o disparar el fork paralelo (relacional ‖ vectorial).
  workflow.addConditionalEdges(
    N.filterValidator,
    (state: AgentStateType) =>
      state.needsClarification
        ? N.clarificationAsker
        : [N.relationalDBQuery, N.vectorDBQuery],
    [N.clarificationAsker, N.relationalDBQuery, N.vectorDBQuery],
  );

  workflow.addEdge(N.relationalDBQuery, N.resultsJoiner);

  // Tras la consulta vectorial: rama informativa o unión con la relacional.
  workflow.addConditionalEdges(
    N.vectorDBQuery,
    (state: AgentStateType) =>
      state.intent === 'INFORMATIONAL'
        ? N.informationalResponder
        : N.resultsJoiner,
    [N.informationalResponder, N.resultsJoiner],
  );

  // ¿Hay candidatos?
  workflow.addConditionalEdges(
    N.resultsJoiner,
    (state: AgentStateType) =>
      state.candidateVehicles.length === 0
        ? N.noResultsHandler
        : N.recommendationSynthesizer,
    [N.noResultsHandler, N.recommendationSynthesizer],
  );

  workflow.addEdge(N.recommendationSynthesizer, N.responseFormatter);
  workflow.addEdge(N.responseFormatter, END);
  workflow.addEdge(N.noResultsHandler, END);
  workflow.addEdge(N.clarificationAsker, END);
  workflow.addEdge(N.informationalResponder, END);
  workflow.addEdge(N.smallTalkResponder, END);

  return workflow.compile({ checkpointer });
}

export type RecommendationGraph = ReturnType<typeof buildRecommendationGraph>;
