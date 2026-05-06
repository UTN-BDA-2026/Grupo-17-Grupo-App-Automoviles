
import { Injectable, Logger } from '@nestjs/common'
import { Cron } from '@nestjs/schedule'
import { Queue } from 'bullmq'
import { InjectQueue } from '@nestjs/bullmq';

@Injectable()
export class SchedulerService {

    private readonly logger = new Logger(SchedulerService.name);

    constructor(
        @InjectQueue('discover-vehicles') private readonly discoverQueue: Queue,
        @InjectQueue('scraping-vehicles') private readonly scrapingQueue: Queue
    ){}

    @Cron('0 0 10 * * *')
    async discover(){

        const url = 'https://autos.mercadolibre.com.ar/ford/f-100' 

        await this.discoverQueue.add('discover-vehicles', { url }, {
            attempts: 3, 
            backoff: 5000 
        })

    }

    @Cron('20 * * * * *')
    async consumer() {
        this.logger.debug('Adding job to scraping vehicles queue')

        const url = 'https://auto.mercadolibre.com.ar/MLA-1763535805-ford-f-100-42-i-xlt-mwm-_JM#' 

        await this.scrapingQueue.add('scraping-vehicles', { url }, {
            attempts: 3, 
            backoff: 5000 
        })
    }

}
