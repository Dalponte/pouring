import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from '../src/app.module';
import { PrismaService } from '../src/prisma/prisma.service';

describe('DispenseQueryResolver (e2e)', () => {
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

    it('should get all dispenses', async () => {
        await prismaService.dispense.createMany({
            data: [
                { type: 'ORDER', meta: { brand: 'Bera' }, createdAt: new Date(), clientId: testClient.id, tapId: testTap.id },
                { type: 'MAINTENANCE', meta: { brand: 'Cola' }, createdAt: new Date(), clientId: testClient.id, tapId: testTap.id },
            ],
        });

        const query = `
      query {
        getDispenses {
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
            .send({ query })
            .expect(200);

        expect(response.body.data.getDispenses).toBeDefined();
        expect(response.body.data.getDispenses.length).toBe(2);
        expect(response.body.data.getDispenses[0].type).toBe('ORDER');
        expect(response.body.data.getDispenses[0].clientId).toBe(testClient.id);
        expect(response.body.data.getDispenses[0].tapId).toBe(testTap.id);
        expect(response.body.data.getDispenses[1].type).toBe('MAINTENANCE');
        expect(response.body.data.getDispenses[1].clientId).toBe(testClient.id);
        expect(response.body.data.getDispenses[1].tapId).toBe(testTap.id);
    });

    it('should get a dispense by id', async () => {
        // Create a test dispense record
        const dispense = await prismaService.dispense.create({
            data: {
                type: 'ORDER',
                meta: { brand: 'Bera' },
                createdAt: new Date(),
                clientId: testClient.id,
                tapId: testTap.id
            },
        });

        const query = `
      query {
        getDispense(id: ${dispense.id}) {
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
            .send({ query })
            .expect(200);

        expect(response.body.data.getDispense).toBeDefined();
        expect(response.body.data.getDispense.id).toBe(dispense.id.toString());
        expect(response.body.data.getDispense.type).toBe('ORDER');
        expect(response.body.data.getDispense.clientId).toBe(testClient.id);
        expect(response.body.data.getDispense.tapId).toBe(testTap.id);
    });
});
