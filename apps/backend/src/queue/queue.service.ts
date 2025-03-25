import { Injectable } from '@nestjs/common';
import { Queue } from 'bullmq';
import { InjectQueue } from '@nestjs/bullmq';
import { TapEvent } from './types/tap-event.type';

@Injectable()
export class QueueService {
    constructor(
        @InjectQueue('auto-service') private readonly dispenseQueue: Queue,
    ) { }

    async addDispenseJob(data: TapEvent) {
        return this.dispenseQueue.add('auto-service', data, {
            removeOnComplete: { count: 100 },
            attempts: 2,
        });
    }
}
