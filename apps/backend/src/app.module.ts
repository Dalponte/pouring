import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { MqttModule } from './mqtt/mqtt.module';
import { OperationProcessor } from './queue/processors/operation.processor';
import { QueueModule } from './queue/queue.modules';

@Module({
    imports: [
        ConfigModule.forRoot({ isGlobal: true }),
        MqttModule,
        QueueModule,
    ],
    providers: [
        OperationProcessor,
    ],
})
export class AppModule { }
