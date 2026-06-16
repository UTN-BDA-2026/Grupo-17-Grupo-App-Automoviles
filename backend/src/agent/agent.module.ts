import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { ProductsModule } from '../products/products.module';
import { VectorStoreModule } from '../vector-store/vector-store.module';
import { GeminiChatProvider } from './llm/gemini.provider';
import { CheckpointerProvider } from './graphs/checkpointer.provider';
import { AgentService } from './services/agent.service';

@Module({
  imports: [ConfigModule, ProductsModule, VectorStoreModule],
  providers: [GeminiChatProvider, CheckpointerProvider, AgentService],
  exports: [AgentService],
})
export class AgentModule {}
