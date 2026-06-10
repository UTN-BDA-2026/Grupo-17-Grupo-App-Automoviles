
import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, ManyToOne, JoinColumn } from "typeorm";
import { ChatSession } from "./chat_session.entity";

export enum MessageRol {
    ASSISTANT = 'assistant',
    USER = 'user',
}

@Entity('messages')
export class Message {

    @PrimaryGeneratedColumn('uuid')
    id!: string

    @Column({type: 'uuid', nullable: false})
    session_id!: string

    @Column({type: 'varchar', length: 50, nullable: false})
    role!: MessageRol

    @Column({type: 'text', nullable: false})
    content!: string

    @CreateDateColumn({type: 'timestamp'})
    created_at!: Date

    @ManyToOne(() => ChatSession, (session) => session.message, {
        onDelete: 'CASCADE',
        onUpdate: 'CASCADE'
    })
    @JoinColumn({ name: 'session_id' })
    session!: ChatSession

}