import { Resolver, Mutation, Args } from '@nestjs/graphql';
import { TapService } from '../tap.service';
import { Tap } from '../tap.model';
import { Inject } from '@nestjs/common';
import { PubSub } from 'graphql-subscriptions';
import { CreateTapInput } from '../dto/create-tap.input';
import { UpdateTapInput } from '../dto/update-tap.input';

@Resolver(of => Tap)
export class TapMutationResolver {
    constructor(
        private readonly tapService: TapService,
        @Inject('PUB_SUB') private readonly pubSub: PubSub,
    ) { }

    @Mutation(returns => Tap)
    async createTap(
        @Args('createTapInput') createTapInput: CreateTapInput,
    ): Promise<Tap> {
        const newTap = await this.tapService.createTap(createTapInput);
        this.pubSub.publish('tapAdded', { tapAdded: newTap });
        return newTap;
    }

    @Mutation(returns => Tap)
    async updateTap(
        @Args('id') id: string,
        @Args('updateTapInput') updateTapInput: UpdateTapInput,
    ): Promise<Tap> {
        const updatedTap = await this.tapService.updateTap(id, updateTapInput);
        this.pubSub.publish('tapUpdated', { tapUpdated: updatedTap });
        return updatedTap;
    }

    @Mutation(returns => Tap)
    async softDeleteTap(@Args('id') id: string): Promise<Tap> {
        const deletedTap = await this.tapService.softDeleteTap(id);
        this.pubSub.publish('tapDeleted', { tapDeleted: deletedTap });
        return deletedTap;
    }

    @Mutation(returns => Tap)
    async restoreTap(@Args('id') id: string): Promise<Tap> {
        const restoredTap = await this.tapService.restoreTap(id);
        this.pubSub.publish('tapRestored', { tapRestored: restoredTap });
        return restoredTap;
    }

    @Mutation(returns => Tap)
    async hardDeleteTap(@Args('id') id: string): Promise<Tap> {
        const permanentlyDeletedTap = await this.tapService.hardDeleteTap(id);
        this.pubSub.publish('tapHardDeleted', { tapHardDeleted: permanentlyDeletedTap });
        return permanentlyDeletedTap;
    }
}
