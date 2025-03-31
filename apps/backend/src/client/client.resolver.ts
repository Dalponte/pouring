import { Resolver, Query, Mutation, Args, Int, Subscription } from '@nestjs/graphql';
import { ClientService } from './client.service';
import { Client } from './client.model';
import { CreateClientInput } from './dto/create-client.input';
import { UpdateClientInput } from './dto/update-client.input';
import { PubSub } from 'graphql-subscriptions';

const pubSub = new PubSub();

@Resolver(of => Client)
export class ClientResolver {
    constructor(
        private readonly clientService: ClientService,
    ) { }

    @Query(returns => Client, { nullable: true })
    async getClient(@Args('id') id: string): Promise<Client | null> {
        return this.clientService.getClient(id);
    }

    @Query(returns => [Client])
    async getClients(): Promise<Client[]> {
        return this.clientService.getAllClients();
    }

    @Mutation(returns => Client)
    async createClient(
        @Args('createClientInput') createClientInput: CreateClientInput,
    ): Promise<Client> {
        return this.clientService.createClient(createClientInput);
    }

    @Mutation(returns => Client)
    async updateClient(
        @Args('id') id: string,
        @Args('updateClientInput') updateClientInput: UpdateClientInput,
    ): Promise<Client> {
        return this.clientService.updateClient(id, updateClientInput);
    }

    @Mutation(returns => Client)
    async deleteClient(@Args('id') id: string): Promise<Client> {
        const deletedClient = await this.clientService.softDeleteClient(id);
        pubSub.publish('clientDeleted', { clientDeleted: deletedClient });
        return deletedClient;
    }

    @Mutation(returns => Client)
    async addTagToClientByCode(
        @Args('clientId') clientId: string,
        @Args('code') code: string,
    ): Promise<Client> {
        return this.clientService.addTagToClientByCode(clientId, code);
    }

    @Mutation(returns => Client)
    async removeTagFromClientByCode(
        @Args('clientId') clientId: string,
        @Args('code') code: string,
    ): Promise<Client> {
        return this.clientService.removeTagFromClientByCode(clientId, code);
    }

    @Subscription(returns => Client)
    clientDeleted() {
        return pubSub.asyncIterableIterator('clientDeleted');
    }
}
