import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from '../src/app.module';
import { PrismaService } from '../src/prisma/prisma.service';
import { DispenseType } from '@prisma/client';

describe('TapResolver (e2e)', () => {
  let app: INestApplication;
  let prismaService: PrismaService;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    prismaService = moduleFixture.get<PrismaService>(PrismaService);
    await app.init();
  });

  beforeEach(async () => {
    await prismaService.tap.deleteMany({});
  });

  afterAll(async () => {
    await prismaService.tap.deleteMany({});
    await prismaService.$disconnect();
    await app.close();
  });

  it('should get all taps', async () => {
    await prismaService.tap.createMany({
      data: [
        { name: 'Tap 1', meta: { location: 'Bar Corner' } },
        { name: 'Tap 2', meta: { location: 'Kitchen' } },
      ],
    });

    const query = `
      query {
        getTaps {
          id
          name
          meta
          createdAt
          deleted
        }
      }
    `;

    const response = await request(app.getHttpServer())
      .post('/graphql')
      .send({ query })
      .expect(200);

    expect(response.body.data.getTaps).toBeDefined();
    expect(response.body.data.getTaps.length).toBe(2);
    expect(response.body.data.getTaps[0].name).toBe('Tap 1');
    expect(response.body.data.getTaps[1].name).toBe('Tap 2');
  });

  it('should get a tap by id', async () => {
    // Create a tap
    const tap = await prismaService.tap.create({
      data: {
        name: 'Test Tap',
        meta: { location: 'Bar Corner' },
      },
    });

    // Create some dispenses associated with this tap
    await prismaService.dispense.createMany({
      data: [
        {
          type: DispenseType.AUTO_SERVICE,
          meta: { brand: 'Bera', volume: 0.5 },
          tapId: tap.id,
          createdAt: new Date()
        },
        {
          type: DispenseType.ORDER,
          meta: { brand: 'Cola', volume: 0.33 },
          tapId: tap.id,
          createdAt: new Date()
        },
      ],
    });

    const query = `
      query {
        getTap(id: "${tap.id}") {
          id
          name
          meta
          createdAt
          deleted
          dispenses {
            id
            type
            meta
            createdAt
          }
        }
      }
    `;

    const response = await request(app.getHttpServer())
      .post('/graphql')
      .send({ query })
      .expect(200);

    expect(response.body.data.getTap).toBeDefined();
    expect(response.body.data.getTap.id).toBe(tap.id);
    expect(response.body.data.getTap.name).toBe('Test Tap');
    expect(response.body.data.getTap.deleted).toBe(false);
    expect(response.body.data.getTap.dispenses).toBeDefined();
    expect(response.body.data.getTap.dispenses.length).toBe(2);
    expect(response.body.data.getTap.dispenses[0].type).toBe(DispenseType.AUTO_SERVICE);
    expect(response.body.data.getTap.dispenses[1].type).toBe(DispenseType.ORDER);
  });

  it('should create a new tap', async () => {
    const mutation = `
      mutation {
        createTap(
          name: "New Tap",
          meta: { location: "Outside", type: "Beer" }
        ) {
          id
          name
          meta
          createdAt
          deleted
        }
      }
    `;

    const response = await request(app.getHttpServer())
      .post('/graphql')
      .send({ query: mutation })
      .expect(200);

    expect(response.body.data.createTap).toBeDefined();
    expect(response.body.data.createTap.name).toBe('New Tap');
    expect(response.body.data.createTap.meta).toEqual({ location: 'Outside', type: 'Beer' });
    expect(response.body.data.createTap.deleted).toBe(false);
  });

  it('should update a tap', async () => {
    const tap = await prismaService.tap.create({
      data: {
        name: 'Old Name',
        meta: { location: 'Old Location' },
      },
    });

    const mutation = `
      mutation {
        updateTap(
          id: "${tap.id}",
          name: "Updated Name",
          meta: { location: "New Location" }
        ) {
          id
          name
          meta
          createdAt
          deleted
        }
      }
    `;

    const response = await request(app.getHttpServer())
      .post('/graphql')
      .send({ query: mutation })
      .expect(200);

    expect(response.body.data.updateTap).toBeDefined();
    expect(response.body.data.updateTap.id).toBe(tap.id);
    expect(response.body.data.updateTap.name).toBe('Updated Name');
    expect(response.body.data.updateTap.meta).toEqual({ location: 'New Location' });
  });

  it('should soft delete a tap', async () => {
    const tap = await prismaService.tap.create({
      data: {
        name: 'To Be Deleted',
        meta: { location: 'Storage' },
      },
    });

    const mutation = `
      mutation {
        softDeleteTap(id: "${tap.id}") {
          id
          name
          deleted
        }
      }
    `;

    const response = await request(app.getHttpServer())
      .post('/graphql')
      .send({ query: mutation })
      .expect(200);

    expect(response.body.data.softDeleteTap).toBeDefined();
    expect(response.body.data.softDeleteTap.id).toBe(tap.id);
    expect(response.body.data.softDeleteTap.deleted).toBe(true);

    // Verify that soft deleted tap is not returned by default
    const getQuery = `
      query {
        getTaps {
          id
          name
        }
      }
    `;

    const getResponse = await request(app.getHttpServer())
      .post('/graphql')
      .send({ query: getQuery })
      .expect(200);

    expect(getResponse.body.data.getTaps.length).toBe(0);
  });

  it('should restore a soft-deleted tap', async () => {
    const tap = await prismaService.tap.create({
      data: {
        name: 'Deleted Tap',
        meta: { location: 'Basement' },
        deleted: true,
      },
    });

    const mutation = `
      mutation {
        restoreTap(id: "${tap.id}") {
          id
          name
          deleted
        }
      }
    `;

    const response = await request(app.getHttpServer())
      .post('/graphql')
      .send({ query: mutation })
      .expect(200);

    expect(response.body.data.restoreTap).toBeDefined();
    expect(response.body.data.restoreTap.id).toBe(tap.id);
    expect(response.body.data.restoreTap.deleted).toBe(false);
  });

  it('should hard delete a tap', async () => {
    const tap = await prismaService.tap.create({
      data: {
        name: 'To Be Permanently Deleted',
        meta: { location: 'Test Area' },
      },
    });

    const mutation = `
      mutation {
        hardDeleteTap(id: "${tap.id}") {
          id
          name
        }
      }
    `;

    await request(app.getHttpServer())
      .post('/graphql')
      .send({ query: mutation })
      .expect(200);

    // Verify that the tap is actually gone from the database
    const verifyTap = await prismaService.tap.findUnique({
      where: { id: tap.id },
    });

    expect(verifyTap).toBeNull();
  });
});
