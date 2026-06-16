import { ConfigService } from '@nestjs/config';
import { ListingService } from '../../products/services/listing.service';
import { RecommendationManualService } from '../../vector-store/services/recommendation-manual.service';
import { GeminiChatProvider } from '../llm/gemini.provider';
import { AgentStateType } from '../state/agentState';

/** Dependencias inyectadas que cada nodo recibe vía closure. */
export interface NodeDeps {
  listingService: ListingService;
  recommendationService: RecommendationManualService;
  llm: GeminiChatProvider;
  config: ConfigService;
}

/**
 * Un nodo del grafo: recibe el estado y devuelve una actualización parcial.
 * Puede ser síncrono o asíncrono (LangGraph acepta ambos).
 */
export type AgentNode = (
  state: AgentStateType,
) => Promise<Partial<AgentStateType>> | Partial<AgentStateType>;

/** Factory que cierra sobre las dependencias y produce un nodo. */
export type NodeFactory = (deps: NodeDeps) => AgentNode;
