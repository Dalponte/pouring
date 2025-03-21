import { Resolver, Query, Mutation, Args, Subscription } from '@nestjs/graphql';
import { PubSub } from 'graphql-subscriptions';
import { DispenseService } from './dispense.service';
import { Dispense } from './dispense.model';
import { GraphQLJSON } from 'graphql-type-json';
import { Inject } from '@nestjs/common';
import { OnEvent } from '@nestjs/event-emitter';

@Resolver(of => Dispense)
export class DispenseResolver {
    constructor(
        private readonly dispenseService: DispenseService,
        @Inject('PUB_SUB') private readonly pubSub: PubSub,
    ) { }

    @Query(returns => Dispense)
    async getDispense(@Args('id') id: number): Promise<Dispense | null> {
        return this.dispenseService.getDispense(id);
    }

    @Query(returns => [Dispense])
    async getDispenses(): Promise<Dispense[]> {
        return this.dispenseService.getAllDispenses();
    }

    @Mutation(returns => Dispense)
    async createDispense(
        @Args('type') type: string,
        @Args('meta', { type: () => GraphQLJSON }) meta: any,
        @Args('tapId', { nullable: true }) tapId?: string,
    ): Promise<Dispense> {
        const newDispense = await this.dispenseService.createDispense({ type, meta, tapId });
        this.pubSub.publish('dispenseAdded', { dispenseAdded: newDispense });
        return newDispense;
    }

    @OnEvent('dispense.created')
    handleDispenseCreatedEvent(dispense: Dispense) {
        this.pubSub.publish('dispenseAdded', { dispenseAdded: dispense });
    }

    @Subscription(returns => Dispense)
    dispenseAdded() {
        return this.pubSub.asyncIterableIterator('dispenseAdded');
    }
}
