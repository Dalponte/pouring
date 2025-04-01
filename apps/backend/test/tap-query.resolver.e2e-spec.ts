import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from '../src/app.module';
import { PrismaService } from '../src/prisma/prisma.service';
import { DispenseType } from '@prisma/client';

describe('TapQueryResolver (e2e)', () => {
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
        await prismaService.dispense.deleteMany({});
        await prismaService.tap.deleteMany({});
    });

    afterAll(async () => {
        await prismaService.dispense.deleteMany({});
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
      query GetTaps($includeDeleted: Boolean) {
        getTaps(includeDeleted: $includeDeleted) {
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
            .send({
                query,
                variables: {
                    includeDeleted: false
                }
            })
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
      query GetTap($id: String!, $includeDeleted: Boolean) {
        getTap(id: $id, includeDeleted: $includeDeleted) {
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
            .send({
                query,
                variables: {
                    id: tap.id,
                    includeDeleted: false
                }
            })
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

    it('should include soft-deleted taps when includeDeleted is true', async () => {
        // Create active tap
        await prismaService.tap.create({
            data: {
                name: 'Active Tap',
                meta: {}
            },
        });

        // Create deleted tap
        await prismaService.tap.create({
            data: {
                name: 'Deleted Tap',
                meta: {},
                deleted: true
            },
        });

        const query = `
      query GetTaps($includeDeleted: Boolean) {
        getTaps(includeDeleted: $includeDeleted) {
          id
          name
          deleted
        }
      }
    `;

        // First verify only active taps are returned by default
        let response = await request(app.getHttpServer())
            .post('/graphql')
            .send({
                query,
                variables: {
                    includeDeleted: false
                }
            });

        expect(response.body.data.getTaps.length).toBe(1);
        expect(response.body.data.getTaps[0].name).toBe('Active Tap');

        // Now check that deleted taps are included when requested
        response = await request(app.getHttpServer())
            .post('/graphql')
            .send({
                query,
                variables: {
                    includeDeleted: true
                }
            });

        expect(response.body.data.getTaps.length).toBe(2);
        // Find the deleted tap in results
        const deletedTap = response.body.data.getTaps.find(tap => tap.deleted);
        expect(deletedTap).toBeDefined();
        expect(deletedTap.name).toBe('Deleted Tap');
    });
});
