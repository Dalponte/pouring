import { Resolver, Subscription } from '@nestjs/graphql';
import { Tap } from '../tap.model';
import { Inject } from '@nestjs/common';
import { PubSub } from 'graphql-subscriptions';

@Resolver(of => Tap)
export class TapSubscriptionResolver {
    constructor(
        @Inject('PUB_SUB') private readonly pubSub: PubSub,
    ) { }

    @Subscription(returns => Tap)
    tapAdded() {
        return this.pubSub.asyncIterableIterator('tapAdded');
    }

    @Subscription(returns => Tap)
    tapUpdated() {
        return this.pubSub.asyncIterableIterator('tapUpdated');
    }

    @Subscription(returns => Tap)
    tapDeleted() {
        return this.pubSub.asyncIterableIterator('tapDeleted');
    }

    @Subscription(returns => Tap)
    tapRestored() {
        return this.pubSub.asyncIterableIterator('tapRestored');
    }

    @Subscription(returns => Tap)
    tapHardDeleted() {
        return this.pubSub.asyncIterableIterator('tapHardDeleted');
    }
}
