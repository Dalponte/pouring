import { Inject, Injectable } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';

@Injectable()
export class MqttService {
    constructor(
        @Inject('MQTT_SERVICE') private readonly client: ClientProxy,
    ) { }

    async sendMessage(topic: string, message: any) {
        return this.client.emit(topic, message);
    }
}
