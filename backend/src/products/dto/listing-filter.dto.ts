import {
  IsString,
  IsOptional,
  IsNumber,
  IsPositive,
  IsInt,
} from 'class-validator';

/**
 * Filtros multi-criterio para búsqueda de listings. Todos los campos son
 * opcionales: un campo ausente no aplica condición. Pensado para que el agente
 * recomendador mapee sus filtros duros y para uso general de búsqueda.
 */
export class ListingFilterDTO {
  @IsOptional()
  @IsNumber()
  @IsPositive()
  minPrice?: number;

  @IsOptional()
  @IsNumber()
  @IsPositive()
  maxPrice?: number;

  @IsOptional()
  @IsInt()
  minMileage?: number;

  @IsOptional()
  @IsInt()
  maxMileage?: number;

  @IsOptional()
  @IsInt()
  minYear?: number;

  @IsOptional()
  @IsInt()
  maxYear?: number;

  @IsOptional()
  @IsString()
  brand?: string;

  @IsOptional()
  @IsString()
  model?: string;

  @IsOptional()
  @IsString()
  fuelType?: string;

  @IsOptional()
  @IsString()
  transmission?: string;

  @IsOptional()
  @IsInt()
  doors?: number;

  @IsOptional()
  @IsString()
  engine?: string;

  @IsOptional()
  @IsString()
  bodyType?: string;

  @IsOptional()
  @IsString()
  condition?: string;

  @IsOptional()
  @IsString()
  tractionControl?: string;
}
