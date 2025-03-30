import { Resolver, Query, Mutation, Args, Subscription } from '@nestjs/graphql';
import { PubSub } from 'graphql-subscriptions';
import { TapService } from './tap.service';
import { Tap } from './tap.model';
import { GraphQLJSON } from 'graphql-type-json';
import { Inject } from '@nestjs/common';

@Resolver(of => Tap)
export class TapResolver {
    constructor(
        private readonly tapService: TapService,
        @Inject('PUB_SUB') private readonly pubSub: PubSub,
    ) { }

    @Query(returns => Tap)
    async getTap(
        @Args('id') id: string,
        @Args('includeDeleted', { nullable: true }) includeDeleted?: boolean
    ): Promise<Tap | null> {
        return this.tapService.getTap(id, includeDeleted);
    }

    @Query(returns => [Tap])
    async getTaps(
        @Args('includeDeleted', { nullable: true }) includeDeleted?: boolean
    ): Promise<Tap[]> {
        return this.tapService.getAllTaps(includeDeleted);
    }

    @Mutation(returns => Tap)
    async createTap(
        @Args('name') name: string,
        @Args('meta', { type: () => GraphQLJSON, nullable: true }) meta: any = {},
    ): Promise<Tap> {
        const newTap = await this.tapService.createTap({ name, meta });
        this.pubSub.publish('tapAdded', { tapAdded: newTap });
        return newTap;
    }

    @Mutation(returns => Tap)
    async updateTap(
        @Args('id') id: string,
        @Args('name', { nullable: true }) name?: string,
        @Args('meta', { type: () => GraphQLJSON, nullable: true }) meta?: any,
    ): Promise<Tap> {
        const updatedTap = await this.tapService.updateTap(id, { name, meta });
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
