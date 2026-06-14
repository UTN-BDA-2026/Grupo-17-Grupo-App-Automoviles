import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, OneToMany } from 'typeorm';
import { ChatSession } from '../chat/chat_session.entity';

@Entity('users')
export class User {

    @PrimaryGeneratedColumn('uuid')
    id!: string;

    @Column({ type: 'varchar', length: 50, unique: true })
    email!: string;

    @Column({ type: 'json', nullable: true })
    preferences!: Record<string, any>;

    @CreateDateColumn({ type: 'timestamp' })
    created_at!: Date;

    @OneToMany(() => ChatSession, (session) => session.user)
    sessions!: ChatSession[];
    
}