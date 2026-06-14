
export class JobInfoDTO {
    id!: string;
    name!: string;
    state!: 'completed' | 'failed' | 'delayed' | 'active' | 'waiting' | 'paused';
    progress!: number;
    attempts!: number;
    attemptsMade!: number;
    data!: Record<string, any>;
    returnValue!: any;
    failedReason!: string | null;
    stacktrace!: string[] | null;
    timestamp!: number;
    processedOn!: number | null;
    finishedOn!: number | null;
}

export class QueueStatsDTO {
    name!: string;
    count!: {
        active: number;
        completed: number;
        failed: number;
        delayed: number;
        waiting: number;
    };
    jobs!: JobInfoDTO[];
}

export class SchedulerStatsDTO {
    isSchedulerRunning!: boolean;
    queues!: QueueStatsDTO[];
    cronTasks!: {
        name: string;
        pattern: string;
        nextExecution: string;
    }[];
}
