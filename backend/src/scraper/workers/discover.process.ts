import { Logger } from '@nestjs/common';
import { Processor, WorkerHost } from '@nestjs/bullmq';
import { Job } from 'bullmq';
import { ScraperService } from '../services/scraper.service';
import { LinkService } from '../services/link.service';
import { StoreService } from '../../products/services/store.service';
import { Store } from '../../products/models/store.entity';
import { LinkStatus } from '../models/link.entity';
import type { StoreData } from '../interfaces/store_data.dto';
import type { LinkInput } from '../interfaces/link_input.dto';

@Processor('discover-vehicles')
export class DiscoverScrapingWorker extends WorkerHost {
  private readonly logger = new Logger(DiscoverScrapingWorker.name);

  constructor(
    private readonly scraperService: ScraperService,
    private readonly storeService: StoreService,
    private readonly linkService: LinkService,
  ) {
    super();
  }

  public async process(job: Job<any, any, string>): Promise<any> {
    const { url, name, base } = job.data;

    try {
      const result = await this.scrap(url);

      await this.saveData(result, { store_name: name, base_url: base });

      this.logger.log(`Vehicle links were saved in database successfully`);
    } catch (error: any) {
      this.logger.error(error.message);
    }
  }

  private async scrap(url: string) {
    const links = await this.scraperService.discoverVehicles(url);
    return links;
  }

  private async saveData(links: LinkInput[], storeData: StoreData) {
    let store: Store | null;
    storeData.base_url !== undefined
      ? (store = await this.storeService.getByBaseURL(storeData.base_url))
      : (store = null);

    if (!store)
      store = await this.storeService.create({
        name: storeData.store_name,
        base_url: storeData.base_url,
      });

    if (links) {
      for (const link of links) {
        const exist = await this.linkService.getByURL(link.link);
        if (!exist) continue;

        try {
          await this.linkService.create({
            store_id: store.id,
            url: link.link,
            status: LinkStatus.PENDIENTE,
          });
        } catch (error: any) {
          this.logger.warn(
            `The link couldn't be created. Error: ${error.message}`,
          );
        }
      }
    }
  }
}
