import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { BaseCheckpointSaver, MemorySaver } from '@langchain/langgraph';

/**
 * Provee el checkpointer del grafo. Abstracción lista para conmutar a Redis o
 * Postgres por variable de entorno (AGENT_CHECKPOINTER). Por defecto usa
 * MemorySaver (en memoria), apropiado para desarrollo.
 */
@Injectable()
export class CheckpointerProvider {
  private readonly logger = new Logger(CheckpointerProvider.name);
  private checkpointer?: BaseCheckpointSaver;

  constructor(private readonly configService: ConfigService) {}

  public get(): BaseCheckpointSaver {
    if (this.checkpointer) return this.checkpointer;

    const kind =
      this.configService.get<string>('AGENT_CHECKPOINTER') ?? 'memory';
    switch (kind) {
      case 'memory':
      default:
        this.logger.log(`Checkpointer: MemorySaver (kind=${kind})`);
        this.checkpointer = new MemorySaver();
        break;
    }
    return this.checkpointer;
  }
}
