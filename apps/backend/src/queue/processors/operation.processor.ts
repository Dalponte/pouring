import { Processor, WorkerHost } from '@nestjs/bullmq';
import { Logger } from '@nestjs/common';
import { Job } from 'bullmq';
import { PrismaService } from '../../prisma/prisma.service';

@Processor('operation')
export class OperationProcessor extends WorkerHost {
    private readonly logger = new Logger(OperationProcessor.name);

    constructor(private prisma: PrismaService) {
        super();
    }

    async process(job: Job<any, any, string>) {
        this.logger.debug(`Processor Operation: ${JSON.stringify(job.data)}`);

        const { tapId, tapName, operationId, client, meta = {}, timestamp: timestampStr } = job.data;

        const timestamp = timestampStr ? new Date(timestampStr) : undefined;
        const operation = await this.prisma.operation.create({
            data: {
                tapId,
                tapName,
                operationId,
                client,
                meta,
                timestamp,
            },
        });

        this.logger.debug(`Operation stored with ID: ${operation.id}`);

        return { processed: true, operationId: operation.id };
    }
}
