import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { Tag } from './tag.model';
import { CreateTagInput } from './dto/create-tag.input';
import { UpdateTagInput } from './dto/update-tag.input';

@Injectable()
export class TagService {
    constructor(private prisma: PrismaService) { }

    async getTag(id: number, includeDeleted: boolean = false): Promise<Tag | null> {
        const where = { id };
        if (!includeDeleted) {
            // Only show non-deleted tags (where deletedAt is null)
            Object.assign(where, { deletedAt: null });
        }

        const result = await this.prisma.tag.findFirst({
            where,
            include: { clients: true }
        });

        return result as Tag | null;
    }

    async getAllTags(includeDeleted: boolean = false): Promise<Tag[]> {
        // Filter out deleted tags unless includeDeleted is true
        const where = includeDeleted ? {} : { deletedAt: null };

        const results = await this.prisma.tag.findMany({
            where,
            include: { clients: true }
        });

        return results as Tag[];
    }

    async createTag(createTagInput: CreateTagInput): Promise<Tag> {
        const { code, reference, meta = {} } = createTagInput;

        const result = await this.prisma.tag.create({
            data: {
                code,
                reference,
                meta: meta || {},
            },
        });

        return result as Tag;
    }

    async updateTag(id: number, updateTagInput: UpdateTagInput): Promise<Tag> {
        // First check if tag exists and isn't deleted
        const existingTag = await this.getTag(id);

        if (!existingTag) {
            throw new Error(`Tag with ID ${id} not found or is deleted`);
        }

        const result = await this.prisma.tag.update({
            where: { id },
            data: updateTagInput,
        });

        return result as Tag;
    }

    async softDeleteTag(id: number): Promise<Tag> {
        // Check if tag exists and isn't already deleted
        const existingTag = await this.getTag(id);

        if (!existingTag) {
            throw new Error(`Tag with ID ${id} not found or is already deleted`);
        }

        const result = await this.prisma.tag.update({
            where: { id },
            data: { deletedAt: new Date() }, // Set deletedAt to current timestamp
        });

        return result as Tag;
    }

    async addClientToTag(tagId: number, clientId: string): Promise<Tag> {
        const tag = await this.getTag(tagId);
        if (!tag) {
            throw new Error(`Tag with ID ${tagId} not found or is deleted`);
        }

        return this.prisma.tag.update({
            where: { id: tagId },
            data: {
                clients: {
                    connect: { id: clientId }
                }
            },
            include: { clients: true }
        }) as unknown as Tag;
    }

    async removeClientFromTag(tagId: number, clientId: string): Promise<Tag> {
        const tag = await this.getTag(tagId);
        if (!tag) {
            throw new Error(`Tag with ID ${tagId} not found or is deleted`);
        }

        return this.prisma.tag.update({
            where: { id: tagId },
            data: {
                clients: {
                    disconnect: { id: clientId }
                }
            },
            include: { clients: true }
        }) as unknown as Tag;
    }
}
