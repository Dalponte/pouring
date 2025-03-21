import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { Tap } from './tap.model';
import { CreateTapInput } from './dto/create-tap.input';
import { UpdateTapInput } from './dto/update-tap.input';
import { Prisma } from '@prisma/client';

@Injectable()
export class TapService {
    constructor(private prisma: PrismaService) { }

    async getTap(id: string, includeDeleted: boolean = false): Promise<Tap | null> {
        const where = { id };
        if (!includeDeleted) {
            Object.assign(where, { deleted: false });
        }

        const result = await this.prisma.tap.findFirst({
            where,
            include: { dispenses: true }
        });

        return result as Tap | null;
    }

    async getAllTaps(includeDeleted: boolean = false): Promise<Tap[]> {
        const where = includeDeleted ? {} : { deleted: false };

        const results = await this.prisma.tap.findMany({
            where,
            include: { dispenses: true }
        });

        return results as Tap[];
    }

    async createTap(createTapInput: CreateTapInput): Promise<Tap> {
        const result = await this.prisma.tap.create({
            data: createTapInput,
            include: { dispenses: true }
        });

        return result as Tap;
    }

    async updateTap(id: string, updateTapInput: UpdateTapInput): Promise<Tap> {
        const result = await this.prisma.tap.update({
            where: { id },
            data: updateTapInput,
            include: { dispenses: true }
        });

        return result as Tap;
    }

    async softDeleteTap(id: string): Promise<Tap> {
        const result = await this.prisma.tap.update({
            where: { id },
            data: { deleted: true },
            include: { dispenses: true }
        });

        return result as Tap;
    }

    async restoreTap(id: string): Promise<Tap> {
        const result = await this.prisma.tap.update({
            where: { id },
            data: { deleted: false },
            include: { dispenses: true }
        });

        return result as Tap;
    }

    async hardDeleteTap(id: string): Promise<Tap> {
        const result = await this.prisma.tap.delete({
            where: { id },
            include: { dispenses: true }
        });

        return result as Tap;
    }
}
