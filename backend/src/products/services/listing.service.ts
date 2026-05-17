
import { Injectable, NotFoundException } from "@nestjs/common"
import { Listing } from "../models/listing.entity"
import { dataSource } from "../../database/typeorm.config"
import { Repository, QueryDeepPartialEntity } from "typeorm"

@Injectable()
export class ListingService {

    private readonly repository : Repository<Listing>

    constructor(){
        this.repository = dataSource.getRepository(Listing)
    }

    public async get(pageNumber: number = 1, pageSize: number = 10) : Promise<{ data: Listing[], total: number, page: number, pageSize: number }> {
        const skip = (pageNumber - 1) * pageSize

        const [data, total] = await this.repository
            .createQueryBuilder('listing')
            .leftJoinAndSelect('listing.vehicle', 'vehicle')
            .leftJoinAndSelect('listing.link', 'link')
            .leftJoinAndSelect('vehicle.model', 'model')
            .leftJoinAndSelect('model.brand', 'brand')
            .skip(skip)
            .take(pageSize)
            .getManyAndCount()

        return {
            data,
            total,
            page: pageNumber,
            pageSize
        }
    }

    public async getById(id: string) : Promise<Listing | null> {

        const listing = await this.repository
            .createQueryBuilder('listing')
            .leftJoinAndSelect('listing.vehicle', 'vehicle')
            .leftJoinAndSelect('listing.link', 'link')
            .leftJoinAndSelect('vehicle.model', 'model')
            .leftJoinAndSelect('model.brand', 'brand')
            .where('listing.id = :id', { id })
            .getOne()

        if(!listing){
            throw new NotFoundException('The listing does not exits')
        }

        return listing
    }

    public async create(listing: Listing) : Promise<Listing> {
        
        const nuevo = this.repository.create(listing)
        return await this.repository.save(nuevo)
    }

    public async update(id: string, listing: QueryDeepPartialEntity<Listing>) : Promise<Listing | null> {
    
        const exist = await this.repository.findOneBy({ id: id })
        
        if (!exist) {
            throw new NotFoundException('The listing does not exits')
        }

        await this.repository.update(id, listing);
        return await this.repository.findOneBy({ id: id })
    }

    public async delete(id: string) : Promise<Listing | null> {
        
        const listing = await this.repository.findOneBy({ id: id })
        
        if (!listing) {
            throw new NotFoundException('The listing does not exits')
        }

        return await this.repository.remove(listing)
    }

}