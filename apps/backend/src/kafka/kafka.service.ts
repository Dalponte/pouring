import { Injectable, OnModuleInit } from '@nestjs/common';
import { ClientKafka } from '@nestjs/microservices';
import { Observable } from 'rxjs';

@Injectable()
export class KafkaService implements OnModuleInit {
    constructor(private readonly kafkaClient: ClientKafka) { }

    async onModuleInit() {
        this.kafkaClient.subscribeToResponseOf('example.topic');
        await this.kafkaClient.connect();
    }

    sendMessage(topic: string, message: any): Observable<any> {
        return this.kafkaClient.emit<any>(topic, message);
    }
}
