
import { ScraperService } from "./scraper.service";
import { Processor, WorkerHost } from "@nestjs/bullmq"
import { Job } from "bullmq";

@Processor('scraping-vehicles') 
export class ConsumerScrapingWorker extends WorkerHost {

    constructor(private readonly scraperService : ScraperService){
        super()
    }
    
    public async process(job: Job<any, any, string>): Promise<any> {
        
        const { url } = job.data

        try {
            const result = await this.scrap(url)

            console.log(result)

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
        const technicalSheet = await this.scraperService.scrapVehicle(url)
        return technicalSheet
    }
}

