import {
  IsString,
  IsNotEmpty,
  IsOptional,
  IsUUID,
  IsDate,
} from 'class-validator';

export class CreateBrandDTO {
  @IsOptional()
  @IsUUID()
  @IsNotEmpty()
  id?: string;

  @IsString()
  @IsNotEmpty()
  name!: string;

  @IsOptional()
  @IsDate()
  @IsNotEmpty()
  created_at?: Date;
}

export class UpdateBrandDTO {
  @IsOptional()
  @IsUUID()
  @IsNotEmpty()
  id?: string;

  @IsOptional()
  @IsString()
  @IsNotEmpty()
  name?: string;

  @IsOptional()
  @IsDate()
  @IsNotEmpty()
  created_at?: Date;
}
