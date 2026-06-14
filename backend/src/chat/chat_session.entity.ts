
import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, ManyToOne, OneToMany, JoinColumn } from "typeorm";
import { User } from '../users/user.entity';
import { Message } from "./message.entity";

@Entity('chat_sessions')
export class ChatSession {

    @PrimaryGeneratedColumn('uuid')
    id!: string

    @Column({type: 'uuid', nullable: false})
    user_id!: string

    @Column({type: 'varchar', length: 100, nullable: false})
    title!: string

    @CreateDateColumn({type: 'timestamp'})
    created_at!: Date

    @UpdateDateColumn({type: 'timestamp', nullable: true})
    updated_at!: Date | null

    @ManyToOne(() => User, (user) => user.sessions, {
        onDelete: 'CASCADE',
        onUpdate: 'CASCADE'
    })
    @JoinColumn({ name: 'user_id' })
    user!: User;

    @OneToMany(() => Message, (message) => message.session)
    message!: Message[]

}