import { Type } from 'class-transformer';
import { IsIn, IsInt, IsOptional, IsString, Min } from 'class-validator';

export class RecommendationManualFilterDto {
  @IsString()
  @IsIn(['recommendation_manual', 'manual'])
  @IsOptional()
  source?: 'recommendation_manual' | 'manual';

  @IsInt()
  @Min(1)
  @IsOptional()
  @Type(() => Number)
  section_number?: number;

  @IsString()
  @IsOptional()
  section_title?: string;
}
