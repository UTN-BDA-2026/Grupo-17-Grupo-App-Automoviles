import { Injectable, Logger } from '@nestjs/common';
import { Cron, CronExpression, SchedulerRegistry } from '@nestjs/schedule';
import { Queue } from 'bullmq';
import { InjectQueue } from '@nestjs/bullmq';
import { DISCOVER_URLS } from '../scraper/constants/discorver-urls';
import { LinkService } from '../scraper/services/link.service';
import { Link } from '../scraper/models/link.entity';
import { LinkStatus } from '../scraper/models/link.entity';
import {
  JobInfoDTO,
  QueueStatsDTO,
  SchedulerStatsDTO,
} from './dto/job-info.dto';

@Injectable()
export class SchedulerService {
  private readonly logger = new Logger(SchedulerService.name);

  constructor(
    @InjectQueue('discover-vehicles') private readonly discoverQueue: Queue,
    @InjectQueue('scraping-vehicles') private readonly scrapingQueue: Queue,
    private readonly linkService: LinkService,
    private readonly schedulerRegistry: SchedulerRegistry,
  ) {}

  @Cron(CronExpression.EVERY_6_HOURS)
  public async discover() {
    const { base, name, links } = DISCOVER_URLS.mercado_libre;
    const remainingLinks = [...links];

    while (remainingLinks.length > 0) {
      const randomIndex = Math.floor(Math.random() * remainingLinks.length);
      const url = remainingLinks[randomIndex];

      try {
        await this.discoverQueue.add(
          'discover-vehicles',
          { url, name, base },
          {
            attempts: 3,
            backoff: 5000,
          },
        );

        this.logger.log('Job has been added in disconver vehicles queue');
      } catch (error: any) {
        this.logger.error(
          `Error adding job to discover URL ${url}:`,
          error.message,
        );
      } finally {
        // Remover la URL del array de URLs pendientes después de procesarla
        remainingLinks.splice(randomIndex, 1);
      }
    }
  }

  @Cron(CronExpression.EVERY_MINUTE)
  public async consumer() {
    let link: Link | null;

    const pendingLinks = await this.linkService.getByStatus(
      LinkStatus.PENDIENTE,
    );
    pendingLinks !== null ? (link = pendingLinks[0]) : (link = null);

    const url = link?.url;

    if (url) {
      try {
        await this.scrapingQueue.add(
          'scraping-vehicles',
          { url },
          {
            attempts: 3,
            backoff: 5000,
          },
        );

        await this.linkService.updateByURL(url, {
          status: LinkStatus.PROCESANDO,
        });

        this.logger.log('Job has been added in scraping vehicles queue');
      } catch (error: any) {
        this.logger.error(
          `Error adding job to scraping URL ${url}:`,
          error.message,
        );
      }
    }
  }

  // Obtiene las estadísticas del scheduler y sus colas
  public async getSchedulerStats(): Promise<SchedulerStatsDTO> {
    const queues = [
      { queue: this.discoverQueue, name: 'discover-vehicles' },
      { queue: this.scrapingQueue, name: 'scraping-vehicles' },
    ];

    const queueStats: QueueStatsDTO[] = [];

    for (const { queue, name } of queues) {
      const stats = await this.getQueueStats(queue, name);
      queueStats.push(stats);
    }

    const cronTasks = this.getCronTasks();

    return {
      isSchedulerRunning: true,
      queues: queueStats,
      cronTasks,
    };
  }

  // Obtiene las estadísticas de una cola específica
  private async getQueueStats(
    queue: Queue,
    name: string,
  ): Promise<QueueStatsDTO> {
    const [
      activeCount,
      completedCount,
      failedCount,
      delayedCount,
      waitingCount,
    ] = await Promise.all([
      queue.getActiveCount(),
      queue.getCompletedCount(),
      queue.getFailedCount(),
      queue.getDelayedCount(),
      queue.getWaitingCount(),
    ]);

    // Obtener jobs activos y fallidos
    const [activeJobs, failedJobs, waitingJobs] = await Promise.all([
      queue.getJobs(['active'], 0, 10),
      queue.getJobs(['failed'], 0, 10),
      queue.getJobs(['waiting'], 0, 10),
    ]);

    const jobs = [...activeJobs, ...failedJobs, ...waitingJobs].map((job) =>
      this.formatJobInfo(job),
    );

    return {
      name,
      count: {
        active: activeCount,
        completed: completedCount,
        failed: failedCount,
        delayed: delayedCount,
        waiting: waitingCount,
      },
      jobs,
    };
  }

  // Formatea la información de un job
  private formatJobInfo(job: any): JobInfoDTO {
    return {
      id: job.id,
      name: job.name,
      state: job._state || 'unknown',
      progress: typeof job.progress === 'number' ? job.progress : 0,
      attempts: job.opts?.attempts || 0,
      attemptsMade: job.attemptsMade || 0,
      data: job.data,
      returnValue: job.returnvalue,
      failedReason: job.failedReason || null,
      stacktrace: job.stacktrace || null,
      timestamp: job.timestamp,
      processedOn: job.processedOn,
      finishedOn: job.finishedOn,
    };
  }

  // Obtiene la información de los cron tasks registrados
  private getCronTasks(): any[] {
    try {
      const jobs = this.schedulerRegistry.getCronJobs();
      const cronTasks: any[] = [];

      jobs.forEach((job, name) => {
        cronTasks.push({
          name,
          pattern: job.cronTime.source,
          nextExecution: job.nextDate().toString(),
        });
      });

      return cronTasks;
    } catch (error) {
      this.logger.warn('Could not retrieve cron tasks', error);
      return [];
    }
  }

  // Obtiene los jobs de una cola específica filtrando por estado
  public async getQueueJobsByState(
    queueName: string,
    state: 'active' | 'completed' | 'failed' | 'waiting' | 'delayed' | 'paused',
    limit: number = 50,
  ): Promise<JobInfoDTO[]> {
    const queue =
      queueName === 'discover-vehicles'
        ? this.discoverQueue
        : this.scrapingQueue;

    const jobs = await queue.getJobs([state], 0, limit);
    return jobs.map((job) => this.formatJobInfo(job));
  }

  // Obtiene el detalle de un job específico
  public async getJobDetail(
    queueName: string,
    jobId: string,
  ): Promise<JobInfoDTO | null> {
    const queue =
      queueName === 'discover-vehicles'
        ? this.discoverQueue
        : this.scrapingQueue;

    const job = await queue.getJob(jobId);
    return job ? this.formatJobInfo(job) : null;
  }
}
