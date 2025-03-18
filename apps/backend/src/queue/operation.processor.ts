import { Process, Processor } from '@nestjs/bull';
import { Logger } from '@nestjs/common';
import { Job } from 'bullmq';

@Processor('operation')
export class OperationProcessor {
    private readonly logger = new Logger(OperationProcessor.name);

    @Process('process-operation')
    async processJob(job: Job<unknown>) {
        this.logger.debug(`Processando operação: ${JSON.stringify(job.data)}`);

        // Processar comandos de operação aqui
        // Por exemplo, enviar comandos para equipamentos, logging de operações, etc.

        return { processed: true };
    }
}
