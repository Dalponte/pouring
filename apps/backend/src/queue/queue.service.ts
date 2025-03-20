import { Injectable } from '@nestjs/common';
import { Queue } from 'bullmq';
import { InjectQueue } from '@nestjs/bullmq';

@Injectable()
export class QueueService {
    constructor(
        @InjectQueue('dispense') private readonly dispenseQueue: Queue,
    ) { }

    async addDispenseJob(data: any) {
        return this.dispenseQueue.add('dispense', data, {
            removeOnComplete: { count: 100 },
            attempts: 2,
        });
    }
}
