import { Module } from '@nestjs/common';
import { BullModule } from '@nestjs/bullmq';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { QueueService } from './queue.service';

@Module({
    imports: [
        BullModule.forRootAsync({
            imports: [ConfigModule],
            useFactory: (configService: ConfigService) => ({
                connection: {
                    host: configService.get('REDIS_HOST') || 'localhost',
                    port: parseInt(configService.get('REDIS_PORT') || '6379'),
                },
            }),
            inject: [ConfigService],
        }),
        BullModule.registerQueue({
            name: 'dispense',
        }),
    ],
    providers: [QueueService],
    exports: [QueueService],
})
export class QueueModule { }
