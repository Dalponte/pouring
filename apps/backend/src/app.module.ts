import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { MqttModule } from './mqtt/mqtt.module';

@Module({
    imports: [
        ConfigModule.forRoot({ isGlobal: true }),
        MqttModule,
    ],
})
export class AppModule { }
