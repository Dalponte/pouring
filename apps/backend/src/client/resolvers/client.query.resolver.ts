import { Resolver, Query, Args } from '@nestjs/graphql';
import { ClientService } from '../client.service';
import { Client } from '../client.model';

@Resolver(of => Client)
export class ClientQueryResolver {
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
}
