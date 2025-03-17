import { Controller } from '@nestjs/common';
import { EventPattern, Payload } from '@nestjs/microservices';

@Controller()
export class MqttController {
    @EventPattern('bera-beer/events')
    handleEvent(@Payload() data: any) {
        console.log('Evento recebido:', data);
    }
}
