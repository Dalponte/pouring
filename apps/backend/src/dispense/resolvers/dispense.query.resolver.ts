import { Resolver, Query, Args } from '@nestjs/graphql';
import { DispenseService } from '../dispense.service';
import { Dispense } from '../dispense.model';

@Resolver(of => Dispense)
export class DispenseQueryResolver {
    constructor(
        private readonly dispenseService: DispenseService,
    ) { }

    @Query(returns => Dispense)
    async getDispense(@Args('id') id: number): Promise<Dispense | null> {
        return this.dispenseService.getDispense(id);
    }

    @Query(returns => [Dispense])
    async getDispenses(): Promise<Dispense[]> {
        return this.dispenseService.getAllDispenses();
    }
}
