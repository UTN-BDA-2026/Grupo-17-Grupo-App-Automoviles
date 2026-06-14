
import { IsString, IsNotEmpty, IsOptional, IsUUID, IsDate } from "class-validator";

export class CreateModelDTO {

    @IsOptional()
    @IsUUID()
    @IsNotEmpty()
    id?: string

    @IsOptional()
    @IsUUID()
    @IsNotEmpty()
    brand_id?: string

    @IsString()
    @IsNotEmpty()
    name!: string

    @IsOptional()
    @IsDate()
    @IsNotEmpty()
    created_at?: Date

}

export class UpdateModelDTO {

    @IsOptional()
    @IsUUID()
    @IsNotEmpty()
    id?: string

    @IsOptional()
    @IsUUID()
    @IsNotEmpty()
    brand_id?: string

    @IsOptional()
    @IsString()
    @IsNotEmpty()
    name?: string

    @IsOptional()
    @IsDate()
    @IsNotEmpty()
    created_at?: Date

}