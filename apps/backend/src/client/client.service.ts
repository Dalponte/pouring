import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { Client } from './client.model';
import { CreateClientInput } from './dto/create-client.input';
import { UpdateClientInput } from './dto/update-client.input';

@Injectable()
export class ClientService {
    constructor(private prisma: PrismaService) { }

    async getClient(id: string, includeDeleted: boolean = false): Promise<Client | null> {
        const where = { id };
        if (!includeDeleted) {
            Object.assign(where, { deletedAt: null });
        }

        const result = await this.prisma.client.findFirst({
            where,
            include: { tags: true }
        });

        return result as Client | null;
    }

    async getAllClients(includeDeleted: boolean = false): Promise<Client[]> {
        const where = includeDeleted ? {} : { deletedAt: null };

        const results = await this.prisma.client.findMany({
            where,
            include: { tags: true }
        });

        return results as Client[];
    }

    async createClient(createClientInput: CreateClientInput): Promise<Client> {
        const { name, meta = {} } = createClientInput;

        const result = await this.prisma.client.create({
            data: {
                name,
                meta: meta || {},
            },
        });

        return result as Client;
    }

    async updateClient(id: string, updateClientInput: UpdateClientInput): Promise<Client> {
        // First check if client exists and isn't deleted
        const existingClient = await this.getClient(id);

        if (!existingClient) {
            throw new Error(`Client with ID ${id} not found or is deleted`);
        }

        const result = await this.prisma.client.update({
            where: { id },
            data: updateClientInput,
        });

        return result as Client;
    }

    async softDeleteClient(id: string): Promise<Client> {
        // Check if client exists and isn't already deleted
        const existingClient = await this.getClient(id);

        if (!existingClient) {
            throw new Error(`Client with ID ${id} not found or is already deleted`);
        }

        const result = await this.prisma.client.update({
            where: { id },
            data: { deletedAt: new Date() },
        });

        return result as Client;
    }

    async addTagToClient(clientId: string, tagId: number): Promise<Client> {
        const client = await this.getClient(clientId);
        if (!client) {
            throw new Error(`Client with ID ${clientId} not found or is deleted`);
        }

        return this.prisma.client.update({
            where: { id: clientId },
            data: {
                tags: {
                    connect: { id: tagId }
                }
            },
            include: { tags: true }
        }) as unknown as Client;
    }

    async removeTagFromClient(clientId: string, tagId: number): Promise<Client> {
        const client = await this.getClient(clientId);
        if (!client) {
            throw new Error(`Client with ID ${clientId} not found or is deleted`);
        }

        return this.prisma.client.update({
            where: { id: clientId },
            data: {
                tags: {
                    disconnect: { id: tagId }
                }
            },
            include: { tags: true }
        }) as unknown as Client;
    }
}
