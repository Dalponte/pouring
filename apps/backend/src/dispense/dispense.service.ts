import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { Prisma, Dispense } from '@prisma/client';

@Injectable()
export class DispenseService {
    constructor(private prisma: PrismaService) { }

    async createDispense(data: Prisma.DispenseCreateInput): Promise<Dispense> {
        return this.prisma.dispense.create({ data });
    }

    async getDispense(id: number): Promise<Dispense | null> {
        return this.prisma.dispense.findUnique({ where: { id } });
    }

    async getAllDispenses(): Promise<Dispense[]> {
        return this.prisma.dispense.findMany();
    }
}
