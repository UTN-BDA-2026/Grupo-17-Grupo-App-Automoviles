import { Body, Controller, Delete, Get, Post } from '@nestjs/common';
import { RecommendationManualService } from './recommendation-manual/recommendation-manual.service';
import { SemanticQueryDto } from './dto/semantic-query.dto';
import { MetadataFilterDto } from './dto/metadata-filter.dto';
import { StoreChunkDto } from './dto/store-chunk.dto';
import { DropFilterDto } from './dto/drop-filter.dto';

@Controller('admin/vector')
export class VectorStoreController {

    constructor(private readonly manualService: RecommendationManualService) {}

    @Post('sync')
    sync() {
        return this.manualService.sync();
    }

    @Get('count')
    count() {
        return this.manualService.count();
    }

    @Post('query')
    query(@Body() dto: SemanticQueryDto) {
        return this.manualService.query(dto.question, dto.limit ?? 5, dto.filter);
    }

    @Post('find')
    find(@Body() dto: MetadataFilterDto) {
        return this.manualService.find(dto.filter);
    }

    @Post('store')
    store(@Body() dto: StoreChunkDto) {
        return this.manualService.store(dto.content, dto.metadata);
    }

    @Delete('drop')
    drop(@Body() dto: DropFilterDto) {
        return this.manualService.drop(dto.filter);
    }
}
