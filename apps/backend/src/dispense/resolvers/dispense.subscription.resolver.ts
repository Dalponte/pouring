import { Resolver, Subscription } from '@nestjs/graphql';
import { Dispense } from '../dispense.model';
import { Inject } from '@nestjs/common';
import { PubSub } from 'graphql-subscriptions';
import { OnEvent } from '@nestjs/event-emitter';

@Resolver(of => Dispense)
export class DispenseSubscriptionResolver {
    constructor(
        @Inject('PUB_SUB') private readonly pubSub: PubSub,
    ) { }

    @OnEvent('dispense.created')
    handleDispenseCreatedEvent(dispense: Dispense) {
        this.pubSub.publish('dispenseAdded', { dispenseAdded: dispense });
    }

    @Subscription(returns => Dispense)
    dispenseAdded() {
        return this.pubSub.asyncIterableIterator('dispenseAdded');
    }
}
