import { Processor, WorkerHost } from '@nestjs/bullmq';
import { Logger } from '@nestjs/common';
import { Job } from 'bullmq';
import { PrismaService } from '../../prisma/prisma.service';
import { EventEmitter2 } from '@nestjs/event-emitter';

@Processor('dispense')
export class DispenseProcessor extends WorkerHost {
    private readonly logger = new Logger(DispenseProcessor.name);

    constructor(
        private prisma: PrismaService,
        private eventEmitter: EventEmitter2
    ) {
        super();
    }

    async process(job: Job<any, any, string>) {
        this.logger.debug(`Processor Dispense: ${JSON.stringify(job.data)}`);

        const { type, meta = {} } = job.data;

        const dispense = await this.prisma.dispense.create({
            data: {
                type,
                meta,
            },
        });

        this.logger.debug(`Dispense stored with ID: ${dispense.id}`);

        // Emit event instead of direct PubSub
        this.eventEmitter.emit('dispense.created', dispense);

        return { processed: true, dispenseId: dispense.id };
    }
}
