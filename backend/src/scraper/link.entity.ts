
import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, ManyToOne, OneToOne, JoinColumn } from 'typeorm';
import { Listing } from '../products/models/listing.entity';
import { Store } from '../products/models/store.entity';

export enum LinkStatus {
    PENDIENTE = 'Pendiente',
    PROCESANDO = 'Procensando',
    COMPLETADO = 'Completado',
}

@Entity('links')
export class Link {

    @PrimaryGeneratedColumn('uuid')
    id!: string;

    @Column({ type: 'uuid', nullable: false})
    store_id!: string;

    @Column({ type: 'enum', enum: LinkStatus, nullable: false})
    status!: LinkStatus

    @Column({ type: 'text', nullable: false, unique: true})
    url!: string;

    @CreateDateColumn({ type: 'timestamp' })
    created_at!: Date;

    @UpdateDateColumn({ type: 'timestamp' })
    updated_at!: Date;

    @ManyToOne(() => Store, (store) => store.links, {
        onDelete: 'CASCADE',
        onUpdate: 'CASCADE'
    })
    @JoinColumn({ name: 'store_id' })
    store!: Store;

    @OneToOne(() => Listing, (listing) => listing.link)
    listing!: Listing

}