import { Module } from '@nestjs/common';
import { TagService } from './tag.service';
import { TagResolver } from './tag.resolver';
import { PrismaService } from '../prisma/prisma.service';

@Module({
    providers: [
        TagService,
        TagResolver,
        PrismaService,
    ],
    exports: [TagService],
})
export class TagModule { }
