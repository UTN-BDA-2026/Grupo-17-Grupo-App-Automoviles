import { ApiProperty } from '@nestjs/swagger';

export class JobInfoDTO {
  @ApiProperty({ description: 'Id del job', example: '42' })
  id!: string;

  @ApiProperty({ description: 'Nombre del job', example: 'discover-vehicles' })
  name!: string;

  @ApiProperty({
    description: 'Estado del job',
    enum: ['completed', 'failed', 'delayed', 'active', 'waiting', 'paused'],
    example: 'active',
  })
  state!: 'completed' | 'failed' | 'delayed' | 'active' | 'waiting' | 'paused';

  @ApiProperty({ description: 'Progreso (0-100)', example: 50 })
  progress!: number;

  @ApiProperty({ description: 'Cantidad de intentos configurados', example: 3 })
  attempts!: number;

  @ApiProperty({ description: 'Intentos ya realizados', example: 1 })
  attemptsMade!: number;

  @ApiProperty({
    description: 'Datos de entrada del job',
    type: 'object',
    additionalProperties: true,
  })
  data!: Record<string, any>;

  @ApiProperty({ description: 'Valor de retorno del job', nullable: true })
  returnValue!: any;

  @ApiProperty({ description: 'Razón de la falla', nullable: true, example: null })
  failedReason!: string | null;

  @ApiProperty({
    description: 'Stacktrace de la falla',
    type: [String],
    nullable: true,
  })
  stacktrace!: string[] | null;

  @ApiProperty({ description: 'Timestamp de creación (epoch ms)', example: 1781566722865 })
  timestamp!: number;

  @ApiProperty({ description: 'Inicio de procesamiento (epoch ms)', nullable: true })
  processedOn!: number | null;

  @ApiProperty({ description: 'Fin de procesamiento (epoch ms)', nullable: true })
  finishedOn!: number | null;
}

export class QueueCountDTO {
  @ApiProperty({ example: 2 })
  active!: number;

  @ApiProperty({ example: 10 })
  completed!: number;

  @ApiProperty({ example: 1 })
  failed!: number;

  @ApiProperty({ example: 0 })
  delayed!: number;

  @ApiProperty({ example: 5 })
  waiting!: number;
}

export class QueueStatsDTO {
  @ApiProperty({ description: 'Nombre de la cola', example: 'scraping-vehicles' })
  name!: string;

  @ApiProperty({ description: 'Conteo de jobs por estado', type: QueueCountDTO })
  count!: {
    active: number;
    completed: number;
    failed: number;
    delayed: number;
    waiting: number;
  };

  @ApiProperty({ description: 'Jobs de la cola', type: [JobInfoDTO] })
  jobs!: JobInfoDTO[];
}

export class CronTaskDTO {
  @ApiProperty({ example: 'discover-daily' })
  name!: string;

  @ApiProperty({ description: 'Patrón cron', example: '0 3 * * *' })
  pattern!: string;

  @ApiProperty({ description: 'Próxima ejecución (ISO)', example: '2026-06-16T03:00:00.000Z' })
  nextExecution!: string;
}

export class SchedulerStatsDTO {
  @ApiProperty({ description: '¿El scheduler está corriendo?', example: true })
  isSchedulerRunning!: boolean;

  @ApiProperty({ description: 'Estadísticas por cola', type: [QueueStatsDTO] })
  queues!: QueueStatsDTO[];

  @ApiProperty({ description: 'Tareas cron registradas', type: [CronTaskDTO] })
  cronTasks!: {
    name: string;
    pattern: string;
    nextExecution: string;
  }[];
}
