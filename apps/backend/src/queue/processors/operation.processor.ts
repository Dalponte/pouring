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

        // Store the job data in the database
        const operation = await this.prisma.operation.create({
            data: {
                meta: job.data,
            },
        });

        this.logger.debug(`Operation stored with ID: ${operation.id}`);

        return { processed: true, operationId: operation.id };
    }
}
