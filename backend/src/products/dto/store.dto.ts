import {
  IsString,
  IsNotEmpty,
  IsOptional,
  IsUUID,
  IsDate,
} from 'class-validator';

export class CreateStoreDTO {
  @IsOptional()
  @IsUUID()
  @IsNotEmpty()
  id?: string;

  @IsString()
  @IsNotEmpty()
  name!: string;

  @IsString()
  @IsNotEmpty()
  base_url!: string;

  @IsOptional()
  @IsDate()
  @IsNotEmpty()
  created_at?: Date;

  @IsOptional()
  @IsDate()
  @IsNotEmpty()
  updated_at?: Date;
}

export class UpdateStoreDTO {
  @IsOptional()
  @IsUUID()
  @IsNotEmpty()
  id?: string;

  @IsOptional()
  @IsString()
  @IsNotEmpty()
  name?: string;

  @IsOptional()
  @IsString()
  @IsNotEmpty()
  base_url?: string;

  @IsOptional()
  @IsDate()
  @IsNotEmpty()
  created_at?: Date;

  @IsOptional()
  @IsDate()
  @IsNotEmpty()
  updated_at?: Date;
}
