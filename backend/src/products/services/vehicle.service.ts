
import { Injectable, NotFoundException } from "@nestjs/common"
import { Vehicle } from "../models/vehicle.entity"
import { InjectRepository } from "@nestjs/typeorm"
import { CreateVehicleDTO } from "../dto/vehicle.dto"
import { Repository, QueryDeepPartialEntity } from "typeorm"

@Injectable()
export class VehicleService {

    constructor(
        @InjectRepository(Vehicle)
        private readonly repository: Repository<Vehicle>
    ) {}

    public async get() : Promise<Vehicle[]> {
        return await this.repository.find()
    }

    public async getById(id: string) : Promise<Vehicle | null> {

        return await this.repository.findOneBy({
            id: id
        })
    }

    public async getByYearAndModelAndVersion(year: number, model_id: string, version: string) : Promise<Vehicle | null> {

        return await this.repository.findOneBy({
            year: year,
            model_id: model_id,
            version: version
        })
    }

    public async getByVersion(version: string) : Promise<Vehicle | null> {

        return await this.repository.findOneBy({
            version: version
        })
    }


    public async create(vehicle: CreateVehicleDTO) : Promise<Vehicle> {
        
        const nuevo = this.repository.create(vehicle)
        return await this.repository.save(nuevo)
    }

    public async update(id: string, vehicle: QueryDeepPartialEntity<Vehicle>) : Promise<Vehicle | null> {
    
        const exist = await this.repository.findOneBy({ id: id })
        
        if (!exist) {
            throw new NotFoundException('The vehicle does not exits')
        }

        await this.repository.update(id, vehicle);
        return await this.repository.findOneBy({ id: id })
    }

    public async delete(id: string) : Promise<Vehicle | null> {
        
        const vehicle = await this.repository.findOneBy({ id: id })
        
        if (!vehicle) {
            throw new NotFoundException('The vehicle does not exits')
        }

        return await this.repository.remove(vehicle)
    }

}