
import { Controller, Get, Post } from '@nestjs/common';
import { RecommendationManualService } from './services/recommendation-manual.service';

@Controller('admin/vector')
export class VectorStoreController {

    constructor(private readonly manualService: RecommendationManualService) {}

    @Post('sync')
    public sync() {
        return this.manualService.sync();
    }

    @Get('count')
    public count() {
        return this.manualService.count();
    }

}
