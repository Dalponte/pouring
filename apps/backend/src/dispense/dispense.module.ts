import { Module } from '@nestjs/common';
import { DispenseService } from './dispense.service';
import { DispenseResolver } from './dispense.resolver';
import { PrismaService } from '../prisma/prisma.service';
import { PubSub } from 'graphql-subscriptions';

@Module({
    providers: [
        DispenseService,
        DispenseResolver,
        PrismaService,
        {
            provide: 'PUB_SUB',
            useValue: new PubSub(),
        },
    ],
})
export class DispenseModule { }
