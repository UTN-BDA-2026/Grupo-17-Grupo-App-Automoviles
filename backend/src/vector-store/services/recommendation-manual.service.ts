import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import * as fs from 'fs';
import * as path from 'path';
import * as crypto from 'crypto';
import {
  RecommendationManualRepository,
  QueryResult,
  GetResult,
} from '../repositories/recommendation-manual.repository';
import { GeminiEmbeddingService } from './gemini-embedding.service';

interface DocumentChunk {
  id: string;
  content: string;
  metadata: {
    section_number: number;
    section_title: string;
    source: string;
  };
}

export interface SyncResult {
  chunksProcessed: number;
  collectionName: string;
}

@Injectable()
export class RecommendationManualService {
  private readonly logger = new Logger(RecommendationManualService.name);
  private readonly documentPath = path.join(
    __dirname,
    '..',
    'documents',
    'recommendation_manual.md',
  );

  constructor(
    private readonly repository: RecommendationManualRepository,
    private readonly embeddingService: GeminiEmbeddingService,
  ) {}

  public async sync(): Promise<SyncResult> {
    this.logger.log('Iniciando sincronización del manual de recomendación...');

    if (!fs.existsSync(this.documentPath)) {
      throw new NotFoundException(
        `Documento no encontrado en: ${this.documentPath}`,
      );
    }

    const content = fs.readFileSync(this.documentPath, 'utf-8');
    const chunks = this.chunkDocument(content);
    this.logger.log(`Documento dividido en ${chunks.length} secciones`);

    this.logger.log('Limpiando colección existente...');
    await this.repository.drop();

    this.logger.log('Generando embeddings con Gemini...');
    const embeddings = await this.embeddingService.embedDocuments(
      chunks.map((c) => c.content),
    );

    this.logger.log('Almacenando chunks en ChromaDB...');
    await this.repository.store({
      ids: chunks.map((c) => c.id),
      documents: chunks.map((c) => c.content),
      embeddings,
      metadatas: chunks.map((c) => c.metadata),
    });

    this.logger.log(
      `Sincronización completada: ${chunks.length} chunks almacenados`,
    );
    return {
      chunksProcessed: chunks.length,
      collectionName: 'recommendation_manual',
    };
  }

  public async query(
    question: string,
    limit = 5,
    filter?: Record<string, any>,
  ): Promise<QueryResult> {
    const queryEmbedding = await this.embeddingService.embedQuery(question);
    return this.repository.query(queryEmbedding, limit, filter);
  }

  public async find(filter: Record<string, any>): Promise<GetResult> {
    return this.repository.find(filter);
  }

  async store(
    content: string,
    metadata: Record<string, any> = {},
  ): Promise<{ id: string }> {
    const id = crypto.randomUUID();
    const [embedding] = await this.embeddingService.embedDocuments([content]);
    await this.repository.store({
      ids: [id],
      documents: [content],
      embeddings: [embedding],
      metadatas: [{ ...metadata, source: 'manual' }],
    });
    return { id };
  }

  public async drop(
    filter?: Record<string, any>,
  ): Promise<{ message: string }> {
    await this.repository.drop(filter);
    const scope = filter ? `con filtro ${JSON.stringify(filter)}` : 'completa';
    return { message: `Colección limpiada ${scope}` };
  }

  public async count(): Promise<{ count: number }> {
    const count = await this.repository.count();
    return { count };
  }

  private chunkDocument(content: string): DocumentChunk[] {
    const rawSections = content
      .split(/\n(?=## \d+\.)/)
      .filter((s) => s.trim().length > 0);

    // La primera entrada puede ser la introducción del documento (sin número de sección).
    // La filtramos si no tiene encabezado ## N. para que no genere un section_number falso.
    const sections = rawSections.filter((s) => /^## \d+\./m.test(s));

    return sections.map((section) => {
      const titleMatch = section.match(/^## \d+\.\s+(.+)$/m);
      const sectionNumberMatch = section.match(/^## (\d+)\./m);
      const sectionNumber = parseInt(sectionNumberMatch![1], 10);
      const title = titleMatch
        ? titleMatch[1].trim()
        : `Sección ${sectionNumber}`;

      return {
        id: crypto.randomUUID(),
        content: section.trim(),
        metadata: {
          section_number: sectionNumber,
          section_title: title,
          source: 'recommendation_manual',
        },
      };
    });
  }
}
