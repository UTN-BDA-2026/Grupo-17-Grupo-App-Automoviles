import { Controller, Get, Query, Param, UseGuards } from '@nestjs/common';
import {
  ApiTags,
  ApiBearerAuth,
  ApiOperation,
  ApiOkResponse,
  ApiUnauthorizedResponse,
  ApiForbiddenResponse,
  ApiParam,
  ApiQuery,
} from '@nestjs/swagger';
import { SchedulerService } from './scheduler.service';
import { SchedulerStatsDTO, JobInfoDTO } from './dto/job-info.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { UserRole } from '../users/user.entity';

@ApiTags('scheduler (admin)')
@ApiBearerAuth('jwt')
@ApiUnauthorizedResponse({ description: 'Token no provisto, inválido o expirado.' })
@ApiForbiddenResponse({ description: 'Requiere rol Admin.' })
@Controller('api/scheduler')
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles(UserRole.ADMIN)
export class SchedulerController {
  constructor(private readonly schedulerService: SchedulerService) {}

  @Get('admin/jobs')
  @ApiOperation({
    summary: 'Estadísticas del scheduler',
    description: 'Devuelve el estado del scheduler, las colas y las tareas cron. Solo Admin.',
  })
  @ApiOkResponse({ description: 'Estadísticas del scheduler.', type: SchedulerStatsDTO })
  public async getJobs(): Promise<SchedulerStatsDTO> {
    return this.schedulerService.getSchedulerStats();
  }

  @Get('admin/queue/:queueName/jobs')
  @ApiOperation({
    summary: 'Listar jobs de una cola por estado',
    description: 'Devuelve los jobs de la cola indicada filtrados por estado. Solo Admin.',
  })
  @ApiParam({ name: 'queueName', description: 'Nombre de la cola', example: 'scraping-vehicles' })
  @ApiQuery({
    name: 'state',
    required: false,
    enum: ['active', 'completed', 'failed', 'waiting', 'delayed', 'paused'],
    example: 'active',
    description: 'Estado a filtrar (default "active").',
  })
  @ApiQuery({ name: 'limit', required: false, type: Number, example: 50, description: 'Máximo de jobs (default 50).' })
  @ApiOkResponse({ description: 'Listado de jobs.', type: [JobInfoDTO] })
  public async getQueueJobs(
    @Param('queueName') queueName: string,
    @Query('state')
    state:
      | 'active'
      | 'completed'
      | 'failed'
      | 'waiting'
      | 'delayed'
      | 'paused' = 'active',
    @Query('limit') limit: string = '50',
  ): Promise<JobInfoDTO[]> {
    return this.schedulerService.getQueueJobsByState(
      queueName,
      state,
      parseInt(limit),
    );
  }

  @Get('admin/queue/:queueName/job/:jobId')
  @ApiOperation({
    summary: 'Detalle de un job',
    description: 'Devuelve el detalle de un job específico de una cola. Solo Admin.',
  })
  @ApiParam({ name: 'queueName', description: 'Nombre de la cola', example: 'scraping-vehicles' })
  @ApiParam({ name: 'jobId', description: 'Id del job', example: '42' })
  @ApiOkResponse({ description: 'Detalle del job (o null si no existe).', type: JobInfoDTO })
  public async getJobDetail(
    @Param('queueName') queueName: string,
    @Param('jobId') jobId: string,
  ): Promise<JobInfoDTO | null> {
    return this.schedulerService.getJobDetail(queueName, jobId);
  }
}
