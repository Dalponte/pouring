import { Processor, WorkerHost } from '@nestjs/bullmq';
import { Logger } from '@nestjs/common';
import { Job } from 'bullmq';

@Processor('operation')
export class OperationProcessor extends WorkerHost {
    private readonly logger = new Logger(OperationProcessor.name);

    async process(job: Job<any, any, string>) {
        this.logger.debug(`Processando operação: ${JSON.stringify(job.data)}`);

        return { processed: true };
    }
}
