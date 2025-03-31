import { Module } from '@nestjs/common';
import { ClientService } from './client.service';
import { ClientQueryResolver } from './resolvers/client.query.resolver';
import { ClientMutationResolver } from './resolvers/client.mutation.resolver';
import { ClientSubscriptionResolver } from './resolvers/client.subscription.resolver';
import { PrismaModule } from '../prisma/prisma.module';
import { PubSub } from 'graphql-subscriptions';

@Module({
    imports: [PrismaModule],
    providers: [
        ClientService,
        ClientQueryResolver,
        ClientMutationResolver,
        ClientSubscriptionResolver,
        {
            provide: 'PUB_SUB',
            useValue: new PubSub(),
        }
    ],
    exports: [ClientService],
})
export class ClientModule { }
