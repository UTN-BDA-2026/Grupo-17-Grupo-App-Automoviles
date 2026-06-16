import { Injectable, NotFoundException } from '@nestjs/common';
import { Link } from '../models/link.entity';
import { LinkStatus } from '../models/link.entity';
import { CreateLinkDTO } from '../dto/link.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, QueryDeepPartialEntity } from 'typeorm';

@Injectable()
export class LinkService {
  constructor(
    @InjectRepository(Link)
    private readonly repository: Repository<Link>,
  ) {}

  public async get(): Promise<Link[]> {
    return await this.repository.find();
  }

  public async getById(id: string): Promise<Link | null> {
    return await this.repository.findOneBy({
      id: id,
    });
  }

  public async getByURL(url: string): Promise<Link | null> {
    return await this.repository.findOneBy({
      url: url,
    });
  }

  public async getByStatus(status: LinkStatus): Promise<Link[] | null> {
    return await this.repository.findBy({
      status: status,
    });
  }

  public async create(link: CreateLinkDTO): Promise<Link> {
    const nuevo = this.repository.create(link);
    return await this.repository.save(nuevo);
  }

  public async update(
    id: string,
    link: QueryDeepPartialEntity<Link>,
  ): Promise<Link | null> {
    const exist = await this.repository.findOneBy({ id: id });

    if (!exist) {
      throw new NotFoundException('The link does not exits');
    }

    await this.repository.update(id, link);
    return await this.repository.findOneBy({ id: id });
  }

  public async updateByURL(
    url: string,
    link: QueryDeepPartialEntity<Link>,
  ): Promise<Link | null> {
    const exist = await this.repository.findOneBy({ url: url });

    if (!exist) {
      throw new NotFoundException('The link does not exits');
    }

    await this.repository.update(url, link);
    return await this.repository.findOneBy({ url: url });
  }

  public async delete(id: string): Promise<Link | null> {
    const link = await this.repository.findOneBy({ id: id });

    if (!link) {
      throw new NotFoundException('The link does not exits');
    }

    return await this.repository.remove(link);
  }
}
