import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { GeminiEmbeddingService } from './services/gemini-embedding.service';
import { RecommendationManualRepository } from './repositories/recommendation-manual.repository';
import { RecommendationManualService } from './services/recommendation-manual.service';
import { VectorStoreController } from './vector-store.controller';
import { AuthModule } from '../auth/auth.module';

@Module({
  imports: [ConfigModule, AuthModule],
  controllers: [VectorStoreController],
  providers: [
    GeminiEmbeddingService,
    RecommendationManualRepository,
    RecommendationManualService,
  ],
  exports: [RecommendationManualService, GeminiEmbeddingService],
})
export class VectorStoreModule {}
