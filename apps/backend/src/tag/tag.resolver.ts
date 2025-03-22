import { Resolver, Query, Mutation, Args, Int } from '@nestjs/graphql';
import { TagService } from './tag.service';
import { Tag } from './tag.model';
import { CreateTagInput } from './dto/create-tag.input';
import { UpdateTagInput } from './dto/update-tag.input';

@Resolver(of => Tag)
export class TagResolver {
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

    @Mutation(returns => Tag)
    async createTag(
        @Args('createTagInput') createTagInput: CreateTagInput,
    ): Promise<Tag> {
        return this.tagService.createTag(createTagInput);
    }

    @Mutation(returns => Tag)
    async updateTag(
        @Args('id', { type: () => Int }) id: number,
        @Args('updateTagInput') updateTagInput: UpdateTagInput,
    ): Promise<Tag> {
        return this.tagService.updateTag(id, updateTagInput);
    }

    @Mutation(returns => Tag)
    async deleteTag(@Args('id', { type: () => Int }) id: number): Promise<Tag> {
        return this.tagService.softDeleteTag(id);
    }
}
