
import { Module } from '@nestjs/common';
import { ProductsController } from './products.controller';
import { ListingService } from './services/listing.service';
import { BrandService } from './services/brand.service';
import { ModelService } from './services/model.service';
import { VehicleService } from './services/vehicle.service';
import { StoreService } from './services/store.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Brand } from './models/brand.entity';
import { Model } from './models/model.entity';
import { Vehicle } from './models/vehicle.entity';
import { Listing } from './models/listing.entity';
import { Store } from './models/store.entity';

@Module({
  imports: [TypeOrmModule.forFeature([
    Brand, Model, Vehicle, Listing, Store
  ])],
  controllers: [ProductsController],
  providers: [ListingService, BrandService, ModelService, VehicleService, StoreService],
  exports: [ListingService, BrandService, ModelService, VehicleService, StoreService]
})
export class ProductsModule {}
