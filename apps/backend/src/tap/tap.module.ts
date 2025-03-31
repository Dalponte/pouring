import { Module } from '@nestjs/common';
import { TapService } from './tap.service';
import { TapQueryResolver } from './resolvers/tap.query.resolver';
import { TapMutationResolver } from './resolvers/tap.mutation.resolver';
import { TapSubscriptionResolver } from './resolvers/tap.subscription.resolver';
import { PrismaModule } from '../prisma/prisma.module';
import { PubSub } from 'graphql-subscriptions';

@Module({
    imports: [PrismaModule],
    providers: [
        TapService,
        TapQueryResolver,
        TapMutationResolver,
        TapSubscriptionResolver,
        {
            provide: 'PUB_SUB',
            useValue: new PubSub(),
        }
    ],
    exports: [TapService],
})
export class TapModule { }
