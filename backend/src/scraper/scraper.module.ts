import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ProductsModule } from '../products/products.module';
import { ScraperService } from './services/scraper.service';
import { DiscoverScrapingWorker } from './workers/discover.process';
import { ConsumerScrapingWorker } from './workers/consumer.process';
import { VehicleParserService } from './services/vehicle_parser.service';
import { BullModule } from '@nestjs/bullmq';
import { LinkService } from './services/link.service';
import { Link } from './models/link.entity';

@Module({
  imports: [
    ProductsModule,
    TypeOrmModule.forFeature([Link]),
    BullModule.registerQueue(
      {
        name: 'discover-vehicles',
      },
      {
        name: 'scraping-vehicles',
      },
    ),
  ],
  providers: [
    ScraperService,
    LinkService,
    VehicleParserService,
    DiscoverScrapingWorker,
    ConsumerScrapingWorker,
  ],
  exports: [LinkService],
})
export class ScraperModule {}
