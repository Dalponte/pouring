import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { Dispense } from './dispense.model';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { Prisma } from '@prisma/client';
import { CreateDispenseInput } from './dto/create-dispense.input';

@Injectable()
export class DispenseService {
    constructor(
        private prisma: PrismaService,
        private eventEmitter: EventEmitter2
    ) { }

    async getDispense(id: number): Promise<Dispense | null> {
        const result = await this.prisma.dispense.findUnique({
            where: { id },
            include: { tap: true, client: true }
        });

        return result as Dispense | null;
    }

    async getAllDispenses(): Promise<Dispense[]> {
        const results = await this.prisma.dispense.findMany({
            include: { tap: true, client: true }
        });

        return results as Dispense[];
    }

    async createDispense(createDispenseInput: CreateDispenseInput): Promise<Dispense> {
        const { type, meta, tapId, clientId } = createDispenseInput;

        const data: Prisma.DispenseCreateInput = {
            type,
            meta,
            ...(tapId && {
                tap: {
                    connect: { id: tapId }
                }
            }),
            ...(clientId && {
                client: {
                    connect: { id: clientId }
                }
            })
        };

        const result = await this.prisma.dispense.create({
            data,
            include: { tap: true, client: true }
        });

        const dispense = result as Dispense;
        this.eventEmitter.emit('dispense.created', dispense);
        return dispense;
    }
}
