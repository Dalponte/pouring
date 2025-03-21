import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { Tap } from './tap.model';
import { Dispense } from '../dispense/dispense.model';

@Injectable()
export class TapService {
    constructor(private prisma: PrismaService) { }

    private mapToTapModel(data: any): Tap {
        const tap = new Tap();
        tap.id = data.id;
        tap.name = data.name;
        tap.meta = data.meta;
        tap.createdAt = data.createdAt;
        tap.updatedAt = data.updatedAt;
        tap.deleted = data.deleted;

        if (data.dispenses && Array.isArray(data.dispenses)) {
            tap.dispenses = data.dispenses.map(d => {
                const dispense = new Dispense();
                dispense.id = d.id;
                dispense.type = d.type;
                dispense.meta = d.meta;
                dispense.createdAt = d.createdAt;
                dispense.updatedAt = d.updatedAt;
                dispense.tapId = d.tapId;
                return dispense;
            });
        }

        return tap;
    }

    async getTap(id: string, includeDeleted: boolean = false): Promise<Tap | null> {
        const where = { id };
        if (!includeDeleted) {
            Object.assign(where, { deleted: false });
        }

        const result = await this.prisma.tap.findFirst({
            where,
            include: { dispenses: true }
        });

        return result ? this.mapToTapModel(result) : null;
    }

    async getAllTaps(includeDeleted: boolean = false): Promise<Tap[]> {
        const where = includeDeleted ? {} : { deleted: false };

        const results = await this.prisma.tap.findMany({
            where,
            include: { dispenses: true }
        });

        return results.map(result => this.mapToTapModel(result));
    }

    async createTap(data: { name: string, meta: any }): Promise<Tap> {
        const result = await this.prisma.tap.create({
            data,
            include: { dispenses: true }
        });

        return this.mapToTapModel(result);
    }

    async updateTap(id: string, data: { name?: string, meta?: any }): Promise<Tap> {
        const result = await this.prisma.tap.update({
            where: { id },
            data,
            include: { dispenses: true }
        });

        return this.mapToTapModel(result);
    }

    async softDeleteTap(id: string): Promise<Tap> {
        const result = await this.prisma.tap.update({
            where: { id },
            data: { deleted: true },
            include: { dispenses: true }
        });

        return this.mapToTapModel(result);
    }

    async restoreTap(id: string): Promise<Tap> {
        const result = await this.prisma.tap.update({
            where: { id },
            data: { deleted: false },
            include: { dispenses: true }
        });

        return this.mapToTapModel(result);
    }

    async hardDeleteTap(id: string): Promise<Tap> {
        const result = await this.prisma.tap.delete({
            where: { id },
            include: { dispenses: true }
        });

        return this.mapToTapModel(result);
    }
}
