import { Resolver, Query, Args } from '@nestjs/graphql';
import { TapService } from '../tap.service';
import { Tap } from '../tap.model';

@Resolver(of => Tap)
export class TapQueryResolver {
    constructor(
        private readonly tapService: TapService,
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
}
