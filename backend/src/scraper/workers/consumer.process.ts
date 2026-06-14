
import { Logger } from "@nestjs/common"
import { ScraperService } from "../services/scraper.service"
import { VehicleParserService } from "../services/vehicle_parser.service"
import { Processor, WorkerHost } from "@nestjs/bullmq"
import { VehicleOutputDTO } from "../interfaces/input_ml.dto"
import { BrandService } from "../../products/services/brand.service"
import { ModelService } from "../../products/services/model.service"
import { VehicleService } from "../../products/services/vehicle.service"
import { ListingService } from "../../products/services/listing.service"
import { LinkService } from "../services/link.service"
import { Brand } from "../../products/models/brand.entity"
import { Model } from "../../products/models/model.entity"
import { Vehicle } from "../../products/models/vehicle.entity"
import { LinkStatus } from "../models/link.entity"
import { Job } from "bullmq"


@Processor('scraping-vehicles') 
export class ConsumerScrapingWorker extends WorkerHost {

    private readonly logger = new Logger(ConsumerScrapingWorker.name)

    constructor(
        private readonly scraperService: ScraperService,
        private readonly vehicleParser: VehicleParserService,
        private readonly brandService: BrandService,
        private readonly modelService: ModelService,
        private readonly vehicleService: VehicleService,
        private readonly listingService: ListingService,
        private readonly linkService: LinkService

    ){ super() }
    
    public async process(job: Job<any, any, string>): Promise<any> {
        
        const { url } = job.data

        try {
            const result = await this.scrap(url)
            const parsed_result = this.parse(result)

            await this.saveData(url, parsed_result)

            this.logger.log(`Vehicle listing was saved in database successfully`)

        } 
        catch (error: any) {
            this.logger.error(error.message)
        }
    }

    private async scrap(url: string) {
        const informationSheet = await this.scraperService.scrapVehicle(url)
        return informationSheet
    }

    private parse(data: object) : VehicleOutputDTO {
        const parsedData = this.vehicleParser.parseVehicleData(data)
        return parsedData
    }

    private async saveData(url: string, data: VehicleOutputDTO) {

        let brand : Brand | null
        data.brand.name !== undefined ? brand = await this.brandService.getByName(data.brand.name) : brand = null

        if (!brand) brand = await this.brandService.create(data.brand)

        let model : Model | null
        data.model.name !== undefined ? model = await this.modelService.getByNameAndBrand(data.model.name, brand.id) : model = null

        if (!model) { 
            model = await this.modelService.create({
                brand_id: brand?.id,
                name: data.model.name
            })
        }

        let vehicle : Vehicle |  null
        data.vehicle.year && data.vehicle.version !== undefined ? vehicle = await this.vehicleService.getByYearAndModelAndVersion(data.vehicle.year, model.id, data.vehicle.version) : vehicle = null

        if (!vehicle) {
            vehicle = await this.vehicleService.create({
                model_id: model?.id,
                year: data.vehicle.year,
                version: data.vehicle.version
            })
        }

        await this.listingService.create({
            ...data.listing,
            vehicle_id: vehicle?.id
        })

        await this.linkService.updateByURL(url, {
            status: LinkStatus.COMPLETADO
        })
            
    }
}

