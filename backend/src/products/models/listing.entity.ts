
import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, OneToOne, ManyToOne, JoinColumn, UpdateDateColumn } from 'typeorm';
import { Vehicle } from './vehicle.entity'
import { Link } from '../../scraper/models/link.entity'
import type { IEquipment } from '../interfaces/equipment.interface';


@Entity('listings')
export class Listing {

    @PrimaryGeneratedColumn('uuid')
    id!: string; 

    @Column({ type: 'uuid', nullable: false })
    vehicle_id!: string;

    @Column({ type: 'decimal', precision: 15, scale: 2, nullable: false })
    price!: number;

    @Column({ type: 'varchar', length: 15, nullable: false })
    currency!: string;

    @Column({ type: 'boolean', default: true, nullable: false })
    is_available!: boolean;

    @Column({ type: 'int', nullable: false })
    mileage!: number;

    @Column({ type: 'varchar', length: 30, nullable: false })
    color!: string;

    @Column({ type: 'varchar', length: 60, nullable: false })
    fuel_type!: string;

    @Column({ type: 'int', nullable: false })
    doors!: number;

    @Column({ type: 'int', nullable: true })
    people_capacity!: number;

    @Column({ type: 'varchar', length: 20, nullable: false })
    condition!: string;

    @Column({ type: 'varchar', length: 30, nullable: true })
    direction!: string;

    @Column({ type: 'varchar', length: 40, nullable: true })
    transmission!: string;

    @Column({ type: 'varchar', length: 35, nullable: true })
    traction_control!: string;

    @Column({ type: 'varchar', length: 30, nullable: true })
    engine!: string;

    @Column({ type: 'varchar', length: 30, nullable: true })
    body_type!: string;

    @Column({ type: 'boolean', nullable: true })
    sole_owner!: boolean;

    @Column({ type: 'json', nullable: true})
    equipment!: IEquipment;

    @CreateDateColumn({ type: 'timestamp' })
    created_at!: Date;

    @UpdateDateColumn({ type: 'timestamp' })
    last_scraped!: Date;

    @ManyToOne(() => Vehicle, (vehicle) => vehicle.listings, { 
        onDelete: 'RESTRICT',
        onUpdate: 'CASCADE'
    })
    @JoinColumn({ name: 'vehicle_id' })
    vehicle!: Vehicle;

    @OneToOne(() => Link, (link) => link.listing)
    @JoinColumn()
    link!: Link;

}