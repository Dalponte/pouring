import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from '../src/app.module';
import { PrismaService } from '../src/prisma/prisma.service';
import { CreateDispenseInput } from '../src/dispense/dto/create-dispense.input';
import { DispenseType } from '@prisma/client';

describe('DispenseMutationResolver (e2e)', () => {
    let app: INestApplication;
    let prismaService: PrismaService;
    let testClient;
    let testTap;

    beforeAll(async () => {
        const moduleFixture: TestingModule = await Test.createTestingModule({
            imports: [AppModule],
        }).compile();

        app = moduleFixture.createNestApplication();
        prismaService = moduleFixture.get<PrismaService>(PrismaService);
        await app.init();

        // Create a test client to use in tests
        testClient = await prismaService.client.create({
            data: {
                name: 'Test Client',
                meta: { type: 'test' }
            }
        });

        // Create a test tap to use in tests
        testTap = await prismaService.tap.create({
            data: {
                name: 'Test Tap',
                meta: { location: 'test' }
            }
        });
    });

    beforeEach(async () => {
        await prismaService.dispense.deleteMany({});
    });

    afterAll(async () => {
        await prismaService.dispense.deleteMany({});
        await prismaService.client.delete({
            where: { id: testClient.id }
        });
        await prismaService.tap.delete({
            where: { id: testTap.id }
        });
        await prismaService.$disconnect();
        await app.close();
    });

    it('should create a new dispense', async () => {
        const createDispenseInput: CreateDispenseInput = {
            type: DispenseType.ORDER,
            meta: { brand: "Bera", volume: 0.5 },
            clientId: testClient.id,
            tapId: testTap.id
        };

        const mutation = `
      mutation CreateDispense($input: CreateDispenseInput!) {
        createDispense(createDispenseInput: $input) {
          id
          type
          meta
          createdAt
          clientId
          tapId
        }
      }
    `;

        const response = await request(app.getHttpServer())
            .post('/graphql')
            .send({
                query: mutation,
                variables: { input: createDispenseInput }
            })
            .expect(200);

        expect(response.body.data.createDispense).toBeDefined();
        expect(response.body.data.createDispense.type).toBe(createDispenseInput.type);
        expect(response.body.data.createDispense.meta).toEqual(createDispenseInput.meta);
        expect(response.body.data.createDispense.clientId).toBe(createDispenseInput.clientId);
        expect(response.body.data.createDispense.tapId).toBe(createDispenseInput.tapId);
    });
});
