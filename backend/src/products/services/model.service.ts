import { Injectable, NotFoundException } from '@nestjs/common';
import { Model } from '../models/model.entity';
import { CreateModelDTO } from '../dto/model.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, QueryDeepPartialEntity } from 'typeorm';

@Injectable()
export class ModelService {
  constructor(
    @InjectRepository(Model)
    private readonly repository: Repository<Model>,
  ) {}

  public async get(): Promise<Model[]> {
    return await this.repository.find();
  }

  public async getById(id: string): Promise<Model | null> {
    return await this.repository.findOneBy({
      id: id,
    });
  }

  public async getByNameAndBrand(
    name: string,
    brand_id: string,
  ): Promise<Model | null> {
    return await this.repository.findOneBy({
      name: name,
      brand_id: brand_id,
    });
  }

  public async create(model: CreateModelDTO): Promise<Model> {
    const nuevo = this.repository.create(model);
    return await this.repository.save(nuevo);
  }

  public async update(
    id: string,
    model: QueryDeepPartialEntity<Model>,
  ): Promise<Model | null> {
    const exist = await this.repository.findOneBy({ id: id });

    if (!exist) {
      throw new NotFoundException('The model does not exits');
    }

    await this.repository.update(id, model);
    return await this.repository.findOneBy({ id: id });
  }

  public async delete(id: string): Promise<Model | null> {
    const model = await this.repository.findOneBy({ id: id });

    if (!model) {
      throw new NotFoundException('The model does not exits');
    }

    return await this.repository.remove(model);
  }
}
