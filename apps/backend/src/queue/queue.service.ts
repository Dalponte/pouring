import { Injectable } from '@nestjs/common';
import { Queue } from 'bullmq';
import { InjectQueue } from '@nestjs/bullmq';

@Injectable()
export class QueueService {
    constructor(
        @InjectQueue('telemetry') private readonly telemetryQueue: Queue,
        @InjectQueue('operation') private readonly operationQueue: Queue,
    ) { }

    async addTelemetryJob(data: any) {
        return this.telemetryQueue.add('telemetry', data, {
            removeOnComplete: { count: 100 },  // Mantém os 100 jobs mais recentes
            attempts: 3,
        });
    }

    async addOperationJob(data: any) {
        return this.operationQueue.add('operation', data, {
            removeOnComplete: { count: 100 },  // Mantém os 100 jobs mais recentes
            attempts: 3,
        });
    }
}
