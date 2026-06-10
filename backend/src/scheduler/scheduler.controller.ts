
import { Controller, Get, Query, Param } from '@nestjs/common';
import { SchedulerService } from './scheduler.service';
import { SchedulerStatsDTO, JobInfoDTO } from './dto/job-info.dto';

@Controller('scheduler')
export class SchedulerController {

    constructor(private readonly schedulerService: SchedulerService) {}

    @Get('admin/jobs')
    public async getJobs(): Promise<SchedulerStatsDTO> {
        return this.schedulerService.getSchedulerStats();
    }

    @Get('admin/queue/:queueName/jobs')
    public async getQueueJobs(
        @Param('queueName') queueName: string,
        @Query('state') state: 'active' | 'completed' | 'failed' | 'waiting' | 'delayed' | 'paused' = 'active',
        @Query('limit') limit: string = '50'
    ): Promise<JobInfoDTO[]> {
        return this.schedulerService.getQueueJobsByState(queueName, state, parseInt(limit));
    }

    @Get('admin/queue/:queueName/job/:jobId')
    public async getJobDetail(
        @Param('queueName') queueName: string,
        @Param('jobId') jobId: string
    ): Promise<JobInfoDTO | null> {
        return this.schedulerService.getJobDetail(queueName, jobId);
    }

}
