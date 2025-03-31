import { Resolver, Mutation, Args, Int } from '@nestjs/graphql';
import { TagService } from '../tag.service';
import { Tag } from '../tag.model';
import { CreateTagInput } from '../dto/create-tag.input';
import { UpdateTagInput } from '../dto/update-tag.input';

@Resolver(of => Tag)
export class TagMutationResolver {
    constructor(
        private readonly tagService: TagService,
    ) { }

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

    @Mutation(returns => Tag)
    async addClientToTag(
        @Args('tagId', { type: () => Int }) tagId: number,
        @Args('clientId') clientId: string,
    ): Promise<Tag> {
        return this.tagService.addClientToTag(tagId, clientId);
    }

    @Mutation(returns => Tag)
    async removeClientFromTag(
        @Args('tagId', { type: () => Int }) tagId: number,
        @Args('clientId') clientId: string,
    ): Promise<Tag> {
        return this.tagService.removeClientFromTag(tagId, clientId);
    }
}
