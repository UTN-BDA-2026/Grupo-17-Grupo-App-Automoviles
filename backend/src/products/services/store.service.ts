import { Injectable, NotFoundException } from '@nestjs/common';
import { Store } from '../models/store.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { CreateStoreDTO } from '../dto/store.dto';
import { Repository, QueryDeepPartialEntity } from 'typeorm';

@Injectable()
export class StoreService {
  constructor(
    @InjectRepository(Store)
    private readonly repository: Repository<Store>,
  ) {}

  public async get(): Promise<Store[]> {
    return await this.repository.find();
  }

  public async getById(id: string): Promise<Store | null> {
    return await this.repository.findOneBy({
      id: id,
    });
  }

  public async getByBaseURL(url: string): Promise<Store | null> {
    return await this.repository.findOneBy({
      base_url: url,
    });
  }

  public async create(store: CreateStoreDTO): Promise<Store> {
    const nuevo = this.repository.create(store);
    return await this.repository.save(nuevo);
  }

  public async update(
    id: string,
    store: QueryDeepPartialEntity<Store>,
  ): Promise<Store | null> {
    const exist = await this.repository.findOneBy({ id: id });

    if (!exist) {
      throw new NotFoundException('The store does not exits');
    }

    await this.repository.update(id, store);
    return await this.repository.findOneBy({ id: id });
  }

  public async delete(id: string): Promise<Store | null> {
    const store = await this.repository.findOneBy({ id: id });

    if (!store) {
      throw new NotFoundException('The store does not exits');
    }

    return await this.repository.remove(store);
  }
}
