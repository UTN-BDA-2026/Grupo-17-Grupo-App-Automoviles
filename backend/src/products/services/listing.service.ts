import { Injectable, NotFoundException } from '@nestjs/common';
import { Listing } from '../models/listing.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, QueryDeepPartialEntity } from 'typeorm';
import { CreateListingDTO } from '../dto/listing.dto';
import { ListingFilterDTO } from '../dto/listing-filter.dto';

@Injectable()
export class ListingService {
  constructor(
    @InjectRepository(Listing)
    private readonly repository: Repository<Listing>,
  ) {}

  public async get(
    pageNumber: number = 1,
    pageSize: number = 20,
  ): Promise<{
    data: Listing[];
    total: number;
    page: number;
    pageSize: number;
  }> {
    const skip = (pageNumber - 1) * pageSize;

    const [data, total] = await this.repository
      .createQueryBuilder('listing')
      .leftJoinAndSelect('listing.vehicle', 'vehicle')
      .leftJoinAndSelect('listing.link', 'link')
      .leftJoinAndSelect('vehicle.model', 'model')
      .leftJoinAndSelect('model.brand', 'brand')
      .skip(skip)
      .take(pageSize)
      .getManyAndCount();

    return {
      data,
      total,
      page: pageNumber,
      pageSize,
    };
  }

  public async getById(id: string): Promise<Listing | null> {
    const listing = await this.repository
      .createQueryBuilder('listing')
      .leftJoinAndSelect('listing.vehicle', 'vehicle')
      .leftJoinAndSelect('listing.link', 'link')
      .leftJoinAndSelect('vehicle.model', 'model')
      .leftJoinAndSelect('model.brand', 'brand')
      .where('listing.id = :id', { id })
      .getOne();

    if (!listing) {
      throw new NotFoundException('The listing does not exits');
    }

    return listing;
  }

  public async filter(
    filters: ListingFilterDTO,
    limit: number = 20,
  ): Promise<Listing[]> {
    const qb = this.repository
      .createQueryBuilder('listing')
      .leftJoinAndSelect('listing.vehicle', 'vehicle')
      .leftJoinAndSelect('listing.link', 'link')
      .leftJoinAndSelect('vehicle.model', 'model')
      .leftJoinAndSelect('model.brand', 'brand')
      .where('listing.is_available = :available', { available: true });

    if (filters.minPrice != null)
      qb.andWhere('listing.price >= :minPrice', { minPrice: filters.minPrice });
    if (filters.maxPrice != null)
      qb.andWhere('listing.price <= :maxPrice', { maxPrice: filters.maxPrice });
    if (filters.minMileage != null)
      qb.andWhere('listing.mileage >= :minMileage', {
        minMileage: filters.minMileage,
      });
    if (filters.maxMileage != null)
      qb.andWhere('listing.mileage <= :maxMileage', {
        maxMileage: filters.maxMileage,
      });
    if (filters.minYear != null)
      qb.andWhere('vehicle.year >= :minYear', { minYear: filters.minYear });
    if (filters.maxYear != null)
      qb.andWhere('vehicle.year <= :maxYear', { maxYear: filters.maxYear });
    if (filters.doors != null)
      qb.andWhere('listing.doors = :doors', { doors: filters.doors });
    if (filters.brand)
      qb.andWhere('brand.name LIKE :brand', { brand: `%${filters.brand}%` });
    if (filters.model)
      qb.andWhere('model.name LIKE :model', { model: `%${filters.model}%` });
    if (filters.fuelType)
      qb.andWhere('listing.fuel_type LIKE :fuelType', {
        fuelType: `%${filters.fuelType}%`,
      });
    if (filters.transmission)
      qb.andWhere('listing.transmission LIKE :transmission', {
        transmission: `%${filters.transmission}%`,
      });
    if (filters.engine)
      qb.andWhere('listing.engine LIKE :engine', {
        engine: `%${filters.engine}%`,
      });
    if (filters.bodyType)
      qb.andWhere('listing.body_type LIKE :bodyType', {
        bodyType: `%${filters.bodyType}%`,
      });
    if (filters.condition)
      qb.andWhere('listing.condition LIKE :condition', {
        condition: `%${filters.condition}%`,
      });
    if (filters.tractionControl)
      qb.andWhere('listing.traction_control LIKE :tractionControl', {
        tractionControl: `%${filters.tractionControl}%`,
      });

    return qb.take(limit).getMany();
  }

  public async create(listing: CreateListingDTO): Promise<Listing> {
    const nuevo = this.repository.create(listing);
    return await this.repository.save(nuevo);
  }

  public async update(
    id: string,
    listing: QueryDeepPartialEntity<Listing>,
  ): Promise<Listing | null> {
    const exist = await this.repository.findOneBy({ id: id });

    if (!exist) {
      throw new NotFoundException('The listing does not exits');
    }

    await this.repository.update(id, listing);
    return await this.repository.findOneBy({ id: id });
  }

  public async delete(id: string): Promise<Listing | null> {
    const listing = await this.repository.findOneBy({ id: id });

    if (!listing) {
      throw new NotFoundException('The listing does not exits');
    }

    return await this.repository.remove(listing);
  }
}
