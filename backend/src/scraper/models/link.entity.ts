import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  OneToOne,
  JoinColumn,
  Index,
} from 'typeorm';
import { Listing } from '../../products/models/listing.entity';
import { Store } from '../../products/models/store.entity';

export enum LinkStatus {
  PENDIENTE = 'Pendiente',
  PROCESANDO = 'Procesando',
  COMPLETADO = 'Completado',
}

@Entity('links')
@Index('idx_links_status', ['status'])
export class Link {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column({ type: 'uuid', nullable: false })
  store_id!: string;

  @Column({ type: 'enum', enum: LinkStatus, nullable: false })
  status!: LinkStatus;

  @Column({ type: 'varchar', length: 255, nullable: false, unique: true })
  url!: string;

  @CreateDateColumn({ type: 'timestamp' })
  created_at!: Date;

  @UpdateDateColumn({ type: 'timestamp' })
  updated_at!: Date;

  @ManyToOne(() => Store, (store) => store.links, {
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
  })
  @JoinColumn({ name: 'store_id' })
  store!: Store;

  @OneToOne(() => Listing, (listing) => listing.link)
  listing!: Listing;
}
