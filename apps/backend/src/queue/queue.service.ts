import { Injectable } from '@nestjs/common';
import { Queue } from 'bullmq';
import { InjectQueue } from '@nestjs/bullmq';
import { CreateDispenseInput } from '../dispense/dto/create-dispense.input';
import { TapEvent } from './types/tap-event.type';

@Injectable()
export class QueueService {
    constructor(
        @InjectQueue('dispense') private readonly dispenseQueue: Queue,
    ) { }

    async addDispenseJob(data: TapEvent) {
        return this.dispenseQueue.add('dispense', data, {
            removeOnComplete: { count: 100 },
            attempts: 2,
        });
    }
}
