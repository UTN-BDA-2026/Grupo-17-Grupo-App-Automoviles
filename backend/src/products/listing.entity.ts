
import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, OneToOne, ManyToOne, JoinColumn } from 'typeorm';
import { Vehicle } from './vehicle.entity';
import { Link } from '../scraper/links.entity';

@Entity('listings')
export class Listing {

    @PrimaryGeneratedColumn('uuid')
    id!: string; 

    @Column({ type: 'uuid' })
    vehicle_id!: string;

    @Column({ type: 'uuid' })
    store_id!: string;

    @Column({ type: 'varchar', length: 255, unique: true })
    external_id!: string;

    @Column({ type: 'decimal', precision: 15, scale: 2 })
    price!: number;

    @Column({ type: 'varchar', length: 10 })
    currency!: string;

    @Column({ type: 'int', nullable: true })
    mileage!: number;

    @Column({ type: 'text' })
    external_url!: string;

    @Column({ type: 'boolean', default: true })
    is_available!: boolean;

    @CreateDateColumn({ type: 'timestamp' })
    created_at!: Date;

    @Column({ type: 'timestamp' })
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