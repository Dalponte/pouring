import { Processor, WorkerHost } from '@nestjs/bullmq';
import { Logger } from '@nestjs/common';
import { Job } from 'bullmq';
import { PrismaService } from '../../prisma/prisma.service';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { TapEvent } from '../types/tap-event.type';
import { CreateDispenseInput } from '../../dispense/dto/create-dispense.input';

@Processor('dispense')
export class DispenseProcessor extends WorkerHost {
    private readonly logger = new Logger(DispenseProcessor.name);

    constructor(
        private prisma: PrismaService,
        private eventEmitter: EventEmitter2
    ) {
        super();
    }

    async process(job: Job<TapEvent, any, string>) {
        this.logger.debug(`Processor Dispense: ${JSON.stringify(job.data)}`);

        const tapEvent = job.data;

        // Convert TapEvent to CreateDispenseInput structure
        const dispenseInput: CreateDispenseInput = {
            type: tapEvent.type,
            meta: tapEvent.meta || {},
            tapId: tapEvent.tapId
        };

        const data: any = {
            type: dispenseInput.type,
            meta: dispenseInput.meta,
            tap: { connect: { id: dispenseInput.tapId } },
            client: dispenseInput.clientId ? { connect: { id: dispenseInput.clientId } } : undefined
        };

        try {
            const dispense = await this.prisma.dispense.create({
                data,
                include: {
                    tap: true,
                    client: true
                }
            });

            this.logger.debug(`Dispense stored with ID: ${dispense.id}`);

            this.eventEmitter.emit('dispense.created', dispense);

            return { processed: true, dispenseId: dispense.id };
        } catch (error) {
            this.logger.error(`Failed to create dispense: ${error.message}`, error.stack);
            throw new Error(`Failed to process dispense: ${error.message}`);
        }
    }
}
