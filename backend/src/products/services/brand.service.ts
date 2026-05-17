
import { Injectable, NotFoundException } from "@nestjs/common"
import { Brand } from "../models/brand.entity"
import { dataSource } from "../../database/typeorm.config"
import { Repository, QueryDeepPartialEntity } from "typeorm"

@Injectable()
export class BrandService {

    private readonly repository : Repository<Brand>

    constructor(){
        this.repository = dataSource.getRepository(Brand)
    }

    public async get() : Promise<Brand[]> {
        return await this.repository.find()
    }

    public async getById(id: string) : Promise<Brand | null> {

        return await this.repository.findOneBy({
            id: id
        })
    }

    public async create(brand: Brand) : Promise<Brand> {
        
        const nuevo = this.repository.create(brand)
        return await this.repository.save(nuevo)
    }

    public async update(id: string, brand: QueryDeepPartialEntity<Brand>) : Promise<Brand | null> {
    
        const exist = await this.repository.findOneBy({ id: id })
        
        if (!exist) {
            throw new NotFoundException('The brand does not exits')
        }

        await this.repository.update(id, brand);
        return await this.repository.findOneBy({ id: id })
    }

    public async delete(id: string) : Promise<Brand | null> {
        
        const brand = await this.repository.findOneBy({ id: id })
        
        if (!brand) {
            throw new NotFoundException('The brand does not exits')
        }

        return await this.repository.remove(brand)
    }

}