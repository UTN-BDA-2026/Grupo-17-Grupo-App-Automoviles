import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  OneToMany,
  JoinColumn,
  Index,
} from 'typeorm';
import { Model } from './model.entity';
import { Listing } from './listing.entity';

@Entity('vehicles')
@Index('idx_vehicles_model_year_version', ['model_id', 'year', 'version'])
@Index('idx_vehicles_version', ['version'])
export class Vehicle {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column({ type: 'uuid' })
  model_id!: string;

  @Column({ type: 'int', nullable: false })
  year!: number;

  @Column({ type: 'varchar', nullable: false })
  version!: string;

  @CreateDateColumn({ type: 'timestamp' })
  created_at!: Date;

  @UpdateDateColumn({ type: 'timestamp' })
  updated_at!: Date;

  @ManyToOne(() => Model, (model) => model.vehicles, {
    onDelete: 'RESTRICT',
    onUpdate: 'CASCADE',
  })
  @JoinColumn({ name: 'model_id' })
  model!: Model;

  @OneToMany(() => Listing, (listing) => listing.vehicle)
  listings!: Listing[];
}
