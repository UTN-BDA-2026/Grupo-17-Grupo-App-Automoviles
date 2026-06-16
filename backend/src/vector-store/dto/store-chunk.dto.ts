import { IsObject, IsOptional, IsString } from 'class-validator';

export class StoreChunkDto {
  @IsString()
  content!: string;

  @IsObject()
  @IsOptional()
  metadata?: Record<string, any>;
}
