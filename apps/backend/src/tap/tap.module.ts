import { Module } from '@nestjs/common';
import { TapService } from './tap.service';
import { TapResolver } from './tap.resolver';
import { PrismaService } from '../prisma/prisma.service';
import { PubSub } from 'graphql-subscriptions';

@Module({
    providers: [
        TapService,
        TapResolver,
        PrismaService,
        {
            provide: 'PUB_SUB',
            useValue: new PubSub(),
        },
    ],
    exports: [TapService],
})
export class TapModule { }
