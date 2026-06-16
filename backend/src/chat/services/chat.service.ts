import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ChatSession } from '../models/chat_session.entity';
import { Message, MessageRol } from '../models/message.entity';

@Injectable()
export class ChatService {
  constructor(
    @InjectRepository(ChatSession)
    private readonly sessionRepository: Repository<ChatSession>,
    @InjectRepository(Message)
    private readonly messageRepository: Repository<Message>,
  ) {}

  /** Crea una nueva sesión de chat para el usuario. */
  public async createSession(
    userId: string,
    title?: string,
  ): Promise<ChatSession> {
    const session = this.sessionRepository.create({
      user_id: userId,
      title: title ?? 'Nueva conversación',
    });
    return this.sessionRepository.save(session);
  }

  /** Lista las sesiones del usuario, ordenadas por última actualización. */
  public async listSessions(userId: string): Promise<ChatSession[]> {
    return this.sessionRepository.find({
      where: { user_id: userId },
      order: { updated_at: 'DESC', created_at: 'DESC' },
    });
  }

  /** Obtiene una sesión con sus mensajes, validando que pertenezca al usuario. */
  public async getSession(
    sessionId: string,
    userId: string,
  ): Promise<ChatSession> {
    const session = await this.sessionRepository.findOne({
      where: { id: sessionId, user_id: userId },
      relations: { message: true },
      order: { message: { created_at: 'ASC' } },
    });
    if (!session) {
      throw new NotFoundException('La conversación no existe');
    }
    return session;
  }

  /** Devuelve los mensajes de una sesión en orden cronológico. */
  public async getMessages(sessionId: string): Promise<Message[]> {
    return this.messageRepository.find({
      where: { session_id: sessionId },
      order: { created_at: 'ASC' },
    });
  }

  /** Persiste un mensaje en una sesión. */
  public async addMessage(
    sessionId: string,
    role: MessageRol,
    content: string,
  ): Promise<Message> {
    const message = this.messageRepository.create({
      session_id: sessionId,
      role,
      content,
    });
    const saved = await this.messageRepository.save(message);
    // Toca la sesión para refrescar updated_at.
    await this.sessionRepository.update(sessionId, { updated_at: new Date() });
    return saved;
  }
}
