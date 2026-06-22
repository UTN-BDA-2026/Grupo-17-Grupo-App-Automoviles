import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { ChatGoogleGenerativeAI } from '@langchain/google-genai';

/**
 * Factory de modelos de chat Gemini para el agente. Expone dos modelos:
 * - principal (`AGENT_LLM_MODEL`): síntesis de recomendaciones.
 * - rápido (`AGENT_LLM_MODEL_FAST`): tareas auxiliares (clasificación,
 *   extracción, resumen, clarificación). Reutiliza GEMINI_API_KEY.
 */
@Injectable()
export class GeminiChatProvider {
  private readonly logger = new Logger(GeminiChatProvider.name);
  private readonly apiKey: string;
  private readonly mainModelName: string;
  private readonly fastModelName: string;

  private mainModel?: ChatGoogleGenerativeAI;
  private fastModel?: ChatGoogleGenerativeAI;

  constructor(private readonly configService: ConfigService) {
    const apiKey = this.configService.get<string>('GEMINI_API_KEY');
    if (!apiKey)
      throw new Error('GEMINI_API_KEY no definida en las variables de entorno');
    this.apiKey = apiKey;
    this.mainModelName =
      this.configService.get<string>('AGENT_LLM_MODEL') ??
      'gemini-3.1-flash-lite';
    this.fastModelName =
      this.configService.get<string>('AGENT_LLM_MODEL_FAST') ??
      'gemini-3.1-flash-lite';
  }

  /** Modelo principal para síntesis (mayor temperatura para tono conversacional). */
  public getModel(): ChatGoogleGenerativeAI {
    if (!this.mainModel) {
      this.mainModel = new ChatGoogleGenerativeAI({
        apiKey: this.apiKey,
        model: this.mainModelName,
        temperature: 0.4,
      });
      this.logger.log(`Modelo principal inicializado: ${this.mainModelName}`);
    }
    return this.mainModel;
  }

  /** Modelo rápido/barato para tareas estructuradas (temperatura baja, determinista). */
  public getFastModel(): ChatGoogleGenerativeAI {
    if (!this.fastModel) {
      this.fastModel = new ChatGoogleGenerativeAI({
        apiKey: this.apiKey,
        model: this.fastModelName,
        temperature: 0,
      });
      this.logger.log(`Modelo rápido inicializado: ${this.fastModelName}`);
    }
    return this.fastModel;
  }
}
