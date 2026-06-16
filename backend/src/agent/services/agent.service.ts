import { Injectable, Logger, OnModuleInit } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { HumanMessage, AIMessage, BaseMessage } from '@langchain/core/messages';
import { ListingService } from '../../products/services/listing.service';
import { RecommendationManualService } from '../../vector-store/services/recommendation-manual.service';
import { GeminiChatProvider } from '../llm/gemini.provider';
import { CheckpointerProvider } from '../graphs/checkpointer.provider';
import {
  buildRecommendationGraph,
  RecommendationGraph,
} from '../graphs/recommendationGraph';
import { HardFilters, emptyHardFilters } from '../schemas/hardFilters.schema';
import { Intent } from '../schemas/intent.schema';

/** Turno de conversación tal como lo persiste el módulo chat (fuente de verdad). */
export interface ChatTurn {
  id: string;
  role: 'user' | 'assistant';
  content: string;
}

export interface AgentResponse {
  finalResponse: string;
  intent: Intent | null;
  filtersApplied: HardFilters;
  candidatesFound: number;
  needsClarification: boolean;
}

const TECHNICAL_ERROR_MESSAGE =
  'Tuvimos un problema técnico al procesar tu mensaje. Por favor, intentá nuevamente en unos instantes.';

/**
 * Encapsula la invocación del grafo de recomendación. Persiste estado por
 * threadId (= id de la sesión de chat) vía checkpointer. El historial de
 * mensajes llega desde el módulo chat (MySQL como fuente de verdad) para evitar
 * dependencia circular y para sobrevivir reinicios del proceso.
 */
@Injectable()
export class AgentService implements OnModuleInit {
  private readonly logger = new Logger(AgentService.name);
  private graph!: RecommendationGraph;

  constructor(
    private readonly listingService: ListingService,
    private readonly recommendationService: RecommendationManualService,
    private readonly llm: GeminiChatProvider,
    private readonly checkpointerProvider: CheckpointerProvider,
    private readonly config: ConfigService,
  ) {}

  onModuleInit() {
    this.graph = buildRecommendationGraph(
      {
        listingService: this.listingService,
        recommendationService: this.recommendationService,
        llm: this.llm,
        config: this.config,
      },
      this.checkpointerProvider.get(),
    );
    this.logger.log('Grafo de recomendación compilado');
  }

  /**
   * Procesa un mensaje del usuario en el contexto de una conversación.
   * @param threadId id de la sesión de chat (correlación del checkpointer).
   * @param userMessage texto del mensaje actual del usuario.
   * @param history historial completo de la sesión (incluye el mensaje actual),
   *                con ids de MySQL para que el reducer deduplique mensajes.
   */
  async sendMessage(
    threadId: string,
    userMessage: string,
    history: ChatTurn[] = [],
    userId?: string,
  ): Promise<AgentResponse> {
    const config = { configurable: { thread_id: threadId } };
    const messages: BaseMessage[] = history.map((turn) =>
      turn.role === 'user'
        ? new HumanMessage({ id: turn.id, content: turn.content })
        : new AIMessage({ id: turn.id, content: turn.content }),
    );

    this.logger.log(
      `[${threadId}] sendMessage (user=${userId ?? 'anon'}, history=${history.length})`,
    );

    try {
      const result = await this.graph.invoke(
        {
          // Mensajes (deduplicados por id); estado transitorio reseteado por turno.
          messages,
          currentUserMessage: userMessage,
          languageDetected: null,
          intent: null,
          contextSummary: null,
          candidateVehicles: [],
          recommendationRules: [],
          finalResponse: null,
          needsClarification: false,
          clarificationQuestions: null,
        },
        config,
      );

      const response: AgentResponse = {
        finalResponse: result.finalResponse ?? TECHNICAL_ERROR_MESSAGE,
        intent: result.intent,
        filtersApplied: result.hardFilters ?? emptyHardFilters(),
        candidatesFound: result.candidateVehicles?.length ?? 0,
        needsClarification: result.needsClarification ?? false,
      };

      this.logger.log(
        `[${threadId}] intent=${response.intent} candidatos=${response.candidatesFound} clarif=${response.needsClarification}`,
      );
      return response;
    } catch (err) {
      const message = err instanceof Error ? err.message : String(err);
      this.logger.error(`[${threadId}] Error en el grafo: ${message}`);
      return {
        finalResponse: TECHNICAL_ERROR_MESSAGE,
        intent: null,
        filtersApplied: emptyHardFilters(),
        candidatesFound: 0,
        needsClarification: false,
      };
    }
  }
}
