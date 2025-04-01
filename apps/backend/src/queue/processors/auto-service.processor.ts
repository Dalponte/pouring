import { Processor, WorkerHost } from '@nestjs/bullmq';
import { Logger } from '@nestjs/common';
import { Job } from 'bullmq';
import { PrismaService } from '../../prisma/prisma.service';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { TapEvent } from '../types/tap-event.type';
import { CreateDispenseInput } from '../../dispense/dto/create-dispense.input';

type AutoServiceProcessorResult = {
    processed: boolean;
    dispenseId: string;
};

@Processor('auto-service')
export class AutoServiceProcessor extends WorkerHost {
    private readonly logger = new Logger(AutoServiceProcessor.name);

    constructor(
        private prisma: PrismaService,
        private eventEmitter: EventEmitter2
    ) {
        super();
    }

    private async getClientId(tagId?: string): Promise<string | undefined> {
        if (!tagId) {
            return undefined;
        }
        const client = await this.prisma.client.findFirst({
            where: {
                tags: {
                    some: {
                        id: parseInt(tagId)
                    }
                }
            }
        });

        return client?.id;
    }

    async process(job: Job<TapEvent, AutoServiceProcessorResult, string>) {
        this.logger.debug(`Processor AutoService: ${JSON.stringify(job.data)}`);

        const tapEvent = job.data;

        const clientId = await this.getClientId(tapEvent?.tagId)

        const dispenseInput: CreateDispenseInput = {
            type: tapEvent.type,
            meta: tapEvent.meta || {},
            tapId: tapEvent.tapId,
            clientId,
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
