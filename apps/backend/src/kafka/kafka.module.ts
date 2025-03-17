import { Module } from '@nestjs/common';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { ConfigModule } from '@nestjs/config';
import { KafkaService } from './kafka.service';

@Module({
    imports: [
        ConfigModule,
        ClientsModule.register([
            {
                name: 'KAFKA_SERVICE',
                transport: Transport.KAFKA,
                options: {
                    client: {
                        clientId: 'operations',
                        brokers: [process.env.KAFKA_BROKER || 'kafka:9092'],
                    },
                    consumer: {
                        groupId: 'operations-consumer',
                    },
                },
            },
        ]),
    ],
    providers: [KafkaService],
    exports: [KafkaService],
})
export class KafkaModule { }
