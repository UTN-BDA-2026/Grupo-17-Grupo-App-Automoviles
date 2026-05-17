
import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, ManyToOne, OneToMany, JoinColumn } from "typeorm";
import { Brand } from "./brand.entity";
import { Vehicle } from "./vehicle.entity";

export enum MessageRol {
    ASSISTANT = 'assistant',
    USER = 'user',
}

@Entity('models')
export class Model {

    @PrimaryGeneratedColumn('uuid')
    id!: string

    @Column({type: 'uuid', nullable: false})
    brand_id!: string

    @Column({type: 'varchar', length: 100, nullable: false})
    name!: string

    @CreateDateColumn({type: 'timestamp'})
    created_at!: Date

    @ManyToOne(() => Brand, (brand) => brand.model, {
        onDelete: 'RESTRICT',
        onUpdate: 'CASCADE'
    })
    @JoinColumn({ name: 'brand_id' })
    brand!: Brand

    @OneToMany(() => Vehicle, (vehicle) => vehicle.model)
    vehicles!: Vehicle[];

}