import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ChatSession } from './models/chat_session.entity';
import { Message } from './models/message.entity';
import { ChatService } from './services/chat.service';
import { ChatController } from './chat.controller';
import { AuthModule } from '../auth/auth.module';
import { AgentModule } from '../agent/agent.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([ChatSession, Message]),
    AuthModule,
    AgentModule,
  ],
  controllers: [ChatController],
  providers: [ChatService],
  exports: [ChatService],
})
export class ChatModule {}
