import {
  Controller,
  Get,
  Post,
  Param,
  Body,
  UseGuards,
  ParseUUIDPipe,
} from '@nestjs/common';
import {
  ApiTags,
  ApiBearerAuth,
  ApiOperation,
  ApiOkResponse,
  ApiCreatedResponse,
  ApiUnauthorizedResponse,
  ApiNotFoundResponse,
  ApiParam,
} from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { CurrentUser } from '../auth/decorators/current-user.decorator';
import { ChatService } from './services/chat.service';
import { AgentService, ChatTurn } from '../agent/services/agent.service';
import { MessageRol } from './models/message.entity';
import { CreateSessionDto } from './dto/create-session.dto';
import { SendMessageDto } from './dto/send-message.dto';

@ApiTags('chat')
@ApiBearerAuth('jwt')
@ApiUnauthorizedResponse({ description: 'Token no provisto, inválido o expirado.' })
@Controller('api/chat')
@UseGuards(JwtAuthGuard)
export class ChatController {
  constructor(
    private readonly chatService: ChatService,
    private readonly agentService: AgentService,
  ) {}

  /** Crea una nueva conversación. */
  @Post()
  @ApiOperation({
    summary: 'Crear una conversación',
    description: 'Crea una nueva sesión de chat para el usuario autenticado.',
  })
  @ApiCreatedResponse({ description: 'Conversación creada.' })
  async createSession(
    @CurrentUser() user: { id: string },
    @Body() dto: CreateSessionDto,
  ) {
    return this.chatService.createSession(user.id, dto.title);
  }

  /** Lista las conversaciones del usuario. */
  @Get()
  @ApiOperation({
    summary: 'Listar conversaciones',
    description: 'Devuelve las conversaciones del usuario, de la más reciente a la más antigua.',
  })
  @ApiOkResponse({ description: 'Listado de conversaciones.' })
  async listSessions(@CurrentUser() user: { id: string }) {
    return this.chatService.listSessions(user.id);
  }

  /** Obtiene una conversación con sus mensajes. */
  @Get(':id')
  @ApiOperation({
    summary: 'Obtener una conversación',
    description: 'Devuelve la conversación (con sus mensajes) si pertenece al usuario.',
  })
  @ApiParam({ name: 'id', description: 'Id de la conversación (UUID)', format: 'uuid' })
  @ApiOkResponse({ description: 'Conversación con sus mensajes.' })
  @ApiNotFoundResponse({ description: 'La conversación no existe o no pertenece al usuario.' })
  async getSession(
    @CurrentUser() user: { id: string },
    @Param('id', new ParseUUIDPipe({ errorHttpStatusCode: 400 })) id: string,
  ) {
    return this.chatService.getSession(id, user.id);
  }

  /**
   * Envía un mensaje a la conversación: persiste el mensaje del usuario,
   * invoca al agente y persiste la respuesta del asistente.
   */
  @Post(':sessionId/messages')
  @ApiOperation({
    summary: 'Enviar un mensaje al agente',
    description:
      'Persiste el mensaje del usuario, invoca al agente recomendador y persiste la respuesta. ' +
      'Devuelve ambos mensajes y metadata del agente (intent, filtros aplicados, candidatos, etc.).',
  })
  @ApiParam({ name: 'sessionId', description: 'Id de la conversación (UUID)', format: 'uuid' })
  @ApiCreatedResponse({ description: 'Mensaje procesado; devuelve la respuesta del asistente.' })
  @ApiNotFoundResponse({ description: 'La conversación no existe o no pertenece al usuario.' })
  async sendMessage(
    @CurrentUser() user: { id: string },
    @Param('sessionId', new ParseUUIDPipe({ errorHttpStatusCode: 400 }))
    sessionId: string,
    @Body() dto: SendMessageDto,
  ) {
    // Valida pertenencia (404 si no existe o no es del usuario).
    await this.chatService.getSession(sessionId, user.id);

    const userMessage = await this.chatService.addMessage(
      sessionId,
      MessageRol.USER,
      dto.content,
    );

    // Historial completo (incluye el mensaje recién persistido) para el agente.
    const history: ChatTurn[] = (
      await this.chatService.getMessages(sessionId)
    ).map((m) => ({
      id: m.id,
      role: m.role === MessageRol.USER ? 'user' : 'assistant',
      content: m.content,
    }));

    const agentResult = await this.agentService.sendMessage(
      sessionId,
      dto.content,
      history,
      user.id,
    );

    const assistantMessage = await this.chatService.addMessage(
      sessionId,
      MessageRol.ASSISTANT,
      agentResult.finalResponse,
    );

    return {
      conversationId: sessionId,
      userMessage: {
        id: userMessage.id,
        content: userMessage.content,
        createdAt: userMessage.created_at,
      },
      assistantMessage: {
        id: assistantMessage.id,
        content: assistantMessage.content,
        createdAt: assistantMessage.created_at,
      },
      metadata: {
        intent: agentResult.intent,
        filtersApplied: agentResult.filtersApplied,
        candidatesFound: agentResult.candidatesFound,
        needsClarification: agentResult.needsClarification,
      },
    };
  }
}
