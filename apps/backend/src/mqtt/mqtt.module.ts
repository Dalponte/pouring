import { Module } from '@nestjs/common';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { MqttService } from './mqtt.service';
import { MqttController } from './mqtt.controller';

@Module({
    imports: [
        ConfigModule.forRoot(), // Carrega variáveis do .env
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
    controllers: [MqttController], // Registra o controller de eventos MQTT
    providers: [MqttService],
    exports: [MqttService], // Exporta para ser usado em outros módulos, se necessário
})
export class MqttModule { }
