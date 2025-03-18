import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { MqttModule } from './mqtt/mqtt.module';
import { TelemetryProcessor } from './queue/telemetry.processor';
import { OperationProcessor } from './queue/operation.processor';
import { QueueModule } from './queue/queue.modules';

@Module({
    imports: [
        ConfigModule.forRoot({ isGlobal: true }),
        MqttModule,
        QueueModule,
    ],
    providers: [
        TelemetryProcessor,
        OperationProcessor,
    ],
})
export class AppModule { }
