import { Process, Processor } from '@nestjs/bull';
import { Logger } from '@nestjs/common';
import { Job } from 'bullmq';

@Processor('telemetry')
export class TelemetryProcessor {
    private readonly logger = new Logger(TelemetryProcessor.name);

    @Process('process-telemetry')
    async processJob(job: Job<unknown>) {
        this.logger.debug(`Processando telemetria: ${JSON.stringify(job.data)}`);

        return { processed: true };
    }
}
