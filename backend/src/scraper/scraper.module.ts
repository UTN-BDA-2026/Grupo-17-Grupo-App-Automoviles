
import { Module } from '@nestjs/common';
import { ScraperService } from './scraper.service';
import { DiscoverScrapingWorker } from './discover.process';
import { ConsumerScrapingWorker } from './consumer.process';
import { BullModule } from '@nestjs/bullmq';

@Module({
  imports: [
    BullModule.registerQueue(
      {
        name: 'discover-vehicles'
      },
      {
        name: 'scraping-vehicles'
      })
  ],
  providers: [
    ScraperService, 
    DiscoverScrapingWorker,
    ConsumerScrapingWorker
  ],
})
export class ScraperModule {}
