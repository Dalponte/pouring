import { Controller } from '@nestjs/common';
import { EventPattern, Payload } from '@nestjs/microservices';

@Controller()
export class KafkaController {
    @EventPattern('pour_finished')
    async handlePour(@Payload() message: any) {
        console.log('Pour operation finished:', message.value);
    }
}
