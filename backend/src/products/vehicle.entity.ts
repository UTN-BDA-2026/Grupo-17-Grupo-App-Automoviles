
import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, ManyToOne, OneToMany, JoinColumn } from 'typeorm';
import { Model } from './model.entity';
import { Listing } from './listing.entity';

export enum FuelType {
    NAFTA = 'Nafta',
    DIESEL = 'Diésel',
    HIBRIDO = 'Híbrido',
    ELECTRICO = 'Eléctrico',
}

export enum TransmissionType {
    MANUAL = 'Manual',
    AUTOMATICA = 'Automática',
}

@Entity('vehicles')
export class Vehicle {

    @PrimaryGeneratedColumn('uuid')
    id!: string;

    @Column({ type: 'uuid' })
    model_id!: string;

    @Column({ type: 'int', nullable: true })
    year!: number;

    @Column({
        type: 'enum',
        enum: FuelType,
        nullable: true,
    })
    fuel_type!: FuelType; 

    @Column({
        type: 'enum',
        enum: TransmissionType,
        nullable: true,
    })
    transmission!: TransmissionType; 

    @Column({ type: 'varchar', length: 255, nullable: true })
    engine_specs!: string;

    @Column({ type: 'json', nullable: true })
    raw_specs!: Record<string, any>;

    @CreateDateColumn({ type: 'timestamp' })
    created_at!: Date;

    @UpdateDateColumn({ type: 'timestamp' })
    updated_at!: Date;

    @ManyToOne(() => Model, (model) => model.vehicles, { 
        onDelete: 'RESTRICT',
        onUpdate: 'CASCADE'
    })
    @JoinColumn({ name: 'model_id' })
    model!: Model;

    @OneToMany(() => Listing, (listing) => listing.vehicle)
    listings!: Listing[];

}