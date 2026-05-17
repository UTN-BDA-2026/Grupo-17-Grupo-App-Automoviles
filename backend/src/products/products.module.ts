
import { Module } from '@nestjs/common';
import { ProductsController } from './products.controller';
import { ListingService } from './services/listing.service';

@Module({
  controllers: [ProductsController],
  providers: [ListingService]
})
export class ProductsModule {}
