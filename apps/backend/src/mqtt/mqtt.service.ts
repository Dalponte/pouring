import { Inject, Injectable } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';

@Injectable()
export class MqttService {
    constructor(
        @Inject('MQTT_SERVICE') private readonly client: ClientProxy, // Usa @Inject para facilitar testes
    ) { }

    // Método para publicar mensagens em um tópico MQTT
    async sendMessage(topic: string, message: any) {
        return this.client.emit(topic, message);
    }
}
