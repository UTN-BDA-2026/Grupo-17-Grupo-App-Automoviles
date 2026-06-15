
import { Injectable, InternalServerErrorException, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { GoogleGenerativeAI, TaskType } from '@google/generative-ai';

@Injectable()
export class GeminiEmbeddingService {

    private readonly logger = new Logger(GeminiEmbeddingService.name);
    private readonly model: ReturnType<GoogleGenerativeAI['getGenerativeModel']>;

    constructor(private readonly configService: ConfigService) {
        const apiKey = this.configService.get<string>('GEMINI_API_KEY');
        if (!apiKey) throw new Error('GEMINI_API_KEY no definida en las variables de entorno');

        const genAI = new GoogleGenerativeAI(apiKey);
        this.model = genAI.getGenerativeModel({ model: 'gemini-embedding-2' });
    }

    async embedQuery(text: string): Promise<number[]> {
        try {
            const result = await this.model.embedContent({
                content: { parts: [{ text }], role: 'user' },
                taskType: TaskType.RETRIEVAL_QUERY,
            });
            return result.embedding.values;
        } catch (err: any) {
            this.logger.error(`Error al embeber query: ${err.message}`);
            throw new InternalServerErrorException('Error al generar embedding de la consulta');
        }
    }

    async embedDocuments(texts: string[]): Promise<number[][]> {
        if (texts.length === 0) return [];
        try {
            const result = await this.model.batchEmbedContents({
                requests: texts.map(text => ({
                    content: { parts: [{ text }], role: 'user' },
                    taskType: TaskType.RETRIEVAL_DOCUMENT,
                })),
            });
            return result.embeddings.map(e => e.values);
        } catch (err: any) {
            this.logger.error(`Error al embeber documentos: ${err.message}`);
            throw new InternalServerErrorException('Error al generar embeddings de los documentos');
        }
    }
}
