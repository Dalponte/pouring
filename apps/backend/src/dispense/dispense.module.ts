import { Module } from '@nestjs/common';
import { DispenseService } from './dispense.service';
import { DispenseQueryResolver } from './resolvers/dispense.query.resolver';
import { DispenseMutationResolver } from './resolvers/dispense.mutation.resolver';
import { DispenseSubscriptionResolver } from './resolvers/dispense.subscription.resolver';
import { PrismaModule } from '../prisma/prisma.module';
import { PubSub } from 'graphql-subscriptions';

@Module({
    imports: [PrismaModule],
    providers: [
        DispenseService,
        DispenseQueryResolver,
        DispenseMutationResolver,
        DispenseSubscriptionResolver,
        {
            provide: 'PUB_SUB',
            useValue: new PubSub(),
        }
    ],
    exports: [DispenseService],
})
export class DispenseModule { }
