
import { Module } from '@nestjs/common'
import { ScheduleModule } from '@nestjs/schedule'
import { SchedulerService } from './scheduler.service'
import { BullModule } from '@nestjs/bullmq'
import { ScraperModule } from '../scraper/scraper.module'

@Module({
    imports: [
        ScheduleModule.forRoot(),
        BullModule.registerQueue(
            {
                name: 'discover-vehicles',
            },
            {
                name: 'scraping-vehicles'
            }),
        ScraperModule
    ],
    providers: [
        SchedulerService,
    ]
})
export class SchedulerModule { }
