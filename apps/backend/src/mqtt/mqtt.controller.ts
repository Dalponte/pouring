import { Controller, Logger } from '@nestjs/common';
import { EventPattern, Payload } from '@nestjs/microservices';
import { QueueService } from '../queue/queue.service';

@Controller()
export class MqttController {
    private readonly logger = new Logger(MqttController.name);

    constructor(private readonly queueService: QueueService) { }

    // Handler para eventos de operação
    @EventPattern('operation')
    async handleOperation(@Payload() data: any) {
        this.logger.log(`Recebido evento de operação: ${JSON.stringify(data)}`);
        await this.queueService.addOperationJob(data);
    }

    // Handler para eventos de telemetria
    @EventPattern('telemetry')
    async handleTelemetry(@Payload() data: any) {
        this.logger.log(`Recebido evento de telemetria: ${JSON.stringify(data)}`);
        await this.queueService.addTelemetryJob(data);
    }
}
