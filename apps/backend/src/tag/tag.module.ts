import { Module } from '@nestjs/common';
import { TagService } from './tag.service';
import { TagQueryResolver } from './resolvers/tag.query.resolver';
import { TagMutationResolver } from './resolvers/tag.mutation.resolver';
import { PrismaModule } from '../prisma/prisma.module';

@Module({
    imports: [PrismaModule],
    providers: [TagService, TagQueryResolver, TagMutationResolver],
    exports: [TagService],
})
export class TagModule { }
