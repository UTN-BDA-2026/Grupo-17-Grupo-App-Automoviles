import { Type } from 'class-transformer';
import { IsInt, IsOptional, IsString, Min, ValidateNested } from 'class-validator';
import { RecommendationManualFilterDto } from './recommendation-manual-filter.dto';

export class SemanticQueryDto {
    @IsString()
    question!: string;

    @IsInt()
    @Min(1)
    @IsOptional()
    @Type(() => Number)
    limit?: number;

    @ValidateNested()
    @Type(() => RecommendationManualFilterDto)
    @IsOptional()
    filter?: RecommendationManualFilterDto;
}
