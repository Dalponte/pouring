import { Module } from '@nestjs/common';
import { ClientService } from './client.service';
import { ClientResolver } from './client.resolver';
import { PrismaService } from '../prisma/prisma.service';

@Module({
    providers: [
        ClientService,
        ClientResolver,
        PrismaService,
    ],
    exports: [ClientService],
})
export class ClientModule { }
