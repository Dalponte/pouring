import { Injectable } from '@nestjs/common';
import { Queue } from 'bullmq';
import { InjectQueue } from '@nestjs/bull';

@Injectable()
export class QueueService {
    constructor(
        @InjectQueue('telemetry') private readonly telemetryQueue: Queue,
        @InjectQueue('operation') private readonly operationQueue: Queue,
    ) { }

    async addTelemetryJob(data: any) {
        return this.telemetryQueue.add('process-telemetry', data, {
            removeOnComplete: true,
            attempts: 3,
        });
    }

    async addOperationJob(data: any) {
        return this.operationQueue.add('process-operation', data, {
            removeOnComplete: true,
            attempts: 3,
        });
    }
}
