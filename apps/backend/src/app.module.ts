import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { GraphQLModule } from '@nestjs/graphql';
import { MqttModule } from './mqtt/mqtt.module';
import { OperationProcessor } from './queue/processors/operation.processor';
import { QueueModule } from './queue/queue.modules';
import { PrismaModule } from './prisma/prisma.module';
import { join } from 'path';

@Module({
    imports: [
        ConfigModule.forRoot({ isGlobal: true }),
        GraphQLModule.forRoot({
            autoSchemaFile: join(process.cwd(), 'src/schema.gql'),
        }),
        MqttModule,
        QueueModule,
        PrismaModule,
    ],
    providers: [
        OperationProcessor,
    ],
})
export class AppModule { }
