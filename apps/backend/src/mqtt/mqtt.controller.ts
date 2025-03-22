import { Controller, Logger } from '@nestjs/common';
import { EventPattern, Payload } from '@nestjs/microservices';
import { QueueService } from '../queue/queue.service';
import { TapEvent } from '../queue/types/tap-event.type';
import { DispenseType } from '@prisma/client';

@Controller()
export class MqttController {
    private readonly logger = new Logger(MqttController.name);

    constructor(private readonly queueService: QueueService) { }

    @EventPattern('tap/events')
    async handleTapEvents(@Payload() data: TapEvent) {
        this.logger.log(`Recebido evento: ${JSON.stringify(data)}`);

        if (data.type === DispenseType.AUTO_SERVICE) {
            return await this.queueService.addDispenseJob(data);
        }
    }
}
