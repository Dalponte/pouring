import { Resolver, Mutation, Args } from '@nestjs/graphql';
import { DispenseService } from '../dispense.service';
import { Dispense } from '../dispense.model';
import { GraphQLJSON } from 'graphql-type-json';
import { Inject } from '@nestjs/common';
import { PubSub } from 'graphql-subscriptions';
import { CreateDispenseInput } from '../dto/create-dispense.input';
import { DispenseType } from '@prisma/client';

@Resolver(of => Dispense)
export class DispenseMutationResolver {
    constructor(
        private readonly dispenseService: DispenseService,
        @Inject('PUB_SUB') private readonly pubSub: PubSub,
    ) { }

    @Mutation(returns => Dispense)
    async createDispense(
        @Args('type') type: DispenseType,
        @Args('meta', { type: () => GraphQLJSON }) meta: any,
        @Args('tapId', { nullable: true }) tapId: string,
        @Args('clientId', { nullable: true }) clientId?: string,
    ): Promise<Dispense> {
        const input: CreateDispenseInput = { type, meta, tapId, clientId };
        const newDispense = await this.dispenseService.createDispense(input);
        this.pubSub.publish('dispenseAdded', { dispenseAdded: newDispense });
        return newDispense;
    }
}
