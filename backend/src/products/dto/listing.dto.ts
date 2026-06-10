
import { 
    IsString, 
    IsNotEmpty, 
    IsBoolean, 
    IsOptional, 
    IsUUID, 
    IsDate, 
    IsIn, 
    IsNumber,
    IsJSON, 
    IsPositive } from "class-validator";
import type { IEquipment } from "../interfaces/equipment.interface";

export class CreateListingDTO {

    @IsOptional()
    @IsUUID()
    @IsNotEmpty()
    id?: string

    @IsOptional()
    @IsUUID()
    @IsNotEmpty()
    vehicle_id?: string

    @IsNumber()
    @IsPositive()
    @IsNotEmpty()
    price!: number

    @IsNotEmpty()
    @IsString()
    currency!: string

    @IsBoolean()
    @IsNotEmpty()
    is_available!: boolean

    @IsNumber()
    @IsPositive()
    @IsNotEmpty()
    mileage!: number

    @IsString()
    @IsNotEmpty()
    color!: string

    @IsString()
    @IsNotEmpty()
    fuel_type!: string

    @IsNumber()
    @IsPositive()
    @IsNotEmpty()
    doors!: number

    @IsOptional()
    @IsNumber()
    @IsPositive()
    @IsNotEmpty()
    people_capacity?: number

    @IsString()
    @IsNotEmpty()
    condition!: string

    @IsOptional()
    @IsString()
    @IsNotEmpty()
    direction?: string

    @IsOptional()
    @IsString()
    @IsNotEmpty()
    transmission?: string

    @IsOptional()
    @IsString()
    @IsNotEmpty()
    traction_control?: string

    @IsOptional()
    @IsString()
    @IsNotEmpty()
    engine?: string

    @IsOptional()
    @IsString()
    @IsNotEmpty()
    body_type?: string

    @IsOptional()
    @IsBoolean()
    @IsNotEmpty()
    sole_owner?: boolean

    @IsOptional()
    @IsJSON()
    @IsNotEmpty()
    equipment?: IEquipment

    @IsOptional()
    @IsDate()
    @IsNotEmpty()
    created_at?: Date

    @IsOptional()
    @IsDate()
    @IsNotEmpty()
    last_scraped_at?: Date

}

export class UpdateListingDTO {

    @IsOptional()
    @IsUUID()
    @IsNotEmpty()
    id?: string

    @IsOptional()
    @IsUUID()
    @IsNotEmpty()
    vehicle_id?: string

    @IsOptional()
    @IsNumber()
    @IsPositive()
    @IsNotEmpty()
    price?: number

    @IsOptional()
    @IsNotEmpty()
    @IsString()
    currency?: string

    @IsOptional()
    @IsBoolean()
    @IsNotEmpty()
    is_available?: boolean

    @IsOptional()
    @IsNumber()
    @IsPositive()
    @IsNotEmpty()
    mileage?: number

    @IsOptional()
    @IsString()
    @IsNotEmpty()
    color?: string

    @IsOptional()
    @IsString()
    @IsNotEmpty()
    fuel_type?: string

    @IsOptional()
    @IsNumber()
    @IsPositive()
    @IsNotEmpty()
    doors?: number

    @IsOptional()
    @IsNumber()
    @IsPositive()
    @IsNotEmpty()
    people_capacity?: number

    @IsOptional()
    @IsString()
    @IsNotEmpty()
    condition?: string

    @IsOptional()
    @IsString()
    @IsNotEmpty()
    direction?: string

    @IsOptional()
    @IsString()
    @IsNotEmpty()
    transmission?: string

    @IsOptional()
    @IsString()
    @IsNotEmpty()
    traction_control?: string

    @IsOptional()
    @IsString()
    @IsNotEmpty()
    engine?: string

    @IsOptional()
    @IsString()
    @IsNotEmpty()
    body_type?: string

    @IsOptional()
    @IsBoolean()
    @IsNotEmpty()
    sole_owner?: boolean

    @IsOptional()
    @IsJSON()
    @IsNotEmpty()
    equipment?: IEquipment

    @IsOptional()
    @IsDate()
    @IsNotEmpty()
    created_at?: Date

    @IsOptional()
    @IsDate()
    @IsNotEmpty()
    last_scraped_at?: Date

}