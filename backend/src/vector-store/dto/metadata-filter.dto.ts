import { Type } from 'class-transformer';
import { ValidateNested } from 'class-validator';
import { RecommendationManualFilterDto } from './recommendation-manual-filter.dto';

export class MetadataFilterDto {
  @ValidateNested()
  @Type(() => RecommendationManualFilterDto)
  filter!: RecommendationManualFilterDto;
}
