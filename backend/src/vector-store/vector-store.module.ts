import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { GeminiEmbeddingService } from './services/gemini-embedding.service';
import { RecommendationManualRepository } from './repositories/recommendation-manual.repository';
import { RecommendationManualService } from './services/recommendation-manual.service';
import { VectorStoreController } from './vector-store.controller';

@Module({
    imports: [ConfigModule],
    controllers: [VectorStoreController],
    providers: [
        GeminiEmbeddingService,
        RecommendationManualRepository,
        RecommendationManualService,
    ],
    exports: [RecommendationManualService, GeminiEmbeddingService],
})
export class VectorStoreModule {}
