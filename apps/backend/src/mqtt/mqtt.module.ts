import { Module } from '@nestjs/common';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { MqttService } from './mqtt.service';
import { MqttController } from './mqtt.controller';
import { QueueModule } from 'src/queue/queue.modules';

@Module({
    imports: [
        ConfigModule.forRoot(),
        QueueModule,
        ClientsModule.registerAsync([
            {
                name: 'MQTT_SERVICE',
                imports: [ConfigModule],
                useFactory: async (configService: ConfigService) => ({
                    transport: Transport.MQTT,
                    options: {
                        url: configService.get<string>('MQTT_BROKER'),
                    },
                }),
                inject: [ConfigService],
            },
        ]),
    ],
    controllers: [MqttController],
    providers: [MqttService],
    exports: [MqttService],
})
export class MqttModule { }
