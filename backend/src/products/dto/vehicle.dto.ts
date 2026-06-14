
import { IsString, IsNotEmpty, IsOptional, IsUUID, IsDate, IsNumber, IsPositive } from "class-validator";

export class CreateVehicleDTO {

    @IsOptional()
    @IsUUID()
    @IsNotEmpty()
    id?: string

    @IsOptional()
    @IsUUID()
    @IsNotEmpty()
    model_id?: string

    @IsNumber()
    @IsPositive()
    @IsNotEmpty()
    year!: number

    @IsOptional()
    @IsString()
    @IsNotEmpty()
    version?: string 

    @IsOptional()
    @IsDate()
    @IsNotEmpty()
    created_at?: Date

    @IsOptional()
    @IsDate()
    @IsNotEmpty()
    updated_at?: Date

}

export class UpdateVehicleDTO {

    @IsOptional()
    @IsUUID()
    @IsNotEmpty()
    id?: string

    @IsOptional()
    @IsUUID()
    @IsNotEmpty()
    model_id?: string

    @IsOptional()
    @IsNumber()
    @IsPositive()
    @IsNotEmpty()
    year?: number

    @IsOptional()
    @IsString()
    @IsNotEmpty()
    version?: string

    @IsOptional()
    @IsDate()
    @IsNotEmpty()
    created_at?: Date

    @IsOptional()
    @IsDate()
    @IsNotEmpty()
    updated_at?: Date
}