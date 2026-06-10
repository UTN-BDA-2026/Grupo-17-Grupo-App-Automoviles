
import { Controller, Get, Param, ParseUUIDPipe, Query, DefaultValuePipe, ParseIntPipe } from '@nestjs/common';
import { ListingService } from './services/listing.service';

@Controller('products')
export class ProductsController {

    constructor(private readonly listingService: ListingService){}

    @Get()
    public async get (
        @Query('pageNumber', new DefaultValuePipe(1), ParseIntPipe) pageNumber: number,
        @Query('pageSize', new DefaultValuePipe(20), ParseIntPipe) pageSize: number
    ) {

        const result = this.listingService.get(pageNumber, pageSize)
        return result 

    }

    @Get('/:id')
    public async getById(@Param('id', new ParseUUIDPipe({errorHttpStatusCode: 400})) id : string) {

        const result = this.listingService.getById(id)
        return result 

    }

}
