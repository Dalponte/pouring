import { Resolver, Subscription } from '@nestjs/graphql';
import { Client } from '../client.model';
import { Inject } from '@nestjs/common';
import { PubSub } from 'graphql-subscriptions';

@Resolver(of => Client)
export class ClientSubscriptionResolver {
    constructor(
        @Inject('PUB_SUB') private readonly pubSub: PubSub,
    ) { }

    @Subscription(returns => Client)
    clientDeleted() {
        return this.pubSub.asyncIterableIterator('clientDeleted');
    }
}
