
import { Processor, WorkerHost } from "@nestjs/bullmq"
import { Job } from "bullmq"
import { ScraperService } from "./scraper.service";


@Processor('discover-vehicles') 
export class DiscoverScrapingWorker extends WorkerHost {

    constructor(private readonly scraperService : ScraperService){
        super();
    }
    
    public async process(job: Job<any, any, string>): Promise<any> {
        
        const { url } = job.data

        try {
            const result = await this.scrap(url)

            return {
                status: "success",
                result
            }
        } 
        catch (error : any) {
            throw error
        }
    }

    private async scrap(url: string) {
        const links = await this.scraperService.discoverVehicles(url)
        return links
    }
}

