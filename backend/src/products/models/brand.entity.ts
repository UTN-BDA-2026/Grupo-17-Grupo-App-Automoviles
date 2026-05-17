
import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, OneToMany } from "typeorm";
import { Model } from "./model.entity";

@Entity('brands')
export class Brand {

    @PrimaryGeneratedColumn('uuid')
    id!: string

    @Column({ type: 'varchar', length: 50, nullable: false })
    name!: string

    @CreateDateColumn({ type: 'timestamp' })
    created_at!: Date

    @OneToMany(() => Model, (model) => model.brand)
    model!: Model[]

}