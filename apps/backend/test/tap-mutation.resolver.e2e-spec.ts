import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from '../src/app.module';
import { PrismaService } from '../src/prisma/prisma.service';
import { CreateTapInput } from '../src/tap/dto/create-tap.input';
import { UpdateTapInput } from '../src/tap/dto/update-tap.input';

describe('TapMutationResolver (e2e)', () => {
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

    it('should create a new tap', async () => {
        const createTapInput: CreateTapInput = {
            name: 'New Tap',
            meta: { location: 'Outside', type: 'Beer' }
        };

        const mutation = `
      mutation CreateTap($input: CreateTapInput!) {
        createTap(createTapInput: $input) {
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
                query: mutation,
                variables: { input: createTapInput }
            })
            .expect(200);

        expect(response.body.data.createTap).toBeDefined();
        expect(response.body.data.createTap.name).toBe(createTapInput.name);
        expect(response.body.data.createTap.meta).toEqual(createTapInput.meta);
        expect(response.body.data.createTap.deleted).toBe(false);

        // Verify tap was actually created in database
        const tapId = response.body.data.createTap.id;
        const savedTap = await prismaService.tap.findUnique({
            where: { id: tapId }
        });
        expect(savedTap).toBeDefined();
        expect(savedTap?.name).toBe(createTapInput.name);
    });

    it('should update a tap', async () => {
        // Create a tap to update
        const tap = await prismaService.tap.create({
            data: {
                name: 'Old Name',
                meta: { location: 'Old Location' }
            }
        });

        const updateTapInput: UpdateTapInput = {
            name: 'Updated Name',
            meta: { location: 'New Location' }
        };

        const mutation = `
      mutation UpdateTap($id: String!, $input: UpdateTapInput!) {
        updateTap(
          id: $id,
          updateTapInput: $input
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
            .send({
                query: mutation,
                variables: {
                    id: tap.id,
                    input: updateTapInput
                }
            })
            .expect(200);

        expect(response.body.data.updateTap).toBeDefined();
        expect(response.body.data.updateTap.id).toBe(tap.id);
        expect(response.body.data.updateTap.name).toBe(updateTapInput.name);
        expect(response.body.data.updateTap.meta).toEqual(updateTapInput.meta);
    });

    it('should soft delete a tap', async () => {
        const tap = await prismaService.tap.create({
            data: {
                name: 'To Be Deleted',
                meta: { location: 'Storage' }
            }
        });

        const mutation = `
      mutation SoftDeleteTap($id: String!) {
        softDeleteTap(id: $id) {
          id
          name
          deleted
        }
      }
    `;

        const response = await request(app.getHttpServer())
            .post('/graphql')
            .send({
                query: mutation,
                variables: { id: tap.id }
            })
            .expect(200);

        expect(response.body.data.softDeleteTap).toBeDefined();
        expect(response.body.data.softDeleteTap.id).toBe(tap.id);
        expect(response.body.data.softDeleteTap.deleted).toBe(true);

        // Verify that the tap is marked as deleted in database
        const deletedTap = await prismaService.tap.findUnique({
            where: { id: tap.id }
        });
        expect(deletedTap?.deleted).toBe(true);
    });

    it('should restore a soft-deleted tap', async () => {
        const tap = await prismaService.tap.create({
            data: {
                name: 'Deleted Tap',
                meta: { location: 'Basement' },
                deleted: true
            }
        });

        const mutation = `
      mutation RestoreTap($id: String!) {
        restoreTap(id: $id) {
          id
          name
          deleted
        }
      }
    `;

        const response = await request(app.getHttpServer())
            .post('/graphql')
            .send({
                query: mutation,
                variables: { id: tap.id }
            })
            .expect(200);

        expect(response.body.data.restoreTap).toBeDefined();
        expect(response.body.data.restoreTap.id).toBe(tap.id);
        expect(response.body.data.restoreTap.deleted).toBe(false);

        // Verify that the tap is restored in database
        const restoredTap = await prismaService.tap.findUnique({
            where: { id: tap.id }
        });
        expect(restoredTap?.deleted).toBe(false);
    });

    it('should hard delete a tap', async () => {
        const tap = await prismaService.tap.create({
            data: {
                name: 'To Be Permanently Deleted',
                meta: { location: 'Test Area' }
            }
        });

        const mutation = `
      mutation HardDeleteTap($id: String!) {
        hardDeleteTap(id: $id) {
          id
          name
        }
      }
    `;

        await request(app.getHttpServer())
            .post('/graphql')
            .send({
                query: mutation,
                variables: { id: tap.id }
            })
            .expect(200);

        // Verify that the tap is actually gone from the database
        const verifyTap = await prismaService.tap.findUnique({
            where: { id: tap.id }
        });

        expect(verifyTap).toBeNull();
    });

    it('should partially update a tap with only name', async () => {
        const tap = await prismaService.tap.create({
            data: {
                name: 'Original Name',
                meta: { location: 'Original Location' }
            }
        });

        const partialUpdateInput: Partial<UpdateTapInput> = {
            name: 'Only Name Updated'
        };

        const mutation = `
      mutation UpdateTapPartial($id: String!, $input: UpdateTapInput!) {
        updateTap(
          id: $id,
          updateTapInput: $input
        ) {
          id
          name
          meta
        }
      }
    `;

        const response = await request(app.getHttpServer())
            .post('/graphql')
            .send({
                query: mutation,
                variables: {
                    id: tap.id,
                    input: partialUpdateInput
                }
            })
            .expect(200);

        expect(response.body.data.updateTap.name).toBe(partialUpdateInput.name);
        // Meta should remain unchanged
        expect(response.body.data.updateTap.meta).toEqual({ location: 'Original Location' });
    });
});
