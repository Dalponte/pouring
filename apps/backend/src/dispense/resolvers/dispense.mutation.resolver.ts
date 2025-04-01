import { Resolver, Mutation, Args } from '@nestjs/graphql';
import { DispenseService } from '../dispense.service';
import { Dispense } from '../dispense.model';
import { Inject } from '@nestjs/common';
import { PubSub } from 'graphql-subscriptions';
import { CreateDispenseInput } from '../dto/create-dispense.input';

import { registerEnumType } from '@nestjs/graphql';
import { DispenseType } from '@prisma/client';

registerEnumType(DispenseType, {
    name: 'DispenseType',
});

@Resolver(of => Dispense)
export class DispenseMutationResolver {
    constructor(
        private readonly dispenseService: DispenseService,
        @Inject('PUB_SUB') private readonly pubSub: PubSub,
    ) { }

    @Mutation(returns => Dispense)
    async createDispense(
        @Args('createDispenseInput') createDispenseInput: CreateDispenseInput
    ): Promise<Dispense> {
        const newDispense = await this.dispenseService.createDispense(createDispenseInput);
        this.pubSub.publish('dispenseAdded', { dispenseAdded: newDispense });
        return newDispense;
    }
}
