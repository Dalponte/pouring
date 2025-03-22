import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from '../src/app.module';
import { PrismaService } from '../src/prisma/prisma.service';

describe('DispenseResolver (e2e)', () => {
  let app: INestApplication;
  let prismaService: PrismaService;
  let testClient;

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
  });

  beforeEach(async () => {
    await prismaService.dispense.deleteMany({});
  });

  afterAll(async () => {
    await prismaService.dispense.deleteMany({});
    await prismaService.client.delete({
      where: { id: testClient.id }
    });
    await prismaService.$disconnect();
    await app.close();
  });

  it('should get all dispenses', async () => {
    await prismaService.dispense.createMany({
      data: [
        { type: 'beer', meta: { brand: 'Bera' }, createdAt: new Date(), clientId: testClient.id },
        { type: 'soda', meta: { brand: 'Cola' }, createdAt: new Date(), clientId: testClient.id },
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
        }
      }
    `;

    const response = await request(app.getHttpServer())
      .post('/graphql')
      .send({ query })
      .expect(200);

    expect(response.body.data.getDispenses).toBeDefined();
    expect(response.body.data.getDispenses.length).toBe(2);
    expect(response.body.data.getDispenses[0].type).toBe('beer');
    expect(response.body.data.getDispenses[0].clientId).toBe(testClient.id);
    expect(response.body.data.getDispenses[1].type).toBe('soda');
    expect(response.body.data.getDispenses[1].clientId).toBe(testClient.id);
  });

  it('should get a dispense by id', async () => {
    // Create a test dispense record
    const dispense = await prismaService.dispense.create({
      data: {
        type: 'beer',
        meta: { brand: 'Bera' },
        createdAt: new Date(),
        clientId: testClient.id
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
        }
      }
    `;

    const response = await request(app.getHttpServer())
      .post('/graphql')
      .send({ query })
      .expect(200);

    expect(response.body.data.getDispense).toBeDefined();
    expect(response.body.data.getDispense.id).toBe(dispense.id.toString());
    expect(response.body.data.getDispense.type).toBe('beer');
    expect(response.body.data.getDispense.clientId).toBe(testClient.id);
  });

  it('should create a new dispense', async () => {
    const mutation = `
      mutation {
        createDispense(
          type: "beer",
          meta: { brand: "Bera", volume: 0.5 },
          clientId: "${testClient.id}"
        ) {
          id
          type
          meta
          createdAt
          clientId
        }
      }
    `;

    const response = await request(app.getHttpServer())
      .post('/graphql')
      .send({ query: mutation })
      .expect(200);

    expect(response.body.data.createDispense).toBeDefined();
    expect(response.body.data.createDispense.type).toBe('beer');
    expect(response.body.data.createDispense.meta).toEqual({ brand: 'Bera', volume: 0.5 });
    expect(response.body.data.createDispense.clientId).toBe(testClient.id);
  });
});
