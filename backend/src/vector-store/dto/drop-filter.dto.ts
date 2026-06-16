import { Type } from 'class-transformer';
import { IsOptional, ValidateNested } from 'class-validator';
import { RecommendationManualFilterDto } from './recommendation-manual-filter.dto';

export class DropFilterDto {
  @ValidateNested()
  @Type(() => RecommendationManualFilterDto)
  @IsOptional()
  filter?: RecommendationManualFilterDto;
}
