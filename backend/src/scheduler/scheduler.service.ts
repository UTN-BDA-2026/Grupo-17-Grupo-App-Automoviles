
import { Injectable, Logger } from '@nestjs/common'
import { Cron } from '@nestjs/schedule'
import { Queue } from 'bullmq'
import { InjectQueue } from '@nestjs/bullmq'
import { DISCOVER_URLS } from './constants/discorver-urls'

@Injectable()
export class SchedulerService {

    private readonly logger = new Logger(SchedulerService.name);

    constructor(
        @InjectQueue('discover-vehicles') private readonly discoverQueue: Queue,
        @InjectQueue('scraping-vehicles') private readonly scrapingQueue: Queue
    ){}

    @Cron('0 0 10 * * *')
    async discover(){
        
        for (const url of DISCOVER_URLS) {
            try {
                await this.discoverQueue.add('discover-vehicles', { url }, {
                    attempts: 3, 
                    backoff: 5000 
                })
            } catch (error : any) {
                this.logger.error(`Error al agregar job para URL ${url}:`, error)
            }
        }

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
