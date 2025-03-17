import { Controller, Logger } from '@nestjs/common';
import { EventPattern, Payload } from '@nestjs/microservices';

@Controller()
export class MqttController {
    private readonly logger = new Logger(MqttController.name);

    // Handler para eventos de operação
    @EventPattern('operation')
    handleOperation(@Payload() data: any) {
        this.logger.log(`Recebido evento de operação: ${JSON.stringify(data)}`);
    }

    // Handler para eventos de telemetria
    @EventPattern('telemetry')
    handleTelemetry(@Payload() data: any) {
        this.logger.log(`Recebido evento de telemetria: ${JSON.stringify(data)}`);
    }
}
