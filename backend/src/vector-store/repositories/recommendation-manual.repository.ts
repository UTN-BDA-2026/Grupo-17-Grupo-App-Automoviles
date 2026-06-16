import {
  Injectable,
  InternalServerErrorException,
  Logger,
  OnModuleInit,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { ChromaClient, Collection, IncludeEnum } from 'chromadb';

export interface StoreParams {
  ids: string[];
  documents: string[];
  embeddings: number[][];
  metadatas: Record<string, any>[];
}

export interface QueryResult {
  ids: string[][];
  documents: (string | null)[][];
  metadatas: (Record<string, any> | null)[][];
  distances: (number | null)[][];
}

export interface GetResult {
  ids: string[];
  documents: (string | null)[];
  metadatas: (Record<string, any> | null)[];
}

@Injectable()
export class RecommendationManualRepository implements OnModuleInit {
  private readonly logger = new Logger(RecommendationManualRepository.name);
  private readonly collectionName = 'recommendation_manual';
  private readonly client: ChromaClient;
  private collection!: Collection;

  constructor(private readonly configService: ConfigService) {
    this.client = new ChromaClient({
      path: `http://${configService.get('VECTOR_DB_HOST')}:${configService.get('VECTOR_DB_PORT')}`,
    });
  }

  public async onModuleInit() {
    try {
      this.collection = await this.client.getOrCreateCollection({
        name: this.collectionName,
      });
      const count = await this.collection.count();
      this.logger.log(
        `Colección "${this.collectionName}" lista (${count} chunks)`,
      );
    } catch (err: any) {
      throw new InternalServerErrorException(
        `No se pudo conectar con ChromaDB: ${err.message}`,
      );
    }
  }

  async store(params: StoreParams): Promise<void> {
    const { ids, documents, embeddings, metadatas } = params;
    await this.collection.upsert({ ids, documents, embeddings, metadatas });
  }

  public async find(filter: Record<string, any>): Promise<GetResult> {
    const result = await this.collection.get({
      where: this.buildWhereClause(filter),
      include: [IncludeEnum.documents, IncludeEnum.metadatas],
    });
    return {
      ids: result.ids,
      documents: result.documents,
      metadatas: result.metadatas,
    };
  }

  async query(
    queryEmbedding: number[],
    limit: number,
    filter?: Record<string, any>,
  ): Promise<QueryResult> {
    const result = await this.collection.query({
      queryEmbeddings: [queryEmbedding],
      nResults: limit,
      where: filter ? this.buildWhereClause(filter) : undefined,
      include: [
        IncludeEnum.documents,
        IncludeEnum.metadatas,
        IncludeEnum.distances,
      ],
    });
    return {
      ids: result.ids,
      documents: result.documents,
      metadatas: result.metadatas,
      distances: result.distances ?? [[]],
    };
  }

  public async drop(filter?: Record<string, any>): Promise<void> {
    if (filter) {
      await this.collection.delete({ where: this.buildWhereClause(filter) });
      return;
    }
    await this.client.deleteCollection({ name: this.collectionName });
    this.collection = await this.client.createCollection({
      name: this.collectionName,
    });
  }

  public async count(): Promise<number> {
    return this.collection.count();
  }

  private buildWhereClause(filter: Record<string, any>): Record<string, any> {
    const entries = Object.entries(filter).filter(([, v]) => v !== undefined);
    if (entries.length === 1) return { [entries[0][0]]: entries[0][1] };
    return { $and: entries.map(([k, v]) => ({ [k]: v })) };
  }
}
