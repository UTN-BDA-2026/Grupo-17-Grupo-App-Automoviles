import { Annotation, messagesStateReducer } from '@langchain/langgraph';
import { BaseMessage } from '@langchain/core/messages';
import { HardFilters, emptyHardFilters } from '../schemas/hardFilters.schema';
import {
  SoftCriteria,
  emptySoftCriteria,
} from '../schemas/softCriteria.schema';
import { Intent } from '../schemas/intent.schema';
import { Listing } from '../../products/models/listing.entity';

/** Regla del manual experto recuperada de la base vectorial (forma aplanada). */
export interface RecommendationRule {
  content: string;
  section_number?: number;
  section_title?: string;
  distance?: number;
}

export type LanguageDetected = 'es' | 'other' | null;

/**
 * Reducer de merge para filtros duros. Aplica las claves del update sobre el
 * estado previo. Una clave con valor null SÍ se aplica (permite retirar un
 * criterio); solo las claves undefined se ignoran. Como el parameterExtractor
 * devuelve el objeto completo ya mergeado, en la práctica se comporta como
 * reemplazo, pero tolera updates parciales.
 */
function mergeHardFilters(
  prev: HardFilters,
  update: HardFilters | undefined,
): HardFilters {
  if (!update) return prev;
  // Conserva solo las claves definidas del update (las undefined se ignoran;
  // null sí se aplica para permitir retirar un criterio).
  const defined = Object.fromEntries(
    Object.entries(update).filter(([, v]) => v !== undefined),
  ) as Partial<HardFilters>;
  return { ...prev, ...defined };
}

/** Reducer de merge profundo para criterios blandos (incluye priorities). */
function mergeSoftCriteria(
  prev: SoftCriteria,
  update: SoftCriteria | undefined,
): SoftCriteria {
  if (!update) return prev;
  return {
    purpose: update.purpose !== undefined ? update.purpose : prev.purpose,
    userProfile:
      update.userProfile !== undefined ? update.userProfile : prev.userProfile,
    priorities: { ...prev.priorities, ...update.priorities },
  };
}

export const AgentState = Annotation.Root({
  messages: Annotation<BaseMessage[]>({
    reducer: messagesStateReducer,
    default: () => [],
  }),
  currentUserMessage: Annotation<string>({
    reducer: (_prev, next) => next,
    default: () => '',
  }),
  languageDetected: Annotation<LanguageDetected>({
    reducer: (_prev, next) => next,
    default: () => null,
  }),
  intent: Annotation<Intent | null>({
    reducer: (_prev, next) => next,
    default: () => null,
  }),
  contextSummary: Annotation<string | null>({
    reducer: (_prev, next) => next,
    default: () => null,
  }),
  hardFilters: Annotation<HardFilters>({
    reducer: mergeHardFilters,
    default: emptyHardFilters,
  }),
  softCriteria: Annotation<SoftCriteria>({
    reducer: mergeSoftCriteria,
    default: emptySoftCriteria,
  }),
  candidateVehicles: Annotation<Listing[]>({
    reducer: (_prev, next) => next,
    default: () => [],
  }),
  recommendationRules: Annotation<RecommendationRule[]>({
    reducer: (_prev, next) => next,
    default: () => [],
  }),
  finalResponse: Annotation<string | null>({
    reducer: (_prev, next) => next,
    default: () => null,
  }),
  needsClarification: Annotation<boolean>({
    reducer: (_prev, next) => next,
    default: () => false,
  }),
  clarificationQuestions: Annotation<string[] | null>({
    reducer: (_prev, next) => next,
    default: () => null,
  }),
});

export type AgentStateType = typeof AgentState.State;
export type AgentStateUpdate = typeof AgentState.Update;
