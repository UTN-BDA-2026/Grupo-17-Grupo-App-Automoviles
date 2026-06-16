import {
  IsString,
  IsNotEmpty,
  IsOptional,
  IsUUID,
  IsDate,
} from 'class-validator';
import { LinkStatus } from '../models/link.entity';

export class CreateLinkDTO {
  @IsOptional()
  @IsUUID()
  @IsNotEmpty()
  id?: string;

  @IsUUID()
  @IsNotEmpty()
  store_id!: string;

  @IsString()
  @IsNotEmpty()
  status!: LinkStatus;

  @IsString()
  @IsNotEmpty()
  url!: string;

  @IsOptional()
  @IsDate()
  @IsNotEmpty()
  created_at?: Date;

  @IsOptional()
  @IsDate()
  @IsNotEmpty()
  updated_at?: Date;
}

export class UpdateLinkDTO {
  @IsOptional()
  @IsUUID()
  @IsNotEmpty()
  id?: string;

  @IsOptional()
  @IsUUID()
  @IsNotEmpty()
  store_id?: string;

  @IsOptional()
  @IsString()
  @IsNotEmpty()
  status?: string;

  @IsString()
  @IsString()
  @IsNotEmpty()
  url?: string;

  @IsOptional()
  @IsDate()
  @IsNotEmpty()
  created_at?: Date;

  @IsOptional()
  @IsDate()
  @IsNotEmpty()
  updated_at?: Date;
}
