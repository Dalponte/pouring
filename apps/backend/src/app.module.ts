import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { GraphQLModule } from '@nestjs/graphql';
import { MqttModule } from './mqtt/mqtt.module';
import { QueueModule } from './queue/queue.modules';
import { PrismaModule } from './prisma/prisma.module';
import { DispenseModule } from './dispense/dispense.module';
import { join } from 'path';
import { DispenseProcessor } from './queue/processors/dispense.processor';
import { ApolloDriver, ApolloDriverConfig } from '@nestjs/apollo';
import { EventEmitterModule } from '@nestjs/event-emitter';
import { TapModule } from './tap/tap.module';
import { TagModule } from './tag/tag.module';

@Module({
    imports: [
        ConfigModule.forRoot({ isGlobal: true }),
        EventEmitterModule.forRoot(),
        GraphQLModule.forRoot<ApolloDriverConfig>({
            driver: ApolloDriver,
            autoSchemaFile: join(process.cwd(), 'src/schema.gql'),
            sortSchema: true,
            playground: true,
            subscriptions: {
                'graphql-ws': true,
                'subscriptions-transport-ws': true,
            },
            installSubscriptionHandlers: true,
        }),
        MqttModule,
        QueueModule,
        PrismaModule,
        DispenseModule,
        TapModule,
        TagModule,
    ],
    providers: [
        DispenseProcessor,
    ],
})
export class AppModule { }
