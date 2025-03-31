import { Resolver, Query, Args, Int } from '@nestjs/graphql';
import { TagService } from '../tag.service';
import { Tag } from '../tag.model';

@Resolver(of => Tag)
export class TagQueryResolver {
    constructor(
        private readonly tagService: TagService,
    ) { }

    @Query(returns => Tag, { nullable: true })
    async getTag(@Args('id', { type: () => Int }) id: number): Promise<Tag | null> {
        return this.tagService.getTag(id);
    }

    @Query(returns => [Tag])
    async getTags(): Promise<Tag[]> {
        return this.tagService.getAllTags();
    }
}
